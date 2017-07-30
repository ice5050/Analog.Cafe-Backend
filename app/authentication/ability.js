const UrlPattern = require('url-pattern')

var permissions = [
  {
    method: 'get',
    url: '/api',
    roles: ['member', 'admin', 'guest']
  },
  {
    method: 'get',
    url: '/api/submissions',
    roles: ['member', 'admin', 'guest']
  },
  {
    method: 'post',
    url: '/api/submissions',
    roles: ['member', 'admin']
  },
  {
    method: 'get',
    url: '/api/submissions/:submissionId',
    roles: ['member', 'admin', 'guest']
  },
  {
    method: 'put',
    url: '/api/submissions/:submissionId',
    roles: ['member', 'admin']
  },
  {
    method: 'get',
    url: '/api/auth/twitter',
    roles: ['member', 'admin', 'guest']
  },
  {
    method: 'get',
    url: '/api/auth/twitter/callback',
    roles: ['member', 'admin', 'guest']
  },
  {
    method: 'get',
    url: '/api/auth/user',
    roles: ['member', 'admin']
  }
]

function cleanUrl (url) {
  return url.split('?')[0]
}

function isUserHasPermission (req) {
  for (var i = 0; i < permissions.length; i++) {
    var pattern = new UrlPattern(permissions[i]['url'])
    var isMatchUrl = pattern.match(cleanUrl(req.url)) != null
    var isMatchMethod = permissions[i]['method'] === req.method.toLowerCase()
    if (isMatchUrl && isMatchMethod) {
      var isMatchRoleGuest =
        !req.user && permissions[i]['roles'].indexOf('guest') > -1
      var isMatchRole =
        req.user && permissions[i]['roles'].indexOf(req.user.role) > -1
      if (isMatchRoleGuest || isMatchRole) {
        return true
      }
    }
  }
  return false
}

function checkUserPermission (req, res, next) {
  if (isUserHasPermission(req)) {
    next()
  } else {
    res.status(401).json({ message: 'You have no access.' })
  }
}
module.exports = checkUserPermission
