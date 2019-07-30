const path = require('path')

const env = path.join(__dirname, '../.env')
const config = require('dotenv').config({
  path: env,
}).parsed
const CKBRPC = require('../lib').default

const rpc = new CKBRPC(config.RPC_URL)

describe('ckb-rpc success', () => {
  it('get blockchain info', async () => {
    const info = await rpc.getBlockchainInfo()
    expect(info).not.toBe(undefined)
  })

  it('local node info', async () => {
    const info = await rpc.localNodeInfo()
    expect(typeof info.nodeId).toBe('string')
  })

  it('get peers', async () => {
    const nodes = await rpc.getPeers()
    expect(Array.isArray(nodes)).toBeTruthy()
  })

  it('get peers state', async () => {
    const state = await rpc.getPeersState()
    expect(state).not.toBe(undefined)
  })

  it('get tip block number', async () => {
    const tipBlockNumber = await rpc.getTipBlockNumber()
    expect(typeof tipBlockNumber).toBe('string')
  })

  it('get block hash and get block of genesis block', async () => {
    const hash = await rpc.getBlockHash('0')
    expect(hash.length).toBe(66)
    const block = await rpc.getBlock(hash)
    expect(block.header.hash).toBe(hash)
  })

  it('get tip block number', async () => {
    const blockNumber = await rpc.getTipBlockNumber()
    expect(typeof blockNumber).toBe('string')
  })

  it('get tip header', async () => {
    const header = await rpc.getTipHeader()
    expect(typeof header.hash).toBe('string')
  })

  it('get transaction', async () => {
    const hash = await rpc.getBlockHash('0')
    const block = await rpc.getBlock(hash)
    const { transactions } = block
    if (transactions.length) {
      const txHash = transactions[0].hash
      const { transaction, txStatus } = await rpc.getTransaction(txHash)
      expect(transaction.hash).toBe(txHash)
      expect(txStatus).toEqual({
        blockHash: hash,
        status: 'committed',
      })
    } else {
      throw new Error('No transaction found')
    }
  })

  it('get live cell', async () => {
    const outPoint = {
      blockHash: null,
      cell: {
        txHash: '0xff5a36107851d244e1543821f9f039c3d4eb69d9968750b0b0e82e78da86c987',
        index: '0',
      },
    }
    const cellRes = await rpc.getLiveCell(outPoint)
    expect(cellRes.status).toBe('unknown')
  })

  it('get cells by lock hash', async () => {
    const lockHash = '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674'
    const cells = await rpc.getCellsByLockHash(lockHash, '0', '100')
    expect(Array.isArray(cells)).toBeTruthy()
  })

  it('deindex lock hash', async () => {})

  it('get live cells by lock hash', async () => {})

  it('get lock hash index states', async () => {})

  it('get transactions by lock hash', async () => {})

  it('index lock hash', async () => {})

  it('get banned addresses', async () => {
    const addresses = await rpc.getBannedAddresses()
    expect(Array.isArray(addresses)).toBe(true)
  })

  it('set address to be banned', async () => {
    expect.assertions(1)
    await expect(rpc.setBan('192.168.0.2', 'insert', null)).resolves.toEqual(null)
  })

  it('get banned address', async () => {
    const addresses = await rpc.getBannedAddresses()
    expect(Array.isArray(addresses)).toBe(true)
  })

  it('get header', async () => {
    const zeroBlock = await rpc.getBlockByNumber('0')
    const zeroBlockHeader = zeroBlock.header
    const zeroBlockHash = zeroBlockHeader.hash
    const header = await rpc.getHeader(zeroBlockHash)
    expect(header).toEqual(zeroBlockHeader)
  })

  it('get header by number', async () => {
    const zeroBlock = await rpc.getBlockByNumber('0')
    const zeroBlockHeader = zeroBlock.header
    const header = await rpc.getHeaderByNumber('0')
    expect(header).toEqual(zeroBlockHeader)
  })
})

describe('send transaction', () => {
  it('send transaction', async () => {
    const blockHash = await rpc.getBlockHash('0')
    const block = await rpc.getBlock(blockHash)
    const txHash = block.transactions[0].hash
    const tx = {
      version: '0',
      deps: [],
      inputs: [
        {
          previousOutput: {
            cell: {
              txHash,
              index: '0',
            },
            blockHash,
          },
          args: [],
          since: '0',
        },
      ],
      outputs: [
        {
          lock: {
            args: [],
            codeHash: '0x0000000000000000000000000000000000000000000000000000000000000001',
            hashType: 'Data',
          },
          type: null,
          capacity: '1',
          data: '0x',
        },
      ],
      witnesses: [],
    }
    const hash = rpc.sendTransaction(tx)
    expect(hash).toBeTruthy()
  })
})

describe('ckb-rpc errors', () => {
  it('throw raw error', async () => {
    expect(() => rpc.getBlock(0)).toThrow()
  })
})
