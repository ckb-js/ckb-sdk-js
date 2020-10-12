const { calculateTransactionFee } = require('../../lib/calculateTransactionFee')
const transactionFeeFixtures = require('./fixtures.json')

describe('calculate transaction fee', () => {
  const fixtureTable = Object.entries(
    transactionFeeFixtures,
  ).map(([title, { transactionSize, feeRate, expected, exception }]) => [
    title,
    typeof transactionSize === 'number' ? BigInt(transactionSize) : transactionSize,
    typeof feeRate === 'number' ? BigInt(feeRate) : feeRate,
    expected,
    exception,
  ])
  test.each(fixtureTable)('%s', (_title, transactionSize, feeRate, expected, exception) => {
    if (undefined !== expected) {
      expect(calculateTransactionFee(transactionSize, feeRate)).toBe(expected)
    }
    if (undefined !== exception) {
      expect(() => calculateTransactionFee(transactionSize, feeRate)).toThrowError(exception)
    }
  })
})
