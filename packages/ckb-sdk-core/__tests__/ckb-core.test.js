const successFixtures = require('./successFixtures.json')
const exceptionFixtures = require('./exceptionFixtures.json')

const Core = require('../lib').default

const url = 'http://localhost:8114'
const core = new Core(url)

describe('ckb-core', () => {
  describe('success', () => {
    it('load the system cell', async () => {
      const fixture = successFixtures.loadSystemCell
      expect(core.config.systemCellInfo).toEqual(fixture.emptyInfo)

      const systemCellInfo = await core.loadSystemCell()
      expect(systemCellInfo).toEqual(fixture.target)
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
        console.log(!fixture.transaction.witnesses)
        expect(core.signTransaction(fixture.privateKey)(fixture.transaction)).rejects.toEqual(
          new Error(fixture.exception)
        )
      })

      it('throw an error with invalid cound of witnesses', () => {
        const fixture = exceptionFixtures.signTransactionWithInvalidCountOfWitnesses
        console.log(!fixture.transaction.witnesses)
        expect(core.signTransaction(fixture.privateKey)(fixture.transaction)).rejects.toEqual(
          new Error(fixture.exception)
        )
      })
    })
  })
})
