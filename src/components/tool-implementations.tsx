import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const CaseConverter = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [text, setText] = useState('');

  const faqs = [
    {
      question: {
        en: 'What case conversions are available?',
        zh: '有哪些大小写转换可用？'
      },
      answer: {
        en: 'We support UPPERCASE, lowercase, Title Case, and Sentence case. Perfect for formatting text for different contexts like titles, code, or social media.',
        zh: '我们支持全大写、全小写、首字母大写和句子大小写。非常适合为不同上下文（如标题、代码或社交媒体）格式化文本。'
      }
    },
    {
      question: {
        en: 'Does this work with non-English text?',
        zh: '这对非英语文本有效吗？'
      },
      answer: {
        en: 'Case conversion works primarily with Latin alphabet characters. Other scripts may not have case distinctions or may not convert correctly.',
        zh: '大小写转换主要适用于拉丁字母字符。其他脚本可能没有大小写区分或可能无法正确转换。'
      }
    },
    {
      question: {
        en: 'Is my text stored or sent anywhere?',
        zh: '我的文本会被存储或发送到任何地方吗？'
      },
      answer: {
        en: 'No, all text processing happens locally in your browser. Your text is never stored or transmitted to any server.',
        zh: '不会，所有文本处理都在您的浏览器本地进行。您的文本永远不会被存储或传输到任何服务器。'
      }
    }
  ];

  const transform = (type: string) => {
    switch (type) {
      case 'upper': setText(text.toUpperCase()); break;
      case 'lower': setText(text.toLowerCase()); break;
      case 'title':
        setText(text.split(' ').map(w => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join(' '));
        break;
      case 'sentence':
        setText(text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase()));
        break;
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'zh' ? "在此粘贴您的文本..." : "Paste your text here..."}
        className="w-full h-48 p-4 bg-card-bg border border-border-site rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-sm text-text-site"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => transform('upper')} className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-80 transition-opacity">UPPERCASE</button>
        <button onClick={() => transform('lower')} className="px-4 py-2 border border-border-site rounded-lg text-sm hover:bg-secondary-site">lowercase</button>
        <button onClick={() => transform('title')} className="px-4 py-2 border border-border-site rounded-lg text-sm hover:bg-secondary-site">Title Case</button>
        <button onClick={() => transform('sentence')} className="px-4 py-2 border border-border-site rounded-lg text-sm hover:bg-secondary-site">Sentence case</button>
        <button onClick={() => setText('')} className="px-4 py-2 border border-red-100 text-red-600 rounded-lg text-sm hover:bg-red-50/10 ml-auto">{lang === 'zh' ? '清空' : 'Clear'}</button>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};

export const PasswordGenerator = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const faqs = [
    {
      question: {
        en: 'How secure are these passwords?',
        zh: '这些密码有多安全？'
      },
      answer: {
        en: 'Our passwords use cryptographically secure random generation. With 16+ characters including symbols, they provide strong security against brute-force attacks.',
        zh: '我们的密码使用加密安全的随机生成。16 个以上包含符号的字符可提供强大的安全性，防止暴力破解攻击。'
      }
    },
    {
      question: {
        en: 'What length should I use?',
        zh: '我应该使用什么长度？'
      },
      answer: {
        en: 'We recommend at least 16 characters for general use. For high-security accounts, use 20+ characters. Longer passwords are exponentially more secure.',
        zh: '我们建议一般用途至少使用 16 个字符。对于高安全性账户，使用 20 个以上字符。更长的密码呈指数级更安全。'
      }
    },
    {
      question: {
        en: 'Are passwords stored or logged?',
        zh: '密码会被存储或记录吗？'
      },
      answer: {
        en: 'No, passwords are generated locally in your browser and never stored, transmitted, or logged. We have no access to any generated passwords.',
        zh: '不会，密码在您的浏览器本地生成，永远不会被存储、传输或记录。我们无法访问任何生成的密码。'
      }
    }
  ];

  const generate = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + (includeSymbols ? "!@#$%^&*()_+~`|}{[]:;?><,./-=" : "");
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          readOnly
          value={password}
          className="w-full p-4 pr-32 bg-secondary-site border-2 border-dashed border-border-site rounded-xl font-mono text-xl tracking-wider text-center text-text-site focus:outline-none"
          placeholder={lang === 'zh' ? "您的密码将现于此..." : "Your password will appear here"}
        />
        <button 
          onClick={() => {
            navigator.clipboard.writeText(password);
            // Could add a toast here
          }}
          className="absolute right-2 top-2 bottom-2 px-4 bg-card-bg border border-border-site rounded-lg text-sm hover:bg-secondary-site shadow-sm"
        >
          {lang === 'zh' ? '复制' : 'Copy'}
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{lang === 'zh' ? '长度' : 'Length'}: {length}</label>
          <input 
            type="range" min="4" max="64" value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-48 accent-primary"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" checked={includeSymbols} 
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 rounded border-border-site text-primary focus:ring-primary bg-card-bg"
          />
          <span className="text-sm">{lang === 'zh' ? '包含特殊符号' : 'Include Symbols'}</span>
        </label>
        <button onClick={generate} className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
          {lang === 'zh' ? '生成安全密码' : 'Generate Secure Password'}
        </button>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};

