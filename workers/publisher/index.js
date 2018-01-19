const Setting = require('../../models/mongo/setting')
const Submission = require('../../models/mongo/submission')
const { publish } = require('../../helpers/submission')

async function run () {
  const now = new Date()
  const setting = await Setting.findOne({})
  if (!setting.publishDays.includes(now.getDay())) return
  const scheduledSubmissions = await Submission.find({ status: 'scheduled' })
    .sort({ scheduledOrder: 'asc' })
    .limit(setting.numberOfPublish)
    .exec()

  if (!scheduledSubmissions) return
  scheduledSubmissions.map(async submission => { await publish(submission) })
}

async function app () {
  await run()
  process.exit()
}

app()
