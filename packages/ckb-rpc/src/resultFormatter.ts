// import { Hash } from '../typings/index.d.ts';

const formatter = {
  toNumber: (number: string | number) => +number,
  toHash: (hash: string) => hash,
  toHeader: (header: any) => header,
  toTransactionWithHash: (txn: any) => txn,
  toCellOutputWithOutput: (cell: any) => cell,
  toCellWithStatus: (cell: any) => cell,
  toBlockWithHash: (block: any) => block,
}
export default formatter
