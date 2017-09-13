const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// to: 'test@example.com',
// from: 'test@example.com',
// subject: 'Sending with SendGrid is Fun',
// text: 'and easy to do anywhere, even with Node.js',
// html: '<strong>and easy to do anywhere, even with Node.js</strong>'
function sendMail (msg) {
  sgMail.send(msg)
}

function sendVerifyEmail (to, verifyCode, verifyLink) {
  let html = "<a href='" + verifyLink + "'>" + verifyLink + "</a>"
  let text = 'Verify link: ' + verifyLink
  sendMail({
    to: to,
    from: 'info@analog.cafe',
    subject: 'Confirm your Analog.Cafe account',
    text: text,
    html: html
  })
}

module.exports = {
  sendMail,
  sendVerifyEmail
}
