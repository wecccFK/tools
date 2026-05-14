import React, { useState, useEffect } from 'react';
import { Type, FileText, Hash, Link, ShieldCheck, Copy, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import CryptoJS from 'crypto-js';
import { FAQ } from './FAQ';

// --- Word Counter & Case Converter (综合文本工具) ---
export const TextTools = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 0 });

  const faqs = [
    {
      question: {
        en: 'What text statistics are calculated?',
        zh: '计算哪些文本统计信息？'
      },
      answer: {
        en: 'We calculate word count, character count (with and without spaces), and estimated reading time based on average reading speed.',
        zh: '我们计算字数、字符数（包括和不包括空格）以及基于平均阅读速度的估计阅读时间。'
      }
    },
    {
      question: {
        en: 'What case conversions are available?',
        zh: '有哪些大小写转换可用？'
      },
      answer: {
        en: 'You can convert text to uppercase, lowercase, title case, and sentence case. Useful for formatting text consistently.',
        zh: '您可以将文本转换为大写、小写、标题大小写和句子大小写。有助于统一格式化文本。'
      }
    },
    {
      question: {
        en: 'Is my text stored anywhere?',
        zh: '我的文本会存储在任何地方吗？'
      },
      answer: {
        en: 'No, all text processing happens locally in your browser. Your text is never sent to any server.',
        zh: '不会，所有文本处理完全在您的浏览器中进行。您的文本永远不会发送到任何服务器。'
      }
    }
  ];

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    // Assume 200 words per minute
    const readingTime = Math.ceil(words / 200);
    setStats({ words, chars, readingTime });
  }, [text]);

  const handleCase = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!text) return;
    let newText = text;
    switch (type) {
      case 'upper': newText = text.toUpperCase(); break;
      case 'lower': newText = text.toLowerCase(); break;
      case 'title': 
        newText = text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '); 
        break;
      case 'sentence':
        newText = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        break;
    }
    setText(newText);
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? '文本大小写转换工具支持多种大小写格式转换，包括全大写、全小写、标题大小写和句子大小写。同时提供词数统计、字符数统计和预计阅读时间功能。适用于文章编辑、代码处理、文案优化等场景。所有处理都在浏览器本地完成。'
            : 'The text case converter supports multiple case format conversions including uppercase, lowercase, title case, and sentence case. Also provides word count, character count, and estimated reading time. Suitable for article editing, code processing, copy optimization, and other scenarios. All processing is done locally in your browser.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-secondary-site rounded-2xl border border-border-site text-center">
            <div className="text-[10px] font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '词数' : 'Word Count'}</div>
            <div className="text-2xl font-black text-text-site">{stats.words}</div>
        </div>
        <div className="p-4 bg-secondary-site rounded-2xl border border-border-site text-center">
            <div className="text-[10px] font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '字符数' : 'Char Count'}</div>
            <div className="text-2xl font-black text-text-site">{stats.chars}</div>
        </div>
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-center">
            <div className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{isZh ? '预计阅读时间' : 'Reading Time'}</div>
            <div className="text-2xl font-black text-primary">{stats.readingTime} {isZh ? '分钟' : 'Min'}</div>
        </div>
      </div>

      <textarea 
        value={text} 
        onChange={e => setText(e.target.value)}
        placeholder={isZh ? "粘贴您的文章或代码..." : "Paste your text or code here..."}
        className="w-full h-80 p-6 bg-card-bg border border-border-site rounded-3xl text-sm leading-relaxed text-text-site outline-none focus:ring-1 focus:ring-primary shadow-inner"
      />

      <div className="flex flex-wrap gap-2">
         <button onClick={() => handleCase('upper')} className="px-4 py-2 bg-secondary-site hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-border-site uppercase">UPPERCASE</button>
         <button onClick={() => handleCase('lower')} className="px-4 py-2 bg-secondary-site hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-border-site lowercase">lowercase</button>
         <button onClick={() => handleCase('title')} className="px-4 py-2 bg-secondary-site hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-border-site capitalize">Title Case</button>
         <button onClick={() => handleCase('sentence')} className="px-4 py-2 bg-secondary-site hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-border-site">Sentence case</button>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};

