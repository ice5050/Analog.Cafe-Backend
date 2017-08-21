# Analog.Cafe Backend
> Simple React-based CMS with fantastic public rich text submission processor. Built, used and maintained by [Analog.Cafe](http://analog.cafe) Film Photography Publication.

<img src="https://github.com/dmitrizzle/Analog.Cafe/blob/develop/public/images/pictures/submit.gif?raw=true" width="373" alt="Screenshot" />

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
