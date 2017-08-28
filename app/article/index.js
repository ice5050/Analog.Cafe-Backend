const express = require('express')
const Article = require('../../models/mongo/article.js')
const Image = require('../../models/mongo/image')
const User = require('../../models/mongo/user.js')
const articleApp = express()

articleApp.get(['/articles', '/list'], async (req, res) => {
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
    const images = await Image.find({ 'author.id': author })
    const imagesRegex = images.map(i => new RegExp(`.*${i.id}.*`, 'g'))
    query = query.or([
      { 'author.id': author },
      {
        'content.raw.document.nodes': {
          $elemMatch: {
            $and: [{ type: 'image' }, { 'data.src': { $in: imagesRegex } }]
          }
        }
      }
    ])
    countQuery = countQuery.or([
      { 'author.id': author },
      {
        'content.raw.document.nodes': {
          $elemMatch: {
            $and: [{ type: 'image' }, { 'data.src': { $in: imagesRegex } }]
          }
        }
      }
    ])
  }

  query
    .select(
      'id slug title subtitle stats author poster tag repostOk status summary updatedAt createdAt post-date'
    )
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))
    .sort({ 'post-date': 'desc' })

  const articles = await query.exec()
  const count = await countQuery.count().exec()
  let user
  if (author) {
    user = await User.findOne({ id: author }).exec()
  }
  res.json({
    status: 'ok',
    filter: {
      tags: tags,
      author: author
        ? { id: author, name: (user && user.title) || '' }
        : undefined
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

articleApp.get('/articles/:articleSlug', (req, res) => {
  Article.findOne({ slug: req.params.articleSlug }).then(article => {
    res.json(article)
  })
})

module.exports = articleApp
