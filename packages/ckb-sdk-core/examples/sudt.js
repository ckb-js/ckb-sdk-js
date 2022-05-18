/* eslint-disable camelcase */
const path = require('path')
const os = require('os')
/* eslint-disable-next-line */
const { Indexer, CellCollector } = require('@ckb-lumos/indexer')
const { SIMPLE_UDT, ANYONE_CAN_PAY_TESTNET } = require('@nervosnetwork/ckb-sdk-utils/lib/systemScripts')
const CKB = require('../lib').default

const CONFIG = {
  privateKey: process.env.PRIVATE_KEY,
  ckbUrl: process.env.CKB_URL || 'http://localhost:8114',
  lumosDbName: process.env.LUMOS_DB_NAME || 'testnet_lomus_db',
  sudtDep: {
    codeHash: SIMPLE_UDT.codeHash,
    hashType: SIMPLE_UDT.hashType,
    outPoint: SIMPLE_UDT.testnetOutPoint,
    depType: SIMPLE_UDT.depType,
  },
  acpDep: {
    codeHash: ANYONE_CAN_PAY_TESTNET.codeHash,
    hashType: ANYONE_CAN_PAY_TESTNET.hashType,
    outPoint: ANYONE_CAN_PAY_TESTNET.testnetOutPoint,
    depType: ANYONE_CAN_PAY_TESTNET.depType,
  },
}

const CONSTANT = {
  sudtCellSize: 142 * 10 ** 8,
  acpCellSize: 61 * 10 ** 8,
}

class SudtAccount {
  constructor(privateKey = CONFIG.privateKey, ckbUrl = CONFIG.ckbUrl) {
    this.ckb = new CKB(ckbUrl)
    this.indexer = new Indexer(ckbUrl, path.join(os.tmpdir(), CONFIG.lumosDbName))
    this.indexer.start()

    const publicKey = this.ckb.utils.privateKeyToPublicKey(privateKey)
    const publicKeyHash = `0x${this.ckb.utils.blake160(publicKey, 'hex')}`
    this.sender = { privateKey, publicKey, publicKeyHash }
  }

  getReady = async () => {
    await this.ckb.loadDeps()
    this.sender.lock = {
      codeHash: this.ckb.config.secp256k1Dep.codeHash,
      hashType: this.ckb.config.secp256k1Dep.hashType,
      args: this.sender.publicKeyHash,
    }
  }

  getCells = async () => {
    await this.ckb.loadCells({ indexer: this.indexer, CellCollector, lock: this.sender.lock, save: true })
    return this.ckb.cells.get(this.ckb.utils.scriptToHash(this.sender.lock))
  }

  getSudtCells = async tokenId => {
    const cells = []
    const collector = new CellCollector(this.indexer, {
      lock: {
        code_hash: this.sender.lock.codeHash,
        hash_type: this.sender.lock.hashType,
        args: this.sender.publicKeyHash,
      },
      type: {
        code_hash: CONFIG.sudtDep.codeHash,
        hash_type: CONFIG.sudtDep.hashType,
        args: tokenId || this.ckb.utils.scriptToHash(this.sender.lock),
      },
    })
    /* eslint-disable-next-line */
    for await (const {
      cell_output: { lock, type, capacity },
      out_point,
      data,
    } of collector.collect()) {
      cells.push({
        capacity: BigInt(capacity),
        lock: {
          codeHash: lock.code_hash,
          hashType: lock.hash_type,
          args: lock.args,
        },
        type: {
          codeHash: type.code_hash,
          hashType: type.hash_type,
          args: type.args,
        },
        outPoint: {
          txHash: out_point.tx_hash,
          index: out_point.index,
        },
        data,
        sudt: BigInt(`0x${Buffer.from(data.slice(2), 'hex').reverse().toString('hex')}`),
      })
    }
    return cells
  }

  createAcpCell = async amount => {
    const address = this.ckb.utils.privateKeyToAddress(this.sender.privateKey, { prefix: 'ckt' })
    const rawTx = this.ckb.generateRawTransaction({
      fromAddress: address,
      toAddress: address,
      capacity: `0x${(BigInt(CONSTANT.acpCellSize) + amount).toString(16)}`,
      fee: 100000n,
      cells: this.ckb.cells.get(this.ckb.utils.scriptToHash(this.sender.lock)),
      deps: [this.ckb.config.secp256k1Dep, CONFIG.acpDep],
    })
    rawTx.outputs[0].lock = {
      codeHash: CONFIG.acpDep.codeHash,
      hashType: CONFIG.acpDep.hashType,
      args: this.sender.publicKeyHash,
    }
    const signedTx = await this.ckb.signTransaction(this.sender.privateKey)(rawTx)
    return this.ckb.rpc.sendTransaction(signedTx)
  }

