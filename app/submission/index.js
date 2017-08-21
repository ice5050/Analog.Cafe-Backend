const express = require('express')
const passport = require('passport')
const count = require('word-count')
const slugify = require('slugify')
const multipart = require('connect-multiparty')
const cloudinary = require('cloudinary')
const Chance = require('chance')
const Submission = require('../../models/mongo/submission.js')
const Image = require('../../models/mongo/image.js')

const chance = new Chance()
const submissionApp = express()
const multipartMiddleware = multipart()

submissionApp.get('/submissions', (req, res) => {
  Submission.find().then(submissions => {
    res.json({ data: submissions })
  })
})

submissionApp.get('/submissions/:submissionId', (req, res) => {
  Submission.findOne({
    submissionId: req.params.submissionId
  }).then(submission => {
    res.json({ data: submission })
  })
})

function raw2Text (raw) {
  let text = ''
  for (let i = 0; i < raw.document.nodes.length; i++) {
    let nodeI = raw.document.nodes[i]
    text = text + ' ' // new line
    for (let j = 0; j < nodeI.nodes.length; j++) {
      let nodeJ = nodeI.nodes[j]
      for (let k = 0; k < nodeJ.ranges.length; k++) {
        let ranges = nodeJ.ranges[k]
        text = text + ranges.text
      }
    }
  }
  return text
}

function rawImageCount (raw) {
  return raw.document.nodes.filter(node => node.type === 'image').length
}

function randomString (length) {
  return chance.string({
    pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 4
  })
}

function slugGenerator (str) {
  return slugify(str) + randomString(4)
}

function getPoster (raw) {
  return raw.document.nodes
    .filter(node => node.type === 'image')
    .map(imgNode => ({
      small: imgNode.data.src,
      medium: imgNode.data.src,
      large: imgNode.data.src
    }))
}

submissionApp.post(
  '/submissions',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let rawObj = req.body.raw
    var rawText = raw2Text(rawObj)
    const newSubmission = new Submission({
      slug: slugGenerator(req.body.title),
      title: req.body.title,
      subtitle: req.body.subtitle,
      stats: {
        images: rawImageCount(rawObj),
        words: count(rawText)
      },
      poster: getPoster(rawObj),
      author: req.user.id,
      summary: rawText.substring(0, 250),
      content: { raw: rawObj }
    })
    newSubmission.save().then(submission => {
      res.json({ data: submission })
    })
  }
)

submissionApp.put('/submissions/:submissionId', (req, res) => {
  Submission.findOne({ submissionId: req.params.submissionId })
    .then(submission => {
      submission = Object.assign(submission, {
        title: req.body.title,
        subtitle: req.body.subtitle,
        stats: {
          images: req.body.images,
          words: req.body.words
        },
        poster: {
          small: req.body.poster.small,
          medium: req.body.poster.medium,
          large: req.body.poster.large
        },
        status: req.body.status,
        summary: req.body.summary,
        content: req.body.content
      })
      return submission.save()
    })
    .then(submission => {
      res.json({ data: submission })
    })
})

submissionApp.post(
  '/submissions/upload',
  multipartMiddleware,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    cloudinary.uploader.upload(req.files.file.path, result => {
      const image = new Image({
        id: result.public_id,
        author: {
          name: req.user.title,
          id: req.user.id
        }
      })
      image.save().then(() =>
        res.json({
          url: result.url
        })
      )
    })
  }
)

module.exports = submissionApp
