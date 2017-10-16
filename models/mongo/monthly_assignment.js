const mongoose = require('mongoose')
const connection = require('./index.js')

const Schema = mongoose.Schema

const monthlyAssignmentSchema = new Schema({
  id: String,
  author: {
    id: String,
    name: String
  }
})

const MonthlyAssignment = connection.model(
  'MonthlyAssignment',
  monthlyAssignmentSchema
)

module.exports = MonthlyAssignment
