import type { Language } from './translations';

// 在 Astro frontmatter（服务端）调用：从 URL cookie 或 header 推断语言
// 默认中文，因为没有 SSR，我们用客户端语言切换 + localStorage 持久化
export function getDefaultLanguage(): Language {
  return 'zh';
}

// 客户端使用的语言上下文（React 端）
export const LANGUAGE_STORAGE_KEY = 'momo-lang';
