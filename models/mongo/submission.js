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
    submittedBy: {
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
    date: {
      created: String,
      updated: String
    },
    tag: String, // set after scheduling
    // Status: pending, scheduled, rejected, published, deleted
    // scheduled also means the submission has been approved
    status: { type: String, default: 'pending' },
    scheduledOrder: Number,
    summary: String,
    content: Schema.Types.Mixed
  },
  { strict: false }
)

// Timestamp
submissionSchema.pre('save', function (next) {
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

const Submission = connection.model('Submission', submissionSchema)

module.exports = Submission
