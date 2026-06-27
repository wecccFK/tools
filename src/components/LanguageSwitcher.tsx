import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
      style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
      title="切换语言"
    >
      {lang === 'zh' ? '中' : 'EN'}
    </button>
  );
}
