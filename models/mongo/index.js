const mongoose = require('mongoose')
const Promise = require('bluebird')

mongoose.Promise = Promise
const connection = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/analogCafeDev'
)

module.exports = connection
