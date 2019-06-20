const paramsFmt = require('../../lib/paramsFormatter').default
const fixtures = require('./params.json')

const { success, failure } = fixtures

describe('params formatter success', () => {
  test.each(Object.keys(success))('%s', metohdName => {
    success[metohdName].forEach(fixture => {
      const formatted = paramsFmt[metohdName](fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })
})

describe('param formatter failure', () => {
  test.each(Object.keys(failure))('%s', methodName => {
    failure[methodName].forEach(fixture => {
      expect(() => paramsFmt[methodName](fixture.source)).toThrowError(fixture.error)
    })
  })
})
