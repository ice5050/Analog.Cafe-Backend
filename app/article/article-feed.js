const RSS = require('rss')
const articleFeed = new RSS({
  title: 'Analog.Cafe',
  description: 'Analogue photography: film, cameras, art, and techniques.',
  feed_url: process.env.API_DOMAIN_PROD + '/rss',
  site_url: 'https://www.analog.cafe',
  favicon: 'https://www.analog.cafe/static/favicon.ico',
  image_url: 'https://www.analog.cafe/static/apple-icon-180x180.png',
  managingEditor: 'Dmitri',
  copyright: 'Analog.Cafe',
  language: 'en',
  pubDate: new Date().toString(),
  generator: 'Roast CMS feed generator'
})

module.exports = articleFeed
