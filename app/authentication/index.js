const express = require('express')
const passport = require('passport')
const cloudinary = require('cloudinary')
const shortid = require('shortid')
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
  authenticationMiddleware,
  sanitizeUsername,
  generateUserSignInURL,
  getProfileImageURL
} = require('../../helpers/authenticate')
const { randomString } = require('../../helpers/submission')
const { toShowingObject } = require('../../helpers/user')
const CODE_EXPIRED = 10 // after send verify email, code will expired (minute)
const LIMIT_EMAIL_SENDING = 1 // cannot send verify email again until (minute)

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
jwtOptions.secretOrKey = process.env.APPLICATION_SECRET

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
    const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '3d' })
    res.redirect(`${process.env.ANALOG_FRONTEND_URL}?token=${token}`)
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
    const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '3d' })
    res.redirect(`${process.env.ANALOG_FRONTEND_URL}?token=${token}`)
  }
)

/**
 * @swagger
 * /auth/user:
 *   get:
 *     description: Get user object
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *     responses:
 *       200:
 *         description: Return user
 */
authApp.get('/auth/user', authenticationMiddleware, (req, res) => {
  res.json({ status: 'ok', info: toShowingObject(req.user) })
})

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
        let user = await User.findOne({ twitterId: profile.id })
        const username = sanitizeUsername(profile.username)
        const name = sanitizeUsername(profile.displayName)
        const profileImageURL =
          profile._json &&
          profile._json.profile_image_url &&
          getProfileImageURL(profile._json.profile_image_url)
        if (!user) {
          const uploadedImage =
            profileImageURL &&
            (await profileImageURLToCloudinary(profileImageURL))
          user = await User.create({
            twitterId: profile.id,
            id: username || name,
            title: name || username,
            image: uploadedImage && uploadedImage.public_id,
            text: profile._json.description
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
        const email = profile.emails[0] && profile.emails[0].value
        const username =
          sanitizeUsername(profile.displayName) || sanitizeUsername(email)
        const profileImageURL = profile.photos[0] && profile.photos[0].value
        if (!user) {
          const uploadedImage =
            profileImageURL &&
            (await profileImageURLToCloudinary(profileImageURL))
          user = await User.create({
            facebookId: profile.id,
            id: username,
            title: profile.displayName || username,
            email,
            image: uploadedImage && uploadedImage.public_id
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

async function profileImageURLToCloudinary (profileImageURL) {
  let uploadedImage
  uploadedImage = await cloudinary.v2.uploader.upload(profileImageURL)
  const ratio = (uploadedImage.width / uploadedImage.height * 1000000).toFixed(
    0
  )
  const hash = shortid.generate()
  uploadedImage = await cloudinary.v2.uploader.rename(
    uploadedImage.public_id,
    `image-froth_${ratio}_${hash}`
  )
  return uploadedImage
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
  const email = req.body.email
  let expired = new Date()
  expired.setMinutes(expired.getMinutes() + CODE_EXPIRED)

  let user = await User.findOne({ email })
  if (!user) {
    const name = sanitizeUsername(email)
    const username = `${name}-${randomString()}`
    user = await User.create({ id: username, email, title: name })
    welcomeEmail(user.email, user.title)
  }
  const dateTimeNow = new Date()
  const limitSendEmail = new Date(
    new Date(user.expired).getTime() -
      CODE_EXPIRED * 60000 +
      LIMIT_EMAIL_SENDING * 60000
  )
  if (limitSendEmail >= dateTimeNow) {
    return res.status(400).json({
      error:
        'You need to wait for a minute before creating email for signing in again.'
    })
  }
  const signInURL = await generateUserSignInURL(
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
  const user = await User.findOneAndUpdate(
    { verifyCode, expired: { $gt: verifyTime } },
    { verifyCode: null, expired: null },
    { new: true }
  )
  if (!user) {
    return res.redirect(
      process.env.ANALOG_FRONTEND_URL + '?error=INVALID_OR_EXPIRED'
    )
  }
  const payload = { id: user.id }
  const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '3d' })
  res.redirect(process.env.ANALOG_FRONTEND_URL + '?token=' + token)
})

module.exports = authApp
