const User = require('../models/mongo/user')

const users = [
  {
    _id: {
      $oid: '598800cef36d285e99725bf9'
    },
    id: 'dmitrizzle',
    role: 'admin',
    twitterId: 'dmitrizzle',
    title: 'dmitrizzle',
    image: 'image-froth_741290_eebcaad16ea44e6783ed67f69970f0b2',
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
    ],
    suspend: false
  },
  {
    _id: {
      $oid: '598800e4f36d285e99725bfd'
    },
    id: 'lee-clark',
    twitterId: 'lee-clark',
    title: 'Lee Clark',
    image: 'image-froth_1650165_ca10cf70bbd44dd0bfef06841d609498',
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
    ],
    suspend: false
  },
  {
    _id: {
      $oid: '598800f9f36d285e99725bfe'
    },
    id: 'lee-webb',
    twitterId: 'lee-webb',
    title: 'Lee Webb',
    image: 'image-froth_1000000_1d24be6dec0a496687a9c2a326c64640',
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
    ],
    suspend: false
  },
  {
    _id: {
      $oid: '598859b5f36d285e997278e9'
    },
    id: 'betty',
    twitterId: 'betty',
    role: 'contributor',
    title: 'Betty',
    image: 'image-froth_742942_e11327da193e4e83ad8c2b42b874575b',
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
    ],
    suspend: false
  },
  {
    _id: {
      $oid: '59885a30f36d285e99727923'
    },
    id: 'robert-davie',
    twitterId: 'robert-davie',
    role: 'contributor',
    title: 'Robert Davie',
    image: 'image-froth_1000000_39668e5413e643c091138a64e9266e1f',
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
    ],
    suspend: false
  },
  {
    _id: {
      $oid: '599c47443fed044949d387c5'
    },
    id: 'bailey-tovar',
    twitterId: 'bailey-tovar',
    role: 'contributor',
    title: 'Bailey Tovar',
    image: 'image-froth_1500000_7bac2abd50f747939cec04bc15f79941',
    text: 'Photographer and writer.',
    buttons: [
      {
        to: '/author/bailey-tovar',
        text: 'More on Analog.Cafe',
        red: true
      },
      {
        to: 'https://www.instagram.com/bai_latte/',
        text: 'Follow on Instagram'
      }
    ],
    suspend: false
  },
  {
    _id: {
      $oid: '59a5778c6f6990def909e80e'
    },
    id: 'jacob-maracle',
    twitterId: 'jacob-maracle',
    title: 'Jacob Maracle',
    image: 'image-froth_1000000_e850ac3366c940ecadb3e7c062d41d3d',
    role: 'contributor',
    text: 'Jacob is a Canadian musician and an artist.',
    buttons: [
      {
        to: '/author/jacob-maracle',
        text: 'More on Analog.Cafe',
        red: true
      },
      {
        to: 'http://jacob.indigenousroutes.ca',
        text: 'Visit Author’s Website'
      }
    ],
    suspend: false
  }
]

const seed = () => users.map(u => User.create(u))

module.exports = seed
