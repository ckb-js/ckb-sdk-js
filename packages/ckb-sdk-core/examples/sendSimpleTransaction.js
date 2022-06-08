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

const bootstrap = async () => {
  const privateKey = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key

  const ckb = new CKB(CKB_URL) // instantiate the JS SDK with provided node url

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

  const lock = {
    codeHash: ckb.config.secp256k1Dep.codeHash,
    hashType: ckb.config.secp256k1Dep.hashType,
    args: publicKeyHash
  }
  /**
   * load cells from lumos as `examples/sendTransactionWithLumosCollector.js` shows
   */
  const unspentCells = await ckb.loadCells({ indexer, CellCollector, lock })

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
