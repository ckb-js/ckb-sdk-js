import Account from './account'

class Wallet {
  static accountFromPrivateKey = (pk: Buffer) => new Account(pk)

  public newAccount = () => {
    // TODO:
  }

  public generateTx = (toAddr: Buffer, capacity: number) => {
    // TODO:
  }

  public sendCapacity = (toAddr: Buffer, capacity: number) => {
    // TODO:
  }

  public gatherInputs = async (capacity: number, minCapacity: number) => {
    if (capacity < minCapacity) {
      throw new Error(`Capacity cannot be less than ${minCapacity}`)
    }

    let inputCapacities = 0
    const inputs = []
    const unspentCells = await this.getUnspentCells()
    unspentCells.every((cell: any) => {
      const input = {
        prevOutput: {
          hash: cell.out_point.hash,
          index: cell.out_point.index,
        },
        unlock: this.verifyScriptJsonObject(),
      }
      inputs.push(input)
      inputCapacities += cell.capacity
      if (
        inputCapacities >= capacity
        && inputCapacities >= minCapacity + capacity
      ) {
        return false
      }
      return true
    })
    if (capacity > inputCapacities) {
      throw new Error('Not enough capacity')
    }
    // TODO:
  }

  public getUnspentCells = () => []

  // public verifyScriptJsonObject = () => {
  //   // TODO:
  // }

  // public verifyScriptJsonObject = () => {
  //   return {
  //     version: 0,
  //     reference: 'api.mruby_cell_hash',
  //     signed_args: [
  //       VERYFY_SCRIPT,
  //       utils.bin_to_hex(pkBin)
  //     ]
  //   }
  // }
}
