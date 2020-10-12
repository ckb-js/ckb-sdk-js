/* eslint-disable */
const CKB = require('../lib').default

const bootstrap = async () => {
  const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url
  const privateKey = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key
  const blockAssemblerCodeHash = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8' // transcribe the block_assembler.code_hash in the ckb.toml from the ckb project

  const ckb = new CKB(nodeUrl) // instantiate the JS SDK with provided node url

  await ckb.loadDeps() // load the dependencies of secp256k1 algorithm which is used to verify the signature in transaction's witnesses.

  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey)
  /**
   * to see the public key
   */
  // console.log(`Public key: ${publicKey}`)

  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`
  /**
   * to see the public key hash
   */
  // console.log(`Public key hash: ${publicKeyHash}`)

  const addresses = {
    mainnetAddress: ckb.utils.pubkeyToAddress(publicKey, {
      prefix: 'ckb'
    }),
    testnetAddress: ckb.utils.pubkeyToAddress(publicKey, {
      prefix: 'ckt'
    })
  }

  /**
   * to see the addresses
   */
  // console.log(JSON.stringify(addresses, null, 2))

  /**
   * calculate the lockHash by the address publicKeyHash
   * 1. the publicKeyHash of the address is required in the args field of lock script
   * 2. compose the lock script with the code hash(as a miner, we use blockAssemblerCodeHash here), and args
   * 3. calculate the hash of lock script via ckb.utils.scriptToHash method
   */

  const lockScript = {
    hashType: "type",
    codeHash: blockAssemblerCodeHash,
    args: publicKeyHash,
  }
  /**
   * to see the lock script
   */
  // console.log(JSON.stringify(lockScript, null, 2))

  const lockHash = ckb.utils.scriptToHash(lockScript)
  /**
   * to see the lock hash
   */
  // console.log(lockHash)

  // method to fetch all unspent cells by lock hash
  const unspentCells = await ckb.loadCells({
    lockHash
  })

  /**
   * to see the unspent cells
   */
  // console.log(unspentCells)

  /**
   * send transaction
   */
  const toAddress = ckb.utils.privateKeyToAddress("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", {
    prefix: 'ckt'
  })

  /**
   * @param fee - transaction fee, can be set in number directly, or use an reconciler to set by SDK
   *                               say, fee: BigInt(100000) means transaction fee is 100000 shannons
   *                                or, fee: { feeRate: '0x7d0', reconciler: ckb.utils.reconcilers.extraInputs } to set transaction fee by reconcilers.extraInputs with feeRate = 2000 shannons/Byte
   *
   * @external https://docs.nervos.org/docs/essays/faq#how-do-you-calculate-transaction-fee
   */
  const rawTransaction = ckb.generateRawTransaction({
    fromAddress: addresses.testnetAddress,
    toAddress,
    capacity: BigInt(600000000000),
    fee: BigInt(100000),
    safeMode: true,
    cells: unspentCells,
    deps: ckb.config.secp256k1Dep,
  })


  const signedTx = ckb.signTransaction(privateKey)(rawTransaction)
  /**
   * to see the signed transaction
   */
  // console.log(JSON.stringify(signedTx, null, 2))

  const realTxHash = await ckb.rpc.sendTransaction(signedTx)
  /**
   * to see the real transaction hash
   */
  console.log(`The real transaction hash is: ${realTxHash}`)
}

bootstrap()
