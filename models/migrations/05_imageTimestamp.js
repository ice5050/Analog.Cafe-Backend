const Promise = require('bluebird')
const Image = require('../mongo/image')

async function migrate () {
  const images = await Image.find({ createdAt: null }).exec()

  const imageProms = images.map(async i => {
    const now = Number(new Date())
    i.createdAt = now
    i.updatedAt = now
    i = await i.save()
    return i
  })

  return Promise.all(imageProms)
}

async function app () {
  await migrate()
  console.log('Image timestamp migration: finished')
  process.exit()
}

app()