  issue = async amount => {
    const address = this.ckb.utils.privateKeyToAddress(this.sender.privateKey, { prefix: 'ckt' })
    const rawTx = this.ckb.generateRawTransaction({
      fromAddress: address,
      toAddress: address,
      capacity: CONSTANT.sudtCellSize,
      fee: 100000n,
      cells: this.ckb.cells.get(this.ckb.utils.scriptToHash(this.sender.lock)),
      deps: [this.ckb.config.secp256k1Dep, CONFIG.sudtDep],
    })

    /*
     * set the first output cell as the sudt-issuer
     */
    rawTx.outputs[0].type = {
      codeHash: CONFIG.sudtDep.codeHash,
      hashType: CONFIG.sudtDep.hashType,
      args: this.ckb.utils.scriptToHash(this.sender.lock),
    }
    rawTx.outputsData[0] = `0x${Buffer.from(amount.toString(16).padStart(32, '0'), 'hex').reverse().toString('hex')}`
    const signedTx = await this.ckb.signTransaction(this.sender.privateKey)(rawTx)
    return this.ckb.rpc.sendTransaction(signedTx)
  }

  transfer = async (tokenId, amount, receiverCell) => {
    const availableCells = await this.getSudtCells(tokenId)
    const inputs = []
    let sumSudt = 0n
    /* eslint-disable-next-line */
    for (const cell of availableCells) {
      inputs.push(cell)
      sumSudt += cell.sudt
      if (amount <= sumSudt) {
        /* eslint-disable-next-line */
        continue
      }
    }

    if (amount > sumSudt) {
      throw new Error(`This account has ${sumSudt} sudt, which is not enough for a transaction of amount ${amount}`)
    }

    const address = this.ckb.utils.privateKeyToAddress(this.sender.privateKey, { prefix: 'ckt' })

    const sudtTypeScript = inputs[0].type

    /* transaction skeleton */
    const rawTx = this.ckb.generateRawTransaction({
      fromAddress: address,
      toAddress: address,
      capacity: `0x${inputs.reduce((sum, i) => sum + i.capacity, 0n).toString(16)}`,
      fee: 0n,
      cells: inputs.map(input => ({ ...input, capacity: `0x${input.capacity.toString(16)}` })),
      deps: [this.ckb.config.secp256k1Dep, CONFIG.sudtDep],
      safeMode: false,
      changeThreshold: '0x0',
      outputsData: [sumSudt - amount, amount].map(
        sudt => `0x${Buffer.from(sudt.toString(16), 'hex').reverse().toString('hex').padEnd(32, '0')}`,
      ),
    })

    rawTx.outputs[0].type = sudtTypeScript

    /* add receiver */
    const fee = 10000n
    rawTx.inputs.push({
      previousOutput: receiverCell.outPoint,
      since: '0x0',
    })
    rawTx.outputs.push({
      lock: receiverCell.lock,
      capacity: `0x${(BigInt(receiverCell.capacity) - fee).toString(16)}`,
      type: sudtTypeScript,
    })
    rawTx.witnesses.push('0x')

    const signedTx = await this.ckb.signTransaction(this.sender.privateKey)(rawTx)
    return this.ckb.rpc.sendTransaction(signedTx)
  }
}

module.exports = SudtAccount

// const run = async () => {
//   const account = new SudtAccount()
//   await account.getReady()
//   const cells = await account.getCells()

//   /* issue sudt */
//   const txHash = await account.issue(2000000n * BigInt(10 ** 8))
//   console.log(txHash)

//   /* get sudt cells */
//   const sudtCells = await account.getSudtCells()
//   console.log(sudtCells)

//   /* transfer */
// const receiverCell = cells.find(cell => !cell.type && cell.data === '0x')
// if (!receiverCell) {
//   throw new Error('Please add a secp256k1 cell to receive sudt')
// }
// const txHash = await account.transfer(null, 999n * BigInt(10 ** 8), receiverCell)
// console.log(txHash)
// }

// run()
