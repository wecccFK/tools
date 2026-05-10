import { ToolCategory } from '../types';

export type Category = ToolCategory | 'All';

export const CATEGORIES: Category[] = ['All', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];

// Category display names by key (for i18n)
export const CATEGORY_KEYS: Record<Category, string> = {
  'All': 'All',
  'Text': 'Text',
  'Developer': 'Developer', 
  'Image': 'Image',
  'Productivity': 'Productivity',
  'Entertainment': 'Entertainment',
};