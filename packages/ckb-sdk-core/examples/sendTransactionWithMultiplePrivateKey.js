/* eslint-disable */
const path = require('path')
const os = require('os')
const { Indexer, CellCollector } = require('@ckb-lumos/indexer')
const CKB = require('../lib').default

const CKB_URL = process.env.CKB_URL || 'http://localhost:8114'
const LUMOS_DB = path.join(os.tmpdir(), 'lumos_db')
/**
 * lumos indexer
 */
const indexer = new Indexer(CKB_URL, LUMOS_DB)
indexer.startForever()

/**
 * sdk
 */
const ckb = new CKB(CKB_URL)

const sk1 = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // exmaple private key
const sk2 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' // example private key

const loadCells = async () => {
  await ckb.loadDeps()
  const lockScript1 = {
    codeHash: ckb.config.secp256k1Dep.codeHash,
    hashType: ckb.config.secp256k1Dep.hashType,
    args: `0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk1), 'hex')}`
  }

  const lockScript2 = {
    codeHash: ckb.config.secp256k1Dep.codeHash,
    hashType: ckb.config.secp256k1Dep.hashType,
    args: `0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk2), 'hex')}`
  }

  const lockHash1 = ckb.utils.scriptToHash(lockScript1)
  const lockHash2 = ckb.utils.scriptToHash(lockScript2)

  /**
   * load cells from lumos as `examples/sendTransactionWithLumosCollector.js` shows
   */
  await ckb.loadCells({ indexer, CellCollector, lock: lockScript1, save: true })
  await ckb.loadCells({ indexer, CellCollector, lock: lockScript2, save: true })

  const cell1 = ckb.cells.get(lockHash1)
  const cell2 = ckb.cells.get(lockHash2)
}

const generateTransaction = async () => {
  await loadCells()

  const addr1 = ckb.utils.privateKeyToAddress(sk1)
  const addr2 = ckb.utils.privateKeyToAddress(sk2)

  await ckb.loadDeps()

  const rawTransaction = ckb.generateRawTransaction({
    fromAddresses: [addr1, addr2],
    receivePairs: [{
      address: addr2,
      capacity: BigInt(30621362931463)
    }],
    fee: BigInt(10000),
    deps: ckb.config.secp256k1Dep,
  })

  const keys = new Map([sk1, sk2].map(sk => ([
    ckb.generateLockHash(`0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk), 'hex')}`), sk
  ])))
  const cells = [...ckb.cells.values()].flat()
  const signedTransaction = await ckb.signTransaction(keys)(rawTransaction, cells)
  return signedTransaction
}

const sendTransaction = async () => {
  const signedTx = await generateTransaction()
  const txHash = await ckb.rpc.sendTransaction(signedTx)
  console.log(`tx hash: ${txHash}`)
}

// loadCells()
// generateTransaction()
sendTransaction()
