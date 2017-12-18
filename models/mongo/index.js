const mongoose = require('mongoose')
const Promise = require('bluebird')
const cachegoose = require('cachegoose')

cachegoose(mongoose, {
  engine: 'redis',
  url: process.env.REDIS_URL
})

mongoose.Promise = Promise
const connection = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/analogCafeDev'
)

module.exports = connection
