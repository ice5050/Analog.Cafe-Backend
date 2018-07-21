const Promise = require('bluebird')
const Setting = require('../mongo/setting')

async function migrate () {
  const settings = await Setting.find().exec()

  const settingProms = settings.map(async s => {
    if (!s.batchSize) {
      s.batchSize = s.toObject()['numberOfPublish']
      s.weekdaySchedule = s.toObject()['publishDays']
      s.set('numberOfPublish', undefined, { strict: false })
      s.set('publishDays', undefined, { strict: false })
      s = await s.save()
    }
    return s
  })

  return Promise.all(settingProms)
}

async function app () {
  await migrate()
  console.log('Setting migration: finished')
  process.exit()
}

app()
