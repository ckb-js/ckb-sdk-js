# CKB SDK JavaScript

| Service  | Master                                                                                                                                                   | Develop                                                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit Tests   | [![Unit Tests](https://github.com/nervosnetwork/ckb-sdk-js/workflows/Unit%20Tests/badge.svg?branch=master)](https://github.com/nervosnetwork/ckb-sdk-js/actions?query=branch%3Amaster+workflow%3A%22Unit+Tests%22)                      | [![Unit Tests](https://github.com/nervosnetwork/ckb-sdk-js/workflows/Unit%20Tests/badge.svg?branch=develop)](https://github.com/nervosnetwork/ckb-sdk-js/actions?query=branch%3Adevelop+workflow%3A%22Unit+Tests%22)                       |
| Coverage | [![Codecov](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/master/graph/badge.svg)](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/master) | [![Codecov](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/develop/graph/badge.svg)](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/develop) |

[![NPM](https://img.shields.io/npm/v/@nervosnetwork/ckb-sdk-core/latest.svg)](https://www.npmjs.com/package/@nervosnetwork/ckb-sdk-core)
[![Package Quality](https://npm.packagequality.com/shield/%40nervosnetwork%2Fckb-sdk-core.svg)](https://packagequality.com/#?package=@nervosnetwork/ckb-sdk-core)
[![License](https://img.shields.io/npm/l/@nervosnetwork/ckb-sdk-core.svg)](./LICENSE)
[![Telegram Group](https://cdn.rawgit.com/Patrolavia/telegram-badge/8fe3382b/chat.svg)](https://t.me/nervos_ckb_dev)
[![SNYK](https://github.com/nervosnetwork/ckb-sdk-js/workflows/SNYK/badge.svg)](https://github.com/nervosnetwork/ckb-sdk-js/actions?query=workflow%3ASNYK)
[![Deploy Docs](https://github.com/nervosnetwork/ckb-sdk-js/workflows/Deploy%20Docs/badge.svg)](https://nervosnetwork.github.io/ckb-sdk-js/classes/ckb.html)

JavaScript SDK for Nervos [CKB](https://github.com/nervosnetwork/ckb).

The ckb-sdk-js is still under development and NOT production ready. You should get familiar with CKB transaction structure and RPC before using it.

<details>
<summary>ToC</summary>
<p>

- [Type Doc](#typedoc)
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Modules](#modules)
- [CORE](#core)
- [RPC](#rpc)
- [Errors](#errors)
- [Examples](#examples)
- [Development Process](#development-process)

<p>
</details>

---

# TypeDoc

- [Global](https://nervosnetwork.github.io/ckb-sdk-js/globals.html)
- [Core](https://nervosnetwork.github.io/ckb-sdk-js/classes/ckb.html)
- [RPC](https://nervosnetwork.github.io/ckb-sdk-js/classes/ckbrpc.html)
- [Types](https://nervosnetwork.github.io/ckb-sdk-js/modules/ckbcomponents.html)

# Introduction

`@nervosnetwork/ckb-sdk-core` is the SDK used to interact with [Nervos CKB](https://github.com/nervosnetwork/ckb), which is an open source project of public blockchain.

## Before everything

Due to safety concern, the SDK won’t generate private keys for you. You can use `openssl` to generate a private key:

```sh
$ openssl rand -hex 32
```

For other cases, say, you're going to generate it in a JavaScript Project(Please don't), [Elliptic](https://github.com/indutny/elliptic/) may be the one you can use.

## About Nervos CKB

> Nervos CKB is the layer 1 of Nervos Network, a public blockchain with PoW and cell model.

> Nervos project defines a suite of scalable and interoperable blockchain protocols. Nervos CKB uses those protocols to create a self-evolving distributed network with a novel economic model, data model and more.

> _Notice:_ The ckb process will send stack trace to sentry on Rust panics. This is enabled by default before mainnet, which can be opted out by setting the option dsn to empty in the config file.

## About @nervosnetwork/ckb-sdk-core

`@nervosnetwork/ckb-sdk-core` is an SDK implemented by JavaScript, and published in [NPM Registry](https://www.npmjs.com/package/@nervosnetwork/ckb-sdk-core/), which provides APIs for developers to send requests to the CKB blockchain.

This SDK can be used both in Browsers and [Node.js](https://nodejs.org) as it's source code is implemented by TypeScript, which is a superset of JavaScript and compiled into ES6. For some browsers that have old versions, some polyfills might be injected.

# Prerequisites

We are going to use [yarn](https://yarnpkg.com/) for the next steps, which is similar to [npm](https://npmjs.com), so feel free to pick one.

For the developers who are interested in contribution.

# Installation

```sh
$ yarn add @nervosnetwork/ckb-sdk-core # install the SDK into your project
```

# Modules

This SDK includes several modules:

<details>
<summary>
  RPC <a href="https://github.com/nervosnetwork/ckb-sdk-js/tree/develop/packages/ckb-sdk-rpc" alt="rpc">Code</a>
</summary>
<dd>

Used to send RPC request to the CKB, the list could be found in [CKB Project](https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs)

Interfaces could be found in `DefaultRPC` class in this module.

</dd>

</details>

<details>
<summary>
  Utils <a href="https://github.com/nervosnetwork/ckb-sdk-js/tree/develop/packages/ckb-sdk-utils" alt="utils">Code</a>
</summary>
<dd>

The Utils module provides useful methods for other modules.

</dd>
</details>

<details>
<summary>
  Types <a href="https://github.com/nervosnetwork/ckb-sdk-js/tree/develop/packages/ckb-types" alt="types">Code</a>
</summary>
<dd>

The Types module used to provide the type definition of CKB Components according to the [CKB Project](https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs).

CKB Project compiles to the snake case convetion, which listed in the types/CKB_RPC in the RPC module.

TypeScript compiles to the PascalCase convention, which listed in this module.

</dd>
</details>

# CORE

All the modules above are integrated into the core module. You can find `rpc` and `utils` in the core instance.

To use the core module, you need to import it in your project and instantiate it with a node object. For now, the node object only contains one field named `url`, the URI of the blockchain node your are going to communicate with.

```javascript
const CKB = require('@nervosnetwork/ckb-sdk-core').default

const nodeUrl = 'http://localhost:8114'

const ckb = new CKB(nodeUrl)
```

After that you can use the `ckb` object to generate addresses, send requests, etc.

# RPC

## Basic RPC

Please see [Basic RPC](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-rpc/src/Base.ts#L156)

## Batch Request

```javascript
/**
 * The following batch includes two requests
 *   1. getBlock('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
 *   2. getTransactionsByLockHash('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '0x0', '0x1)
 */
const batch = rpc.createBatchRequest([
  ['getBlock', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
  ['getTransactionsByLockHash', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '0x0', '0x1'],
])

/**
 * Add a request and the batch should include three requests
 *  1. getBlock('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
 *  2. getTransactionsByLockHash('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '0x0', '0x1)
 *  3. getTransactionsByLockHash('0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', '0x0', '0x1)
 */
batch.add(
  'getTransactionsByLockHash',
  '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
  '0x0',
  '0x1',
)

/**
 * Remove a request by index and the batch should include two requests
 *  1. getBlock('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
 *  2. getTransactionsByLockHash('0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', '0x0', '0x1)
 */
batch.remove(1)

/**
 * Send the batch request
 */
batch.exec().then(console.log)
// [
//   { "header": { }, "uncles": [], "transactions": [], "proposals": [] },
//   [ { "consumedBy": { }, "createdBy": { } } ]
// ]

// chaning usage
batch.add().remove().exec()
```

## Persistent Connection

Please add `httpAgent` or `httpsAgent` to enable the persistent connection.

If the SDK is running in Node.js, the following steps make the persistent connection available.

```javascript
// HTTP Agent
const http = require('http')
const httpAgent = new http.Agent({ keepAlive: true })
ckb.rpc.setNode({ httpAgent })

// HTTPS Agent
const https = require('https')
const httpsAgent = new https.Agent({ keepAlive: true })
ckb.rpc.setNode({ httpsAgent })
```

# Errors

1. RPC Errors

The rpc module will throw an error when the result contains an error field, you need to handle it manually.

# Examples

1. [Send Simple Transaction](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendSimpleTransaction.js)
2. [Send All Balance](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendAllBalance.js)
3. [Send Transaction with multiple private key](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendTransactionWithMultiplePrivateKey.js)
4. [Deposit to and withdraw from Nervos DAO](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/nervosDAO.js)
5. [Send Transaction with Lumos Collector](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendTransactionWithLumosCollector.js)

# Development Process

This project used [lerna](https://github.com/lerna/lerna/) for packages management, which needs to be bootstrapped by the following steps:

```sh
$ yarn add lerna --exact --ignore-workspace-root-check # to install the lerna package in this project, could be skipped if the lerna has been installed globally
$ npx lerna bootstrap # install the depedencies and link the packages in the project
$ yarn run tsc # build packages with tsc command
```

After the second step, namely the bootstrap, all module packages are linked together, and used as in one package.
