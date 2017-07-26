const Submission = require('../../models/mongo/submission.js')

function init (app) {
  app.get('/submissions', (req, res) => {
    Submission.find().then(submissions => {
      res.json({ data: submissions })
    })
  })

  app.get('/submissions/:submissionId', (req, res) => {
    Submission
      .findOne({ submissionId: req.params.submissionId })
      .then(submission => {
        res.json({ data: submission })
      })
  })

  app.post('/submissions', (req, res) => {
    const newSubmission = new Submission({
      category: req.body.category,
      slug: req.body.slug,
      title: req.body.title,
      subtitle: req.body.subtitle,
      stats: {
        images: req.body.images,
        words: req.body.words
      },
      authorId: req.user.id,
      articleId: req.body.articleId,
      poster: {
        small: req.body.poster.small,
        medium: req.body.poster.medium,
        large: req.body.poster.large
      },
      summary: req.body.summary,
      content: req.body.content
    })
    newSubmission.save().then(submission => {
      res.json({ data: submission })
    })
  })

  app.put('/submissions/:submissionId', (req, res) => {
    Submission.findOne({ submissionId: req.params.submissionId }).then(submission => {
      submission = {
        ...submission,
        ...{
          category: req.body.category,
          title: req.body.title,
          subtitle: req.body.subtitle,
          stats: {
            images: req.body.images,
            words: req.body.words
          },
          poster: {
            small: req.body.poster.small,
            medium: req.body.poster.medium,
            large: req.body.poster.large
          },
          status: req.body.status,
          summary: req.body.summary,
          content: req.body.content
        }
      }
      return submission.save()
    }).then(submission => {
      res.json({ data: submission })
    })
  })
}

module.exports = init
