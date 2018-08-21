const Chance = require('chance')
const slugify = require('slugify')
const sizeOf = require('image-size')
const shortid = require('shortid')
const moment = require('moment')
const Image = require('../models/mongo/image')
const Article = require('../models/mongo/article')
const Submission = require('../models/mongo/submission')
const User = require('../models/mongo/user')
const redisClient = require('../helpers/redis')
const cloudinary = require('../helpers/cloudinary')
const imageRepostedEmail = require('../helpers/mailers/image_reposted')
const uploadRSSAndSitemap = require('../upload_rss_sitemap')
const submissionPublishedEmail = require('../helpers/mailers/submission_published')
const submissionRejectedEmail = require('../helpers/mailers/submission_rejected')

const chance = new Chance()

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

function getImageId (imageUrl) {
  return imageUrl
    .split('\\')
    .pop()
    .split('/')
    .pop()
    .replace(/\.[^/.]+$/, '')
}

function addImageURLToContent (key, imageId, rawContent) {
  rawContent.document.nodes
    .filter(node => node.data && node.data.key === key)
    .forEach(node => {
      node.data.src = imageId
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

function getFirstImage (rawContent) {
  return rawContent.document.nodes.find(node => node.type === 'image')
}

async function findExistingAuthors (srcs) {
  const imageOwners = await Image.find({
    id: {
      $in: srcs
    }
  })
    .distinct('author')
    .exec()
  return imageOwners
}

async function uploadImgAsync (req, res, submissionId) {
  const uploadedImgs = req.files.images
  const keys = uploadedImgs ? Object.keys(uploadedImgs) : []
  const numberOfImages = keys.length
  let submission = await Submission.findOne({
    id: submissionId
  })
  submission = await updateSubmissionAuthors(submission)
  const firstImage = getFirstImage(submission.content.raw)
  const isFirstImageSuggestion =
    firstImage.data &&
    firstImage.data.src &&
    !firstImage.data.src.includes('data:')
  if (isFirstImageSuggestion) {
    submission.poster = firstImage.data.src
    await submission.save()
  }
  if (numberOfImages === 0) {
    redisClient.set(`${submissionId}_upload_progress`, '100')
  }
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i]
    const imgPath = uploadedImgs[k].path
    const ratio = getImageRatio(imgPath)
    const hash = shortid.generate()
    const submission = await Submission.findOne({
      id: submissionId
    })
    const result = await cloudinary.v2.uploader.upload(imgPath, {
      public_id: `image-froth_${ratio}_${hash}`
    })
    const duplicatedImage = await Image.findOne({
      etag: result.etag
    })
    if (duplicatedImage) {
      await deleteImageFromCloudinary(result.public_id)
      addImageURLToContent(k, duplicatedImage.id, submission.content.raw)
      // If it's the first image, use it as the submission's poster
      if (i === 0 && !isFirstImageSuggestion) { submission.poster = duplicatedImage.id }
    } else {
      const image = new Image({
        id: result.public_id,
        author: {
          name: req.user.title,
          id: req.user.id
        },
        etag: result.etag,
        fullConsent: req.body.isFullConsent
      })
      await image.save()
      addImageURLToContent(k, image.id, submission.content.raw)
      if (i === 0 && !isFirstImageSuggestion) submission.poster = image.id
    }
    submission.markModified('content.raw')
    await submission.save()
    let progress = await redisClient.getAsync(`${submissionId}_upload_progress`)
    progress = Number(progress)
    redisClient.set(
      `${submissionId}_upload_progress`,
      ((Math.round(progress * numberOfImages / 100) + 1) *
        100 /
        numberOfImages
      ).toFixed(2)
    )
  }
  return submission
}

function sanitizeUsername (username) {
  if (!username) return null
  return username
    .split('@')[0]
    .toLowerCase()
    .replace(/\W/g, '.')
}

function rand5digit () {
  return Math.floor(Math.random() * 89999 + 10000)
}

/**
 * Get all image nodes from submission or article
 * @param {object} submission - submission object
 */
function imageNodesFromSubmission (submission) {
  return submission.content.raw.document.nodes.filter(
    node => node.type === 'image'
  )
}

async function updateSubmissionAuthors (submission) {
  const existingAuthors = await findExistingAuthors(
    imageNodesFromSubmission(submission).map(node => node.data.src)
  )
  submission.authors = [
    {
      ...submission.submittedBy.toObject(),
      authorship: 'article'
    },
    ...existingAuthors
      .filter(a => a.id !== submission.submittedBy.id)
      .map(a => ({
        ...a,
        authorship: 'photography'
      }))
  ]
  await submission.save()
  return submission
}

async function publish (submission) {
  let article
  if (submission.articleId) {
    article = Article.findOne({
      id: submission.articleId
    })
    article = {
      ...article.toObject(),
      title: submission.title,
      subtitle: submission.subtitle,
      stats: submission.toObject().stats,
      submittedBy: submission.toObject().submittedBy,
      authors: submission.authors,
      poster: submission.poster,
      tag: submission.tag,
      summary: submission.summary,
      content: submission.content,
      date: {
        published: moment().unix()
      },
      status: 'published'
    }
  } else {
    article = new Article({
      id: submission.id,
      slug: submission.slug,
      title: submission.title,
      subtitle: submission.subtitle,
      stats: submission.toObject().stats,
      submittedBy: submission.toObject().submittedBy,
      authors: submission.authors,
      poster: submission.poster,
      tag: submission.tag,
      summary: submission.summary,
      content: submission.content,
      date: {
        published: moment().unix()
      },
      status: 'published'
    })
    submission.articleId = submission.id
  }
  submission.status = 'published'
  article = await article.save()
  submission = await submission.save()
  const author = await User.findOne({
    id: submission.submittedBy.id
  })
  if (author.email) {
    submissionPublishedEmail(author, article)
  }
  // Send an email to the image owner that isn't the article owner
  submission.content.raw.document.nodes
    .filter(node => node.type === 'image')
    .map(node => node.data.src)
    .map(getImageId)
    .map(async id => {
      const image = await Image.findOne({ id })
      return image
    })
    .filter((image, index, self) => self.map(img => img.author.id).indexOf(image.author.id) === index)
    .map(async image => {
      const imageAuthor =
        image &&
        (await User.findOne({
          id: image.author.id
        }))
      if (
        image &&
        imageAuthor &&
        imageAuthor.email &&
        image.author.id !== submission.submittedBy.id
      ) {
        imageRepostedEmail(imageAuthor.email, imageAuthor.title, article)
      }
    })
  // Upload sitemap to S3
  if (process.env.API_DOMAIN_PROD === process.env.API_DOMAIN) {
    uploadRSSAndSitemap(
      process.env.API_DOMAIN,
      true,
      null,
      process.env.S3_BUCKET
    )
  }
  return submission
}

async function reject (submission) {
  submission.status = 'rejected'
  submission = await submission.save()
  const author = await User.findOne({
    id: submission.submittedBy.id
  })
  if (author.email) {
    submissionRejectedEmail(author)
  }
  return submission
}

function summarize (textContent) {
  return trimByCharToSentence(
    textContent
      .replace(/([.!?…])/g, '$1 ') // every common sentence ending always followed by a space
      .replace(/\s+$/, '') // remove any trailing spaces
      .replace(/^[ \t]+/, '') // remove any leading spaces
      .replace(/(\s{2})+/g, ' '), // remove any reoccuring (double) spaces
    250
  )
}

function trimByCharToSentence (text = '', chars = 0) {
  // string is broken down into sentences;
  // this is done by splitting it into array between
  // the most common sentence-ending punctuation marks:
  // period, exclaimation, ellipsis and question mark;
  // if string consists of a single statement, make an array
  // anyways
  const sentences = text.match(/[^\.!…\?]+[\.!…\?]+/g) || [text]
  // store
  let result = ''
  // cycle through sentences array
  sentences.forEach(sentence => {
    // if the `result` store isn't long enough
    // add a sentence, until we're out of available
    // sentences
    if (result.length < chars) result += sentence
  })
  // return the trimmed sentence or empty string as default
  return result
}

module.exports = {
  getImageRatio,
  parseContent,
  parseHeader,
  rawImageCount,
  randomString,
  slugGenerator,
  getImageId,
  addImageURLToContent,
  uploadImgAsync,
  sanitizeUsername,
  rand5digit,
  imageNodesFromSubmission,
  updateSubmissionAuthors,
  publish,
  reject,
  summarize
}
