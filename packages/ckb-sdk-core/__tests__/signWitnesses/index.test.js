const signWitnesses = require('../../lib/signWitnesses').default
const fixtures = require('./fixtures.json')

describe('test sign witnesses', () => {
  const fixtureTable = Object.entries(fixtures).map(
    ([title, { privateKey, privateKeys, transactionHash, witnesses, inputCells, expected, exception }]) => [
      title,
      privateKey,
      privateKeys,
      transactionHash,
      witnesses,
      inputCells,
      exception,
      expected,
    ],
  )

  test.each(fixtureTable)(
    '%s',
    (_title, privateKey, privateKeys, transactionHash, witnesses, inputCells, exception, expected) => {
      if (exception !== undefined) {
        const key = privateKey || (privateKeys && new Map(privateKeys))
        expect(() =>
          signWitnesses(key)({
            transactionHash,
            witnesses,
            inputCells,
          }),
        ).toThrowError(exception)
      } else if (privateKey !== undefined) {
        const signedWitnesses = signWitnesses(privateKey)({
          transactionHash,
          witnesses,
        })
        expect(signedWitnesses).toEqual(expected)
      } else if (privateKeys !== undefined) {
        const keys = new Map(privateKeys)
        const signedWitnesses = signWitnesses(keys)({
          transactionHash,
          witnesses,
          inputCells,
        })
        expect(signedWitnesses).toEqual(expected)
      }
    },
  )
})
