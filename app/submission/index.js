const express = require('express')
const passport = require('passport')
const count = require('word-count')
const slugify = require('slugify')
const multipart = require('connect-multiparty')
const cloudinary = require('cloudinary')
const Chance = require('chance')
const Submission = require('../../models/mongo/submission.js')
const Image = require('../../models/mongo/image.js')
const WebSocket = require('ws')

const chance = new Chance()
const submissionApp = express()
const multipartMiddleware = multipart()

const wss = new WebSocket.Server({
  port: process.env.WEBSOCKET_PORT_UPLOAD_PROGRESS
})
let ws
wss.on('connection', _ws => {
  ws = _ws
})

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

submissionApp.post(
  '/submissions',
  multipartMiddleware,
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let content = req.body.content
    if (
      typeof req.body.content === 'string' ||
      req.body.content instanceof String
    ) {
      content = JSON.parse(req.body.content)
    }

    let header = req.body.header
    if (
      typeof req.body.header === 'string' ||
      req.body.header instanceof String
    ) {
      header = JSON.parse(req.body.header)
    }
    await uploadImgAsync(req, res, content)
    const rawText = raw2Text(content)
    const imageURLs = getImageUrl(content)
    const id = randomString()
    const newSubmission = new Submission({
      id,
      slug: slugGenerator(header.title, id),
      title: header.title,
      subtitle: header.subtitle,
      stats: {
        images: rawImageCount(content),
        words: count(rawText)
      },
      poster: {
        small: imageURLs[0],
        medium: imageURLs[0],
        large: imageURLs[0]
      },
      author: req.user.id,
      summary: rawText.substring(0, 250),
      content: { raw: content }
    })
    await newSubmission.save()
    res.sendStatus(200)
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

submissionApp.post(
  '/submissions/:submissionId/approve',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.json(401).json({ message: 'No permission to access' })
    }
    let submission = Submission.findOne({ id: req.params.submissionId })
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    const tag = req.body.tag
    submission.status = 'scheduled'
    submission.tag = tag
    submission = await submission.save()
    if (submission) {
      res.json(submission)
    } else {
      res.status(422).json({ message: 'Submission can not be approved' })
    }
  }
)

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

function slugGenerator (str, id) {
  return slugify(str) + (id || randomString(4))
}

function getImageUrl (raw) {
  return raw.document.nodes
    .filter(node => node.type === 'image')
    .map(imgNode => imgNode.data.src)
}

// function getImageId (imageURLs) {
//   return imageURLs.map(url =>
//     url
//       .split('\\')
//       .pop()
//       .split('/')
//       .pop()
//       .replace(/\.[^/.]+$/, '')
//   )
// }

function addUrlImageToContent (key, url, content) {
  content.document.nodes.filter(node => node.data.key === key).forEach(node => {
    node.data.src = url
    node.data.key = null
  })
}

async function uploadImgAsync (req, res, content) {
  const imgs = req.files.images
  if (imgs) {
    const keys = Object.keys(imgs)
    for (let i = 0; i < keys.length; i++) {
      await cloudinary.uploader.upload(imgs[keys[i]].path, async result => {
        ws.send((i + 1) / keys.length * 100)
        const image = new Image({
          id: result.public_id,
          author: {
            name: req.user.title,
            id: req.user.id
          },
          fullConsent: req.body.isFullConsent
        })
        content = addUrlImageToContent(keys[i], result.url, content)
        await image.save()
      })
    }
  }
}

module.exports = submissionApp
