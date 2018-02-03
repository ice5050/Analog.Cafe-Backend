const mongoose = require('mongoose')
const connection = require('./index.js')
const cachegoose = require('cachegoose')

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
    authors: [
      {
        _id: false,
        id: String,
        name: String,
        authorship: String
      }
    ],
    poster: String,
    date: {
      created: String,
      published: String,
      updated: String
    },
    tag: String,
    // Status: published, deleted
    status: { type: String, default: 'published' },
    summary: String,
    content: Schema.Types.Mixed
  },
  { strict: false }
)

// Timestamp
articleSchema.pre('save', function (next) {
  if (!this.date) {
    this.date = {}
  }
  var newDate = Math.floor(new Date() / 1000)
  if (!this.date.created) {
    this.date.created = newDate
    this.date.updated = newDate
  } else if (this.isModified()) {
    this.date.updated = newDate
  }
  next()
})

// Cache clearing
articleSchema.post('save', article => {
  cachegoose.clearCache('articles')
})

articleSchema.post('remove', doc => {
  cachegoose.clearCache('articles')
})

const Article = connection.model('Article', articleSchema)

module.exports = Article
