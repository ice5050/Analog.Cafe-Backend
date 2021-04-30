const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const passport = require('passport')
const redis = require('redis')
const session = require('express-session')

const RedisStore = require('connect-redis')(session)

const corsOptions = {
  origin: process.env.ANALOG_CONNECTION_WHITELIST.split(',')
}

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
})

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
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
  require('./emails'),
  require('./favourite'),
  require('./user'),
  require('./ad')
)

module.exports = app
