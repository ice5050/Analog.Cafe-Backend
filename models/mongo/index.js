const mongoose = require('mongoose')
const Promise = require('bluebird')

try {
  ;(async () => {
    const cachegoose = require('cachegoose')
    const redisClient = await require('../../helpers/redis')
    cachegoose(mongoose, {
      engine: 'redis',
      port: redisClient.options.port,
      host: redisClient.options.host,
      password: redisClient.options.password
    })
  })()
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
