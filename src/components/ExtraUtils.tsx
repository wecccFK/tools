import React, { useState, useEffect } from 'react';
import { Dice5, Shield, User, Hash, FileText, Copy, Check, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

// --- Lorem Ipsum Generator ---
export const LoremGenerator = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [count, setCount] = useState(3);
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const faqs = [
        {
            question: {
                en: 'What is Lorem Ipsum?',
                zh: '什么是 Lorem Ipsum？'
            },
            answer: {
                en: 'Lorem Ipsum is standard placeholder text used in design and publishing. It helps visualize layout without being distracted by meaningful content.',
                zh: 'Lorem Ipsum 是设计和出版中使用的标准占位文本。它有助于在不被有意义内容分散注意力的情况下可视化布局。'
            }
        },
        {
            question: {
                en: 'Can I customize the output length?',
                zh: '可以自定义输出长度吗？'
            },
            answer: {
                en: 'Yes, you can specify the number of paragraphs to generate. Each paragraph contains a realistic mix of words for authentic-looking placeholder text.',
                zh: '是的，您可以指定要生成的段落数。每个段落都包含逼真的单词组合，以产生看起来真实的占位文本。'
            }
        },
        {
            question: {
                en: 'Is this suitable for production use?',
                zh: '这适合生产使用吗？'
            },
            answer: {
                en: 'Lorem Ipsum is intended for design mockups and testing. Replace it with actual content before publishing your website or application.',
                zh: 'Lorem Ipsum 适用于设计模型和测试。在发布网站或应用程序之前，请将其替换为实际内容。'
            }
        }
    ];

    const generate = () => {
        const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis'];
        const p = [];
        for (let i = 0; i < count; i++) {
            let sentence = "";
            for (let j = 0; j < 15 + Math.random() * 20; j++) {
                sentence += words[Math.floor(Math.random() * words.length)] + " ";
            }
            p.push(sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + ".");
        }
        setOutput(p.join('\n\n'));
    };

    return (
        <div className="space-y-4">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? 'Lorem Ipsum 假文生成器可以生成指定段数的拉丁文占位文本，常用于设计和排版测试。支持自定义段数，一键复制生成的文本。适用于网页设计、印刷品排版、UI 原型制作等场景。所有生成都在浏览器本地完成，无需联网。'
                        : 'The Lorem Ipsum generator can generate a specified number of paragraphs of Latin placeholder text, commonly used for design and layout testing. Supports custom paragraph count with one-click copy. Suitable for web design, print layout, UI prototyping, and other scenarios. All generation is done locally in your browser without internet connection.'}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="w-24 p-3 bg-card-bg border border-border-site rounded-xl text-text-site" min="1" max="20" />
                <button onClick={generate} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> {isZh ? '生成假文' : 'Generate Lorem'}</button>
            </div>
            <div className="relative">
                <textarea value={output} readOnly className="w-full h-64 p-4 bg-secondary-site border border-border-site rounded-2xl font-serif text-sm text-text-site/70 leading-relaxed" />
                {output && (
                    <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),2000); }} className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm text-primary">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                )}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Password Strength ---
