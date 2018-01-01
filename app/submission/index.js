const express = require('express')
const count = require('word-count')
const multipart = require('connect-multiparty')
const Submission = require('../../models/mongo/submission')
const User = require('../../models/mongo/user')
const redisClient = require('../../helpers/redis')
const submissionStatusUpdatedEmail = require('../../helpers/mailers/submission_updated')
const { authenticationMiddleware } = require('../../helpers/authenticate')
const {
  parseContent,
  parseHeader,
  rawImageCount,
  randomString,
  slugGenerator,
  uploadImgAsync,
  updateSubmissionAuthors
} = require('../../helpers/submission')

const submissionApp = express()
const multipartMiddleware = multipart()

/**
  * @swagger
  * /submissions:
  *   get:
  *     description: Get all submissions
  *     parameters:
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *              description:  Submission body
  *            - name: page
  *              in: query
  *              schema:
  *                type: integer
  *              description: Current page number.
  *            - name: items-per-page
  *              in: query
  *              schema:
  *                type: integer
  *              description: Number of items per one page.
  *     responses:
  *       200:
  *         description: Return submissions.
  */
submissionApp.get(
  '/submissions',
  authenticationMiddleware,
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
        'id slug title subtitle stats author authors poster articleId tag status scheduledOrder summary updatedAt createdAt'
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
      items: submissions.map(s => ({
        ...s.toObject(),
        'post-date': s.createdAt
      }))
    })
  }
)

/**
  * @swagger
  * /submissions/:submissionSlug:
  *   get:
  *     description: Get submission by slug
  *     parameters:
  *            - name: submissionSlug
  *              in: path
  *              schema:
  *                type: string
  *                required: true
  *              description: Submission slug.
  *     responses:
  *       200:
  *         description: Return a submission.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Submission not found.
  */
submissionApp.get(
  '/submissions/:submissionSlug',
  authenticationMiddleware,
  async (req, res) => {
    const submission = await Submission.findOne({
      slug: req.params.submissionSlug
    })
    if (!submission) {
      return res.status(404).json({
        message: 'Submission not found'
      })
    }
    if (req.user.role !== 'admin' && req.user.id !== submission.author.id) {
      return res.status(401).json({ message: 'No permission to access' })
    }
    res.json(submission.toObject())
  }
)

/**
  * @swagger
  * /submissions/status/:submissionId:
  *   get:
  *     description: Get submission upload status
  *     parameters:
  *            - name: submissionId
  *              in: path
  *              schema:
  *                type: string
  *                required: true
  *              description: Submission id.
  *     responses:
  *       200:
  *         description: Return a submission upload status.
  */
submissionApp.get('/submissions/status/:submissionId', async (req, res) => {
  const submissionId = req.params.submissionId
  const progress = await redisClient.getAsync(`${submissionId}_upload_progress`)
  res.json({ progress })
})

/**
  * @swagger
  * /submissions:
  *   post:
  *     description: Create submission
  *     parameters:
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *            - name: header
  *              in: query
  *              schema:
  *                type: object
  *                properties:
  *                  title:
  *                    type: string
  *                    required: true
  *                  subtitle:
  *                    type: string
  *              required: true
  *              description: Article header
  *            - name: content.
  *              in: query
  *              schema:
  *                type: object
  *                properties:
  *                  kind:
  *                    type: string
  *                  document:
  *                    type: object
  *                    properties:
  *                      kind:
  *                        type: string
  *                      nodes:
  *                        type: array
  *                        items:
  *                          type: object
  *                          properties:
  *                            type:
  *                              type: string
  *                            isVoid:
  *                              type: boolean
  *                            kind:
  *                              type: string
  *                            data:
  *                              type: object
  *                              properties:
  *                                src:
  *                                  type: string
  *                            nodes:
  *                              type: array
  *                              items:
  *                                type: object
  *                                properties:
  *                                  kind:
  *                                    type: string
  *                                  ranges:
  *                                    type: array
  *                                    items:
  *                                      type: object
  *                                      properties:
  *                                        text:
  *                                          type: string
  *                                          description: Article subtitle
  *                                        kind:
  *                                          type: string
  *                                        marks:
  *                                          type: array
  *              description:  Submission body
  *     responses:
  *       200:
  *         description: Created submission.
  */
submissionApp.post(
  '/submissions',
  multipartMiddleware,
  authenticationMiddleware,
  async (req, res) => {
    const content = parseContent(req.body.content)
    const header = parseHeader(req.body.header)
    const textContent = req.body.textContent
    const id = randomString()
    const newSubmission = new Submission({
      id,
      slug: slugGenerator(header.title, id),
      title: header.title,
      subtitle: header.subtitle,
      stats: {
        images: rawImageCount(content),
        words: count(textContent)
      },
      author: {
        id: req.user.id,
        name: req.user.title
      },
      summary: textContent.substring(0, 250),
      content: { raw: content }
    })
    const submission = await newSubmission.save()
    redisClient.set(`${newSubmission.id}_upload_progress`, '0')
    uploadImgAsync(req, res, newSubmission.id).then(updateSubmissionAuthors)
    res.json(submission.toObject())
  }
)

