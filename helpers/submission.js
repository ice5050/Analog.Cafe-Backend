const Chance = require('chance')
const slugify = require('slugify')
const cloudinary = require('cloudinary')
const sizeOf = require('image-size')
const shortid = require('shortid')
const Image = require('../models/mongo/image')
const Submission = require('../models/mongo/submission')
const redisClient = require('../helpers/redis')

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
  return slugify(str).toLowerCase() + '-' + (id || randomString(4))
}

function getImageURLs (raw) {
  return raw.document.nodes
    .filter(node => node.type === 'image')
    .map(imgNode => imgNode.data.src)
}

function getImageId (imageUrl) {
  return imageUrl.split('\\').pop().split('/').pop().replace(/\.[^/.]+$/, '')
}

function addImageURLToContent (key, url, rawContent) {
  rawContent.document.nodes
    .filter(node => node.data && (node.data.key === key))
    .forEach(node => {
      node.data.src = url
      node.data.key = null
    })
}

function getImageRatio (imgPath) {
  const dimension = sizeOf(imgPath)
  return (dimension.width / dimension.height * 1000000).toFixed(0)
}

async function deleteImageFromCloudinary (publicId) {
  await cloudinary.v2.uploader.destroy(publicId)
}

async function uploadImgAsync (req, res, submissionId) {
  const imgs = req.files.images
  const keys = imgs ? Object.keys(imgs) : []
  const numberOfImages = keys.length
  keys.map(async (k, i) => {
    const imgPath = imgs[k].path
    const ratio = getImageRatio(imgPath)
    const hash = shortid.generate()
    const submission = await Submission.findOne({ id: submissionId })
    const result = await cloudinary.v2.uploader.upload(
      imgPath, { public_id: `image-froth_${ratio}_${hash}` }
    )
    const duplicatedImage = await Image.findOne({ etag: result.etag })
    if (duplicatedImage) {
      await deleteImageFromCloudinary(result.public_id)
      addImageURLToContent(k, duplicatedImage.url, submission.content.raw)
    } else {
      const image = new Image({
        id: result.public_id,
        url: result.url,
        author: { name: req.user.title, id: req.user.id },
        etag: result.etag,
        fullConsent: req.body.isFullConsent
      })
      await image.save()
      addImageURLToContent(k, image.url, submission.content.raw)
    }
    await submission.save()
    let progress = await redisClient.getAsync(`${submissionId}_upload_progress`)
    progress = Number(progress)
    redisClient.set(
      `${submissionId}_upload_progress`,
      ((Math.ceil(progress / 100 * numberOfImages) + 1) / numberOfImages * 100).toFixed(2)
    )
  })
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
  rawImageCount,
  randomString,
  slugGenerator,
  getImageURLs,
  getImageId,
  addImageURLToContent,
  uploadImgAsync,
  sanitizeUsername,
  rand5digit
}
