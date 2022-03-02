const fixtures = require('./fixtures.json')
const rpc = require('../__mocks__/rpc')
const CellCollector = require('../__mocks__/CellCollector')

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
    describe('load deps', () => {
      it('should throw an error when genesis block is not loaded', () => {
        expect.assertions(1)
        ckb.rpc = {
          getBlockByNumber: jest.fn().mockResolvedValue(undefined),
        }
        return expect(ckb.loadDeps()).rejects.toEqual(new Error('Fail to load the genesis block'))
      })

      it('should return deps when genesis block is loaded', async () => {
        expect.assertions(3)
        ckb.rpc = rpc
        const expected = fixtures.loadDeps
        expect(ckb.config.secp256k1Dep).toBeUndefined()
        const deps = await ckb.loadDeps()
        expect(deps).toEqual(expected)
        expect(ckb.config).toEqual(expected)
      })
    })

    it('load cells', async () => {
      const indexer = jest.fn()
      const lock = {
        codeHash: '0x1892ea40d82b53c678ff88312450bbb17e164d7a3e0a90941aa58839f56f8df2',
        hashType: 'type',
        args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
      }
      const actual = await ckb.loadCells({ indexer, CellCollector, lock })
      expect(actual).toHaveLength(10)
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

  describe('generate raw transaction', () => {
    const fixtureTable = Object.entries(
      fixtures.generateRawTransaction,
    ).map(([title, { params, expected, exception }]) => [title, params, expected, exception])

    test.each(fixtureTable)('%s', (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        let fmtParams = params
        if ('fromAddress' in params) {
          fmtParams = { ...params, capacity: BigInt(params.capacity), fee: BigInt(params.fee || 0) }
        } else {
          fmtParams = {
            ...params,
            receivePairs: params.receivePairs.map(pair => ({ ...pair, capacity: BigInt(pair.capacity) })),
            cells: new Map(params.cells),
            fee: BigInt(params.fee || 0),
          }
        }
        const rawTransaction = ckb.generateRawTransaction(fmtParams)
        expect(rawTransaction).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

  describe('nervos dao', () => {
    describe('deposit', () => {
      const { params, expected } = fixtures.generateDaoDepositTransaction
      const p = {
        fromAddress: params.fromAddress,
        capacity: BigInt(params.capacity),
        fee: BigInt(params.fee),
        cells: params.cells,
      }

      beforeEach(() => {
        ckb.rpc = rpc
        return ckb.loadDeps()
      })

      it('should throw an error when secp256k1 dep is not loaded', () => {
        ckb.config = {}
        expect(() => ckb.generateDaoDepositTransaction(p)).toThrowError('Secp256k1 dep is required')
      })

      it('should throw an error when dao dep is not loaded', async () => {
        ckb.config.daoDep = null
        expect(() => ckb.generateDaoDepositTransaction(p)).toThrowError('Dao dep is required')
      })

      it('generate deposit transaction', async () => {
        const tx = await ckb.generateDaoDepositTransaction(p)
        expect(tx).toEqual(expected)
      })
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

  describe('calculate dao maximum withdraw', () => {
    it('normal withdraw hash', async () => {
      ckb.rpc = {
        getTransaction: jest.fn().mockResolvedValueOnce({
          txStatus: { status: 'committed' },
          transaction: {
            outputs: [
              {
                "capacity":"0xe8d4a51000",
                "lock":{
                    "args":"0xf601cac75568afec3b9c9af1e1ff730062007685",
                    "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType":"type"
                },
                "type":{
                    "args":"0x",
                    "codeHash":"0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType":"type"
                }
              }
            ],
            outputsData: ["0x0000000000000000","0x"]
          }
        }),
        getHeader: jest.fn()
          .mockResolvedValueOnce({ dao: '0x1aaf2ca6847c223c3ef9e8c069c9250020212a6311e2d30200609349396eb407' })
          .mockResolvedValueOnce({ dao: '0x9bafffa73e432e3c94c6f9db34cb25009f9e4efe4b5fd60200ea63c6d4ffb407' })
      }
      const res = await ckb.calculateDaoMaximumWithdraw({ tx: '', index: '0x0' }, '')
      expect(res).toBe('0xe8df95141e')
      ckb.rpc = rpc
    })
    it('another normal withdraw hash', async () => {
      ckb.rpc = {
        getTransaction: jest.fn().mockResolvedValueOnce({
            "transaction":{
                "outputs":[
                    {
                        "capacity":"0x6fc23ac00",
                        "lock":{
                            "args":"0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6aa10000001000000030000000990000009cdfb2824302e0cd0ee1fb4ac9849c8c2348ab84f2e7d2c6e12e8b6f5f5f378d69000000100000003000000031000000deec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b2201340000004cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a153ab336340f7985b8b9e412b7968fedabd69a9cb0040000000000c0",
                            "codeHash":"0x5a2506bb68d81a11dcadad4cb7eae62a17c43c619fe47ac8037bc8ce2dd90360",
                            "hashType":"type"
                        },
                        "type":null
                    },
                    {
                        "capacity":"0x83e607de09",
                        "lock":{
                            "args":"0x2718f00d61e6fb37eed98cfdf6b30bde38cad8f6",
                            "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hashType":"type"
                        },
                        "type":null
                    }
                ],
                "outputsData":[
                    "0x",
                    "0x"
                ],
            },
            "txStatus":{
                "blockHash":"0x8c14f374c5934613dbb0f9cbebb0edaabe259291a08e2dd3afbb291b1b8be359",
                "reason":null,
                "status":"committed"
            }
        }),
        getHeader: jest.fn()
          .mockResolvedValueOnce({ dao: '0x7e9a4d29f532433cb8dbe56b64ce2500b4c9c67a3fccda020098a1f224a4b707' })
          .mockResolvedValueOnce({ dao: '0xd87090655733433c2395d67a64ce2500d73e963e54ccda0200f244c504a4b707' })
      }
      const res = await ckb.calculateDaoMaximumWithdraw({index: '0x0', txHash: '0xabd4f1b9e914cd859cb7ecf4f57009ef7cd2d84a799ed61acff904bdf5fea91a'}, '0x04914c83fa9ea4126279ebe2d2cdff74235f63227821882e4e16f6a908f43691')
      expect(res).toBe('0x6fc23ac9b')
      ckb.rpc = rpc
    })
    it('normal withdraw outputpoint', async () => {
      ckb.rpc = {
        getTransaction: jest.fn().mockResolvedValue({
            "transaction":{
                "outputs":[
                    {
                        "capacity":"0x6fc23ac00",
                        "lock":{
                            "args":"0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6aa10000001000000030000000990000009cdfb2824302e0cd0ee1fb4ac9849c8c2348ab84f2e7d2c6e12e8b6f5f5f378d69000000100000003000000031000000deec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b2201340000004cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a153ab336340f7985b8b9e412b7968fedabd69a9cb0040000000000c0",
                            "codeHash":"0x5a2506bb68d81a11dcadad4cb7eae62a17c43c619fe47ac8037bc8ce2dd90360",
                            "hashType":"type"
                        },
                        "type":null
                    },
                    {
                        "capacity":"0x83e607de09",
                        "lock":{
                            "args":"0x2718f00d61e6fb37eed98cfdf6b30bde38cad8f6",
                            "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hashType":"type"
                        },
                        "type":null
                    }
                ],
                "outputsData":[
                    "0x",
                    "0x"
                ],
            },
            "txStatus":{
                "blockHash":"0x8c14f374c5934613dbb0f9cbebb0edaabe259291a08e2dd3afbb291b1b8be359",
                "reason":null,
                "status":"committed"
            }
        }),
        getHeader: jest.fn()
          .mockResolvedValueOnce({ dao: '0x7e9a4d29f532433cb8dbe56b64ce2500b4c9c67a3fccda020098a1f224a4b707' })
          .mockResolvedValueOnce({ dao: '0xd87090655733433c2395d67a64ce2500d73e963e54ccda0200f244c504a4b707' })
      }
      const res = await ckb.calculateDaoMaximumWithdraw({index: '0x0', txHash: '0xabd4f1b9e914cd859cb7ecf4f57009ef7cd2d84a799ed61acff904bdf5fea91a'}, '0x04914c83fa9ea4126279ebe2d2cdff74235f63227821882e4e16f6a908f43691')
      expect(res).toBe('0x6fc23ac9b')
      ckb.rpc = rpc
    })
    it('exception', async () => {
      ckb.rpc = {
        getTransaction: jest.fn().mockResolvedValueOnce({ txStatus: {}})
      }
      await expect(ckb.calculateDaoMaximumWithdraw({ tx: '', index: '0x0' }, '')).rejects.toThrow('Transaction is not committed yet')
      ckb.rpc = rpc
    })
  })
})
