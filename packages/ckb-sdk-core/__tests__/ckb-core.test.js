const successFixtures = require('./successFixtures.json')
const exceptionFixtures = require('./exceptionFixtures.json')

const Core = require('../lib').default

const url = 'http://localhost:8114'
const core = new Core(url)

describe('ckb-core', () => {
  describe('success', () => {
    it('load the secp256k1 dep', async () => {
      const fixture = successFixtures.loadSecp256k1Dep
      expect(core.config.loadSecp256k1Dep).toEqual(undefined)

      const secp256k1Dep = await core.loadSecp256k1Dep()
      expect(secp256k1Dep).toEqual(fixture.target)
    })

    it('sign witnesses', () => {
      const fixture = successFixtures.signWitnesses
      const signedWitnessesByPrivateKey = core.signWitnesses(fixture.privateKey)(fixture.message)
      expect(signedWitnessesByPrivateKey).toEqual(fixture.target)

      const signedWitnessesByAddressObject = core.signWitnesses(core.generateAddress(fixture.privateKey))(
        fixture.message
      )
      expect(signedWitnessesByAddressObject).toEqual(fixture.target)
    })

    it('compute script hash', async () => {
      const fixture = {
        script: {
          codeHash: '0xb35557e7e9854206f7bc13e3c3a7fa4cf8892c84a09237fb0aab40aab3771eee',
          hashType: 'Data',
          args: [],
        },
        scriptHash: '0xeb69f265382eb9d5139be8c918e51f2ab65027c975db60f90130735776b4751e',
      }
      const camputedHash = await core.rpc.computeScriptHash(fixture.script)
      expect(camputedHash).toBe(fixture.scriptHash)
    })

    it('sign transaction', async () => {
      const fixture = successFixtures.signTransaction
      const signedTransactionWithPrivateKey = await core.signTransaction(fixture.privateKey)(fixture.transaction)
      const signedTransactionWithAddressObj = await core.signTransaction(core.generateAddress(fixture.privateKey))(
        fixture.transaction
      )
      expect(signedTransactionWithPrivateKey).toEqual(fixture.target)
      expect(signedTransactionWithAddressObj).toEqual(fixture.target)
    })
  })

  describe('exceptions', () => {
    describe('sign witneses', () => {
      it('throw an error when key is missing', () => {
        const fixture = exceptionFixtures.signWitnessesWithoutKey
        expect(() => core.signWitnesses(fixture.privateKey)(fixture.message)).toThrowError(fixture.exception)
      })

      it('throw an error when transaction hash is missing', () => {
        const fixture = exceptionFixtures.signWitnessesWithoutTransactionHash
        expect(() => core.signWitnesses(fixture.privateKey)(fixture.message)).toThrowError(fixture.exception)
      })
    })

    describe('sign transaction', () => {
      it('throw an error when key is missing', () => {
        const fixture = exceptionFixtures.signTransactionWithoutKey
        expect(core.signTransaction(fixture.privateKey)(fixture.transaction)).rejects.toEqual(
          new Error(fixture.exception)
        )
      })

      it('throw an error when trasnaction is missing', () => {
        const fixture = exceptionFixtures.signTransactionWithoutTransaction
        expect(core.signTransaction(fixture.privateKey)(fixture.transaction)).rejects.toEqual(
          new Error(fixture.exception)
        )
      })

      it('throw an error when witnesses is missing', () => {
        const fixture = exceptionFixtures.signTransactionWithoutWitnesses
        expect(core.signTransaction(fixture.privateKey)(fixture.transaction)).rejects.toEqual(
          new Error(fixture.exception)
        )
      })

      it('throw an error with invalid cound of witnesses', () => {
        const fixture = exceptionFixtures.signTransactionWithInvalidCountOfWitnesses
        expect(core.signTransaction(fixture.privateKey)(fixture.transaction)).rejects.toEqual(
          new Error(fixture.exception)
        )
      })
    })
  })
})
