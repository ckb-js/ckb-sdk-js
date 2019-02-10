interface Question {
  type: string
  name: string
  message: string
  choices?: string[]
}

export enum RPCMethods {
  GetBlock = 'getBlock',
  GetTransaction = 'getTransaction',
  GetBlockHash = 'getBlockHash',
  GetTipHeader = 'getTipHeader',
  GetCellsByTypeHash = 'getCellsByTypeHash',
  GetCurrentCell = 'getCurrentCell',
  GetTipBlockNumber = 'getTipBlockNumber',
  SendTransaction = 'sendTransaction',
}
const choices = Object.keys(RPCMethods)
  .filter(k => typeof RPCMethods[k as any] === 'number')
  .map(k => RPCMethods[k as any])

const questions: Question[] = [
  {
    type: 'rawlist',
    name: 'rpcMethod',
    message: 'What kind of rpc to send',
    choices,
  },
]

export default questions