// --- Coding Tools (Base64, URL, Hash) ---
export const CodingTools = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const faqs = [
    {
      question: {
        en: 'What encodings are supported?',
        zh: '支持哪些编码？'
      },
      answer: {
        en: 'We support Base64 encoding/decoding, URL encoding/decoding, and MD5 hashing. Common for web development and data transmission.',
        zh: '我们支持 Base64 编码/解码、URL 编码/解码和 MD5 哈希。常见于 Web 开发和数据传输。'
      }
    },
    {
      question: {
        en: 'Is the MD5 hash secure for passwords?',
        zh: 'MD5 哈希对密码安全吗？'
      },
      answer: {
        en: 'No, MD5 is not cryptographically secure. Use bcrypt or Argon2 for password hashing. MD5 is suitable for checksums and non-security purposes.',
        zh: '不安全，MD5 不是加密安全的。请使用 bcrypt 或 Argon2 进行密码哈希。MD5 适用于校验和非安全用途。'
      }
    },
    {
      question: {
        en: 'Can I encode large files?',
        zh: '可以编码大文件吗？'
      },
      answer: {
        en: 'This tool is designed for text and small data. For large files, use a dedicated file encoding tool to avoid browser performance issues.',
        zh: '此工具专为文本和小数据设计。对于大文件，请使用专用的文件编码工具以避免浏览器性能问题。'
      }
    }
  ];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const process = (type: string) => {
    if (!input) return;
    let res = '';
    try {
      switch (type) {
        case 'b64_enc': res = btoa(input); break;
        case 'b64_dec': res = atob(input); break;
        case 'url_enc': res = encodeURIComponent(input); break;
        case 'url_dec': res = decodeURIComponent(input); break;
        case 'md5': res = CryptoJS.MD5(input).toString(); break;
        case 'sha256': res = CryptoJS.SHA256(input).toString(); break;
      }
      setOutput(res);
    } catch (e) {
      setOutput(isZh ? '解析错误：请检查输入格式' : 'Parsing Error: Check input format');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? '编码工具集支持 Base64 编码/解码、URL 编码/解码和 MD5 哈希计算。适用于 Web 开发、数据传输、安全校验等场景。注意：MD5 不适用于密码加密，请使用 bcrypt 或 Argon2。所有处理都在浏览器本地完成，保护您的数据隐私。'
            : 'The coding toolkit supports Base64 encoding/decoding, URL encoding/decoding, and MD5 hashing. Suitable for web development, data transmission, security verification, and other scenarios. Note: MD5 is not suitable for password encryption, use bcrypt or Argon2 instead. All processing is done locally in your browser, protecting your data privacy.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <label className="text-xs font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '原始输入' : 'Raw Input'}</label>
            <textarea 
               value={input} onChange={e => setInput(e.target.value)}
               className="w-full h-48 p-4 bg-card-bg border border-border-site rounded-2xl font-mono text-sm text-text-site outline-none focus:ring-1 focus:ring-primary"
            />
        </div>
        <div className="space-y-2 relative">
            <label className="text-xs font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '转换结果' : 'Result'}</label>
            <textarea 
               value={output} readOnly
               className="w-full h-48 p-4 bg-secondary-site border border-border-site rounded-2xl font-mono text-sm text-text-site outline-none"
            />
            <button 
              onClick={handleCopy}
              className="absolute top-8 right-2 p-2 bg-white rounded-lg shadow-sm hover:scale-110 transition-all text-primary"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
         <div className="flex items-center gap-2 bg-secondary-site p-1 rounded-xl border border-border-site">
            <button onClick={() => process('b64_enc')} className="px-4 py-2 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all underline decoration-primary underline-offset-4">Base64 Enc</button>
            <button onClick={() => process('b64_dec')} className="px-4 py-2 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all underline decoration-primary underline-offset-4">Base64 Dec</button>
         </div>
         <div className="flex items-center gap-2 bg-secondary-site p-1 rounded-xl border border-border-site">
            <button onClick={() => process('url_enc')} className="px-4 py-2 hover:bg-secondary hover:text-white rounded-lg text-xs font-bold transition-all underline decoration-secondary underline-offset-4">URL Enc</button>
            <button onClick={() => process('url_dec')} className="px-4 py-2 hover:bg-secondary hover:text-white rounded-lg text-xs font-bold transition-all underline decoration-secondary underline-offset-4">URL Dec</button>
         </div>
         <div className="flex items-center gap-2 bg-secondary-site p-1 rounded-xl border border-border-site">
            <button onClick={() => process('md5')} className="px-4 py-2 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all uppercase">MD5</button>
            <button onClick={() => process('sha256')} className="px-4 py-2 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all uppercase">SHA256</button>
         </div>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};
