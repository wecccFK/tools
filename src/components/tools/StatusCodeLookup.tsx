import { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { STATUS_CODES, CATEGORY_LABELS } from '../../data/statusCodes';
import type { StatusCode } from '../../data/statusCodes';

type CategoryFilter = 'all' | StatusCode['category'];

export default function StatusCodeLookup() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [copied, setCopied] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STATUS_CODES.filter(s => {
      if (filter !== 'all' && s.category !== filter) return false;
      if (!q) return true;
      return (
        String(s.code).includes(q) ||
        s.name[lang].toLowerCase().includes(q) ||
        s.description[lang].toLowerCase().includes(q) ||
        s.name.en.toLowerCase().includes(q)
      );
    });
  }, [query, filter, lang]);

  const copyCode = async (code: number) => {
    try {
      await navigator.clipboard.writeText(String(code));
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const labelStyle = { color: 'var(--text-muted)' } as const;

  return (
    <div className="flex flex-col gap-5">
      {/* 搜索框 */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={isZh ? '搜索状态码、名称或描述(如 404、未找到、not found)...' : 'Search by code, name, or description...'}
        className="w-full px-4 py-3 rounded-xl text-base outline-none transition-colors"
        style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      />

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        {(['all', '1xx', '2xx', '3xx', '4xx', '5xx'] as CategoryFilter[]).map(cat => {
          const isActive = filter === cat;
          const label = cat === 'all'
            ? (isZh ? '全部' : 'All')
            : `${cat} · ${CATEGORY_LABELS[cat as StatusCode['category']][lang]}`;
          const color = cat === 'all' ? 'var(--accent)' : CATEGORY_LABELS[cat as StatusCode['category']!].color;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 animate-bounce-in"
              style={{
                background: isActive ? color : 'var(--bg-2)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${isActive ? color : 'var(--border)'}`,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 结果数 */}
      <div className="text-xs" style={labelStyle}>
        {isZh ? `共 ${filtered.length} 条结果` : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}
      </div>

      {/* 状态码列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(s => {
          const catColor = CATEGORY_LABELS[s.category].color;
          return (
            <div
              key={s.code}
              className="rounded-xl p-4 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
              }}
              onClick={() => copyCode(s.code)}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 rounded-lg px-3 py-2 font-bold text-lg font-mono"
                  style={{ background: `${catColor}20`, color: catColor }}
                >
                  {s.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{s.name[lang]}</h3>
                    {copied === s.code && (
                      <span className="text-[10px] accent-text">✓</span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {s.description[lang]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-sm" style={labelStyle}>
          {isZh ? '未找到匹配的状态码' : 'No matching status codes'}
        </div>
      )}
    </div>
  );
}
