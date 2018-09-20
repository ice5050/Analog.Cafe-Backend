const count = require('word-count')
const express = require('express')
const multipart = require('connect-multiparty')

const { authenticationMiddleware } = require('../../helpers/authenticate')
const {
  parseContent,
  parseHeader,
  rawImageCount,
  randomString,
  slugGenerator,
  uploadImgAsync,
  publish,
  reject,
  summarize
} = require('../../helpers/submission')
const Submission = require('../../models/mongo/submission')
const User = require('../../models/mongo/user')
const redisClient = require('../../helpers/redis')

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
    const sort =
      req.query.sort &&
      (str =>
        str.match(/^-.*/g)
          ? { [`date.${str.substring(1)}`]: 'desc' }
          : { [`date.${str}`]: 'asc' })(req.query.sort)
    const status = req.query.status

    let queries = [Submission.find(), Submission.find()]
    queries.map(q => q.find({ status: { $ne: 'deleted' } }))
    if (!['admin', 'editor'].includes(req.user.role)) {
      queries = queries.map(q => q.find({ 'submittedBy.id': req.user.id }))
    }
    if (status) {
      queries = queries.map(q => q.find({ status: status }))
    }
    let [query, countQuery] = queries

    query
      .select(
        'id slug title subtitle stats submittedBy authors poster articleId tag status scheduledOrder summary date'
      )
      .limit(itemsPerPage)
      .skip(itemsPerPage * (page - 1))

    if (sort) {
      query.sort(sort)
    } else {
      query.sort({ 'date.created': 'desc' })
    }

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
        date: {
          ...s.date,
          published: s.date.created
        }
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
    if (
      req.user.role !== 'admin' &&
      req.user.id !== submission.submittedBy.id
    ) {
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
      submittedBy: {
        id: req.user.id,
        name: req.user.title
      },
      summary: summarize(textContent),
      content: { raw: content }
    })
    const submission = await newSubmission.save()
    redisClient.set(`${newSubmission.id}_upload_progress`, '0')
    uploadImgAsync(req, res, newSubmission.id)
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
  multipartMiddleware,
  authenticationMiddleware,
  async (req, res) => {
    let submission = await Submission.findOne({ id: req.params.submissionId })
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    if (
      req.user.role !== 'admin' &&
      req.user.id !== submission.submittedBy.id
    ) {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (req.user.role !== 'admin' && submission.status === 'pending') {
      return res
        .status(401)
        .json({ message: 'No permission to edit pending submission' })
    }

    const content = parseContent(req.body.content)
    const header = parseHeader(req.body.header)
    const title = header && header.title
    const subtitle = header && header.subtitle
    const textContent = req.body.textContent
    const tag = req.body.tag
    const status = req.body.status
    const scheduledOrder = req.body.scheduledOrder

    submission = Object.assign(submission, {
      [title ? 'title' : undefined]: title,
      [subtitle ? 'subtitle' : undefined]: subtitle,
      [content && textContent ? 'stats' : undefined]: {
        images: rawImageCount(content),
        words: count(textContent)
      },
      [textContent ? 'summary' : undefined]: textContent
        ? summarize(textContent)
        : undefined,
      [content ? 'content' : undefined]: { raw: content },
      [status ? 'status' : undefined]: req.body.status,
      [scheduledOrder ? 'scheduledOrder' : undefined]: req.body.scheduledOrder,
      [tag ? 'tag' : undefined]: req.user.role === 'admin' ? tag : undefined
    })

    submission = await submission.save()
    if (!submission) {
      return res.status(422).json({ message: 'Submission can not be edited' })
    }

    redisClient.set(`${submission.id}_upload_progress`, '0')
    uploadImgAsync(req, res, submission.id)
    res.json(submission.toObject())
  }
)

/**
  * @swagger
  * /submissions/order/:submissionId:
  *   put:
  *     description: Update submission schedule order
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
  *            - name: scheduledOrder
  *              in: body
  *              schema:
  *                type: integer
  *                required: true
  *                description: Schedule order.
  *     responses:
  *       200:
  *         description: Updated submission schedule order.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Submission not found.
  *       422:
  *         description: Submission can not be edited.
  */
