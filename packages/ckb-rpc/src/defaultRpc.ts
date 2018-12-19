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
    name: 'getCallByTypeHash',
    method: 'get_call_by_type_hash',
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
export default defaultRpc
