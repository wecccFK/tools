import { sm4CbcEncrypt, sm4CbcDecrypt } from './sm-crypto';

export type SymMode = 'GCM' | 'CBC' | 'SM4-CBC';
export type SymKeySource = 'password' | 'hex';

export const V2_PREFIX = 'v2:';
const PBKDF2_ITERATIONS = 600_000;
const ALG_ID: Record<SymMode, number> = { GCM: 1, CBC: 2, 'SM4-CBC': 3 };
const ALG_NAME: Record<number, string> = { 1: 'AES-GCM', 2: 'AES-CBC', 3: 'SM4-CBC' };

export type SymErrorCode =
  | 'missing-text'
  | 'missing-password'
  | 'invalid-hex'
  | 'old-format'
  | 'invalid-format'
  | 'mode-mismatch'
  | 'key-source-mismatch'
  | 'auth-failed'
  | 'decrypt-failed'
  | 'encrypt-failed';

export class SymmetricError extends Error {
  code: SymErrorCode;
  detail?: string;

  constructor(code: SymErrorCode, detail?: string) {
    super(code);
    this.code = code;
    this.detail = detail;
  }
}

export interface SymmetricInput {
  text: string;
  mode: SymMode;
  keySource: SymKeySource;
  password: string;
  hexKey: string;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}
function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function strToUtf8Bytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}
function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}
function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}
// WebCrypto 在当前 TS 的 BufferSource 类型下不接受 Uint8Array<ArrayBufferLike> 泛型
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const out = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(out).set(bytes);
  return out;
}
async function deriveKeyMaterial(password: string, salt: Uint8Array, bits: number): Promise<Uint8Array> {
  const baseKey = await crypto.subtle.importKey(
    'raw', toArrayBuffer(strToUtf8Bytes(password)), 'PBKDF2', false, ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: toArrayBuffer(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    bits
  );
  return new Uint8Array(derived);
}
async function importHmacKey(raw: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', toArrayBuffer(raw), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function deriveHmacKeyFromRaw(raw: Uint8Array): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    toArrayBuffer(concatBytes(raw, strToUtf8Bytes('momo-symmetric-v2-mac')))
  );
  return importHmacKey(new Uint8Array(digest));
}

function validate(input: SymmetricInput) {
  if (!input.text) throw new SymmetricError('missing-text');
  if (input.keySource === 'password') {
    if (!input.password) throw new SymmetricError('missing-password');
    return;
  }
  const hex = input.hexKey.replace(/\s+/g, '');
  const need = input.mode === 'SM4-CBC' ? 32 : 64;
  if (!new RegExp(`^[0-9a-fA-F]{${need}}$`).test(hex)) {
    throw new SymmetricError('invalid-hex', input.mode === 'SM4-CBC' ? 'SM4' : 'AES');
  }
}

export async function encryptText(input: SymmetricInput): Promise<string> {
  validate(input);
  const { mode, keySource, password, hexKey, text } = input;
  const isPassword = keySource === 'password';
  const salt = isPassword ? crypto.getRandomValues(new Uint8Array(16)) : new Uint8Array(0);
  const ivLen = mode === 'GCM' ? 12 : 16;
  const iv = crypto.getRandomValues(new Uint8Array(ivLen));
  // header: [flags, algId, salt?, iv]；flags bit0 = 密码派生, bit1 = 带 HMAC
  const flags = (isPassword ? 1 : 0) | (mode === 'GCM' ? 0 : 2);
  const meta = concatBytes(Uint8Array.from([flags, ALG_ID[mode]]), salt, iv);
  const pt = strToUtf8Bytes(text);

  let ct: Uint8Array;
  let tag: Uint8Array | null = null;

  if (mode === 'GCM') {
    const rawKey = isPassword ? await deriveKeyMaterial(password, salt, 256) : hexToBytes(hexKey);
    const key = await crypto.subtle.importKey('raw', toArrayBuffer(rawKey), { name: 'AES-GCM' }, false, ['encrypt']);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: toArrayBuffer(iv), additionalData: toArrayBuffer(meta) },
      key,
      toArrayBuffer(pt)
    );
    ct = new Uint8Array(encrypted);
  } else if (mode === 'CBC') {
    const material = isPassword ? await deriveKeyMaterial(password, salt, 512) : hexToBytes(hexKey);
    const macKey = isPassword ? await importHmacKey(material.slice(32, 64)) : await deriveHmacKeyFromRaw(material);
    const key = await crypto.subtle.importKey(
      'raw', toArrayBuffer(material.slice(0, 32)), { name: 'AES-CBC' }, false, ['encrypt']
    );
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: toArrayBuffer(iv) }, key, toArrayBuffer(pt)
    );
    ct = new Uint8Array(encrypted);
    tag = new Uint8Array(await crypto.subtle.sign('HMAC', macKey, toArrayBuffer(concatBytes(meta, ct))));
  } else {
    const material = isPassword ? await deriveKeyMaterial(password, salt, 512) : hexToBytes(hexKey);
    const macKey = isPassword ? await importHmacKey(material.slice(32, 64)) : await deriveHmacKeyFromRaw(material);
    ct = sm4CbcEncrypt(pt, material.slice(0, 16), iv);
    tag = new Uint8Array(await crypto.subtle.sign('HMAC', macKey, toArrayBuffer(concatBytes(meta, ct))));
  }

  return V2_PREFIX + bytesToBase64(concatBytes(meta, ct, tag ?? new Uint8Array(0)));
}

