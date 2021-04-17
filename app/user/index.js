const { revalidateOnArticleUpdate } = require('../../helpers/cache')

const express = require('express')
const fetch = require('isomorphic-unfetch')
const multipart = require('connect-multiparty')
const shortid = require('shortid')

const { authenticationMiddleware } = require('../../helpers/authenticate')
const { getImageRatio } = require('../../helpers/submission')
const { toShowingObject, parseButtons } = require('../../helpers/user')
const { upsertOneSendgrid } = require('../../helpers/email_list_manager')
const Article = require('../../models/mongo/article')
const Image = require('../../models/mongo/image')
const Submission = require('../../models/mongo/submission')
const User = require('../../models/mongo/user')
const cloudinary = require('../../helpers/cloudinary')

const userApp = express()
const multipartMiddleware = multipart()

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get all users.
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: page
 *              in: query
 *              schema:
 *                type: integer
 *                description: Current page number.
 *            - name: items-per-page
 *              in: query
 *              schema:
 *                type: integer
 *                description: Number of users per one page.
 *     responses:
 *       200:
 *         description: Return users.
 */
userApp.get('/users', authenticationMiddleware, async (req, res) => {
  let page = req.query.page || 1
  let itemsPerPage = Number(req.query['items-per-page']) || 10
  let querySelect =
    'id title image text twitterId twitterName facebookId facebookName email role buttons suspend'
  let sortBy = 'createdAt'
  let sortOrder = 'desc'

  const date = new Date()
  const today = Math.floor(+new Date().setHours(0, 0, 0, 0) / 1000)
  const now = Math.floor(+new Date() / 1000)
  const thisMonthsFirst =
    +new Date(date.getFullYear(), date.getMonth(), 1) / 1000
  const avgDaysInMonth = 30.4375

  // non-admin forced params
  if (req.user.role !== 'admin') {
    page = 1
    itemsPerPage = 10
    querySelect = 'role'
  }

  let queries = [User.find(), User.find()]
  let [query, countQuery] = queries
  query
    .select(querySelect)
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))
    .sort({ [sortBy]: sortOrder })
    .cache(300)

  const users = await query.exec()
  const count = await countQuery
    .cache(300)
    .countDocuments()
    .exec()

  // stats queries
  let statsQueries = { week: [], month: [] }
  for (var i = 0; i < 7; i++) {
    const mark = i ? today : now
    statsQueries.week.push(
      User.find({
        createdAt: {
          $gte: today - 60 * 60 * 24 * i + '',
          $lt: mark - 60 * 60 * 24 * (i - 1) + ''
        }
      }).cache(300)
    )
  }
  for (var i = 0; i < 24; i++) {
    const mark = i ? thisMonthsFirst : now
    statsQueries.month.push(
      User.find({
        createdAt: {
          $gte: thisMonthsFirst - 60 * 60 * 24 * avgDaysInMonth * i + '',
          $lt: mark - 60 * 60 * 24 * avgDaysInMonth * (i - 1) + ''
        }
      }).cache(300)
    )
  }

  const statsQueryPromises = { week: [], month: [] }
  statsQueries.week.forEach(async query =>
    statsQueryPromises.week.push(query.countDocuments().exec())
  )
  statsQueries.month.forEach(async query =>
    statsQueryPromises.month.push(query.countDocuments().exec())
  )
  const step24hr = await Promise.all(statsQueryPromises.week)
  step24hr.map((count, i) => {
    const mark = i ? today : now
    return {
      startsOn: mark - 60 * 60 * 24 * (i + 1),
      endsOn: mark - 60 * 60 * 24 * i,
      count: count
    }
  })
  const step30d = await Promise.all(statsQueryPromises.month)
  step30d.map((count, i) => {
    const mark = i ? thisMonthsFirst : now
    return {
      startsOn: mark - 60 * 60 * 24 * avgDaysInMonth * (i + 1),
      endsOn: mark - 60 * 60 * 24 * avgDaysInMonth * i,
      count: count
    }
  })

  res.json({
    status: 'ok',
    page: {
      current: page,
      total: req.user.role !== 'admin' ? 1 : Math.ceil(count / itemsPerPage),
      'items-total': req.user.role !== 'admin' ? itemsPerPage : count,
      'items-per-page': itemsPerPage
    },
    stats: req.user.role !== 'admin' ? {} : { step24hr, step30d },
    items: users
  })
})

/**
 * @swagger
 * /users/me:
 *   put:
 *     description: Editing his/her own profile
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: id
 *              in: query
 *              schema:
 *                type: string
 *                required: true
 *              description: User id.
 *            - name: title
 *              in: query
 *              schema:
 *                type: string
 *              description: User title.
 *            - name: image
 *              in: query
 *              schema:
 *                type: string
 *              description: User image profile.
 *            - name: text
 *              in: query
 *              schema:
 *                type: string
 *              description: User introduction.
 *            - name: buttons
 *              in: query
 *              schema:
 *                type: string
 *              description: User buttons.
 *     responses:
 *       200:
 *         description: Return edited user.
 *       401:
 *         description: No permission to access.
 *       422:
 *         description: User can not be edited.
 */
