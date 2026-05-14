'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Globe,
  Sun,
  Moon,
  Layers,
  Sparkles,
  FileText,
  Code2,
  ImageIcon,
  Activity,
  Gamepad2,
  Star,
  X,
  Menu,
  ArrowLeft,
  Info,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
  Scale,
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

interface AppShellProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  title?: string;
}

export function AppShell({ children, showBackButton, backHref = '/', title }: AppShellProps) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
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

  const toggleTheme = () => setIsDark(!isDark);

  const sidebarItems = [
    { type: 'header' as const, label: t['menu.categories'] },
    ...categoryOrder.map((cat) => ({ type: 'category' as const, id: cat })),
    { type: 'divider' as const },
    { type: 'header' as const, label: t['menu.starred'] },
    ...(starredTools.length === 0
      ? [{ type: 'empty' as const, label: t['menu.stars_none'] }]
      : starredTools.map((id) => {
          const tool = TOOLS.find((t) => t.id === id);
          return tool ? { type: 'starred' as const, tool } : null;
        }).filter(Boolean)),
    { type: 'divider' as const },
    { type: 'link' as const, id: 'about', icon: Info, label: t['nav.about'] },
    { type: 'link' as const, id: 'contact', icon: MessageCircle, label: '联系我们' },
    { type: 'link' as const, id: 'terms', icon: Scale, label: '服务条款' },
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-bg3 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex pt-14 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-bg2 border-r border-border-site overflow-y-auto transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 border-b border-border-site">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">MOMO工具箱</h1>
                <p className="text-xs text-text-muted">在线工具箱</p>
              </div>
            </Link>
          </div>

          <nav className="p-3 space-y-1">
            {sidebarItems.map((item: any, idx) => {
              if (!item) return null;
              if (item.type === 'header') {
                return <div key={idx} className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">{item.label}</div>;
              }
              if (item.type === 'divider') {
                return <div key={idx} className="my-2 border-t border-border-site" />;
              }
              if (item.type === 'empty') {
                return <div key={idx} className="px-3 py-2 text-sm text-text-muted italic">{item.label}</div>;
              }
              if (item.type === 'category') {
                const cat = item.id;
                const isActive = activeCategory === cat;
                return (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); window.location.href = '/'; }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-text-site hover:bg-bg3'
                    }`}>
                    <span className={isActive ? 'text-primary' : 'text-text-muted'}>{categoryIcons[cat]}</span>
                    {t[`category.${cat}` as keyof typeof t] || cat}
                  </button>
                );
              }
              if (item.type === 'starred' && item.tool) {
                const Icon = item.tool.icon;
                return (
                  <Link key={item.tool.id} href={`/tool/${item.tool.id}`} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-site hover:bg-bg3 transition-colors">
                    <Icon className="w-4 h-4 text-text-muted" />
                    <span className="truncate">{lang === 'zh' ? item.tool.name.zh : item.tool.name.en}</span>
                  </Link>
                );
              }
              if (item.type === 'link') {
                const Icon = item.icon;
                return (
                  <Link key={item.id} href={`/${item.id}`} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-site hover:bg-bg3 transition-colors">
                    <Icon className="w-4 h-4 text-text-muted" />
                    {item.label}
                  </Link>
                );
              }
              return null;
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-site bg-bg2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{isDark ? t['menu.theme_dark'] : t['menu.theme_light']}</span>
              <button onClick={toggleTheme} className="relative w-12 h-6 rounded-full bg-bg3 transition-colors overflow-hidden">
                <motion.div className="absolute top-1 w-4 h-4 rounded-full bg-primary shadow-md"
                  initial={false}
                  animate={{ x: isDark ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              </button>
            </div>
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-20 bg-bg-site/95 backdrop-blur-md border-b border-border-site px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link href={backHref}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg2 border border-border-site text-sm font-medium hover:border-primary/50 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t['tool.back']}</span>
                </Link>
              )}
              {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme}
                  className="p-2.5 rounded-lg bg-bg2 border border-border-site hover:border-primary/50 transition-colors">
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>

          <footer className="border-t border-border-site px-4 sm:px-6 lg:px-8 py-8 mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-muted">{t['footer.copyright']}</p>
              <div className="flex items-center gap-6">
                <Link href="/about" className="text-sm text-text-muted hover:text-text-site transition-colors">{t['nav.about']}</Link>
                <Link href="/terms" className="text-sm text-text-muted hover:text-text-site transition-colors">服务条款</Link>
                <Link href="/contact" className="text-sm text-text-muted hover:text-text-site transition-colors">联系我们</Link>
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
