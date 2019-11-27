/* eslint-disable */
const Core = require('../lib').default
const core = new Core('http://localhost:8114')

const sk1 = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // exmaple private key
const sk2 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' // example private key

const loadCells = async () => {
  await core.loadSecp256k1Dep()
  const lockScript1 = {
    codeHash: core.config.secp256k1Dep.codeHash,
    hashType: core.config.secp256k1Dep.hashType,
    args: `0x${core.utils.blake160(core.utils.privateKeyToPublicKey(sk1), 'hex')}`
  }

  const lockScript2 = {
    codeHash: core.config.secp256k1Dep.codeHash,
    hashType: core.config.secp256k1Dep.hashType,
    args: `0x${core.utils.blake160(core.utils.privateKeyToPublicKey(sk2), 'hex')}`
  }

  const lockHash1 = core.utils.scriptToHash(lockScript1)
  const lockHash2 = core.utils.scriptToHash(lockScript2)

  await core.loadCells({
    lockHash: lockHash1,
    start: BigInt(16),
    end: BigInt(16),
    save: true
  })

  await core.loadCells({
    lockHash: lockHash2,
    start: BigInt(17),
    end: BigInt(17),
    save: true
  })

  const cell1 = core.cells.get(lockHash1)
  const cell2 = core.cells.get(lockHash2)
}

const generateTransaction = async () => {
  await loadCells()

  const addr1 = core.utils.privateKeyToAddress(sk1)
  const addr2 = core.utils.privateKeyToAddress(sk2)

  await core.loadSecp256k1Dep()

  const rawTransaction = core.generateRawTransaction({
    fromAddresses: [addr1, addr2],
    receivePairs: [{
      address: addr2,
      capacity: BigInt(30621362931463)
    }],
    fee: BigInt(10000),
    deps: core.config.secp256k1Dep,
  })

  const keys = new Map([sk1, sk2].map(sk => ([
    core.generateLockHash(`0x${core.utils.blake160(core.utils.privateKeyToPublicKey(sk), 'hex')}`), sk
  ])))
  rawTransaction.witnesses = rawTransaction.inputs.map(() => ({
    lock: '',
    inputType: '',
    outputType: ''
  }))
  const cells = [...core.cells.values()].flat()
  const signedTransaction = core.signTransaction(keys)(rawTransaction, cells)
  return signedTransaction
}

const sendTransaction = async () => {
  const signedTx = await generateTransaction()
  const txHash = await core.rpc.sendTransaction(signedTx)
  console.log(`tx hash: ${txHash}`)
}

// loadCells()
// generateTransaction()
sendTransaction()
