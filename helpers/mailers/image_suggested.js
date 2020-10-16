const { sendMail } = require("../mailer");

function imageSuggestedEmail(author, image) {
  sendMail({
    to: author.email,
    from: { email: "no-reply@analog.cafe", name: "Analog.Cafe" },
    subject: "Your image has been featured in “Instant Collaborations”!",
    templateId: "11e4ebfe-21a7-4543-8e9c-5a13f53ac55e",
    substitutions: {
      analog_profile_name: author.title,
      image_url: image
    }
  });
}

module.exports = imageSuggestedEmail;
