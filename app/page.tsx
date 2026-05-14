/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Grid, Layout as LayoutIcon, Star, Type, Code, Image as ImageIcon, Zap, Gamepad2 } from 'lucide-react';
import { TOOLS } from '../src/constants';
import { Tool, ToolCategory } from '../src/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../src/lib/utils';
import { TranslationKey, Language } from '../src/i18n/translations';
import { useLanguage } from '../src/i18n/LanguageContext';
import { useStarredTools } from '../src/hooks/useStarredTools';
import Link from 'next/link';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Constants
const CATEGORIES: (ToolCategory | 'All')[] = ['All', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];
const EXCLUDED_TOOL_IDS = ['about', 'privacy', 'disclaimer'];
const GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6";

// Tag translations
const TAG_TRANSLATIONS: Record<string, { zh: string; en: string }> = {
    'ai': { zh: 'AI', en: 'AI' },
    'detector': { zh: '检测', en: 'Detector' },
    'writing': { zh: '写作', en: 'Writing' },
    'privacy': { zh: '隐私', en: 'Privacy' },
    'security': { zh: '安全', en: 'Security' },
    'fingerprint': { zh: '指纹', en: 'Fingerprint' },
    'password': { zh: '密码', en: 'Password' },
    'hacking': { zh: '黑客', en: 'Hacking' },
    'dev': { zh: '开发', en: 'Dev' },
    'scraping': { zh: '抓取', en: 'Scraping' },
    'assets': { zh: '资产', en: 'Assets' },
    'ascii': { zh: '字符画', en: 'ASCII' },
    'art': { zh: '艺术', en: 'Art' },
    'generator': { zh: '生成', en: 'Generator' },
    'text': { zh: '文本', en: 'Text' },
    'design': { zh: '设计', en: 'Design' },
    'copywriting': { zh: '文案', en: 'Copywriting' },
    'lorem': { zh: '假文', en: 'Lorem' },
    'tools': { zh: '工具', en: 'Tools' },
    'random': { zh: '随机', en: 'Random' },
    'date': { zh: '日期', en: 'Date' },
    'age': { zh: '年龄', en: 'Age' },
    'math': { zh: '数学', en: 'Math' },
    'css': { zh: 'CSS', en: 'CSS' },
    'typo': { zh: '排版', en: 'Typo' },
    'graphics': { zh: '图形', en: 'Graphics' },
    'optimizer': { zh: '优化', en: 'Optimizer' },
    'snapshot': { zh: '截图', en: 'Snapshot' },
    'networking': { zh: '网络', en: 'Network' },
    'auth': { zh: '认证', en: 'Auth' },
    'finance': { zh: '金融', en: 'Finance' },
    'travel': { zh: '旅行', en: 'Travel' },
    'image': { zh: '图像', en: 'Image' },
    'converter': { zh: '转换', en: 'Converter' },
    'api': { zh: 'API', en: 'API' },
    'llm': { zh: '大模型', en: 'LLM' },
    'regex': { zh: '正则', en: 'Regex' },
    'markdown': { zh: 'Markdown', en: 'Markdown' },
    'editor': { zh: '编辑', en: 'Editor' },
    'formatting': { zh: '格式', en: 'Format' },
    'analysis': { zh: '分析', en: 'Analysis' },
    'stats': { zh: '统计', en: 'Stats' },
    'json': { zh: 'JSON', en: 'JSON' },
    'productivity': { zh: '效率', en: 'Productivity' },
    'time': { zh: '时间', en: 'Time' },
    'coding': { zh: '编码', en: 'Coding' },
    'web': { zh: '网页', en: 'Web' },
    'game': { zh: '游戏', en: 'Game' },
    'fun': { zh: '娱乐', en: 'Fun' },
    'retro': { zh: '复古', en: 'Retro' },
    'board': { zh: '棋类', en: 'Board' },
    'chess': { zh: '象棋', en: 'Chess' },
    'xiangqi': { zh: '象棋', en: 'Xiangqi' },
    'health': { zh: '健康', en: 'Health' },
    'bmi': { zh: 'BMI', en: 'BMI' },
    'clean': { zh: '清理', en: 'Clean' },
    'marketing': { zh: '营销', en: 'Marketing' },
    'decoder': { zh: '解码', en: 'Decoder' },
    'split': { zh: '分割', en: 'Split' },
    'conversion': { zh: '转换', en: 'Conversion' },
    'loan': { zh: '贷款', en: 'Loan' },
    '函数': { zh: '函数', en: 'Function' },
    '图形': { zh: '图形', en: 'Graph' },
    '开发': { zh: '开发', en: 'Dev' },
    '社交媒体': { zh: '社交', en: 'Social' },
    '切图': { zh: '切图', en: 'Split' },
    '朋友圈': { zh: '朋友圈', en: 'Moments' },
    '贷款计算': { zh: '贷款', en: 'Loan' },
    '日期计算': { zh: '日期', en: 'Date' },
    '倒计时': { zh: '倒计时', en: 'Countdown' },
    '纪念日': { zh: '纪念日', en: 'Anniversary' },
};

