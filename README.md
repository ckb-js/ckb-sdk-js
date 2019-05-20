# CKB SDK JavaScript

| Service  | Master                                                                                                                                                   | Develop                                                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Travis   | [![Build Status](https://travis-ci.com/nervosnetwork/ckb-sdk-js.svg?branch=master)](https://travis-ci.com/nervosnetwork/ckb-sdk-js)                      | [![Build Status](https://travis-ci.com/nervosnetwork/ckb-sdk-js.svg?branch=develop)](https://travis-ci.com/nervosnetwork/ckb-sdk-js)                       |
| Coverage | [![Codecov](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/master/graph/badge.svg)](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/master) | [![Codecov](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/develop/graph/badge.svg)](https://codecov.io/gh/nervosnetwork/ckb-sdk-js/branch/develop) |

[![NPM](https://img.shields.io/npm/v/@nervosnetwork/ckb-sdk-core/latest.svg)](https://www.npmjs.com/package/@nervosnetwork/ckb-sdk-core)
[![Telegram Group](https://cdn.rawgit.com/Patrolavia/telegram-badge/8fe3382b/chat.svg)](https://t.me/nervos_ckb_dev)
![License](https://img.shields.io/npm/l/@nervosnetwork/ckb-sdk-core.svg)

JavaScript SDK for Nervos [CKB](https://github.com/nervosnetwork/ckb).

<details>
<summary>ToC</summary>
<p>

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Modules](#modules)
- [CORE](#core)
- [RPC](#rpc)
- [Errors](#errors)
- [Related Projects](#related-projects)

<p>
</details>

---

# Introduction

`@nervosnetwork/ckb-sdk-core` is the SDK used to interact with [Nervos CKB](https://github.com/nervosnetwork/ckb), which is an open source project of public blockchain.

## Before everything

Due to safety concern, the SDK won’t generate private keys for you. You can use `openssl` to generate a private key:

```sh
$ openssl rand 32 -hex
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
  Address <a href="https://github.com/nervosnetwork/ckb-sdk-js/tree/develop/packages/ckb-sdk-address" alt="address">Code</a>
</summary>
<dd>

Used to create an address object, whose value is the address we are going to use.

Default `address algorithm` is the `pubkeyToAddress` in utils module, which generates address in bech32 format.

Default rule to generate the address from a public key is:

- Blake160(public key): blake2b(public key) then trauncate it for fist 20 bytes.
- Specify options used: Address Type, Address Bin Index, Prefix. The options will be explained in an RFC.
- Bech32 the blake160ed public key with specified options: bech32Address(blake160Pubkey, {prefix, type, binIndex})

</dd>
</details>

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
const CKBCore = require('@nervosnetwork/ckb-sdk-core').default

const nodeUrl = 'http://localhost:8114'

const core = new CKBCore(nodeUrl)
```

After that you can use the `core` object to generate addresses, send requests, etc.

# RPC

Please see [Default RPC](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-rpc/src/defaultRPC.ts#L107)

# Errors

1. RPC Errors

The rpc module will throw an error when the result contains an error field, you need to handle it manually.

# Examples

1. [Send Transaction](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendTransaction.js)

# Development Process

This project used [lerna](https://github.com/lerna/lerna/) for packages management, which needs to be bootstrapped by the following steps:

```sh
$ yarn install # to install the lerna package in this project, could be skipped if the lerna has been installed globally
$ lerna bootstrap # install the depedencies and link the packages in the project
$ npm run tsc # build packages with tsc command
```

After the second step, namely the bootstrap, all module packages are linked together, and used as in one package.