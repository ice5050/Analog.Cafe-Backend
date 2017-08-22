const collections = [
  require('../models/mongo/article'),
  require('../models/mongo/image'),
  require('../models/mongo/submission'),
  require('../models/mongo/user')
]

console.log('Start cleaning database')
collections.map(model => {
  console.log(`Drop collection: ${model.modelName}`)
  model.collection.drop()
})
console.log('Finish cleaning database')

process.exit()
