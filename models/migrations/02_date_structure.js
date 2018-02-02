const Promise = require('bluebird')
const Submission = require('../mongo/submission')
const Article = require('../mongo/article')

async function migrate () {
  const submissions = await Submission.find().exec()
  const articles = await Article.find().exec()

  const submissionProms = submissions.map(async s => {
    if (!s.date || !s.date.created) {
      s.date = {
        created: s.createdAt,
        updated: s.updatedAt
      }
      s.createdAt = undefined
      s.updatedAt = undefined
      s = await s.save()
    }
    return s
  })
  const articleProms = articles.map(async a => {
    if (a.createdAt || a.updatedAt || a.toObject()['post-date']) {
      a.date = {
        created: a.createdAt,
        updated: a.updatedAt,
        published: a.toObject()['post-date']
      }
      a.createdAt = undefined
      a.updatedAt = undefined
      a.set('post-date', undefined, { strict: false })
      a = await a.save()
    }
    return a
  })

  return Promise.all([...submissionProms, ...articleProms])
}

async function app () {
  await migrate()
  console.log('Date structure migration: finished')
  process.exit()
}

app()
