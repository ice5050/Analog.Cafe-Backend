const express = require('express')
const { authenticationMiddleware } = require('../../helpers/authenticate')
const moment = require('moment')

const Favourite = require('../../models/mongo/favourite')
const Article = require('../../models/mongo/article')
const User = require('../../models/mongo/user')
const redisClient = require('../../helpers/redis')

const favouriteApp = express()

favouriteApp.get('/favourites', authenticationMiddleware, async (req, res) => {
  const page = req.query.page || 1
  const itemsPerPage = req.query['items-per-page'] || 10

  // TODO: import ability to sort by tags, authors, etc from Article app

  const favouritesDoc = (await Favourite.findOne({
    'user.id': req.user.id
  })) || { favourites: [] }
  const favouritesList = favouritesDoc.favourites
  const favouriteIds = favouritesList.map(item => item.id)

  const favouritedArticles = {
    id: { $in: favouriteIds }
  }
  let queries = [
    Article.find(favouritedArticles),
    Article.find(favouritedArticles)
  ]
  queries.map(q => q.find({ status: 'published' }))

  let [query, countQuery] = queries

  query
    .select(
      'id slug title subtitle stats submittedBy authors poster tag status summary date'
    )
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))
    .sort({ 'date.published': 'desc' })

  const articles = await query.exec()
  const count = await countQuery.count().exec()

  res.json({
    status: 'ok',
    page: {
      current: page,
      total: Math.ceil(count / itemsPerPage),
      'items-total': count,
      'items-per-page': itemsPerPage
    },
    items: articles
  })
})

favouriteApp.put('/favourite', authenticationMiddleware, async (req, res) => {
  const user = { id: req.user.id, name: req.user.title }
  const favouriteItem = {
    id: req.body.id,
    slug: req.body.slug,
    createdAt: moment().unix()
  }

  let favourite = await Favourite.findOne({ 'user.id': req.user.id })
  if (!favourite) {
    favourite = new Favourite({
      user,
      favourites: []
    })
    favourite = await favourite.save()
  }

  const savedFavourites = favourite.favourites || []
  if (
    savedFavourites.filter(favourite => favourite.id === favouriteItem.id)
      .length < 1
  ) {
    favourite.favourites = [...savedFavourites, favouriteItem]
    favourite = await favourite.save()
  }
  res.json(favourite.toObject())
})

favouriteApp.delete(
  '/favourite/:favouriteId',
  authenticationMiddleware,
  async (req, res) => {
    let favourite = await Favourite.findOne({ 'user.id': req.user.id })
    if (!favourite) {
      return res.status(404).json({
        message: 'No Favourites found for this user'
      })
    }

    const savedFavourites = favourite.favourites
    if (
      savedFavourites.filter(
        favourite => favourite.id === req.params.favouriteId
      ).length < 1
    ) {
      return res.status(404).json({
        message: 'This item is not in the favourites list for this user'
      })
    }

    favourite.favourites = savedFavourites.filter(
      favourite => favourite.id !== req.params.favouriteId
    )
    favourite = await favourite.save()
    res.json(favourite.toObject())
  }
)

module.exports = favouriteApp
