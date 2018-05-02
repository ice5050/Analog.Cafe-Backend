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
  fullConsent: Boolean,
  createdAt: String,
  updatedAt: String,
  featured: { type: Boolean, default: false }
})

// Timestamp
imageSchema.pre('save', function (next) {
  var now = Number(new Date())
  if (!this.createdAt) {
    this.createdAt = now
    this.updatedAt = now
  } else if (this.isModified()) {
    this.updatedAt = now
  }
  next()
})

const Image = connection.model('Image', imageSchema)

module.exports = Image
