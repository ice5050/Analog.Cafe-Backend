const { cleanUrl } = require('./ability')

test('cleanUrl function', () => {
  expect(cleanUrl('https://google.com?q=1')).toEqual('https://google.com')
})
