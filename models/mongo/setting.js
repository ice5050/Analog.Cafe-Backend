const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const settingSchema = new Schema({
  publishDays: [Number],
  numberOfPublish: Number
})

const Setting = connection.model('Setting', settingSchema)

module.exports = Setting
