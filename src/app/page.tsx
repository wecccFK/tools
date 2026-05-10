'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Globe, Sun, Moon, Layers, Sparkles, Star, X, Menu, Info,
  ShieldCheck, AlertTriangle, FileText, Code2, ImageIcon, Activity, Gamepad2,
} from 'lucide-react';
import { TOOLS } from '@/constants';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations } from '@/i18n/translations';

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Sparkles className="w-4 h-4" />,
  Text: <FileText className="w-4 h-4" />,
  Developer: <Code2 className="w-4 h-4" />,
  Image: <ImageIcon className="w-4 h-4" />,
  Productivity: <Activity className="w-4 h-4" />,
  Entertainment: <Gamepad2 className="w-4 h-4" />,
};
const categoryOrder = ['All', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];

function getCategoryName(cat: string, lang: 'zh' | 'en') {
  const map: Record<string, Record<string, string>> = {
    All: { zh: '全部', en: 'All' },
    Text: { zh: '文本工具', en: 'Text' },
    Developer: { zh: '开发工具', en: 'Developer' },
    Image: { zh: '图像处理', en: 'Image' },
    Productivity: { zh: '效率工具', en: 'Productivity' },
    Entertainment: { zh: '娱乐工具', en: 'Entertainment' },
  };
  return map[cat]?.[lang] || cat;
}

function getToolName(tool: (typeof TOOLS)[number], lang: 'zh' | 'en') {
  return lang === 'zh' ? tool.name.zh : tool.name.en;
}

