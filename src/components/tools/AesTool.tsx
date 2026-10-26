import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  decryptText,
  encryptText,
  SymmetricError,
  type SymKeySource,
  type SymMode,
} from '../../utils/symmetric';

type Mode = SymMode;
type KeySource = SymKeySource;
type Action = 'encrypt' | 'decrypt';

function errorMessage(e: unknown, isZh: boolean, action: Action): string {
  if (!(e instanceof SymmetricError)) {
    return action === 'decrypt'
      ? (isZh ? '解密失败：密码/密钥错误或数据已被篡改' : 'Decryption failed: wrong key/password or tampered data')
      : (isZh ? '加密失败，请检查输入' : 'Encryption failed, please check input');
  }
  switch (e.code) {
    case 'missing-text':
      return isZh ? '请输入文本' : 'Please enter text';
    case 'missing-password':
      return isZh ? '请输入密码' : 'Please enter password';
    case 'invalid-hex': {
      const sm4 = e.detail === 'SM4';
      return isZh
        ? `${e.detail} 密钥需为 ${sm4 ? '32' : '64'} 位 hex（${sm4 ? '16' : '32'} 字节）`
        : `${e.detail} key must be ${sm4 ? '32' : '64'} hex chars (${sm4 ? '16' : '32'} bytes)`;
    }
    case 'old-format':
      return isZh
        ? '仅支持 v2 格式密文；旧版密文已不再支持，请用当前版本重新加密'
        : 'Only v2 ciphertext is supported. Legacy ciphertext is no longer supported — please re-encrypt with this version.';
    case 'mode-mismatch':
      return isZh
        ? `该密文使用 ${e.detail} 模式，请切换算法模式`
        : `This ciphertext uses ${e.detail} mode; switch the algorithm mode.`;
    case 'key-source-mismatch':
      return isZh
        ? (e.detail === 'password' ? '该密文由密码派生，请选择「密码派生」' : '该密文使用 hex 密钥，请选择「直接 hex 密钥」')
        : (e.detail === 'password' ? 'This ciphertext is password-derived; choose Password-derived.' : 'This ciphertext uses a hex key; choose Direct hex key.');
    case 'auth-failed':
      return isZh ? '完整性校验失败：密码/密钥错误或数据已被篡改' : 'Integrity check failed: wrong key/password or data has been tampered with';
    case 'invalid-format':
      return isZh ? '密文格式无效' : 'Invalid ciphertext format';
    default:
      return action === 'decrypt'
        ? (isZh ? '解密失败：密码/密钥错误或数据已被篡改' : 'Decryption failed: wrong key/password or tampered data')
        : (isZh ? '加密失败，请检查输入' : 'Encryption failed, please check input');
  }
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

  const isSm4 = mode === 'SM4-CBC';

  const run = async () => {
    setError('');
    setOutput('');
    try {
      const result = await (action === 'encrypt'
        ? encryptText({ text: input, mode, keySource, password, hexKey })
        : decryptText({ text: input, mode, keySource, password, hexKey }));
      setOutput(result);
    } catch (e) {
      setError(errorMessage(e, isZh, action));
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
            <option value="CBC">AES-256-CBC + HMAC {isZh ? '(兼容传统)' : '(legacy compatibility)'}</option>
            <option value="SM4-CBC">SM4-CBC + HMAC {isZh ? '(国密,带 IV)' : '(Chinese standard, with IV)'}</option>
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
            <option value="password">{isZh ? '密码派生' : 'Password-derived'}</option>
            <option value="hex">{isZh ? '直接 hex 密钥' : 'Direct hex key'}</option>
          </select>
        </label>
      </div>

      {/* 密钥说明 */}
      <p className="text-[10px] -mt-2" style={labelStyle}>
        {isZh
          ? '密钥长度：AES 32 字节(256 位)，SM4 16 字节(128 位)。密码派生统一使用 PBKDF2-SHA256(60 万次)+随机 salt；CBC 与 SM4-CBC 另加 HMAC-SHA256 完整性校验。'
          : 'Key sizes: AES 32 bytes (256-bit), SM4 16 bytes (128-bit). Password mode uses PBKDF2-SHA256 (600,000 iterations) + random salt; CBC and SM4-CBC additionally use HMAC-SHA256 integrity checks.'}
      </p>

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
            {isZh
              ? '用 PBKDF2-SHA256(60 万次迭代)派生密钥，salt 随机生成并嵌入密文；密码本身不会离开浏览器。'
              : 'Derives keys via PBKDF2-SHA256 (600,000 iterations); a random salt is embedded in the ciphertext. Your password never leaves the browser.'}
          </p>
        </div>
      ) : (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {isSm4
              ? (isZh ? 'Hex 密钥(32 字符,16 字节)' : 'Hex Key (32 chars, 16 bytes)')
              : (isZh ? 'Hex 密钥(64 字符,32 字节)' : 'Hex Key (64 chars, 32 bytes)')}
          </label>
          <input
            type="text"
            value={hexKey}
            onChange={e => setHexKey(e.target.value)}
            placeholder={isSm4
              ? 'e.g. 0123456789abcdeffedcba9876543210'
              : 'e.g. 603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4'}
            className="w-full px-3 py-2 rounded-lg text-sm font-mono outline-none"
            style={cardStyle}
          />
          <p className="text-[10px] mt-1" style={labelStyle}>
            {isSm4
              ? (isZh ? '直接提供 16 字节(128 位)SM4 密钥的十六进制表示；HMAC 密钥由该密钥单向派生。' : 'Provide a 16-byte (128-bit) SM4 key in hexadecimal. The HMAC key is derived one-way from it.')
              : (isZh ? '直接提供 32 字节(256 位)AES 密钥的十六进制表示；HMAC 密钥由该密钥单向派生。' : 'Provide a 32-byte (256-bit) AES key in hexadecimal. The HMAC key is derived one-way from it.')}
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
              : (isZh ? '粘贴 v2: 开头的密文...' : 'Paste ciphertext starting with v2:...')
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
            <p>• 密文统一带 <code>v2:</code> 前缀，格式为 base64(header + iv + ciphertext + HMAC)</p>
            <p>• GCM 使用 AAD 绑定算法与 salt/iv；CBC 与 SM4-CBC 使用 HMAC-SHA256 校验完整性</p>
            <p>• 密码派生：PBKDF2-SHA256 60 万次 + 随机 salt，salt 嵌入密文</p>
            <p>• 推荐 GCM(带认证)；CBC/SM4-CBC 仅用于兼容传统系统</p>
            <p>• 旧版密文(无 <code>v2:</code> 前缀)已不再支持，需重新加密</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Implementation Notes:</p>
            <p>• All ciphertext is prefixed with <code>v2:</code> and encoded as base64(header + iv + ciphertext + HMAC)</p>
            <p>• GCM binds the algorithm and salt/iv via AAD; CBC and SM4-CBC use HMAC-SHA256 for integrity</p>
            <p>• Password mode: PBKDF2-SHA256 with 600,000 iterations + random salt embedded in the ciphertext</p>
            <p>• GCM is recommended (authenticated); CBC/SM4-CBC are for legacy compatibility</p>
            <p>• Legacy ciphertext without the <code>v2:</code> prefix is no longer supported and must be re-encrypted</p>
          </div>
        )}
      </div>
    </div>
  );
}
