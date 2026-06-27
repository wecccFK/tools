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
      document.documentElement.lang = saved;
    }

    // 监听跨 Island 的语言变化（其他 Island 切换语言时触发）
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as Language;
      if (detail === 'zh' || detail === 'en') {
        setLangState(detail);
      }
    };
    window.addEventListener(LANG_CHANGE_EVENT, onLangChange);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, onLangChange);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
    // 广播给其他 Island
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
