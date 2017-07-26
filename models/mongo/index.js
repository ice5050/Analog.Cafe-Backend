const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection('mongodb://localhost/analogCafeDev')
autoIncrement.initialize(connection)

module.exports = connection
