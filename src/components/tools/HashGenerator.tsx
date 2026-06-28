import { useState, useEffect } from 'react';
import MD5 from 'crypto-js/md5';
import SHA224 from 'crypto-js/sha224';
import { useLanguage } from '../../i18n/LanguageContext';

type Algo = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'SHA224' | 'SHA384';

const ALGOS: Algo[] = ['MD5', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512'];

// SHA 算法到 Web Crypto 算法名的映射(SHA-224 不被 SubtleCrypto 支持)
const SHA_ALGO_MAP: Partial<Record<Algo, 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>> = {
  SHA1: 'SHA-1',
  SHA256: 'SHA-256',
  SHA384: 'SHA-384',
  SHA512: 'SHA-512',
};

// 把 buffer 转 hex
function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// 统一的哈希函数(SHA 用 Web Crypto 异步;MD5/SHA224 用 crypto-js 同步)
async function hash(algo: Algo, text: string): Promise<string> {
  if (algo === 'MD5') {
    return MD5(text).toString();
  }
  if (algo === 'SHA224') {
    return SHA224(text).toString().toLowerCase();
  }
  const subtleAlgo = SHA_ALGO_MAP[algo];
  if (!subtleAlgo) throw new Error(`Unsupported algo: ${algo}`);
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(subtleAlgo, data);
  return bufToHex(digest);
}

export default function HashGenerator() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<Algo>('SHA256');
  const [showAll, setShowAll] = useState(false);
  const [copiedAlgo, setCopiedAlgo] = useState('');
  const [results, setResults] = useState<{ algo: Algo; value: string }[]>([]);

  // 异步计算哈希(Web Crypto 是异步的)
  useEffect(() => {
    if (!input) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const algos = showAll ? ALGOS : [selected];
    Promise.all(algos.map(async a => ({ algo: a, value: await hash(a, input) })))
      .then(r => {
        if (!cancelled) setResults(r);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      });
    return () => { cancelled = true; };
  }, [input, selected, showAll]);

  const copy = async (algo: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedAlgo(algo);
      setTimeout(() => setCopiedAlgo(''), 1200);
    } catch {}
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const cardStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 输入 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '输入文本' : 'Input Text'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isZh ? '输入要计算哈希的文本...' : 'Enter text to hash...'}
          className="w-full h-32 rounded-lg p-3 font-mono text-sm outline-none resize-y"
          style={cardStyle}
        />
      </div>

      {/* 选项 */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 text-sm" style={labelStyle}>
          {isZh ? '算法' : 'Algorithm'}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value as Algo)}
            disabled={showAll}
            className="px-3 py-1.5 rounded-lg text-sm outline-none disabled:opacity-50"
            style={cardStyle}
          >
            {ALGOS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={labelStyle}>
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="w-4 h-4"
            style={{ accentColor: 'var(--accent)' }}
          />
          {isZh ? '显示全部算法' : 'Show all algorithms'}
        </label>
      </div>

      {/* 结果 */}
      {results.length > 0 ? (
        <div className="flex flex-col gap-2">
          {results.map(({ algo, value }) => (
            <div key={algo} className="rounded-lg p-3" style={cardStyle}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{algo}</span>
                <button
                  onClick={() => copy(algo, value)}
                  className="px-2 py-1 rounded text-xs transition-colors"
                  style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}
                >
                  {copiedAlgo === algo ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
                </button>
              </div>
              <code className="block font-mono text-sm break-all" style={{ color: 'var(--text)' }}>{value}</code>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-lg p-6 text-center text-sm"
          style={{ background: 'var(--bg-3)', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
        >
          {isZh ? '输入文本后自动计算哈希值' : 'Enter text to compute hashes automatically'}
        </div>
      )}
    </div>
  );
}
