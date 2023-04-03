import blake2b from './blake2b'
import { hexToBytes } from '../convertors'
import { PERSONAL } from '../const'

export declare interface Blake160 {
  (data: Uint8Array | string): Uint8Array
  (data: Uint8Array | string, encode: 'binary'): Uint8Array
  (data: Uint8Array | string, encode: 'hex'): string
  (data: Uint8Array | string, encode: 'binary' | 'hex'): Uint8Array | string
}
/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/lumos.html#utils @ckb-lumos/lumos/utils} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#blake160 example}
 */
export const blake160: Blake160 = (data: Uint8Array | string, encode: 'binary' | 'hex' = 'binary'): any => {
  const formattedData = typeof data === 'string' ? hexToBytes(data) : data
  const s = blake2b(32, null, null, PERSONAL)
  s.update(formattedData)
  return s.digest(encode).slice(0, encode === 'binary' ? 20 : 40)
}

export default blake160
