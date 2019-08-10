# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.18.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.1...v0.18.0) (2019-08-10)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.17.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.0...v0.17.1) (2019-07-29)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.17.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.16.0...v0.17.0) (2019-07-27)


### Features

* **types:** add a new field named 'hash_type' in types of script and cell output ([2692c0a](https://github.com/nervosnetwork/ckb-sdk-js/commit/2692c0a))
* **utils:** update the address format ([74a5ad8](https://github.com/nervosnetwork/ckb-sdk-js/commit/74a5ad8))


### BREAKING CHANGES

* **types:** types of script and cell output changed
* **utils:** update the address format





# [0.16.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.1...v0.16.0) (2019-07-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.15.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.0...v0.15.1) (2019-07-12)


### Features

* **utils:** remove toAddressIdentifier method ([ab1e356](https://github.com/nervosnetwork/ckb-sdk-js/commit/ab1e356))


### BREAKING CHANGES

* **utils:** remove toAddressIdentifier method





# [0.15.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.14.0...v0.15.0) (2019-06-29)


### Features

* **utils:** add signRecoverable method to the ECPair class ([3c1f334](https://github.com/nervosnetwork/ckb-sdk-js/commit/3c1f334))


### BREAKING CHANGES

* **utils:** use signRecoverable instead of sign method to sign the transactions.





# [0.14.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.13.0...v0.14.0) (2019-06-15)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.13.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.12.0...v0.13.0) (2019-06-01)


### Features

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.12.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.11.0...v0.12.0) (2019-05-18)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.11.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.10.0...v0.11.0) (2019-05-14)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-wallet





# [0.10.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.10.0) (2019-05-06)


### Bug Fixes

* **utils:** fix typo of seperator to separator ([b336968](https://github.com/nervosnetwork/ckb-sdk-js/commit/b336968))


### Features

* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([82121b3](https://github.com/nervosnetwork/ckb-sdk-js/commit/82121b3))
* **utils:** parseAddress returns bytes or hex string instead of words ([aaad9c9](https://github.com/nervosnetwork/ckb-sdk-js/commit/aaad9c9))





## [0.9.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.9.1) (2019-04-24)


### Bug Fixes

* **types:** set the type of arg in script to string ([7ea3ad2](https://github.com/nervosnetwork/ckb-sdk-js/commit/7ea3ad2))





# [0.9.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.8.0...v0.9.0) (2019-04-22)


### Bug Fixes

* **utils:** fix typo of seperator to separator ([fd2616c](https://github.com/nervosnetwork/ckb-sdk-js/commit/fd2616c))


### Features

* **types:** update types of script, cell input, cell output ([ee405bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/ee405bb))
* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([79cb24f](https://github.com/nervosnetwork/ckb-sdk-js/commit/79cb24f))
* **utils:** parseAddress returns bytes or hex string instead of words ([2028a6c](https://github.com/nervosnetwork/ckb-sdk-js/commit/2028a6c))


### BREAKING CHANGES

* **types:** script model updated





# [0.8.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.7.0...v0.8.0) (2019-04-08)


# [0.7.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.0.1-alpha.3...v0.7.0) (2019-03-25)

### Features

- **utils:** add type definition of blake2b-wasm ([f2cd199](https://github.com/nervosnetwork/ckb-sdk-js/commit/f2cd199))
- **utils:** repalce-sha3-with-blake2b ([93bddd1](https://github.com/nervosnetwork/ckb-sdk-js/commit/93bddd1))
- **utils:** update blake2b personal to 'ckb-default-hash' and add tests ([5c3bab3](https://github.com/nervosnetwork/ckb-sdk-js/commit/5c3bab3))

### BREAKING CHANGES

- **utils:** update default signature method
