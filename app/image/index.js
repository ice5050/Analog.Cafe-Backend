const express = require('express')
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
module.exports = imageApp
