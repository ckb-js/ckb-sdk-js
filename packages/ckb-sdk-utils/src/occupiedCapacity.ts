const codeHashOccupied = 32
const hashTypeOccupied = 1

export const scriptOccupied = (script: CKBComponents.Script) => {
  return script.args.slice(2).length / 2 + codeHashOccupied + hashTypeOccupied
}

export const cellOccupied = (cell: CKBComponents.CellOutput) => {
  return 8 + scriptOccupied(cell.lock) + (cell.type ? scriptOccupied(cell.type) : 0)
}