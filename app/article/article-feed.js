const RSS = require('rss')
const articleFeed = new RSS({
  title: 'Analog.Cafe RSS feed: 30 Latest articles',
  description: 'Analog.Cafe RSS feed: 30 Latest articles',
  feed_url: 'https://www.analog.cafe/rss.xml',
  site_url: 'https://www.analog.cafe',
  managingEditor: '',
  webMaster: '',
  copyright: '',
  language: 'en',
  categories: [],
  pubDate: '',
  ttl: '60'
})

module.exports = articleFeed
