const fixtures = require('./fixtures.json')
const rpc = require('../__mocks__/rpc')

const { default: Core } = require('../lib')

describe('ckb-core', () => {
  const url = 'http://localhost:8114'
  let core
  beforeEach(() => {
    core = new Core(url)
  })

  describe('instantiate with default configuration', () => {
    it('default url is http://localhost:8114', () => {
      const c = new Core()
      expect(c.node.url).toBe('http://localhost:8114')
    })
  })

  describe('load data', () => {
    it('load the secp256k1 dep', async () => {
      core.rpc = rpc
      jest.setTimeout(50000)
      const fixture = fixtures.loadSecp256k1Dep
      expect(core.config.loadSecp256k1Dep).toEqual(undefined)

      const secp256k1Dep = await core.loadSecp256k1Dep()
      expect(secp256k1Dep).toEqual(fixture.target)
    })

    it('load the dao dep', async () => {
      core.rpc = rpc
      jest.setTimeout(50000)
      const fixture = fixtures.loadDaoDep
      expect(core.config.loadDaoDep).toEqual(undefined)
      const daoDep = await core.loadDaoDep()
      expect(daoDep).toEqual(fixture.target)
    })

    it('load cells', async () => {
      core.rpc = rpc
      const lockHash = '0xe831b2179a00307607d254b6fae904047b1fb7f2c76968f305ec27841201739a'
      const cells = await core.loadCells({
        lockHash,
        end: BigInt(100),
        step: BigInt(100),
        save: true,
      })
      expect(cells).toHaveLength(100)
      expect(core.cells.size).toBe(1)
      expect(core.cells.get(lockHash)).toHaveLength(100)
    })
  })

  describe('set node', () => {
    const newURL = 'http://localhost:8080'
    it('has url set by instantication', () => {
      expect(core.node.url).toBe(url)
      expect(core.rpc.node.url).toBe(url)
    })
    it('set node with url', () => {
      core.setNode(newURL)
      expect(core.node.url).toBe(newURL)
      expect(core.rpc.node.url).toBe(newURL)
    })
    it('set node with node object', () => {
      core.setNode({
        url,
      })
      expect(core.node.url).toBe(url)
      expect(core.node.url).toBe(url)
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
      const lockHash = core.generateLockHash(params.publicKeyHash, params.deps)
      expect(lockHash).toBe('0x0fec94c611533c9588c8ddfed557b9024f4431a65ace4b1e7106388ddd5dd87b')
    })

    it('lack fo deps should throw an error', () => {
      expect(() => core.generateLockHash(params.publicKeyHash)).toThrowError('deps is required')
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
        expect(core.rpc.computeScriptHash(script)).reject.toThrowError(exception)
      }
    })
  })

  describe('sign transaction', () => {
    const fixtureTable = Object.entries(fixtures.signTransaction).map(
      ([title, { privateKey, transaction, expected, exception }]) => [
        title,
        privateKey,
        transaction,
        expected,
        exception,
      ],
    )
    test.each(fixtureTable)('%s', (_title, privateKey, transaction, expected, exception) => {
      if (undefined !== expected) {
        const signedTransactionWithPrivateKey = core.signTransaction(privateKey)(transaction)
        expect(signedTransactionWithPrivateKey).toEqual(expected)
      }
      if (undefined !== exception) {
        expect(() => core.signTransaction(privateKey)(transaction)).toThrowError(exception)
      }
    })
  })

  describe('generate raw transactin', () => {
    const fixtureTable = Object.entries(fixtures.generateRawTransaction).map(
      ([title, { params, expected, exception }]) => [title, params, expected, exception],
    )

    test.each(fixtureTable)('%s', (_title, params, expected, exception) => {
      if (undefined === exception) {
        const rawTransaction = core.generateRawTransaction({
          ...params,
          capacity: BigInt(params.capacity),
          fee: BigInt(params.fee || 0),
        })
        expect(rawTransaction).toEqual(expected)
      } else {
        expect(() => core.generateRawTransaction(params)).toThrowError(exception)
      }
    })
  })

  describe('nervos dao', () => {
    it('generate deposit transaction', async () => {
      core.rpc = rpc
      const { params, expected } = fixtures.generateDaoDepositTransaction
      const p = {
        fromAddress: params.fromAddress,
        capacity: BigInt(params.capacity),
        fee: BigInt(params.fee),
        cells: params.cells,
      }
      expect(() => core.generateDaoDepositTransaction(p)).toThrowError('Secp256k1 dep is required')
      await core.loadSecp256k1Dep()
      expect(() => core.generateDaoDepositTransaction(p)).toThrowError('Dao dep is required')
      await core.loadDaoDep()
      const tx = await core.generateDaoDepositTransaction(p)
      expect(tx).toEqual(expected)
    })

    it.skip('generate start withdraw transaction', async () => {
      const { params, expected } = fixtures.generateDaoWithdrawStartTransaction
      const tx = await core.generateDaoWithdrawStartTransaction({
        outPoint: params.outPoint,
        fee: BigInt(params.fee),
        cells: params.cells,
      })
      expect(tx).toEqual(expected)
    })
  })
})
