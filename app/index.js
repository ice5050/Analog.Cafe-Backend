const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const compression = require('compression')
const RedisStore = require('connect-redis')(session)

const corsOptions = {
  origin: process.env.ANALOG_CONNECTION_WHITELIST.split(',')
}

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    store: new RedisStore({ url: process.env.REDIS_URL }),
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
app.use(cors(corsOptions))
app.use(compression())

app.get('/', (req, res) => {
  res.json({ status: 'Analog Cafe API' })
})

app.use(
  require('./api'),
  require('./article'),
  require('./authentication'),
  require('./author'),
  require('./image'),
  require('./collaboration'),
  require('./sitemap'),
  require('./submission'),
  require('./favourite'),
  require('./user')
)

module.exports = app
