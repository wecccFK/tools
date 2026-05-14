import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const PomodoroTimer = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const faqs = [
        {
            question: {
                en: 'What is the Pomodoro Technique?',
                zh: '什么是番茄工作法？'
            },
            answer: {
                en: 'The Pomodoro Technique is a time management method using 25-minute work intervals followed by 5-minute breaks. After 4 cycles, take a longer 15-30 minute break.',
                zh: '番茄工作法是一种时间管理方法，使用 25 分钟的工作间隔，然后是 5 分钟的休息。4 个周期后，进行更长的 15-30 分钟休息。'
            }
        },
        {
            question: {
                en: 'Can I customize the timer?',
                zh: '可以自定义计时器吗？'
            },
            answer: {
                en: 'Currently we use the standard 25/5 minute work/break ratio. Future updates may include customizable time settings for different productivity styles.',
                zh: '目前我们使用标准的 25/5 分钟工作/休息比例。未来的更新可能包括针对不同生产力风格的可自定义时间设置。'
            }
        },
        {
            question: {
                en: 'Does it work in the background?',
                zh: '它在后台工作吗？'
            },
            answer: {
                en: 'The timer runs as long as the browser tab is open. Switching to other tabs may affect timing accuracy depending on your browser settings.',
                zh: '只要浏览器标签页打开，计时器就会运行。切换到其他标签页可能会根据您的浏览器设置影响计时准确性。'
            }
        }
    ];

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        setIsRunning(false);
                        const nextMode = mode === 'work' ? 'break' : 'work';
                        setMode(nextMode);
                        return nextMode === 'work' ? 25 * 60 : 5 * 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, mode]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    };

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');

    return (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6 w-full max-w-[400px]">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '番茄工作法计时器使用标准的 25 分钟工作间隔和 5 分钟休息间隔。4 个周期后进行更长的 15-30 分钟休息。适用于时间管理、专注工作、学习效率提升等场景。只要浏览器标签页打开，计时器就会运行。'
                        : 'The Pomodoro timer uses the standard 25-minute work intervals and 5-minute break intervals. After 4 cycles, take a longer 15-30 minute break. Suitable for time management, focused work, learning efficiency improvement, and other scenarios. The timer runs as long as the browser tab is open.'}
                </p>
            </div>

            <div className="flex gap-4 p-1 bg-secondary-site rounded-xl">
                <button 
                    onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsRunning(false); }}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'work' ? 'bg-card-bg shadow-sm text-text-site' : 'text-text-site/50'}`}
                >
                    {lang === 'zh' ? '专注 (25m)' : 'Focus (25m)'}
                </button>
                <button 
                    onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsRunning(false); }}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'break' ? 'bg-card-bg shadow-sm text-text-site' : 'text-text-site/50'}`}
                >
                    {lang === 'zh' ? '休息 (5m)' : 'Break (5m)'}
                </button>
            </div>
            
            <div className={`text-[8rem] font-bold font-mono leading-none tracking-tighter tabular-nums ${mode === 'work' ? 'text-primary' : 'text-green-500'}`}>
                {minutes}:{seconds}
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={toggleTimer} 
                    className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
                <button 
                    onClick={resetTimer} 
                    className="w-16 h-16 rounded-full bg-secondary-site text-text-site flex items-center justify-center hover:bg-border-site transition-colors"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>
            <p className="text-sm text-text-site/50 uppercase tracking-widest font-bold">
                {isRunning ? (lang === 'zh' ? '保持专注...' : 'Stay focused...') : (lang === 'zh' ? '准备开始' : 'Ready to start')}
            </p>

            <FAQ faqs={faqs} />
        </div>
    );
};


export const UrlEncoder = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const faqs = [
        {
            question: {
                en: 'Why do I need URL encoding?',
                zh: '为什么需要 URL 编码？'
            },
            answer: {
                en: 'URLs can only contain ASCII characters. Encoding converts special characters, spaces, and non-ASCII characters into a format safe for transmission over the internet.',
                zh: 'URL 只能包含 ASCII 字符。编码将特殊字符、空格和非 ASCII 字符转换为适合在互联网上传输的格式。'
            }
        },
        {
            question: {
                en: 'What characters get encoded?',
                zh: '哪些字符会被编码？'
            },
            answer: {
                en: 'Characters like spaces, quotes, ampersands, and non-ASCII characters are encoded as %XX where XX is the hexadecimal value. Safe characters like letters and numbers remain unchanged.',
                zh: '空格、引号、符号和非 ASCII 字符等字符被编码为 %XX，其中 XX 是十六进制值。字母和数字等安全字符保持不变。'
            }
        },
        {
            question: {
                en: 'Is this reversible?',
                zh: '这是可逆的吗？'
            },
            answer: {
                en: 'Yes, URL encoding is fully reversible. Use the decode function to convert encoded URLs back to their original form. Perfect for debugging URL parameters.',
                zh: '是的，URL 编码完全可逆。使用解码函数将编码的 URL 转换回原始形式。非常适合调试 URL 参数。'
            }
        }
    ];

    const handleAction = () => {
        try {
            setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
        } catch (e) {
            setOutput('Error decoding URL string.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? 'URL 编码解码器支持 URL 编码和解码操作。URL 只能包含 ASCII 字符，此工具将特殊字符、空格和非 ASCII 字符转换为 %XX 格式。编码完全可逆。适用于调试 URL 参数、处理特殊字符、网络开发等场景。'
                        : 'The URL encoder/decoder supports URL encoding and decoding operations. URLs can only contain ASCII characters, this tool converts special characters, spaces, and non-ASCII characters to %XX format. Encoding is fully reversible. Suitable for debugging URL parameters, handling special characters, web development, and other scenarios.'}
                </p>
            </div>

            <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-secondary-site rounded-lg w-fit">
                <button 
                    onClick={() => setMode('encode')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'encode' ? 'bg-card-bg shadow-sm text-text-site' : 'text-text-site/50 hover:text-text-site'}`}
                >
                    {lang === 'zh' ? '编码' : 'Encode'}
                </button>
                <button 
                    onClick={() => setMode('decode')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'decode' ? 'bg-card-bg shadow-sm text-text-site' : 'text-text-site/50 hover:text-text-site'}`}
                >
                    {lang === 'zh' ? '解码' : 'Decode'}
                </button>
            </div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 p-4 bg-card-bg border border-border-site rounded-xl outline-none focus:ring-1 focus:ring-primary font-mono text-sm text-text-site"
                placeholder={lang === 'zh' ? "在此粘贴网址..." : "https://example.com/?q=hello world"}
            />
            <button onClick={handleAction} className="w-full py-3 bg-primary text-white rounded-xl font-bold">{lang === 'zh' ? '处理' : 'Process'}</button>
            <div className="space-y-2 pt-4 border-t border-border-site">
                <label className="text-[10px] uppercase text-text-site/50 font-bold">{lang === 'zh' ? '输出结果' : 'Output'}</label>
                <div className="p-4 bg-secondary-site border border-border-site rounded-xl font-mono text-sm break-all min-h-[4rem] text-text-site">
                    {output}
                </div>
            </div>

            <FAQ faqs={faqs} />
            </div>
        </div>
    );
};

