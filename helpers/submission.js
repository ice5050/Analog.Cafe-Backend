const Chance = require('chance')
const slugify = require('slugify')
const cloudinary = require('cloudinary')
const sizeOf = require('image-size')
const shortid = require('shortid')
const Image = require('../models/mongo/image')

const chance = new Chance()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

function parseContent (content) {
  if (typeof content === 'string' || content instanceof String) {
    return JSON.parse(content)
  }
  return content
}

function parseHeader (header) {
  if (typeof header === 'string' || header instanceof String) {
    return JSON.parse(header)
  }
  return header
}

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

function getImageURLs (raw) {
  return raw.document.nodes
    .filter(node => node.type === 'image')
    .map(imgNode => imgNode.data.src)
}

function getImageId (imageUrl) {
  return imageUrl.split('\\').pop().split('/').pop().replace(/\.[^/.]+$/, '')
}

function addUrlImageToContent (key, url, content) {
  content.document.nodes.filter(node => node.data.key === key).forEach(node => {
    node.data.src = url
    node.data.key = null
  })
}

async function uploadImgAsync (req, res, content, ws) {
  let imgs = req.files.images
  if (imgs) {
    const keys = Object.keys(imgs)
    for (let i = 0; i < keys.length; i++) {
      const imgPath = imgs[keys[i]].path
      const dimension = sizeOf(imgPath)
      const ratio = (dimension.width / dimension.height * 1000000).toFixed(0)
      const hash = shortid.generate()
      await cloudinary.uploader.upload(
        imgPath,
        { public_id: `image-froth_${ratio}_${hash}` },
        async result => {
          ws.send((i + 1) / keys.length * 100)
          let image = new Image({
            id: result.public_id,
            author: {
              name: req.user.title,
              id: req.user.id
            },
            fullConsent: req.body.isFullConsent
          })
          addUrlImageToContent(keys[i], result.url, content)
          await image.save()
        }
      )
    }
  }
}

function sanitizeUsername (username) {
  if (!username) return null
  return username.split('@')[0].toLowerCase().replace(/\W/g, '.')
}

function rand5digit () {
  return Math.floor(Math.random() * 89999 + 10000)
}

module.exports = {
  parseContent,
  parseHeader,
  raw2Text,
  rawImageCount,
  randomString,
  slugGenerator,
  getImageURLs,
  getImageId,
  addUrlImageToContent,
  uploadImgAsync,
  sanitizeUsername,
  rand5digit
}
