/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, Download, BookmarkPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../src/i18n/LanguageContext';
import Link from 'next/link';

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

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  showInstallBanner: boolean;
  setShowInstallBanner: (show: boolean) => void;
  showBookmarkBanner: boolean;
  setShowBookmarkBanner: (show: boolean) => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  isDark,
  setIsDark,
  isMenuOpen,
  setIsMenuOpen,
  showInstallBanner,
  setShowInstallBanner,
  showBookmarkBanner,
  setShowBookmarkBanner,
}: HeaderProps) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed && !localStorage.getItem('pwa-installed')) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isInstalled = localStorage.getItem('pwa-installed');
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
  }, [setShowInstallBanner, setShowBookmarkBanner]);

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
    alert(isZh 
      ? '按 Ctrl+D (Windows) 或 Cmd+D (Mac) 添加书签' 
      : 'Press Ctrl+D (Windows) or Cmd+D (Mac) to add bookmark');
  };

  return (
    <>
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

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg/80 backdrop-blur-xl border-b border-border-site">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <ToolboxLogo />
            
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder={isZh ? '搜索工具...' : 'Search tools...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-secondary-site border border-border-site rounded-xl text-sm focus:outline-none focus:border-primary w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-text-muted hover:text-primary transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-text-muted hover:text-primary transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
