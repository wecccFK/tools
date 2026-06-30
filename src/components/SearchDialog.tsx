import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { TOOLS } from '../constants';
import type { Tool } from '../types';
import {
  searchTools,
  highlightMatch,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
} from '../data/searchIndex';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tabler 图标内联(避免在 Islands 中引入整个图标库)
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
    'uuid-generator': 'M9 9h6v6H9zM3 3h6v6H3zM15 15h6v6h-6zM3 15h6v6H3zM15 3h6v6h-6z',
    'color-converter': 'M12 2v20M2 12h20M5 5l14 14M19 5L5 19',
    'unit-converter': 'M3 6h18M6 12h12M9 18h6',
    'status-code-lookup': 'M4 4h16v16H4zM4 9h16M9 9v11',
    'pomodoro-timer': 'M12 2a10 10 0 1 0 10 10M12 6v6l4 2',
    'image-splitter': 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    'aes-tool': 'M5 8h14M5 8v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M9 12h6',
    'screen-recorder': 'M3 7h13v10H3zM16 10l5-3v10l-5-3',
    'clock': 'M12 7v5l3 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
    'random-group': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    'image-matting': 'M4 4h16v16H4zM4 12l4-4 3 3 5-5 4 4',
  };
  const path = icons[id] || icons['base64'];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
};

// 高亮渲染
function HighlightedText({ text, query }: { text: string; query: string }) {
  const segments = useMemo(() => highlightMatch(text, query), [text, query]);
  return (
    <>
      {segments.map((seg, i) => (
        seg.match
          ? <mark key={i} style={{ background: 'var(--accent)', color: '#fff', padding: '0 2px', borderRadius: 2 }}>{seg.text}</mark>
          : <span key={i}>{seg.text}</span>
      ))}
    </>
  );
}

type FilterCategory = 'All' | 'Text' | 'Developer' | 'Image' | 'Productivity' | 'Entertainment';

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const { lang, t } = useLanguage();
  const isZh = lang === 'zh';
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [category, setCategory] = useState<FilterCategory>('All');
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 加载历史
  useEffect(() => {
    if (isOpen) {
      setHistory(getSearchHistory());
      setQuery('');
      setCategory('All');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 搜索 + 分类筛选
  const results = useMemo(() => {
    const searched = searchTools(query, lang);
    if (category === 'All') return searched;
    return searched.filter(r => r.tool.category === category);
  }, [query, lang, category]);

  // 无查询时:历史 + 全部(按默认顺序)
  const displayItems = useMemo(() => {
    if (!query.trim()) {
      // 无查询:历史置顶
      const historyTools = history
        .map(id => TOOLS.find(t => t.id === id))
        .filter((t): t is Tool => !!t);
      const historyIds = new Set(history);
      const rest = TOOLS.filter(t => !historyIds.has(t.id));
      const allTools = [...historyTools, ...rest];
      if (category === 'All') return allTools.map(tool => ({ tool, score: 0, matchedField: 'name' as const }));
      return allTools.filter(t => t.category === category).map(tool => ({ tool, score: 0, matchedField: 'name' as const }));
    }
    return results;
  }, [query, results, history, category, lang]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, category]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, displayItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && displayItems[selectedIndex]) {
      const toolId = displayItems[selectedIndex].tool.id;
      addSearchHistory(toolId);
      window.location.href = `/tool/${toolId}/`;
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // 滚动到选中项
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleOpen = (toolId: string) => {
    addSearchHistory(toolId);
    onClose();
  };

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const categories: FilterCategory[] = ['All', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];
  const categoryLabel = (c: FilterCategory) => {
    if (!isZh) return c === 'All' ? 'All' : c;
    const map: Record<FilterCategory, string> = {
      'All': '全部',
      'Text': '文本',
      'Developer': '开发者',
      'Image': '图片',
      'Productivity': '效率',
      'Entertainment': '娱乐',
    };
    return map[c];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
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
            placeholder={isZh ? '搜索工具名、拼音首字母、英文缩写、教程关键词...' : 'Search tools by name, alias, tag, tutorial keyword...'}
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

        {/* 分类筛选 chips */}
        <div className="flex gap-1.5 px-4 py-2 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
              style={{
                background: category === c ? 'var(--accent)' : 'var(--bg-3)',
                color: category === c ? '#fff' : 'var(--text-muted)',
              }}
            >
              {categoryLabel(c)}
            </button>
          ))}
        </div>

        {/* 结果列表 */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
          {/* 历史记录标题(无查询时) */}
          {!hasQuery && history.length > 0 && category === 'All' && (
            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {isZh ? '最近使用' : 'Recent'}
              </span>
              <button
                onClick={() => { clearSearchHistory(); setHistory([]); }}
                className="text-[10px] hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                {isZh ? '清空' : 'Clear'}
              </button>
            </div>
          )}

          {displayItems.length === 0 ? (
            <div className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              {isZh ? `未找到匹配 "${query}" 的工具` : `No tools found for "${query}"`}
            </div>
          ) : (
            displayItems.map((item, idx) => {
              const tool = item.tool;
              const isHistoryItem = !hasQuery && history.includes(tool.id) && category === 'All';
              return (
                <a
                  key={tool.id}
                  href={`/tool/${tool.id}/`}
                  data-idx={idx}
                  onClick={() => handleOpen(tool.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group"
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
                    <div className="font-medium text-sm truncate flex items-center gap-1.5">
                      <HighlightedText text={tool.name[lang]} query={query} />
                      {isHistoryItem && (
                        <span className="text-[9px] px-1 py-0.5 rounded" style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}>
                          {isZh ? '最近' : 'RECENT'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      <HighlightedText text={tool.description[lang]} query={query} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex gap-1">
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
                    {hasQuery && item.matchedField !== 'name' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {item.matchedField === 'alias' ? (isZh ? '别名' : 'alias')
                          : item.matchedField === 'pinyin' ? (isZh ? '拼音' : 'pinyin')
                          : item.matchedField === 'tag' ? (isZh ? '标签' : 'tag')
                          : item.matchedField === 'desc' ? (isZh ? '描述' : 'desc')
                          : item.matchedField === 'tutorial' ? (isZh ? '教程' : 'tutorial')
                          : item.matchedField === 'category' ? (isZh ? '分类' : 'category')
                          : ''}
                      </span>
                    )}
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* 底部提示 */}
        <div className="px-4 py-2 border-t flex items-center justify-between text-[10px]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-3">
            <span>↑↓ {isZh ? '导航' : 'nav'}</span>
            <span>↵ {isZh ? '打开' : 'open'}</span>
            <span>ESC {isZh ? '关闭' : 'close'}</span>
          </div>
          <span>{displayItems.length} {isZh ? '个结果' : 'results'}</span>
        </div>
      </div>
    </div>
  );
}