export async function decryptText(input: SymmetricInput): Promise<string> {
  validate(input);
  const { mode, keySource, password, hexKey, text } = input;
  const isPassword = keySource === 'password';
  const trimmed = text.trim();
  if (!trimmed.startsWith(V2_PREFIX)) throw new SymmetricError('old-format');

  let payload: Uint8Array;
  try {
    payload = base64ToBytes(trimmed.slice(V2_PREFIX.length).replace(/\s+/g, ''));
  } catch {
    throw new SymmetricError('invalid-format');
  }
  if (payload.length < 32) throw new SymmetricError('invalid-format');

  const flags = payload[0];
  const algId = payload[1];
  const hasSalt = (flags & 1) === 1;
  const hasMac = (flags & 2) === 2;

  if (algId !== ALG_ID[mode]) throw new SymmetricError('mode-mismatch', ALG_NAME[algId] || 'unknown');
  if (hasSalt !== isPassword) throw new SymmetricError('key-source-mismatch', hasSalt ? 'password' : 'hex');
  if (hasMac !== (mode !== 'GCM')) throw new SymmetricError('invalid-format');

  const saltLen = hasSalt ? 16 : 0;
  const ivLen = mode === 'GCM' ? 12 : 16;
  const tagLen = hasMac ? 32 : 0;
  if (payload.length < 2 + saltLen + ivLen + tagLen + 1) throw new SymmetricError('invalid-format');

  const salt = payload.slice(2, 2 + saltLen);
  const iv = payload.slice(2 + saltLen, 2 + saltLen + ivLen);
  const meta = payload.slice(0, 2 + saltLen + ivLen);
  const ct = payload.slice(2 + saltLen + ivLen, payload.length - tagLen);

  try {
    if (mode === 'GCM') {
      const rawKey = isPassword ? await deriveKeyMaterial(password, salt, 256) : hexToBytes(hexKey);
      const key = await crypto.subtle.importKey('raw', toArrayBuffer(rawKey), { name: 'AES-GCM' }, false, ['decrypt']);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: toArrayBuffer(iv), additionalData: toArrayBuffer(meta) },
        key,
        toArrayBuffer(ct)
      );
      return bytesToUtf8(new Uint8Array(decrypted));
    }

    const material = isPassword ? await deriveKeyMaterial(password, salt, 512) : hexToBytes(hexKey);
    const macKey = isPassword ? await importHmacKey(material.slice(32, 64)) : await deriveHmacKeyFromRaw(material);
    const tag = payload.slice(payload.length - tagLen);
    const valid = await crypto.subtle.verify(
      'HMAC', macKey, toArrayBuffer(tag), toArrayBuffer(concatBytes(meta, ct))
    );
    if (!valid) throw new SymmetricError('auth-failed');

    if (mode === 'CBC') {
      const key = await crypto.subtle.importKey(
        'raw', toArrayBuffer(material.slice(0, 32)), { name: 'AES-CBC' }, false, ['decrypt']
      );
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: toArrayBuffer(iv) }, key, toArrayBuffer(ct)
      );
      return bytesToUtf8(new Uint8Array(decrypted));
    }
    return bytesToUtf8(sm4CbcDecrypt(ct, material.slice(0, 16), iv));
  } catch (e) {
    if (e instanceof SymmetricError) throw e;
    throw new SymmetricError('decrypt-failed');
  }
}
