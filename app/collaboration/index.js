const express = require('express')
const Collaboration = require('../../models/mongo/collaboration')
const { toShowingObject } = require('../../helpers/collaboration')
const {
  authenticationMiddleware,
  filterRoleMiddleware
} = require('../../helpers/authenticate')

const collaborationApp = express()

/**
  * @swagger
  * /collaboration:
  *   put:
  *     description: Edit collaborations
  *     parameters:
  *       - name: Authorization
  *         in: header
  *         schema:
  *           type: string
  *           required: true
  *           description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *       - name:
  *         in: body
  *         type: array
  *         items:
  *           type: object
  *           properties:
  *             id:
  *               type: string
  *               description: id of the image
  *             author:
  *               type: object
  *               properties:
  *                 id:
  *                   type: string
  *                   description: id of the image's author
  *                 name:
  *                   type: string
  *                   description: name of the image's author
  *     responses:
  *       200:
  *         description: Return updated collaborations.
  *       401:
  *         description: No permission to access.
  *       422:
  *         description: No collaboration included in request body.
  */
collaborationApp.put(
  '/collaboration',
  authenticationMiddleware,
  filterRoleMiddleware('admin'),
  async (req, res) => {
    if (req.body) {
      await Collaboration.remove()
      const collaborations = await Collaboration.insertMany(req.body)
      res.json(collaborations.map(m => toShowingObject(m)))
    } else {
      res.status(422).json({ message: 'Please include collaboration' })
    }
  }
)

/**
  * @swagger
  * /collaboration:
  *   get:
  *     description: Get all collaborations
  *     responses:
  *       200:
  *         description: Return collaborations.
  */
collaborationApp.get('/collaboration', async (req, res) => {
  const collaborations = await Collaboration.find()
  res.json(collaborations.map(m => toShowingObject(m)))
})

module.exports = collaborationApp
