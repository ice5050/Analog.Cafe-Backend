const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const Ability = require('./authentication/ability')

const app = express()
app.use(bodyParser.json())
app.use(
  session({
    store: new RedisStore({
      url: process.env.REDIS_URL
    }),
    secret: process.env.APPLICATION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use((err, req, res, next) => {
  console.log(err)
})
app.use(Ability)

app.get('/api', (req, res) => {
  res.json({ status: 'Analog Cafe API' })
})

app.use('/api',
  require('./authentication'),
  require('./submission'),
  require('./article')
)

module.exports = app
