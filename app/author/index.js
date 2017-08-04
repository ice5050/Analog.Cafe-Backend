const express = require('express')
const Author = require('../../models/mongo/author.js')
const authorApp = express()

authorApp.get('/authors/:authorId', (req, res) => {
  Author
    .findOne({ "info.id": req.params.authorId })
    .then(author => {
      res.json({ data: author })
    })
})
module.exports = authorApp
