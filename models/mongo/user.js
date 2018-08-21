const mongoose = require('mongoose')
const connection = require('./index.js')
const timestamps = require('mongoose-timestamp-date-unix')

const Schema = mongoose.Schema

const userSchema = new Schema({
  id: String,
  title: String,
  image: String,
  text: String,
  twitterId: String,
  facebookId: String,
  email: { type: String, lowercase: true, unique: true },
  role: { type: String, default: 'member' },
  buttons: [
    {
      to: String,
      text: String,
      branded: Boolean
    }
  ],
  suspend: Boolean,
  verifyCode: String,
  expired: Date
})

userSchema.plugin(timestamps)
const User = connection.model('User', userSchema)

module.exports = User
