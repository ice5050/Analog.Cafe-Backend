const express = require('express')
const passport = require('passport')
const count = require('word-count')
const multipart = require('connect-multiparty')
const Submission = require('../../models/mongo/submission')
const User = require('../../models/mongo/user')
const Image = require('../../models/mongo/image')
const WebSocket = require('ws')
const submissionStatusUpdatedEmail = require('../../helpers/mailers/submission_updated')
const {
  parseContent,
  parseHeader,
  raw2Text,
  rawImageCount,
  randomString,
  slugGenerator,
  getImageUrl,
  uploadImgAsync
} = require('../../helpers/submission')

const submissionApp = express()
const multipartMiddleware = multipart()

const wss = new WebSocket.Server({
  port: process.env.WEBSOCKET_PORT_UPLOAD_PROGRESS
})
let ws
wss.on('connection', _ws => {
  ws = _ws
})

submissionApp.get(
  '/submissions',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const page = req.query.page || 1
    const itemsPerPage = req.query['items-per-page'] || 10

    let queries = [Submission.find(), Submission.find()]
    if (!['admin', 'editor'].includes(req.user.role)) {
      queries = queries.map(q => q.find({ 'author.id': req.user.id }))
    }
    let [query, countQuery] = queries

    query
      .select(
        'id slug title subtitle stats author poster articleId tag status scheduledOrder summary updatedAt createdAt'
      )
      .limit(itemsPerPage)
      .skip(itemsPerPage * (page - 1))
      .sort({ updatedAt: 'desc' })

    const submissions = await query.exec()
    const count = await countQuery.count().exec()

    res.json({
      status: 'ok',
      page: {
        current: page,
        total: Math.ceil(count / itemsPerPage),
        'items-total': count,
        'items-per-page': itemsPerPage
      },
      items: submissions
    })
  }
)

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
    let content = parseContent(req.body.content)
    let header = parseHeader(req.body.header)
    let rawText = raw2Text(content)
    let id = randomString()
    await uploadImgAsync(req, res, content, ws) // and add image url to content
    let imageURLs = getImageUrl(content) // Do after add image url to content
    let newSubmission = new Submission({
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
      author: {
        id: req.user.id,
        name: req.user.title
      },
      summary: rawText.substring(0, 250),
      content: { raw: content }
    })
    await newSubmission.save()
    res.sendStatus(200)
  }
)

submissionApp.put(
  '/submissions/:submissionId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let submission = Submission.findOne({
      id: req.params.submissionId
    })
    if (req.user.role !== 'admin' && req.user.id !== submission.author.id) {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    if (
      req.user.id === submission.author.id &&
      submission.status === 'pending'
    ) {
      return res
        .status(401)
        .json({ message: 'No permission to edit pending submission' })
    }

    const author = await User.findOne({ id: submission.author.id })
    const content = parseContent(req.body.content)
    const header = parseHeader(req.body.content)
    const rawText = content ? raw2Text(content) : undefined
    const imageURLs = content ? getImageUrl(content) : undefined

    submission = {
      ...submission,
      title: header.title,
      subtitle: header.subtitle,
      stats: {
        images: rawImageCount(content),
        words: count(rawText)
      },
      poster: imageURLs
        ? {
          small: imageURLs[0],
          medium: imageURLs[0],
          large: imageURLs[0]
        }
        : undefined,
      summary: rawText ? rawText.substring(0, 250) : undefined,
      content: req.body.content,
      status: req.user.role === 'admin' ? req.body.status : 'pending',
      tag: req.user.role === 'admin' ? req.body.tag : undefined
    }

    const isSubmissionModified = submission.isModified('status')
    const isSubmissionApprovedOrRejected = ['scheduled', 'rejected'].includes(
      submission.status
    )

    submission = await submission.save()
    if (!submission) {
      if (
        isSubmissionModified &&
        isSubmissionApprovedOrRejected &&
        author.email
      ) {
        submissionStatusUpdatedEmail(
          author.email,
          author.title,
          submission.status
        )
      }
      return res.status(422).json({ message: 'Submission can not be edited' })
    }
    res.json(submission.toObject())
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
      return res.status(401).json({ message: 'No permission to access' })
    }
    let submission = await Submission.findOne({ id: req.params.submissionId })
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    submission.status = 'scheduled'
    submission.scheduledOrder = req.body.scheduledOrder
    submission.tag = req.body.tag
    submission = await submission.save()
    if (submission) {
      res.json(submission)
    } else {
      res.status(422).json({ message: 'Submission can not be approved' })
    }
  }
)

submissionApp.post(
  '/submissions/:submissionId/reject',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    let submission = await Submission.findOne({ id: req.params.submissionId })
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    submission.status = 'rejected'
    submission = await submission.save()
    if (submission) {
      res.json(submission)
    } else {
      res.status(422).json({ message: 'Submission can not be rejected' })
    }
  }
)

module.exports = submissionApp
