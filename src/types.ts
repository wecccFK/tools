import type { Language } from './i18n/translations';

export type ToolCategory = 'Text' | 'Developer' | 'Image' | 'Productivity' | 'Entertainment';

export interface Tool {
  id: string;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  category: ToolCategory;
  tags: string[];
  // SEO 元数据
  seoTitle?: { zh: string; en: string };
  seoDescription?: { zh: string; en: string };
  // 使用说明
  tutorial?: { zh: string; en: string };
}
