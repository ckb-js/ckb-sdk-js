/* eslint-disable */
const Core = require('../lib').default
const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url

const core = new Core(nodeUrl)

const privateKey = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key

const address = core.utils.privateKeyToAddress(privateKey, {
  prefix: 'ckb'
})

const depositTxHash = ''
const startWithdrawTxHash = ''

/**
 * @description deposit a cell to Nervos DAO
 */
const deposit = async () => {
  const currentEpoch = await core.rpc.getCurrentEpoch()
  console.log(`current epoch: ${JSON.stringify(currentEpoch, null, 2)}`)

  const rawDepositTx = await core.generateDaoDepositTransaction({
    fromAddress: address,
    capacity: 600000000000n,
    fee: 10000000n,
    cells: []
  })

  const signedDepositTx = core.signTransaction(privateKey)(rawDepositTx)

  const txHash = await core.rpc.sendTransaction(signedDepositTx)
  console.log(`deposit tx hash: ${txHash}`)
  return txHash
}

/**
 * @description inspect the deposit transaction
 */
const inspectDepositTx = async () => {
  const tx = await core.rpc.getTransaction(depositTxHash)
  console.log(JSON.stringify(tx, null, 2))
}

/**
 * @description start to withdraw a Nervos DAO cell
 */
const startWithdraw = async () => {
  const outPoint = {
    txHash: depositTxHash,
    index: '0x0'
  }
  const currentBlockNumber = await core.rpc.getTipBlockNumber()
  const liveCell = await core.rpc.getLiveCell(outPoint, false)
  const lockScript = liveCell.cell.output.lock
  const lockHash = core.utils.scriptToHash(lockScript)
  await core.loadCells({
    lockHash,
    start: BigInt(+currentBlockNumber - 50),
    end: currentBlockNumber,
    save: true
  })

  const rawStartWithdrawTx = await core.generateDaoWithdrawStartTransaction({
    outPoint,
    fee: BigInt(100000)
  })
  const signedStartWithdrawTx = core.signTransaction(privateKey)(rawStartWithdrawTx)
  const txHash = await core.rpc.sendTransaction(signedStartWithdrawTx)
  console.log(`start withdraw tx hash: ${txHash}`)
  return txHash
}

/**
 * @description withdraw a Nervos DAO cell
 */
const withdraw = async () => {
  const depositOutPoint = {
    txHash: depositTxHash,
    index: '0x0'
  }
  const withdrawOutPoint = {
    txHash: startWithdrawTxHash,
    index: '0x0'
  }
  const rawWithdrawTx = await core.generateDaoWithdrawTransaction({
    depositOutPoint,
    withdrawOutPoint,
    fee: 1000,
  })

  const signedWithdrawTx = core.signTransaction(privateKey)(rawWithdrawTx)
  const txHash = await core.rpc.sendTransaction(signedWithdrawTx)
  console.log(`withdraw tx hash: ${txHash}`)
  return txHash
}


// deposit()
// inspectDepositTx()
// startWithdraw()
// withdraw()
