require('dotenv').config()
const program = require('commander')
const Promise = require('bluebird')
const AWS = require('aws-sdk')
const request = Promise.promisify(require('request'))

AWS.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
})

const s3 = new AWS.S3()

async function run () {
  program
    .option('--sitemap', 'Upload sitemap')
    .option('--rss', 'Upload rss')
    .option('-h, --host [host]', 'Analog.cafe API domain')
    .option('-b, --bucket [bucket]', 'S3 Bucket')
    .parse(process.argv)

  if (!program.host) {
    return console.log("Host can't be blank.")
  }

  if (!program.sitemap && !program.rss) {
    return console.log('Please choose at least 1 file, sitemap or rss or both')
  }

  if (program.sitemap) {
    const sitemap = await getSitemap(program.host)
    const data = await uploadToS3({
      Bucket: program.bucket,
      Key: 'sitemap.xml',
      Body: sitemap
    })
    console.log(data)
  }

  if (program.rss) {
    const rss = await getRSS(program.host)
    const data = await uploadToS3({
      Bucket: program.bucket,
      Key: 'rss.xml',
      Body: rss
    })
    console.log(data)
  }
}

async function app () {
  await run()
  process.exit()
}

app()

async function getSitemap (host) {
  const file = await fetchFile(`${host}/sitemap.xml`)
  return file
}

async function getRSS (host) {
  const file = await fetchFile(`${host}/rss`)
  return file
}

function fetchFile (url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, resp, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

function uploadToS3 (params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
