const { getTransactionSize } = require('../../lib/sizes')
const fixtures = require('./fixtures.json')

describe('Test sizes', () => {
  describe('getTransactionSize', () => {
    const fixtureTable = Object.entries(fixtures.getTransactionSize).map(([title, { params, expected }]) => [
      title,
      params,
      expected,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected) => {
      expect.assertions(1)
      expect(getTransactionSize(...params)).toBe(expected)
    })
  })
})
