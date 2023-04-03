const codeHashOccupied = 32
const hashTypeOccupied = 1

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/helpers.html#minimalscriptcapacity minimalScriptCapacity} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#scriptoccupied example}
 */
export const scriptOccupied = (script: CKBComponents.Script) => {
  return script.args.slice(2).length / 2 + codeHashOccupied + hashTypeOccupied
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/helpers.html#minimalcellcapacity minimalCellCapacity} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#celloccupied example}
 */
export const cellOccupied = (cell: CKBComponents.CellOutput) => {
  return 8 + scriptOccupied(cell.lock) + (cell.type ? scriptOccupied(cell.type) : 0)
}
