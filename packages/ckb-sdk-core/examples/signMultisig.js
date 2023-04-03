const CKB = require('../lib').default
const { hashMultisig } = require('../lib/multisig')

const alice = {
  blake160: '0xc9dc0591a8edf3ddbd48e3dd24c85d68706df86f',
  privateKey: '0x13f88a4a4f06cdbe693ef77b8fcbda1d44ea28567c47a7284e7542bc3eafe6c7'
}
const bob = {
  blake160: '0x8aa16d7f71b352fa8c3bd4ca790ca4b662343381',
  privateKey: '0x51594d34890e2c817ac0a58d702a4c19cc314000f308926de739faa460f149c9'
}
const charlie = {
  blake160: '0x6f8f1a16bf40f0171bbb6d5abcec5473485f916b',
  privateKey: '0xac5f70a5b36e645eebfaad00357e3b1d94b9d50718824a818ec08b90c68a48af'
}

const multisigConfig = {
  r: 0,
  m: 2,
  n: 3,
  blake160s: [alice.blake160, bob.blake160, charlie.blake160]
}
const ckb = new CKB('http://localhost:8114')
const multisigLockScript = {
  hashType: ckb.utils.systemScripts.SECP256K1_MULTISIG.hashType,
  codeHash: ckb.utils.systemScripts.SECP256K1_MULTISIG.codeHash,
  args: hashMultisig(multisigConfig)
}
const multisigLockHash = ckb.utils.scriptToHash(multisigLockScript)

const inputCells = [
  {
      "previousOutput":{
          "txHash":"0x4a978176babec5441a9a15182f3cc35799b60b4fc09e0a478f9fc640c32aa7f0",
          "index":"0x0"
      },
      "since": "0x0",
      "lock": multisigLockScript
  }
]
const tx = {
  "cellDeps":[
      {
          "outPoint": ckb.utils.systemScripts.SECP256K1_MULTISIG.testnetOutPoint,
          "depType": ckb.utils.systemScripts.SECP256K1_MULTISIG.depType
      }
  ],
  "headerDeps":[

  ],
  "inputs": inputCells.map(v => ({
    since: v.since,
    previousOutput: v.previousOutput
  })),
  "outputs":[
      {
          "capacity": `0x${BigInt('6100000000').toString(16)}`,
          "lock": {
              "args": "0x62260b4dd406bee8a021185edaa60b7a77f7e99a",
              "codeHash": ckb.utils.systemScripts.SECP256K1_BLAKE160.codeHash,
              "hashType": ckb.utils.systemScripts.SECP256K1_BLAKE160.hashType,
          },
      },
      {
          "capacity": `0x${(BigInt('100000000000') - BigInt('6100000000') - BigInt('593')).toString(16)}`,
          "lock": multisigLockScript,
      }
  ],
  "version":"0x0",
  "outputsData":[
      "0x",
      "0x"
  ]
}
const transactionHash = ckb.utils.rawTransactionToHash(tx)

// will be PartiallySigned after alice sign
const aliceSign = ckb.signWitnesses(new Map([[multisigLockHash, {
  sk: alice.privateKey,
  blake160: alice.blake160,
  config: multisigConfig,
  signatures: []
}]]))({
  transactionHash,
  witnesses: [
    {
      lock: "",
      inputType: "",
      outputType: ""
    }
  ],
  inputCells
})

// deliver alice's blake160 to signatures, and deliver signed witness as witness parameter will be Signed after bob sign
const bobSign = ckb.signWitnesses(new Map([[multisigLockHash, {
  sk: bob.privateKey,
  blake160: bob.blake160,
  config: multisigConfig,
  signatures: [alice.blake160]
}]]))({
  transactionHash,
  witnesses: aliceSign,
  inputCells
});

(async function(){
  tx.witnesses = bobSign
  const txHash = await ckb.rpc.sendTransaction(tx)
  console.log(txHash)
}())
