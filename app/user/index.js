const express = require('express')
const User = require('../../models/mongo/user')
const Article = require('../../models/mongo/article')
const passport = require('passport')
const { toShowingObject } = require('../../helpers/user')
const cloudinary = require('../../helpers/cloudinary')

const userApp = express()

// Editing his/her own profile
userApp.put(
  '/users/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let uploadedImage
    if (req.body.image) {
      uploadedImage = await cloudinary.v2.uploader.upload(req.body.image)
    }
    const user = await User.findOneAndUpdate(
      { id: req.user.id },
      {
        [req.body.title && 'title']: req.body.title,
        [req.body.text && 'text']: req.body.text,
        [uploadedImage && 'image']: uploadedImage.url,
        [req.body.buttons && 'buttons']: req.body.buttons
      },
      { new: true }
    )
    if (user) {
      res.json({ status: 'ok', info: toShowingObject(user) })
    } else {
      res.status(422).json({ message: 'User can not be edited' })
    }
  }
)

// Suspend user (only admin)
userApp.put(
  '/users/:userId/suspend',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    let user = await User.findOne({ id: req.params.userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.suspend = true
    user = await user.save()
    if (user) {
      // Suspend all user's articles
      await Article.update({ 'author.id': user.id }, { status: 'suspended' })
      res.json(user)
    } else {
      res.status(422).json({ message: 'User can not be suspended' })
    }
  }
)

// Delete user (only admin)
userApp.put(
  '/users/:userId/delete',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    let user = await User.findOne({ id: req.params.userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user = await user.remove()
    // Remove all user's articles
    await Article.remove({ 'author.id': user.id })
    res.json({ status: 'ok' })
  }
)

module.exports = userApp
