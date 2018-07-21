const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const settingSchema = new Schema(
  {
    weekdaySchedule: [Number],
    batchSize: Number
  },
  { strict: false }
)

const Setting = connection.model('Setting', settingSchema)

module.exports = Setting
