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
