const { calculateLockEpochs, absoluteEpochSince, filterCellsByInputs } = require('../../lib/utils')
const fixtures = require('./fixtures.json')

describe('Test utils', () => {
  describe('Test calculate lock epochs', () => {
    const fixtureTable = fixtures.calculateLockEpochs.map(({ depositEpoch, withdrawEpoch, expected }) => [
      depositEpoch,
      withdrawEpoch,
      expected,
    ])

    test.each(fixtureTable)(`(%s, %s) => %s`, (depositEpoch, withdrawEpoch, expected) => {
      const actual = calculateLockEpochs({
        depositEpoch,
        withdrawEpoch,
        DAO_LOCK_PERIOD_EPOCHS: 180,
      })
      expect(actual.toString()).toBe(expected)
    })
  })

  describe('Test absolute epoch since', () => {
    const fixtureTable = fixtures.absoluteEpochSince.map(({ params, expected, exception }) => [
      params,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`%s => %s ? %s`, (params, expected, exception) => {
      expect.assertions(1)
      try {
        const actual = absoluteEpochSince(params)
        expect(actual).toBe(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

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
