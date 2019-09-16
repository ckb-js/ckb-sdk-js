const { default: paramsFmt } = require('../../lib/paramsFormatter')
const fixtures = require('./params.fixtures.json')

describe('params formatter', () => {
  describe.each(Object.keys(fixtures))('%s', methodName => {
    const fixtureTable = Object.values(fixtures[methodName]).map(({ param, expected, exception }) => [
      param,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%j => %j', (param, expected, exception) => {
      if (undefined !== expected) {
        const formatted = paramsFmt[methodName](param)
        expect(formatted).toEqual(expected)
      }
      if (undefined !== exception) {
        expect(() => paramsFmt[methodName](param)).toThrow(new Error(exception))
      }
    })
  })
})
