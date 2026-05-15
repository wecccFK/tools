"use client";

import React, { lazy, Suspense, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { chatComplete } from '../services/aiService';
import { HelpCircle, Loader2 } from 'lucide-react';
import { TOOLS } from '../constants';
import { Language } from '../i18n/translations';

// Lazy load all tools for better code splitting and performance
const LazyImageMatting = lazy(() => import('./image-matting').then(m => ({ default: m.ImageMatting })));
const LazyGraphPlotter = lazy(() => import('./GraphPlotter').then(m => ({ default: m.GraphPlotter })));
const LazyInternationalChess = lazy(() => import('./chess-games').then(m => ({ default: m.InternationalChess })));
const LazyChineseChess = lazy(() => import('./chess-games').then(m => ({ default: m.ChineseChess })));
const LazyGobangGame = lazy(() => import('./entertainment-tools').then(m => ({ default: m.GobangGame })));
const LazySnakeGame = lazy(() => import('./entertainment-tools').then(m => ({ default: m.SnakeGame })));
const LazyAiDetector = lazy(() => import('./ai-detector').then(m => ({ default: m.AiDetector })));
const LazyFingerprintGenerator = lazy(() => import('./SecurityPrivacyTools').then(m => ({ default: m.FingerprintGenerator })));
const LazyPasswordCrackSimulator = lazy(() => import('./SecurityPrivacyTools').then(m => ({ default: m.PasswordCrackSimulator })));
const LazyWebAssetExtractor = lazy(() => import('./AdvancedDevTools').then(m => ({ default: m.WebAssetExtractor })));
const LazyCodeToImage = lazy(() => import('./advanced-tools').then(m => ({ default: m.CodeToImage })));
const LazyAiRegexGenerator = lazy(() => import('./advanced-tools').then(m => ({ default: m.AiRegexGenerator })));
const LazyImageConverter = lazy(() => import('./ImageConverter').then(m => ({ default: m.ImageConverter })));
const LazyImageSplitter = lazy(() => import('./ImageSplitter').then(m => ({ default: m.ImageSplitter })));
const LazyAsciiGenerator = lazy(() => import('./AsciiGenerator').then(m => ({ default: m.AsciiGenerator })));
const LazyApiSpeedTest = lazy(() => import('./api-speed-test').then(m => ({ default: m.ApiSpeedTest })));
const LazyDateCalculator = lazy(() => import('./DateCalculator').then(m => ({ default: m.DateCalculator })));
const LazyMarkdownEditor = lazy(() => import('./MarkdownEditor').then(m => ({ default: m.MarkdownEditor })));
const LazyQrTools = lazy(() => import('./QrTools').then(m => ({ default: m.QrGenerator })));
const LazyGlassmorphismGen = lazy(() => import('./GlassmorphismGen').then(m => ({ default: m.GlassmorphismGen })));
const LazyExifViewer = lazy(() => import('./ExifViewer').then(m => ({ default: m.ExifViewer })));
const LazyStopwatch = lazy(() => import('./Stopwatch').then(m => ({ default: m.Stopwatch })));

// Inline lightweight tools to avoid loading overhead
import { 
  CaseConverter, 
  PasswordGenerator, 
  JsonFormatter 
} from './tool-implementations';
import { UnitConverter, AspectRatio } from './more-tools';
import { PomodoroTimer, UrlEncoder } from './high-retention-tools';
import { 
    LoanCalculator, 
    BmiCalculator, 
    TextCleanup, 
    TimestampConverter 
} from './FinanceHealthTools';
const LazyCodingTools = lazy(() => import('./CodingTools').then(m => ({ default: m.CodingTools })));
const LazyTextTools = lazy(() => import('./CodingTools').then(m => ({ default: m.TextTools })));
import { DataConverter } from './DataTools';
import { 
    LoremGenerator, 
    PasswordTester, 
    RandomGen, 
    AgeCalculator, 
    BaseConverter 
} from './ExtraUtils';
import { ColorConverter, GradientGenerator, FontPreview } from './DesignTools';
import { ImageCompression, ImageWatermark, UIExporter } from './ImageProTools';
import { IpFinder, JwtDecoder, CurrencyConverter } from './NetTools';
import { AboutPage, PrivacyPolicyPage, DisclaimerPage } from './StaticPages';

// Constants
const SITE_NAMES = {
    zh: 'MOMO工具箱',
    en: 'MOMO Toolbox'
};

const DEFAULT_TITLES = {
    zh: 'MOMO工具箱 - 极速、专业的在线工具集合',
    en: 'MOMO Toolbox - Fast, Professional Online Tools'
};

const MODE_OPTIONS = {
    zh: ['专业', '友好', '简明', '创意', '学术'],
    en: ['Professional', 'Friendly', 'Concise', 'Creative', 'Academic']
};

const ToolLoadingSkeleton = ({ lang }: { lang: Language }) => (
    <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-text-site/50">{lang === 'zh' ? '加载工具中...' : 'Loading tool...'}</p>
        </div>
    </div>
);

const AiEnhancer = () => {
    const { lang } = useLanguage();
    const [input, setInput] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [mode, setMode] = React.useState('Professional');

    const modeOptions = useMemo(() => MODE_OPTIONS[lang as keyof typeof MODE_OPTIONS], [lang]);

    const handleEnhance = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const resultText = await chatComplete(
                `Enhance the following text to be more ${mode}. Keep the original meaning but improve flow, grammar, and impact: \n\n"${input}"\n\nReturn ONLY the enhanced text. Do not include any explanations, reasoning, or markdown formatting blocks. Just the plain text.`,
                "You are a helpful text enhancer."
            );
            
            // Just in case it includes thought blocks like <thought>...</thought> we can strip it,
            let filteredText = resultText.replace(/[\s\S]*?<\/think>/gi, '').trim();
            
            setOutput(filteredText || (lang === 'zh' ? 'AI 无响应。' : 'No response from AI.'));
        } catch (e: any) {
            setOutput(lang === 'zh' ? `结合 AI 出现错误: ${e.message || '请检查您的 API 密钥配置'}` : `Error combining with AI: ${e.message || 'Please check your API key configuration'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {modeOptions.map(m => (
                    <button 
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${mode === m ? 'bg-primary text-white' : 'bg-secondary-site text-text-site/60 hover:bg-border-site'}`}
                    >
                        {m}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={lang === 'zh' ? "输入或粘贴您想要润色的文本..." : "Type or paste text you want to improve..."}
                    className="w-full h-48 p-4 bg-card-bg border border-border-site rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm text-text-site"
                />
                <div className="relative h-48 p-4 bg-secondary-site border border-border-site rounded-xl overflow-y-auto">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-card-bg/50 backdrop-blur-sm rounded-xl">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <p className="text-sm italic text-text-site/70 leading-relaxed whitespace-pre-wrap">
                            {output || (lang === 'zh' ? '润色后的文本将显示在这里...' : 'Refined text will appear here...')}
                        </p>
                    )}
                </div>
            </div>
            <button 
                onClick={handleEnhance} 
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
                {lang === 'zh' ? '使用 AI 润色' : 'Enhance with AI'}
            </button>
        </div>
    );
};

