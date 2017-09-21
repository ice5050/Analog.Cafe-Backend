const express = require('express')
const Setting = require('../../models/mongo/setting')
const passport = require('passport')
const settingApp = express()

settingApp.get(
  '/settings',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    const setting = await Setting.findOne()
    res.json(setting.toObject())
  }
)

module.exports = settingApp
