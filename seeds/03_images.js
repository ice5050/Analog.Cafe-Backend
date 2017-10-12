const Image = require('../models/mongo/image')

const images = [
  {
    id: 'image-froth_1494768_f2622829ac8d445487896cf72bdf93f4',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_602087_670d80ef74d74f668acb97213f4f6d30',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    __v: 0
  },
  {
    id: 'image-froth_1653343_84ace1d9c2ba4627bba44c9bb7540c300',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    __v: 0
  },
  {
    id: 'image-froth_1661188_e836994792c049bf94352fbeff06274d',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    __v: 0
  },
  {
    id: 'image-froth_1681285_c7e1f09f8310492d9e71399415cf8fba',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    __v: 0
  },
  {
    id: 'image-froth_1681601_6a1ab133de704a6ab61be266cfa63e01',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    __v: 0
  },
  {
    id: 'image-froth_1681956_9ad677d272a84ebc9360ad6199372f8b',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    __v: 0
  },
  {
    id: 'image-froth_1653343_84ace1d9c2ba4627bba44c9bb7540c30',
    author: {
      name: 'Lee Clark',
      id: 'lee-clark'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484072_3da5a59cfca54a44a065728dea6e4ffa',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484002_2b6d2e001f5349f196203672e183e089',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484000_4d447d7580ad48f58543e0b8344de96b',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484610_c5a8e8eb5f124fe1974f0beed68ff392',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1480456_f058098f52474cb6bc0889241c5ad4fe',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1225490_adbd50b387054c3182980b1476f68081',
    author: {
      name: 'Robert Davie',
      id: 'robert-davie'
    },
    __v: 0
  },
  {
    id: 'image-froth_1225490_ba71e3b3f25c4821b73d0c80a2ef92dc',
    author: {
      name: 'Robert Davie',
      id: 'robert-davie'
    },
    __v: 0
  },
  {
    id: 'image-froth_1225490_d7c11d48ffad46dfa3dc3e62275fb8c9',
    author: {
      name: 'Robert Davie',
      id: 'robert-davie'
    },
    __v: 0
  },
  {
    id: 'image-froth_732601_28627c30886e4774920be8fb0db8859b',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_735024_1aee038dd9c1429e9aa3b2d9e47d86d0',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_739917_50a6aedf53c14af4ad68ef09c1366e12',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_741015_6e4c41e36ebc4c508119a05a4c38df03',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_742390_bf4448e147c9454e9084bef507a8410c',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_746547_740b4e528f444cd6aa3ec67ba2c4d1d4',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_755572_ef189e6b800d44b39de67b8ae166229c',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1343183_7f0f8f7c143d4d229178dba5717a16aa',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1354096_25c5cede2a9e443b8a23349232c8b99d',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1554001_dabdefe2369040e2963a977ba8c8e23d',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_620358_0a9fa3429d524c09bd95f14d8a3bada7',
    author: {
      name: 'Bailey Tovar',
      id: 'bailey-tovar'
    },
    __v: 0
  },
  {
    id: 'image-froth_620358_29b1cee5930745a2aa6bd1e3d8893a1d',
    author: {
      name: 'Bailey Tovar',
      id: 'bailey-tovar'
    },
    __v: 0
  },
  {
    id: 'image-froth_642559_570325bfe9ee4f72a7fc75cb45740257',
    author: {
      name: 'Bailey Tovar',
      id: 'bailey-tovar'
    },
    __v: 0
  },
  {
    id: 'image-froth_643347_0102f4ee776b4864b20fe7fbc5f3f9df',
    author: {
      name: 'Bailey Tovar',
      id: 'bailey-tovar'
    },
    __v: 0
  },
  {
    id: 'image-froth_895611_93b6c9b85ae34eb098fba4080439efb3',
    author: {
      name: 'Bailey Tovar',
      id: 'bailey-tovar'
    },
    __v: 0
  },
  {
    id: 'image-froth_1351899_e15e6a9a80fa4740a076997aa37131f6',
    author: {
      name: 'Bailey Tovar',
      id: 'bailey-tovar'
    },
    __v: 0
  },
  {
    id: 'image-froth_1500000_406a1fe3928e495684660026065dacd7',
    author: {
      name: 'Jacob Maracle',
      id: 'jacob-maracle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1335113_524125bc4e3042f08b662834749e56b5',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1345895_9a6dc6c6ff3a444a8399850652069d49',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1349528_105d603510c84050a4209ab5f738ac69',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_743494_e5a5f8dd0c424edeb4cc603046859331',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1333333_efd28278fb1a44c696db3f51f5122dd2',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_749906_b168e5319fa944d4a3eb996b41cd23dc',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_750187_c00ee5e5b3b1454fa76981bc57f71df0',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1498127_7c1f37498e2347c79e35d72c680b7a97',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1578532_7cb1b935fb75435aba5fb9bfafb5bebb',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1490683_d2ea84d103f342f6a8e245deb3b601cb',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1485608_a196226262ec4e87a8cbf0c10bcfd836',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_673828_0de9916e2c76479eab042cc37e9315f3',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_0f7c5ee28fd14f7b95318a32176bb289',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_59dfc055abab47bebf085eae3fc2e438',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_76cd0202fc424c61a78a2c7fc905c703',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_084b6396632247eebee44e1fd6ead87b',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_326b27970ee845f7a2f5a4aef48cb274',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_395cc2b5964d4a0ba808d87471ded4d8',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_4213f906207b4f86bd4ba40d76a412c0',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_08255740bad34af883cefaf04e592933',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_a68393a8fe40493e9966a4907a3f53d1',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_cd820d732d34436c976917d41acba4ed',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_d352b47b654f4554a6f45de1bac8f322',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_dde3f5d91fd64270908953f34b960381',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1484058_e7042f1bbf134b96bb5fc57b88c5bfda',
    author: {
      name: 'Lee Webb',
      id: 'lee-webb'
    },
    __v: 0
  },
  {
    id: 'image-froth_1494536_1fee0134c3ce4447a4876fabd5432643',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1494536_02e53712cd3b4f1caf7857ea71148b69',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1494536_da4a3be0cff1457185cbcc64417df1cb',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_669104_a50edf34d4d141aaa2264bef5643b2aa',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_615281_5882b729360a465491c07860f6ec32e5',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1494432_2ed2035b7e154d6c88cb0280406f7193',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1671053_317be704379048a0befbcbc9951ade58',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1519265_2bcab58088fd493f85f0e75e682711e6',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1500000_b302bcbd2dea4ed688daeb1d74f09aaf',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_658030_c87dd265779a4e709c66d7040fade49f',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_915090_05378814ac7d4b9b9352b603f2d944de',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1522572_19174bdd522e4ab185e52d9d6fe9e868',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1542912_2fdd00455a0249c18bda84128470b341',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1515070_603a06c453204daa8983a81bbbeb2c63',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_669104_8df1a40cea1746d79967ec4e694b59d9',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_669104_a3b70899a1e74905bcb73b1e566943fc',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1421801_3594a3b486ec433585abf725f6cb03bd',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_1398859_c2700ff1baab405fa6a60e4a452502db',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  },
  {
    id: 'image-froth_1333333_d2d1066f730542489392e53d84ec5d72',
    author: {
      name: 'dmitrizzle',
      id: 'dmitrizzle'
    },
    __v: 0
  },
  {
    id: 'image-froth_716043_c2f4f34e5c384ed5ade3ddac3d207029',
    author: {
      name: 'Betty',
      id: 'betty'
    },
    __v: 0
  }
]

const seed = () => images.map(i => Image.create(i))

module.exports = seed
