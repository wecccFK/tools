import { lazy, Suspense } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// 懒加载工具组件（代码分割，每个工具独立 chunk）
const LazyJsonFormatter = lazy(() => import('./tools/JsonFormatter'));
const LazyMarkdownEditor = lazy(() => import('./tools/MarkdownEditor'));
const LazyQrGenerator = lazy(() => import('./tools/QrGenerator'));
const LazyPasswordGenerator = lazy(() => import('./tools/PasswordGenerator'));
const LazyBase64 = lazy(() => import('./tools/Base64Tool'));
const LazyUrlEncoder = lazy(() => import('./tools/UrlEncoder'));
const LazyTimestamp = lazy(() => import('./tools/TimestampConverter'));
const LazyHashGenerator = lazy(() => import('./tools/HashGenerator'));
const LazyJwtDecoder = lazy(() => import('./tools/JwtDecoder'));
const LazyImgCompress = lazy(() => import('./tools/ImageCompressor'));
const LazyUuidGenerator = lazy(() => import('./tools/UuidGenerator'));
const LazyColorConverter = lazy(() => import('./tools/ColorConverter'));
const LazyUnitConverter = lazy(() => import('./tools/UnitConverter'));

// 工具 ID → 组件映射
const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'json-formatter': LazyJsonFormatter,
  'markdown-editor': LazyMarkdownEditor,
  'qr-generator': LazyQrGenerator,
  'password-generator': LazyPasswordGenerator,
  'base64': LazyBase64,
  'url-encoder': LazyUrlEncoder,
  'timestamp': LazyTimestamp,
  'hash-generator': LazyHashGenerator,
  'jwt-decoder': LazyJwtDecoder,
  'img-compress': LazyImgCompress,
  'uuid-generator': LazyUuidGenerator,
  'color-converter': LazyColorConverter,
  'unit-converter': LazyUnitConverter,
};

function LoadingSkeleton() {
  const { lang } = useLanguage();
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-8 h-8 animate-spin"
          style={{ color: 'var(--accent)' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {lang === 'zh' ? '加载工具中...' : 'Loading tool...'}
        </p>
      </div>
    </div>
  );
}

export default function ToolRenderer({ toolId }: { toolId: string }) {
  const Component = TOOL_COMPONENTS[toolId];

  if (!Component) {
    return (
      <div
        className="p-8 text-center rounded-2xl"
        style={{ border: '2px dashed var(--border)', color: 'var(--text-muted)' }}
      >
        <p className="text-sm">
          Tool "{toolId}" not found. Coming soon...
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Component />
    </Suspense>
  );
}
