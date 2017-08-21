const express = require('express')
const passport = require('passport')
const count = require('word-count')
const slugify = require('slugify')
const Submission = require('../../models/mongo/submission.js')
const Image = require('../../models/mongo/image.js')
const submissionApp = express()
const cloudinary = require('cloudinary')

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

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
  var text = ''
  for (var i = 0; i < raw.document.nodes.length; i++) {
    var nodeI = raw.document.nodes[i]
    text = text + ' ' // new line
    for (var j = 0; j < nodeI.nodes.length; j++) {
      var nodeJ = nodeI.nodes[j]
      for (var k = 0; k < nodeJ.ranges.length; k++) {
        var ranges = nodeJ.ranges[k]
        text = text + ranges.text
      }
    }
  }
  return text
}

function rawImageCount (raw) {
  var imgCount = 0
  for (var i = 0; i < raw.document.nodes.length; i++) {
    if (raw.document.nodes[i].type === 'image') {
      imgCount++
    }
  }
  return imgCount
}

function randomString (length) {
  var text = ''
  var charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return text
}

function slugGenerator (str) {
  return slugify(str) + randomString(4)
}

function getImageUrl (raw) {
  var image_urls = []
  for (var i = 0; i < raw.document.nodes.length; i++) {
    if (raw.document.nodes[i].type === 'image') {
      image_urls.push(raw.document.nodes[i].data.src)
    }
  }
  return image_urls
}

function getImageId (image_urls) {
  var image_ids = []
  for (var i = 0; i < image_urls.length; i++) {
    var id = image_urls[i].split('\\').pop().split('/').pop() // get rid of domain and pathname
    id = id.replace(/\.[^/.]+$/, "") // get rid of extension
    image_ids.push(id)
  }
  return image_ids
}

submissionApp.post(
  '/submissions',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var rawObj = req.body.raw
    if(typeof req.body.raw === 'string' || req.body.raw instanceof String){
      var rawObj = JSON.parse(req.body.raw)
    }
    var rawText = raw2Text(rawObj)
    var image_urls = getImageUrl(rawObj)
    const newSubmission = new Submission({
      slug: slugGenerator(req.body.title),
      title: req.body.title,
      subtitle: req.body.subtitle,
      stats: {
        images: rawImageCount(rawObj),
        words: count(rawText)
      },
      poster: {
        small: image_urls[0],
        medium: image_urls[0],
        large: image_urls[0]
      },
      author: req.user.id,
      summary: rawText.substring(0, 250),
      content: { raw: rawObj }
    })
    newSubmission.save().then(submission => {
      res.json({
        "info": {
          "image": "/images/banners/image-suggestions-action.jpg",
          "title": "More Exposure?",
          "text": "If you choose “Yes,” we may suggest other authors to feature your images within their articles. You will be credited every time.",
          "buttons" : [
            {
              "request": {
                "method": "get",
                "params": {
                  "images": getImageId(image_urls)
                },
                "url":  req.protocol + "://" + req.headers.host + "/api/submit/confirm_full_consent"
              },
              "to": "#1",
              "text": "Yes",
              "red": true

            },
            {
              "to": "#2",
              "text": "No"
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
    });
    cloudinary.uploader.upload(req.files.file.path, function(result) {
      var image = new Image({
        id: result.public_id,
        author: {
          name: req.user.title,
          id: req.user.id
        },
        fullConsent: false
      })
      image.save().then(function(){
        res.json({
          url: result.url
        })
      })

    });
  }
)

submissionApp.get('/submit/confirm_full_consent', (req, res) => {
  Image.update({ id: { "$in" : req.query.images } }, {$set: {"fullConsent": true}}, {"multi": true})
  .then(images => {
    res.sendStatus(200)
  })
})

module.exports = submissionApp
