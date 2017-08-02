const express = require('express')
const Article = require('../../models/mongo/article.js')
const Submission = require('../../models/mongo/submission.js')
const User = require('../../models/postgres/index.js').user
const articleApp = express()

articleApp.get('/articles', (req, res) => {
  const tags = req.query.tag && req.query.tag.split(':')
  const repostOk = req.query['repost-ok']
  const author = req.query.author

  let query = Article.find()
  if (tags && tags.length !== 0) {
    query = query.where('tag').in(tags)
  }
  if (repostOk) {
    query = query.find({ repostOk: true })
  }
  if (author) {
    User.findOne({ where: { username: author } }).then(author => {
      query = query.find({ author: author.id })
    })
  }
  query.exec((err, articles) => {
    res.json({ items: articles })
  })
})

articleApp.get('/articles/:articleId', (req, res) => {
  Article
    .findOne({ articleId: req.params.articleId })
    .then(article => {
      res.json({ data: article })
    })
})

articleApp.post('/articles/:submissionId', (req, res) => {
  Submission.findOne({ submissionId: req.params.submissionId }).then(submission => {
    const article = {
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
        repostOK: req.body['repost-ok'],
        tag: req.body.tag,
        status: req.body.status,
        summary: req.body.summary,
        content: req.body.content
      }
    }
    const { _id, submissionId, newArticle } = article
    return article.save()
  }).then(article => {
    res.json({ data: article })
  })
})

module.exports = articleApp
