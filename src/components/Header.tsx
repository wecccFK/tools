import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import SearchDialog from './SearchDialog';

export default function Header() {
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K / Ctrl+K 打开搜索
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b app-header"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.3)',
              }}
            >
              <span className="text-base">M</span>
            </div>
            <div>
              <div className="font-bold text-base leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                Momo工具箱
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {t('site.tagline')}
              </div>
            </div>
          </a>

          {/* 右侧操作 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition-colors hover:opacity-80"
              style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="hidden sm:inline">{t('search.placeholder')}</span>
              <kbd
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
              >
                {t('search.shortcut')}
              </kbd>
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
