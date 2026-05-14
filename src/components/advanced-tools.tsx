import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toPng } from 'html-to-image';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';
import { Copy, Download, Wand2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const AiRegexGenerator = () => {
    const { lang } = useLanguage();
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState<any>('');
    const [loading, setLoading] = useState(false);

    const faqs = [
        {
            question: {
                en: 'How does this work?',
                zh: '这是如何工作的？'
            },
            answer: {
                en: 'We use a curated library of regex templates and keyword matching to find the best pattern for your needs. No AI API calls required - everything runs locally.',
                zh: '我们使用精选的正则表达式模板库和关键词匹配来为您找到最佳模式。无需 AI API 调用 - 一切都在本地运行。'
            }
        },
        {
            question: {
                en: 'Can I use these regex patterns?',
                zh: '我可以使用这些正则模式吗？'
            },
            answer: {
                en: 'Yes, all generated regex patterns are free to use in your projects. We provide explanations for each pattern to help you understand how they work.',
                zh: '可以，所有生成的正则模式都可以在您的项目中免费使用。我们为每个模式提供解释，帮助您理解它们的工作原理。'
            }
        },
        {
            question: {
                en: 'What patterns are supported?',
                zh: '支持哪些模式？'
            },
            answer: {
                en: 'We support common patterns like email validation, phone numbers, URLs, dates, and more. Describe what you need in natural language.',
                zh: '我们支持常见模式，如邮箱验证、电话号码、URL、日期等。用自然语言描述您的需求。'
            }
        }
    ];

    // 纯前端正则模板库 - 无限制使用
    const templates: { [key: string]: { regex: string; explanation: string; zh: string; keywords: string[] } } = {
        email: {
            regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            explanation: 'Matches standard email addresses',
            zh: '匹配标准邮箱地址',
            keywords: ['email', 'mail', '邮箱', '邮件', '@']
        },
        phone: {
            regex: '^(\\+?\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}$',
            explanation: 'Matches phone numbers with optional country code',
            zh: '匹配带可选国家代码的电话号码',
            keywords: ['phone', 'mobile', 'tel', '电话', '手机', '号码']
        },
        url: {
            regex: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
            explanation: 'Matches URLs with optional protocol',
            zh: '匹配带可选协议的网址',
            keywords: ['url', 'website', 'link', '网址', '链接', 'http']
        },
        date: {
            regex: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
            explanation: 'Matches YYYY-MM-DD date format',
            zh: '匹配 YYYY-MM-DD 日期格式',
            keywords: ['date', '日期', '时间', 'yyyy']
        },
        ip: {
            regex: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            explanation: 'Matches IPv4 addresses',
            zh: '匹配 IPv4 地址',
            keywords: ['ip', 'ipv4', '地址', 'ip地址']
        },
        hex: {
            regex: '^#?([a-f0-9]{6}|[a-f0-9]{3})$',
            explanation: 'Matches hex color codes',
            zh: '匹配十六进制颜色代码',
            keywords: ['hex', 'color', '颜色', '十六进制', '#']
        },
        number: {
            regex: '^\\d+(\\.\\d+)?$',
            explanation: 'Matches integer or decimal numbers',
            zh: '匹配整数或小数',
            keywords: ['number', 'digit', '数字', '整数', '小数']
        },
        chinese: {
            regex: '[\\u4e00-\\u9fa5]+',
            explanation: 'Matches Chinese characters',
            zh: '匹配中文字符',
            keywords: ['chinese', '中文', '汉字', '字符']
        },
        password: {
            regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
            explanation: 'Matches strong passwords (8+ chars, uppercase, lowercase, number, special)',
            zh: '匹配强密码（8位以上，包含大小写、数字、特殊字符）',
            keywords: ['password', '密码', 'pwd', '强密码']
        },
        idcard: {
            regex: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
            explanation: 'Matches Chinese ID card numbers',
            zh: '匹配中国身份证号码',
            keywords: ['id', 'idcard', '身份证', '身份证号']
        },
        creditCard: {
            regex: '^\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}$',
            explanation: 'Matches credit card numbers',
            zh: '匹配信用卡号',
            keywords: ['credit', 'card', '信用卡', '银行卡']
        },
        mac: {
            regex: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
            explanation: 'Matches MAC addresses',
            zh: '匹配 MAC 地址',
            keywords: ['mac', 'mac地址', '物理地址']
        }
    };

    const generateRegex = () => {
        if (!prompt.trim()) return;
        setLoading(true);

        // 模拟加载效果，提供更好的用户体验
        setTimeout(() => {
            const q = prompt.toLowerCase();
            let matched = null;

            // 关键词匹配
            for (const [key, value] of Object.entries(templates)) {
                if (value.keywords.some(kw => q.includes(kw.toLowerCase()))) {
                    matched = {
                        regex: value.regex,
                        explanation: lang === 'zh' ? value.zh : value.explanation
                    };
                    break;
                }
            }

            if (matched) {
                setOutput(matched);
            } else {
                setOutput({
                    regex: '.*',
                    explanation: lang === 'zh' 
                        ? '未找到匹配的模板。可用模板：邮箱(email)、电话(phone)、网址(url)、日期(date)、IP地址(ip)、颜色(hex)、数字(number)、中文(chinese)、密码(password)、身份证(idcard)、信用卡(credit)、MAC地址(mac)' 
                        : 'No matching template found. Available: email, phone, url, date, ip, hex color, number, chinese, password, idcard, credit card, mac address'
                });
            }

            setLoading(false);
        }, 300);
    };

    const result: any = output || {};

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {lang === 'zh'
                        ? 'AI 正则表达式生成器使用精选的正则模板库和关键词匹配，根据自然语言描述生成正则表达式。支持邮箱、电话、URL、日期、IP 地址、颜色、数字、中文、密码、身份证、信用卡、MAC 地址等常见模式。所有生成都在本地完成，无需 API 调用。适用于开发调试、数据验证、模式匹配等场景。'
                        : 'The AI regex generator uses a curated regex template library and keyword matching to generate regular expressions based on natural language descriptions. Supports common patterns like email, phone, URL, date, IP address, color, number, Chinese, password, ID card, credit card, MAC address, and more. All generation is done locally without API calls. Suitable for development debugging, data validation, pattern matching, and other scenarios.'}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase text-text-site/50 font-bold">{lang === 'zh' ? '描述你想要匹配的内容' : 'Describe what you want to match'}</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={lang === 'zh' ? "例如：匹配以 @google.com 结尾的有效邮箱" : "e.g. Match a valid email address ending with @google.com"}
                        className="flex-1 p-4 bg-card-bg border border-border-site rounded-xl outline-none focus:ring-2 focus:ring-primary text-text-site text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && generateRegex()}
                    />
                    <button 
                        onClick={generateRegex}
                        disabled={loading}
                        className="px-6 bg-primary text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Wand2 className="w-5 h-5" />}
                        {lang === 'zh' ? '生成' : 'Generate'}
                    </button>
                </div>
            </div>
            
            {result.regex && (
                <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-600 dark:text-green-400 text-center">
                        {lang === 'zh' ? '✅ 纯前端生成，无限制使用' : '✅ Generated locally, unlimited usage'}
                    </div>
                    <div className="relative">
                        <div className="p-6 bg-secondary-site border border-border-site rounded-2xl font-mono text-xl text-primary break-all">
                            {result.regex}
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(result.regex)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-card-bg text-text-site/60 hover:text-primary rounded-lg border border-border-site shadow-sm transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-4 bg-card-bg border border-border-site rounded-xl">
                        <h4 className="text-xs uppercase text-text-site/50 font-bold mb-2">{lang === 'zh' ? '解析' : 'Explanation'}</h4>
                        <p className="text-sm text-text-site/80 leading-relaxed">{result.explanation}</p>
                    </div>
                </div>
            )}

            <FAQ faqs={faqs} />
        </div>
    );
};

