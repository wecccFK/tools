import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { TOOLS } from '../constants';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tabler 图标内联（避免在 Islands 中引入整个图标库）
const ToolIcon = ({ id }: { id: string }) => {
  const icons: Record<string, string> = {
    'json-formatter': 'M8 9h8M8 13h8M8 17h5M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    'markdown-editor': 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4 8v-3l2 2 2-2v3m4-3v3m0-3l2.5 2.5L20 10',
    'qr-generator': 'M4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2zM10 4h2v2h-2zM4 10h2v2H4z',
    'password-generator': 'M12 2v6m0 0a4 4 0 0 1 0 8 4 4 0 0 1 0-8zm0 8v12M5 12H3m18 0h-2',
    'base64': 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    'url-encoder': 'M10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-3.5l-3 3-1-1 2-2-2-2 1-1 3 3z',
    'timestamp': 'M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    'hash-generator': 'M4 4h4l4 16h4M8 4l-2 8h12M8 4h12',
    'jwt-decoder': 'M12 2l3 3-3 3-3-3 3-3zm0 16l3 3-3 3-3-3 3-3zM2 12l3-3 3 3-3 3-3-3zm16 0l3-3 3 3-3 3-3-3z',
    'img-compress': 'M4 4h16v16H4zM4 14l4-4 3 3 5-5 4 4',
  };
  const path = icons[id] || icons['base64'];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
};

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return TOOLS;
    const q = query.toLowerCase();
    return TOOLS.filter(tool => {
      const name = tool.name[lang].toLowerCase();
      const desc = tool.description[lang].toLowerCase();
      const tags = tool.tags.join(' ').toLowerCase();
      return name.includes(q) || desc.includes(q) || tags.includes(q);
    });
  }, [query, lang]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      window.location.href = `/tool/${filtered[selectedIndex].id}`;
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // 滚动到选中项
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-xl rounded-2xl shadow-2xl animate-scale-in"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 搜索输入 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text)' }}
          />
          <kbd
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
          >
            ESC
          </kbd>
        </div>

        {/* 结果列表 */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              {t('search.empty')}
            </div>
          ) : (
            filtered.map((tool, idx) => (
              <a
                key={tool.id}
                href={`/tool/${tool.id}`}
                data-idx={idx}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: idx === selectedIndex ? 'var(--accent-soft)' : 'transparent',
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--bg-3)', color: 'var(--accent)' }}
                >
                  <ToolIcon id={tool.id} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{tool.name[lang]}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {tool.description[lang]}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {tool.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                      style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))
          )}
        </div>

        {/* 底部提示 */}
        <div className="px-4 py-2 border-t flex items-center justify-between text-[10px]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-3">
            <span>↑↓ 导航</span>
            <span>↵ 打开</span>
          </div>
          <span>{filtered.length} 个结果</span>
        </div>
      </div>
    </div>
  );
}
