import { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Mode = 'format' | 'minify';

export default function JsonFormatter() {
  const { lang, t } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [copied, setCopied] = useState(false);

  // output 根据 mode 决定格式化或压缩
  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const parsed = JSON.parse(input);
      const result = mode === 'format'
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed);
      return { output: result, error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  const format = () => setMode('format');
  const minify = () => setMode('minify');

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 降级方案：用 textarea + execCommand
      const ta = document.createElement('textarea');
      ta.value = output;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  const clear = () => {
    setInput('');
  };

  const labelStyle = { color: 'var(--text-muted)' };

  return (
    <div className="flex flex-col gap-4">
      {/* 操作按钮 */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={format}
          className="px-4 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          style={
            mode === 'format'
              ? { background: 'var(--accent)', boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.25)' }
              : { background: 'var(--bg-3)', color: 'var(--text-muted)' }
          }
        >
          {isZh ? '格式化' : 'Format'}
        </button>
        <button
          onClick={minify}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={
            mode === 'minify'
              ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.25)' }
              : { background: 'var(--bg-3)', color: 'var(--text-muted)' }
          }
        >
          {isZh ? '压缩' : 'Minify'}
        </button>
        <button
          onClick={copy}
          disabled={!output}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
          style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? t('tool.copied') : t('tool.copy')}
        </button>
        <button
          onClick={clear}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ml-auto"
          style={{ color: 'var(--text-muted)' }}
        >
          {isZh ? '清空' : 'Clear'}
        </button>
      </div>

      {/* 输入区 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '输入 JSON' : 'Input JSON'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isZh ? '在此粘贴 JSON 文本...' : 'Paste JSON text here...'}
          className="w-full h-48 rounded-lg p-3 font-mono text-sm outline-none resize-y"
          style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div
          className="rounded-lg p-3 text-sm flex items-start gap-2"
          style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.2)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span className="font-mono">{error}</span>
        </div>
      )}

      {/* 输出区 */}
      {output && !error && (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {mode === 'format' ? (isZh ? '格式化结果' : 'Formatted Result') : isZh ? '压缩结果' : 'Minified Result'}
          </label>
          <pre
            className="w-full rounded-lg p-3 font-mono text-sm overflow-auto max-h-96"
            style={{
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
