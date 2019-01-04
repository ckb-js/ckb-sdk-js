import ECPair, { Options, makeRandom } from '@ckb-sdk/utils/lib/ecpair'

// interface IScriptObject {
//   version: number
//   reference?: string
//   signedArgs: any[]
//   binary?: (0 | 1)[]
// }

// const scriptToTypeHash = (script: IScriptObject) => {
//   const buf: any[] = []
//   if (script.reference) {
//     // s.push(hex2bin(script.reference))
//   }
//   buf.push('|')
//   if (script.binary) {
//     buf.push(script.binary)
//   }
//   script.signedArgs.forEach(signedArg => buf.push(signedArg))
//   // return bin2PrefixHex(sha256(buf))
//   return ''
// }
class Account extends ECPair {
  private _verifyTypeHash: string = ''

  // public constructor(sk: Buffer, options?: Options) {
  //   super(sk, options)
  // }

  // public verifyTypeHash = () => {
  //   if (!this._verifyTypeHash) {
  //     this._verifyTypeHash = scriptToTypeHash(this.verifyScript())
  //   }
  //   return this._verifyTypeHash
  // }

  // public verifyScript = (): IScriptObject => ({
  //   version: 0,
  //   reference: 'api.mruby_cell_hash',
  //   signedArgs: ['VERIFY_SCRIPT', 'hexPubKey'],
  // })
}

export default Account
