const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendMail (data) {
  const msg = {
    to: data.to,
    from: data.from,
    subject: data.subject,
    text: data.text,
    html: data.html
  }
  sgMail.send(msg)
}

function sendVerifyEmail (to, verifyCode, verifyLink) {
  let html = "<a href='" + verifyLink + "'>" + verifyLink + '</a>'
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
