const mongoose = require('mongoose')
const connection = require('./index.js')
const timestamps = require('mongoose-timestamp-date-unix')

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
  poster: String,
  'post-date': String,
  tag: String,
  status: { type: String, default: 'published' },
  summary: String,
  content: Schema.Types.Mixed
})

articleSchema.plugin(timestamps)
const Article = connection.model('Article', articleSchema)

module.exports = Article
