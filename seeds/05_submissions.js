const Submission = require('../models/mongo/submission')

const submissions = []

const seed = () => submissions.map(s => Submission.create(s))

module.exports = seed
