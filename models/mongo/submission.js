const mongoose = require('mongoose')
const connection = require('./index.js')
const timestamps = require('mongoose-timestamp-date-unix')

const Schema = mongoose.Schema

const submissionSchema = new Schema({
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
  articleId: String,
  poster: String,
  tag: String, // set after scheduling
  // Status: pending, scheduled, rejected, published
  // scheduled also means the submission has been approved
  status: { type: String, default: 'pending' },
  scheduledOrder: Number,
  summary: String,
  content: Schema.Types.Mixed
})

submissionSchema.plugin(timestamps)
const Submission = connection.model('Submission', submissionSchema)

module.exports = Submission
