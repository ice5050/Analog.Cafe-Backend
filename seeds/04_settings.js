const Setting = require('../models/mongo/setting')

const setting = {
  batchSize: 5,
  weekdaySchedule: [2]
}

const seed = () => [Setting.create(setting)]

module.exports = seed
