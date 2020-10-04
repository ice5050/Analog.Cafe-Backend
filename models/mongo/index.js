const mongoose = require('mongoose')
const Promise = require('bluebird')
const cachegoose = require('cachegoose')

cachegoose(mongoose, process.env.REDIS_URL)

mongoose.Promise = Promise

// get past depreciation warning
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)

const connection = mongoose.createConnection(process.env.DATABASE_URI)

module.exports = connection
