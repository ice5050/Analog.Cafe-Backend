const express = require('express')
const shortid = require('shortid')
const User = require('../../models/mongo/user')
const Image = require('../../models/mongo/image')
const Submission = require('../../models/mongo/submission')
const Article = require('../../models/mongo/article')
const multipart = require('connect-multiparty')
const { toShowingObject, parseButtons } = require('../../helpers/user')
const cloudinary = require('../../helpers/cloudinary')
const { getImageRatio } = require('../../helpers/submission')
const { authenticationMiddleware } = require('../../helpers/authenticate')

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
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'No permission to access' })
  }

  const page = req.query.page || 1
  const itemsPerPage = Number(req.query['items-per-page']) || 10

  let queries = [User.find(), User.find()]

  let [query, countQuery] = queries

  query
    .select(
      'id title image text twitterId facebookId email role buttons suspend'
    )
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))
    .cache(300)

  const users = await query.exec()
  const count = await countQuery.count().exec()

  res.json({
    status: 'ok',
    page: {
      current: page,
      total: Math.ceil(count / itemsPerPage),
      'items-total': count,
      'items-per-page': itemsPerPage
    },
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
      user.title = req.body.title || user.title
      user.text = req.body.text || user.text
      user.image = (uploadedImage && uploadedImage.public_id) || user.image
      user.buttons = buttons || user.buttons
      const isTitleModified = user.isModified('title')
      await user.save()
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

module.exports = userApp
