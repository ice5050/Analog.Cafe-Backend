const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const Ability = require('./authentication/ability')

const app = express()
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.APPLICATION_SECRET,
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use((err, req, res, next) => {
  console.log(err)
})
app.use(Ability)
app.get('/', (req, res) => {
  res.json({ status: 'API is alive!' })
})

require('./authentication').init(app)

app.get('/me', passport.authenticationMiddleware(), (req, res) => {
  res.json({ data: req.user })
})

require('./submission').init(app)
require('./article').init(app)

module.exports = app
