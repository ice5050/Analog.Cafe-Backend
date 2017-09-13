const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../../models/mongo/user.js')
const authApp = express()
const WebSocket = require('ws')
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
jwtOptions.secretOrKey = process.env.APPLICATION_SECRET

const wss = new WebSocket.Server({
  port: process.env.WEBSOCKET_PORT_AUTHEN_TOKEN
})
let ws = null
wss.on('connection', _ws => {
  ws = _ws
})

setupPassport()
authApp.get('/auth/twitter', passport.authenticate('twitter'))
authApp.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter'),
  (req, res) => {
    const user = req.user
    const payload = { id: user.id }
    const token = jwt.sign(payload, jwtOptions.secretOrKey)
    if (ws) {
      ws.send(token)
    }
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from('<script>window.close();</script>'))
  }
)

authApp.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
)
authApp.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    const user = req.user
    const payload = { id: user.id }
    const token = jwt.sign(payload, jwtOptions.secretOrKey)
    if (ws) {
      ws.send(token)
    }
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from('<script>window.close();</script>'))
  }
)

authApp.get(
  '/auth/user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ data: req.user })
  }
)

function setupPassport () {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_KEY,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL
      },
      async (token, tokenSecret, profile, cb) => {
        const username = sanitizeUsername(profile.username)
        let user = await User.findOne({ twitterId: profile.id })
        if (!user) {
          user = await User.create({
            twitterId: profile.id,
            id: username,
            title: profile.displayName,
            image: profile.photos[0] && profile.photos[0].value
          })
        }
        cb(null, user)
      }
    )
  )

  passport.use(
    new JwtStrategy(jwtOptions, function (jwtPayload, next) {
      User.findOne({ id: jwtPayload.id }).then(user => {
        if (user) {
          next(null, user)
        } else {
          next(null, false)
        }
      })
    })
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:8080/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function (accessToken, refreshToken, profile, cb) {
        User.findOne({ facebookId: profile.id }).exec((_, user) => {
          if (!user) {
            const username = sanitizeUsername(profile.displayName)
            User.create(
              {
                facebookId: profile.id,
                id: username,
                title: profile.displayName,
                email: profile.emails[0] && profile.emails[0].value,
                image: profile.photos[0] && profile.photos[0].value
              },
              (_, user) => {
                cb(null, user)
              }
            )
          } else {
            cb(null, user)
          }
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findOne({ id }).then(user => {
      done(null, user)
    })
  })
}

function sanitizeUsername (username) {
  if (!username) return null
  return username
    .split('@')[0]
    .toLowerCase()
    .replace(/\W/g, '.')
}

module.exports = authApp
