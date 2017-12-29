const express = require('express')
const count = require('word-count')
const moment = require('moment')
const Article = require('../../models/mongo/article')
const Image = require('../../models/mongo/image')
const User = require('../../models/mongo/user.js')
const articleFeed = require('./article-feed')
const Submission = require('../../models/mongo/submission')
const { authenticationMiddleware } = require('../../helpers/authenticate')
const {
  parseContent,
  parseHeader,
  rawImageCount
} = require('../../helpers/submission')
const { froth } = require('../../helpers/image_froth')
const uploadRSSAndSitemap = require('../../upload_rss_sitemap')
const articleApp = express()

/**
 * @swagger
 * /articles, /list:
 *   get:
 *     description: Active user account if code is correct and code is not expired.
 *     parameters:
 *            - name: tag
 *              in: query
 *              schema:
 *                type: string
 *              description: Filter by tag ex. photo-essay:editorial
 *            - name: author
 *              in: query
 *              schema:
 *                type: string
 *              description: Filter by author id.
 *            - name: page
 *              in: query
 *              schema:
 *                type: integer
 *              description: Current page number.
 *            - name: items-per-page
 *              in: query
 *              schema:
 *                type: integer
 *              description: Number of items per one page.
 *     responses:
 *       200:
 *         description: Return articles.
 *       404:
 *         description: Author not found.
 */
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
    .cache(300)

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

/**
 * @swagger
 * /rss:
 *   get:
 *     description: Get RSS feeds.
 *     responses:
 *       200:
 *         description: Return RSS feeds xml.
 */
articleApp.get('/rss', async (req, res) => {
  const query = Article.find({ status: 'published' })
    .select(
      'id slug title subtitle stats author poster tag status summary updatedAt createdAt post-date'
    )
    .limit(30)
    .sort({ 'post-date': 'desc' })
  const articles = await query.exec()
  articleFeed.items = []
  articles.forEach(a => {
    const url = `https://www.analog.cafe/zine/${a.slug}`
    const image = a.poster && froth({ src: a.poster })
    articleFeed.item({
      title: a.title + (a.subtitle ? ` (${a.subtitle})` : ''),
      url: url,
      guid: url,
      description:
        (image && image.src
          ? `<p><img src="${image.src}" alt="" class="webfeedsFeaturedVisual" width="600" height="auto" /></p>`
          : '') + `<p>${a.summary}</p>`,
      author: a.author.name,
      date: moment
        .unix(a['post-date'])
        .toDate()
        .toString(),
      categories: [a.tag],
      enclosure: { url: image && image.src }
    })
  })
  res.type('text/xml')
  res.send(articleFeed.xml())
})

/**
 * @swagger
 * /articles/:articleSlug:
 *   get:
 *     description: Get article by slug.
 *     parameters:
 *            - name: articleSlug
 *              in: path
 *              schema:
 *                type: string
 *                description: Article's slug
 *                required: true
 *     responses:
 *       200:
 *         description: Return article.
 *       404:
 *         description: Article not found.
 */
articleApp.get('/articles/:articleSlug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.articleSlug })
  if (!article) {
    return res.status(404).json({
      message: 'Article not found'
    })
  }
  const nextArticle = await Article.findOne({
    'post-date': { $lt: article['post-date'] }
  })
    .sort({ 'post-date': 'desc' })
    .exec()
  res.json({
    ...article.toObject(),
    next: {
      slug: (nextArticle && nextArticle.slug) || undefined,
      title: (nextArticle && nextArticle.title) || undefined,
      authorName: (nextArticle && nextArticle.author.name) || undefined,
      subtitle: (nextArticle && nextArticle.subtitle) || undefined,
      tag: (nextArticle && nextArticle.tag) || undefined,
      poster: (nextArticle && nextArticle.poster) || undefined
    }
  })
})

/**
  * @swagger
  * /articles/:articleId:
  *   put:
  *     description: Update article (create new submission for the article)
  *     parameters:
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *            - name: articleId
  *              in: path
  *              schema:
  *                type: string
  *                required: true
  *                description: Article id.
  *            - name: status
  *              in: query
  *              schema:
  *                type: string
  *                required: true
  *                description: Submission status.
  *            - name: tag
  *              in: query
  *              schema:
  *                type: string
  *                required: true
  *                description: Submission tag.
  *            - name: header
  *              in: query
  *              schema:
  *                type: object
  *                properties:
  *                  title:
  *                    type: string
  *                    required: true
  *                  subtitle:
  *                    type: string
  *              required: true
  *              description: Article header
  *            - name: content.
  *              in: query
  *              schema:
  *                type: object
  *                properties:
  *                  kind:
  *                    type: string
  *                  document:
  *                    type: object
  *                    properties:
  *                      kind:
  *                        type: string
  *                      nodes:
  *                        type: array
  *                        items:
  *                          type: object
  *                          properties:
  *                            type:
  *                              type: string
  *                            isVoid:
  *                              type: boolean
  *                            kind:
  *                              type: string
  *                            data:
  *                              type: object
  *                              properties:
  *                                src:
  *                                  type: string
  *                            nodes:
  *                              type: array
  *                              items:
  *                                type: object
  *                                properties:
  *                                  kind:
  *                                    type: string
  *                                  ranges:
  *                                    type: array
  *                                    items:
  *                                      type: object
  *                                      properties:
  *                                        text:
  *                                          type: string
  *                                          description: Article subtitle
  *                                        kind:
  *                                          type: string
  *                                        marks:
  *                                          type: array
  *              description:  Submission body
  *     responses:
  *       200:
  *         description: Created submission for the article.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Article not found.
  *       422:
  *         description: Article can not be edited.
  */
articleApp.put(
  '/articles/:articleId',
  authenticationMiddleware,
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
    const rawText = req.body['composer-content-text'] || undefined

    let submission = new Submission({
      ...article,
      title: header.title,
      subtitle: header.subtitle,
      stats: {
        images: rawImageCount(content),
        words: count(rawText)
      },
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

/**
  * @swagger
  * /articles/:articleId:
  *   delete:
  *     description: Delete article
  *     parameters:
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *            - name: articleId
  *              in: path
  *              schema:
  *                type: string
  *                required: true
  *                description: article id.
  *     responses:
  *       200:
  *         description: Deleted article.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Article not found.
  *       422:
  *         description: Article can not be deleted.
  */
articleApp.delete(
  '/articles/:articleId',
  authenticationMiddleware,
  async (req, res) => {
    let article = Article.findOne({
      id: req.params.articleId
    })
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    article.status = 'deleted'

    article = await article.save()
    if (!article) {
      return res.status(422).json({ message: 'Article can not be edited' })
    }
    res.status(200).json({ message: 'Article has been deleted' })
    uploadRSSAndSitemap(
      process.env.API_DOMAIN,
      true,
      null,
      process.env.S3_BUCKET
    )
  }
)

module.exports = articleApp
