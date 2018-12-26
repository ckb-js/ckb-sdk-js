#!/usr/bin/env node

import Core from '@ckb-sdk/core'
import commander from 'commander'
import { prompt } from 'inquirer'
import questions from './rpc' // { rpcMethods }

const RPC_URL = 'http://localhost:8114'

const core = new Core(RPC_URL)

commander.version('0.0.1').description('Cli of CKB')
commander.command('')

commander
  .command('start') // No need of specifying arguments here
  .alias('s')
  .description('Send RPC')
  .action(() => {
    prompt(questions).then((answers: any) => {
      if (answers.rpcMethod) {
        // switch (answers.rpcMethod) {
        //   case rpcMethods[0]: {
        //   }
        //   default: {
        //   }
        // case (rpcMethods[3], rpcMethods[5], rpcMethods[6]): {
        //   return core.rpc[answers.rpcMethod].then(console.log)
        // }
        // }
        // swtich (answers)
      }
      // if (answers.rpcMethod) {
      //   console.log(answers.rpcMethod)
      //   ;(core.rpc as any)[answers.rpcMethod]().then(console.log)
      // }
      // console.log(answers)
    })
  })

commander.parse(process.argv)
