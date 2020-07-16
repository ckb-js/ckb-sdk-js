const { filterCellsByInputs } = require('../../lib/utils')
const fixtures = require('./fixtures.json')

describe('Test utils', () => {
  describe('Test filter cells by inputs', () => {
    const fixtureTable = fixtures.filterCellsByInputs.map(({ params, expected, exception }) => [
      params.cells,
      params.inputs,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`(%j, %j) => %j ? %s`, (cells, inputs, expected, exception) => {
      expect.assertions(1)
      try {
        const actual = filterCellsByInputs(cells, inputs)
        expect(actual).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })
})
