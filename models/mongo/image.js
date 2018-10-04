const mongoose = require('mongoose')
const connection = require('./index.js')
const cachegoose = require('cachegoose')

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
imageSchema.pre('save', next => {
  var now = Number(new Date())
  if (!this.createdAt) {
    this.createdAt = now
    this.updatedAt = now
  } else if (this.isModified()) {
    this.updatedAt = now
  }
  next()
})

imageSchema.post('save', img => {
  cachegoose.clearCache(`image-${img.id}`)
})

const Image = connection.model('Image', imageSchema)

module.exports = Image
