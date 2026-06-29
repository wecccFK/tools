/**
 * 国密算法纯 JS 实现
 * - SM3: 密码杂凑算法(GB/T 32905-2016),256 位输出
 * - SM4: 分组密码算法(GB/T 32907-2016),128 位分组,ECB/CBC 模式
 *
 * 完全本地计算,不依赖任何第三方库。
 */

// ============================================================
// SM3 实现
// ============================================================
// 参考: GM/T 0004-2012 / GB/T 32905-2016

// 32 位循环左移
function rotl32(x: number, n: number): number {
  n = n & 0x1f;
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

// T_j 常量
function sm3Tj(j: number): number {
  return j < 16 ? 0x79cc4519 : 0x7a879d8a;
}

// 布尔函数 FF
function sm3FF(j: number, x: number, y: number, z: number): number {
  if (j < 16) return (x ^ y ^ z) >>> 0;
  return ((x & y) | (x & z) | (y & z)) >>> 0;
}

// 布尔函数 GG
function sm3GG(j: number, x: number, y: number, z: number): number {
  if (j < 16) return (x ^ y ^ z) >>> 0;
  return ((x & y) | (~x & z)) >>> 0;
}

// 置换函数 P0/P1
function sm3P0(x: number): number {
  return (x ^ rotl32(x, 9) ^ rotl32(x, 17)) >>> 0;
}
function sm3P1(x: number): number {
  return (x ^ rotl32(x, 15) ^ rotl32(x, 23)) >>> 0;
}

// 消息扩展 + 压缩函数(对单个 512-bit 块)
function sm3Compress(V: Uint32Array, block: Uint32Array): Uint32Array {
  // 消息扩展 W[0..67], W'[0..63]
  const W = new Uint32Array(68);
  const W1 = new Uint32Array(64);
  for (let i = 0; i < 16; i++) W[i] = block[i];
  for (let i = 16; i < 68; i++) {
    W[i] = (sm3P1(W[i - 16] ^ W[i - 9] ^ rotl32(W[i - 3], 15)) ^ rotl32(W[i - 13], 7) ^ W[i - 6]) >>> 0;
  }
  for (let i = 0; i < 64; i++) {
    W1[i] = (W[i] ^ W[i + 4]) >>> 0;
  }

  let A = V[0], B = V[1], C = V[2], D = V[3];
  let E = V[4], F = V[5], G = V[6], H = V[7];

  for (let j = 0; j < 64; j++) {
    const SS1 = rotl32((rotl32(A, 12) + E + rotl32(sm3Tj(j), j)) >>> 0, 7);
    const SS2 = (SS1 ^ rotl32(A, 12)) >>> 0;
    const TT1 = (sm3FF(j, A, B, C) + D + SS2 + W1[j]) >>> 0;
    const TT2 = (sm3GG(j, E, F, G) + H + SS1 + W[j]) >>> 0;
    D = C;
    C = rotl32(B, 9);
    B = A;
    A = TT1;
    H = G;
    G = rotl32(F, 19);
    F = E;
    E = sm3P0(TT2);
  }

  const result = new Uint32Array(8);
  result[0] = (A ^ V[0]) >>> 0;
  result[1] = (B ^ V[1]) >>> 0;
  result[2] = (C ^ V[2]) >>> 0;
  result[3] = (D ^ V[3]) >>> 0;
  result[4] = (E ^ V[4]) >>> 0;
  result[5] = (F ^ V[5]) >>> 0;
  result[6] = (G ^ V[6]) >>> 0;
  result[7] = (H ^ V[7]) >>> 0;
  return result;
}

// SM3 主函数
export function sm3(data: Uint8Array): Uint8Array {
  // 初始 IV
  let V = new Uint32Array([
    0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600,
    0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e,
  ]);

  // 填充
  const msgLen = data.length;
  const bitLen = msgLen * 8;
  // 填充 1 + 0...0 + 长度(64 位)
  // 填充后长度为 64 的倍数
  const padLen = 64 - ((msgLen + 9) % 64);
  const totalLen = msgLen + 9 + (padLen === 64 ? 0 : padLen);

  const padded = new Uint8Array(totalLen);
  padded.set(data);
  padded[msgLen] = 0x80; // 填充 1
  // 末尾 8 字节为 bit 长度(大端)
  // JavaScript 位运算精度问题,用 BigInt 处理高 32 位
  const high = Math.floor(bitLen / 0x100000000);
  const low = bitLen >>> 0;
  const dv = new DataView(padded.buffer);
  dv.setUint32(totalLen - 8, high >>> 0);
  dv.setUint32(totalLen - 4, low);

  // 分块处理
  for (let i = 0; i < totalLen; i += 64) {
    const block = new Uint32Array(16);
    const blockView = new DataView(padded.buffer, i, 64);
    for (let j = 0; j < 16; j++) {
      block[j] = blockView.getUint32(j * 4);
    }
    V = sm3Compress(V, block);
  }

  // 输出 32 字节
  const result = new Uint8Array(32);
  const resultView = new DataView(result.buffer);
  for (let i = 0; i < 8; i++) {
    resultView.setUint32(i * 4, V[i]);
  }
  return result;
}

export function sm3Hex(data: Uint8Array): string {
  const bytes = sm3(data);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// ============================================================
// SM4 实现
// ============================================================
// 参考: GB/T 32907-2016

// S 盒
const SM4_SBOX = new Uint8Array([
  0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05,
  0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99,
  0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62,
  0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6,
  0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8,
  0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35,
  0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87,
  0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e,
  0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1,
  0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3,
  0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f,
  0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51,
  0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8,
  0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0,
  0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84,
  0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48,
]);

// FK 系数
const SM4_FK = new Uint32Array([0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc]);

// CK 系数
const SM4_CK = new Uint32Array([
  0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269,
  0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9,
  0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249,
  0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9,
  0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229,
  0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299,
  0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209,
  0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279,
]);

// 32 位循环左移
function rotl32x(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

// τ 变换:每个字节过 S 盒
function tauTransform(a: number): number {
  return (
    (SM4_SBOX[(a >>> 24) & 0xff] << 24) |
    (SM4_SBOX[(a >>> 16) & 0xff] << 16) |
    (SM4_SBOX[(a >>> 8) & 0xff] << 8) |
    SM4_SBOX[a & 0xff]
  ) >>> 0;
}

// L 线性变换(加密)
function LTransform(b: number): number {
  return (b ^ rotl32x(b, 2) ^ rotl32x(b, 10) ^ rotl32x(b, 18) ^ rotl32x(b, 24)) >>> 0;
}

// L' 线性变换(密钥扩展)
function LPrimeTransform(b: number): number {
  return (b ^ rotl32x(b, 13) ^ rotl32x(b, 23)) >>> 0;
}

// T 合成变换(加密)
function TTransform(x: number): number {
  return LTransform(tauTransform(x));
}

// T' 合成变换(密钥扩展)
function TPrimeTransform(x: number): number {
  return LPrimeTransform(tauTransform(x));
}

// 密钥扩展:16 字节主密钥 → 32 个轮密钥
function sm4KeyExpansion(key: Uint8Array): Uint32Array {
  if (key.length !== 16) throw new Error('SM4 key must be 16 bytes (128 bits)');

  const mk = new Uint32Array(4);
  const dv = new DataView(key.buffer, key.byteOffset, 16);
  for (let i = 0; i < 4; i++) mk[i] = dv.getUint32(i * 4);

  const k = new Uint32Array(36);
  for (let i = 0; i < 4; i++) k[i] = (mk[i] ^ SM4_FK[i]) >>> 0;

  const rk = new Uint32Array(32);
  for (let i = 0; i < 32; i++) {
    k[i + 4] = (k[i] ^ TPrimeTransform((k[i + 1] ^ k[i + 2] ^ k[i + 3] ^ SM4_CK[i])) ^ rk[i]) >>> 0;
    // 修正:根据 GB/T 32907-2016,实际公式是
    // rk[i] = k[i+4] = k[i] ^ T'(k[i+1] ^ k[i+2] ^ k[i+3] ^ CK[i])
    rk[i] = (k[i] ^ TPrimeTransform((k[i + 1] ^ k[i + 2] ^ k[i + 3] ^ SM4_CK[i]) >>> 0)) >>> 0;
    k[i + 4] = rk[i];
  }
  return rk;
}

// 单块加密(16 字节)
function sm4EncryptBlock(input: Uint8Array, rk: Uint32Array): Uint8Array {
  if (input.length !== 16) throw new Error('SM4 block must be 16 bytes');

  const x = new Uint32Array(36);
  const dv = new DataView(input.buffer, input.byteOffset, 16);
  for (let i = 0; i < 4; i++) x[i] = dv.getUint32(i * 4);

  for (let i = 0; i < 32; i++) {
    x[i + 4] = (x[i] ^ TTransform((x[i + 1] ^ x[i + 2] ^ x[i + 3] ^ rk[i]) >>> 0)) >>> 0;
  }

  // 反序变换 R
  const output = new Uint8Array(16);
  const outView = new DataView(output.buffer);
  outView.setUint32(0, x[35]);
  outView.setUint32(4, x[34]);
  outView.setUint32(8, x[33]);
  outView.setUint32(12, x[32]);
  return output;
}

// 单块解密(轮密钥逆序)
function sm4DecryptBlock(input: Uint8Array, rk: Uint32Array): Uint8Array {
  const reversedRk = new Uint32Array(32);
  for (let i = 0; i < 32; i++) reversedRk[i] = rk[31 - i];
  return sm4EncryptBlock(input, reversedRk);
}

// PKCS#7 填充
function pkcs7Pad(data: Uint8Array): Uint8Array {
  const padLen = 16 - (data.length % 16);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  for (let i = data.length; i < padded.length; i++) padded[i] = padLen;
  return padded;
}

function pkcs7Unpad(data: Uint8Array): Uint8Array {
  if (data.length === 0 || data.length % 16 !== 0) {
    throw new Error('Invalid PKCS#7 padding: invalid length');
  }
  const padLen = data[data.length - 1];
  if (padLen < 1 || padLen > 16) {
    throw new Error('Invalid PKCS#7 padding: invalid pad length');
  }
  for (let i = data.length - padLen; i < data.length; i++) {
    if (data[i] !== padLen) throw new Error('Invalid PKCS#7 padding: inconsistent bytes');
  }
  return data.slice(0, data.length - padLen);
}

// 异或
function xorBlocks(a: Uint8Array, b: Uint8Array, len: number = 16): Uint8Array {
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = a[i] ^ b[i];
  return out;
}

// ECB 模式加密
export function sm4EcbEncrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  const rk = sm4KeyExpansion(key);
  const padded = pkcs7Pad(data);
  const result = new Uint8Array(padded.length);
  for (let i = 0; i < padded.length; i += 16) {
    const block = padded.slice(i, i + 16);
    const encrypted = sm4EncryptBlock(block, rk);
    result.set(encrypted, i);
  }
  return result;
}

// ECB 模式解密
export function sm4EcbDecrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (data.length % 16 !== 0) throw new Error('SM4 ECB decrypt: data length must be multiple of 16');
  const rk = sm4KeyExpansion(key);
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i += 16) {
    const block = data.slice(i, i + 16);
    const decrypted = sm4DecryptBlock(block, rk);
    result.set(decrypted, i);
  }
  return pkcs7Unpad(result);
}

