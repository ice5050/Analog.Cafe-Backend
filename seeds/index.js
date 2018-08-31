const program = require('commander')
const Promise = require('bluebird')

program.option('-f, --file [value]', 'Specific seed file').parse(process.argv)

console.log(program.file)

let seeds = []
if (program.file) {
  seeds = require(program.file)()
} else {
  seeds = [
    ...require('./01_users')(),
    ...require('./02_articles')(),
    ...require('./03_images')(),
    ...require('./04_settings')(),
    ...require('./05_submissions')()
  ]
}

console.log('Begin seeding')
Promise.all(seeds).then(() => {
  console.log('Finish seeding')
  process.exit()
})
