const express = require('express')
const User = require('../../models/mongo/user.js')
const { toShowingObject } = require('../../helpers/user')
const authorApp = express()

authorApp.get('/authors/:author', async (req, res) => {
  const author = await User.findOne({ id: req.params.author })
  if (!author) {
    return res.status(404).json({ message: 'Author not found' })
  }
  res.json({ status: 'ok', info: toShowingObject(author) })
})

module.exports = authorApp
