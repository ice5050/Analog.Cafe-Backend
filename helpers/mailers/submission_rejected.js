const { sendMail } = require('../mailer')

/**
 * send an email to the user about his submission being rejected
 *
 * @param {object} author - author with email and title
 */
function submissionRejectedEmail (author) {
  sendMail({
    to: author.email,
    from: { email: 'info@analog.cafe', name: 'Analog.Cafe' },
    subject: 'Your submission has not been published.',
    templateId: 'ebe7ca14-6637-4a81-b6db-c5e1118cc348',
    substitutions: {
      'first_name | there': author.title
    }
  })
}

module.exports = submissionRejectedEmail
