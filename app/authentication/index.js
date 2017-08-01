const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const User = require('../../models/postgres/index.js').user
const authApp = express()
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
jwtOptions.secretOrKey = process.env.APPLICATION_SECRET

setupPassport()
authApp.get('/auth/twitter', passport.authenticate('twitter'))
authApp.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: process.env.ANALOG_FRONTEND_URL + '/sign-in' }),
  (req, res) => {
    const user = req.user
    const payload = { id: user.id }
    const token = jwt.sign(payload, jwtOptions.secretOrKey)
    res.redirect(process.env.ANALOG_FRONTEND_URL + '?token=' + token)
  }
)

authApp.get('/auth/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ data: req.user })
})

function setupPassport () {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_KEY,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL
      },
      (token, tokenSecret, profile, cb) => {
        const username = sanitizeUsername(profile.username)
        User.findOrCreate({
          where: { twitterId: profile.id },
          defaults: {
            realUsername: profile.username,
            username: username,
            name: profile.displayName,
            profilePic: profile.photos[0] && profile.photos[0].value
          }
        }).spread((user, created) => {
          cb(null, user)
        })
      }
    )
  )

  passport.use(new JwtStrategy(jwtOptions, function (jwtPayload, next) {
    console.log(jwtPayload)
    User.findById(jwtPayload.id).then(user => {
      if (user) {
        next(null, user)
      } else {
        next(null, false)
      }
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user)
    })
  })
}

function sanitizeUsername (username) {
  if (!username) return null
  return username.split('@')[0].toLowerCase().replace(/\W/g, '.')
}

module.exports = authApp
