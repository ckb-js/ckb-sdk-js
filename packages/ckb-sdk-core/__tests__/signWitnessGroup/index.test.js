const signWitnessGroup = require('../../lib/signWitnessGroup').default
const fixtures = require('./fixtures.json')

describe('test sign witness group', () => {
  const fixtureTable = Object.entries(
    fixtures,
  ).map(([title, { privateKey, transactionHash, witnesses, multisigConfig, expected, exception }]) => [
    title,
    privateKey,
    transactionHash,
    witnesses,
    multisigConfig,
    exception,
    expected,
  ])

  test.each(fixtureTable)('%s', async (_title, privateKey, transactionHash, witnesses, multisigConfig, exception, expected) => {
    expect.assertions(1)
    if (exception !== undefined) {
      await expect(signWitnessGroup(privateKey, transactionHash, witnesses, multisigConfig)).rejects.toThrowError(exception)
    } else if (privateKey !== undefined) {
      const signedWitnessGroup = await signWitnessGroup(privateKey, transactionHash, witnesses, multisigConfig)
      expect(signedWitnessGroup).toEqual(expected)
    }
  })
})
