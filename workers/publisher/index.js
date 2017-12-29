const Setting = require('../../models/mongo/setting')
const Submission = require('../../models/mongo/submission')
const Article = require('../../models/mongo/article')
const Image = require('../../models/mongo/image')
const User = require('../../models/mongo/user')
const moment = require('moment')
const imageRepostedEmail = require('../../helpers/mailers/image_reposted')
const {
  getImageId
} = require('../../helpers/submission')
const uploadRSSAndSitemap = require('../../upload_rss_sitemap')

async function run () {
  const now = new Date()
  const setting = await Setting.findOne({})
  if (!setting.publishDays.includes(now.getDay())) return
  const scheduledSubmissions = await Submission.find({ status: 'scheduled' })
    .sort({ scheduledOrder: 'asc' })
    .limit(setting.numberOfPublish)
    .exec()

  if (!scheduledSubmissions) return
  scheduledSubmissions.map(async submission => {
    let article = new Article({
      id: submission.id,
      slug: submission.slug,
      title: submission.title,
      subtitle: submission.subtitle,
      stats: submission.stat,
      author: submission.author,
      poster: submission.poster,
      tag: submission.tag,
      summary: submission.summary,
      content: submission.content,
      'post-date': moment().unix(),
      status: 'published'
    })
    submission.articleId = submission.id
    submission.status = 'published'
    await article.save()
    await submission.save()
    // Send an email to the image owner that isn't the article owner
    submission.content.raw.document.nodes
        .filters(node => node.type === 'image')
        .map(node => node.data.src)
        .map(getImageId)
        .map(async id => {
          const image = await Image.findOne({ id })
          const imageAuthor =
            image && (await User.findOne({ id: image.author.id }))
          if (
            image &&
            imageAuthor &&
            imageAuthor.email &&
            image.author.id !== submission.author.id
          ) {
            imageRepostedEmail(imageAuthor.email, imageAuthor.title)
          }
        })
    // Upload sitemap to S3
    uploadRSSAndSitemap(process.env.API_DOMAIN, true, null, process.env.S3_BUCKET)
  })
}

async function app () {
  await run()
  process.exit()
}

app()
