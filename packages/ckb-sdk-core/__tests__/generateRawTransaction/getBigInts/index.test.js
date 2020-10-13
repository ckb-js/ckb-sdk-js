const { JSBI } = require('@nervosnetwork/ckb-sdk-utils')
const { getBigInts } = require('../../../lib/generateRawTransaction')
const fixtures = require('./fixtures.json')

describe('Test generate raw transaction', () => {
  describe('getBigInts', () => {
    const fixtureTable = Object.entries(fixtures).map(([title, { params, expected, exception }]) => [
      title,
      params,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        expect(getBigInts(...params)).toEqual({
          targetFee: JSBI.BigInt(expected.targetFee),
          minCapacity: JSBI.BigInt(expected.minCapacity),
          minChange: JSBI.BigInt(expected.minChange),
          zeroBigInt: JSBI.BigInt(0),
        })
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })
})
