interface DepCellInfo {
  hashType: CKBComponents.ScriptHashType
  codeHash: CKBComponents.Hash256
  typeHash?: CKBComponents.Hash256
  outPoint: CKBComponents.OutPoint
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
    deps: DepCellInfo
    capacityThreshold?: Capacity
    changeThreshold?: Capacity
    changePublicKeyHash?: PublicKeyHash
  }

  interface Simple extends Base {
    fromPublicKeyHash: PublicKeyHash
    toPublicKeyHash: PublicKeyHash
    capacity: Capacity
    cells?: Cell[]
  }

  interface Complex extends Base {
    fromPublicKeyHashes: PublicKeyHash[]
    receivePairs: { publicKeyHash: PublicKeyHash; capacity: Capacity }[]
    cells: Map<LockHash, CachedCell[]>
  }
}
