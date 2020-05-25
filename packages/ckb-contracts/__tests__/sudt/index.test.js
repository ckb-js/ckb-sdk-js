const { SUDT } = require('../../lib')
const cachedCells = require('./cachedCells.json')
const expectedTx = require('./rawTx.json')

describe('Test sUDT', () => {
  describe('Test Deploy', () => {
    it('Basic Deploy', async () => {
      const contract = new SUDT()
      const sk = `0x${'e'.repeat(64)}`
      const user = contract.utils.privateKeyToAddress(sk)

      contract.config.secp256k1Dep = {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        outPoint: {
          txHash: '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708',
          index: '0x0',
        },
      }

      contract.user = user
      const lockScript = {
        codeHash: contract.config.secp256k1Dep.codeHash,
        hashType: contract.config.secp256k1Dep.hashType,
        args: contract.args,
      }
      const lockHash = contract.utils.scriptToHash(lockScript)
      contract.cells.set(lockHash, cachedCells)
      const rawTx = await contract.generateDeployTransaction()
      const expectedRawTx = JSON.parse(
        JSON.stringify({ ...expectedTx, witnesses: [{ lock: '', inputType: '', outputType: '' }] }),
      )
      expect(rawTx).toEqual(expectedRawTx)
      contract.rpc = {
        getTipBlockNumber: jest.fn().mockReturnValue('0x999999'),
        sendTransaction: jest.fn().mockReturnValue(),
      }
      await contract.deploy(sk)
      expect(contract.rpc.sendTransaction.mock.calls[0][0]).toEqual(expectedTx)
    })
  })
})
