const mongoose = require('mongoose')
const connection = require('./index.js')
const timestamps = require('mongoose-ts')

const Schema = mongoose.Schema

const userSchema = new Schema({
  id: String,
  title: String,
  image: String,
  text: String,
  twitterId: String,
  facebookId: String,
  email: String,
  role: { type: String, default: 'member' },
  buttons: [
    {
      to: String,
      text: String,
      red: Boolean
    }
  ],
  suspend: Boolean,
  email: String,
  verifyCode: String,
  expired: Date
})

userSchema.plugin(timestamps)
const User = connection.model('User', userSchema)

module.exports = User
