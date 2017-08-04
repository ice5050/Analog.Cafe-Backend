const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const connection = require('./index.js')

const Schema = mongoose.Schema

const articleSchema = new Schema({
  slug: String,
  title: String,
  subtitle: String,
  articleId: Number,
  stats: {
    images: Number,
    words: Number
  },
  authorId: Number,
  poster: {
    small: String,
    medium: String,
    large: String
  },
  tag: String,
  repostOk: Boolean,
  status: { type: String, default: 'published' },
  summary: String,
  content: Schema.Types.Mixed
}, {
  timestamps: true
})

articleSchema.plugin(autoIncrement.plugin, { model: 'Article', field: 'articleId', startAt: 1 })

const Article = connection.model('Article', articleSchema)

module.exports = Article
