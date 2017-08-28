const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const articleSchema = new Schema(
  {
    id: String,
    slug: String,
    title: String,
    subtitle: String,
    stats: {
      images: Number,
      words: Number
    },
    author: {
      id: String,
      name: String
    },
    poster: {
      small: String,
      medium: String,
      large: String
    },
    'post-date': String,
    tag: String,
    repostOk: Boolean,
    status: { type: String, default: 'published' },
    summary: String,
    content: Schema.Types.Mixed
  },
  {
    timestamps: true
  }
)

const Article = connection.model('Article', articleSchema)

module.exports = Article
