const express = require('express')
const sm = require('sitemap')
const Article = require('../../models/mongo/article')
const User = require('../../models/mongo/user')
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
  let articleRootUrl = '/r/'
  let articles = await Article.find({ status: 'published' })
    .select('slug')
    .cache(60 * 30) // Sitemap articles get cached for 30 minutes
    .exec()

  const condition = {
    $or: [{ role: 'contributor' }, { role: 'admin' }, { role: 'editor' }]
  }
  let authorRootUrl = '/u/'
  let authors = await User.find(condition)
    .select('id')
    .cache(60 * 30) // Sitemap users get cached for 30 minutes
    .exec()

  const articleUrls = [
    { url: '/' },
    { url: '/about' },
    { url: '/submit' },
    { url: '/subscribe' },
    { url: '/solo-projects' },
    { url: '/collaborations' },
    { url: '/photo-essays' },
    { url: '/film-photography' },
    { url: '/editorials' },
    { url: '/apps-and-downloads' },
    ...authors.map(u => ({ url: authorRootUrl + u.id })),
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
