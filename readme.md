# Roast.Cloud headless CMS API provider
> Accept and curate rich public content, schedule publications, manage your users and have them manage themselves with one-click authentication process via Passport.js. Plus: advanced media attribution rules and collaborative authorship.

See [Analog.Cafe](https://www.analog.cafe) for use case in production and [this repo](github.com/dmitrizzle/Analog.Cafe) for a React.JS-based view layer that powers it.


###Setting up a local development Server
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

