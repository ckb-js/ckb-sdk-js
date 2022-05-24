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
    (_title, privateKey, privateKeys, signatureProviders, transactionHash, witnesses, inputCells, multisigConfig, exception, expected) => {
      if (exception !== undefined) {
        const key = privateKey || (privateKeys && new Map(privateKeys))
        expect(
          () => signWitnesses(key)({
            transactionHash,
            witnesses,
            inputCells,
            multisigConfig
          })
        ).toThrowError(exception)
      } else if (privateKey !== undefined) {
        const signedWitnesses = signWitnesses(privateKey)({
          transactionHash,
          witnesses,
          multisigConfig
        })
        expect(signedWitnesses).toEqual(expected)
      } else if (privateKeys !== undefined) {
        const keys = new Map(privateKeys)
        const signedWitnesses = signWitnesses(keys)({
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
        const signedWitnesses = signWitnesses(sigProviderMaps)({
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
