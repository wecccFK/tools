import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Grid, Layout as LayoutIcon, Star, Moon, Sun, Menu, X, Info, ShieldCheck, AlertTriangle, Type, Code, Image as ImageIcon, Zap, Gamepad2, Download, BookmarkPlus, Globe, Home } from 'lucide-react';
import { TOOLS } from '../constants';
import { Tool, ToolCategory } from '../types';
import { ToolRenderer } from './ToolRenderer';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { TranslationKey, Language } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AboutPage, PrivacyPolicyPage, DisclaimerPage } from './StaticPages';
import { useStarredTools } from '../hooks/useStarredTools';

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
    'about': { zh: '关于', en: 'About' },
    'contact': { zh: '联系', en: 'Contact' },
    'info': { zh: '信息', en: 'Info' },
    'legal': { zh: '法律', en: 'Legal' },
    'disclaimer': { zh: '免责', en: 'Disclaimer' },
    'terms': { zh: '条款', en: 'Terms' },
    'featured': { zh: '精选', en: 'Featured' },
    'sponsored': { zh: '赞助', en: 'Sponsored' },
    'deallink': { zh: '优惠', en: 'Deal' },
    'hot': { zh: '热门', en: 'HOT' },
    // Chinese tags mapping
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
    onClick, 
    isStarred, 
    onStar 
}: { 
    tool: Tool; 
    lang: Language; 
    index: number; 
    onClick: () => void;
    isStarred: boolean;
    onStar: (e: React.MouseEvent, id: string) => void;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className="group relative bg-card-bg border border-border-site rounded-xl p-4 sm:p-5 cursor-pointer overflow-hidden transition-all duration-250 hover:border-border-hover hover:-translate-y-0.5 hover:bg-card-hover min-h-[120px] sm:min-h-[140px]"
    >
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
                className="text-text-muted hover:text-primary transition-colors focus:outline-none ml-1"
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

const ToolGridView = ({ 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory 
}: { 
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    activeCategory: ToolCategory | 'All';
    setActiveCategory: (c: ToolCategory | 'All') => void;
}) => {
    const navigate = useNavigate();
    const { lang, t } = useLanguage();
    const { starredIds, starredTools, isStarred, toggleStar } = useStarredTools();

    const handleToggleStar = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        toggleStar(id);
    }, [toggleStar]);

    const handleToggleStarSimple = useCallback((id: string) => {
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

    const starredToolsList = starredTools;

    return (
        <div className="space-y-12">
            {/* Search bar removed as requested by user - already present in header */}

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
                                <ToolCard key={tool.id} tool={tool} lang={lang} index={index} onClick={() => navigate(`/tool/${tool.id}`)} isStarred={isStarred(tool.id)} onStar={handleToggleStar} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {activeCategory === 'All' && starredToolsList.length > 0 && (
                                <section className="space-y-8 p-8 bg-primary/5 rounded-[48px] border border-primary/10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-4">
                                            <Star className="w-4 h-4 fill-primary" /> {t('menu.starred' as TranslationKey)}
                                        </h3>
                                        <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-full">{starredToolsList.length}</span>
                                    </div>
                                    <div className={GRID_CLASS}>
                                        {starredToolsList.map((tool, index) => (
                                            <ToolCard key={tool.id} tool={tool} lang={lang} index={index} onClick={() => navigate(`/tool/${tool.id}`)} isStarred={true} onStar={handleToggleStar} />
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
                                            <ToolCard key={tool.id} tool={tool} lang={lang} index={index} onClick={() => navigate(`/tool/${tool.id}`)} isStarred={isStarred(tool.id)} onStar={handleToggleStar} />
                                        ))}
                                    </div>
                                </section>
                            )) : (
                                <div className={GRID_CLASS}>
                                    {filteredTools.map((tool, index) => (
                                        <ToolCard key={tool.id} tool={tool} lang={lang} index={index} onClick={() => navigate(`/tool/${tool.id}`)} isStarred={isStarred(tool.id)} onStar={handleToggleStar} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const ToolDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { lang, t } = useLanguage();
    const tool = TOOLS.find(t => t.id === id);
    const { isStarred, toggleStar } = useStarredTools();

    // Refresh ads when tool changes
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.log('Ad refresh error:', e);
        }
    }, [id]);

    const handleToggleStar = () => {
        if (!id) return;
        toggleStar(id);
    };

    if (!tool) return <div className="text-center py-20 font-black opacity-20">Tool not found</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-6"
        >
            <div className="bg-card-bg border border-border-site rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-purple-500 opacity-70" />
                
                <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-border-site">
                    <tool.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
                    <h1 className="font-rajdhani text-lg sm:text-xl font-semibold tracking-wide text-text-site">
                        {tool.name[lang]}
                    </h1>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-muted hover:text-pink-500 border border-border-hover rounded-md hover:border-pink-500/50 transition-all font-sans"
                    >
                        ✕ 关闭
                    </button>
                    <button 
                        onClick={handleToggleStar}
                        className="flex items-center justify-center p-1.5 text-text-muted hover:text-primary border border-transparent hover:border-border-hover rounded-md transition-all h-[30px] w-[30px]"
                    >
                        <Star className={cn("w-4 h-4", isStarred(id || '') && "fill-primary text-primary")} />
                    </button>
                </div>

                <div className="overflow-x-hidden min-h-[400px]">
                    <ToolRenderer toolId={id || null} />
                </div>
            </div>
            
            {/* Top/Bottom Ad Spot for Workspace Page - Good for AdSense */}
            <div className="max-w-6xl mx-auto my-8 flex justify-center">
                <ins className="adsbygoogle"
                    style={{display: 'block', width: '100%', minHeight: '90px'}}
                    data-ad-client="ca-pub-1315335444091074"
                    data-ad-slot="workspace-bottom"
                    data-ad-format="auto"
data-full-width-responsive="true"></ins>
            </div>
        </motion.div>
    );
};

// Note: ToolDetailView is defined below AppLayout in this file

const ToolboxLogo = () => (
    <div className="py-2 px-1 font-sans tracking-[2px] text-[20px] sm:text-[22px] font-bold text-primary leading-tight flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center text-white font-black mr-2 shadow-sm">
            M
        </div>
        <div>
            Momo工具箱
            <span className="block text-[10px] sm:text-[11px] font-normal tracking-[1px] mt-0.5 text-text-muted">
                在线工具箱
            </span>
        </div>
    </div>
);

export const AppLayout = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    // Search and Category State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

    // I18n and Theme
    const { lang, setLang, t } = useLanguage();
    const isZh = lang === 'zh';
    const [isDark, setIsDark] = useState(false); // Default to Light mode
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // PWA Install State
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    // Bookmark State
    const [showBookmarkBanner, setShowBookmarkBanner] = useState(false);

    useEffect(() => {
        // PWA Install Prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            
            // Only show if user hasn't dismissed it before
            const dismissed = localStorage.getItem('pwa-install-dismissed');
            if (!dismissed && !localStorage.getItem('pwa-installed')) {
                setShowInstallBanner(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if already installed
        const isInstalled = localStorage.getItem('pwa-installed');
        
        // Show bookmark banner only if:
        // 1. Not already installed
        // 2. Not dismissed before
        // 3. Not on mobile (where PWA install is more relevant)
        const bookmarkDismissed = localStorage.getItem('bookmark-banner-dismissed');
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (!isInstalled && !bookmarkDismissed && !isMobile) {
            setTimeout(() => {
                setShowBookmarkBanner(true);
            }, 3000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            localStorage.setItem('pwa-installed', 'true');
            setShowInstallBanner(false);
        }
        
        setDeferredPrompt(null);
    };

    const handleInstallDismiss = () => {
        localStorage.setItem('pwa-install-dismissed', 'true');
        setShowInstallBanner(false);
    };

    const handleBookmarkDismiss = () => {
        localStorage.setItem('bookmark-banner-dismissed', 'true');
        setShowBookmarkBanner(false);
    };

    const handleBookmarkClick = () => {
        setShowBookmarkBanner(false);
        // Show bookmark instructions
        alert(isZh 
            ? '按 Ctrl+D (Windows) 或 Cmd+D (Mac) 添加书签' 
            : 'Press Ctrl+D (Windows) or Cmd+D (Mac) to add bookmark');
    };

    useEffect(() => {
        // Read theme from local storage or default to false
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // AdSense SPA PageView Update
        const timer = setTimeout(() => {
            try {
                if (typeof window !== 'undefined' && window.adsbygoogle) {
                    (window.adsbygoogle as any[]).push({});
                }
            } catch (e) {
                // Silently skip AdSense errors
            }
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [pathname]);

    const categories = CATEGORIES;
    
    const { starredTools } = useStarredTools();
    const starredToolsList = starredTools;

    return (
        <div className="min-h-screen bg-bg-site text-text-site font-sans selection:bg-primary selection:text-white transition-colors duration-200 pb-[env(safe-area-inset-bottom)]">
            {/* PWA Install Banner */}
            <AnimatePresence>
                {showInstallBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-primary/90 to-purple-site/90 backdrop-blur-md border-b border-white/10"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-white" />
                                <span className="text-sm font-semibold text-white">
                                    {isZh ? '安装 Momo工具箱 到主屏幕' : 'Install Momo Toolbox to Home Screen'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleInstallDismiss}
                                    className="px-3 py-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors"
                                >
                                    {isZh ? '取消' : 'Cancel'}
                                </button>
                                <button
                                    onClick={handleInstallClick}
                                    className="px-4 py-1.5 text-xs font-bold bg-white text-primary rounded-lg hover:bg-white/90 transition-colors"
                                >
                                    {isZh ? '安装' : 'Install'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bookmark Banner */}
            <AnimatePresence>
                {showBookmarkBanner && !showInstallBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-md border-b border-white/10"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookmarkPlus className="w-5 h-5 text-white" />
                                <span className="text-sm font-semibold text-white">
                                    {isZh ? '添加书签以便快速访问' : 'Add bookmark for quick access'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleBookmarkDismiss}
                                    className="px-3 py-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors"
                                >
                                    {isZh ? '关闭' : 'Close'}
                                </button>
                                <button
                                    onClick={handleBookmarkClick}
                                    className="px-4 py-1.5 text-xs font-bold bg-white text-primary rounded-lg hover:bg-white/90 transition-colors"
                                >
                                    {isZh ? '添加书签' : 'Add Bookmark'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
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
                                <div className="cursor-pointer" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
                                    <ToolboxLogo />
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-text-site/40 hover:text-primary">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
                                <nav className="space-y-1">
                                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-site/30 mb-4">{t('menu.categories' as TranslationKey)}</p>
                                    {categories.map(cat => {
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
                                                    setActiveCategory(cat);
                                                    navigate('/');
                                                    setIsMenuOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-3 rounded-2xl text-sm font-bold transition-all group",
                                                    pathname === '/' && activeCategory === cat ? "bg-primary/10 text-primary shadow-sm" : "text-text-site/60 hover:bg-secondary-site"
                                                )}
                                            >
                                                <span className="flex items-center gap-4">
                                                    <CategoryIcon className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === '/' && activeCategory === cat ? "text-primary" : "text-text-site/20")} />
                                                    {t(`category.${cat}` as TranslationKey) || cat}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>

                                <nav className="space-y-1">
                                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-site/30 mb-4">{t('menu.starred' as TranslationKey)}</p>
                                    {starredToolsList.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-1">
                                            {starredToolsList.map(tool => (
                                                <button
                                                    key={tool.id}
                                                    onClick={() => {
                                                        navigate(`/tool/${tool.id}`);
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-sm font-medium text-text-site/60 hover:bg-secondary-site transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-secondary-site flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <tool.icon className="w-4 h-4 opacity-70" />
                                                    </div>
                                                    <span className="truncate">{tool.name[lang]}</span>
                                                </button>
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

                            <div className="p-4 border-t border-border-site bg-card-bg/50">
                                <button 
                                    onClick={() => {
                                        setIsDark(!isDark);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-secondary-site border border-border-site rounded-2xl text-sm font-semibold text-text-site/80 hover:text-primary transition-all group"
                                >
                                    <span className="flex items-center gap-2">
                                        {isDark ? <Moon className="w-4 h-4 text-purple-500" /> : <Moon className="w-4 h-4 text-orange-500" />}
                                        {isZh ? '暗色模式' : 'Dark Mode'}
                                    </span>
                                    <div className={cn("w-10 h-5 rounded-full p-0.5 transition-colors duration-300", isDark ? "bg-primary" : "bg-border-site")}>
                                        <div className={cn("w-4 h-4 bg-white rounded-full transition-transform duration-300", isDark ? "translate-x-5" : "translate-x-0")} />
                                    </div>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Side Navigation */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-border-site bg-card-bg/30 backdrop-blur-3xl z-40">
                <div className="p-4 border-b border-border-site cursor-pointer hover:bg-white/5 transition-colors" onClick={() => navigate('/')}>
                    <ToolboxLogo />
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth no-scrollbar">
                    <nav className="space-y-1">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-site/30 mb-4">{t('menu.categories' as TranslationKey)}</p>
                        {categories.map(cat => {
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
                                    onClick={() => { setActiveCategory(cat); navigate('/'); }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                                        pathname === '/' && activeCategory === cat ? "bg-primary/10 text-primary shadow-sm" : "text-text-site/60 hover:text-primary hover:bg-secondary-site"
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        <CategoryIcon className={cn("w-4 h-4 transition-transform group-hover:scale-110", pathname === '/' && activeCategory === cat ? "text-primary" : "text-text-site/30")} />
                                        {t(`category.${cat}` as TranslationKey) || cat}
                                    </span>
                                    {pathname === '/' && activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </button>
                            );
                        })}
                    </nav>

                    <nav className="space-y-1">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-site/30 mb-4">{t('menu.starred' as TranslationKey)}</p>
                        {starredToolsList.length > 0 ? (
                            starredToolsList.map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => navigate(`/tool/${tool.id}`)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-text-site/60 hover:text-primary hover:bg-secondary-site transition-all group"
                                >
                                    <tool.icon className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                                    <span className="truncate">{tool.name[lang]}</span>
                                </button>
                            ))
                        ) : (
                            <p className="px-3 text-[10px] italic text-text-site/20 lowercase">{t('menu.stars_none' as TranslationKey)}</p>
                        )}
                    </nav>
                </div>

                <div className="p-4 mt-auto border-t border-border-site space-y-2">
                    <button 
                        onClick={() => navigate('/about')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-text-site/40 hover:text-primary transition-all"
                    >
                        <Info className="w-4 h-4" /> {isZh ? '关于我们' : 'About Us'}
                    </button>
                    <button 
                        onClick={() => navigate('/privacy')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-text-site/40 hover:text-primary transition-all"
                    >
                        <ShieldCheck className="w-4 h-4" /> {isZh ? '隐私政策' : 'Privacy Policy'}
                    </button>
                    <button 
                        onClick={() => navigate('/disclaimer')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-text-site/40 hover:text-primary transition-all"
                    >
                        <AlertTriangle className="w-4 h-4" /> {isZh ? '免责声明' : 'Disclaimer'}
                    </button>
                    <div className="px-2">
                        <button 
                            onClick={() => setIsDark(!isDark)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-secondary-site border border-border-site rounded-2xl text-sm font-semibold text-text-site/80 hover:text-primary transition-all group"
                        >
                            <span className="flex items-center gap-2">
                                {isDark ? <Moon className="w-4 h-4 text-purple-500" /> : <Moon className="w-4 h-4 text-orange-500" />}
                                {isZh ? '暗色模式' : 'Dark Mode'}
                            </span>
                            <div className={cn("w-10 h-5 rounded-full p-0.5 transition-colors duration-300", isDark ? "bg-primary" : "bg-border-site")}>
                                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform duration-300", isDark ? "translate-x-5" : "translate-x-0")} />
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Navigation / Header */}
            <header className="sticky top-0 z-40 bg-card-bg/80 backdrop-blur-md border-b border-border-site transition-colors duration-200 lg:left-64 lg:w-[calc(100%-16rem)]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-4 lg:hidden">
                        <button 
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-text-site/40 hover:text-primary transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="cursor-pointer group mt-1"
                            onClick={() => navigate('/')}
                        >
                            <span className="font-rajdhani font-bold text-[18px] tracking-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                Momo工具箱
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-1 max-w-lg md:mx-0 ml-2 md:ml-0 min-w-0">
                        <div className="relative group flex items-center">
                            <Search className="absolute left-3 w-4 h-4 text-text-site/30 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder={t('search.placeholder')}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (pathname !== '/') navigate('/');
                                }}
                                onClick={() => {
                                    if (pathname !== '/') navigate('/');
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-secondary-site border border-border-site rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-site/30"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 ml-2 shrink-0">
                        <button 
                            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                            className="flex items-center gap-1 sm:gap-1.5 text-[10px] font-black text-text-site/40 hover:text-primary transition-colors uppercase tracking-[0.2em]"
                        >
                            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">{lang}</span>
                        </button>
                        <button onClick={() => { navigate('/'); setSearchQuery(''); setActiveCategory('All'); }} className="p-1.5 sm:p-2 border border-border-site rounded-xl text-text-site/30 hover:text-primary">
                            <Home className="w-4 h-4 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <div className={cn("transition-all duration-300", "lg:ml-64")}>
                <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-16 pb-32 md:pb-16">
                    <Routes>
                        <Route path="/" element={
                            <ToolGridView 
                                searchQuery={searchQuery} 
                                setSearchQuery={setSearchQuery} 
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                            />
                        } />
                        <Route path="/tool/:id" element={<ToolDetailView />} />
                        <Route path="/about" element={<div className="max-w-4xl mx-auto py-12"><AboutPage /></div>} />
                        <Route path="/privacy" element={<div className="max-w-4xl mx-auto py-12"><PrivacyPolicyPage /></div>} />
                        <Route path="/disclaimer" element={<div className="max-w-4xl mx-auto py-12"><DisclaimerPage /></div>} />
                        <Route path="*" element={<div className="text-center py-20 opacity-20 font-black">404 - Page Not Found</div>} />
                    </Routes>
                </main>

                <footer className="py-32 border-t border-border-site bg-card-bg/20">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="grid md:grid-cols-2 gap-16">
                            <div className="space-y-4">
                                <div className="cursor-pointer inline-block" onClick={() => navigate('/')}>
                                    <ToolboxLogo />
                                </div>
                                <p className="text-sm text-text-site/40 max-w-sm leading-loose">
                                    {t('footer.description')}
                                </p>
                            </div>
                            <div className="flex flex-col md:items-end justify-between gap-8">
                                <div className="flex gap-12">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{isZh ? '关于' : 'Trust'}</p>
                                        <nav className="flex flex-col gap-2">
                                            <button onClick={() => navigate('/about')} className="text-xs font-bold text-text-site/40 hover:text-primary transition-colors cursor-pointer capitalize text-left">{isZh ? '关于我们' : 'About Us'}</button>
                                            <button onClick={() => navigate('/privacy')} className="text-xs font-bold text-text-site/40 hover:text-primary transition-colors cursor-pointer capitalize text-left">{isZh ? '隐私政策' : 'Privacy Policy'}</button>
                                            <button onClick={() => navigate('/disclaimer')} className="text-xs font-bold text-text-site/40 hover:text-primary transition-colors cursor-pointer capitalize text-left">{isZh ? '免责声明' : 'Disclaimer'}</button>
                                        </nav>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-site/20">{t('footer.copyright')}</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
