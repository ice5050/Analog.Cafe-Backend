const express = require('express')

const emailApp = express()

emailApp.post('/emails/unsubscribe', async (req, res) => {
  console.log(req.body)
  res.json({ status: 'ok' })
})

module.exports = emailApp
