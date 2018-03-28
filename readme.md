# Headless CMS API server
> 🥐 Built for Analog.Cafe


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

