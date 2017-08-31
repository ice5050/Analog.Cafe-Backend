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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

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

function getImageUrl (raw) {
  return raw.document.nodes
    .filter(node => node.type === 'image')
    .map(imgNode => imgNode.data.src)
}

function getImageId (imageURLs) {
  return imageURLs.map(url =>
    url
      .split('\\')
      .pop()
      .split('/')
      .pop()
      .replace(/\.[^/.]+$/, '')
  )
}

function addUrlImageToContent (key, url, content) {
  var nodes = content.document.nodes
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].data.key == key) {
      nodes[i].data.src = url
      nodes[i].data.key = null
      return content
    }
  }
}

function uploadImgAsync (req, res, i, content, next) {
  var imgs = req.files.images
  var keys = Object.keys(req.files.images)
  cloudinary.uploader.upload(imgs[keys[i]].path, result => {
    const image = new Image({
      id: result.public_id,
      author: {
        name: req.user.title,
        id: req.user.id
      },
      fullConsent: req.body.isFullConsent
    })
    content = addUrlImageToContent(keys[i], result.url, content)
    image.save().then(() => {
      if (i + 1 < keys.length) {
        uploadImgAsync(req, res, i + 1, content, next)
      } else {
        next(content)
      }
    })
  })
}

submissionApp.post(
  '/submissions',
  multipartMiddleware,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var content = req.body.content
    if (
      typeof req.body.content === 'string' ||
      req.body.content instanceof String
    ) {
      content = JSON.parse(req.body.content)
    }

    var header = req.body.header
    if (
      typeof req.body.header === 'string' ||
      req.body.header instanceof String
    ) {
      header = JSON.parse(req.body.header)
    }

    uploadImgAsync(req, res, 0, content, rawObj => {
      var rawText = raw2Text(rawObj)
      var imageURLs = getImageUrl(rawObj)
      var newSubmission = new Submission({
        slug: slugGenerator(header.title),
        title: header.title,
        subtitle: header.subtitle,
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
        res.sendStatus(200)
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
    url
      .split('\\')
      .pop()
      .split('/')
      .pop()
      .replace(/\.[^/.]+$/, '')
  )
}

module.exports = submissionApp
