const { sendMail } = require('../mailer')

function imageSuggestedEmail (email, userName) {
  sendMail({
    to: email,
    from: { email: 'info@analog.cafe', name: 'Analog.Cafe' },
    subject: 'Your image has been featured in “Instant Collaborations”!',
    templateId: '11e4ebfe-21a7-4543-8e9c-5a13f53ac55e',
    substitutions: {
      'first_name | there': userName
    }
  })
}

module.exports = imageSuggestedEmail
