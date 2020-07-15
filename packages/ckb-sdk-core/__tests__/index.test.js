const fixtures = require('./fixtures.json')
const rpc = require('../__mocks__/rpc')

const { default: CKB } = require('../lib')

describe('ckb', () => {
  const url = 'http://localhost:8114'
  let ckb
  beforeEach(() => {
    ckb = new CKB(url)
  })

  describe('instantiate with default configuration', () => {
    it('default url is http://localhost:8114', () => {
      const c = new CKB()
      expect(c.node.url).toBe('http://localhost:8114')
    })
  })

  describe('load data', () => {
    it('load the secp256k1 dep', async () => {
      ckb.rpc = rpc
      jest.setTimeout(50000)
      const fixture = fixtures.loadSecp256k1Dep
      expect(ckb.config.loadSecp256k1Dep).toEqual(undefined)

      const secp256k1Dep = await ckb.loadSecp256k1Dep()
      expect(secp256k1Dep).toEqual(fixture.target)
    })

    it('load the dao dep', async () => {
      ckb.rpc = rpc
      jest.setTimeout(50000)
      const fixture = fixtures.loadDaoDep
      expect(ckb.config.loadDaoDep).toEqual(undefined)
      const daoDep = await ckb.loadDaoDep()
      expect(daoDep).toEqual(fixture.target)
    })

    it('load cells', async () => {
      ckb.rpc = rpc
      const lockHash = '0xe831b2179a00307607d254b6fae904047b1fb7f2c76968f305ec27841201739a'
      const cells = await ckb.loadCells({
        lockHash,
        end: BigInt(100),
        step: BigInt(100),
        save: true,
      })
      expect(cells).toHaveLength(100)
      expect(ckb.cells.size).toBe(1)
      expect(ckb.cells.get(lockHash)).toHaveLength(100)
    })
  })

  describe('set node', () => {
    const newURL = 'http://localhost:8080'
    it('has url set by instantication', () => {
      expect(ckb.node.url).toBe(url)
      expect(ckb.rpc.node.url).toBe(url)
    })
    it('set node with url', () => {
      ckb.setNode(newURL)
      expect(ckb.node.url).toBe(newURL)
      expect(ckb.rpc.node.url).toBe(newURL)
    })
    it('set node with node object', () => {
      ckb.setNode({
        url,
      })
      expect(ckb.node.url).toBe(url)
      expect(ckb.node.url).toBe(url)
    })
  })

  describe('generate lockHash', () => {
    const params = {
      publicKeyHash: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
      deps: {
        hashType: 'type',
        codeHash: '0x1892ea40d82b53c678ff88312450bbb17e164d7a3e0a90941aa58839f56f8df2',
      },
    }
    it('generate lock hash', () => {
      const lockHash = ckb.generateLockHash(params.publicKeyHash, params.deps)
      expect(lockHash).toBe('0x0fec94c611533c9588c8ddfed557b9024f4431a65ace4b1e7106388ddd5dd87b')
    })

    it('lack fo deps should throw an error', () => {
      expect(() => ckb.generateLockHash(params.publicKeyHash)).toThrowError('deps is required')
    })
  })

  describe('sign transaction', () => {
    const fixtureTable = Object.entries(fixtures.signTransaction).map(([title, { params, expected, exception }]) => [
      title,
      params.privateKey,
      params.transaction,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, privateKey, transaction, expected, exception) => {
      expect.assertions(1)
      try {
        const signedTransactionWithPrivateKey = ckb.signTransaction(privateKey)(transaction)
        expect(signedTransactionWithPrivateKey).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

  describe('generate raw transactin', () => {
    const fixtureTable = Object.entries(
      fixtures.generateRawTransaction,
    ).map(([title, { params, expected, exception }]) => [title, params, expected, exception])

    test.each(fixtureTable)('%s', (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        const rawTransaction = ckb.generateRawTransaction({
          ...params,
          capacity: BigInt(params.capacity),
          fee: BigInt(params.fee || 0),
        })
        expect(rawTransaction).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

  describe('nervos dao', () => {
    it('generate deposit transaction', async () => {
      ckb.rpc = rpc
      const { params, expected } = fixtures.generateDaoDepositTransaction
      const p = {
        fromAddress: params.fromAddress,
        capacity: BigInt(params.capacity),
        fee: BigInt(params.fee),
        cells: params.cells,
      }
      expect(() => ckb.generateDaoDepositTransaction(p)).toThrowError('Secp256k1 dep is required')
      await ckb.loadSecp256k1Dep()
      expect(() => ckb.generateDaoDepositTransaction(p)).toThrowError('Dao dep is required')
      await ckb.loadDaoDep()
      const tx = await ckb.generateDaoDepositTransaction(p)
      expect(tx).toEqual(expected)
    })

    it.skip('generate start withdraw transaction', async () => {
      const { params, expected } = fixtures.generateDaoWithdrawStartTransaction
      const tx = await ckb.generateDaoWithdrawStartTransaction({
        outPoint: params.outPoint,
        fee: BigInt(params.fee),
        cells: params.cells,
      })
      expect(tx).toEqual(expected)
    })
  })
})
