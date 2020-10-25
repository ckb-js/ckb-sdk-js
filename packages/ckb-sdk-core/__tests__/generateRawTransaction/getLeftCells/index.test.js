const { getLeftCells } = require('../../../lib/generateRawTransaction')
const fixtures = require('./fixtures.json')

describe('Test generate raw transaction', () => {
  describe('getLeftCells', () => {
    const fixtureTable = Object.entries(fixtures).map(([title, { params, expected }]) => [
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
