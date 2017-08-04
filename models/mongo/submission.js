const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const connection = require('./index.js')

const Schema = mongoose.Schema

const submissionSchema = new Schema({
  slug: String,
  title: String,
  subtitle: String,
  submissionId: Number,
  stats: {
    images: Number,
    words: Number
  },
  authorId: Number,
  articleId: Number,
  poster: {
    small: String,
    medium: String,
    large: String
  },
  tag: String,
  repostOk: Boolean,
  status: { type: String, default: 'pending' },
  summary: String,
  content: Schema.Types.Mixed
}, {
  timestamps: true
})

submissionSchema.plugin(autoIncrement.plugin, { model: 'Submission', field: 'submissionId', startAt: 1 })

const Submission = connection.model('Submission', submissionSchema)

module.exports = Submission
