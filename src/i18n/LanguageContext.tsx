import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from './translations';
import { translations, type TranslationKey } from './translations';
import { LANGUAGE_STORAGE_KEY } from './language';

// 跨 Island 同步语言的自定义事件名
const LANG_CHANGE_EVENT = 'momo-lang-change';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('zh');

  useEffect(() => {
    // 客户端挂载时读取 localStorage
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved);
      // 同步 lang 与 data-lang，确保 CSS 静态双语区块切换正确
      document.documentElement.lang = saved;
      document.documentElement.setAttribute('data-lang', saved);
    }

    // 监听跨 Island 的语言变化（其他 Island 切换语言时触发）
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as Language;
      if (detail === 'zh' || detail === 'en') {
        setLangState(detail);
        // 同步更新 DOM 属性（防止广播方漏更新或本 Island 是被动接收方）
        document.documentElement.lang = detail;
        document.documentElement.setAttribute('data-lang', detail);
      }
    };
    window.addEventListener(LANG_CHANGE_EVENT, onLangChange);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, onLangChange);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    // 同步更新 <html> 的 lang 与 data-lang 属性：
    // - lang 属性影响浏览器与搜索引擎的语言识别
    // - data-lang 属性驱动 CSS 静态双语区块切换（globals.css 里的
    //   html[data-lang="zh"] [data-lang="en"] { display: none } 等规则）
    // 缺少这步会导致切换语言后静态区块不更新，需刷新才恢复
    document.documentElement.lang = newLang;
    document.documentElement.setAttribute('data-lang', newLang);
    // 广播给其他 Island（如 Footer 的双语文字切换）
    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: newLang }));
  };

  const t = (key: TranslationKey) => translations[lang][key] || translations.zh[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
