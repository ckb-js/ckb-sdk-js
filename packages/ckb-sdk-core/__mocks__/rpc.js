const genesisBlock = require('./data/genesisBlock.json')
const liveCell = require('./data/liveCell')
const cell = require('./data/cell.json')

module.exports = {
  getBlockByNumber: jest.fn().mockResolvedValue(genesisBlock),
  getTipBlockNumber: jest.fn().mockResolvedValue('0x1000'),
  getCellsByLockHash: jest.fn().mockResolvedValue(
    Array.from(
      {
        length: 100,
      },
      () => cell
    )
  ),
  getLiveCell: jest.fn().mockResolvedValue(liveCell),
}
