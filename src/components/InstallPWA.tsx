import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// 浏览器未公开 BeforeInstallPromptEvent 类型,这里只声明我们用到的字段
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  // 已安装成独立模式(Android Chrome / iOS Safari)
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  // iOS Safari
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return !!nav.standalone;
}

function isiOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  // iPadOS 13+ 也会被识别为 Mac,UA 含 Mac 且无 Chrome
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
}

export default function InstallPWA() {
  const { t, lang } = useLanguage();
  const isZh = lang === 'zh';
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 已安装或已关闭则不显示
    if (isStandalone()) return;

    // 本地关闭记录(localStorage,7 天内不再提示)
    try {
      const raw = localStorage.getItem('momo-pwa-install-dismissed');
      if (raw) {
        const ts = Number(raw);
        if (!Number.isNaN(ts) && Date.now() - ts < 7 * 24 * 60 * 60 * 1000) {
          setDismissed(true);
          return;
        }
      }
    } catch {}

    const onBeforeInstall = (e: Event) => {
      // 阻止浏览器自带的迷你安装条,改用我们的按钮
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferred(null);
      setShowIOSHint(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    // iOS 不支持 beforeinstallprompt,显示"添加到主屏幕"引导
    if (isiOS()) {
      const t = setTimeout(() => setShowIOSHint(true), 3000);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        window.removeEventListener('appinstalled', onAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const onClickInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'dismissed') {
      try { localStorage.setItem('momo-pwa-install-dismissed', String(Date.now())); } catch {}
      setDismissed(true);
    }
    setDeferred(null);
  };

  const onDismiss = () => {
    try { localStorage.setItem('momo-pwa-install-dismissed', String(Date.now())); } catch {}
    setDismissed(true);
    setShowIOSHint(false);
  };

  if (isStandalone() || dismissed) return null;

  // 桌面 / Android Chrome:有 beforeinstallprompt 时显示安装按钮
  if (deferred) {
    return (
      <button
        onClick={onClickInstall}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 animate-bounce-in"
        style={{
          background: 'var(--accent)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.35)',
        }}
        title={isZh ? '安装到桌面/手机,离线可用' : 'Install to desktop/home screen, works offline'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12" />
          <path d="m7 8 5-5 5 5" />
          <path d="M5 21h14" />
        </svg>
        <span className="hidden sm:inline">{isZh ? '安装应用' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari:显示"分享 → 添加到主屏幕"提示横幅
  if (showIOSHint) {
    return (
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] rounded-2xl p-3 shadow-lg flex items-start gap-3 animate-bounce-in"
        style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" />
            <path d="m7 8 5-5 5 5" />
            <path d="M5 21h14" />
          </svg>
        </div>
        <div className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
          {isZh ? (
            <>
              点击 Safari 底部的
              <svg className="inline align-middle mx-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="m16 6-4-4-4 4" />
                <path d="M12 2v13" />
              </svg>
              分享,选「添加到主屏幕」即可离线使用
            </>
          ) : (
            <>
              Tap Safari's
              <svg className="inline align-middle mx-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="m16 6-4-4-4 4" />
                <path d="M12 2v13" />
              </svg>
              Share → "Add to Home Screen" to install
            </>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-full p-1 hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
          aria-label={isZh ? '关闭' : 'Close'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return null;
}
