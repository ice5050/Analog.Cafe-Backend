const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const TwitterStrategy = require('passport-twitter').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../../models/mongo/user.js')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const authApp = express()
const jwtOptions = {}
const welcomeEmail = require('../../helpers/mailers/welcome')
const signInEmail = require('../../helpers/mailers/sign_in')
const {
  sanitizeUsername,
  generateUserSignInURL,
  getProfileImageURL
} = require('../../helpers/authenticate')
const CODE_EXPIRED = 10 // after send verify email, code will expired (minute)
const LIMIT_EMAIL_SENDING = 1 // cannot send verify email again until (minute)

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
jwtOptions.secretOrKey = process.env.APPLICATION_SECRET

setupPassport()

authApp.get('/auth/twitter', passport.authenticate('twitter'))
authApp.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter'),
  (req, res) => {
    const user = req.user
    const payload = { id: user.id }
    const token = jwt.sign(payload, jwtOptions.secretOrKey)
    res.redirect(`${process.env.ANALOG_FRONTEND_URL}?token=${token}`)
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
    res.redirect(`${process.env.ANALOG_FRONTEND_URL}?token=${token}`)
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
          welcomeEmail(user.email, user.title)
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

authApp.post('/auth/email', async (req, res) => {
  const email = req.body.email
  let expired = new Date()
  expired.setMinutes(expired.getMinutes() + CODE_EXPIRED)

  let user = await User.findOne({ id: email })
  if (!user) {
    user = await User.create({ id: email, email })
  }
  const dateTimeNow = new Date()
  const limitSendEmail = new Date(
    new Date(user.expired).getTime() -
      CODE_EXPIRED * 60000 +
      LIMIT_EMAIL_SENDING * 60000
  )
  if (limitSendEmail >= dateTimeNow) {
    return res.status(400).json({ error: 'You need to wait for a minute before creating email for signing in again.' })
  }
  const signInURL = generateUserSignInURL(
    `${req.protocol}://${req.get('host')}`,
    user
  )
  signInEmail(user.email, signInURL)
  res.sendStatus(200)
})

authApp.get('/auth/email/verify', async (req, res) => {
  const verifyCode = req.query.code
  const verifyTime = new Date()
  let user = await User.findOne({ verifyCode, expired: { $gt: verifyTime } })
  if (!user) {
    return res.redirect(
      process.env.ANALOG_FRONTEND_URL + '?error=INVALID_OR_EXPIRED'
    )
  }
  const payload = { id: user.id }
  const token = jwt.sign(payload, jwtOptions.secretOrKey)
  user = { ...user, verifyCode: undefined, expired: undefined }
  await user.save()
  res.redirect(process.env.ANALOG_FRONTEND_URL + '?token=' + token)
})

module.exports = authApp
