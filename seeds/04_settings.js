const Setting = require('../models/mongo/setting')

const setting = {
  publishDays: [2],
  numberOfPublish: 5
}

const seed = () => [Setting.create(setting)]

module.exports = seed
