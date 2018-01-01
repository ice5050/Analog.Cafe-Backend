const Promise = require('bluebird')
const Submission = require('../mongo/submission')
const Article = require('../mongo/article')
const { updateSubmissionAuthors } = require('../../helpers/submission')

async function migrate () {
  const submissions = await Submission.find().exec()
  const articles = await Article.find().exec()

  const submissionProms = submissions.map(s => updateSubmissionAuthors(s))
  const articleProms = articles.map(a => updateSubmissionAuthors(a))

  return Promise.all([...submissionProms, ...articleProms])
}

async function app () {
  await migrate()
  console.log('Migration finished')
  process.exit()
}

app()
