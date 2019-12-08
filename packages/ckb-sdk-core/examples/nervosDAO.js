/* eslint-disable */
const CKB = require('../lib').default
const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url

const ckb = new CKB(nodeUrl)

const sk = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key
const pk = ckb.utils.privateKeyToPublicKey(sk)

const pkh = `0x${ckb.utils.blake160(pk, 'hex')}`
const addr = ckb.utils.privateKeyToAddress(sk)

const loadCells = async () => {
  await ckb.loadSecp256k1Dep()
  const lockHash = ckb.generateLockHash(
    pkh
  )
  await ckb.loadCells({
    lockHash,
    start: BigInt(0),
    end: BigInt(1000),
    save: true
  })
}

const deposit = async () => {
  await loadCells()
  const depositTx = await ckb.generateDaoDepositTransaction({
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
  "txHash": "0x052788721f8b2b74490b27e597dea5388f8fd344aa1dfe80a457634cc1335531",
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
  "length": "0x64",
  "index": "0x29",
  "number": "0xf2"
}

const starWithdrawing = async () => {
  await loadCells()
  const tx = await ckb.generateDaoWithdrawStartTransaction({
    outPoint: depositOutPoint,
    fee: 10000
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
  "txHash": "0x84615264f586b21f4a7f29501ff3d8d52674e344960a1d790720fdc87c92570d",
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
  "length": "0x64",
  "index": "0x2a",
  "number": "0xf9"
}

const logCurrentEpoch = async () => {
  ckb.rpc.getTipHeader().then(h => console.log(ckb.utils.parseEpoch(h.epoch)))
}

const withdraw = async () => {
  await ckb.loadDaoDep()
  await ckb.loadSecp256k1Dep()
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
  console.log(`const withdraw = ${JSON.stringify(outPoint, null, 2)}`)
}

const withDrawOutPoint = {
  "txHash": "0x0cdb8b50d269ad0e82c8b1f2c075ddfb3d3655b6babc6958619bddc09bb4df18",
  "index": "0x0"
}


// deposit()
// logDepositEpoch()
// starWithdrawing()
// logStartWithdrawingEpoch()
// logCurrentEpoch()
// withdraw()

// setInterval(logCurrentEpoch, 1000)
