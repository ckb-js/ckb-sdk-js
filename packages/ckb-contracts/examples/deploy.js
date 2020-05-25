const { SUDT } = require('../lib')

const run = async () => {
  const contract = new SUDT()
  const sk = `0x${'e'.repeat(64)}` // private key for demonstrating
  const user = contract.utils.privateKeyToAddress(sk)

  contract.user = user
  const res = await contract.deploy(sk)
  console.log(res)
}

run()
