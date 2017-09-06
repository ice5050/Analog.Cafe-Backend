const mongoose = require('mongoose')
const Promise = require('bluebird')
const autoIncrement = require('mongoose-auto-increment')

mongoose.Promise = Promise
const connection = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/analogCafeDev'
)
autoIncrement.initialize(connection)

module.exports = connection
