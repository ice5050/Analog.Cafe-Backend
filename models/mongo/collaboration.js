const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const collaborationSchema = new Schema({
  id: String,
  author: {
    id: String,
    name: String
  }
})

const Collaboration = connection.model('Collaboration', collaborationSchema)

module.exports = Collaboration
