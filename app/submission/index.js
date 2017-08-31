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

submissionApp.post(
  '/submissions',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let rawObj = req.body.raw
    if (typeof req.body.raw === 'string' || req.body.raw instanceof String) {
      rawObj = JSON.parse(req.body.raw)
    }
    let rawText = raw2Text(rawObj)
    let imageURLs = getImageUrl(rawObj)
    const newSubmission = new Submission({
      slug: slugGenerator(req.body.title),
      title: req.body.title,
      subtitle: req.body.subtitle,
      stats: {
        images: rawImageCount(rawObj),
        words: count(rawText)
      },
      poster: {
        small: imageURLs[0],
        medium: imageURLs[0],
        large: imageURLs[0]
      },
      author: req.user.id,
      summary: rawText.substring(0, 250),
      content: { raw: rawObj }
    })
    newSubmission.save().then(submission => {
      res.json({
        info: {
          image: '/images/banners/image-suggestions-action.jpg',
          title: 'More Exposure?',
          text:
            'If you choose “Yes,” we may suggest other authors to feature your images within their articles. You will be credited every time.',
          buttons: [
            {
              request: {
                method: 'get',
                params: {
                  images: getImageId(imageURLs)
                },
                url: `${req.protocol}://${req.headers
                  .host}/api/submit/confirm_full_consent`
              },
              to: '#1',
              text: 'Yes',
              red: true
            },
            {
              to: '#2',
              text: 'No'
            }
          ]
        }
      })
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

submissionApp.get('/submit/confirm_full_consent', (req, res) => {
  Image.update(
    { id: { $in: req.query.images } },
    { $set: { fullConsent: true } },
    { multi: true }
  ).then(images => {
    res.sendStatus(200)
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

function getImageUrl (raw) {
  return raw.document.nodes
    .filter(node => node.type === 'image')
    .map(imgNode => imgNode.data.src)
}

function getImageId (imageURLs) {
  return imageURLs.map(url =>
    url.split('\\').pop().split('/').pop().replace(/\.[^/.]+$/, '')
  )
}

module.exports = submissionApp