userApp.put(
  '/users/me',
  multipartMiddleware,
  authenticationMiddleware,
  async (req, res) => {
    let uploadedImage
    const buttons = parseButtons(req.body.buttons)
    if (req.files.image) {
      const imgPath = req.files.image.path
      const hash = shortid.generate()
      const ratio = getImageRatio(imgPath)
      uploadedImage = await cloudinary.v2.uploader.upload(imgPath, {
        public_id: `image-froth_${ratio}_${hash}`
      })
    }
    let user = await User.findOne({ id: req.user.id })
    if (user) {
      // update user in database
      user.title = req.body.title || user.title
      user.text = req.body.text || user.text
      user.image = (uploadedImage && uploadedImage.public_id) || user.image
      user.buttons = buttons || user.buttons
      const isTitleModified = user.isModified('title')
      await user.save()

      // update user title/name on SendGrid
      await upsertOneSendgrid({
        email: user.email,
        custom_fields: {
          w6_T: req.body.title || user.title,
          w2_T: user.id // make sure the ID is up to date
        }
      })

      // run jobs to update user credentials on all associated content
      if (isTitleModified) {
        await Image.update(
          { 'author.id': user.id },
          { 'author.name': user.title },
          { multi: true }
        )
        await Submission.update(
          { 'submittedBy.id': user.id },
          { 'submittedBy.name': user.title },
          { multi: true }
        )
        await Submission.update(
          { authors: { $elemMatch: { id: user.id } } },
          { $set: { 'authors.$.name': user.title } },
          { multi: true }
        )
        await Article.update(
          { 'submittedBy.id': user.id },
          { 'submittedBy.name': user.title },
          { multi: true }
        )
        await Article.update(
          { authors: { $elemMatch: { id: user.id } } },
          { $set: { 'authors.$.name': user.title } },
          { multi: true }
        )
      }
    }
    if (user) {
      res.json({ status: 'ok', info: toShowingObject(user) })
    } else {
      res.status(422).json({ message: 'User can not be edited' })
    }
  }
)

/**
 * @swagger
 * /users/:userId/suspend:
 *   put:
 *     description: Suspend user (only admin)
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: userId
 *              in: path
 *              schema:
 *                type: string
 *                required: true
 *              description: User id.
 *     responses:
 *       200:
 *         description: Return edited user.
 *       401:
 *         description: No permission to access.
 *       404:
 *         description: User not found.
 *       422:
 *         description: User can not be suspended.
 */
userApp.put(
  '/users/:userId/suspend',
  authenticationMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    let user = await User.findOne({ id: req.params.userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.suspend = true
    user = await user.save()
    if (user) {
      // Suspend all user's articles
      await Article.update(
        { 'submittedBy.id': user.id },
        { status: 'suspended' }
      )
      res.json(user)
    } else {
      res.status(422).json({ message: 'User can not be suspended' })
    }
  }
)

/**
 * @swagger
 * /users/:userId/delete:
 *   put:
 *     description: Delete user (only admin)
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: userId
 *              in: path
 *              schema:
 *                type: string
 *              description: User id.
 *     responses:
 *       200:
 *         description: Return edited user.
 *       401:
 *         description: No permission to access.
 *       404:
 *         description: User not found.
 */
userApp.put(
  '/users/:userId/delete',
  authenticationMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    let user = await User.findOne({ id: req.params.userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user = await user.remove()
    // Remove all user's articles
    await Article.remove({ 'submittedBy.id': user.id })
    res.json({ status: 'ok' })
  }
)

/**
 * @swagger
 * /admin/cache:
 *   delete:
 *     description: Clear CloudFlare cache
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: files
 *              in: body
 *              schema:
 *                type: array
 *              description: Array of urls to be purged from cache
 *     responses:
 *       200:
 *         description: Return cache status.
 *       401:
 *         description: No permission to access.
 */
userApp.delete('/admin/cache', authenticationMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'No permission to access' })
  }

  await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE}/purge_cache`,
    {
      method: 'DELETE',
      headers: {
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ files: req.body.files })
    }
  )
    .then(r => r.json())
    .then(response => {
      const { success, errors, messages } = response
      res.json({ status: 'ok', success, errors, messages })
    })
})

/**
 * @swagger
 * /admin/cache/redis/list:
 *   delete:
 *     description: Clear Redis cache for lists, inc. features
 *     parameters:
 *     responses:
 *       200:
 *         description: Return edited user.
 */
userApp.delete('/admin/cache/redis/list', (req, res) => {
  revalidateOnArticleUpdate()
  console.log('Sent request to invalidate Redis cache for lists.')
  res.json({
    status: 'ok',
    message: 'Sent request to invalidate Redis cache.'
  })
})

module.exports = userApp
