const Address = require('../lib').default

describe('ckb-sdk-address', () => {
  it('generate address with default configuration', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = new Address(fixture.privateKey)
    expect(address.value).toBe(fixture.address)
  })

  it('generate address specified prefix', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      prefix: 'ckt',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = new Address(fixture.privateKey, {
      prefix: fixture.prefix,
    })
    expect(address.value).toBe(fixture.address)
  })

  it('generate address specified type of 0x01', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      type: '0x01',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = new Address(fixture.privateKey, {
      type: fixture.type,
    })
    expect(address.value).toBe(fixture.address)
  })

  it('generate address specified type 0x01 and binIdx of P2PH', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      type: '0x01',
      binIdx: 'P2PH',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = new Address(fixture.privateKey, {
      type: fixture.type,
      binIdx: fixture.binIdx,
    })
    expect(address.value).toBe(fixture.address)
  })

  it('generate identifier with default configuration', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e',
      identifier: '2f663ae60e00153d223657c685a15604255b168b',
    }
    const address = new Address(fixture.privateKey)
    expect(address.identifier).toBe(fixture.identifier)
  })
})
