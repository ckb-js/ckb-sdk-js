const { calculateLockEpochs } = require('../../lib/utils')
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
})
