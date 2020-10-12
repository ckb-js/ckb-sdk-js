const { JSBI } = require('@nervosnetwork/ckb-sdk-utils')
const { getInputs } = require('../../../lib/generateRawTransaction')
const fixtures = require('./fixtures.json')

describe('Test generate raw transaction', () => {
  describe('getInputs', () => {
    const fixtureTable = Object.entries(fixtures).map(([title, { params, expected, exception }]) => [
      title,
      params,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        const [param] = params
        param.costCapacity = JSBI.BigInt(param.costCapacity)
        param.unspentCellsMap = new Map(param.unspentCellsMap)
        expect(getInputs(param)).toEqual({ ...expected, sum: JSBI.BigInt(expected.sum) })
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })
})
