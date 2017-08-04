const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const connection = require('./index.js')
const Schema = mongoose.Schema
const authorSchema = new Schema(
  {
    info: {
      id: String,
      title: String,
      image: String,
      text: String,
      buttons: [
        {
          to: String,
          text: String,
          red: Boolean
        }
      ]
    }
  },
  {
    timestamps: true
  }
)

authorSchema.plugin(autoIncrement.plugin, {
  model: 'Author',
  field: 'authorId',
  startAt: 1
})

const Author = connection.model('Author', authorSchema)

module.exports = Author
