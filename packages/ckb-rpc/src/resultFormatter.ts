// declare namespace CkbRpc {
//   export namespace Results {
//     export interface ITransaction extends CkbComponents.ITransaction {
//       version: number
//     }
//   }
// }

const formatters = {
  toNumber: (number: string | number) => +number,
  toHash: (hash: string) => hash,
  toHeader: (header: any) => header,
  toTransactionWithHash: (txn: any) => txn,
  toCellOutputWithOutput: (cell: any) => cell,
  toCellWithStatus: (cell: any) => cell,
  toBlockWithHash: (block: any) => block,
  toTxRes: (txRes: any) => txRes,
}
export default formatters
