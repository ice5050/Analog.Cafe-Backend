const express = require('express')
const User = require('../../models/mongo/user.js')
const { toShowingObject } = require('../../helpers/user')
const authorApp = express()

/**
 * @swagger
 * /authors:
 *   get:
 *     description: Get all published authors
 *     responses:
 *       200:
 *         description: Return authors.
 */
authorApp.get('/authors', async (req, res) => {
  const page = req.query.page || 1
  const itemsPerPage = Number(req.query['items-per-page']) || 10
  const condition = {
    $or: [{ role: 'contributor' }, { role: 'admin' }, { role: 'editor' }]
  }

  let queries = [User.find(condition), User.find(condition)]
  let [query, countQuery] = queries

  query
    .select('id title image text role buttons')
    .sort({ updatedAt: 'desc' })
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1))

  // cache user counters for 30 minutes
  const users = await query.cache(60 * 30).exec()
  const count = await countQuery
    .countDocuments()
    .cache(60 * 30)
    .exec()

  res.json({
    status: 'ok',
    page: {
      current: page,
      total: Math.ceil(count / itemsPerPage),
      'items-total': count,
      'items-per-page': itemsPerPage
    },
    items: users
  })
})

/**
 * @swagger
 * /authors/:author:
 *   get:
 *     description: Get author by id
 *     parameters:
 *            - name: author
 *              in: path
 *              schema:
 *                type: string
 *                required: true
 *                description: Author id
 *     responses:
 *       200:
 *         description: Return author.
 *       404:
 *         description: Author not found.
 */
authorApp.get('/authors/:author', async (req, res) => {
  if (!req.params.author) {
    return res.status(404).json({ message: 'Author not found' })
  }
  const author = await User.findOne({ id: req.params.author })
  if (!author) {
    return res.status(404).json({ message: 'Author not found' })
  }
  res.json({ status: 'ok', info: toShowingObject(author) })
})

module.exports = authorApp
