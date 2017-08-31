const Article = require('../models/mongo/article')

const articles = [
  {
    tag: 'editorial',
    slug: 'analog-cafe-e8tr',
    title: 'Analog.Cafe',
    subtitle: 'An Introduction',
    id: 'e8tr',
    'post-date': '1501176150',
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
    status: 'published',
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
  },
  {
    tag: 'photo-essay',
    slug: 'brighton-beach-jrwe',
    title: 'Brighton Beach',
    subtitle: '',
    id: 'jrwe',
    'post-date': '1501300500',
    stats: {
      images: '6',
      words: '253'
    },
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    poster: {
      small: '/images/pictures/brighton-beach-015.jpg',
      medium: '/images/pictures/brighton-beach-015.jpg',
      large: '/images/pictures/brighton-beach-015.jpg'
    },
    status: 'published',
    summary:
      'Brighton Beach is a Russian community neighbourhood in New York. When I was growing up in Moscow as a kid I’ve heard a lot about it on TV: the magical place where one can become and live like an American. During the early 90s, there was an obsession with everything USA; it suddenly became “amazing and wonderful”, instead of “the villain” — a narrative it was given for over fifty years prior. Perestroika flipped the entire culture onto its head.',
    content: {
      raw: {
        document: {
          data: {},
          kind: 'document',
          nodes: [
            {
              data: {
                feature: true,
                src: '/images/pictures/brighton-beach-015.jpg'
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
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    { kind: 'range', text: 'Note from the editor:', marks: [] }
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
                        'Brighton Beach is a Russian community neighbourhood in New York. When I was growing up in Moscow as a kid I’ve heard a lot about it on TV: the magical place where one can become and live like an American. During the early 90s, there was an obsession with everything USA; it suddenly became “amazing and wonderful”, instead of “the villain” — a narrative it was given for over fifty years prior. Perestroika flipped the entire culture onto its head.',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
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
                        'Lee approached me a few months ago with the images she took discreetly on the beach itself. These incredibly honest photographs reminded me of the old Soviet movies that portrayed holidays Russians would take in Sochi — a southern beach city.',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
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
                      text: 'Some things remain unchanged.',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
                    }
                  ]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: true,
              type: 'divider',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: ' ', marks: [] }]
                }
              ]
            },
            {
              data: {
                feature: false,
                src: '/images/pictures/brighton-beach-009.jpg'
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'As I walked along the beach, I tried to take pictures without people noticing the camera. Since I used a Yashica twin reflex camera, I positioned my body in a different direction than the lens, so people would think I was taking a picture elsewhere. However, as I walked along the boardwalk, a woman in her 70’s sunbathing yelled at me, ',
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
                    { kind: 'range', text: '“', marks: [] },
                    {
                      kind: 'range',
                      text:
                        'Hey! I know what you’re doing! You’re not fooling anyone!',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
                    },
                    { kind: 'range', text: '”', marks: [] }
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
                        'I looked up from the lens and apologized, she laughed and motioned me over. She was sitting with her husband, who was also a street photographer. He told me about his experiences taking candid street pictures at Coney Island and his job as a photographer for the Johnny Carson show.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {
                feature: true,
                src: '/images/pictures/brighton-beach-008.jpg'
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
              data: {
                feature: true,
                src: '/images/pictures/brighton-beach-020.jpg'
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
              data: {
                feature: true,
                src: '/images/pictures/brighton-beach-012.jpg'
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
              data: {
                feature: true,
                src: '/images/pictures/brighton-beach-132.jpg'
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
  },
  {
    tag: 'review',
    slug: 'testing-the-olympus-supertrip-in-shanghai-sfd8',
    title: 'Testing the Olympus Supertrip in Shanghai',
    subtitle: 'A New Old Camera in a New Old City',
    id: 'sfd8',
    'post-date': '1501301500',
    stats: {
      images: '4',
      words: '454'
    },
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    poster: {
      small: '/images/pictures/lee-shanghai-1.jpg',
      medium: '/images/pictures/lee-shanghai-1.jpg',
      large: '/images/pictures/lee-shanghai-1.jpg'
    },
    status: 'published',
    summary:
      'The Olympus Supertrip is the second of two film cameras I picked up from a charity shop in Nottingham. The other was a Canon Sure Shot AF-7. If you’ve not read it yet, I’d recommend the article I wrote about them both here. While the test run of the Canon Sure Shot AF-7 was mainly done in Chongqing, I tested the Olympus Supertrip once I’d got back to Shanghai.',
    content: {
      raw: {
        document: {
          data: {},
          kind: 'document',
          nodes: [
            {
              data: {
                feature: false,
                src: '/images/pictures/lee-shanghai-1.jpg'
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'The Olympus Supertrip is the second of two film cameras I picked up from a charity shop in Nottingham.',
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
                      text: 'The other was a Canon Sure Shot AF-7.',
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
                        'If you’ve not read it yet, I’d recommend the article I wrote about them both ',
                      marks: []
                    }
                  ]
                },
                {
                  data: {
                    href: 'http://www.myfavouritelens.com/first-film-cameras/'
                  },
                  kind: 'inline',
                  isVoid: false,
                  type: 'link',
                  nodes: [
                    {
                      kind: 'text',
                      ranges: [{ kind: 'range', text: 'here', marks: [] }]
                    }
                  ]
                },
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: '.', marks: [] }]
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
                        'While the test run of the Canon Sure Shot AF-7 was mainly done in ',
                      marks: []
                    }
                  ]
                },
                {
                  data: {
                    href:
                      'http://www.myfavouritelens.com/testing-canon-sure-shot-af-7-airport-square-chongqing-1/'
                  },
                  kind: 'inline',
                  isVoid: false,
                  type: 'link',
                  nodes: [
                    {
                      kind: 'text',
                      ranges: [{ kind: 'range', text: 'Chongqing', marks: [] }]
                    }
                  ]
                },
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        ', I tested the Olympus Supertrip once I’d got back to Shanghai.',
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
                        'Again, I had no idea how these would turn out while shooting.',
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
                        'No idea how well the camera worked, no idea how the focus would be, no idea if the images would be under or over exposed, and no idea how the ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text: 'Kodak ColorPlus',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
                    },
                    { kind: 'range', text: ' film would perform.', marks: [] }
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
                      text: 'All I could do was go out and shoot.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: { src: '/images/pictures/lee-shanghai-2.jpg' },
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
                  ranges: [
                    {
                      kind: 'range',
                      text: 'The results were mixed.',
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
                        'I’m going to do a post comparing this Olympus Supertrip with the Canon Sure Shot AF-7 once I’ve shot some more with them both, but I definitely got better results with the latter on ',
                      marks: []
                    }
                  ]
                },
                {
                  data: {
                    href:
                      'http://www.myfavouritelens.com/testing-canon-sure-shot-af-7-airport-square-chongqing-2/'
                  },
                  kind: 'inline',
                  isVoid: false,
                  type: 'link',
                  nodes: [
                    {
                      kind: 'text',
                      ranges: [
                        { kind: 'range', text: 'these test runs', marks: [] }
                      ]
                    }
                  ]
                },
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: '.', marks: [] }]
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
                        'That’s not a fair reflection on the cameras of course, as light, subjects, opportunities, and my mood while shooting all play a part in the end results.',
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
                        'I perhaps like the header image on this post more than anything that came out of the Canon but that’s due to the composition. It could have been taken on any camera.',
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
                        'I only have six images I can really share with you from the Olympus and a couple of these are really just to make up the numbers.',
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
                        'This is partly because I used some frames on a family day out in England and partly because some of the shots I took in Shanghai just aren’t good enough to share with you.',
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
                        'All these that are posted here are minimally cropped to remind me to pay more attention to composition next time.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {
                feature: true,
                src: '/images/pictures/lee-shanghai-3.jpg'
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
              data: {
                feature: true,
                src: '/images/pictures/lee-shanghai-4.jpg'
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
                  ranges: [
                    {
                      kind: 'range',
                      text: 'I guess the results aren’t actually ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text: 'too',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
                    },
                    {
                      kind: 'range',
                      text:
                        ' bad, for what they are, and I am looking forward to shooting more with the Olympus Supertrip.',
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
                        'There’s a roll of monochrome film set aside to be loaded into it next time.',
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
                        'I do have more favourable first impressions of the Canon Sure Shot AF-7 though. It feels better to shoot with and has so far yielded better images.',
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
                        'However, the relative failures I had with this camera are all things I can learn from.',
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
                      text: 'So it’s a still a winner.',
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
                        'Besides, who can really complain when you buy a camera for £1.99 from a charity shop?',
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
                    { kind: 'range', text: 'That’s the game.', marks: [] }
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
                      text: 'Shooting is playing and getting ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text: 'some',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
                    },
                    {
                      kind: 'range',
                      text:
                        ' shots out of it that you like enough to share is always a good result.',
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
                      text: 'So that’s what I’m gonna keep on doing.',
                      marks: []
                    }
                  ]
                }
              ]
            }
          ]
        },
        kind: 'state'
      }
    }
  },
  {
    tag: 'photo-essay',
    slug: 'a-trip-to-taiwan-nwj7',
    title: 'A Trip to Taiwan',
    subtitle: '',
    id: 'nwj7',
    'post-date': '1502092240',
    stats: {
      images: '10',
      words: '991'
    },
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    poster: {
      small: '/images/pictures/taiwan-bangkok.jpg',
      medium: '/images/pictures/taiwan-bangkok.jpg',
      large: '/images/pictures/taiwan-bangkok.jpg'
    },
    status: 'published',
    summary:
      'In Thailand, school is out for at least two months around March-April. Unfortunately, that’s also when the burning season begins. An excellent time to make a run for it if you ask me. Especially when living in Chiang Mai. A small city of 300,000 surrounded by farming fields which get very smoky during those sizzling months. My wife, Betty, and I heard good things about Taiwan. That’s typically enough for us to buy tickets and fly to a place that’s on the same continent. Which we did.',
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
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'In Thailand, school is out for at least two months around March-April. Unfortunately, that’s also when the ',
                      marks: []
                    }
                  ]
                },
                {
                  data: {
                    href: 'https://en.wikipedia.org/wiki/Southeast_Asian_haze'
                  },
                  kind: 'inline',
                  isVoid: false,
                  type: 'link',
                  nodes: [
                    {
                      kind: 'text',
                      ranges: [
                        { kind: 'range', text: 'burning season', marks: [] }
                      ]
                    }
                  ]
                },
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        ' begins. An excellent time to make a run for it if you ask me. Especially when living in Chiang Mai. A small city of 300,000 surrounded by farming fields which get very smoky during those sizzling months.',
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
                        'My wife, Betty, and I heard good things about Taiwan. That’s typically enough for us to buy tickets and fly to a place that’s on the same continent. Which we did.',
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
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: 'Bangkok.', marks: [] }]
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
                        'There aren’t any direct flights from Chiang Mai to Taipei. And even if there were, it’s almost always cheaper to fly to Bangkok and ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text: 'then',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
                    },
                    {
                      kind: 'range',
                      text:
                        ' to an international destination. This time we planned to spend two days in the city to make the transit more pleasant.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {
                caption:
                  '“Asiatique Ferris Wheel,” shot with a four-second exposure on Instax Mini 90.',
                src: '/images/pictures/taiwan-bangkok.jpg',
                feature: false
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Bangkok is a huge city with plenty of pollutants escaping the tailpipes of noisy tuk-tuks and two-stroke motorcycles. However, there aren’t any farm fields to burn, which is a huge relief.',
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
                        'Betty and I have seen the city before on various occasions, though it was usually for business or transit. This time we made it a two-day date in the city.',
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
                        'Long walks along the channels and park lanes, a ride on a water taxi and a visit to the local fair. All the good stuff — while staying in a hotel with a room of our own.',
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
                      text: 'We also got very impressed with ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text: 'the malls.',
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
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'They are everywhere. Spanning entire downtown area. Two days were spent in the city wondering about the huge complexes, breathing in cool, filtered air. Marveling at the diverse and amusing decoration decisions throughout the interconnected walkways of bliss.',
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
                        'We spent our time wondering in awe, but not really shopping. I think Betty bought an eyebrow pencil and I had a coffee.',
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
                    { kind: 'range', text: 'That’s Bangkok.', marks: [] }
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
                  ranges: [{ kind: 'range', text: 'Taipei.', marks: [] }]
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
                        'Next evening we took a plane due to arrive in Taipei at 4 AM.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {
                caption:
                  'A double-exposed photograph at the Exhibition center in Taipei. Shot with Instax Mini 90.',
                src: '/images/pictures/taiwan-exhibition.jpg',
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
              data: {
                caption:
                  '“Prayers and Offerings” - a double-exposed photograph from the Lungshan Temple in Taipei. Shot on Instax Mini 90.',
                src: '/images/pictures/taiwan-temple.jpg',
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Three things stood out once we arrived in Taiwan. The place was clean, like really clean. The vegetation seemed a lot less tropical in appearance than in Thailand. Although the lowest temperature during winter in Taipei is around 13 °C (55 °F), which is pretty mild.',
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
                      text: 'And scooters. Scooters everywhere.',
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
                        'The food is more expensive than in Thailand. Public transit is cheap, and booze is really cheap.',
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
                        'We ended up in the city at around 5 AM; most shops were closed until late afternoon. So we spent a good part of day one dozing off on Starbucks chairs.',
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
                        'Coffee in Taiwan ranges from terrible to mediocre (as compared to selection, quality and price in Chiang Mai). ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text: 'Bubble tea',
                      marks: [{ data: {}, kind: 'mark', type: 'bold' }]
                    },
                    {
                      kind: 'range',
                      text:
                        ', however, turned out incredibly delicious, no matter where it was bought. It’s only logical that the country is filled with clean, free and plentiful public washrooms.',
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
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: 'Jiufen.', marks: [] }]
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
                        'This small town that once used to mine gold is located on the hillside right next to the sea. When we arrived it was cold and rained intensely. It looked incredibly beautiful even/especially then.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {
                caption:
                  '“Night Lanterns at Jiufen Market” - shot with Instax Mini 90.',
                src: '/images/pictures/taiwan-jiufen.jpg',
                feature: false
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'This town served as an inspiration for the popular Japanese anime film “Spirited Away” by ',
                      marks: []
                    }
                  ]
                },
                {
                  data: {
                    href:
                      'https://www.google.co.th/search?client=safari&rls=en&q=Hayao+Miyazaki&stick=H4sIAAAAAAAAAOPgE-LQz9U3yDJLMlUCs0yNTcq0xLKTrfTTMnNywYRVSmZRanJJfhEAqhVA0S4AAAA&sa=X&ved=0ahUKEwjf8saXiLbTAhXFtY8KHVN1BkYQmxMIvAEoATAX'
                  },
                  kind: 'inline',
                  isVoid: false,
                  type: 'link',
                  nodes: [
                    {
                      kind: 'text',
                      ranges: [
                        { kind: 'range', text: 'Hayao Miyazaki', marks: [] }
                      ]
                    }
                  ]
                },
                {
                  kind: 'text',
                  ranges: [
                    {
                      kind: 'range',
                      text: ' for its haunting yet romantic appeal.',
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
                        'As the night swooped over the once busy tourist streets we went for a walk to catch some of those creepy vibes Hayao portraited in his film.',
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
                        'Jiufen also has the most scenic convenience store in the world. A Japanese franchise, Family Mart is located on a hill-top with an enormous window overlooking ocean bay and mountains. With seats.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {
                caption:
                  'Cherry blossom tree in Jiufen. Shot on Instax Mini 90.',
                src: '/images/pictures/taiwan-blossoms.jpg',
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
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [
                    { kind: 'range', text: 'Taroko & Hualien.', marks: [] }
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
                        'Our next destination is the Taroko trails near the city of Hualien.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {
                caption:
                  'We took a route through the closed highway tunnel that terrified ous to the bone. In retrospect, I’m still not sure why we ignored the signes that read “danger” on all sides.',
                src: '/images/pictures/taiwan-tunnel.jpg',
                feature: false
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'This is pretty much when the vibe of the trip has changed completely. From relaxing to taxing. I think we walked at least 50 kilometres all-together after arriving in the city of Hualien.',
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
                        'Beautiful sightings throughout the day followed by complete exhaustion and ballooned feed in the evening. Our routine.',
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
                        'There was time to think and learn about the country while vegging out in a bunk bed after a long day. ',
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
                        'Taiwan is a very, very big island. It’s incredibly mountainous. The tallest mountain peaks at four kilometres from the sea level, taller than Mt Fuji in Japan.',
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
                        'The tunnels that burrow throughout the country’s rugged terrain are incredibly long, elaborate and technically impressive. In many places, there would be a few of them going in parallel.',
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
              type: 'quote',
              nodes: [
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
                            'During one of the walks, I read a plaque about an engineer that got swooped by a landslide along with his entire crew while building the bridge that bears his name.',
                          marks: []
                        }
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
                        'The terrifying reason for that is the earthquakes, that would periodically render roads unsafe, requiring a new route to be built.',
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
                        'During one of the walks, I read a plaque about an engineer that got swooped by a landslide along with his entire crew while building the bridge that bears his name. ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text:
                        '“Taiwan is built on a constantly-changing landscape” — ',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
                    },
                    { kind: 'range', text: 'it read.', marks: [] }
                  ]
                }
              ]
            },
            {
              data: {
                caption: '“Taroko Mountain Highway” - shot on Instax Mini 90.',
                src: '/images/pictures/taiwan-taroko.jpg',
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
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: 'Sun Moon Lake.', marks: [] }]
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
                        'Sun Moon Lake is a notable park not too far from Taipei. Beautiful scenery, plenty of birds and tourists too.',
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
                        'Consistently with our typical behaviour, we rented a pair of bicycles and went on exploring beyond the neat paths, but not too far this time. We’ve seen a lot of nature by this point, no hills or trees could grab our attention anymore. But the clarity and the colour of aquamarine water of the lake ended up making a lasting impression.',
                      marks: []
                    }
                  ]
                }
              ]
            },
            {
              data: {},
              kind: 'block',
              isVoid: true,
              type: 'divider',
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Taiwan was good. It felt comfortable, safe and easy to get around (at least while in Taipei). I can’t say the same about most of the places we’ve been to. The island has a turbulent and interesting history, phenomenal culture, and, undoubtedly, a notable position on the world’s political landscape.',
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
                  ranges: [{ kind: 'range', text: '', marks: [] }]
                }
              ]
            },
            {
              data: {
                caption:
                  '“Emerald-Green Waters of Sun Moon Lake” - shot on Instax Mini 90.',
                src: '/images/pictures/taiwan-sunmoon-green.jpg',
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
              data: {
                caption:
                  '“A Boat Approaching the Docks” - shot on Instax Mini 90.',
                src: '/images/pictures/taiwan-sunmoonboat.jpg',
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
              data: {
                caption:
                  'Perhaps best-composed and best-lit photo from the entire trip. “The Boat and its Buoy” - shot on Instax Mini 90.',
                src: '/images/pictures/taiwan-boat.jpg',
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
  },
  {
    tag: 'photo-essay',
    slug: 'when-was-this-again-pem1',
    title: 'When Was This, Again?',
    subtitle: '',
    id: 'pem1',
    'post-date': '1501923600',
    stats: {
      images: '1',
      words: '110'
    },
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    poster: {
      small: '/images/pictures/forgotten-photo.jpg',
      medium: '/images/pictures/forgotten-photo.jpg',
      large: '/images/pictures/forgotten-photo.jpg'
    },
    status: 'published',
    summary:
      'The photo above was taken over four years ago. Right around that time my career as a “Web Producer” has ended abruptly and thankfully. I was in Toronto selling and tossing all of our numerous and useless belongings, while Betty was setting up camp in China and reconnecting with her family. This is when she took this photo.',
    content: {
      raw: {
        document: {
          data: {},
          kind: 'document',
          nodes: [
            {
              data: {
                caption:
                  'This picture was taken in 2013 in Dalian, China with La Sardinia plastic toy camera.',
                src: '/images/pictures/forgotten-photo.jpg',
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
                  ranges: [
                    {
                      kind: 'range',
                      text: 'The photo above was taken over four years ago.',
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
                        'Right around that time my career as a “Web Producer” has ended abruptly and thankfully. I was in Toronto selling and tossing all of our numerous and useless belongings, while Betty was setting up camp in China and reconnecting with her family. This is when she took this photo.',
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
                        'I love it for the colours, the angle, the setting and the timelessness within.',
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
                        'Seeing this image for the first time felt special. ',
                      marks: []
                    },
                    {
                      kind: 'range',
                      text:
                        'It spent a year in a backpack as a roll of undeveloped film.',
                      marks: [{ data: {}, kind: 'mark', type: 'bold' }]
                    },
                    {
                      kind: 'range',
                      text:
                        ' Transiting across Asia and three more years in various drawers. Until being finally developed in Bangkok during our recent ',
                      marks: []
                    }
                  ]
                },
                {
                  data: {
                    href:
                      'https://analog.cafe/zine/bangkok-taipei-jiufen-taroko-taichung-nwj7'
                  },
                  kind: 'inline',
                  isVoid: false,
                  type: 'link',
                  nodes: [
                    {
                      kind: 'text',
                      ranges: [{ kind: 'range', text: 'trip', marks: [] }]
                    }
                  ]
                },
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: ' to Taiwan.', marks: [] }]
                }
              ]
            }
          ]
        },
        kind: 'state'
      }
    }
  },
  {
    tag: 'photo-essay',
    slug: 'within-the-mind-and-emotions-k38F',
    title: 'Within the Mind and Emotions',
    subtitle: '',
    id: 'k38F',
    'post-date': '1502010900',
    stats: {
      images: '3',
      words: '533'
    },
    author: {
      name: 'Robert Davie',
      id: 'robert-davie'
    },
    poster: {
      small: '/images/pictures/robert-angles.jpg',
      medium: '/images/pictures/robert-angles.jpg',
      large: '/images/pictures/robert-angles.jpg'
    },
    status: 'published',
    summary:
      'Below are Robert’s three selected photographs from Yorkshire Museum of Farming. They are all shot on black-and-white, medium-format film. Rob’s motivation while approaching his subject is philosophical. His prime interest is the emotions that arise in the photographer’s and the viewers’ minds.',
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
                  ranges: [
                    { kind: 'range', text: 'Note from the editor.', marks: [] }
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
                        'Below are Robert’s three selected photographs from Yorkshire Museum of Farming. They are all shot on black-and-white, medium-format film.',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
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
                        'Rob’s motivation while approaching his subject is philosophical. His prime interest is the emotions that arise in the photographer’s and the viewers’ minds.',
                      marks: [{ data: {}, kind: 'mark', type: 'italic' }]
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
                  ranges: [{ kind: 'range', text: 'Angles.', marks: [] }]
                }
              ]
            },
            {
              data: {
                caption:
                  '“Angles” - shot on Ilford FP4+ with Mamiya RB67 and 90mm Sekor lens.',
                src: '/images/pictures/robert-angles.jpg',
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
                  ranges: [
                    {
                      kind: 'range',
                      text: 'I call this one “Angles”.',
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
                        'In its physical existence, the object photographed is a tractor sitting in a shed at the Yorkshire Museum of Farming near York, UK.',
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
                        'That might sound like an odd way to describe a photograph but it makes sense if you think about it for a second. The photograph is not the tractor. A photograph is not the thing it depicts. A photograph is a piece of art created by sifting physical reality through the creative tendencies of a human being and some amount of physical process depending on the medium. The question of whether photography is art will last forever. My own opinion is “it can be”. Much as paint can become art, a blank film in a camera can become art.',
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
                        'Coming back to this particular photograph, the information that it is showing, a piece of farm machinery from a particular angle is completely unimportant and frankly uninteresting. I choose to see it as representative of the fractured nature of reality based on perception and angle of view. One of my favourite quotes from “The Matrix” is “Eventually you come to realise that it is not the spoon that bends, it is yourself.” We create our own reality by will or by accident and my reality naturally influences how I interpret art and how I form my own photographs.',
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
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: 'Levers.', marks: [] }]
                }
              ]
            },
            {
              data: {
                caption:
                  '“Levers” – shot on Ilford FP4+ with Mamiya RB67 and 90mm Sekor lens.',
                src: '/images/pictures/robert-levers.jpg',
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Our farming heritage is important. Without the move from Hunter-Gatherer to Farmer, we would not have society as it exists today. Whilst some could argue that would be a good thing, it would certainly be a very different world. One of the next great leaps forward was the mechanisation of farming. Levers played a major part in the control of this process, and indeed levers are a wonderful metaphor for the transition of our species away from the earth and towards their own destiny. Truly Humankind generally believes that they are separate from the earth and able to exist without considering it. Workers of the land know differently, our future and that of the land are inextricably joined and levers that act upon it also act upon ourselves.',
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
              type: 'heading',
              nodes: [
                {
                  kind: 'text',
                  ranges: [{ kind: 'range', text: 'Bars.', marks: [] }]
                }
              ]
            },
            {
              data: {
                caption:
                  '“Bars” – shot on Ilford FP4+ with Mamiya RB67 and 90mm Sekor lens.',
                src: '/images/pictures/robert-bars.jpg',
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
                  ranges: [
                    {
                      kind: 'range',
                      text:
                        'Life places many bars in our way. We butt up against them and they leave their marks from the pressure in our flesh. Some of those bars are rusted and pitted. They cut and pierce us and leave scars that will last a lifetime.',
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
                        'When making this photograph I felt hemmed in, short of breath and fearful. I could almost taste the rusted iron and sense the sharp edges of rust with the hairs on my arms. It draws me in and imprisons me within my own creation.',
                      marks: []
                    }
                  ]
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

const seed = () => articles.map(a => Article.create(a))

module.exports = seed