submissionApp.put(
  '/submissions/order/:submissionId',
  authenticationMiddleware,
  async (req, res) => {
    let submission = await Submission.findOne({ id: req.params.submissionId })
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    if (
      req.user.role !== 'admin' &&
      req.user.id !== submission.submittedBy.id
    ) {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (!req.body.scheduledOrder) {
      return res.status(401).json({ message: 'No schedule order' })
    }

    const oldOrder = submission.scheduledOrder
    const newOrder = req.body.scheduledOrder

    submission.scheduledOrder = newOrder

    if (oldOrder < newOrder) {
      await Submission.update(
        { scheduledOrder: { $gt: oldOrder, $lte: newOrder } },
        { $inc: { scheduledOrder: -1 } },
        { multi: true }
      )
    } else {
      await Submission.update(
        { scheduledOrder: { $gte: newOrder, $lt: oldOrder } },
        { $inc: { scheduledOrder: 1 } },
        { multi: true }
      )
    }

    submission = await submission.save()
    if (!submission) {
      return res.status(422).json({ message: 'Submission can not be edited' })
    }

    res.json(submission.toObject())
  }
)

/**
  * @swagger
  * /submissions/order/:submissionId:
  *   delete:
  *     description: Remove submission from publishing queue
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
  *     responses:
  *       200:
  *         description: Removed the submission from the queue.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Submission not found.
  *       422:
  *         description: Submission can not be edited.
  */
submissionApp.delete(
  '/submissions/order/:submissionId',
  authenticationMiddleware,
  async (req, res) => {
    let submission = await Submission.findOne({ id: req.params.submissionId })
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }
    if (
      req.user.role !== 'admin' &&
      req.user.id !== submission.submittedBy.id
    ) {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (!req.body.scheduledOrder) {
      return res.status(401).json({ message: 'No schedule order' })
    }

    const scheduledOrder = submission.scheduledOrder

    await Submission.update(
      { scheduledOrder: { $gt: scheduledOrder } },
      { $inc: { scheduledOrder: -1 } },
      { multi: true }
    )

    submission.scheduledOrder = null
    submission.status = 'pending'
    submission = await submission.save()
    if (!submission) {
      return res.status(422).json({ message: 'Submission can not be edited' })
    }

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
  *              in: body
  *              schema:
  *                type: integer
  *                required: true
  *                description: Scheduling order, NOTE a value of 0 will publish the submission immediately, bypassing the queue; value of 1 would place submission AT THE FRONT of the queue
  *            - name: tag
  *              in: body
  *              schema:
  *                type: string
  *                example: "photo-essay"
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
    if (submission.status !== 'pending') {
      return res
        .status(422)
        .json({ message: 'Only pending submission can be approved' })
    }

    const author = await User.findOne({ id: submission.submittedBy.id })
    if (author.role !== 'admin' && author.role !== 'editor') {
      author.role = 'contributor'
    }
    await author.save()

    submission.status = 'scheduled'
    submission.scheduledOrder = req.body.scheduledOrder
    submission.tag = req.body.tag
    submission = await submission.save()
    if (Number(req.body.scheduledOrder) === 0) {
      submission = await publish(submission)
    }

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
    if (submission.status !== 'pending') {
      return res
        .status(422)
        .json({ message: 'Only pending submission can be rejected' })
    }

    submission = await reject(submission)
    if (submission) {
      res.json(submission)
    } else {
      res.status(422).json({ message: 'Submission can not be rejected' })
    }
  }
)

/**
  * @swagger
  * /submissions/:submissionId:
  *   delete:
  *     description: Delete a submission
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
  *                description: submission id.
  *     responses:
  *       200:
  *         description: Deleted submission successfully.
  *       401:
  *         description: No permission to access.
  *       404:
  *         description: Submission not found.
  *       422:
  *         description: Submission can not be deleted.
  */
submissionApp.delete(
  '/submissions/:submissionId',
  authenticationMiddleware,
  async (req, res) => {
    let submission = await Submission.findOne({ id: req.params.submissionId })
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    submission.status = 'deleted'

    submission = await submission.save()
    if (!submission) {
      return res.status(422).json({ message: 'Submission can not be edited' })
    }
    res.status(200).json({ message: 'Submission has been deleted' })
  }
)

module.exports = submissionApp
