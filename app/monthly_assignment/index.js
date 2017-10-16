const express = require('express')
const MonthlyAssignment = require('../../models/mongo/monthly_assignment')
const { toShowingObject } = require('../../helpers/monthly_assignment')
const passport = require('passport')

const monthlyApp = express()

/**
  * @swagger
  * /monthly_assignment:
  *   put:
  *     description: Edit the monthly assignment
  *     parameters:
  *            - name: Authorization
  *              in: header
  *              schema:
  *                type: string
  *                required: true
  *                description: JWT access token for verification user ex. "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFraXlhaGlrIiwiaWF0IjoxNTA3MDE5NzY3fQ.MyAieVFDGAECA3yH5p2t-gLGZVjTfoc15KJyzZ6p37c"
  *            - name:
  *              in: body
  *              type: array
  *                type: object
  *                properties:
  *                  id:
  *                    type: string
  *                    description: id of the image
  *                  author:
  *                    type: object
  *                    properties:
  *                      id:
  *                        type: string
  *                        description: id of the image's author
  *                      name:
  *                        type: string
  *                        description: name of the image's author
  *     responses:
  *       200:
  *         description: Return updated monthly assignments.
  *       401:
  *         description: No permission to access.
  *       422:
  *         description: No monthly assignment included in request body.
  */
monthlyApp.put(
  '/monthly_assignment',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'No permission to access' })
    }
    if (req.body) {
      await MonthlyAssignment.remove()
      const monthlyAssignments = await MonthlyAssignment.insertMany(req.body)
      res.json(monthlyAssignments.map(m => toShowingObject(m)))
    } else {
      res.status(422).json({ message: 'Please include monthly assignment' })
    }
  }
)

/**
  * @swagger
  * /monthly_assignment:
  *   get:
  *     description: Get all monthly assignments
  *     responses:
  *       200:
  *         description: Return monthly assignments.
  */
monthlyApp.get('/monthly_assignment', async (req, res) => {
  const monthlyAssignments = await MonthlyAssignment.find()
  res.json(monthlyAssignments.map(m => toShowingObject(m)))
})

module.exports = monthlyApp
