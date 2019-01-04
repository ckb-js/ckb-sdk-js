interface Question {
  type: string
  name: string
  message: string
  choices?: string[]
}

export enum RPC_METHODS {
  GET_BLOCK = 'getBlock',
  GET_TRANSACTION = 'getTransaction',
  GET_BLOCK_HASH = 'getBlockHash',
  GET_TIP_HEADER = 'getTipHeader',
  GET_CELLS_BY_TYPE_HASH = 'getCellsByTypeHash',
  GET_CURRENT_CELL = 'getCurrentCell',
  GET_TIP_BLOCK_NUMBER = 'getTipBlockNumber',
  SEND_TRANSACTION = 'sendTransaction',
}
const choices = Object.keys(RPC_METHODS)
  .filter(k => typeof RPC_METHODS[k as any] === 'number')
  .map(k => RPC_METHODS[k as any])

const questions: Question[] = [
  {
    type: 'rawlist',
    name: 'rpcMethod',
    message: 'What kind of rpc to send',
    choices,
  },
]

export default questions
