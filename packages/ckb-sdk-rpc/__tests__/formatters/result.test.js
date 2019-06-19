const resultFmt = require('../../lib/resultFormatter').default
const fixtures = require('./result.json')

const { success } = fixtures

describe('result formatter success', () => {
  test.each(Object.keys(success))('%s', methodName => {
    success[methodName].forEach(fixture => {
      const formatted = resultFmt[methodName](fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })
})
