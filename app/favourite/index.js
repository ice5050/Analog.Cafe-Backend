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

  let favouritesDoc = (await Favourite.findOne({
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

  let myFavouriteList = await Favourite.findOne({ 'user.id': req.user.id })
  if (!myFavouriteList) {
    myFavouriteList = new Favourite({
      user,
      favourites: []
    })
    myFavouriteList = await myFavouriteList.save()
  }

  const savedFavourites = myFavouriteList.favourites || []
  if (
    savedFavourites.filter(favourite => favourite.id === favouriteItem.id)
      .length < 1
  ) {
    myFavouriteList.favourites = [...savedFavourites, favouriteItem]
    myFavouriteList = await myFavouriteList.save()
  }
  res.json(myFavouriteList.toObject())
})

favouriteApp.get('/favourite', authenticationMiddleware, async (req, res) => {
  const articleId = req.query.article

  let myFavouriteList = await Favourite.findOne({ 'user.id': req.user.id })
  if (!myFavouriteList) {
    return res.status(404).json({
      message: 'No favourites found for this user'
    })
  }

  const savedFavourites = myFavouriteList.favourites
  const favourite = savedFavourites.filter(
    favourite => favourite.id === articleId
  )
  if (favourite.length < 1) {
    return res.json({
      id: articleId,
      slug: '',
      user: 0
    })
  }
  return res.json({
    id: articleId,
    slug: favourite[0].slug,
    user: favourite.length
  })
})

favouriteApp.delete(
  '/favourite/:favouriteId',
  authenticationMiddleware,
  async (req, res) => {
    let myFavouriteList = await Favourite.findOne({ 'user.id': req.user.id })
    if (!myFavouriteList) {
      return res.status(404).json({
        message: 'No Favourites found for this user'
      })
    }

    const savedFavourites = myFavouriteList.favourites

    myFavouriteList.favourites = savedFavourites.filter(
      favourite => favourite.id !== req.params.favouriteId
    )
    myFavouriteList = await myFavouriteList.save()
    res.json(myFavouriteList.toObject())
  }
)

module.exports = favouriteApp
