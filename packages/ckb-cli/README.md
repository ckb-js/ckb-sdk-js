# `ckb-cli`

`@nervosnetwork/ckb-cli` is a command line package based on `@nervosnetwork/ckb-sdk-core`, used to start a Node.js runtime, which has an object named `core` injected. The `core` is the instance of `@nervosnetwork/ckb-sdk-core`.

This project is still under very rapid development, all contributions are welcome.

## Installation

Install the package with [yarn](https://yarnpkg.com/):

```sh
$ yarn global add @nervosnetwork/ckb-cli
```

Or install the package with [npm](https://npmjs.com):

```sh
$ npm install -g @nervosnetwork/ckb-cli
```

## Usage

```sh
$ @nervosnetwork/ckb-cli <url to the node>
ckb => connected to <url to the node>
ckb => await core.rpc.getTipBlockNumber()
'6905'
ckb => await core.rpc.getBlockHash('6905')
'0x89de946313839a8a77749b6218d4d7ab3513910c5ed86040e5f38efd41e566d7'
ckb => await core.rpc.getBlock('0x89de946313839a8a77749b6218d4d7ab3513910c5ed86040e5f38efd41e566d7')
{ header:
   { parentHash:
      '0xc5e11f1e5bcf589a99b94d9eaeffdccb51e3fbdc3c39561dfc49e6d42740f400',
     transactionsRoot:
      '0x993b28a820cea9297da82654c18e99e6469e08c1a14425724e71ed271d0aac0e',
     proposalsHash:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
     witnessesRoot:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
     unclesHash:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
     unclesCount: '0',
     difficulty: '0x1000',
     epoch: '4',
     hash:
      '0x89de946313839a8a77749b6218d4d7ab3513910c5ed86040e5f38efd41e566d7',
     number: '6905',
     seal:
      { nonce: '17168453808346374945',
        proof:
         '0x6c040000e00d0000380f0000c22100002f2900001d2b0000c32b0000fc2c0000743f00008d4600000c480000e46c0000' },
     timestamp: '1557653980138',
     version: '0' },
  uncles: [],
  transactions:
   [ { deps: [],
       inputs: [Array],
       outputs: [Array],
       hash:
        '0x993b28a820cea9297da82654c18e99e6469e08c1a14425724e71ed271d0aac0e',
       version: '0',
       witnesses: [] } ],
  proposals: [] }
ckb =>
```
