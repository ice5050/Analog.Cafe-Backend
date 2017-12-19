const express = require('express')
const passport = require('passport')
const User = require('../../models/mongo/user')
const Image = require('../../models/mongo/image')
const imageSuggestedEmail = require('../../helpers/mailers/image_suggested')
const { authenticationMiddleware } = require('../../helpers/authenticate')
const imageApp = express()

/**
 * @swagger
 * /images/:imageId:
 *   get:
 *     description: Get image by id
 *     parameters:
 *            - name: imageId
 *              in: path
 *              schema:
 *                type: string
 *                description: Image id
 *                required: true
 *     responses:
 *       200:
 *         description: Return image information.
 *       404:
 *         description: Image not found.
 */
imageApp.get('/images/:imageId', async (req, res) => {
  const image = await Image.findOne({ id: req.params.imageId })
  if (!image) {
    return res.status(404).json({ message: 'Image not found' })
  }
  res.json({
    status: 'ok',
    info: image,
    id: image.id
  })
})

/**
 * @swagger
 * /images/:imageId:
 *   put:
 *     description: Update image full consent or basic consent.
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: imageId
 *              in: path
 *              schema:
 *                type: string
 *                description: Image id
 *                required: true
 *            - name: fullConsent
 *              in: query
 *              schema:
 *                type: boolean
 *                description: true for full-consent. false for basic-consent
 *                required: true
 *     responses:
 *       200:
 *         description: Upadate image successfully.
 *       401:
 *         description: No permission to access.
 *       404:
 *         description: Image not found.
 */
imageApp.put('/images/:imageId', authenticationMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'No permission to access' })
  }
  let image = await Image.findOne({ id: req.params.imageId })
  if (!image) {
    return res.status(404).json({ message: 'Image not found' })
  }
  image = {
    ...image,
    fullConsent: req.body.fullConsent
  }
  await image.save()
  res.json({ status: 'ok' })
})

/**
 * @swagger
 * /images/:imageId/feature:
 *   put:
 *     description: Set image to be feature image.
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: imageId
 *              in: path
 *              schema:
 *                type: string
 *                description: Image id
 *                required: true
 *     responses:
 *       200:
 *         description: Upadate image successfully.
 *       401:
 *         description: No permission to access.
 *       404:
 *         description: Image not found.
 *       422:
 *         description: Featured images can not be more than 8.
 */
imageApp.put(
  '/images/:imageId/feature',
  authenticationMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    const image = await Image.findOne({ id: req.params.imageId })
    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }
    const imageAuthor = await User.findOne({ id: image.author.id })
    const numberOfFeaturedImages = await Image.find({ featured: true })
      .count()
      .exec()
    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }
    if (numberOfFeaturedImages >= 8) {
      return res
        .status(422)
        .json({ message: 'Featured images can not be more than 8' })
    }
    image.featured = true
    await image.save()
    if (imageAuthor.email) {
      imageSuggestedEmail(imageAuthor.email, imageAuthor.title)
    }
    res.json({ status: 'ok' })
  }
)

/**
 * @swagger
 * /images/:imageId/unfeature:
 *   put:
 *     description: Unset feature image for this image.
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: imageId
 *              in: path
 *              schema:
 *                type: string
 *                description: Image id
 *                required: true
 *     responses:
 *       200:
 *         description: Upadate image successfully.
 *       401:
 *         description: No permission to access.
 *       404:
 *         description: Image not found.
 */
imageApp.put(
  '/images/:imageId/unfeature',
  authenticationMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    const image = await Image.findOne({ id: req.params.imageId })
    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }
    image.featured = false
    await image.save()
    res.json({ status: 'ok' })
  }
)

/**
 * @swagger
 * /images:
 *   get:
 *     description: Get all images.
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
 *                description: Number of items per one page.
 *     responses:
 *       200:
 *         description: Return images.
 */
imageApp.get('/images', authenticationMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'No permission to access' })
  }
  const page = req.query.page || 1
  const itemsPerPage = req.query['items-per-page'] || 10

  let [query, countQuery] = [Image.find(), Image.find()]

  query
    .select('id author fullConsent')
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))
    .cache(300)

  const images = await query.exec()
  const count = await countQuery.count().exec()

  res.json({
    status: 'ok',
    page: {
      current: page,
      total: Math.ceil(count / itemsPerPage),
      'items-total': count,
      'items-per-page': itemsPerPage
    },
    items: images
  })
})

/**
 * @swagger
 * /images/:imageId/delete:
 *   put:
 *     description: Delete image by image id (only admin).
 *     parameters:
 *            - name: Authorization
 *              in: header
 *              schema:
 *                type: string
 *                required: true
 *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
 *            - name: imageId
 *              in: path
 *              schema:
 *                type: string
 *                description: Image id
 *                required: true
 *     responses:
 *       200:
 *         description: Return images.
 *       401:
 *         description: No permission to access.
 *       404:
 *         description: Image not found.
 */
imageApp.put(
  '/images/:imageId/delete',
  authenticationMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    let image = await Image.findOne({ id: req.params.imageId })
    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }
    image = await image.remove()
    res.json({ status: 'ok' })
  }
)

module.exports = imageApp
