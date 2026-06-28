import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Mode = 'GCM' | 'CBC';
type KeySource = 'password' | 'hex';
type Action = 'encrypt' | 'decrypt';

// 把字符串转 hex
function strToHex(s: string): string {
  return Array.from(s).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}
// hex 转 Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}
// 字节转 base64
function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
// base64 转 Uint8Array
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
// UTF-8 安全的字符串转字节
function strToUtf8Bytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}
// UTF-8 安全的字节转字符串
function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export default function AesTool() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [action, setAction] = useState<Action>('encrypt');
  const [mode, setMode] = useState<Mode>('GCM');
  const [keySource, setKeySource] = useState<KeySource>('password');
  const [password, setPassword] = useState('');
  const [hexKey, setHexKey] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setError('');
    setOutput('');
    try {
      if (!input) {
        setError(isZh ? '请输入文本' : 'Please enter text');
        return;
      }
      // 派生或导入密钥
      let key: CryptoKey;
      if (keySource === 'password') {
        if (!password) {
          setError(isZh ? '请输入密码' : 'Please enter password');
          return;
        }
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const baseKey = await crypto.subtle.importKey(
          'raw', strToUtf8Bytes(password), 'PBKDF2', false, ['deriveKey']
        );
        key = await crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
          baseKey,
          { name: `AES-${mode}`, length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
        if (action === 'encrypt') {
          // 加密:生成随机 IV,密文格式 = base64(salt + iv + ciphertext)
          const ivLen = mode === 'GCM' ? 12 : 16;
          const iv = crypto.getRandomValues(new Uint8Array(ivLen));
          const ct = await crypto.subtle.encrypt(
            { name: `AES-${mode}`, iv },
            key,
            strToUtf8Bytes(input)
          );
          const combined = new Uint8Array(salt.length + iv.length + ct.byteLength);
          combined.set(salt, 0);
          combined.set(iv, salt.length);
          combined.set(new Uint8Array(ct), salt.length + iv.length);
          setOutput(bytesToBase64(combined));
        } else {
          // 解密:从输入解析 salt + iv + ciphertext
          const combined = base64ToBytes(input);
          const ivLen = mode === 'GCM' ? 12 : 16;
          if (combined.length < 16 + ivLen) {
            setError(isZh ? '输入格式无效' : 'Invalid input format');
            return;
          }
          const salt2 = combined.slice(0, 16);
          const iv2 = combined.slice(16, 16 + ivLen);
          const ct2 = combined.slice(16 + ivLen);
          // 用解析出的 salt 重新派生密钥
          const baseKey2 = await crypto.subtle.importKey(
            'raw', strToUtf8Bytes(password), 'PBKDF2', false, ['deriveKey']
          );
          const key2 = await crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt2, iterations: 100000, hash: 'SHA-256' },
            baseKey2,
            { name: `AES-${mode}`, length: 256 },
            false,
            ['decrypt']
          );
          const pt = await crypto.subtle.decrypt(
            { name: `AES-${mode}`, iv: iv2 },
            key2,
            ct2
          );
          setOutput(bytesToUtf8(new Uint8Array(pt)));
        }
      } else {
        // hex 密钥模式:用户直接提供 32 字节 hex(AES-256)
        if (!/^[0-9a-fA-F]{64}$/.test(hexKey.replace(/\s+/g, ''))) {
          setError(isZh ? '密钥需为 64 位 hex(32 字节)' : 'Key must be 64 hex chars (32 bytes)');
          return;
        }
        const rawKey = hexToBytes(hexKey);
        key = await crypto.subtle.importKey(
          'raw', rawKey, { name: `AES-${mode}` }, false, ['encrypt', 'decrypt']
        );
        if (action === 'encrypt') {
          const ivLen = mode === 'GCM' ? 12 : 16;
          const iv = crypto.getRandomValues(new Uint8Array(ivLen));
          const ct = await crypto.subtle.encrypt(
            { name: `AES-${mode}`, iv },
            key,
            strToUtf8Bytes(input)
          );
          const combined = new Uint8Array(iv.length + ct.byteLength);
          combined.set(iv, 0);
          combined.set(new Uint8Array(ct), iv.length);
          setOutput(bytesToBase64(combined));
        } else {
          const combined = base64ToBytes(input);
          const ivLen = mode === 'GCM' ? 12 : 16;
          if (combined.length < ivLen) {
            setError(isZh ? '输入格式无效' : 'Invalid input format');
            return;
          }
          const iv2 = combined.slice(0, ivLen);
          const ct2 = combined.slice(ivLen);
          const pt = await crypto.subtle.decrypt(
            { name: `AES-${mode}`, iv: iv2 },
            key,
            ct2
          );
          setOutput(bytesToUtf8(new Uint8Array(pt)));
        }
      }
    } catch (e) {
      setError(
        action === 'decrypt'
          ? (isZh ? '解密失败:密码/密钥错误或数据损坏' : 'Decryption failed: wrong key/password or corrupted data')
          : (isZh ? '加密失败,请检查输入' : 'Encryption failed, please check input')
      );
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const labelStyle = { color: 'var(--text-muted)' } as const;
  const cardStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  } as const;

  return (
    <div className="flex flex-col gap-4">
      {/* 模式切换 */}
      <div className="flex gap-2 flex-wrap">
        {(['encrypt', 'decrypt'] as Action[]).map(a => (
          <button
            key={a}
            onClick={() => { setAction(a); setOutput(''); setError(''); }}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 animate-bounce-in"
            style={{
              background: action === a ? 'var(--accent)' : 'var(--bg-2)',
              color: action === a ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${action === a ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {a === 'encrypt' ? (isZh ? '加密' : 'Encrypt') : (isZh ? '解密' : 'Decrypt')}
          </button>
        ))}
      </div>

      {/* 算法模式 + 密钥来源 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={labelStyle}>{isZh ? '算法模式' : 'Algorithm Mode'}</span>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as Mode)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={cardStyle}
          >
            <option value="GCM">AES-256-GCM {isZh ? '(推荐,带认证)' : '(recommended, authenticated)'}</option>
            <option value="CBC">AES-256-CBC {isZh ? '(兼容传统)' : '(legacy compatibility)'}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs" style={labelStyle}>{isZh ? '密钥来源' : 'Key Source'}</span>
          <select
            value={keySource}
            onChange={e => setKeySource(e.target.value as KeySource)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={cardStyle}
          >
            <option value="password">{isZh ? '密码派生(PBKDF2)' : 'Password-derived (PBKDF2)'}</option>
            <option value="hex">{isZh ? '直接 hex 密钥(32 字节)' : 'Direct hex key (32 bytes)'}</option>
          </select>
        </label>
      </div>

      {/* 密钥输入 */}
      {keySource === 'password' ? (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {isZh ? '密码' : 'Password'}
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={isZh ? '输入加密密码...' : 'Enter password...'}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={cardStyle}
          />
          <p className="text-[10px] mt-1" style={labelStyle}>
            {isZh ? '用 PBKDF2 算法(10 万次迭代 + SHA-256)派生 256 位密钥,salt 随机生成并嵌入密文。' : 'Derives a 256-bit key via PBKDF2 (100,000 iterations + SHA-256); random salt is embedded in ciphertext.'}
          </p>
        </div>
      ) : (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {isZh ? 'Hex 密钥(64 字符)' : 'Hex Key (64 chars)'}
          </label>
          <input
            type="text"
            value={hexKey}
            onChange={e => setHexKey(e.target.value)}
            placeholder="e.g. 603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4"
            className="w-full px-3 py-2 rounded-lg text-sm font-mono outline-none"
            style={cardStyle}
          />
          <p className="text-[10px] mt-1" style={labelStyle}>
            {isZh ? '直接提供 32 字节(256 位)AES 密钥的十六进制表示。' : 'Provide a 32-byte (256-bit) AES key in hexadecimal.'}
          </p>
        </div>
      )}

      {/* 输入文本 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {action === 'encrypt' ? (isZh ? '明文' : 'Plaintext') : (isZh ? '密文(Base64)' : 'Ciphertext (Base64)')}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={
            action === 'encrypt'
              ? (isZh ? '输入要加密的文本...' : 'Enter text to encrypt...')
              : (isZh ? '粘贴 base64 密文...' : 'Paste base64 ciphertext...')
          }
          className="w-full h-28 rounded-lg p-3 font-mono text-sm outline-none resize-y"
          style={cardStyle}
        />
      </div>

      {/* 执行按钮 */}
      <button
        onClick={run}
        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 w-fit"
        style={{ background: 'var(--accent)' }}
      >
        {action === 'encrypt' ? (isZh ? '加密' : 'Encrypt') : (isZh ? '解密' : 'Decrypt')}
      </button>

      {/* 错误 */}
      {error && (
        <div className="rounded-lg p-3 text-sm" style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* 输出 */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium" style={labelStyle}>
              {action === 'encrypt' ? (isZh ? '密文(Base64)' : 'Ciphertext (Base64)') : (isZh ? '明文' : 'Plaintext')}
            </label>
            <button
              onClick={copy}
              className="px-2 py-1 rounded text-xs transition-colors"
              style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}
            >
              {copied ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制' : 'Copy')}
            </button>
          </div>
          <div className="rounded-lg p-3 font-mono text-sm break-all whitespace-pre-wrap" style={cardStyle}>
            {output}
          </div>
        </div>
      )}

      {/* 说明 */}
      <div className="text-[10px] rounded-lg p-3" style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}>
        {isZh ? (
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>实现说明:</p>
            <p>• 使用浏览器原生 Web Crypto API,密钥永不离开浏览器</p>
            <p>• GCM 模式 IV 12 字节,CBC 模式 IV 16 字节,均随机生成</p>
            <p>• 密码模式:密文格式 = base64(salt[16] + iv + ciphertext),salt 嵌入密文</p>
            <p>• Hex 模式:密文格式 = base64(iv + ciphertext)</p>
            <p>• 推荐 GCM(带认证,可检测篡改),CBC 仅用于兼容旧系统</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Implementation Notes:</p>
            <p>• Uses native Web Crypto API; keys never leave the browser</p>
            <p>• GCM IV is 12 bytes, CBC IV is 16 bytes, both randomly generated</p>
            <p>• Password mode: ciphertext = base64(salt[16] + iv + ciphertext), salt embedded</p>
            <p>• Hex mode: ciphertext = base64(iv + ciphertext)</p>
            <p>• GCM is recommended (authenticated, tamper-detecting); CBC only for legacy compat</p>
          </div>
        )}
      </div>
    </div>
  );
}
