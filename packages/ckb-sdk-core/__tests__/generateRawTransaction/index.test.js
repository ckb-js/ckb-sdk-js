const { default: generateRawTransaction } = require('../../lib/generateRawTransaction')
const { default: Core } = require('../../lib')
const rpc = require('../../__mocks__/rpc')

const fixtures = require('./fixtures.json')

describe('generate raw transaction', () => {
  const core = new Core('http://localhost:8114')
  core.rpc = rpc

  const fixtureTable = Object.entries(fixtures).map(([title, { params, expected, exception }]) => [
    title,
    params,
    expected,
    exception,
  ])

  test.each(fixtureTable)('%s', (title, params, expected, exception) => {
    if (undefined === exception) {
      const rawTransaction = generateRawTransaction(params)
      expect(rawTransaction).toEqual(expected)
    } else {
      expect(generateRawTransaction(params)).rejects.toThrowError(exception)
    }
  })
})
