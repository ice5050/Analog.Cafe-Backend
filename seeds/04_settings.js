const Setting = require('../models/mongo/setting')

const setting = {
  numberOfPublish: 5,
  publishDays: [2]
}

const seed = () => [Setting.create(setting)]

module.exports = seed
