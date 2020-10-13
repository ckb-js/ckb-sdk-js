const { reconcilers } = require('@nervosnetwork/ckb-sdk-utils')
const { default: generateRawTransaction } = require('../../lib/generateRawTransaction')

const fixtures = require('./fixtures.json')

describe('Test generate raw transaction', () => {
  describe('With fee', () => {
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

  describe('With fee rate', () => {
    const fixtureTable = Object.entries(fixtures.feeRate).map(([title, { params, expected }]) => [
      title,
      params,
      expected,
    ])

    test.each(fixtureTable.slice(0, 1))(`%s`, (_title, params, expected) => {
      Object.defineProperty(params[0].fee, 'reconciler', { value: reconcilers.extraInputs })
      expect.assertions(1)
      expect(generateRawTransaction(...params)).toEqual(expected)
    })
  })
})
