import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import type { Tool } from '../types';
import ToolRenderer from './ToolRenderer';

function ToolContentInner({ tool }: { tool: Tool }) {
  const { lang, t } = useLanguage();
  const isZh = lang === 'zh';

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* 工具头部 */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 4px 12px rgba(var(--accent-rgb), 0.3)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lora, serif' }}>
            {tool.name[isZh ? 'zh' : 'en']}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {tool.description[isZh ? 'zh' : 'en']}
          </p>
        </div>
      </div>

      {/* 使用说明 */}
      {tool.tutorial && (
        <div
          className="rounded-2xl p-5 mb-6 flex gap-4"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
        >
          <div className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">
              {tool.name[isZh ? 'zh' : 'en']} {t('tool.tutorial')}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {tool.tutorial[isZh ? 'zh' : 'en']}
            </p>
            <a
              href={`/tutorial/${tool.id}/`}
              className="inline-block mt-2 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              {t('tool.viewTutorial')}
            </a>
          </div>
        </div>
      )}

      {/* 工具主体 */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}
      >
        <ToolRenderer toolId={tool.id} />
      </div>

      {/* 返回首页 */}
      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </a>
      </div>
    </div>
  );
}

export default function ToolContent({ tool }: { tool: Tool }) {
  return (
    <LanguageProvider>
      <ToolContentInner tool={tool} />
    </LanguageProvider>
  );
}
