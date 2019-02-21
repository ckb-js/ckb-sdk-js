# `ckb-utils`

> TODO: description

## Usage

```
const ckbUtils = require('ckb-utils');

// TODO: DEMONSTRATE API
```

## Troubleshooting

### Failed due to `tiny-secp256k1`

> dyld: lazy symbol binding failed: Symbol not found: \_\_ZN2v811HandleScope12CreateHandleEPNS_8internal10HeapObjectEPNS1_6ObjectE
> Referenced from: /path/to/neuron/node_modules/tiny-secp256k1/build/Release/secp256k1.node
> Expected in: flat namespace

This comes with different node version on building, `npm rebuild tiny-secp256k1` in this package to fix it.
