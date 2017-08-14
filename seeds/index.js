const Promise = require('bluebird')

const seeds = [
  ...require('./01_users')(),
  ...require('./02_articles')()
]

Promise.all(seeds).then(() => {
  process.exit()
})
