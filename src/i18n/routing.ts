import type { Language } from './translations';

/**
 * i18n 路由工具:基于"中文为默认(无前缀),英文加 /en 前缀"的方案
 *
 * 路由规则:
 * - 中文:  /tool/json-formatter/  (无前缀,默认语言)
 * - 英文:  /en/tool/json-formatter/
 *
 * 静态页面:
 * - 中文:  /about/    /faq/    /privacy/    /terms/
 * - 英文:  /en/about/ /en/faq/ /en/privacy/ /en/terms/
 *
 * 首页:
 * - 中文:  /
 * - 英文:  /en/
 */

const EN_PREFIX = '/en';

/**
 * 从当前 URL 路径推断语言
 * 含 /en 前缀返回 'en',否则返回 'zh'(默认)
 */
export function getLangFromUrl(pathname: string): Language {
  // 标准化路径(确保以 / 开头)
  const path = pathname.startsWith('/') ? pathname : '/' + pathname;
  // 精确匹配 /en 或 /en/ 开头
  if (path === EN_PREFIX || path.startsWith(EN_PREFIX + '/')) {
    return 'en';
  }
  return 'zh';
}

/**
 * 根据当前语言和原始路径,生成本地化路径
 * - lang='en' 时在路径前加 /en
 * - lang='zh' 时返回原路径(默认语言无前缀)
 *
 * @param path 原始路径(中文版路径),如 '/tool/json-formatter/'
 * @param lang 目标语言
 */
export function localizedPath(path: string, lang: Language): string {
  // 确保路径以 / 开头
  let p = path.startsWith('/') ? path : '/' + path;
  // 如果路径已经是 /en 开头,先剥离再加(防止重复)
  if (p === EN_PREFIX || p.startsWith(EN_PREFIX + '/')) {
    p = p.slice(EN_PREFIX.length);
    if (!p.startsWith('/')) p = '/' + p;
  }
  if (lang === 'en') {
    // / → /en/,/tool/x/ → /en/tool/x/
    return p === '/' ? EN_PREFIX + '/' : EN_PREFIX + p;
  }
  return p;
}

/**
 * 获取当前语言对应的对端语言路径(用于语言切换器)
 * 当前在中文页 → 返回英文版 URL;当前在英文页 → 返回中文版 URL
 */
export function getOppositeLangPath(pathname: string): { lang: Language; path: string } {
  const currentLang = getLangFromUrl(pathname);
  const oppositeLang: Language = currentLang === 'zh' ? 'en' : 'zh';
  // 先剥离当前语言前缀得到"原始路径",再用目标语言重新生成
  let rawPath = pathname;
  if (currentLang === 'en') {
    rawPath = pathname.slice(EN_PREFIX.length);
    if (!rawPath.startsWith('/')) rawPath = '/' + rawPath;
    if (rawPath === '') rawPath = '/';
  }
  return { lang: oppositeLang, path: localizedPath(rawPath, oppositeLang) };
}

/**
 * 检查路径是否为根路径(任意语言)
 */
export function isRootPath(pathname: string): boolean {
  const lang = getLangFromUrl(pathname);
  const rawPath = lang === 'en' ? pathname.slice(EN_PREFIX.length) || '/' : pathname;
  return rawPath === '/' || rawPath === '';
}
