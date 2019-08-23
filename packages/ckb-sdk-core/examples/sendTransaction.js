/* eslint-disable */
const Core = require('../lib').default

const bootstrap = async () => {
  const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url
  const privateKey = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key

  const core = new Core(nodeUrl) // instantiate the JS SDK with provided node url

  const secp256k1Dep = await core.loadSecp256k1Dep() // load the dep group and code hash of secp256k1 algorithm which is used to verify the signature in transaction's witnesses.

  /**
   * genereat address object, who has peroperties like private key, public key, sign method and verify mehtod
   * - value, the address string
   * - privateKey, the private key in hex string format
   * - publicKey, the public key in hex string format
   * - identifier, the identifier of the public key, a blake160-ed public key is use here
   * - sign(msg): signature string
   * - verify(msg, signature): boolean
   */
  const myAddressObj = core.generateAddress(privateKey)
  /**
   * to see the address
   */
  // console.log(myAddressObj.value)

  /**
   * calculate the lockhash by the address identifier
   * 1. the identifier of the address is required in the args field of lock script
   * 2. compose the lock script with secp256k1Dep.codeHash, and args
   * 3. calculate the hash of lock script via core.rpc.computeScriptHash method
   */

  const script = {
    type: 'Data',
    codeHash: `0x${secp256k1Dep.codeHash}`,
    args: [`0x${myAddressObj.identifier}`],
  }
  /**
   * to see the lock script
   */
  // console.log(JSON.stringify(script, null, 2))

  const lockHash = await core.rpc.computeScriptHash(script)
  /**
   * to see the lock hash
   */
  // console.log(lockHash)

  // method to fetch all unspent cells by lock hash
  const STEP = 100
  const cellsGroup = []
  const getUnspentCells = (_lockHash, from, to, cb) =>
    new Promise((resolve, reject) => {
      if (from + STEP < to) {
        return core.rpc
          .getCellsByLockHash(_lockHash, from, from + STEP)
          .then(cells => {
            if (cells.length) {
              console.log(`Fetched from ${from} to ${from + STEP} with ${cells.length} cells`)
            }
            cellsGroup.push(cells)
            return getUnspentCells(_lockHash, from + STEP, to, cb)
          })
          .catch(reject)
      }
      return core.rpc
        .getCellsByLockHash(_lockHash, from, to)
        .then(cells => {
          if (cells.length) {
            console.log(`Fetched from ${from} to ${to} with ${cells.length} cells`)
          }
          cellsGroup.push(cells)
          resolve(cellsGroup)
        })
        .catch(reject)
    })
    .then(group => group.flat())
    .then(cells => {
      /**
       * too see the cells
       */
      // console.log(cells)
      if (cb) cb(cells)
    })

  // load the unspent cells in Promise method, just an optimiztion of code.
  const loadCells = () =>
    new Promise((resolve, reject) => {
      core.rpc
        .getTipBlockNumber()
        .then(tipNumber =>
          getUnspentCells(lockHash, 0, tipNumber, resolve)
        )
        .catch(reject)
    })

  /**
   * to see the unspent cells
   */
  // core.rpc
  //   .getTipBlockNumber()
  //   .then(tipNumber => loadCells(lockHash, 0, tipNumber))
  //   .then(console.log)

  /**
   * @notice fill the blaked160ed public key as the identifier of the target address in the output's args,
   *         which is used to specify the next owner of the output, namely the fresh cell.
   * @notice use bigint or big number to handle the capacity for safety
   */
  const generateTransaction = async (targetIdentifier, capacity) => {
    const targetCapacity = BigInt(capacity)

    /**
     * the new cell for next owner
     */
    const targetOutput = {
      capacity: targetCapacity,
      lock: {
        codeHash: secp256k1Dep.codeHash,
        args: [targetIdentifier],
      },
    }

    /**
     * the new cell as a change
     */
    const changeOutput = {
      capacity: 0n,
      lock: {
        codeHash: secp256k1Dep.codeHash,
        args: [`0x${myAddressObj.identifier}`],
      },
    }

    const unspentCells = await loadCells()
    const inputs = []
    let inputCapacity = 0n
    /**
     * pick inputs
     */
    for (let i = 0; i < unspentCells.length; i++) {
      const unspentCell = unspentCells[i]
      inputs.push({
        previousOutput: unspentCell.outPoint,
        since: '0',
        args: [],
      })
      inputCapacity += BigInt(unspentCells[i].capacity)
      if (inputCapacity >= targetCapacity) {
        break
      }
    }
    if (inputCapacity < targetCapacity) {
      throw new Error('inputCapacity is not enough')
    }
    if (inputCapacity > targetCapacity) {
      changeOutput.capacity = inputCapacity - targetCapacity
    }

    /**
     * compose the raw transaction which has an empty witnesses
     */

    const outputs =
      changeOutput.capacity > 0n ? [{
          ...targetOutput,
          capacity: targetOutput.capacity.toString(),
        },
        {
          ...changeOutput,
          capacity: changeOutput.capacity.toString(),
        },
      ] : [{
        ...targetOutput,
        capacity: targetOutput.capacity.toString(),
      }, ]

    const outputsData = outputs.map(output => "0x")

    const tx = {
      version: '0',
      cellDeps: [{
        outPoint: secp256k1Dep.outPoint,
        isDepGroup: true,
      }, ],
      headerDeps: [],
      inputs,
      outputs,
      witnesses: [{
        data: [],
      }, ],
      outputsData,
    }
    return tx
  }

  /**
   * to see the generated transaction
   */
  // generateTransaction(`0x${blake160edPublicKey}`, 1000000000000).then(tx => {
  //   console.log(JSON.stringify(tx, null, 2))
  // })

  /**
   * send transaction
   */
  const tx = await generateTransaction(`0x${myAddressObj.identifier}`, 6000000000) // generate the raw transaction with empty witnesses
  const signedTx = await core.signTransaction(myAddressObj)(tx)
  /**
   * to see the signed transaction
   */
  // console.log(JSON.stringify(signedTx, null, 2))

  const realTxHash = await core.rpc.sendTransaction(signedTx)
  /**
   * to see the real transaction hash
   */
  // console.log(`The real transaction hash is: ${realTxHash}`)
}

bootstrap()
