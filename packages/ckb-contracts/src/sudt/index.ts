import Core from '@nervosnetwork/ckb-sdk-core'
import sUDTMetadata from './sudt.json'

export class SUDT extends Core {
  #dep: CKBComponents.CellDep

  #minCapacity = sUDTMetadata.capacity

  #user: string = ''

  #args: string = ''

  constructor(
    user = '',
    url = 'http://localhost:8114',
    sudtDep: CKBComponents.CellDep = sUDTMetadata.dep as CKBComponents.CellDep,
  ) {
    super(url)
    this.#dep = sudtDep
    this.#user = user
  }

  get sUTDep() {
    return this.#dep
  }

  get minCapacity() {
    return this.#minCapacity
  }

  set minCapacity(value: string) {
    // TODO: check the value
    this.#minCapacity = value
  }

  get user() {
    return this.#user
  }

  set user(address: string) {
    const parts = this.utils.parseAddress(address, 'hex')
    if (!parts.startsWith('0x0100')) {
      throw new Error(`Expect user to be a short address`)
    }
    this.#args = `0x${parts.slice(6)}`
    this.#user = address
  }

  get args() {
    return this.#args
  }

  public deploy = async (privateKey: string, rawTransaction?: CKBComponents.RawTransactionToSign) => {
    const lockHash = await this.getLockHash()
    const txToSign = rawTransaction || (await this.generateDeployTransaction())
    const signed = this.signTransaction(privateKey)(txToSign, this.cells.get(lockHash) ?? [])
    return this.rpc.sendTransaction(signed)
  }

  public generateDeployTransaction = async ({ fee = '0x9c40' } = { fee: '0x9c40' }) => {
    const lockHash = await this.getLockHash()

    const { JSBI } = this.utils
    const sumOfCells = (cells: CachedCell[] = []) =>
      cells.reduce((sum, cell) => JSBI.add(sum, JSBI.BigInt(cell.capacity)), JSBI.BigInt(0))

    const requiredCapacity = JSBI.add(JSBI.BigInt(this.#minCapacity), JSBI.BigInt(fee))
    let start = JSBI.BigInt('0x0')
    const STEP = JSBI.BigInt('0x64')
    const tipBlockNumber = await this.rpc.getTipBlockNumber()
    /* eslint-disable no-await-in-loop */
    while (JSBI.lessThan(sumOfCells(this.cells.get(lockHash)), requiredCapacity)) {
      if (JSBI.greaterThan(start, JSBI.BigInt(tipBlockNumber))) {
        throw new Error('Not enough capacity fetched')
      }
      const end = JSBI.add(start, STEP)
      await this.loadCells({
        lockHash,
        start: `0x${start.toString(16)}`,
        end: `0x${end.toString(16)}`,
        save: true,
      })
      start = end
    }
    /* eslint-enable no-await-in-loop */

    const raw = this.generateRawTransaction({
      fromAddress: this.user,
      toAddress: this.user,
      capacity: this.minCapacity,
      fee,
      safeMode: true,
      deps: this.config.secp256k1Dep!,
    })

    raw.cellDeps = [this.sUTDep]
    raw.outputsData[0] = sUDTMetadata.sudtData
    raw.witnesses = raw.inputs.map(() => '0x')
    raw.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: '',
    }
    return raw
  }

  private getLockHash = async () => {
    if (!this.user) {
      throw new Error(`User is required ${this.user}`)
    }

    if (!this.config.secp256k1Dep) {
      await this.loadSecp256k1Dep()
    }

    const lockScript = {
      codeHash: this.config.secp256k1Dep!.codeHash,
      hashType: this.config.secp256k1Dep!.hashType,
      args: this.args,
    }

    return this.utils.scriptToHash(lockScript)
  }
}
export default SUDT
