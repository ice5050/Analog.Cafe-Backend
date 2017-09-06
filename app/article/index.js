const express = require('express')
const Article = require('../../models/mongo/article.js')
const Image = require('../../models/mongo/image')
const User = require('../../models/mongo/user.js')
const articleApp = express()

articleApp.get(['/articles', '/list'], async (req, res) => {
  const tags = (req.query.tag && req.query.tag.split(':')) || []
  const author = req.query.author
  const page = req.query.page || 1
  const itemsPerPage = req.query['items-per-page'] || 10

  let queries = [Article.find(), Article.find()]
  queries.map(q => q.find({ status: 'published' }))
  if (tags && tags.length !== 0) {
    queries.map(q => q.where('tag').in(tags))
  }
  let user
  if (author) {
    user = await User.findOne({ id: author }).exec()
    if (!user) {
      res.status(404).json({ message: 'Author not found' })
    }
    const images = await Image.find({ 'author.id': author })
    const imagesRegex = images.map(i => new RegExp(`.*${i.id}.*`, 'g'))
    queries.map(q =>
      q.or([
        { 'author.id': author },
        {
          'content.raw.document.nodes': {
            $elemMatch: {
              $and: [{ type: 'image' }, { 'data.src': { $in: imagesRegex } }]
            }
          }
        }
      ])
    )
  }

  let [query, countQuery] = queries

  query
    .select(
      'id slug title subtitle stats author poster tag status summary updatedAt createdAt post-date'
    )
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))
    .sort({ 'post-date': 'desc' })

  const articles = await query.exec()
  const count = await countQuery.count().exec()

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

articleApp.get('/articles/:articleSlug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.articleSlug })
  if (!article) {
    return res.status(404).json({
      message: 'Article not found'
    })
  }
  const nextArticle = await Article.findOne({
    'post-date': { $gt: article['post-date'] }
  })
  res.json({
    ...article.toObject(),
    nextArticle: (nextArticle && nextArticle.slug) || undefined
  })
})

module.exports = articleApp
