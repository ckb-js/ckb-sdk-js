# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.10.0](https://github.com/keith-cy/ckb-sdk-js/compare/v0.9.0...v0.10.0) (2019-05-06)


### Bug Fixes

* **utils:** fix typo of seperator to separator ([b336968](https://github.com/keith-cy/ckb-sdk-js/commit/b336968))
* **utils:** fix typo of seperator to separator ([3e09f28](https://github.com/keith-cy/ckb-sdk-js/commit/3e09f28))


### Features

* **types:** add field of validSince in cell input of a transaction ([54770fc](https://github.com/keith-cy/ckb-sdk-js/commit/54770fc))
* **types:** add field of validSince in cell input of a transaction ([4480a0b](https://github.com/keith-cy/ckb-sdk-js/commit/4480a0b))
* **types:** remove cellbase id from block header, remove cellbase from uncle block ([96a1f53](https://github.com/keith-cy/ckb-sdk-js/commit/96a1f53))
* **types:** update ckb-types ([e6af3b5](https://github.com/keith-cy/ckb-sdk-js/commit/e6af3b5))
* **types:** update ckb-types ([654ab98](https://github.com/keith-cy/ckb-sdk-js/commit/654ab98))
* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([82121b3](https://github.com/keith-cy/ckb-sdk-js/commit/82121b3))
* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([a57cdc4](https://github.com/keith-cy/ckb-sdk-js/commit/a57cdc4))
* **utils:** parseAddress returns bytes or hex string instead of words ([aaad9c9](https://github.com/keith-cy/ckb-sdk-js/commit/aaad9c9))
* **utils:** parseAddress returns bytes or hex string instead of words ([9cbe7be](https://github.com/keith-cy/ckb-sdk-js/commit/9cbe7be))


### BREAKING CHANGES

* **types:** replace type of u64 with type of string in ckb-types, remove version field from script interface
* **types:** rpc interface updated, add field of validSince in cell input of a transaction
* **types:** replace type of u64 with type of string in ckb-types, remove version field from script interface
* **types:** rpc interface updated, add field of validSince in cell input of a transaction
* **types:** block header and uncle block in rpc updated





# [0.9.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.8.0...v0.9.0) (2019-04-22)


### Features

* **rpc:** add segrated witnesses ([bc8339f](https://github.com/nervosnetwork/ckb-sdk-js/commit/bc8339f))
* **types:** update types of script, cell input, cell output ([ee405bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/ee405bb))
* **types:** remove cellbase id from block header, remove cellbase from uncle block ([de9f50d](https://github.com/nervosnetwork/ckb-sdk-js/commit/de9f50d))
* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([79cb24f](https://github.com/nervosnetwork/ckb-sdk-js/commit/79cb24f))
* **utils:** parseAddress returns bytes or hex string instead of words ([2028a6c](https://github.com/nervosnetwork/ckb-sdk-js/commit/2028a6c))
* **wallet:** remove udt account ([7e3cf6d](https://github.com/nervosnetwork/ckb-sdk-js/commit/7e3cf6d))


### BREAKING CHANGES

* **types:** block header and uncle block in rpc updated
* **types:** script model updated





# [0.8.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.7.0...v0.8.0) (2019-04-08)


# [0.7.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.0.1-alpha.3...v0.7.0) (2019-03-25)


### Features

* **account:** remove all udt scripts ([9b0f54b](https://github.com/nervosnetwork/ckb-sdk-js/commit/9b0f54b))
* **utils:** add type definition of blake2b-wasm ([f2cd199](https://github.com/nervosnetwork/ckb-sdk-js/commit/f2cd199))
* **utils:** repalce-sha3-with-blake2b ([93bddd1](https://github.com/nervosnetwork/ckb-sdk-js/commit/93bddd1))
* **utils:** update blake2b personal to 'ckb-default-hash' and add tests ([5c3bab3](https://github.com/nervosnetwork/ckb-sdk-js/commit/5c3bab3))
* **wallet:** remove unlock.rb, use c script instead ([3520208](https://github.com/nervosnetwork/ckb-sdk-js/commit/3520208))


### BREAKING CHANGES

* **utils:** update default signature method
