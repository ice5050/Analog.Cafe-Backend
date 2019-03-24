const express = require('express')
const { authenticationMiddleware } = require('../../helpers/authenticate')

const Favourite = require('../../models/mongo/submission')
const User = require('../../models/mongo/user')
const redisClient = require('../../helpers/redis')

const favouriteApp = express()

favouriteApp.get('/favourites', authenticationMiddleware, async (req, res) => {
  res.json({
    status: 'ok'
  })
})

module.exports = favouriteApp
