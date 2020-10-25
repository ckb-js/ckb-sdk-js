const genesisBlock = require('./data/genesisBlock.json')
const liveCell = require('./data/liveCell')

module.exports = {
  getBlockByNumber: jest.fn().mockResolvedValue(genesisBlock),
  getTipBlockNumber: jest.fn().mockResolvedValue('0x1000'),
  getLiveCell: jest.fn().mockResolvedValue(liveCell),
}
