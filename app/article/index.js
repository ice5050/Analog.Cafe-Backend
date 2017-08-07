const express = require('express')
const Article = require('../../models/mongo/article.js')
const User = require('../../models/mongo/user.js')
const articleApp = express()

articleApp.get(['/articles', '/list', '/author/:author'], (req, res) => {
  const tags = req.query.tag && req.query.tag.split(':')
  const repostOk = req.query['repost-ok']
  const author = req.query.author || req.params.author

  let query = Article.find()
  if (tags && tags.length !== 0) {
    query = query.where('tag').in(tags)
  }
  if (repostOk) {
    query = query.find({ repostOk: true })
  }
  if (author) {
    query = query.find({ author })
  }

  query.exec((err, articles) => {
    res.json({ status: 'ok', items: articles })
  })
})

articleApp.get('/articles/:articleSlug', (req, res) => {
  Article
    .findOne({ slug: req.params.articleSlug })
    .then(article => {
      res.json(article)
    })
})

// articleApp.post('/articles/:articleId', (req, res) => {
//   Article.findOne({ articleId: req.params.articleId }).then(article => {
//     article = {
//       ...article,
//       ...{
//         title: req.body.title,
//         subtitle: req.body.subtitle,
//         stats: {
//           images: req.body.images,
//           words: req.body.words
//         },
//         poster: {
//           small: req.body.poster.small,
//           medium: req.body.poster.medium,
//           large: req.body.poster.large
//         },
//         repostOK: req.body['repost-ok'],
//         tag: req.body.tag,
//         status: req.body.status,
//         summary: req.body.summary,
//         content: req.body.content
//       }
//     }
//     return article.save()
//   }).then(article => {
//     res.json({ data: article })
//   })
// })

module.exports = articleApp