// CBC 模式加密
export function sm4CbcEncrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  if (iv.length !== 16) throw new Error('SM4 IV must be 16 bytes');
  const rk = sm4KeyExpansion(key);
  const padded = pkcs7Pad(data);
  const result = new Uint8Array(padded.length);
  let prev = iv;
  for (let i = 0; i < padded.length; i += 16) {
    const block = padded.slice(i, i + 16);
    const xored = xorBlocks(block, prev);
    const encrypted = sm4EncryptBlock(xored, rk);
    result.set(encrypted, i);
    prev = encrypted;
  }
  return result;
}

// CBC 模式解密
export function sm4CbcDecrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  if (iv.length !== 16) throw new Error('SM4 IV must be 16 bytes');
  if (data.length % 16 !== 0) throw new Error('SM4 CBC decrypt: data length must be multiple of 16');
  const rk = sm4KeyExpansion(key);
  const result = new Uint8Array(data.length);
  let prev = iv;
  for (let i = 0; i < data.length; i += 16) {
    const block = data.slice(i, i + 16);
    const decrypted = sm4DecryptBlock(block, rk);
    const xored = xorBlocks(decrypted, prev);
    result.set(xored, i);
    prev = block;
  }
  return pkcs7Unpad(result);
}

// ============================================================
// 工具函数
// ============================================================

// hex 字符串 → Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, '').replace(/0x/gi, '');
  if (clean.length % 2 !== 0) throw new Error('Invalid hex string');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

// Uint8Array → hex 字符串
export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// UTF-8 字符串 → Uint8Array
export function strToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Uint8Array → UTF-8 字符串
export function bytesToStr(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

// Base64 编解码(Uint8Array)
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
