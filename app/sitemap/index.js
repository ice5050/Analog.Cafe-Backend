const express = require('express')
const sm = require('sitemap')
const Article = require('../../models/mongo/article')
const sitemapApp = express()

/**
 * @swagger
 * /sitemap.xml:
 *   get:
 *     description: Get sitemap.
 *     responses:
 *       200:
 *         description: Return sitemap xml.
 */
sitemapApp.get('/sitemap.xml', async (req, res) => {
  let articleRootUrl = '/zine/'
  let articles = await Article.find().select('slug').exec()

  const articleUrls = [
    { url: '/' },
    { url: '/photo-essays' },
    { url: '/film-photography' },
    { url: '/editorial' },
    ...articles.map(a => ({ url: articleRootUrl + a.slug }))
  ]

  const sitemap = sm.createSitemap({
    hostname: process.env.ANALOG_FRONTEND_URL,
    cacheTime: 600000,
    urls: articleUrls
  })

  sitemap.toXML((err, xml) => {
    if (err) {
      return res.status(500).end()
    }
    res.header('Content-Type', 'application/xml')
    res.send(xml)
  })
})

module.exports = sitemapApp
