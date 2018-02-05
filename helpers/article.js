const R = require('ramda')
const Article = require('../models/mongo/article')

async function articleMiddleware (req, res, next) {
  let article = await Article.findOne({ id: req.params.articleId })
  if (!article) {
    res.status(404).json({ message: 'Article not found' })
  } else {
    req.article = article
    next()
  }
}

function isArticleOwner () {
  return req =>
    R.path(['article', 'author', 'id'])(req) === R.path(['user', 'id'])(req)
}

module.exports = {
  articleMiddleware,
  isArticleOwner
}
