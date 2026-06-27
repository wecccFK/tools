import { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Mode = 'encode' | 'decode';

export default function UrlEncoder() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [useComponent, setUseComponent] = useState(true);
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      if (mode === 'encode') {
        return {
          output: useComponent ? encodeURIComponent(input) : encodeURI(input),
          error: '',
        };
      }
      return {
        output: useComponent ? decodeURIComponent(input) : decodeURI(input),
        error: '',
      };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, useComponent]);

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const swap = () => {
    if (output) setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const textareaStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 模式切换 */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <button
            onClick={() => setMode('encode')}
            className="px-4 py-1.5 text-sm font-medium transition-colors"
            style={
              mode === 'encode'
                ? { background: 'var(--accent)', color: '#fff' }
                : { background: 'var(--bg-3)', color: 'var(--text-muted)' }
            }
          >
            {isZh ? '编码' : 'Encode'}
          </button>
          <button
            onClick={() => setMode('decode')}
            className="px-4 py-1.5 text-sm font-medium transition-colors"
            style={
              mode === 'decode'
                ? { background: 'var(--accent)', color: '#fff' }
                : { background: 'var(--bg-3)', color: 'var(--text-muted)' }
            }
          >
            {isZh ? '解码' : 'Decode'}
          </button>
        </div>
        <button
          onClick={swap}
          className="px-3 py-1.5 rounded-lg text-sm transition-colors"
          style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          title={isZh ? '交换输入输出' : 'Swap input/output'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l-4-4M17 20l4-4" />
          </svg>
        </button>
        <button
          onClick={copy}
          disabled={!output}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
          style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
        >
          {copied ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
        </button>
      </div>

      {/* 编码模式选择 */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={useComponent}
          onChange={(e) => setUseComponent(e.target.checked)}
          className="w-4 h-4"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="text-sm" style={labelStyle}>
          {useComponent ? 'encodeURIComponent' : 'encodeURI'}
          <span className="ml-2 text-xs opacity-70">
            {useComponent
              ? isZh ? '（编码全部特殊字符，含 / ? : @ & = + $ #）' : '(encodes all special chars including / ? : @ & = + $ #)'
              : isZh ? '（保留 URL 结构字符）' : '(preserves URL structural chars)'}
          </span>
        </span>
      </label>

      {/* 输入 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {mode === 'encode' ? (isZh ? '原始文本' : 'Original Text') : isZh ? '已编码文本' : 'Encoded Text'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isZh ? '输入文本...' : 'Enter text...'}
          className="w-full h-28 rounded-lg p-3 font-mono text-sm outline-none resize-y"
          style={textareaStyle}
        />
      </div>

      {error && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <span className="font-mono">{error}</span>
        </div>
      )}

      {/* 输出 */}
      {output && !error && (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {mode === 'encode' ? (isZh ? '编码结果' : 'Encoded') : isZh ? '解码结果' : 'Decoded'}
          </label>
          <pre
            className="w-full rounded-lg p-3 font-mono text-sm overflow-auto max-h-64 whitespace-pre-wrap break-all"
            style={textareaStyle}
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
