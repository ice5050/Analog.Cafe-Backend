const express = require('express')
const shortid = require('shortid')
const User = require('../../models/mongo/user')
const Article = require('../../models/mongo/article')
const passport = require('passport')
const multipart = require('connect-multiparty')
const { toShowingObject, parseButtons } = require('../../helpers/user')
const cloudinary = require('../../helpers/cloudinary')
const { getImageRatio } = require('../../helpers/submission')

const userApp = express()
const multipartMiddleware = multipart()

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
  passport.authenticate('jwt', { session: false }),
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
    const user = await User.findOneAndUpdate(
      { id: req.user.id },
      {
        [req.body.title && 'title']: req.body.title,
        [req.body.text && 'text']: req.body.text,
        [uploadedImage && 'image']: uploadedImage.public_id,
        [buttons && 'buttons']: buttons
      },
      { new: true }
    )
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
  passport.authenticate('jwt', { session: false }),
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
      await Article.update({ 'author.id': user.id }, { status: 'suspended' })
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
  passport.authenticate('jwt', { session: false }),
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
    await Article.remove({ 'author.id': user.id })
    res.json({ status: 'ok' })
  }
)

module.exports = userApp
