const express = require('express')
const sm = require('sitemap')
const Article = require('../../models/mongo/article')
const sitemapApp = express()

sitemapApp.get('/sitemap.xml', async (req, res) => {
  let articleRootUrl = '/zine/'
  let articles = await Article.find().select('slug').exec()

  const articleUrls = [
    { url: '/' },
    { url: '/photo-essays' },
    { url: '/articles' },
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
