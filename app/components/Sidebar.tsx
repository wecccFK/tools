/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { Grid, Layout as LayoutIcon, Star, X, Type, Code, Image as ImageIcon, Zap, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../src/lib/utils';
import { TranslationKey, Language } from '../../src/i18n/translations';
import { ToolCategory } from '../../src/types';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { useStarredTools } from '../../src/hooks/useStarredTools';
import { TOOLS } from '../../src/constants';
import Link from 'next/link';

const CATEGORIES: (ToolCategory | 'All')[] = ['All', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];

const ToolboxLogo = () => (
  <Link href="/" className="py-2 px-1 font-sans tracking-[2px] text-[20px] sm:text-[22px] font-bold text-primary leading-tight flex items-center">
    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center text-white font-black mr-2 shadow-sm">
      M
    </div>
    <div>
      Momo工具箱
      <span className="block text-[10px] sm:text-[11px] font-normal tracking-[1px] mt-0.5 text-text-muted">
        在线工具箱
      </span>
    </div>
  </Link>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: ToolCategory | 'All';
  onCategoryChange: (cat: ToolCategory | 'All') => void;
}

export default function Sidebar({ isOpen, onClose, activeCategory, onCategoryChange }: SidebarProps) {
  const { lang, t } = useLanguage();
  const { starredTools } = useStarredTools();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-screen w-[85%] max-w-[320px] bg-card-bg z-[70] lg:hidden flex flex-col border-r border-border-site"
          >
            <div className="p-4 flex items-center justify-between border-b border-border-site">
              <ToolboxLogo />
              <button onClick={onClose} className="p-2 text-text-site/40 hover:text-primary">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
              <nav className="space-y-1">
                <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-site/30 mb-4">{t('menu.categories' as TranslationKey)}</p>
                {CATEGORIES.map(cat => {
                  let CategoryIcon = Grid;
                  if (cat === 'All') CategoryIcon = LayoutIcon;
                  if (cat === 'Text') CategoryIcon = Type;
                  if (cat === 'Developer') CategoryIcon = Code;
                  if (cat === 'Image') CategoryIcon = ImageIcon;
                  if (cat === 'Productivity') CategoryIcon = Zap;
                  if (cat === 'Entertainment') CategoryIcon = Gamepad2;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        onCategoryChange(cat);
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-3 rounded-2xl text-sm font-bold transition-all group",
                        activeCategory === cat ? "bg-primary/10 text-primary shadow-sm" : "text-text-site/60 hover:bg-secondary-site"
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <CategoryIcon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeCategory === cat ? "text-primary" : "text-text-site/20")} />
                        {t(`category.${cat}` as TranslationKey) || cat}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <nav className="space-y-1">
                <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-site/30 mb-4">{t('menu.starred' as TranslationKey)}</p>
                {starredTools.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {starredTools.map(tool => (
                      <Link
                        key={tool.id}
                        href={`/tool/${tool.id}`}
                        onClick={onClose}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-sm font-medium text-text-site/60 hover:bg-secondary-site transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary-site flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <tool.icon className="w-4 h-4 opacity-70" />
                        </div>
                        <span className="truncate">{tool.name[lang]}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-6 rounded-2xl bg-secondary-site/30 border border-dashed border-border-site/50 text-center">
                    <Star className="w-5 h-5 text-text-site/10 mx-auto mb-2" />
                    <p className="text-[10px] font-medium text-text-site/20">{t('menu.stars_none' as TranslationKey)}</p>
                  </div>
                )}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
