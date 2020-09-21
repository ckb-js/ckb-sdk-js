/**
 * @summary System scripts are the smart contracts built and deployed by the CKB core team.
 *          System scripts complement the function of CKB in a flexible way.
 *          System scripts can provide
 *          -  core functions (e.g. secp256k1/blake160 and Nervos DAO),
 *          -  shared standard implementations (e.g. Simple UDT),
 *          -  or other auxiliary infrastructure components.
 * @see https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-system-script-list/0024-ckb-system-script-list.md
 */
interface SystemScript extends Omit<CKBComponents.Script, 'args'> {
  depType: CKBComponents.DepType
}

type OutPoints = Record<'mainnetOutPoint' | 'testnetOutPoint', CKBComponents.OutPoint>

/**
 * @memberof System Scripts
 * @typedef {Lock Script}
 * @name SECP256K1_BLAKE160
 * @description SECP256K1_BLAKE160 is the default lock script to verify CKB transaction signature
 */
export const SECP256K1_BLAKE160: SystemScript & OutPoints = {
  codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  hashType: 'type',
  depType: 'depGroup',
  mainnetOutPoint: {
    txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
    index: '0x0',
  },
  testnetOutPoint: {
    txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
    index: '0x0',
  },
}

/**
 * @memberof System Scripts
 * @typedef {Lock Script}
 * @name SECP256K1_MULTISIG
 * @description SECP256K1_MULTISIG is a script which allows a group of users to sign a single transaction
 */
export const SECP256K1_MULTISIG: SystemScript & OutPoints = {
  codeHash: '0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8',
  hashType: 'type',
  depType: 'depGroup',
  mainnetOutPoint: {
    txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
    index: '0x1',
  },
  testnetOutPoint: {
    txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
    index: '0x1',
  },
}

/**
 * @memberof System Scripts
 * @typedef {Lock Script}
 * @name ANYONE_CAN_PAY
 * @description ANYONE_CAN_PAY allows a recipient to provide cell capacity in asset transfer
 */
export const ANYONE_CAN_PAY: SystemScript & Pick<OutPoints, 'testnetOutPoint'> = {
  codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
  hashType: 'type',
  depType: 'depGroup',
  testnetOutPoint: {
    txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
    index: '0x0',
  },
}

/**
 * @memberof System Scripts
 * @typedef {Type Script}
 * @name NERVOS_DAO
 * @description NERVOS_DAO is the script implements Nervos DAO
 */
export const NERVOS_DAO: SystemScript & OutPoints = {
  codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
  hashType: 'type',
  depType: 'code',
  mainnetOutPoint: {
    txHash: '0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c',
    index: '0x2',
  },
  testnetOutPoint: {
    txHash: '0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f',
    index: '0x2',
  },
}

/**
 * @memberof System Scripts
 * @typedef {Type Script}
 * @name SIMPLE_UDT
 * @description SIMPLE_UDT implements the minimum standard for user defined tokens on Nervos CKB
 */
export const SIMPLE_UDT: SystemScript & Pick<OutPoints, 'testnetOutPoint'> = {
  codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
  hashType: 'data',
  depType: 'code',
  testnetOutPoint: {
    txHash: '0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958',
    index: '0x0',
  },
}
