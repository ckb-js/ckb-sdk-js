interface DepCellInfo {
  hashType: CKBComponents.ScriptHashType
  codeHash: CKBComponents.Hash256
  typeHash?: CKBComponents.Hash256
  outPoint: CKBComponents.OutPoint
  depType: CKBComponents.DepType
}

interface CachedCell extends CKBComponents.CellIncludingOutPoint {
  status: string
  dataHash: string
  type?: CKBComponents.Script | null
}

type StructuredWitness = CKBComponents.WitnessArgs | CKBComponents.Witness

declare namespace LoadCellsParams {
  interface Base {
    start?: string | bigint
    end?: string | bigint
  }

  interface Normal extends Base {
    lockHash: CKBComponents.Hash
    start?: string | bigint
    end?: string | bigint
    STEP?: string | bigint
  }

  interface FromIndexer extends Base {
    lock: CKBComponents.Script
    indexer: any
    CellCollector: any
  }
}

declare namespace RawTransactionParams {
  type LockHash = string
  type PublicKeyHash = string
  type Capacity = string | bigint
  export type Cell = Pick<CachedCell, 'dataHash' | 'type' | 'capacity' | 'outPoint'>
  interface Base {
    fee?: Capacity
    safeMode: boolean
    deps: DepCellInfo | DepCellInfo[]
    capacityThreshold?: Capacity
    changeThreshold?: Capacity
    changePublicKeyHash?: PublicKeyHash
  }

  interface Simple extends Base {
    inputScript: CKBComponents.Script
    outputScript: CKBComponents.Script
    capacity: Capacity
    cells?: Cell[]
  }

  interface Output extends CKBComponents.CellOutput {
    capacity: string | bigint
  }

  interface Complex extends Base {
    inputScripts: CKBComponents.Script[]
    outputs: Output[]
    cells?: Map<LockHash, Cell[]>
  }
}
