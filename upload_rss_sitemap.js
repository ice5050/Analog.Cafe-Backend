require('dotenv').config()
const Promise = require('bluebird')
const AWS = require('aws-sdk')
const request = Promise.promisify(require('request'))

AWS.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
})

const s3 = new AWS.S3()

async function uploadRSSAndSitemap (host, sitemap, rss, bucket) {
  if (!host) {
    return console.log("Host can't be blank.")
  }

  if (!sitemap && !rss) {
    return console.log('Please choose at least 1 file, sitemap or rss or both')
  }

  if (sitemap) {
    const sitemap = await getSitemap(host)
    const data = await uploadToS3({
      Bucket: bucket,
      Key: 'sitemap.xml',
      Body: sitemap
    })
    console.log(data)
  }

  if (rss) {
    const rss = await getRSS(host)
    const data = await uploadToS3({
      Bucket: bucket,
      Key: 'rss.xml',
      Body: rss
    })
    console.log(data)
  }
}

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

module.exports = uploadRSSAndSitemap
