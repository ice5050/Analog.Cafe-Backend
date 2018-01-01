const mongoose = require('mongoose')
const connection = require('./index.js')
const timestamps = require('mongoose-timestamp-date-unix')
const cachegoose = require('cachegoose')

const Schema = mongoose.Schema

const articleSchema = new Schema({
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
  'post-date': String,
  tag: String,
  // Status: published, deleted
  status: { type: String, default: 'published' },
  summary: String,
  content: Schema.Types.Mixed
})

articleSchema.plugin(timestamps)

// Cache clearing
articleSchema.post('save', article => {
  cachegoose.clearCache('articles')
})

articleSchema.post('remove', doc => {
  cachegoose.clearCache('articles')
})

const Article = connection.model('Article', articleSchema)

module.exports = Article
