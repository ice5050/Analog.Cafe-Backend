const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const imageSchema = new Schema({
  id: String,
  author: {
    id: String,
    name: String
  },
  etag: String,
  url: String,
  fullConsent: Boolean,
  featured: { type: Boolean, default: false }
})

const Image = connection.model('Image', imageSchema)

module.exports = Image
