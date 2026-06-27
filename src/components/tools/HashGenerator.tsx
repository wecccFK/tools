import { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { useLanguage } from '../../i18n/LanguageContext';

type Algo = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'SHA224' | 'SHA384';

const ALGOS: Algo[] = ['MD5', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512'];

function hash(algo: Algo, text: string): string {
  switch (algo) {
    case 'MD5': return CryptoJS.MD5(text).toString();
    case 'SHA1': return CryptoJS.SHA1(text).toString();
    case 'SHA224': return CryptoJS.SHA224(text).toString();
    case 'SHA256': return CryptoJS.SHA256(text).toString();
    case 'SHA384': return CryptoJS.SHA384(text).toString();
    case 'SHA512': return CryptoJS.SHA512(text).toString();
  }
}

export default function HashGenerator() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<Algo>('SHA256');
  const [showAll, setShowAll] = useState(false);
  const [copiedAlgo, setCopiedAlgo] = useState('');

  const results = useMemo(() => {
    if (!input) return [];
    if (showAll) {
      return ALGOS.map((a) => ({ algo: a, value: hash(a, input) }));
    }
    return [{ algo: selected, value: hash(selected, input) }];
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
