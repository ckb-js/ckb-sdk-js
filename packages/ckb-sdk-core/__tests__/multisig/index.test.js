const multisig = require('../../lib/multisig')
const fixtures = require('./fixtures.json')

describe('test multisig functions', () => {
  const fixtureTable = Object.entries(fixtures).map(
    ([title, { functionName, config, expected, exception }]) => [
      title,
      functionName,
      config,
      exception,
      expected
    ],
  )

  test.each(fixtureTable)(
    '%s',
    (_title, functionName, config, exception, expected) => {
      if (exception !== undefined) {
        expect(() =>multisig[functionName](config)).toThrowError(exception)
      } else {
        const result = multisig[functionName](config)
        expect(result).toEqual(expected)
      }
    },
  )
})
