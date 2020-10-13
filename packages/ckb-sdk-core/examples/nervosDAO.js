/* eslint-disable */
const path = require('path')
const os = require('os')
const { Indexer, CellCollector } = require('@ckb-lumos/indexer')
const CKB = require('../lib').default

const CKB_URL = process.env.CKB_URL || 'http://localhost:8114' // example node url
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

const sk = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key
const pk = ckb.utils.privateKeyToPublicKey(sk)

const pkh = `0x${ckb.utils.blake160(pk, 'hex')}`
const addr = ckb.utils.privateKeyToAddress(sk)

const loadCells = async () => {
  await ckb.loadDeps()
  const lock = {
    codeHash: ckb.config.secp256k1Dep.codeHash,
    hashType: ckb.config.secp256k1Dep.hashType,
    args: pkh
  }
  /**
   * load cells from lumos as `examples/sendTransactionWithLumosCollector.js` shows
   */
  await ckb.loadCells({ indexer, CellCollector, lock, save: true })
}

const deposit = async () => {
  await loadCells()
  await ckb.loadDeps()
  const depositTx = ckb.generateDaoDepositTransaction({
    fromAddress: addr,
    capacity: BigInt(10200000000),
    fee: BigInt(100000)
  })
  const signed = ckb.signTransaction(sk)(depositTx)

  const txHash = await ckb.rpc.sendTransaction(signed)
  const depositOutPoint = {
    txHash,
    index: '0x0'
  }
  console.log(`const depositOutPoint = ${JSON.stringify(depositOutPoint)}`)
}

const depositOutPoint = {
  "txHash": "0x40e1d58cf8576d5206d55d242284a28f64cb114d0b9a8292582e7596082e5bda",
  "index": "0x0"
}

const logDepositEpoch = async () => {
  const tx = await ckb.rpc.getTransaction(depositOutPoint.txHash)
  if (tx.txStatus.blockHash) {
    const b = await ckb.rpc.getBlock(tx.txStatus.blockHash)
    const epoch = b.header.epoch
    console.log(`const depositEpoch = ${JSON.stringify(ckb.utils.parseEpoch(epoch), null, 2)}`)
  } else {
    console.log('not committed')
  }
}

const depositEpoch = {
  "length": "0xa",
  "index": "0x0",
  "number": "0x69"
}

const starWithdrawing = async () => {
  await loadCells()
  await ckb.loadDeps()
  const tx = await ckb.generateDaoWithdrawStartTransaction({
    outPoint: depositOutPoint,
    fee: 10000n
  })
  const signed = ckb.signTransaction(sk)(tx)
  const txHash = await ckb.rpc.sendTransaction(signed)
  const outPoint = {
    txHash,
    index: '0x0'
  }
  console.log(`const startWithDrawOutPoint = ${JSON.stringify(outPoint, null, 2)}`)
}

const startWithDrawOutPoint = {
  "txHash": "0xc8ad01deb8b25c56169992598398ad7d539314ada90c84bff12fa7fc69095076",
  "index": "0x0"
}

const logStartWithdrawingEpoch = async () => {
  const tx = await ckb.rpc.getTransaction(startWithDrawOutPoint.txHash)
  if (tx.txStatus.blockHash) {
    const b = await ckb.rpc.getBlock(tx.txStatus.blockHash)
    const epoch = b.header.epoch
    console.log(`const startWithdrawingEpoch = ${JSON.stringify(ckb.utils.parseEpoch(epoch), null, 2)}`)
  } else {
    console.log('not committed')
  }
}

const startWithdrawingEpoch = {
  "length": "0xa",
  "index": "0x0",
  "number": "0xbe"
}

const logCurrentEpoch = async () => {
  ckb.rpc.getTipHeader().then(h => console.log(ckb.utils.parseEpoch(h.epoch)))
}

const withdraw = async () => {
  await ckb.loadDeps()
  await loadCells()
  const tx = await ckb.generateDaoWithdrawTransaction({
    depositOutPoint,
    withdrawOutPoint: startWithDrawOutPoint,
    fee: BigInt(100000)
  })
  const signed = ckb.signTransaction(sk)(tx)
  const txHash = await ckb.rpc.sendTransaction(signed)
  const outPoint = {
    txHash,
    index: '0x0'
  }
  console.log(`const withdrawOutPoint = ${JSON.stringify(outPoint, null, 2)}`)
}

const withDrawOutPoint = {
  "txHash": "0xb1ee185a4e811247b1705a52df487c3ce839bfa2f72e4c7a74b6fc6b0ea4cfa7",
  "index": "0x0"
}


// deposit()
// logDepositEpoch()
// starWithdrawing()
// logStartWithdrawingEpoch()
// logCurrentEpoch()
// withdraw()

// setInterval(logCurrentEpoch, 1000)
