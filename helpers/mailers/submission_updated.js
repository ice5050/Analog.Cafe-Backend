const { sendMail } = require('../mailer')

/**
 * send an email to user about his submission status updating
 *
 * @param {string} email - user's email
 * @param {string} userName - user's name
 * @param {string} newStatus - new submission status [ scheduled | rejected ]
 */
function submissionStatusUpdatedEmail (email, userName, newStatus) {
  sendMail({
    to: email,
    from: { email: 'info@analog.cafe', name: 'Analog.Cafe' },
    subject: 'Your submission status has been updated',
    templateId: newStatus === 'scheduled'
      ? '3395e29a-4ef7-48ae-9056-c6c037ff2461'
      : 'ebe7ca14-6637-4a81-b6db-c5e1118cc348',
    substitutions: {
      'first_name | there': userName
    }
  })
}

module.exports = submissionStatusUpdatedEmail
