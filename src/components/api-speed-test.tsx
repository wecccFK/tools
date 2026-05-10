import React, { useState } from 'react';
import { Check, X, Loader2, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

interface ModelStat {
    id: string;
    ttft: number | null; // Time to First Token (ms)
    totalTime: number | null;
    tps: number | null; // Tokens per second
    status: 'idle' | 'testing' | 'success' | 'error';
    errorMsg?: string;
    tokens: string;
}

const PRESETS = [
    { name: 'OpenAI (Official)', url: 'https://api.openai.com/v1' },
    { name: 'DeepSeek', url: 'https://api.deepseek.com' },
    { name: 'Anthropic', url: 'https://api.anthropic.com/v1' },
    { name: 'Groq', url: 'https://api.groq.com/openai/v1' },
    { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
];

export const ApiSpeedTest = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
    const [apiKey, setApiKey] = useState('');
    const [models, setModels] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
    const [stats, setStats] = useState<Record<string, ModelStat>>({});
    const [isFetchingModels, setIsFetchingModels] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const faqs = [
        {
            question: {
                en: 'What does this tool test?',
                zh: '此工具测试什么？'
            },
            answer: {
                en: 'We test Time to First Token (TTFT), total response time, and tokens per second (TPS) for AI API models. This helps you compare model performance.',
                zh: '我们测试 AI API 模型的首字时间（TTFT）、总响应时间和每秒令牌数（TPS）。这有助于您比较模型性能。'
            }
        },
        {
            question: {
                en: 'Is my API key safe?',
                zh: '我的 API Key 安全吗？'
            },
            answer: {
                en: 'Your API key is used only for the test requests you initiate. We do not store or transmit your key to any third-party servers.',
                zh: '您的 API Key 仅用于您发起的测试请求。我们不存储或将您的密钥传输给任何第三方服务器。'
            }
        },
        {
            question: {
                en: 'Why use a proxy?',
                zh: '为什么使用代理？'
            },
            answer: {
                en: 'The proxy option helps bypass CORS restrictions when testing APIs directly from the browser. Disable it if you have a backend server.',
                zh: '代理选项有助于在直接从浏览器测试 API 时绕过 CORS 限制。如果您有后端服务器，可以禁用它。'
            }
        }
    ];

    const handleFetchModels = async () => {
        if (!baseUrl || !apiKey) {
           alert(isZh ? '请输入 API Key 和 Base URL' : 'Please enter API Key and Base URL');
           return;
        }
        setIsFetchingModels(true);
        setFetchError(null);
        try {
            const res = await fetch('/api/ai-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: `${baseUrl.replace(/\/$/, '')}/models`,
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                })
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            
            let rawModelIds: string[] = [];
            if (Array.isArray(data.data)) rawModelIds = data.data.map((m: any) => m.id);
            else if (Array.isArray(data)) rawModelIds = data.map((m: any) => m.id);
            else if (Array.isArray(data.models)) rawModelIds = data.models.map((m: any) => m.id);
            
            // Deduplicate IDs to prevent React key warnings
            const modelIds = Array.from(new Set(rawModelIds)).filter(Boolean);
            
            setModels(modelIds);
            setSelectedModels(new Set(modelIds.slice(0, 4)));
            
            const initialStats: Record<string, ModelStat> = {};
            modelIds.forEach((id: string) => {
                initialStats[id] = { id, ttft: null, totalTime: null, tps: null, status: 'idle', tokens: '' };
            });
            setStats(initialStats);
        } catch (error: any) {
            setFetchError(error.message);
        }
        setIsFetchingModels(false);
    };

    const toggleModel = (id: string) => {
        const next = new Set(selectedModels);
        if (next.has(id)) next.delete(id);
        else {
            next.add(id);
            if (!stats[id]) {
                setStats(prev => ({
                    ...prev,
                    [id]: { id, ttft: null, totalTime: null, tps: null, status: 'idle', tokens: '' }
                }));
            }
        }
        setSelectedModels(next);
    };

    const addSpecialModels = () => {
        const specials = ['big-pickle', 'nemotron-3-super-free', 'gpt-5-nano', 'minimax-m2.5-free'];
        const next = new Set(selectedModels);
        const newStats = { ...stats };
        specials.forEach(id => {
            next.add(id);
            if (!newStats[id]) {
                newStats[id] = { id, ttft: null, totalTime: null, tps: null, status: 'idle', tokens: '' };
            }
        });
        setStats(newStats);
        setSelectedModels(next);
    };

    const runSpeedTest = async () => {
        if (selectedModels.size === 0) return;
        setIsTesting(true);

        const testPromises = Array.from(selectedModels).map(async (model) => {
            setStats(prev => ({ 
                ...prev, 
                [model]: { ...prev[model], status: 'testing', errorMsg: undefined, tokens: '', ttft: null, totalTime: null, tps: null } 
            }));
            
            const startTime = performance.now();
            let firstTokenTime: number | null = null;
            let currentTextLength = 0;
            let lastTokenTime = 0;

            try {
                const response = await fetch('/api/ai-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: `${baseUrl.replace(/\/$/, '')}/chat/completions`,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                        body: {
                            model: model,
                            messages: [
                                { role: 'system', content: 'You are a speed test bot. Direct answer only. No preamble, no meta-commentary, no "Let me help".' },
                                { role: 'user', content: '请以“科技改变生活”为题，直接写一段150字左右的文案。只需给出正文，不要有任何前言或心理活动描述。'}
                            ],
                            max_tokens: 250,
                            stream: true
                        }
                    })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                if (!reader) throw new Error("No body");

                let partialLine = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = (partialLine + chunk).split('\n');
                    partialLine = lines.pop() || '';

                    for (const line of lines) {
                        const msg = line.replace(/^data: /, '').trim();
                        if (!msg || msg === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(msg);
                            const content = parsed.choices?.[0]?.delta?.content || '';
                            if (content) {
                                let ttftUpdate = null;
                                if (firstTokenTime === null) {
                                    firstTokenTime = performance.now();
                                    ttftUpdate = firstTokenTime - startTime;
                                }
                                
                                currentTextLength += content.length * 1.3;
                                lastTokenTime = performance.now();
                                
                                // Real-time TPS Calculation
                                const activeTime = (lastTokenTime - (firstTokenTime || startTime)) / 1000;
                                const liveTps = activeTime > 0.1 ? (currentTextLength / activeTime) : null;

                                setStats(prev => ({
                                    ...prev,
                                    [model]: { 
                                        ...prev[model], 
                                        tokens: prev[model].tokens + content,
                                        ttft: ttftUpdate || prev[model].ttft,
                                        tps: liveTps
                                    }
                                }));
                            }
                        } catch (e) {}
                    }
                }

                const generationTimeInSec = (lastTokenTime - (firstTokenTime || startTime)) / 1000;
                const finalTps = generationTimeInSec > 0 ? (currentTextLength / generationTimeInSec) : 0;
                
                setStats(prev => ({ 
                    ...prev, 
                    [model]: { 
                        ...prev[model], 
                        status: 'success', 
                        totalTime: performance.now() - startTime, 
                        tps: finalTps
                    } 
                }));
            } catch (error: any) {
                setStats(prev => ({ ...prev, [model]: { ...prev[model], status: 'error', errorMsg: error.message } }));
            }
        });

        await Promise.all(testPromises);
        setIsTesting(false);
    };

    return (
        <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? 'API 速度测试工具可以测试 AI 大模型的首字时间（TTFT）、总响应时间和每秒令牌数（TPS）。支持多个模型同时测试，帮助您比较不同模型的性能。使用安全代理绕过 CORS 限制。您的 API Key 仅用于测试请求，不会被存储或传输。适用于模型性能评估、API 选择、速度优化等场景。'
                        : 'The API speed test tool can test Time to First Token (TTFT), total response time, and tokens per second (TPS) for AI LLM models. Supports testing multiple models simultaneously to help you compare model performance. Uses secure proxy to bypass CORS restrictions. Your API key is only used for test requests, not stored or transmitted. Suitable for model performance evaluation, API selection, speed optimization, and other scenarios.'}
                </p>
            </div>

            <div className="bg-card-bg p-6 rounded-[32px] border border-border-site shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">{isZh ? 'API 大模型流式测速' : 'LLM API Speed Test'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-text-site/40 pl-1">Base URL</label>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-secondary-site text-text-site border border-border-site outline-none focus:border-primary transition-all font-mono text-sm"
                        />
                        <div className="flex flex-wrap gap-2 pt-1">
                            {PRESETS.map(p => (
                                <button key={p.name} onClick={() => setBaseUrl(p.url)} className="text-[10px] bg-secondary-site px-2 py-1 rounded-lg text-text-site/50 hover:text-primary transition-colors border border-border-site">{p.name}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-text-site/40 pl-1">API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-secondary-site text-text-site border border-border-site outline-none focus:border-primary transition-all font-mono text-sm"
                        />
                        <div className="flex items-center gap-2 pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-bold text-primary/70">{isZh ? '内置安全中转 (已自动开启)' : 'Secure Proxy Enabled'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={addSpecialModels}
                        className="px-6 py-3.5 bg-secondary-site text-text-site/60 border border-border-site rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-primary transition-all flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        {isZh ? '添加性能预设' : 'Presets'}
                    </button>
                    <button 
                        onClick={handleFetchModels}
                        disabled={isFetchingModels || !apiKey}
                        className="px-8 py-3.5 bg-text-site text-bg-site rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-20"
                    >
                        {isFetchingModels ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isZh ? '扫描并同步' : 'Scan & Sync'}
                    </button>
                </div>
            </div>

            {models.length > 0 && (
                <div className="bg-card-bg p-6 rounded-[32px] border border-border-site shadow-sm space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-bold text-sm">{isZh ? '待测模型清单' : 'Available Models'}</h3>
                        <div className="flex gap-4">
                            <button onClick={() => setSelectedModels(new Set(models))} className="text-[10px] font-bold text-primary hover:underline">{isZh ? '全选' : 'Select All'}</button>
                            <button onClick={() => setSelectedModels(new Set())} className="text-[10px] font-bold text-text-site/30 hover:underline">{isZh ? '取消全选' : 'Clear'}</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto no-scrollbar border border-border-site/50 p-2 rounded-2xl">
                        {models.map(id => (
                            <div 
                                key={id} 
                                onClick={() => toggleModel(id)}
                                className={cn(
                                    "px-3 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all truncate",
                                    selectedModels.has(id) ? "bg-primary/5 border-primary/20 text-primary" : "border-transparent text-text-site/40 hover:bg-secondary-site"
                                )}
                            >
                                {id}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={runSpeedTest}
                        disabled={isTesting || selectedModels.size === 0}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all text-sm disabled:opacity-50"
                    >
                        {isTesting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (isZh ? '启动并发测速' : 'Start Speed Test')}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from(selectedModels).map(id => {
                    const s = stats[id];
                    if (!s || s.status === 'idle') return null;
                    return (
                        <div key={id} className="bg-card-bg border border-border-site rounded-[32px] p-6 space-y-4 relative overflow-hidden group transition-all hover:border-primary/30">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-text-site truncate max-w-[200px]">{id}</h4>
                                <div className="flex items-center gap-2">
                                    {s.status === 'testing' && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
                                    {s.status === 'success' && <Check className="w-3 h-3 text-green-500" />}
                                    {s.status === 'error' && <X className="w-3 h-3 text-red-500" />}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-secondary-site/50 p-4 rounded-2xl border border-border-site/30 text-center">
                                    <div className="text-[9px] font-black uppercase text-text-site/30 tracking-widest mb-1">TTFT (延迟)</div>
                                    <div className={cn("text-lg font-mono font-black", s.ttft ? "text-primary" : "text-text-site/10")}>
                                        {s.ttft ? s.ttft.toFixed(0) + 'ms' : '--'}
                                    </div>
                                </div>
                                <div className="bg-secondary-site/50 p-4 rounded-2xl border border-border-site/30 text-center">
                                    <div className="text-[9px] font-black uppercase text-text-site/30 tracking-widest mb-1">Tokens/s (速度)</div>
                                    <div className={cn("text-lg font-mono font-black", s.tps ? "text-primary" : "text-text-site/10")}>
                                        {s.tps ? s.tps.toFixed(1) : '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-2xl p-4 h-48 border border-white/5 relative overflow-hidden">
                                <div className="absolute top-2 right-4 text-[8px] font-bold text-white/10 uppercase italic">Live Output Stream</div>
                                <div className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-blue-100/70 overflow-y-auto h-full scroll-m-0 no-scrollbar">
                                    {s.tokens || (s.status === 'testing' ? (isZh ? '正在连接流式输出...' : 'Connecting stream...') : (isZh ? '等待指令...' : 'Idle.'))}
                                </div>
                                {s.status === 'error' && <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm flex items-center justify-center p-4 text-[10px] text-red-200 font-bold text-center">Error: {s.errorMsg}</div>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