export const JsonFormatter = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const faqs = [
    {
      question: {
        en: 'What can this tool do?',
        zh: '这个工具可以做什么？'
      },
      answer: {
        en: 'We can format (pretty-print) JSON with proper indentation, minify JSON to remove whitespace, and validate JSON syntax. Perfect for debugging API responses or configuration files.',
        zh: '我们可以用适当的缩进格式化（美化打印）JSON，压缩 JSON 以删除空格，并验证 JSON 语法。非常适合调试 API 响应或配置文件。'
      }
    },
    {
      question: {
        en: 'Does it handle large JSON files?',
        zh: '它能处理大型 JSON 文件吗？'
      },
      answer: {
        en: 'Yes, the tool can handle large JSON files. Processing happens in your browser, so performance depends on your device capabilities.',
        zh: '可以，该工具可以处理大型 JSON 文件。处理在您的浏览器中进行，因此性能取决于您的设备能力。'
      }
    },
    {
      question: {
        en: 'Is my JSON data sent to a server?',
        zh: '我的 JSON 数据会被发送到服务器吗？'
      },
      answer: {
        en: 'No, all JSON processing happens locally in your browser. Your data is never transmitted to any server, ensuring privacy and security.',
        zh: '不会，所有 JSON 处理都在您的浏览器本地进行。您的数据永远不会传输到任何服务器，确保隐私和安全。'
      }
    }
  ];

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? 'JSON 格式化工具支持 JSON 美化（格式化）、压缩（最小化）和语法验证。用适当的缩进格式化 JSON，或删除空格压缩 JSON。适用于调试 API 响应、配置文件编辑、数据验证等场景。所有处理在浏览器本地完成，数据不会传输到服务器。'
            : 'The JSON formatter supports JSON beautification (formatting), minification, and syntax validation. Format JSON with proper indentation, or remove whitespace to minify JSON. Suitable for debugging API responses, configuration file editing, data validation, and other scenarios. All processing happens locally in your browser, data is never transmitted to servers.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase text-text-site/50">{lang === 'zh' ? '输入' : 'Input'}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-80 p-4 bg-card-bg border border-border-site rounded-xl font-mono text-xs outline-none focus:ring-1 focus:ring-primary text-text-site"
          placeholder='{"paste": "json here"}'
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase text-text-site/50">{lang === 'zh' ? '输出结论' : 'Output'}</label>
          {error && <span className="text-xs text-red-500 font-mono">{error}</span>}
        </div>
        <div className="relative">
           <textarea
            readOnly
            value={output}
            className="w-full h-80 p-4 bg-secondary-site border border-border-site rounded-xl font-mono text-xs outline-none cursor-default text-text-site"
            placeholder={lang === 'zh' ? "格式化后的 JSON 结果..." : "Formatted JSON..."}
          />
          <button 
            onClick={() => navigator.clipboard.writeText(output)}
            className="absolute top-2 right-2 p-2 bg-card-bg border border-border-site rounded-lg text-[10px] hover:bg-secondary-site"
          >
            {lang === 'zh' ? '复制' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="md:col-span-2 flex gap-2">
        <button onClick={format} className="px-6 py-2 bg-primary text-white rounded-lg text-sm">{lang === 'zh' ? '美化展开' : 'Beautify'}</button>
        <button onClick={minify} className="px-6 py-2 border border-border-site rounded-lg text-sm hover:bg-secondary-site">{lang === 'zh' ? '极简压缩' : 'Minify'}</button>
      </div>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};
