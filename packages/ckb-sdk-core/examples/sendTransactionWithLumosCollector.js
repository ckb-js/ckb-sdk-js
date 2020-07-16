const path = require('path')
const os = require('os')

/* eslint-disable import/no-extraneous-dependencies */
const { Indexer, CellCollector } = require('@ckb-lumos/indexer')
const CKB = require('../lib').default

const LUMOS_DB = path.join(os.tmpdir(), 'lumos_db')
const CKB_URL = process.env.CKB_URL || 'http://127.0.0.1:8114'

const ckb = new CKB(CKB_URL)
const indexer = new Indexer(CKB_URL, LUMOS_DB)

// private key for demo, don't expose it in production
const PRI_KEY = process.env.PRI_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const PUB_KEY = ckb.utils.privateKeyToPublicKey(PRI_KEY)
const ARGS = `0x${ckb.utils.blake160(PUB_KEY, 'hex')}`
const ADDRESS = ckb.utils.pubkeyToAddress(PUB_KEY)

/**
 * start the lumos to sync cells
 */
const startSync = () => {
  indexer.startForever()
}

/**
 * stop the lumos sync
 */
const stopSync = () => {
  indexer.stop()
}

/**
 * generate and send a transaction
 */
const bootstrap = async () => {
  startSync()
  const { secp256k1Dep } = await ckb.loadDeps()
  const lock = { ...secp256k1Dep, args: ARGS }
  const cells = await ckb.loadCells({ indexer, CellCollector, lock })
  stopSync()

  const rawTx = ckb.generateRawTransaction({
    fromAddress: ADDRESS,
    toAddress: ADDRESS,
    capacity: 10000000000000n,
    fee: 100000n,
    safeMode: true,
    cells,
    deps: secp256k1Dep,
  })

  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
  const txHash = await ckb.rpc.sendTransaction(signedTx)
  console.info(`Transaction has been sent with tx hash ${txHash}`)
  return txHash
}

bootstrap()
