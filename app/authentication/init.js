const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy
const User = require('../../models/postgres/index.js').user
const authenticationMiddleware = require('./middleware')

function init (app) {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_KEY,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL
      },
      (token, tokenSecret, profile, done) => {
        const username = sanitizeUsername(profile.username)
        User.findOrCreate({
          where: {
            realUsername: profile.username,
            username: username,
            name: profile.displayName,
            profilePic: profile.photos[0] && profile.photos[0].value
          }
        }).spread((user, created) => {
          done(null, user)
        })
      }
    )
  )

  passport.authenticationMiddleware = authenticationMiddleware

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user)
    })
  })

  app.get('/auth/twitter', passport.authenticate('twitter'))
  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )
}

function sanitizeUsername (username) {
  if (!username) return null
  return username.split('@')[0].toLowerCase().replace(/\W/g, '.')
}

module.exports = init
