const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setSubstitutionWrappers('[%', '%]')

function sendMail (data) {
  const msg = {
    to: data.to,
    from: data.from,
    subject: data.subject,
    text: data.text,
    html: data.html,
    templateId: data.templateId,
    substitutions: data.substitutions
  }
  sgMail.send(msg)
}

module.exports = {
  sendMail
}
