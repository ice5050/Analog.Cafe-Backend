const express = require('express')
const passport = require('passport')
const Image = require('../../models/mongo/image')
const imageApp = express()

imageApp.get('/images/:imageId', async (req, res) => {
  const image = await Image.findOne({ id: req.params.imageId })
  if (!image) {
    return res.status(404).json({ message: 'Image not found' })
  }
  return res.json({
    status: 'ok',
    info: image,
    id: image.id
  })
})

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
