const Promise = require('bluebird')
const User = require('../mongo/user')

async function migrate () {
  const users = await User.find().exec()

  const userProms = users.map(async u => {
    if (u.buttons) {
      u.buttons = u.buttons.map(b => ({
        ...b.toObject(),
        branded: b.toObject().red
      }))
      u = await u.save()
    }
    return u
  })

  return Promise.all(userProms)
}

async function app () {
  await migrate()
  console.log('User buttons migration: finished')
  process.exit()
}

app()