export const MarkdownEditor = () => {
    const { lang } = useLanguage();
    const [markdown, setMarkdown] = useState('# Hello World\n\nWrite your **markdown** here.\n\n- Real-time preview\n- Auto formatted\n- Supports GFM');

    const faqs = [
        {
            question: {
                en: 'What markdown features are supported?',
                zh: '支持哪些 Markdown 功能？'
            },
            answer: {
                en: 'We support standard Markdown plus GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, and code blocks with syntax highlighting.',
                zh: '我们支持标准 Markdown 加上 GitHub 风格 Markdown (GFM)，包括表格、任务列表、删除线和带语法高亮的代码块。'
            }
        },
        {
            question: {
                en: 'Can I export the result?',
                zh: '可以导出结果吗？'
            },
            answer: {
                en: 'Yes, you can copy the rendered HTML or download it as an image. Perfect for sharing formatted text on social media or documentation.',
                zh: '可以，您可以复制渲染的 HTML 或将其下载为图片。非常适合在社交媒体或文档中分享格式化文本。'
            }
        },
        {
            question: {
                en: 'Is my data saved?',
                zh: '我的数据会被保存吗？'
            },
            answer: {
                en: 'No, all processing happens locally in your browser. Your markdown content is not stored or transmitted to any server.',
                zh: '不会，所有处理都在您的浏览器本地进行。您的 Markdown 内容不会被存储或传输到任何服务器。'
            }
        }
    ];
    
    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {lang === 'zh'
                        ? 'Markdown 编辑器支持实时预览和语法高亮。支持标准 Markdown 和 GitHub 风格 Markdown (GFM)，包括表格、任务列表、删除线和代码块。可以复制渲染的 HTML 或下载为图片。所有处理都在浏览器本地完成，适用于文档编写、博客预览、格式化文本分享等场景。'
                        : 'The Markdown editor supports real-time preview and syntax highlighting. Supports standard Markdown and GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, and code blocks. Can copy rendered HTML or download as image. All processing happens locally in your browser. Suitable for document writing, blog preview, formatted text sharing, and other scenarios.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full p-6 bg-card-bg border border-border-site rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-mono text-text-site resize-none"
                    placeholder={lang === 'zh' ? "在此编写 markdown 文档..." : "Type markdown..."}
                />
                <div className="w-full h-full p-6 bg-card-bg border border-border-site rounded-2xl overflow-y-auto prose dark:prose-invert max-w-none">
                    <div className="markdown-body">
                        <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
                    </div>
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

export const CodeToImage = () => {
    const { lang: uiLang } = useLanguage();
    const [code, setCode] = useState('function sayHello() {\n  console.log("Hello, World!");\n}');
    const [codeLang, setCodeLang] = useState('javascript');
    const captureRef = useRef<HTMLDivElement>(null);

    const faqs = [
        {
            question: {
                en: 'What image format is exported?',
                zh: '导出什么图像格式？'
            },
            answer: {
                en: 'We export high-quality PNG images with 3x pixel ratio for crisp text. Perfect for sharing on social media or including in documentation.',
                zh: '我们导出 3 倍像素比率的高质量 PNG 图像，文字清晰。非常适合在社交媒体上分享或包含在文档中。'
            }
        },
        {
            question: {
                en: 'Which languages are supported?',
                zh: '支持哪些语言？'
            },
            answer: {
                en: 'We support JavaScript, Python, CSS, and HTML syntax highlighting. Prism.js provides beautiful code highlighting for these languages.',
                zh: '我们支持 JavaScript、Python、CSS 和 HTML 语法高亮。Prism.js 为这些语言提供漂亮的代码高亮。'
            }
        },
        {
            question: {
                en: 'Can I customize the theme?',
                zh: '可以自定义主题吗？'
            },
            answer: {
                en: 'Currently we use the Prism Tomorrow theme for dark mode syntax highlighting. Future updates may include theme customization options.',
                zh: '目前我们使用 Prism Tomorrow 主题进行暗模式语法高亮。未来的更新可能包括主题自定义选项。'
            }
        }
    ];

    const exportImage = async () => {
        if (!captureRef.current) return;
        try {
            const dataUrl = await toPng(captureRef.current, { cacheBust: true, pixelRatio: 3 });
            const link = document.createElement('a');
            link.download = 'snippet.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
        }
    };

    useEffect(() => {
        Prism.highlightAll();
    }, [code, codeLang]);

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {uiLang === 'zh'
                        ? '代码转图片工具可以将代码片段导出为高质量 PNG 图片。支持 JavaScript、Python、CSS 和 HTML 语法高亮。使用 Prism.js 提供漂亮的代码高亮，导出 3 倍像素比率的图片，文字清晰。适用于社交媒体分享、文档插图、代码展示等场景。'
                        : 'The code to image tool can export code snippets as high-quality PNG images. Supports JavaScript, Python, CSS, and HTML syntax highlighting. Uses Prism.js for beautiful code highlighting, exports 3x pixel ratio images with crisp text. Suitable for social media sharing, documentation illustrations, code display, and other scenarios.'}
                </p>
            </div>

            <div className="flex gap-4">
                <select 
                    value={codeLang} 
                    onChange={(e) => setCodeLang(e.target.value)}
                    className="p-3 bg-card-bg border border-border-site rounded-lg text-sm text-text-site outline-none font-bold"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                </select>
                <button 
                    onClick={exportImage}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <Download className="w-4 h-4" /> {uiLang === 'zh' ? '导出图片' : 'Export PNG'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 p-4 bg-card-bg border border-border-site rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-primary text-text-site resize-none"
                    placeholder={uiLang === 'zh' ? "在此粘贴代码..." : "Paste code here..."}
                />
                
                <div className="flex items-center justify-center p-8 bg-secondary-site border border-border-site border-dashed rounded-xl overflow-hidden">
                    {/* The canvas to capture */}
                    <div 
                        ref={captureRef} 
                        className="p-8 pb-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl w-full max-w-lg"
                    >
                        <div className="bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden border border-white/10">
                            {/* Fake MacOS Toolbar */}
                            <div className="flex px-4 py-3 gap-2 bg-[#2D2D2D]">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="p-4 overflow-hidden text-sm">
                                <pre className="!bg-transparent !m-0 !p-0">
                                    <code className={`language-${codeLang}`}>
                                        {code || ' '}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};


export const HashGenerator = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha384: '', sha512: '' });

    const faqs = [
        {
            question: {
                en: 'What hash algorithms are supported?',
                zh: '支持哪些哈希算法？'
            },
            answer: {
                en: 'We support SHA-1, SHA-256, SHA-384, and SHA-512. These are cryptographic hash functions used for data integrity verification.',
                zh: '我们支持 SHA-1、SHA-256、SHA-384 和 SHA-512。这些是用于数据完整性验证的加密哈希函数。'
            }
        },
        {
            question: {
                en: 'Is this secure for passwords?',
                zh: '这对密码安全吗？'
            },
            answer: {
                en: 'No, these are general-purpose hash functions. For password storage, use specialized algorithms like bcrypt, Argon2, or scrypt with proper salting.',
                zh: '不，这些是通用哈希函数。对于密码存储，请使用专门的算法，如 bcrypt、Argon2 或 scrypt，并正确加盐。'
            }
        },
        {
            question: {
                en: 'Where is the hashing done?',
                zh: '哈希在哪里进行？'
            },
            answer: {
                en: 'All hashing is performed locally in your browser using the Web Crypto API. Your data never leaves your device.',
                zh: '所有哈希都在您的浏览器本地使用 Web Crypto API 执行。您的数据永远不会离开您的设备。'
            }
        }
    ];

    const cryptoHash = async (algo: string, text: string) => {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    useEffect(() => {
        if (!input) {
            setHashes({ sha1: '', sha256: '', sha384: '', sha512: '' });
            return;
        }
        
        const computeHashes = async () => {
            const [sha1, sha256, sha384, sha512] = await Promise.all([
                cryptoHash('SHA-1', input),
                cryptoHash('SHA-256', input),
                cryptoHash('SHA-384', input),
                cryptoHash('SHA-512', input)
            ]);
            setHashes({ sha1, sha256, sha384, sha512 });
        };
        computeHashes();
    }, [input]);

    const HashRow = ({ label, value }: { label: string, value: string }) => (
        <div className="space-y-1">
            <div className="flex justify-between items-end">
                <span className="text-xs uppercase font-bold text-text-site/50">{label}</span>
                {value && <button onClick={() => navigator.clipboard.writeText(value)} className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider">{lang === 'zh' ? '复制' : 'Copy'}</button>}
            </div>
            <div className="p-3 bg-secondary-site border border-border-site rounded-lg font-mono text-xs break-all text-text-site leading-relaxed min-h-[42px]">
                {value}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '哈希生成器支持 SHA-1、SHA-256、SHA-384 和 SHA-512 哈希算法。使用 Web Crypto API 在浏览器本地执行哈希计算，数据不会离开您的设备。适用于数据完整性验证、文件校验、密码哈希（不推荐用于生产环境密码存储）等场景。注意：对于密码存储，请使用 bcrypt、Argon2 等专门算法。'
                        : 'The hash generator supports SHA-1, SHA-256, SHA-384, and SHA-512 hash algorithms. Uses Web Crypto API to perform hashing locally in your browser, data never leaves your device. Suitable for data integrity verification, file checksums, password hashing (not recommended for production password storage), and other scenarios. Note: For password storage, use specialized algorithms like bcrypt or Argon2.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-text-site/50">{lang === 'zh' ? '输入内容' : 'Input Text'}</label>
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-80 p-4 bg-card-bg border border-border-site rounded-xl text-sm font-mono text-text-site outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder={lang === 'zh' ? "在此输入需要哈希加密的文本..." : "Enter text to hash..."}
                />
            </div>
            <div className="space-y-4">
                <HashRow label="SHA-1" value={hashes.sha1} />
                <HashRow label="SHA-256" value={hashes.sha256} />
                <HashRow label="SHA-384" value={hashes.sha384} />
                <HashRow label="SHA-512" value={hashes.sha512} />
            </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
