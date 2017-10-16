const express = require('express')
const MonthlyAssignment = require('../../models/mongo/monthly_assignment')
const { toShowingObject } = require('../../helpers/monthly_assignment')
const Image = require('../../models/mongo/image')
const passport = require('passport')

const monthlyApp = express()

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
      res.status(422).json({ message: 'Please include monthly assignments' })
    }
  }
)

monthlyApp.get('/monthly_assignment', async (req, res) => {
  const monthlyAssignments = await MonthlyAssignment.find()
  res.json(monthlyAssignments.map(m => toShowingObject(m)))
})

module.exports = monthlyApp
