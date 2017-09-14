let SibApiV3Sdk = require('sib-api-v3-sdk')
let defaultClient = SibApiV3Sdk.ApiClient.instance

let apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_API_KEY

let apiInstance = new SibApiV3Sdk.SMTPApi()

function sendMail (data) {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    sender: { name: data.from, email: data.from },
    to: [data.to],
    replyTo: { email: data.from },
    subject: data.subject,
    htmlContent: data.html
  })
  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then(data => console.log(data), error => console.error(error))
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
