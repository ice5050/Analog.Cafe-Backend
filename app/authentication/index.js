const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const TwitterStrategy = require('passport-twitter').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const WebSocket = require('ws')
const User = require('../../models/mongo/user.js')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const authApp = express()
const jwtOptions = {}
const { sendMail, sendVerifyEmail } = require('../../helpers/mailer')
const {
  sanitizeUsername,
  rand5digit,
  getProfileImageURL
} = require('../../helpers/authenticate')

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
    res.json({ status: 'ok', info: req.user.toObject() })
  }
)

function setupPassport () {
  // Setup Twitter Strategy
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_KEY,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL
      },
      async (token, tokenSecret, profile, cb) => {
        console.log(profile._json.profile_image_url)
        const username = sanitizeUsername(profile.username)
        const profileImageURL =
          profile._json &&
          profile._json.profile_image_url &&
          getProfileImageURL(profile._json.profile_image_url)
        let user = await User.findOne({ twitterId: profile.id })
        if (!user) {
          user = await User.create({
            twitterId: profile.id,
            id: username,
            title: profile.displayName,
            image: profileImageURL
          })
        }
        cb(null, user)
      }
    )
  )

  // Setup Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      async (accessToken, refreshToken, profile, cb) => {
        let user = await User.findOne({ facebookId: profile.id })
        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            id: sanitizeUsername(profile.displayName),
            title: profile.displayName,
            email: profile.emails[0] && profile.emails[0].value,
            image: profile.photos[0] && profile.photos[0].value
          })
          sendMail({
            to: user.email,
            from: 'info@analog.cafe',
            subject: 'Welcome to Analog.Cafe',
            html: 'Welcome to Analog.Cafe'
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

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findOne({ id }).then(user => {
      done(null, user)
    })
  })
}

authApp.post('/auth/email', (req, res) => {
  let email = req.body.email
  let expired = new Date()
  expired.setMinutes(expired.getMinutes() + 10)

  User.findOne({ id: email }).exec((_, user) => {
    let verifyCode = rand5digit()
    let verifyLink =
      req.protocol +
      '://' +
      req.get('host') +
      '/auth/email/verify?code=' +
      verifyCode
    if (!user) {
      User.create(
        {
          id: email,
          email: email,
          verifyCode: verifyCode,
          expired: expired
        },
        (_, user) => {
          // send email
          sendVerifyEmail(user.email, verifyCode, verifyLink)
          res.sendStatus(200)
        }
      )
    } else {
      User.update(
        { id: user.id },
        {
          verifyCode: verifyCode,
          expired: expired
        }
      ).then(images => {
        // send email
        sendVerifyEmail(user.email, verifyCode, verifyLink)
        res.sendStatus(200)
      })
    }
  })
})

authApp.get('/auth/email/verify', (req, res) => {
  let code = req.query.code
  // check verify email code
  var verifyTime = new Date()
  User.findOne({
    verifyCode: code,
    expired: { $gt: verifyTime }
  }).exec((_, user) => {
    // sign in user and generate token
    if (user) {
      const payload = { id: user.id }
      const token = jwt.sign(payload, jwtOptions.secretOrKey)

      User.update(
        { id: user.id },
        {
          verifyCode: undefined,
          expired: undefined
        }
      ).then(images => {
        // send token to frontend
        res.redirect(process.env.ANALOG_FRONTEND_URL + '?token=' + token)
      })
    } else {
      // EXPIRED OR INVALIDCODE
      res.redirect(
        process.env.ANALOG_FRONTEND_URL + '?error=INVALID_OR_EXPIRED'
      )
    }
  })
})

module.exports = authApp
