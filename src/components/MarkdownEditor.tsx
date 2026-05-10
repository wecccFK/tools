import React, { useState } from 'react';
import { Layout, Eye, Code, Copy, Check, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { marked } from 'marked';
import { FAQ } from './FAQ';

export const MarkdownEditor: React.FC = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [markdown, setMarkdown] = useState(isZh ? '# 欢迎使用 MOMO Markdown 编辑器\n\n在此输入您的文字，右侧会实时预览效果。\n\n- 支持 **加粗**\n- 支持 *斜体*\n- 支持 `代码块`' : '# Welcome to MOMO Markdown\n\nType your content here and see the preview on the right.');
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');

  const faqs = [
    {
      question: {
        en: 'What Markdown syntax is supported?',
        zh: '支持哪些 Markdown 语法？'
      },
      answer: {
        en: 'We support standard Markdown including headings, bold, italic, lists, links, images, code blocks, tables, and blockquotes.',
        zh: '我们支持标准 Markdown，包括标题、粗体、斜体、列表、链接、图片、代码块、表格和引用块。'
      }
    },
    {
      question: {
        en: 'Can I export the rendered HTML?',
        zh: '可以导出渲染后的 HTML 吗？'
      },
      answer: {
        en: 'Yes, you can download the rendered HTML file which includes the content and basic styling for use in your projects.',
        zh: '是的，您可以下载渲染后的 HTML 文件，其中包含内容和基本样式，可用于您的项目。'
      }
    },
    {
      question: {
        en: 'Is my content saved automatically?',
        zh: '我的内容会自动保存吗？'
      },
      answer: {
        en: 'Content is stored in browser memory during the session. For permanent storage, we recommend copying your content to a local file.',
        zh: '内容在会话期间存储在浏览器内存中。为了永久保存，我们建议将内容复制到本地文件。'
      }
    }
  ];
  const [copied, setCopied] = useState(false);

  const getHtml = () => {
    return { __html: marked.parse(markdown) };
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
          img { max-width: 100%; }
          pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        </style>
      </head>
      <body>
        ${marked.parse(markdown)}
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-export.html';
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 h-[700px]">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? 'Markdown 编辑器支持实时预览、分屏编辑和 HTML 导出功能。使用 Markdown 语法可以快速格式化文本，支持标题、列表、代码块、链接、图片等常用元素。编辑器提供三种视图模式：纯编辑、分屏预览和纯预览，满足不同写作需求。导出的 HTML 文件可以直接在浏览器中打开，方便分享和发布。'
            : 'The Markdown editor supports real-time preview, split-screen editing, and HTML export. Use Markdown syntax to quickly format text with support for headings, lists, code blocks, links, images, and other common elements. The editor offers three view modes: editor only, split-screen, and preview only to meet different writing needs. Exported HTML files can be opened directly in browsers for easy sharing and publishing.'}
        </p>
      </div>

      <div className="flex flex-col h-full border border-border-site rounded-3xl overflow-hidden bg-card-bg shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-secondary-site border-bottom border-border-site">
         <div className="flex bg-card-bg p-1 rounded-xl border border-border-site">
            <button 
              onClick={() => setViewMode('editor')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'editor' ? 'bg-primary text-white' : 'text-text-site/50'}`}
            >
              <Code className="w-3.5 h-3.5" /> {isZh ? '编辑' : 'Editor'}
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'split' ? 'bg-primary text-white' : 'text-text-site/50'}`}
            >
              <Layout className="w-3.5 h-3.5" /> {isZh ? '分屏' : 'Split'}
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'preview' ? 'bg-primary text-white' : 'text-text-site/50'}`}
            >
              <Eye className="w-3.5 h-3.5" /> {isZh ? '预览' : 'Preview'}
            </button>
         </div>

         <div className="flex gap-2">
            <button onClick={handleCopy} className="p-2.5 bg-card-bg hover:bg-primary/10 border border-border-site rounded-xl text-primary transition-all">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={downloadHtml} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                <Download className="w-3.5 h-3.5" /> {isZh ? '导出为 HTML' : 'Export HTML'}
            </button>
         </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 flex overflow-hidden">
         {(viewMode === 'editor' || viewMode === 'split') && (
            <textarea 
               value={markdown}
               onChange={(e) => setMarkdown(e.target.value)}
               className={`flex-1 p-6 font-mono text-sm resize-none bg-card-bg text-text-site outline-none ${viewMode === 'split' ? 'border-r border-border-site' : ''}`}
               placeholder={isZh ? '开始写作...' : 'Start writing...'}
            />
         )}
         {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-black/20">
               <div 
                 className="markdown-body prose prose-slate max-w-none prose-img:rounded-xl"
                 dangerouslySetInnerHTML={getHtml()} 
               />
            </div>
         )}
      </div>

      <FAQ faqs={faqs} />
    </div>
    </div>
  );
};
