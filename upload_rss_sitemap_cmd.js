const program = require('commander')
const uploadRSSAndSitemap = require('./upload_rss_sitemap')

async function runCMD () {
  program
    .option('--sitemap', 'Upload sitemap')
    .option('--rss', 'Upload rss')
    .option('-h, --host [host]', 'Analog.cafe API domain')
    .option('-b, --bucket [bucket]', 'S3 Bucket')
    .parse(process.argv)

  await uploadRSSAndSitemap(program.host, program.sitemap, program.rss, program.bucket)
}

async function app () {
  await runCMD()
  process.exit()
}

app()
