function sanitizeUsername (username) {
  if (!username) return null
  return username
    .split('@')[0]
    .toLowerCase()
    .replace(/\W/g, '.')
}

function rand5digit () {
  return Math.floor(Math.random() * 89999 + 10000)
}

function getProfileImageURL (url) {
  return url.replace(/_normal\.(.*)$/, '_400x400.$1')
}

module.exports = {
  sanitizeUsername,
  rand5digit,
  getProfileImageURL
}
