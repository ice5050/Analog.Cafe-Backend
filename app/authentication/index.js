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
const welcomeEmail = require('../../helpers/mailers/welcome')
const signInEmail = require('../../helpers/mailers/sign_in')
const {
  sanitizeUsername,
  generateUserSignInURL,
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
/**
 * @swagger
 * /auth/twitter:
 *   get:
 *     description: Twitter OAuth. Using passport
 *     responses:
 *       200:
 *         description: Success sending request
 */
authApp.get('/auth/twitter', passport.authenticate('twitter'))
/**
 * @swagger
 * /auth/twitter/callback:
 *   get:
 *     description: Twitter OAuth callback.
 *     responses:
 *       200:
 *         description: Generate and save token to user
 */
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
/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     description: Facebook OAuth. Using passport
 *     responses:
 *       200:
 *         description: Success sending request
 */
authApp.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
)
/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     description: Facebook OAuth callback.
 *     responses:
 *       200:
 *         description: Generate and save token to user
 */
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

/**
 * @swagger
 * /auth/email:
 *   post:
 *     description: Authenticate or create user by email. This function will generate verify code and send email.
 *     parameters:
 *            - name: email
 *              in: query
 *              schema:
 *                type: string
 *              required: true
 *              description: User email for registration or loging in
 *     responses:
 *       200:
 *         description: Successfull send verify email.
 */
authApp.post('/auth/email', async (req, res) => {
  let email = req.body.email
  let expired = new Date()
  expired.setMinutes(expired.getMinutes() + 10)

  let user = await User.findOne({ id: email })
  if (!user) {
    user = await User.create({ id: email, email: email })
  }
  const signInURL = generateUserSignInURL(
    `${req.protocol}://${req.get('host')}`,
    user
  )
  signInEmail(user.email, signInURL)
  res.sendStatus(200)
})
/**
 * @swagger
 * /auth/email/verify:
 *   get:
 *     description: Active user account if code is correct and code is not expired.
 *     parameters:
 *            - name: code
 *              in: query
 *              schema:
 *                type: string
 *              description: Verify code that generate at /auth/email
 *     responses:
 *       200:
 *         description: Successfull active user account.
 */
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
