const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const favouriteSchema = new Schema({
  id: String,
  user: {
    id: String,
    name: String
  },
  createdAt: String
})

// Timestamp
favouriteSchema.pre('save', function (next) {
  if (!this.date) {
    this.date = {}
  }
  var newDate = Math.floor(new Date() / 1000)
  this.date.created = newDate
  next()
})

const Favourite = connection.model('Favourite', favouriteSchema)

module.exports = Favourite
