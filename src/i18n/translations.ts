// 中英双语翻译表
export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    'site.name': 'Momo工具箱',
    'site.tagline': '在线工具集合',
    'site.description': '极速、专业的在线工具集合。所有数据浏览器本地处理，即开即用，保护隐私。',
    'hero.badge': '13+ 精选工具',
    'hero.title': '让工具更温暖一些',
    'hero.subtitle': '所有数据浏览器本地处理，即开即用，保护隐私。',
    'search.placeholder': '搜索工具...',
    'search.shortcut': '⌘K',
    'search.empty': '没有找到匹配的工具',
    'category.all': '全部',
    'category.text': '文本',
    'category.developer': '开发者',
    'category.image': '图像',
    'category.productivity': '效率',
    'category.entertainment': '娱乐',
    'category.starred': '收藏',
    'tool.tutorial': '使用说明',
    'tool.viewTutorial': '查看详细教程 →',
    'tool.copy': '复制',
    'tool.copied': '已复制',
    'common.back': '返回首页',
    'common.loading': '加载中...',
    'starred.title': '我的收藏',
    'starred.empty': '还没有收藏工具，点击工具卡片右上角的星标添加',
    'starred.count': '个收藏',
    'tools.count': '个工具',
  },
  en: {
    'site.name': 'Momo Toolbox',
    'site.tagline': 'Online Tools',
    'site.description': 'Fast, professional online tools. All data processed locally in your browser, instant and privacy-friendly.',
    'hero.badge': '13+ Curated Tools',
    'hero.title': 'Tools, but warmer',
    'hero.subtitle': 'All data processed locally in your browser, instant and privacy-friendly.',
    'search.placeholder': 'Search tools...',
    'search.shortcut': '⌘K',
    'search.empty': 'No matching tools found',
    'category.all': 'All',
    'category.text': 'Text',
    'category.developer': 'Developer',
    'category.image': 'Image',
    'category.productivity': 'Productivity',
    'category.entertainment': 'Entertainment',
    'category.starred': 'Starred',
    'tool.tutorial': 'Tutorial',
    'tool.viewTutorial': 'View detailed tutorial →',
    'tool.copy': 'Copy',
    'tool.copied': 'Copied',
    'common.back': 'Back to Home',
    'common.loading': 'Loading...',
    'starred.title': 'My Starred',
    'starred.empty': 'No starred tools yet. Click the star icon on any tool card to add it here.',
    'starred.count': 'starred',
    'tools.count': 'tools',
  },
} as const;

export type TranslationKey = keyof typeof translations['zh'];

export function t(lang: Language, key: TranslationKey): string {
  const table = translations[lang] || translations.zh;
  return table[key] || translations.zh[key] || key;
}

// 分类显示名快捷查询
export function categoryLabel(lang: Language, cat: string): string {
  // 归一化：All -> all, Text -> Text（分类键本身是 PascalCase，翻译键全小写只对 all）
  const lower = cat.toLowerCase();
  const key = (`category.${lower}`) as TranslationKey;
  return t(lang, key);
}
