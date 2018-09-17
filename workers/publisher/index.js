const Setting = require('../../models/mongo/setting')
const Submission = require('../../models/mongo/submission')
const { publish } = require('../../helpers/submission')

async function app(){
  const now = new Date()
  const setting = await Setting.findOne({})
  if (!setting.weekdaySchedule.includes(now.getDay())) return
  const scheduledSubmissions = await Submission.find({ status: 'scheduled' })
    .sort({ scheduledOrder: 'asc' })
    .limit(setting.batchSize)
    .exec()

  if (!scheduledSubmissions) return
  scheduledSubmissions.map(async submission => { await publish(submission) })
  process.exit()
}

app()
