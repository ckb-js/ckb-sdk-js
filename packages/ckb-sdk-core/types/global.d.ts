interface DepCellInfo {
  hashType: CKBComponents.ScriptHashType
  codeHash: CKBComponents.Hash256
  outPoint: CKBComponents.OutPoint
}

interface CachedCell extends CKBComponents.CellIncludingOutPoint {
  status: string
  dataHash: string
}
