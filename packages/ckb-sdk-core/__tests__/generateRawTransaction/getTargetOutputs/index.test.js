const { JSBI } = require('@nervosnetwork/ckb-sdk-utils')
const { getTargetOutputs } = require('../../../lib/generateRawTransaction')
const fixtures = require('./fixtures.json')

describe('Test generate raw transaction', () => {
  describe('getTargetOutputs', () => {
    const fixtureTable = Object.entries(fixtures).map(([title, { params, expected, exception }]) => [
      title,
      params,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        expect(getTargetOutputs({ ...params[0], minCapacity: JSBI.BigInt(params[0].minCapacity) })).toEqual(
          expected.map(output => ({ ...output, capacity: JSBI.BigInt(output.capacity) })),
        )
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })
})
