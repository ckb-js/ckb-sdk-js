export const filterCellsByInputs = (
  cells: Pick<RawTransactionParams.Cell, 'outPoint' | 'lock'>[],
  inputs: Pick<CKBComponents.CellInput, 'previousOutput'>[],
) => {
  return inputs.map(input => {
    const outPoint = input.previousOutput
    const cell = cells.find(c => c.outPoint?.txHash === outPoint?.txHash && c.outPoint?.index === outPoint?.index)
    if (!cell) {
      throw new Error(`Cell of ${JSON.stringify(outPoint)} is not found`)
    }
    return cell
  })
}

export default { filterCellsByInputs }
