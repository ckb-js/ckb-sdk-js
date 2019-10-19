const { default: TransactionBuilder } = require('../../lib/transactionBuilder')
const { default: KeyPair } = require('../../lib/keyPair')
const { privateKey, inputs, outputs, options, signedTransactin } = require('./fixtures.json')

describe('Transaction builder', () => {
  let transactionBuilder = new TransactionBuilder()
  beforeEach(() => {
    transactionBuilder = new TransactionBuilder()
  })
  it('Add and remove input', () => {
    inputs.forEach(input => {
      transactionBuilder.addInput(input)
    })
    expect(transactionBuilder.rawTransaction.inputs).toEqual(inputs)
    transactionBuilder.removeInput(0)
    expect(transactionBuilder.rawTransaction.inputs).toHaveLength(0)
  })

  it('Add and remove output', () => {
    outputs.forEach(output => {
      transactionBuilder.addOutput(output)
    })
    expect(transactionBuilder.rawTransaction.outputs).toEqual(outputs)
    transactionBuilder.removeOutput(0)
    expect(transactionBuilder.rawTransaction.outputs).toHaveLength(0)
  })

  it('Update options', () => {
    transactionBuilder.updateOptions(JSON.parse(JSON.stringify(options)))
    expect({
      outputsData: transactionBuilder.rawTransaction.outputsData,
      version: transactionBuilder.rawTransaction.version,
      witnesses: transactionBuilder.rawTransaction.witnesses,
    }).toEqual(options)
  })

  it('Update transaction hash', () => {
    transactionBuilder.updateTransactionHash()
    expect(transactionBuilder.hash).toBe('0xf2e7a5362e217ed4d7f985af71b654cafadd0c3b6d6a6c13f1b13a6bfd0d3d14')
  })

  it('sign input with private key', () => {
    inputs.forEach(input => {
      transactionBuilder.addInput(input)
    })
    outputs.forEach(output => {
      transactionBuilder.addOutput(output)
    })
    transactionBuilder.updateOptions(JSON.parse(JSON.stringify(options)))
    transactionBuilder.signInput(0, privateKey)
    expect(transactionBuilder.rawTransaction).toEqual(signedTransactin)
  })

  it('sign input with address object', () => {
    inputs.forEach(input => {
      transactionBuilder.addInput(input)
    })
    outputs.forEach(output => {
      transactionBuilder.addOutput(output)
    })
    transactionBuilder.updateOptions(JSON.parse(JSON.stringify(options)))
    const keyPair = new KeyPair(privateKey)
    transactionBuilder.signInput(0, keyPair)
    expect(transactionBuilder.rawTransaction).toEqual(signedTransactin)
  })

  it('sign input without index should throw an error', () => {
    expect(() => transactionBuilder.signInput(undefined, privateKey)).toThrowError('Index of input is required')
  })
  it('sign input without privateKey should throw an error', () => {
    expect(() => transactionBuilder.signInput(0, undefined)).toThrowError('Private key or address object is required')
  })
})
