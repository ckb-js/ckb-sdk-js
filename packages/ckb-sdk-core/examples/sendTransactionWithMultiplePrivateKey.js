/* eslint-disable */
const CKB = require('../lib').default
const ckb = new CKB('http://localhost:8114')

const sk1 = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // exmaple private key
const sk2 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' // example private key

const loadCells = async () => {
  await ckb.loadSecp256k1Dep()
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

  await ckb.loadCells({
    lockHash: lockHash1,
    start: BigInt(16),
    end: BigInt(16),
    save: true
  })

  await ckb.loadCells({
    lockHash: lockHash2,
    start: BigInt(17),
    end: BigInt(17),
    save: true
  })

  const cell1 = ckb.cells.get(lockHash1)
  const cell2 = ckb.cells.get(lockHash2)
}

const generateTransaction = async () => {
  await loadCells()

  const addr1 = ckb.utils.privateKeyToAddress(sk1)
  const addr2 = ckb.utils.privateKeyToAddress(sk2)

  await ckb.loadSecp256k1Dep()

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
  rawTransaction.witnesses = rawTransaction.inputs.map(() => ({
    lock: '',
    inputType: '',
    outputType: ''
  }))
  const cells = [...ckb.cells.values()].flat()
  const signedTransaction = ckb.signTransaction(keys)(rawTransaction, cells)
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
