const Promise = require('bluebird')
const collections = [
  require('../models/mongo/article'),
  require('../models/mongo/image'),
  require('../models/mongo/submission'),
  require('../models/mongo/user')
]

const dropCollection = collection =>
  new Promise(resolve => {
    collection.drop(() => {
      resolve()
    })
  })

console.log('Start cleaning database')
const dropColPromises = collections.map(model => {
  console.log(`Drop collection: ${model.modelName}`)
  return dropCollection(model.collection)
})

Promise.all(dropColPromises).then(() => {
  console.log('Finish cleaning database')
  process.exit()
})