// --- End of ToolRenderer Helper Definitions ---


export const ToolRenderer = ({ toolId }: { toolId: string }) => {
  const { lang } = useLanguage();
  const toolInfo = TOOLS.find(t => t.id === toolId);
  const isZh = lang === 'zh';

  React.useEffect(() => {
    if (toolInfo) {
      const siteName = SITE_NAMES[lang];
      const toolTitle = toolInfo.seoTitle?.[isZh ? 'zh' : 'en']
        || `${toolInfo.name[isZh ? 'zh' : 'en']} - ${siteName}`;
      document.title = toolTitle;
      
      const description = toolInfo.seoDescription?.[isZh ? 'zh' : 'en']
        || toolInfo.description[isZh ? 'zh' : 'en'];
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);

      const canonicalUrl = `https://www.web-tools.top/tool/${toolId}`;
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    } else {
      document.title = DEFAULT_TITLES[lang];
    }

    return () => {
      document.title = DEFAULT_TITLES[lang];
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.setAttribute('href', 'https://www.web-tools.top/');
      }
    };
  }, [toolInfo, toolId, isZh, lang]);

  // Helper to wrap lazy components with Suspense
  const LazyTool = ({ component: Component }: { component: React.ComponentType }) => (
    <Suspense fallback={<ToolLoadingSkeleton lang={lang} />}>
      <Component />
    </Suspense>
  );

  const renderTool = () => {
    const toolMap: Record<string, React.ReactNode> = {
      // AI & Smart Tools - Lazy loaded
      'browser-fingerprint': <LazyTool component={LazyFingerprintGenerator} />,
      'password-crack-sim': <LazyTool component={LazyPasswordCrackSimulator} />,
      'asset-extractor': <LazyTool component={LazyWebAssetExtractor} />,
      'ascii-generator': <LazyTool component={LazyAsciiGenerator} />,
      'ai-regex': <LazyTool component={LazyAiRegexGenerator} />,
      'ai-detector': <LazyTool component={LazyAiDetector} />,
      'code-to-image': <LazyTool component={LazyCodeToImage} />,
      'ai-enhancer': <AiEnhancer />,
      'ai-smart-cutout': <LazyTool component={LazyImageMatting} />,
      
      // Image Pro Tools - Lazy loaded
      'image-converter': <LazyTool component={LazyImageConverter} />,
      'image-splitter': <LazyTool component={LazyImageSplitter} />,
      'img-compress': <ImageCompression />,
      'img-watermark': <ImageWatermark />,
      'ui-snapshot': <UIExporter />,
      'glassmorphism-gen': <LazyTool component={LazyGlassmorphismGen} />,
      'image-exif': <LazyTool component={LazyExifViewer} />,
      
      // Design & UI
      'color-converter': <ColorConverter />,
      'gradient-gen': <GradientGenerator />,
      'font-preview': <FontPreview />,
      
      // Dev & Coding Tools
      'markdown-editor': <LazyTool component={LazyMarkdownEditor} />,
      'csv-to-json': <DataConverter />,
      'base64': <LazyTool component={LazyCodingTools} />,
      'url-encoder': <LazyTool component={LazyCodingTools} />,
      'hash-generator': <LazyTool component={LazyCodingTools} />,
      'jwt-decoder': <JwtDecoder />,
      'json-formatter': <JsonFormatter />,
      'timestamp': <TimestampConverter />,
      'base-converter': <BaseConverter />,
      'api-speed-test': <LazyTool component={LazyApiSpeedTest} />,
      
      // Productivity & Utils
      'word-counter': <LazyTool component={LazyTextTools} />,
      'case-converter': <LazyTool component={LazyTextTools} />,
      'lorem-ipsum': <LoremGenerator />,
      'random-number': <RandomGen />,
      'password-strength': <PasswordTester />,
      'age-calculator': <AgeCalculator />,
      'currency': <CurrencyConverter />,
      'ip-finder': <IpFinder />,
      'date-calculator': <LazyTool component={LazyDateCalculator} />,
      'loan-calculator': <LoanCalculator />,
      'bmi-calculator': <BmiCalculator />,
      'text-cleanup': <TextCleanup />,
      'unit-converter': <UnitConverter />,
      'aspect-ratio': <AspectRatio />,
      'qr-generator': <LazyTool component={LazyQrTools} />,
      'qr-reader': <LazyTool component={LazyQrTools} />,
      'pomodoro-timer': <PomodoroTimer />,
      'graph-plotter': <LazyTool component={LazyGraphPlotter} />,
      'stopwatch': <LazyTool component={LazyStopwatch} />,

      // Entertainment - Lazy loaded
      'snake-game': <LazyTool component={LazySnakeGame} />,
      'gobang-game': <LazyTool component={LazyGobangGame} />,
      'chess-game': <LazyTool component={LazyInternationalChess} />,
      'xiangqi-game': <LazyTool component={LazyChineseChess} />,
      
      // Static Pages
      'about': <AboutPage />,
      'privacy': <PrivacyPolicyPage />,
      'disclaimer': <DisclaimerPage />,
    };

    return toolMap[toolId || ''] || <div className="p-8 text-center text-text-site/50 border-2 border-dashed border-border-site rounded-3xl">Coming soon...</div>;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Universal Instructions Block */}
      {toolInfo && (
        <div className="bg-secondary-site/50 border border-border-site rounded-2xl p-5 shadow-sm text-sm text-text-site/80 flex gap-4 mt-2">
            <div className="mt-0.5 text-primary">
                <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
                <h2 className="font-bold text-text-site text-base flex items-center gap-2">
                    {toolInfo.name[isZh ? 'zh' : 'en']} 
                    {isZh ? '使用说明' : 'Tutorial'}
                </h2>
                <p className="leading-relaxed">
                    {toolInfo.description[isZh ? 'zh' : 'en']}
                </p>
            </div>
        </div>
      )}

      {/* SEO Content Block */}
      {toolInfo?.seoContent && (
        <div className="bg-secondary-site/20 border border-border-site/50 rounded-2xl p-5 mt-2">
          <p className="text-xs leading-relaxed text-text-site/50">
            {toolInfo.seoContent[isZh ? 'zh' : 'en']}
          </p>
        </div>
      )}

      {/* Actual Tool Render */}
      <div className="w-full">
         {renderTool()}
      </div>
    </div>
  );
};
