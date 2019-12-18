# Headless CMS API server
[![Build Status](https://travis-ci.com/roast-cms/analog-cafe-server.svg?branch=develop)](https://travis-ci.com/roast-cms/analog-cafe-server)
> 🥐 Built for [Analog.Cafe](https://github.com/dmitrizzle/Analog.Cafe)

### Built with
[<img src="https://raw.githubusercontent.com/roast-cms/analog-cafe-server/repository-images/browserstack-logo.png" width="200" />](https://www.browserstack.com/open-source)

### Setting up a local development Server
```
# You need to have Mongodb and Redis running.
# Then rename .env.example to be .env and change it to match your requirement
npm install
npm run dev
```

### Database script
```
*Seed the initial data*
npm run db:seed

*Clean all collection*
npm run db:clean
```

### Upload Sitemap and RSS to S3
```
# You need S3_KEY, S3_REGION, S3_SECRET in environment variable or .env file
# Then run this command
yarn run upload-sitemap-rss --host HOST --bucket S3_BUCKET
eg. yarn run upload-sitemap-rss --host https://api.analog.cafe --bucket analog.cafe 
```

