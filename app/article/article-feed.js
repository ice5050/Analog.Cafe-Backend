const Feed = require('feed')
const articleFeed = new Feed({
  title: 'Analog.Cafe RSS feed: 30 Latest articles',
  description: 'Analog.Cafe RSS feed: 30 Latest articles',
  feedLinks: {
    rss: 'https://api.analog.cafe/rss'
  },
  favicon: 'https://www.analog.cafe/favicon.ico',
  id: 'https://www.analog.cafe',
  link: 'https://www.analog.cafe',
  image: 'https://www.analog.cafe/apple-touch-icon-180x180.png',
  copyright: 'Analog.Cafe',
  updated: new Date(),
  generator: 'Analog.Cafe feed generator'
})

module.exports = articleFeed
