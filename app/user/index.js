const express = require('express')
const User = require('../../models/mongo/user')
const Article = require('../../models/mongo/article')
const passport = require('passport')
const userApp = express()

// Editing his/her own profile
userApp.put(
  '/users/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.id !== req.body.id) {
      return res.json(401).json({ message: 'No permission to access' })
    }
    let user = await User.findOne(req.user.id)
    user = {
      ...user,
      id: req.body.id || user.id,
      title: req.body.title || user.title,
      image: req.body.image || user.image,
      text: req.body.text || user.text,
      buttons: req.body.buttons || user.buttons
    }
    user = await user.save()
    if (user) {
      res.json(user)
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
      return res.json(401).json({ message: 'No permission to access' })
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
      return res.json(401).json({ message: 'No permission to access' })
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
