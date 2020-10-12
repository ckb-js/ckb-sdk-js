const { getKeyAndCellsPairs } = require('../../../lib/generateRawTransaction')
const fixtures = require('./fixtures.json')

describe('Test generate raw transaction', () => {
  describe('getKeyAndCellsPairs', () => {
    const fixtureTable = Object.entries(fixtures).map(([title, { params, expected, exception }]) => [
      title,
      params,
      expected,
      exception,
    ])

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
})
