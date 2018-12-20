import { IMethod } from '../typings'
import paramsFmts from './paramsFormatter'
import resultFmts from './resultFormatter'

const defaultRpc: IMethod[] = [
  {
    name: 'getBlock',
    method: 'get_block',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: [resultFmts.toBlockWithHash],
  },
  {
    name: 'getTransaction',
    method: 'get_transaction',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: [resultFmts.toTransactionWithHash],
  },
  {
    name: 'getBlockHash',
    method: 'get_block_hash',
    paramsFormatters: [paramsFmts.toNumber],
    resultFormatters: [resultFmts.toHash],
  },
  {
    name: 'getTipHeader',
    method: 'get_tip_header',
    paramsFormatters: [],
    resultFormatters: [resultFmts.toHeader],
  },
  {
    name: 'getCellByTypeHash',
    method: 'get_cell_by_type_hash',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: [resultFmts.toCellOutputWithOutput],
  },
  {
    name: 'getCurrentCell',
    method: 'get_current_cell',
    paramsFormatters: [paramsFmts.toOutPoint],
    resultFormatters: [resultFmts.toCellWithStatus],
  },
  {
    name: 'getTipBlockNumber',
    method: 'get_tip_block_number',
    paramsFormatters: [],
    resultFormatters: [resultFmts.toNumber],
  },
]
export class DefaultPrc {
  protected defaultMethods = defaultRpc

  /* eslint-disable */
  public getBlock(hash: string): any {}

  public getTransaction(hash: string): any {}

  public getBlockHash(number: number): any {}

  public getTipHeader(): any {}

  public getCellByTypeHash(hash: string): any {}

  public getCurrentCell(): any {}

  public getTipBlockNumber(): any {}
  /* eslint-enable */
}

export default DefaultPrc
