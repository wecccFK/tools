import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'momo-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  // 初始化：localStorage 优先，否则跟随系统
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      applyTheme(saved);
    } else {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(sysDark ? 'dark' : 'light');
      applyTheme(sysDark ? 'dark' : 'light');
    }
  }, []);

  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute('data-theme', t);
  };

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg transition-colors hover:opacity-80"
      style={{ color: 'var(--text-muted)' }}
      title={theme === 'dark' ? '切换到浅色' : '切换到深色'}
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
