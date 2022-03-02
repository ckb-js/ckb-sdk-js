export const scriptOccupied = (script: CKBComponents.Script) => {
  return script.args.slice(2).length / 2 + 32 + 1
}

export const cellOccupied = (cell: CKBComponents.CellOutput) => {
  return 8 + scriptOccupied(cell.lock) + (cell.type ? scriptOccupied(cell.type) : 0)
}