import ErrorCode from './ErrorCode.js'

export class ReconciliationException extends Error {
  code = ErrorCode.ReconciliationFailed

  constructor() {
    super(`Fail to reconcile transaction, try to increase extra count or check the transaction`)
  }
}

export default {
  ReconciliationException,
}
