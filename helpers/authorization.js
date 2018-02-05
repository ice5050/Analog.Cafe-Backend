function isRole (roles) {
  return (req) => !roles.includes(req.user.role)
}

function permissionMiddleware (fn) {
  return (req, res, next) => {
    if (!fn(req)) {
      res.status(401).json({ message: 'No permission to access' })
    } else {
      next()
    }
  }
}

module.exports = {
  isRole,
  permissionMiddleware
}
