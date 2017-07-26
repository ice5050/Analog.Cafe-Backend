const Article = require('../../models/mongo/article.js')
const User = require('../../models/postgres/index.js').user

function init (app) {
  app.get('/articles', (req, res) => {
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
    query.exec(articles => {
      res.json({ data: articles })
    })
  })

  app.get('/articles/:articleId', (req, res) => {
    Article
      .findOne({ articleId: req.params.articleId })
      .then(article => {
        res.json({ data: article })
      })
  })

  app.post('/articles/:articleId', (req, res) => {
    Article.findOne({ articleId: req.params.articleId }).then(article => {
      article = {
        ...article,
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
      return article.save()
    }).then(article => {
      res.json({ data: article })
    })
  })
}

module.exports = init
