const RSS = require('rss')
const articleFeed = new RSS({
  title: 'Analog.Cafe RSS feed: 30 Latest articles',
  description: 'Analog.Cafe RSS feed: 30 Latest articles',
  feed_url: 'https://api.analog.cafe/rss',
  site_url: 'https://analog.cafe',
  favicon: 'https://www.analog.cafe/favicon.ico',
  image_url: 'https://www.analog.cafe/apple-touch-icon-180x180.png',
  managingEditor: 'Analog.Cafe',
  copyright: 'Analog.Cafe',
  language: 'en',
  pubDate: new Date().toString(),
  generator: 'Analog.Cafe feed generator'
})

module.exports = articleFeed
