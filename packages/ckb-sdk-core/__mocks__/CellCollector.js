module.exports = class CellCollector {
  collect = jest.fn(() =>
    Array.from({ length: 10 }, (_, idx) => ({
      cell_output: {
        type: `mock_type ${idx}`,
        capacity: `mock_capacity ${idx}`,
      },
      out_point: {
        tx_Hash: `mock_tx_hash ${idx}`,
        index: `mock_index ${idx}`,
      },
    })),
  )
}
