const express = require('express')
const passport = require('passport')
const User = require('../../models/mongo/user')
const Image = require('../../models/mongo/image')
const imageSuggestedEmail = require('../../helpers/mailers/image_suggested')
const imageApp = express()

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

imageApp.put(
  '/images/:imageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
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
  }
)

imageApp.put(
  '/images/:imageId/feature',
  passport.authenticate('jwt', { session: false }),
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

imageApp.put(
  '/images/:imageId/unfeature',
  passport.authenticate('jwt', { session: false }),
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

imageApp.get(
  '/images',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
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
  }
)

// Delete image (only admin)
imageApp.put(
  '/images/:imageId/delete',
  passport.authenticate('jwt', { session: false }),
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
