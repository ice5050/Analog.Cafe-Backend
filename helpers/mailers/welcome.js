const { sendMail } = require('../mailer')

function welcomeEmail (email, userName) {
  sendMail({
    to: email,
    from: { email: 'info@analog.cafe', name: 'Analog.Cafe' },
    subject: 'Welcome to Analog.Cafe!',
    templateId: '43cf07a0-669d-4a25-88fa-4b5e2d0f0cfe',
    substitutions: {
      'first_name | there': userName
    }
  })
}

module.exports = welcomeEmail
