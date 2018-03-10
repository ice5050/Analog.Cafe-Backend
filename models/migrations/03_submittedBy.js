const Promise = require('bluebird')
const Submission = require('../mongo/submission')
const Article = require('../mongo/article')

async function migrate () {
  const submissions = await Submission.find().exec()
  const articles = await Article.find().exec()

  const submissionProms = submissions.map(async s => {
    if (!s.submittedBy.id) {
      s.submittedBy = s.toObject().author
      s.set('author', undefined, { strict: false })
      s = await s.save()
    }
    return s
  })
  const articleProms = articles.map(async a => {
    if (!a.submittedBy.id) {
      a.submittedBy = a.toObject().author
      a.set('author', undefined, { strict: false })
      a = await a.save()
    }
    return a
  })

  return Promise.all([...submissionProms, ...articleProms])
}

async function app () {
  await migrate()
  console.log('Submission and Article submittedBy migration: finished')
  process.exit()
}

app()
