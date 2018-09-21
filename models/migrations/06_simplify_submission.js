const Promise = require('bluebird')
const Article = require('../mongo/article')
const Submission = require('../mongo/submission')

async function migrate () {
  const articles = await Article.find().exec()

  const submissionProms = articles.map(a => deleteDuplicatedSubmissions(a.id))

  return Promise.all(submissionProms)
}

async function app () {
  await migrate()
  console.log('Simplifying submission migration: finished')
  process.exit()
}

async function deleteDuplicatedSubmissions (articleId) {
  const latestSubmission = await Submission.findOne({ articleId: 'jrwe' })
    .sort({ 'date.updated': 'desc' })
    .exec()
  if (!latestSubmission) {
    return null
  }
  return Submission.remove({
    $and: [{ articleId: 'jrwe' }, { id: { $ne: latestSubmission.id } }]
  })
}

app()
