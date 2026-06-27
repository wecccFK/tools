import { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Mode = 'encode' | 'decode';

// UTF-8 安全的 Base64
function encodeB64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function decodeB64(str: string): string {
  const bin = atob(str.trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      if (mode === 'encode') {
        return { output: encodeB64(input), error: '' };
      }
      // 解码：去除可能的换行和空格
      const clean = input.replace(/\s+/g, '');
      return { output: decodeB64(clean), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const clear = () => {
    setInput('');
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
      <div className="flex items-center gap-2">
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
        <button
          onClick={clear}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ml-auto"
          style={{ color: 'var(--text-muted)' }}
        >
          {isZh ? '清空' : 'Clear'}
        </button>
      </div>

      {/* 输入 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {mode === 'encode' ? (isZh ? '明文（UTF-8）' : 'Plain Text (UTF-8)') : isZh ? 'Base64 字符串' : 'Base64 String'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode'
              ? isZh ? '输入要编码的文本...' : 'Enter text to encode...'
              : isZh ? '输入 Base64 字符串...' : 'Enter Base64 string...'
          }
          className="w-full h-32 rounded-lg p-3 font-mono text-sm outline-none resize-y"
          style={textareaStyle}
        />
      </div>

      {/* 错误 */}
      {error && (
        <div
          className="rounded-lg p-3 text-sm flex items-start gap-2"
          style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span className="font-mono">{error}</span>
        </div>
      )}

      {/* 输出 */}
      {output && !error && (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {mode === 'encode' ? 'Base64' : isZh ? '解码结果' : 'Decoded'}
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
