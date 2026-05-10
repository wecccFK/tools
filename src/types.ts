import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'Text' | 'Developer' | 'Image' | 'Productivity' | 'Entertainment';

export interface BilingualText {
  en: string;
  zh: string;
}

export interface Tool {
  id: string;
  name: BilingualText;
  description: BilingualText;
  category: ToolCategory;
  icon: LucideIcon;
  tags: string[];
  seoTitle?: BilingualText;
  seoDescription?: BilingualText;
  seoContent?: BilingualText;
}

export type ToolComponentProps = {
  // Common props for tool components if needed
};
