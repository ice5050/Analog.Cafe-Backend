const express = require('express')
const Ad = require('../../models/mongo/ad')

const adApp = express()

adApp.get('/ads', async (req, res) => {
  const location = req.query.location
  const tag = req.query.tag

  if (!location) {
    return res.status(404).json({ message: '`location` param required' })
  }

  const ads = await Ad.find({ location })
    .limit(100)
    .sort({ 'price.usd': 'desc' })
    .cache(60 * 10) // cache ads for 10 min
    .exec()

  const items = ads.map(ad => {
    return {
      ...ad.toObject(),
      _id: undefined
    }
  })
  res.json({
    status: 'ok',
    items
  })
})

module.exports = adApp
