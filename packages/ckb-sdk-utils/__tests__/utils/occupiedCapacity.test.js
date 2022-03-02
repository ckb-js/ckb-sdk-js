const { scriptOccupied, cellOccupied } = require('../..')

describe('script occupied', () => {
  it('no args', () => {
    const occupied = scriptOccupied({
      args: '0x',
      codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
      hashType: 'type'
    });
    expect(occupied).toBe(33);
  })
  it('with args', () => {
    const occupied = scriptOccupied({
      args: '0x00ffee',
      codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
      hashType: 'type'
    });
    expect(occupied).toBe(36);
  })
})


describe('cell occupied', () => {
  it('no type', () => {
    const occupied = cellOccupied({
      capacity: '0xe8d4a51000',
      lock: {
        args: '0x',
        codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
        hashType: 'type'
      },
    });
    expect(occupied).toBe(41);
  })
  it('with type', () => {
    const occupied = cellOccupied({
      capacity: '0xe8d4a51000',
      lock: {
        args: '0x',
        codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
        hashType: 'type'
      },
      type: {
        args: '0x00ff',
        codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
        hashType: 'type'
      }
    });
    expect(occupied).toBe(76);
  })
})