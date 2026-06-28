import { useState, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type UuidVersion = 'v4' | 'v7' | 'ulid';

// Crockford Base32 字符集（ULID 使用）
const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// 生成 48 位时间戳（毫秒）的 ULID 随机部分
function ulidRandom(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  // 80 位随机数转为 26 字符 Base32
  // 这里用 BigInt 累加以正确处理 80 位
  let val = 0n;
  for (let i = 0; i < 10; i++) {
    val = (val << 8n) | BigInt(bytes[i]);
  }
  // 转 Base32（Crockford），固定 26 字符（前补 0）
  let out = '';
  for (let i = 0; i < 26; i++) {
    out = ULID_ALPHABET[Number(val % 32n)] + out;
    val = val / 32n;
  }
  return out;
}

// ULID 时间戳部分（10 字符 Base32，48 位毫秒）
function ulidTime(): string {
  const ms = Date.now();
  let t = BigInt(ms);
  let out = '';
  for (let i = 0; i < 10; i++) {
    out = ULID_ALPHABET[Number(t % 32n)] + out;
    t = t / 32n;
  }
  return out;
}

function generateOne(version: UuidVersion): string {
  if (version === 'v4') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // 降级：手动拼 v4
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
  }
  if (version === 'v7') {
    // v7：前 48 位是毫秒时间戳，后 12 位 version/variant，其余 62 位随机
    const ms = BigInt(Date.now());
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    const buf = new Uint8Array(16);
    // 48 位时间戳按大端序写入 buf[0..5]
    buf[0] = Number((ms >> 40n) & 0xffn);
    buf[1] = Number((ms >> 32n) & 0xffn);
    buf[2] = Number((ms >> 24n) & 0xffn);
    buf[3] = Number((ms >> 16n) & 0xffn);
    buf[4] = Number((ms >> 8n) & 0xffn);
    buf[5] = Number(ms & 0xffn);
    buf.set(bytes, 6);
    // 设置 version=7、variant
    buf[6] = (buf[6] & 0x0f) | 0x70;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
  }
  // ULID
  return ulidTime() + ulidRandom();
}

export default function UuidGenerator() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = generateOne(version);
      if (!hyphens && version !== 'ulid') id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setResults(list);
    setCopiedIdx(null);
  }, [version, count, uppercase, hyphens]);

  const copy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {}
  };

  const copyAll = async () => {
    if (!results.length) return;
    try {
      await navigator.clipboard.writeText(results.join('\n'));
      setCopiedIdx(-1);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {}
  };

  const labelStyle = { color: 'var(--text-muted)' };

  const versions: { id: UuidVersion; label: string }[] = [
    { id: 'v4', label: 'UUID v4' },
    { id: 'v7', label: 'UUID v7' },
    { id: 'ulid', label: 'ULID' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* 版本切换 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '版本' : 'Version'}
        </label>
        <div className="flex flex-wrap gap-2">
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => setVersion(v.id)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={
                version === v.id
                  ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.25)' }
                  : { background: 'var(--bg-3)', color: 'var(--text-muted)' }
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* 数量 */}
      <div>
        <label className="text-xs font-medium mb-1.5 flex justify-between" style={labelStyle}>
          <span>{isZh ? '生成数量' : 'Count'}</span>
          <span className="font-mono">{count}</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
      </div>

      {/* 选项 */}
      <div className="flex flex-wrap gap-2">
        <label
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
          style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}
        >
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="text-sm">{isZh ? '大写' : 'Uppercase'}</span>
        </label>
        <label
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
          style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}
        >
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(e) => setHyphens(e.target.checked)}
            disabled={version === 'ulid'}
            className="w-4 h-4"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="text-sm" style={version === 'ulid' ? { opacity: 0.5 } : undefined}>
            {isZh ? '带连字符' : 'Hyphens'}
          </span>
        </label>
      </div>

      {/* 生成按钮 */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.25)' }}
        >
          {isZh ? '生成' : 'Generate'}
        </button>
        {results.length > 1 && (
          <button
            onClick={copyAll}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            {copiedIdx === -1 ? (isZh ? '已复制全部' : 'Copied All') : isZh ? '复制全部' : 'Copy All'}
          </button>
        )}
      </div>

      {/* 结果 */}
      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.map((id, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg p-3"
              style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}
            >
              <span className="font-mono text-sm break-all flex-1" style={{ color: 'var(--text)' }}>
                {id}
              </span>
              <button
                onClick={() => copy(id, i)}
                className="px-3 py-1 rounded text-xs font-medium shrink-0 transition-colors"
                style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}
              >
                {copiedIdx === i ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {isZh
          ? '使用 crypto.getRandomValues 生成密码学安全随机数。UUID v4 纯随机；UUID v7 时间排序（前 48 位为毫秒时间戳）；ULID 为 26 字符 Crockford Base32，字典序排序友好。'
          : 'Uses crypto.getRandomValues for cryptographically secure randomness. UUID v4 is fully random; UUID v7 is time-ordered (first 48 bits are a millisecond timestamp); ULID is 26 chars of Crockford Base32, lexicographically sortable.'}
      </p>
    </div>
  );
}
