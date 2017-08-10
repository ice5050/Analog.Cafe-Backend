const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://localhost:27017/analogCafeDev')
autoIncrement.initialize(connection)

module.exports = connection
