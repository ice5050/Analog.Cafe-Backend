const express = require('express')
const User = require('../../models/mongo/user.js')
const authorApp = express()

authorApp.get('/authors/:author', (req, res) => {
  User
    .findOne({ id: req.params.author })
    .then(author => {
      res.json({ data: author })
    })
})
module.exports = authorApp
