import { useLanguage } from '../i18n/LanguageContext';
import { getOppositeLangPath } from '../i18n/routing';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const handleClick = () => {
    // 计算对端语言路径并跳转
    // 当前在中文页 → 跳英文版 URL;当前在英文页 → 跳中文版 URL
    const { lang: oppositeLang, path } = getOppositeLangPath(window.location.pathname);
    // 更新 localStorage 偏好(用户主动切换,记录偏好供下次自动跳转判断)
    setLang(oppositeLang);
    // 跳转到目标语言 URL(保留 query 和 hash)
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    window.location.href = path + search + hash;
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
      style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
      title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {lang === 'zh' ? 'EN' : '中'}
    </button>
  );
}
