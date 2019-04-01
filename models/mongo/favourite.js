const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const favouriteSchema = new Schema({
  user: {
    id: String,
    name: String
  },
  favourites: [
    {
      id: String,
      slug: String,
      createdAt: String
    }
  ]
})

const Favourite = connection.model('Favourite', favouriteSchema)

module.exports = Favourite
