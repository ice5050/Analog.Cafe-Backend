const passport = require('passport')

function authenticationMiddleware (req, res, next) {
  passport.authenticate('jwt', { session: false }, (_, user, err) => {
    if (err && err.name === 'TokenExpiredError') {
      res.status(401).json({ message: err.name })
    } else if (err && err.name === 'JsonWebTokenError') {
      res.status(401).json({ message: err.name })
    } else if (err) {
      res.status(401).json({ message: "TokenError" })
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}

function sanitizeUsername (username) {
  if (!username) return null
  return username.split('@')[0].toLowerCase().replace(/\W/g, '.')
}

function rand5digit () {
  return Math.floor(Math.random() * 89999 + 10000)
}

function getProfileImageURL (url) {
  return url.replace(/_normal\.(.*)$/, '_400x400.$1')
}

function generateVerifyCode () {
  return rand5digit()
}

async function generateUserSignInURL (baseURL, user) {
  const verifyCode = generateVerifyCode()
  const expired = new Date()
  expired.setMinutes(expired.getMinutes() + 10)
  user.verifyCode = verifyCode
  user.expired = expired
  await user.save()
  return `${baseURL}/auth/email/verify?code=${verifyCode}`
}

module.exports = {
  authenticationMiddleware,
  sanitizeUsername,
  rand5digit,
  getProfileImageURL,
  generateVerifyCode,
  generateUserSignInURL
}
