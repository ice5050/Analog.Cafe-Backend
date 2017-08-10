const express = require('express')
const Article = require('../../models/mongo/article.js')
const User = require('../../models/mongo/user.js')
const articleApp = express()

articleApp.get(['/articles', '/list'], (req, res) => {
  const tags = (req.query.tag && req.query.tag.split(':')) || []
  const repostOk = req.query['repost-ok']
  const author = req.query.author
  const page = req.query.page || 1
  const itemsPerPage = req.query['items-per-page'] || 10

  let query = Article.find()
  let countQuery = Article.find()
  if (tags && tags.length !== 0) {
    query = query.where('tag').in(tags)
    countQuery = countQuery.where('tag').in(tags)
  }
  if (repostOk) {
    query = query.find({ repostOk: true })
    countQuery = countQuery.find({ repostOk: true })
  }
  if (author) {
    query = query.find({ 'author.id': author })
    countQuery = countQuery.find({ 'author.id': author })
  }

  query
    .select('id slug title subtitle stats author poster tag repostOk status summary updatedAt createdAt post-date')
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))
    .sort({'post-date': 'desc'})

  query.exec((err, articles) => {
    countQuery.count().exec((err, count) => {
      if (author) {
        User.findOne({ id: author }).then(user => {
          res.json({
            status: 'ok',
            filters: {
              tags: tags,
              author: { id: user.id, name: user.title }
            },
            page: {
              current: page,
              total: Math.ceil(count / itemsPerPage),
              'items-total': count,
              'items-per-page': itemsPerPage
            },
            items: articles
          })
        })
      } else {
        res.json({
          status: 'ok',
          filters: {
            tags: tags,
            author: {}
          },
          page: {
            current: page,
            total: Math.ceil(count / itemsPerPage),
            'items-total': count,
            'items-per-page': itemsPerPage
          },
          items: articles
        })
      }
    })
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
