import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { categoryLabel } from '../i18n/translations';
import { TOOLS } from '../constants';
import type { ToolCategory } from '../types';
import { useStarredTools } from '../hooks/useStarredTools';

// 工具图标（内联 SVG，避免引入整个图标库）
const ICON_PATHS: Record<string, string> = {
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

function ToolIcon({ id, size = 24 }: { id: string; size?: number }) {
  const path = ICON_PATHS[id] || ICON_PATHS['base64'];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

// 星标图标
function StarIcon({ filled, size = 16 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// 分类选项（包含 "All" 和 "starred"）
type FilterKey = 'All' | 'starred' | ToolCategory;
const FILTER_KEYS: FilterKey[] = ['All', 'starred', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];

export default function HomeContentInner() {
  const { lang, t } = useLanguage();
  const { starredTools, isStarred, toggleStar } = useStarredTools();
  const [filter, setFilter] = useState<FilterKey>('All');

  // 按当前筛选条件分组
  const groups = useMemo(() => {
    if (filter === 'starred') {
      return starredTools.length > 0 ? [{ category: 'starred' as const, tools: starredTools }] : [];
    }
    if (filter === 'All') {
      // 全部：按分类分组
      return (['Text', 'Developer', 'Image', 'Productivity', 'Entertainment'] as ToolCategory[])
        .map(cat => ({
          category: cat,
          tools: TOOLS.filter(tool => tool.category === cat),
        }))
        .filter(g => g.tools.length > 0);
    }
    // 单一分类
    const tools = TOOLS.filter(tool => tool.category === filter);
    return tools.length > 0 ? [{ category: filter, tools }] : [];
  }, [filter, starredTools]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      {/* Hero */}
      <section className="mb-14 text-center">
        <div
          className="inline-flex items-center gap-1.5 accent-soft-bg rounded-full px-3 py-1 text-xs mb-5 accent-text font-medium animate-fade-in"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.9 5.8L20 10.7l-5.8 1.9L12 18l-1.9-5.4L4 10.7l6.1-1.9L12 3z" />
          </svg>
          <span>{TOOLS.length}+ {lang === 'zh' ? '精选工具' : 'Curated Tools'}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
          {lang === 'zh' ? <>让工具更<span className="accent-text">温暖</span>一些</> : t('hero.title')}
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          {t('hero.subtitle')}
        </p>
      </section>

      {/* 分类筛选 */}
      <div className="flex items-center gap-2 mb-10 flex-wrap justify-center">
        {FILTER_KEYS.map(key => {
          const isActive = filter === key;
          const count = key === 'starred'
            ? starredTools.length
            : key === 'All'
              ? TOOLS.length
              : TOOLS.filter(tool => tool.category === key).length;
          // 隐藏无工具的分类
          if (key !== 'All' && key !== 'starred' && count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
              style={{
                background: isActive ? 'var(--accent)' : 'var(--bg-2)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: isActive ? '0 2px 8px rgba(var(--accent-rgb), 0.25)' : 'none',
              }}
            >
              {key === 'starred' && <StarIcon filled={isActive} size={14} />}
              {categoryLabel(lang, key)}
              {count > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0 rounded-full"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-3)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 内容区 */}
      {filter === 'starred' && starredTools.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: 'var(--bg-2)', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
        >
          <div className="flex justify-center mb-4">
            <StarIcon filled={false} size={48} />
          </div>
          <p className="text-sm">{t('starred.empty')}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map(group => (
            <section key={group.category} className="animate-fade-in">
              <h2
                className="text-xs uppercase tracking-widest font-bold mb-5 flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {group.category === 'starred' && <StarIcon filled size={14} />}
                {categoryLabel(lang, group.category)}
                <span className="text-[10px] font-normal opacity-60">
                  {group.tools.length} {t('tools.count')}
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {group.tools.map(tool => (
                  <div key={tool.id} className="tool-card p-5 group relative">
                    {/* 收藏按钮 */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleStar(tool.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg transition-all duration-200"
                      style={{
                        color: isStarred(tool.id) ? 'var(--accent)' : 'var(--text-muted)',
                        opacity: isStarred(tool.id) ? 1 : 0.4,
                      }}
                      onMouseEnter={(e) => {
                        if (!isStarred(tool.id)) e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        if (!isStarred(tool.id)) e.currentTarget.style.opacity = '0.4';
                      }}
                      aria-label="收藏"
                    >
                      <StarIcon filled={isStarred(tool.id)} size={16} />
                    </button>

                    <a href={`/tool/${tool.id}`} className="block">
                      <div
                        className="tool-icon-wrap w-12 h-12 flex items-center justify-center mb-4"
                        style={{ color: 'var(--accent)' }}
                      >
                        <ToolIcon id={tool.id} />
                      </div>
                      <h3 className="font-semibold text-base mb-1 pr-6">{tool.name[lang]}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {tool.description[lang]}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
