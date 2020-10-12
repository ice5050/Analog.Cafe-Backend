const express = require('express')
const passport = require('passport')
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
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
const TOKEN_EXPIRES_IN = '365d'

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
jwtOptions.secretOrKey = process.env.APPLICATION_SECRET

async function subscribeToSendgrid (contacts) {
  const clientServerOptions = {
    uri: 'https://api.sendgrid.com/v3/marketing/contacts',
    body: JSON.stringify({
      contacts,
      list_ids: ['15c349bb-f878-44a0-8dee-55fc33f33aa8']
    }),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
    }
  }
  return new Promise((resolve, reject) => {
    request(clientServerOptions, function (error, response) {
      console.log(clientServerOptions, error, response.body)
      if (error) {
        resolve(error)
      } else {
        resolve(response)
      }
    })
  })
}

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
    const token = jwt.sign(payload, jwtOptions.secretOrKey, {
      expiresIn: TOKEN_EXPIRES_IN
    })
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
    const token = jwt.sign(payload, jwtOptions.secretOrKey, {
      expiresIn: TOKEN_EXPIRES_IN
    })
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
        callbackURL: process.env.TWITTER_CALLBACK_URL,
        userProfileURL:
          'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
      },
      async (token, tokenSecret, profile, cb) => {
        let user = await User.findOne({ twitterId: profile.id })
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value

        // attempt to get a user by email
        if (!user) {
          user = await User.findOne({ email })
        }

        const username = sanitizeUsername(profile.username)
        const name = profile.displayName
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
            twitterName: profile.displayName,
            id: username || sanitizeUsername(name),
            title: name || username,
            email,
            image: uploadedImage && uploadedImage.public_id,
            text: profile._json.description
          })
          welcomeEmail(user.email, user.title)

          // send email to SendGrid
          await subscribeToSendgrid([
            {
              email,
              unique_name: name,
              custom_fields: {
                w2_T: username || sanitizeUsername(name)
              }
            }
          ])
        } else {
          user.email = email
          user.twitterName = profile.displayName
          user = await user.save()
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
        profileFields: ['id', 'displayName', 'photos', 'email'],
        profileURL: 'https://graph.facebook.com/v2.12/me',
        authorizationURL: 'https://www.facebook.com/v2.12/dialog/oauth',
        tokenURL: 'https://graph.facebook.com/v2.12/oauth/access_token'
      },
      async (accessToken, refreshToken, profile, cb) => {
        let user = await User.findOne({ facebookId: profile.id })
        const email = profile.emails[0] && profile.emails[0].value

        // attempt to get a user by email
        if (!user) {
          user = await User.findOne({ email })
        }

        const id =
          sanitizeUsername(profile.displayName) || sanitizeUsername(email)
        const profileImageURL = profile.photos[0] && profile.photos[0].value
        if (!user) {
          const uploadedImage =
            profileImageURL &&
            (await profileImageURLToCloudinary(profileImageURL))
          user = await User.create({
            facebookId: profile.id,
            facebookName: profile.displayName,
            id,
            title: profile.displayName || id,
            email,
            image: uploadedImage && uploadedImage.public_id
          })
          welcomeEmail(user.email, user.title)

          // send email to SendGrid
          await subscribeToSendgrid([
            {
              email,
              unique_name: profile.displayName,
              custom_fields: {
                w2_T: id
              }
            }
          ])
        } else {
          user.facebookName = profile.displayName
          user = await user.save()
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
  const ratio = (
    (uploadedImage.width / uploadedImage.height) *
    1000000
  ).toFixed(0)
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
    const name = email
      .split('@')[0]
      .split('+')[0]
      .replace(/[^a-z0-9\_\-\.]/gi, '')

    const id = sanitizeUsername(name)
    user = await User.create({ id, email, title: name })

    welcomeEmail(user.email, user.title)

    // send email to SendGrid
    await subscribeToSendgrid([
      {
        email,
        unique_name: name,
        custom_fields: {
          w2_T: id
        }
      }
    ])
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
 *         description: Successfully active user account.
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
  const token = jwt.sign(payload, jwtOptions.secretOrKey, {
    expiresIn: TOKEN_EXPIRES_IN
  })
  res.redirect(process.env.ANALOG_FRONTEND_URL + '?token=' + token)
})

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     description: Refresh token
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *     responses:
 *       200:
 *         description: Renew the token.
 */
authApp.post('/auth/refresh', authenticationMiddleware, async (req, res) => {
  const user = req.user
  const payload = { id: user.id }
  const token = jwt.sign(payload, jwtOptions.secretOrKey, {
    expiresIn: TOKEN_EXPIRES_IN
  })
  res.json({ token })
})

module.exports = authApp