/**
  * @swagger
  * /submissions/:submissionId:
  *   put:
  *     description: Update submission
  *     parameters:
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *            - name: submissionId
  *              in: path
  *              schema:
  *                type: string
  *                required: true
  *                description: Submission id.
  *            - name: header
  *              in: query
  *              schema:
  *                type: object
  *                properties:
  *                  title:
  *                    type: string
  *                    required: true
  *                  subtitle:
  *                    type: string
  *              required: true
  *              description: Article header
  *            - name: content.
  *              in: query
  *              schema:
  *                type: object
  *                properties:
  *                  kind:
  *                    type: string
  *                  document:
  *                    type: object
  *                    properties:
  *                      kind:
  *                        type: string
  *                      nodes:
  *                        type: array
  *                        items:
  *                          type: object
  *                          properties:
  *                            type:
  *                              type: string
  *                            isVoid:
  *                              type: boolean
  *                            kind:
  *                              type: string
  *                            data:
  *                              type: object
  *                              properties:
  *                                src:
  *                                  type: string
  *                            nodes:
  *                              type: array
  *                              items:
  *                                type: object
  *                                properties:
  *                                  kind:
  *                                    type: string
  *                                  ranges:
  *                                    type: array
  *                                    items:
  *                                      type: object
  *                                      properties:
  *                                        text:
  *                                          type: string
  *                                          description: Article subtitle
  *                                        kind:
  *                                          type: string
  *                                        marks:
  *                                          type: array
  *              description:  Submission body
  *     responses:
  *       200:
  *         description: Created submission.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Submission not found.
  *       422:
  *         description: Submission can not be edited.
  */
submissionApp.put(
  '/submissions/:submissionId',
  authenticationMiddleware,
  async (req, res) => {
    let submission = await Submission.findOne({ id: req.params.submissionId })
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    if (req.user.role !== 'admin' && req.user.id !== submission.author.id) {
      return res.status(401).json({ message: 'No permission to access' })
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
    const rawText = req.body['composer-content-text'] || ''
    const id = randomString()

    submission = {
      ...submission,
      slug: slugGenerator(header.title, id),
      title: header.title,
      subtitle: header.subtitle,
      stats: {
        images: rawImageCount(content),
        words: count(rawText)
      },
      summary: rawText ? rawText.substring(0, 250) : undefined,
      content: { raw: content },
      status: req.user.role === 'admin' ? req.body.status : 'pending',
      tag: req.user.role === 'admin' ? req.body.tag : undefined
    }

    const isSubmissionModified = submission.isModified('status')
    const isSubmissionApprovedOrRejected = ['scheduled', 'rejected'].includes(
      submission.status
    )

    submission = await submission.save()
    if (!submission) {
      return res.status(422).json({ message: 'Submission can not be edited' })
    }

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

    redisClient.set(`${submission.id}_upload_progress`, '0')
    uploadImgAsync(req, res, submission.id).then(updateSubmissionAuthors)
    res.json(submission.toObject())
  }
)

/**
  * @swagger
  * /submissions/:submissionId/approve:
  *   post:
  *     description: Approve submission
  *     parameters:
  *            - name: submissionId
  *              in: path
  *              schema:
  *                type: string
  *                required: true
  *              description: Submission id.
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *            - name: scheduledOrder
  *              in: query
  *              schema:
  *                type: integer
  *                required: true
  *                description: Scheduling order
  *            - name: tag
  *              in: query
  *              schema:
  *                type: string
  *                description: Tag of the submission
  *     responses:
  *       200:
  *         description: Return a approved submission.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Submission not found.
  *       422:
  *         description: Submission can not be approved.
  */
submissionApp.post(
  '/submissions/:submissionId/approve',
  authenticationMiddleware,
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

/**
  * @swagger
  * /submissions/:submissionId/reject:
  *   post:
  *     description: Reject submission
  *     parameters:
  *            - name: submissionId
  *              in: path
  *              schema:
  *                type: string
  *                required: true
  *              description: Submission id.
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *              description:  Submission body
  *     responses:
  *       200:
  *         description: Return a rejected submission.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Submission not found.
  *       422:
  *         description: Submission can not be rejected.
  */
submissionApp.post(
  '/submissions/:submissionId/reject',
  authenticationMiddleware,
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
