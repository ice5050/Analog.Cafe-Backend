const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const featuresSchema = new Schema({
  feature: Object
})

const Features = connection.model('Features', featuresSchema)

module.exports = Features
