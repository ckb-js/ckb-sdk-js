/* eslint-disable */
const Core = require('../lib').default

const bootstrap = async () => {
  const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url
  const privateKey = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key
  const blockAssemblerCodeHash = '0x1892ea40d82b53c678ff88312450bbb17e164d7a3e0a90941aa58839f56f8df2' // transcribe the block_assembler.code_hash in the ckb.toml from the ckb project

  const core = new Core(nodeUrl) // instantiate the JS SDK with provided node url

  const secp256k1Dep = await core.loadSecp256k1Dep() // load the dependencies of secp256k1 algorithm which is used to verify the signature in transaction's witnesses.

  /**
   * genereat address object, who has peroperties like private key, public key, sign method and verify mehtod
   * - value, the address string
   * - privateKey, the private key in hex string format
   * - publicKey, the public key in hex string format
   * - publicKeyHash, the publicKeyHash of the public key, a blake160-ed public key is use here
   * - sign(msg): signature string
   * - verify(msg, signature): boolean
   */
  const myAddressObj = core.generateAddress(privateKey)
  /**
   * to see the address
   */
  console.log(myAddressObj.value)

  /**
   * calculate the lockHash by the address publicKeyHash
   * 1. the publicKeyHash of the address is required in the args field of lock script
   * 2. compose the lock script with the code hash(as a miner, we use blockAssemblerCodeHash here), and args
   * 3. calculate the hash of lock script via core.utils.scriptToHash method
   */

  const lockScript = {
    hashType: "type",
    codeHash: blockAssemblerCodeHash,
    args: [myAddressObj.publicKeyHash],
  }
  /**
   * to see the lock script
   */
  // console.log(JSON.stringify(lockScript, null, 2))

  const lockHash = core.utils.scriptToHash(lockScript)
  /**
   * to see the lock hash
   */
  // console.log(lockHash)

  // method to fetch all unspent cells by lock hash
  const unspentCells = await core.loadCells({
    lockHash
  })

  /**
   * to see the unspent cells
   */
  // console.log(unspentCells)

  /**
   * send transaction
   */
  const toAddress = core.generateAddress("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").value
  const rawTransaction = await core.generateRawTransaction({
    fromAddress: myAddressObj.value,
    toAddress,
    capacity: 60000000000,
    safeMode: true,
    cells: unspentCells,
    deps: core.config.secp256k1Dep,
  })

  const signedTx = core.signTransaction(myAddressObj)(rawTransaction)
  /**
   * to see the signed transaction
   */
  // console.log(JSON.stringify(signedTx, null, 2))

  const realTxHash = await core.rpc.sendTransaction(signedTx)
  /**
   * to see the real transaction hash
   */
  console.log(`The real transaction hash is: ${realTxHash}`)
}

bootstrap()
