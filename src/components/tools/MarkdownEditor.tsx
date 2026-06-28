import { useState, useMemo } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../../i18n/LanguageContext';

// 配置 marked：GFM + 换行
marked.setOptions({ gfm: true, breaks: true });

export default function MarkdownEditor() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState(isZh
    ? '> Markdown 编辑器示例\n\n支持 **GFM** 语法：表格、任务列表、代码块等。\n\n- [x] 实时预览\n- [ ] 导出 HTML\n\n```js\nconsole.log("Hello");\n```\n\n| 工具 | 状态 |\n|------|------|\n| JSON | ✓ |\n| MD  | ✓ |\n'
    : '> Markdown Editor Sample\n\nSupports **GFM** syntax: tables, task lists, code blocks.\n\n- [x] Live preview\n- [ ] Export HTML\n\n```js\nconsole.log("Hello");\n```\n');

  const html = useMemo(() => {
    try {
      return marked.parse(input) as string;
    } catch {
      return '<p style="color:red">Parse error</p>';
    }
  }, [input]);

  const exportHtml = () => {
    const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Export</title></head><body>${html}</body></html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const labelStyle = { color: 'var(--text-muted)' };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center gap-2">
        <button
          onClick={exportHtml}
          className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          {isZh ? '导出 HTML' : 'Export HTML'}
        </button>
        <button
          onClick={() => setInput('')}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
        >
          {isZh ? '清空' : 'Clear'}
        </button>
      </div>

      {/* 编辑器 + 预览 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {isZh ? '输入' : 'Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 rounded-lg p-3 font-mono text-sm outline-none resize-y"
            style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {isZh ? '预览' : 'Preview'}
          </label>
          <div
            className="w-full h-96 rounded-lg p-3 overflow-auto prose-sm"
            style={{
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* 内联 Markdown 样式 */}
      <style>{`
        .prose-sm h1, .prose-sm h2, .prose-sm h3 { font-weight: 700; margin: 0.5em 0 0.3em; }
        .prose-sm h1 { font-size: 1.5em; }
        .prose-sm h2 { font-size: 1.3em; }
        .prose-sm h3 { font-size: 1.1em; }
        .prose-sm p { margin: 0.5em 0; line-height: 1.6; }
        .prose-sm ul, .prose-sm ol { margin: 0.5em 0; padding-left: 1.5em; }
        .prose-sm li { margin: 0.2em 0; }
        .prose-sm code { background: var(--bg-2); padding: 0.1em 0.4em; border-radius: 4px; font-family: var(--font-mono); font-size: 0.9em; }
        .prose-sm pre { background: var(--bg-2); padding: 0.8em; border-radius: 6px; overflow-x: auto; margin: 0.5em 0; }
        .prose-sm pre code { background: none; padding: 0; }
        .prose-sm blockquote { border-left: 3px solid var(--accent); padding-left: 1em; margin: 0.5em 0; color: var(--text-muted); }
        .prose-sm a { color: var(--accent); text-decoration: underline; }
        .prose-sm table { border-collapse: collapse; margin: 0.5em 0; }
        .prose-sm th, .prose-sm td { border: 1px solid var(--border); padding: 0.3em 0.6em; }
        .prose-sm th { background: var(--bg-2); font-weight: 600; }
        .prose-sm input[type="checkbox"] { margin-right: 0.3em; }
      `}</style>
    </div>
  );
}
