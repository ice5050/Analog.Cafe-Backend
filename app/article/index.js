const express = require('express')
const count = require('word-count')
const Article = require('../../models/mongo/article')
const Image = require('../../models/mongo/image')
const User = require('../../models/mongo/user.js')
const articleFeed = require('./article-feed')
const Submission = require('../../models/mongo/submission')
const passport = require('passport')
const {
  parseContent,
  parseHeader,
  raw2Text,
  rawImageCount,
  getImageUrl
} = require('../../helpers/submission')
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

articleApp.get('/rss', async (req, res) => {
  const query = Article.find()
    .select(
      'id slug title subtitle stats author poster tag status summary updatedAt createdAt post-date'
    )
    .limit(30)
    .sort({ 'post-date': 'desc' })
  const articles = await query.exec()
  articles.forEach(a => {
    articleFeed.item({
      title: a.title,
      description: a.summary,
      author: a.author.id,
      date: a.createdAt,
      url: `https://www.analog.cafe/zine/${a.slug}`
    })
  })
  res.type('rss')
  res.send(articleFeed.xml())
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

articleApp.put(
  '/articles/:articleId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let article = Article.findOne({
      id: req.params.articleId
    })
    if (req.user.role !== 'admin' && req.user.id !== article.author.id) {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    const content = parseContent(req.body.content)
    const header = parseHeader(req.body.content)
    const rawText = content ? raw2Text(content) : undefined
    const imageURLs = content ? getImageUrl(content) : undefined

    let submission = new Submission({
      ...article,
      title: header.title,
      subtitle: header.subtitle,
      stats: {
        images: rawImageCount(content),
        words: count(rawText)
      },
      poster: imageURLs
        ? {
          small: imageURLs[0],
          medium: imageURLs[0],
          large: imageURLs[0]
        }
        : undefined,
      summary: rawText ? rawText.substring(0, 250) : undefined,
      content: req.body.content,
      status: req.user.role === 'admin' ? req.body.status : 'pending',
      tag: req.user.role === 'admin' ? req.body.tag : undefined
    })

    submission = await submission.save()
    if (!submission) {
      return res.status(422).json({ message: 'Article can not be edited' })
    }
    res.json(submission.toObject())
  }
)

module.exports = articleApp
