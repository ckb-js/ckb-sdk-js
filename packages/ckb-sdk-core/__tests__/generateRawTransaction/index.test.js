const { default: generateRawTransaction, getLeftCells } = require('../../lib/generateRawTransaction')

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

  describe.only('getLeftCells', () => {
    const fixtureTable = Object.entries(fixtures.getLeftCells).map(([title, { params, expected }]) => [
      title,
      params.map(param => ({
        inputScripts: param.inputScripts,
        usedCells: param.usedCells,
        unspentCellsMap: new Map(param.unspentCellsMap),
      })),
      expected,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected) => {
      expect.assertions(1)

      expect(getLeftCells(...params)).toEqual(expected)
    })
  })
})