export const PasswordTester = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [password, setPassword] = useState('');
    const [score, setScore] = useState(0);

    const faqs = [
        {
            question: {
                en: 'How is password strength calculated?',
                zh: '密码强度是如何计算的？'
            },
            answer: {
                en: 'We evaluate length, character variety (uppercase, lowercase, numbers, symbols), and entropy. A score of 80+ indicates a strong password.',
                zh: '我们评估长度、字符多样性（大写、小写、数字、符号）和熵值。80分以上表示强密码。'
            }
        },
        {
            question: {
                en: 'Is my password stored or sent anywhere?',
                zh: '我的密码会被存储或发送到任何地方吗？'
            },
            answer: {
                en: 'No, all analysis happens locally in your browser. Your password is never transmitted or stored on any server.',
                zh: '不会，所有分析完全在您的浏览器中进行。您的密码永远不会传输或存储在任何服务器上。'
            }
        },
        {
            question: {
                en: 'What makes a password strong?',
                zh: '什么使密码变得强壮？'
            },
            answer: {
                en: 'A strong password is at least 12 characters long and includes a mix of uppercase, lowercase, numbers, and special characters. Avoid common words and patterns.',
                zh: '强密码至少12个字符，包含大写、小写、数字和特殊字符的组合。避免常见单词和模式。'
            }
        }
    ];

    const test = (pass: string) => {
        let s = 0;
        if (pass.length > 8) s++;
        if (/[A-Z]/.test(pass)) s++;
        if (/[0-9]/.test(pass)) s++;
        if (/[^A-Za-z0-9]/.test(pass)) s++;
        if (pass.length > 12) s++;
        setScore(s);
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '密码强度测试器可以评估您的密码安全性，基于长度、字符多样性（大写、小写、数字、符号）和熵值进行评分。实时显示密码强度等级，帮助您创建更安全的密码。所有分析都在浏览器本地完成，您的密码不会被发送或存储到任何服务器。'
                        : 'The password strength tester evaluates your password security based on length, character variety (uppercase, lowercase, numbers, symbols), and entropy. Displays password strength level in real-time to help you create more secure passwords. All analysis is done locally in your browser, your password is never transmitted or stored on any server.'}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-text-site/40 uppercase">{isZh ? '输入密码' : 'Enter Password'}</label>
                <input type="text" value={password} onChange={e => { setPassword(e.target.value); test(e.target.value); }} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site outline-none" />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                    <span>{isZh ? '密码强度' : 'Strength'}</span>
                    <span className={score > 3 ? 'text-green-500' : score > 1 ? 'text-orange-500' : 'text-red-500'}>
                        {score > 3 ? (isZh ? '非常强' : 'Excellent') : score > 1 ? (isZh ? '一般' : 'Moderate') : (isZh ? '较弱' : 'Weak')}
                    </span>
                </div>
                <div className="h-2 bg-secondary-site rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${(score/5)*100}%`, backgroundColor: score > 3 ? '#22c55e' : score > 1 ? '#f97316' : '#ef4444' }} />
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Random Number ---
export const RandomGen = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [decimals, setDecimals] = useState(0);
    const [count, setCount] = useState(1);
    const [results, setResults] = useState<number[]>([]);

    const faqs = [
        {
            question: {
                en: 'How random are the numbers?',
                zh: '数字有多随机？'
            },
            answer: {
                en: 'We use JavaScript Math.random() which provides pseudo-random numbers suitable for games, decisions, and non-cryptographic purposes.',
                zh: '我们使用 JavaScript Math.random()，它提供适用于游戏、决策和非加密目的的伪随机数。'
            }
        },
        {
            question: {
                en: 'What range can I use?',
                zh: '可以使用什么范围？'
            },
            answer: {
                en: 'You can set any minimum and maximum values. The result will be inclusive of both endpoints.',
                zh: '您可以设置任何最小值和最大值。结果将包含两个端点。'
            }
        },
        {
            question: {
                en: 'Is this suitable for cryptographic use?',
                zh: '这适合加密用途吗？'
            },
            answer: {
                en: 'No, this uses pseudo-random generation. For cryptographic security, use a cryptographically secure random number generator.',
                zh: '不适合，这使用伪随机生成。对于加密安全，请使用加密安全的随机数生成器。'
            }
        }
    ];

    const generate = () => {
        const newResults: number[] = [];
        for (let i = 0; i < count; i++) {
            const raw = Math.random() * (max - min) + min;
            const rounded = decimals > 0 ? Math.round(raw * Math.pow(10, decimals)) / Math.pow(10, decimals) : Math.floor(raw);
            newResults.push(rounded);
        }
        setResults(newResults);
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '随机数生成器可以生成指定范围内的随机数，支持小数（最多5位）和批量生成。适用于游戏、抽奖、决策等场景。'
                        : 'Generate random numbers within a specified range. Supports decimals (up to 5 places) and batch generation. Suitable for games, lotteries, and decisions.'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase">Min</label>
                    <input type="number" step="any" value={min} onChange={e => setMin(Number(e.target.value))} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase">Max</label>
                    <input type="number" step="any" value={max} onChange={e => setMax(Number(e.target.value))} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase">{isZh ? '小数位数' : 'Decimals'} (0-5)</label>
                    <input type="number" min={0} max={5} value={decimals} onChange={e => setDecimals(Math.min(5, Math.max(0, Number(e.target.value))))} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase">{isZh ? '生成数量' : 'Count'}</label>
                    <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site" />
                </div>
            </div>
            <button onClick={generate} className="w-full py-4 bg-secondary text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Dice5 className="w-5 h-5" /> {isZh ? '生成随机数' : 'Generate Random'}</button>
            {results.length > 0 && (
                <div className="p-6 bg-secondary-site rounded-3xl border border-border-site">
                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
                        {results.map((r, i) => (
                            <div key={i} className="text-center p-3 bg-bg2 rounded-xl text-xl font-bold text-secondary">{r}</div>
                        ))}
                    </div>
                </div>
            )}

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Age Calculator ---
export const AgeCalculator = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [birth, setBirth] = useState('');
    const [age, setAge] = useState<{ years: number, days: number } | null>(null);

    const faqs = [
        {
            question: {
                en: 'How accurate is the age calculation?',
                zh: '年龄计算有多准确？'
            },
            answer: {
                en: 'The calculation is precise to the day, accounting for leap years and exact birth date. It shows both years and total days lived.',
                zh: '计算精确到天，考虑了闰年和确切的出生日期。它显示年份和生活的总天数。'
            }
        },
        {
            question: {
                en: 'Is my birth date stored?',
                zh: '我的出生日期会被存储吗？'
            },
            answer: {
                en: 'No, your birth date is only used temporarily for the calculation. It is not stored or transmitted anywhere.',
                zh: '不会，您的出生日期仅临时用于计算。它不会被存储或传输到任何地方。'
            }
        },
        {
            question: {
                en: 'Can I calculate age for any date?',
                zh: '可以计算任何日期的年龄吗？'
            },
            answer: {
                en: 'Yes, you can enter any past birth date. The calculator will determine how many years and days have passed since that date.',
                zh: '是的，您可以输入任何过去的出生日期。计算器将确定自该日期以来已经过去了多少年和多少天。'
            }
        }
    ];

    const calculate = () => {
        if (!birth) return;
        const b = new Date(birth);
        if (isNaN(b.getTime())) return;
        const now = new Date();
        const diff = now.getTime() - b.getTime();
        if (diff < 0) return;
        setAge({
            years: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
            days: Math.floor(diff / (1000 * 60 * 60 * 24))
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '年龄计算器可以根据出生日期精确计算您的年龄，显示周岁和已生活的总天数。计算考虑了闰年和确切日期，结果精确到天。适用于生日纪念、年龄查询、生活天数统计等场景。所有计算都在浏览器本地完成，您的出生日期不会被存储。'
                        : 'The age calculator can accurately calculate your age based on birth date, displaying full years and total days lived. The calculation accounts for leap years and exact dates, with results precise to the day. Suitable for birthday anniversaries, age queries, life day statistics, and other scenarios. All calculations are done locally in your browser, your birth date is not stored.'}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-text-site/40 uppercase">{isZh ? '出生日期' : 'Birthday'}</label>
                <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site" />
            </div>
            <button onClick={calculate} className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2"><User className="w-5 h-5" /> {isZh ? '计算年龄' : 'Calculate Age'}</button>
            {age && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary-site rounded-2xl border border-border-site text-center">
                        <div className="text-[10px] font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '周岁' : 'Full Years'}</div>
                        <div className="text-2xl font-black text-text-site">{age.years}</div>
                    </div>
                    <div className="p-4 bg-secondary-site rounded-2xl border border-border-site text-center">
                        <div className="text-[10px] font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '已生活天数' : 'Total Days'}</div>
                        <div className="text-2xl font-black text-text-site">{age.days}</div>
                    </div>
                </div>
            )}

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Base Converter ---
export const BaseConverter = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [val, setVal] = useState('');
    const [baseIn, setBaseIn] = useState(10);
    const [baseOut, setBaseOut] = useState(16);
    const [results, setResults] = useState<{ [key: number]: string }>({});

    const faqs = [
        {
            question: {
                en: 'What number bases are supported?',
                zh: '支持哪些数字进制？'
            },
            answer: {
                en: 'We support binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Common for programming and computer science.',
                zh: '我们支持二进制（2进制）、八进制（8进制）、十进制（10进制）和十六进制（16进制）。常见于编程和计算机科学。'
            }
        },
        {
            question: {
                en: 'How do I use the converter?',
                zh: '如何使用转换器？'
            },
            answer: {
                en: 'Enter your number, select the input base, and choose the output base. The result will be displayed instantly.',
                zh: '输入您的数字，选择输入进制，然后选择输出进制。结果将立即显示。'
            }
        },
        {
            question: {
                en: 'Can I convert between any bases?',
                zh: '可以在任意进制之间转换吗？'
            },
            answer: {
                en: 'Yes, you can convert from any supported base to any other supported base. The conversion is done using JavaScript parseInt and toString.',
                zh: '是的，您可以从任何支持的进制转换到任何其他支持的进制。转换使用 JavaScript parseInt 和 toString 完成。'
            }
        }
    ];

    const convert = (v: string, b: number) => {
        setVal(v);
        setBaseIn(b);
        try {
            const decimal = parseInt(v, b);
            if (isNaN(decimal)) return setResults({});
            setResults({
                2: decimal.toString(2),
                8: decimal.toString(8),
                10: decimal.toString(10),
                16: decimal.toString(16).toUpperCase()
            });
        } catch (e) {
            setResults({});
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '进制转换器支持二进制、八进制、十进制和十六进制之间的相互转换。输入任意进制的数字，自动转换为其他所有进制。适用于编程、计算机科学、数学计算等场景。支持实时转换，输入即显示结果。所有计算都在浏览器本地完成。'
                        : 'The base converter supports conversion between binary, octal, decimal, and hexadecimal. Enter a number in any base and automatically convert to all other bases. Suitable for programming, computer science, mathematical calculations, and other scenarios. Supports real-time conversion with instant results. All calculations are done locally in your browser.'}
                </p>
            </div>

            <div className="flex gap-4">
                <input type="text" value={val} onChange={e => convert(e.target.value, baseIn)} className="flex-1 p-4 bg-card-bg border border-border-site rounded-2xl text-text-site font-mono" placeholder="Input number..." />
                <select value={baseIn} onChange={e => convert(val, Number(e.target.value))} className="w-28 p-4 bg-secondary-site border border-border-site rounded-2xl text-xs font-bold text-text-site">
                    <option value={2}>Bin (2)</option>
                    <option value={8}>Oct (8)</option>
                    <option value={10}>Dec (10)</option>
                    <option value={16}>Hex (16)</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[2, 8, 10, 16].map(b => (
                   <div key={b} className="p-4 bg-secondary-site rounded-2xl border border-border-site flex justify-between items-center group">
                       <div className="text-[10px] font-bold text-text-site/40 uppercase">Base {b}</div>
                       <div className="font-mono text-text-site font-bold break-all ml-4">{results[b] || '-'}</div>
                   </div>
               ))}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
