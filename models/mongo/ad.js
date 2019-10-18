const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const adSchema = new Schema(
  {
    link: String,
    title: String,
    description: String,
    poster: String,
    actin: String,
    value: Number,
    tags: [String],
    location: String
  },
  { strict: false }
)

const Ad = connection.model('Ad', adSchema)

module.exports = Ad
