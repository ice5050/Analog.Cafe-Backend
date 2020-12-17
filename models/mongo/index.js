const mongoose = require('mongoose')
const Promise = require('bluebird')
const cachegoose = require('cachegoose')

// deconstruct Redis url for cachegoose
const redisURL = process.env.REDIS_URL
const redisPort = redisURL.substring(redisURL.lastIndexOf(':') + 1)
const redisHost = redisURL
  .substring(0, redisURL.lastIndexOf(':'))
  .replace('redis://h:', '')
  .replace('redis://', '')

cachegoose(mongoose, {
  engine: 'redis',
  port: redisPort,
  host: redisHost
})

mongoose.Promise = Promise

// get past depreciation warning
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)

const connection = mongoose.createConnection(process.env.DATABASE_URI)

module.exports = connection
