const User = require('../models/mongo/user')

const users = [
  {
    id: 'dmitrizzle',
    role: 'admin',
    twitterId: 'dmitrizzle',
    title: 'dmitrizzle',
    image: '/images/avatars/dmitrizzle.jpg',
    text:
      'Film photographer, writer, developer, designer, founder of Analog.Cafe.',
    buttons: [
      {
        to: '/author/dmitrizzle',
        text: 'More on Analog.Cafe',
        red: true
      },
      {
        to: 'https://twitter.com/dmitrizzle',
        text: 'Follow on Twitter'
      }
    ]
  },
  {
    id: 'lee-clark',
    twitterId: 'lee-clark',
    title: 'Lee Clark',
    image: '/images/avatars/lee-clark.jpg',
    role: 'contributor',
    text: 'Lee Clark is a teacher and film photographer based in Los Angeles.',
    buttons: [
      {
        to: '/author/lee-clark',
        text: 'More on Analog.Cafe',
        red: true
      },
      {
        to: 'http://leeclarkphotos.org',
        text: 'Visit Author’s Website'
      }
    ]
  },
  {
    id: 'lee-webb',
    twitterId: 'lee-webb',
    title: 'Lee Webb',
    image: '/images/avatars/lee-webb.jpg',
    text:
      'Englishman in Shanghai. Street photography. Film and vintage lenses. Make it ’til you make it.',
    role: 'contributor',
    buttons: [
      {
        to: '/author/lee-webb',
        text: 'More on Analog.Cafe',
        red: true
      },
      {
        to: 'http://www.myfavouritelens.com/',
        text: 'Visit Author’s Website'
      }
    ]
  },
  {
    id: 'betty',
    twitterId: 'betty',
    role: 'contributor',
    title: 'Betty',
    image: '/images/avatars/betty.jpg',
    text:
      'English teacher who loves to travel, read, write, draw, play games, and take photos.',
    buttons: [
      {
        to: '/author/betty',
        text: 'More on Analog.Cafe',
        red: true
      },
      {
        to: 'http://instagram.com/bettid',
        text: 'Follow on Instagram'
      }
    ]
  },
  {
    id: 'robert-davie',
    twitterId: 'robert-davie',
    role: 'contributor',
    title: 'Robert Davie',
    image: '/images/avatars/robert-davie.jpg',
    text:
      'Rob is a photographic artist living and working in York, United Kingdom. He works almost exclusively in monochrome and mainly with a hybrid workflow of film cameras and digital processing.',
    buttons: [
      {
        to: '/author/robert-davie',
        text: 'More on Analog.Cafe',
        red: true
      },
      {
        to: 'http://www.rjdavie.com',
        text: 'Visit Author’s Website'
      }
    ]
  }
]

const seed = () => users.map(u => User.create(u))

module.exports = seed