function getToolDescription(tool: (typeof TOOLS)[number], lang: 'zh' | 'en') {
  return lang === 'zh' ? tool.description.zh : tool.description.en;
}

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [starredTools, setStarredTools] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedStars = localStorage.getItem('starredTools');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    if (savedStars) setStarredTools(JSON.parse(savedStars));
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('starredTools', JSON.stringify(starredTools));
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark, starredTools]);

  const filteredTools = useMemo(() => {
    let tools = TOOLS.filter((t) => !['about', 'privacy', 'disclaimer', 'sponsored-deal'].includes(t.id));
    if (activeCategory !== 'All') tools = tools.filter((t) => t.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tools = tools.filter((tool) => {
        const name = getToolName(tool, lang).toLowerCase();
        const desc = getToolDescription(tool, lang).toLowerCase();
        const tags = tool.tags.join(' ').toLowerCase();
        return name.includes(q) || desc.includes(q) || tags.includes(q);
      });
    }
    return tools;
  }, [activeCategory, searchQuery, lang]);

  const toggleStar = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault(); e.stopPropagation();
    setStarredTools((prev) => prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]);
  };

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(lang === 'zh' ? 'en' : 'zh');

  const sidebarItems = [
    { type: 'header' as const, label: t['menu.categories'] },
    ...categoryOrder.map((cat) => ({ type: 'category' as const, id: cat })),
    { type: 'divider' as const },
    { type: 'header' as const, label: t['menu.starred'] },
    ...(starredTools.length === 0
      ? [{ type: 'empty' as const, label: t['menu.stars_none'] }]
      : starredTools.map((id) => { const tool = TOOLS.find((t) => t.id === id); return tool ? { type: 'starred' as const, tool } : null; }).filter(Boolean)),
    { type: 'divider' as const },
    { type: 'link' as const, id: 'about', icon: Info, label: t['nav.about'] },
    { type: 'link' as const, id: 'privacy', icon: ShieldCheck, label: '隐私政策' },
    { type: 'link' as const, id: 'disclaimer', icon: AlertTriangle, label: '免责声明' },
  ];

  return (
    <div className="min-h-screen bg-bg-site text-text-site">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-bg2/95 backdrop-blur-md border-b border-border-site">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">MOMO工具箱</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg hover:bg-bg3">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex pt-14 lg:pt-0">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-bg2 border-r border-border-site overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-4 border-b border-border-site">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div><h1 className="font-bold text-lg">MOMO工具箱</h1><p className="text-xs text-text-muted">在线工具箱</p></div>
            </Link>
          </div>

          <nav className="p-3 space-y-1">
            {sidebarItems.map((item: any, idx) => {
              if (!item) return null;
              if (item.type === 'header') return <div key={idx} className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">{item.label}</div>;
              if (item.type === 'divider') return <div key={idx} className="my-2 border-t border-border-site" />;
              if (item.type === 'empty') return <div key={idx} className="px-3 py-2 text-sm text-text-muted italic">{item.label}</div>;
              if (item.type === 'category') {
                const cat = item.id; const isActive = activeCategory === cat;
                return (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-text-site hover:bg-bg3'}`}>
                    <span className={isActive ? 'text-primary' : 'text-text-muted'}>{categoryIcons[cat]}</span>
                    {getCategoryName(cat, lang)}
                  </button>
                );
              }
              if (item.type === 'starred' && item.tool) {
                const Icon = item.tool.icon;
                return (
                  <Link key={item.tool.id} href={`/tool/${item.tool.id}`} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-bg3 transition-colors">
                    <Icon className="w-4 h-4 text-text-muted" /><span className="truncate">{getToolName(item.tool, lang)}</span>
                  </Link>
                );
              }
              if (item.type === 'link') {
                const Icon = item.icon;
                return (
                  <Link key={item.id} href={`/${item.id}`} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-bg3 transition-colors">
                    <Icon className="w-4 h-4 text-text-muted" />{item.label}
                  </Link>
                );
              }
              return null;
            })}
          </nav>

          {/* Sidebar Theme Toggle */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-site bg-bg2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{isDark ? t['menu.theme_dark'] : t['menu.theme_light']}</span>
              <button onClick={toggleTheme}
                className="relative w-12 h-6 rounded-full bg-bg3 transition-colors overflow-hidden">
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full bg-primary shadow-md"
                  initial={false}
                  animate={{ x: isDark ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </aside>

        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="sticky top-0 z-20 bg-bg-site/95 backdrop-blur-md border-b border-border-site px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden lg:flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">MOMO工具箱</span>
              </Link>

              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t['search.placeholder']}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg2 border border-border-site text-sm focus:border-primary/60 outline-none transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-bg3">
                    <X className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg2 border border-border-site text-sm font-medium hover:border-primary/50 transition-colors">
                  <Globe className="w-4 h-4" /><span className="hidden sm:inline">{lang === 'zh' ? 'EN' : '中文'}</span>
                </button>
                <button onClick={toggleTheme} className="p-2.5 rounded-lg bg-bg2 border border-border-site hover:border-primary/50 transition-colors">
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tool Grid */}
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {activeCategory !== 'All' && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-sm text-text-muted">{lang === 'zh' ? '当前分类:' : 'Category:'}</span>
                <span className="text-sm font-semibold text-primary">{getCategoryName(activeCategory, lang)}</span>
                <button onClick={() => setActiveCategory('All')} className="text-xs text-text-muted hover:text-text-site ml-2">× {lang === 'zh' ? '清除' : 'Clear'}</button>
              </div>
            )}

            {filteredTools.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-text-muted">{lang === 'zh' ? '没有找到匹配的工具' : 'No tools found'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="wait">
                  {filteredTools.map((tool) => {
                    const Icon = tool.icon;
                    const isStarred = starredTools.includes(tool.id);
                    return (
                      <motion.div key={tool.id} layout initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                        <Link href={`/tool/${tool.id}`}
                          className="group relative block p-5 rounded-2xl bg-bg2 border border-border-site hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate">{getToolName(tool, lang)}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tool.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-bg3 text-text-muted">{tag}</span>
                                ))}
                              </div>
                            </div>
                            <button onClick={(e) => toggleStar(e, tool.id)}
                              className={`p-1.5 rounded-lg hover:bg-bg3 transition-colors ${isStarred ? 'text-amber-500' : 'text-text-muted hover:text-amber-500'}`}>
                              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-500' : ''}`} />
                            </button>
                          </div>
                          <p className="text-xs text-text2 line-clamp-2 leading-relaxed">{getToolDescription(tool, lang)}</p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-border-site px-4 sm:px-6 lg:px-8 py-8 mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-muted">{t['footer.copyright']}</p>
              <div className="flex items-center gap-6">
                <Link href="/about" className="text-sm text-text-muted hover:text-text-site transition-colors">{t['nav.about']}</Link>
                <Link href="/privacy" className="text-sm text-text-muted hover:text-text-site transition-colors">隐私政策</Link>
                <Link href="/disclaimer" className="text-sm text-text-muted hover:text-text-site transition-colors">免责声明</Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
