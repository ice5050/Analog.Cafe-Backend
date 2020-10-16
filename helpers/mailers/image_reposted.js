const { sendMail } = require("../mailer");

function imageRepostedEmail(email, userName, article) {
  sendMail({
    to: email,
    from: { email: "no-reply@analog.cafe", name: "Analog.Cafe" },
    subject: "Your image has been featured!",
    templateId: "def171aa-7c65-4463-a62f-08ad06de3fee",
    substitutions: {
      analog_profile_name: userName,
      article_url: `${process.env.ANALOG_FRONTEND_URL}/r/${article.slug}`
    }
  });
}

module.exports = imageRepostedEmail;
