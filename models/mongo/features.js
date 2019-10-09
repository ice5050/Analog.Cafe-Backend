const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const featuresSchema = new Schema({
  feature: Array
})

const Features = connection.model('Features', featuresSchema)

module.exports = Features
