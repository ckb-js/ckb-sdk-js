const fixtures = require('./fixtures.json')

const { default: Core } = require('../lib')

const url = 'http://localhost:8114'
const core = new Core(url)

describe('ckb-core', () => {
  it('load the secp256k1 dep', async () => {
    jest.setTimeout(50000)
    const fixture = fixtures.loadSecp256k1Dep
    expect(core.config.loadSecp256k1Dep).toEqual(undefined)

    const secp256k1Dep = await core.loadSecp256k1Dep()
    expect(secp256k1Dep).toEqual(fixture.target)
  })

  describe('sign witnesses', () => {
    const fixtureTable = Object.entries(fixtures.signWitnesses).map(
      ([title, { privateKey, message, expected, exception }]) => [title, privateKey, message, expected, exception]
    )
    test.each(fixtureTable)('%s', (_title, privateKey, message, expected, exception) => {
      if (undefined !== expected) {
        const signedWitnessesByPrivateKey = core.signWitnesses(privateKey)(message)
        expect(signedWitnessesByPrivateKey).toEqual(expected)

        const signedWitnessesByAddressObject = core.signWitnesses(core.generateAddress(privateKey))(message)
        expect(signedWitnessesByAddressObject).toEqual(expected)
      }
      if (undefined !== exception) {
        expect(() => core.signWitnesses(privateKey)(message)).toThrowError(exception)
      }
    })
  })

  describe('compute script hash', () => {
    const fixtureTable = Object.entries(fixtures.computeScriptHash).map(([title, { script, expected, exception }]) => [
      title,
      script,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', async (_title, script, expected, exception) => {
      if (undefined !== exception) {
        const computedHash = await core.rpc.computeScriptHash(script)
        expect(computedHash).toBe(expected)
      }
      if (undefined !== exception) {
        expect(core.rpc.computeScriptHash(script)).reject.toBe(new Error(exception))
      }
    })
  })

  describe('sign transaction', async () => {
    const fixtureTable = Object.entries(fixtures.signTransaction).map(
      ([title, { privateKey, transaction, expected, exception }]) => [
        title,
        privateKey,
        transaction,
        expected,
        exception,
      ]
    )
    test.each(fixtureTable)('%s', (_title, privateKey, transaction, expected, exception) => {
      if (undefined !== expected) {
        const signedTransactionWithPrivateKey = core.signTransaction(privateKey)(transaction)
        const signedTransactionWithAddressObj = core.signTransaction(core.generateAddress(privateKey))(transaction)
        expect(signedTransactionWithPrivateKey).toEqual(expected)
        expect(signedTransactionWithAddressObj).toEqual(expected)
      }
      if (undefined !== exception) {
        expect(() => core.signTransaction(privateKey)(transaction)).toThrow(new Error(exception))
      }
    })
  })
})
