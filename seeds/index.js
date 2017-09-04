const Promise = require('bluebird')

const seeds = [
  ...require('./01_users')(),
  ...require('./02_articles')(),
  ...require('./03_images')(),
  ...require('./04_settings')()
]

console.log('Begin seeding')
Promise.all(seeds).then(() => {
  console.log('Finish seeding')
  process.exit()
})
