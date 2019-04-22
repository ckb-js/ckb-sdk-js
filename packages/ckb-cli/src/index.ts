#!/usr/bin/env node --experimental-repl-await

import repl from 'repl'
import Core from '@nervosnetwork/ckb-sdk-core'
import commander from 'commander'
import { prompt } from 'inquirer'
// import questions from './rpc' // { rpcMethods }

const RPC_URL = 'http://localhost:8114'

commander.version('0.0.1').description('Cli of CKB')
commander.command('')

commander.version('0.0.1', '-v, --version')

commander
  .command('link [remote]') // No need of specifying arguments here
  .alias('l')
  .description('Start a link to the remote address')
  .action(async (remote = RPC_URL) => {
    const core = new Core(remote)
    console.info(`connected to ${remote}`)
    const { action } = await prompt({
      type: 'rawlist',
      name: 'action',
      choices: ['rpc', 'watch'],
    })
    console.info(action)
    if (action === 'rpc') {
      const { rpcMethod } = await prompt({
        type: 'rawlist',
        name: 'rpcMethod',
        message: 'which kind of rpc to send',
        choices: [
          'getBlock',
          'getTransaction',
          'getBlockHash',
          'getTipHeader',
          'getCellsByLockHash',
          'getCurrentCell',
          'getTipBlockNumber',
          'sendTransaction',
        ],
      })
      console.info(rpcMethod)
      /* eslint-disable indent */
      switch (rpcMethod) {
        case 'getTipHeader':
        case 'getTipBlockNumber': {
          return (core.rpc as any)[rpcMethod]().then(console.info)
        }
        default: {
          return null
        }
      }
      /* eslint-enable indent */
    }
    return null
  })

commander
  .command('interact [remote]')
  .alias('i')
  .description('user interaface')
  .action(async (remote = RPC_URL) => {
    const replServer = repl.start({
      prompt: 'ckb => ',
    })
    console.info(`connected to ${remote}`)
    const core = new Core(remote)
    replServer.context.core = core
    replServer.context.rpc = {}
    Object.keys(core.rpc).forEach(key => {
      replServer.context.rpc[key] = (core.rpc as any)[key]
    })
  })
commander.parse(process.argv)
