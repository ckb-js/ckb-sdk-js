const Address = require('../lib').default

describe('ckb-sdk-address', () => {
  it('generate address', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      prefix: 'ckt',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = new Address(fixture.privateKey, {
      compressed: true,
      prefix: fixture.prefix,
    })
    expect(address.value).toBe(fixture.address)
  })
})
