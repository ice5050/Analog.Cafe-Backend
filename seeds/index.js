const Promise = require('bluebird')

const seeds = [
  ...require('./01_users')(),
  ...require('./02_articles')(),
  ...require('./03_images')()
]

Promise.all(seeds).then(() => {
  process.exit()
})
