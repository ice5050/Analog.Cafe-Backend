function authenticationMiddleware () {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.status(401).json({ message: 'You have no access.' })
  }
}

module.exports = authenticationMiddleware