const ToolCard = ({ 
    tool, 
    lang, 
    index, 
    isStarred, 
    onStar 
}: { 
    tool: Tool; 
    lang: Language; 
    index: number; 
    isStarred: boolean;
    onStar: (e: React.MouseEvent, id: string) => void;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="group relative bg-card-bg border border-border-site rounded-xl p-4 sm:p-5 cursor-pointer overflow-hidden transition-all duration-250 hover:border-border-hover hover:-translate-y-0.5 hover:bg-card-hover min-h-[120px] sm:min-h-[140px]"
    >
        <Link href={`/tool/${tool.id}`} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary/5 to-purple-site/5" />
        
        <div className="absolute top-3 right-3 z-10 flex gap-2">
            {tool.tags.slice(0, 1).map(tag => {
                const translation = TAG_TRANSLATIONS[tag.toLowerCase()] || TAG_TRANSLATIONS[tag] || { zh: tag, en: tag };
                const displayTag = lang === 'zh' ? translation.zh : translation.en;
                return (
                    <span key={tag} className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full tracking-wider font-rajdhani border",
                        tag.toLowerCase() === 'hot' ? "bg-pink-500/10 text-pink-500 border-pink-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                    )}>
                        {displayTag.toUpperCase()}
                    </span>
                );
            })}
            <button 
                onClick={(e) => onStar(e, tool.id)}
                className="text-text-muted hover:text-primary transition-colors focus:outline-none ml-1 z-10"
            >
                <Star className={cn("w-4 h-4", isStarred && "fill-primary text-primary")} />
            </button>
        </div>

        <div className="relative z-10">
            <div className="mb-3 text-text-site/80 group-hover:text-primary transition-colors">
                <tool.icon className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-medium text-text-site mb-1.5 line-clamp-1">{tool.name[lang]}</h3>
            <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{tool.description[lang]}</p>
        </div>
    </motion.div>
);


export default function HomePage() {
    const { lang, t } = useLanguage();
    const isZh = lang === 'zh';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
    const [isDark, setIsDark] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [showBookmarkBanner, setShowBookmarkBanner] = useState(false);
    const { starredIds, starredTools, isStarred, toggleStar } = useStarredTools();

    const handleToggleStar = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        toggleStar(id);
    }, [toggleStar]);

    const filteredTools = useMemo(() => {
        return TOOLS.filter(tool => {
            if (EXCLUDED_TOOL_IDS.includes(tool.id)) return false;
            
            const toolName = tool.name[lang].toLowerCase();
            const toolDesc = tool.description[lang].toLowerCase();
            const sq = searchQuery.toLowerCase();
            const matchesSearch = toolName.includes(sq) || toolDesc.includes(sq);
            const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [lang, searchQuery, activeCategory]);

    const groupedTools = useMemo(() => {
        return CATEGORIES.filter(c => c !== 'All').map(cat => ({
            category: cat,
            tools: filteredTools.filter(t => t.category === cat && !(activeCategory === 'All' && !searchQuery && starredIds.includes(t.id)))
        })).filter(group => group.tools.length > 0);
    }, [filteredTools, activeCategory, searchQuery, starredIds]);

    useEffect(() => {
        try {
             const t = localStorage.getItem('tb-theme');
             if (t === 'dark') {
                  setIsDark(true);
             }
        } catch(e) {}
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('tb-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <div className="min-h-screen relative z-10">
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isDark={isDark}
                setIsDark={setIsDark}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                showInstallBanner={showInstallBanner}
                setShowInstallBanner={setShowInstallBanner}
                showBookmarkBanner={showBookmarkBanner}
                setShowBookmarkBanner={setShowBookmarkBanner}
            />

            <Sidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
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
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                                    activeCategory === cat 
                                        ? "bg-primary text-white shadow-lg shadow-primary/25" 
                                        : "bg-secondary-site text-text-site/60 hover:bg-card-hover"
                                )}
                            >
                                <CategoryIcon className="w-4 h-4" />
                                {t(`category.${cat}` as TranslationKey) || cat}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile Search */}
                <div className="md:hidden mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder={isZh ? '搜索工具...' : 'Search tools...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-secondary-site border border-border-site rounded-xl text-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Tool Grid */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-20"
                    >
                        {searchQuery ? (
                            <div className={GRID_CLASS}>
                                {filteredTools.map((tool, index) => (
                                    <ToolCard key={tool.id} tool={tool} lang={lang} index={index} isStarred={isStarred(tool.id)} onStar={handleToggleStar} />
                                ))}
                            </div>
                        ) : (
                            <>
                                {activeCategory === 'All' && starredTools.length > 0 && (
                                    <section className="space-y-8 p-8 bg-primary/5 rounded-[48px] border border-primary/10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-4">
                                                <Star className="w-4 h-4 fill-primary" /> {t('menu.starred' as TranslationKey)}
                                            </h3>
                                            <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-full">{starredTools.length}</span>
                                        </div>
                                        <div className={GRID_CLASS}>
                                            {starredTools.map((tool, index) => (
                                                <ToolCard key={tool.id} tool={tool} lang={lang} index={index} isStarred={true} onStar={handleToggleStar} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {activeCategory === 'All' ? groupedTools.map(group => (
                                    <section key={group.category} className="space-y-8">
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-site/20 border-b border-border-site/50 pb-4">
                                            {t(`category.${group.category}` as TranslationKey) || group.category}
                                        </h3>
                                        <div className={GRID_CLASS}>
                                            {group.tools.map((tool, index) => (
                                                <ToolCard key={tool.id} tool={tool} lang={lang} index={index} isStarred={isStarred(tool.id)} onStar={handleToggleStar} />
                                            ))}
                                        </div>
                                    </section>
                                )) : (
                                    <div className={GRID_CLASS}>
                                        {filteredTools.map((tool, index) => (
                                            <ToolCard key={tool.id} tool={tool} lang={lang} index={index} isStarred={isStarred(tool.id)} onStar={handleToggleStar} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
