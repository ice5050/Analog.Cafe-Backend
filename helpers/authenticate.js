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
  user = { ...user, verifyCode, expired }
  await user.save()
  return `${baseURL}/auth/email/verify?code=${verifyCode}`
}

module.exports = {
  sanitizeUsername,
  rand5digit,
  getProfileImageURL,
  generateVerifyCode,
  generateUserSignInURL
}
