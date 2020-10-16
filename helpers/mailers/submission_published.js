const { sendMail } = require("../mailer");

/**
 * send an email to the user about his submission being approved
 *
 * @param {object} author - author with email and title
 * @param {object} article - article with slug
 */
function submissionPublishedEmail(author, article) {
  sendMail({
    to: author.email,
    from: { email: "d@analog.cafe", name: "Dmitri form Analog.Cafe" },
    subject: "Your submission has been published!",
    templateId: "3395e29a-4ef7-48ae-9056-c6c037ff2461",
    substitutions: {
      analog_profile_name: author.title,
      article_url: `${process.env.ANALOG_FRONTEND_URL}/r/${article.slug}`,
      article_tag: `${article.tag
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase())}`
    }
  });
}

module.exports = submissionPublishedEmail;
