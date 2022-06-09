const signWitnesses = require('../lib/signWitnesses').default
const CKB = require('../lib').default
const { hashMultisig } = require('../lib/multisig')

const multisigConfig = {
  r: 1,
  m: 2,
  n: 3,
  blake160s: ['0x36c329ed630d6ce750712a477543672adab57f4c', '0xe2193df51d78411601796b35b17b4f8f2cd85bd0', '0xe2193df51d78411601796b35b17b4f8f2cd80000']
}
const ckb = new CKB('http://localhost:8114')
const multisigLockScript = {
  hashType: ckb.utils.systemScripts.SECP256K1_MULTISIG.hashType,
  codeHash: ckb.utils.systemScripts.SECP256K1_MULTISIG.codeHash,
  args: hashMultisig(multisigConfig)
}
const multisigLockHash = ckb.utils.scriptToHash(multisigLockScript)

const tx = {
  "cellDeps":[
      {
          "outPoint":{
              "txHash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
              "index":"0x1"
          },
          "depType":"depGroup"
      }
  ],
  "headerDeps":[

  ],
  "inputs":[
      {
          "previousOutput":{
              "txHash":"0x6a7f62794154b6b46748bc1f178357d183523da669407e5d5769213545887d29",
              "index":"0x1"
          },
          "since": "0x0",
          "lock": multisigLockScript
      }
  ],
  "outputs":[
      {
          "capacity": "0x16b969d00",
          "lock":{
              "args":"0x62260b4dd406bee8a021185edaa60b7a77f7e99a",
              "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
              "hashType":"type"
          },
          "data":"0x"
      },
      {
          "capacity": "0x15dce04904",
          "lock": multisigLockScript,
          "data":"0x"
      }
  ],
  "witnesses":[

  ],
  "signatures":{

  },
  "version":"0x0",
  "fee":"508",
  "outputsData":[
      "0x",
      "0x"
  ]
}
const transactionHash = ckb.utils.rawTransactionToHash(tx)

const aliceSign = signWitnesses(new Map([[multisigLockHash, {
  sk: '0xe8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
  blake160: '0xe2193df51d78411601796b35b17b4f8f2cd85bd0',
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
  inputCells: tx.inputs
})
// PartiallySigned

// deliver alice's blake160 to signatures, and deliver signed witness as witness parameter
const bobSign = signWitnesses(new Map([[multisigLockHash, {
  sk: '0xe79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
  blake160: '0x36c329ed630d6ce750712a477543672adab57f4c',
  config: multisigConfig,
  signatures: ['0xe2193df51d78411601796b35b17b4f8f2cd85bd0']
}]]))({
  transactionHash,
  witnesses: aliceSign,
  inputCells: tx.inputs
})

// Signed