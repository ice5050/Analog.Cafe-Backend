const Image = require('../models/mongo/image')

const images = [
  {
    id: 'an-introduction-cat-tax',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    }
  },
  {
    id: 'brighton-beach-008',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    }
  },
  {
    id: 'brighton-beach-009',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    }
  },
  {
    id: 'brighton-beach-012',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    }
  },
  {
    id: 'brighton-beach-015',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    }
  },
  {
    id: 'brighton-beach-020',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    }
  },
  {
    id: 'brighton-beach-132',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    }
  },
  {
    id: 'forgotten-photo',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'lee-shanghai-1',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    }
  },
  {
    id: 'lee-shanghai-2',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    }
  },
  {
    id: 'lee-shanghai-3',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    }
  },
  {
    id: 'lee-shanghai-4',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    }
  },
  {
    id: 'robert-angles',
    author: {
      name: 'Robert Davie',
      id: 'robert-davie'
    }
  },
  {
    id: 'robert-bars',
    author: {
      name: 'Robert Davie',
      id: 'robert-davie'
    }
  },
  {
    id: 'robert-levers',
    author: {
      name: 'Robert Davie',
      id: 'robert-davie'
    }
  },
  {
    id: 'taiwan-bangkok',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-blossoms',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-boat',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-exhibition',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-jiufen',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-sunmoon-green',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-sunmoonboat',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-taroko',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-temple',
    author: {
      name: 'Betty',
      id: 'betty'
    }
  },
  {
    id: 'taiwan-tunnel',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    }
  }
]

const seed = () => images.map(i => Image.create(i))

module.exports = seed
