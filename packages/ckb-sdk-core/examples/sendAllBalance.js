/* eslint-disable */
const CKB = require("../lib").default
const nodeUrl = process.env.NODE_URL || "http://localhost:8114" // example node url
const ckb = new CKB(nodeUrl)

const privateKey =
  process.env.PRIV_KEY ||
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" // example private key

const address = ckb.utils.privateKeyToAddress(privateKey)

const unspentCells = [
  {
    blockHash:
      "0x8810cc8f199ea0167ea592071f61b9b5b66f915ea982f30a96a95a59df7f15ca",
    lock: {
      codeHash:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hashType: "type",
      args: "0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6",
    },
    outPoint: {
      txHash:
        "0xdf45112919d4af12b10fed94a93798ae6ddd8c89a11d90980022dcf695babca9",
      index: "0x0",
    },
    capacity: "0x2540be400",

    dataHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    status: "live",
    type: null,
  },
  {
    blockHash:
      "0x8810cc8f199ea0167ea592071f61b9b5b66f915ea982f30a96a95a59df7f15ca",
    lock: {
      codeHash:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hashType: "type",
      args: "0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6",
    },
    outPoint: {
      txHash:
        "0xdf45112919d4af12b10fed94a93798ae6ddd8c89a11d90980022dcf695babca9",
      index: "0x1",
    },
    capacity: "0x2540be400",
    dataHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    status: "live",
    type: null,
  },
]

const generateRawTransaction = async () => {
  await ckb.loadDeps()
  const rawTx = ckb.generateRawTransaction({
    fromAddress: address,
    toAddress: address,
    capacity: BigInt(19999999900),
    fee: BigInt(100),
    safeMode: true,
    cells: unspentCells,
    deps: ckb.config.secp256k1Dep,
    changeThreshold: BigInt(0),
  })
  console.group("generate raw tx")
  // console.info(`raw transaction: ${JSON.stringify(rawTx, null, 2)}`)
  console.info(
    `inputs capacity:
    ${rawTx.inputs
      .map(
        input =>
          unspentCells.find(
            cell =>
              cell.outPoint.txHash === input.previousOutput.txHash &&
              cell.outPoint.index === input.previousOutput.index,
          ).capacity,
      )
      .map(capacity => BigInt(capacity))}
    `,
  )
  console.info(
    `outputs capacity: ${rawTx.outputs.map(output => BigInt(output.capacity))}`,
  )
  console.groupEnd()
  return rawTx
}

const sendAllBalance = async () => {
  const rawTx = await generateRawTransaction()
  const signedTx = ckb.signTransaction(privateKey)(rawTx)
  // console.group('sign and send tx')
  // console.info(`signed tx: ${JSON.stringify(signedTx, null, 2)}`)
  // const realTxHash = await ckb.rpc.sendTransaction(signedTx)
  // console.info(`real tx hash: ${realTxHash}`)
  // return realTxHash
  // console.groupEnd()
}

sendAllBalance()
