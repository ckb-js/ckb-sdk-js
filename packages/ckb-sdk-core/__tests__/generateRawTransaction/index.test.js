const { JSBI } = require('@nervosnetwork/ckb-sdk-utils')
const {
  default: generateRawTransaction,
  getBigInts,
  getKeyAndCellsPairs,
  getTargetOutputs,
  getInputs,
} = require('../../lib/generateRawTransaction')

const fixtures = require('./fixtures.json')

describe('Test generate raw transaction', () => {
  describe('generateRawTransaction', () => {
    const fixtureTable = Object.entries(
      fixtures.generateRawTransaction,
    ).map(([title, { params, expected, exception }]) => [title, params, expected, exception])

    test.each(fixtureTable)('%s', (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        let fmtParams = params
        if ('inputScript' in params) {
          fmtParams = { ...params, capacity: BigInt(params.capacity), fee: BigInt(params.fee || 0) }
        } else {
          fmtParams = {
            ...params,
            outputs: params.outputs.map(output => ({ ...output, capacity: BigInt(output.capacity) })),
            cells: new Map(params.cells),
            fee: BigInt(params.fee || 0),
          }
        }
        const rawTransaction = generateRawTransaction(fmtParams)
        expect(rawTransaction).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

  describe('getBigInts', () => {
    const fixtureTable = Object.entries(fixtures.getBigInts).map(([title, { params, expected, exception }]) => [
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

  describe('getKeyAndCellsPairs', () => {
    const fixtureTable = Object.entries(
      fixtures.getKeyAndCellsPairs,
    ).map(([title, { params, expected, exception }]) => [title, params, expected, exception])

    test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        if (Array.isArray(expected.unspentCellsMap[0])) {
          // eslint-disable-next-line
          expected.unspentCellsMap = new Map(expected.unspentCellsMap)
        }
        if (Array.isArray(params[0].cells[0])) {
          // eslint-disable-next-line
          params[0].cells = new Map(params[0].cells)
        }
        expect(getKeyAndCellsPairs(...params)).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

  describe('getTargetOutputs', () => {
    const fixtureTable = Object.entries(fixtures.getTargetOutputs).map(([title, { params, expected, exception }]) => [
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

  describe('getInputs', () => {
    const fixtureTable = Object.entries(fixtures.getInputs).map(([title, { params, expected, exception }]) => [
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
