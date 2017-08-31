const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const submissionSchema = new Schema(
  {
    id: String,
    slug: String,
    title: String,
    subtitle: String,
    stats: {
      images: Number,
      words: Number
    },
    author: String,
    articleId: String,
    poster: {
      small: String,
      medium: String,
      large: String
    },
    tag: String,
    status: { type: String, default: 'pending' },
    summary: String,
    content: Schema.Types.Mixed
  },
  {
    timestamps: true
  }
)

const Submission = connection.model('Submission', submissionSchema)

module.exports = Submission
