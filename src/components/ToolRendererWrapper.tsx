'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { TOOLS } from '@/constants';

const modules: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'ai-detector': () => import('@/components/ai-detector').then(m => ({ default: m.AiDetector })),
  'ascii-generator': () => import('@/components/AsciiGenerator').then(m => ({ default: m.AsciiGenerator })),
  'ai-smart-cutout': () => import('@/components/image-matting').then(m => ({ default: m.ImageMatting })),
  'graph-plotter': () => import('@/components/GraphPlotter').then(m => ({ default: m.GraphPlotter })),
  'chess-game': () => import('@/components/chess-games').then(m => ({ default: m.InternationalChess })),
  'xiangqi-game': () => import('@/components/chess-games').then(m => ({ default: m.ChineseChess })),
  'gobang-game': () => import('@/components/entertainment-tools').then(m => ({ default: m.GobangGame })),
  'snake-game': () => import('@/components/entertainment-tools').then(m => ({ default: m.SnakeGame })),
  'asset-extractor': () => import('@/components/AdvancedDevTools').then(m => ({ default: m.WebAssetExtractor })),
  'code-to-image': () => import('@/components/advanced-tools').then(m => ({ default: m.CodeToImage })),
  'image-converter': () => import('@/components/ImageConverter').then(m => ({ default: m.ImageConverter })),
  'image-splitter': () => import('@/components/ImageSplitter').then(m => ({ default: m.ImageSplitter })),
  'api-speed-test': () => import('@/components/api-speed-test').then(m => ({ default: m.ApiSpeedTest })),
  'date-calculator': () => import('@/components/DateCalculator').then(m => ({ default: m.DateCalculator })),
  'markdown-editor': () => import('@/components/MarkdownEditor').then(m => ({ default: m.MarkdownEditor })),
  'qr-generator': () => import('@/components/QrTools').then(m => ({ default: m.QrGenerator })),
  'qr-reader': () => import('@/components/QrTools').then(m => ({ default: m.QrReader })),
  'glassmorphism-gen': () => import('@/components/GlassmorphismGen').then(m => ({ default: m.GlassmorphismGen })),
  'image-exif': () => import('@/components/ExifViewer').then(m => ({ default: m.ExifViewer })),
  'stopwatch': () => import('@/components/Stopwatch').then(m => ({ default: m.Stopwatch })),
  'word-counter': () => import('@/components/CodingTools').then(m => ({ default: m.TextTools })),
  'case-converter': () => import('@/components/CodingTools').then(m => ({ default: m.TextTools })),
  'base64': () => import('@/components/CodingTools').then(m => ({ default: m.CodingTools })),
  'url-encoder': () => import('@/components/CodingTools').then(m => ({ default: m.CodingTools })),
  'hash-generator': () => import('@/components/CodingTools').then(m => ({ default: m.CodingTools })),
};

const staticModules: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'about': () => import('@/components/StaticPages').then(m => ({ default: m.AboutPage })),
  'privacy': () => import('@/components/StaticPages').then(m => ({ default: m.PrivacyPolicyPage })),
  'disclaimer': () => import('@/components/StaticPages').then(m => ({ default: m.DisclaimerPage })),
  'img-compress': () => import('@/components/ImageProTools').then(m => ({ default: m.ImageCompression })),
  'img-watermark': () => import('@/components/ImageProTools').then(m => ({ default: m.ImageWatermark })),
  'ui-snapshot': () => import('@/components/ImageProTools').then(m => ({ default: m.UIExporter })),
  'color-converter': () => import('@/components/DesignTools').then(m => ({ default: m.ColorConverter })),
  'gradient-gen': () => import('@/components/DesignTools').then(m => ({ default: m.GradientGenerator })),
  'csv-to-json': () => import('@/components/DataTools').then(m => ({ default: m.DataConverter })),
  'jwt-decoder': () => import('@/components/NetTools').then(m => ({ default: m.JwtDecoder })),
  'currency': () => import('@/components/NetTools').then(m => ({ default: m.CurrencyConverter })),
  'word-counter': () => import('@/components/CodingTools').then(m => ({ default: m.TextTools })),
  'case-converter': () => import('@/components/CodingTools').then(m => ({ default: m.TextTools })),
  'random-number': () => import('@/components/ExtraUtils').then(m => ({ default: m.RandomGen })),
  'password-strength': () => import('@/components/ExtraUtils').then(m => ({ default: m.PasswordTester })),
  'base-converter': () => import('@/components/ExtraUtils').then(m => ({ default: m.BaseConverter })),
  'unit-converter': () => import('@/components/more-tools').then(m => ({ default: m.UnitConverter })),
  'json-formatter': () => import('@/components/tool-implementations').then(m => ({ default: m.JsonFormatter })),
  'password-gen': () => import('@/components/tool-implementations').then(m => ({ default: m.PasswordGenerator })),
  'pomodoro-timer': () => import('@/components/high-retention-tools').then(m => ({ default: m.PomodoroTimer })),
  'url-encoder': () => import('@/components/high-retention-tools').then(m => ({ default: m.UrlEncoder })),
  'loan-calculator': () => import('@/components/FinanceHealthTools').then(m => ({ default: m.LoanCalculator })),
  'bmi-calculator': () => import('@/components/FinanceHealthTools').then(m => ({ default: m.BmiCalculator })),
  'text-cleanup': () => import('@/components/FinanceHealthTools').then(m => ({ default: m.TextCleanup })),
  'timestamp': () => import('@/components/FinanceHealthTools').then(m => ({ default: m.TimestampConverter })),
};

function ToolLoadingSkeleton() {
  const { lang } = useLanguage();
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-text-muted">{lang === 'zh' ? '加载工具中...' : 'Loading tool...'}</p>
      </div>
    </div>
  );
}

function DynamicTool({ toolId }: { toolId: string }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadModule = modules[toolId] || staticModules[toolId];
    if (loadModule) {
      loadModule().then(mod => setComponent(() => mod.default));
    }
  }, [toolId]);

  if (!Component) return <ToolLoadingSkeleton />;
  return <Component />;
}

export function ToolRenderer({ toolId }: { toolId: string }) {
  const { lang } = useLanguage();
  const tool = TOOLS.find(t => t.id === toolId);
  const isZh = lang === 'zh';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {tool && (
        <div className="bg-bg2 border border-border-site rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <tool.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{isZh ? tool.name.zh : tool.name.en}</h2>
              <p className="text-sm text-text2">{isZh ? tool.description.zh : tool.description.en}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tool.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-bg3 text-text-muted">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {tool?.seoContent && (
        <div className="bg-bg2/30 border border-border-site/50 rounded-2xl p-5">
          <p className="text-xs leading-relaxed text-text-muted">{isZh ? tool.seoContent.zh : tool.seoContent.en}</p>
        </div>
      )}

      <Suspense fallback={<ToolLoadingSkeleton />}>
        <DynamicTool toolId={toolId} />
      </Suspense>
    </div>
  );
}
