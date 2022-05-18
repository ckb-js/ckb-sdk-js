const signWitnesses = require('../../lib/signWitnesses').default
const ECPair = require('../../../ckb-sdk-utils/lib/ecpair').default
const fixtures = require('./fixtures.json')

describe('test sign witnesses', () => {
  const fixtureTable = Object.entries(fixtures).map(
    ([title, { privateKey, privateKeys, signatureProviders, transactionHash, witnesses, inputCells, expected, exception, multisigConfig }]) => [
      title,
      privateKey,
      privateKeys,
      signatureProviders,
      transactionHash,
      witnesses,
      inputCells,
      multisigConfig,
      exception,
      expected,
    ],
  )

  test.each(fixtureTable)(
    '%s',
    async (_title, privateKey, privateKeys, signatureProviders, transactionHash, witnesses, inputCells, multisigConfig, exception, expected) => {
      if (exception !== undefined) {
        const key = privateKey || (privateKeys && new Map(privateKeys))
        await expect(
          signWitnesses(key)({
            transactionHash,
            witnesses,
            inputCells,
            multisigConfig
          })
        ).rejects.toThrowError(exception)
      } else if (privateKey !== undefined) {
        const signedWitnesses = await signWitnesses(privateKey)({
          transactionHash,
          witnesses,
          multisigConfig
        })
        expect(signedWitnesses).toEqual(expected)
      } else if (privateKeys !== undefined) {
        const keys = new Map(privateKeys)
        const signedWitnesses = await signWitnesses(keys)({
          transactionHash,
          witnesses,
          inputCells,
          multisigConfig
        })
        expect(signedWitnesses).toEqual(expected)
      } else if (signatureProviders !== undefined) {
        const sigProviderMaps = new Map()
        signatureProviders.forEach(([lockHash, key]) => {
          sigProviderMaps.set(lockHash, (message) => new ECPair(key).signRecoverable(message))
        })
        const signedWitnesses = await signWitnesses(sigProviderMaps)({
          transactionHash,
          witnesses,
          inputCells,
          multisigConfig
        })
        expect(signedWitnesses).toEqual(expected)
      }
    },
  )
})
