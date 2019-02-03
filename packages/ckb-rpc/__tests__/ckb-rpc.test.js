const path = require('path')

const env = path.join(__dirname, '../.env')

const config = require('dotenv').config({
  path: env,
}).parsed

const CkbRpc = require('../lib').default

console.log(config)

const rpc = new CkbRpc(config.RPC_URL)

describe('ckb-rpc', () => {
  'use strict'

  // get_local_node_id
  it('local node id', async () => {
    const id = await rpc.localNodeId()
    expect(typeof id).toBe('string')
  })

  it('get tip block number', async () => {
    const tipBlockNumber = await rpc.getTipBlockNumber()
    expect(typeof tipBlockNumber).toBe('number')
  })

  // get_block_hash
  it('get block hash and get block of genesis block', async () => {
    const hash = await rpc.getBlockHash(0)
    expect(hash.length).toBe(66)
    const block = await rpc.getBlock(hash)
    expect(block.header.hash).toBe(hash)
  })

  // getTipBlockNumber
  it('get tip block number', async () => {
    const blockNumber = await rpc.getTipBlockNumber()
    expect(typeof blockNumber).toBe('number')
  })

  // get tip header
  it('get tip header', async () => {
    const header = await rpc.getTipHeader()
    expect(typeof header.hash).toBe('string')
  })

  // get transaction
  it('get transaction', async () => {
    const hash = await rpc.getBlockHash(0)
    const block = await rpc.getBlock(hash)
    const txs = block.commitTransactions
    if (txs.length) {
      const txHash = txs[0].hash
      const tx = await rpc.getTransaction(txHash)
      expect(tx.hash).toBe(txHash)
    } else {
      throw new Error('No transaction found')
    }
  })
  it('get live cell', async () => {
    const hash = await rpc.getBlockHash(0)
    const block = await rpc.getBlock(hash)
    const txs = block.commitTransactions
    if (txs.length) {
      const txHash = txs[0].hash
      const outPoint = {
        hash: txHash,
        index: 0,
      }
      const cellRes = await rpc.getLiveCell(outPoint)
      expect(cellRes.status).toBe('live')
    } else {
      throw new Error('No transaction found')
    }
  })

  it.skip('get cells by type hash', async () => {
    // TODO:
  })
})
