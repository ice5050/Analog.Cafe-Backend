const Setting = require('../../models/mongo/setting')
const Submission = require('../../models/mongo/submission')
const Article = require('../../models/mongo/article')
const moment = require('moment')

async function run () {
  const now = new Date()
  const setting = await Setting.findOne({})
  if (!setting.publishDays.includes(now.getDay())) return
  const scheduledSubmissions = await Submission.find({ status: 'scheduled' })
    .limit(setting.numberOfPublish)
    .exec()

  if (!scheduledSubmissions) return
  scheduledSubmissions.map(async submission => {
    let article = new Article({
      id: submission.id,
      slug: submission.slug,
      title: submission.title,
      subtitle: submission.subtitle,
      stats: submission.stat,
      author: submission.author,
      poster: submission.poster,
      tag: submission.tag,
      summary: submission.summary,
      content: submission.content,
      'post-date': moment().unix(),
      status: 'published'
    })
    submission.articleId = submission.id
    submission.status = 'published'
    await article.save()
    await submission.save()
  })
}

async function app () {
  await run()
  process.exit()
}

app()
