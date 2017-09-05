const Submission = require('../models/mongo/submission')

const submissions = [
  {
    tag: 'editorial',
    slug: 'analog-cafe-e8t1',
    title: 'Analog.Cafe',
    subtitle: 'An Introduction',
    id: 'e8t1',
    stats: {
      images: '1',
      words: '119'
    },
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    poster: {
      small: '/images/pictures/an-introduction-cat-tax.jpg',
      medium: '/images/pictures/an-introduction-cat-tax.jpg',
      large: '/images/pictures/an-introduction-cat-tax.jpg'
    },
    status: 'scheduled',
    summary:
      "This is officially the first post. I am nervous and tipsy, also grateful and excited. It feels pretty nice to be able to start something that's meant to inspire thousands and be the creative outlet for skilled film photographers, writers, and artists.",
    content: {
      raw: {
        document: {
          data: {},
          kind: 'document',
          nodes: [
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: '🎙', marks: [] }]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text: 'W',
                      marks: [{ data: {}, kind: 'mark', type: 'bold' }]
                    },
                    {
                      kind: 'range',
                      text: 'e’re live!',
                      marks: [
                        { data: {}, kind: 'mark', type: 'italic' },
                        { data: {}, kind: 'mark', type: 'bold' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'This is the first post to go onto this website. I am nervous, tipsy, grateful, and excited. It feels pretty nice to be able to start something that’s meant to inspire thousands and be the creative outlet for skilled film photographers, writers, and artists.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Analog.Cafe began as an idea less than a year ago. Today it is many things, compiled from efforts by many people.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Analog.Cafe is a blog. It is also a printed zine and an open-source software. Next month it will become the actively-curated publishing platform it is meant to be.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Thank you all who helped building it, you know who you are!',
                      marks: [{ data: {}, kind: 'mark', type: 'bold' }]
                    }
                  ]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: 'Cat tax.', marks: [] }]
                }
              ]
            },
            {
              data: {
                caption:
                  'This cute little fluff ball has been hanging around my gym whenever it was lunch time.\nShot on Kodak UltraMax 400 with Canon QL25 (May 2017).',
                src: '/images/pictures/an-introduction-cat-tax.jpg',
                feature: true
              },
              kind: 'block',
              isVoid: true,
              type: 'image',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: ' ', marks: [] }]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: false,
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: '', marks: [] }]
                }
              ]
            }
          ]
        },
        kind: 'state'
      }
    }
  }
]

const seed = () => submissions.map(s => Submission.create(s))

module.exports = seed
