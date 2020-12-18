const mongoose = require('mongoose')
const Promise = require('bluebird')
const cachegoose = require('cachegoose')

try {
  const redisClient = require('../../helpers/redis')
  console.log(
    `Connected \`cachegoose\` to Redis via ${redisClient.host}:${redisClient.port}`
  )
  cachegoose(mongoose, {
    engine: 'redis',
    port: redisClient.port,
    host: redisClient.host
  })
} catch (error) {
  console.log(
    'Failed to connect `cachegoose` to Redis. Using local memory instead: ',
    error
  )
  cachegoose(mongoose)
}

mongoose.Promise = Promise

// get past depreciation warning
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)

const connection = mongoose.createConnection(process.env.DATABASE_URI)

module.exports = connection
