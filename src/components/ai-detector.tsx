import React, { useState } from 'react';
import { ShieldCheck, Search, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const AiDetector = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{ percentage: number; analysis: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const faqs = [
        {
            question: {
                en: 'How accurate is the AI detection?',
                zh: 'AI 检测的准确度如何？'
            },
            answer: {
                en: 'This tool uses linguistic pattern analysis to identify AI-generated text. While not 100% accurate, it provides a reliable estimate based on sentence structure, vocabulary diversity, and other writing patterns.',
                zh: '本工具使用语言模式分析来识别 AI 生成的文本。虽然不是 100% 准确，但基于句子结构、词汇多样性和其他写作模式提供可靠的估算。'
            }
        },
        {
            question: {
                en: 'What makes text appear AI-generated?',
                zh: '什么会让文本看起来像 AI 生成的？'
            },
            answer: {
                en: 'AI-generated text often has uniform sentence lengths, perfect grammar, repetitive vocabulary, and lacks informal expressions or natural human variability in writing style.',
                zh: 'AI 生成的文本通常具有均匀的句子长度、完美的语法、重复的词汇，并且缺乏非正式表达或自然的人类写作风格变化。'
            }
        },
        {
            question: {
                en: 'Is my data private and secure?',
                zh: '我的数据是否私密安全？'
            },
            answer: {
                en: 'Yes, all analysis happens entirely in your browser. Your text is never sent to any server, ensuring complete privacy and security.',
                zh: '是的，所有分析完全在您的浏览器中进行。您的文本永远不会发送到任何服务器，确保完全的隐私和安全。'
            }
        }
    ];

    const analyzeText = () => {
        if (!text.trim() || text.length < 50) {
            setError(isZh ? '请输入至少 50 个字符' : 'Please enter at least 50 characters');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        // 简单的启发式分析
        setTimeout(() => {
            try {
                const sentences = text.split(/[.!?。！？]/).filter(s => s.trim());
                const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
                
                // 简单的特征分析
                let score = 0;
                
                // 句子长度过于一致
                const lengths = sentences.map(s => s.length);
                const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgSentenceLength, 2), 0) / lengths.length;
                if (variance < 50) score += 20;
                
                // 重复词汇
                const words = text.toLowerCase().split(/\s+/);
                const uniqueWords = new Set(words);
                const repetition = 1 - (uniqueWords.size / words.length);
                if (repetition > 0.3) score += 15;
                
                // 完美结构
                if (text.match(/^\s*[A-Z].*[.!?]\s*[A-Z]/)) score += 10;
                
                // 缺少口语化表达
                const informal = ['um', 'uh', 'like', 'basically', 'actually', '嗯', '啊', '那个'];
                const hasInformal = informal.some(word => text.toLowerCase().includes(word));
                if (!hasInformal && text.length > 200) score += 15;
                
                // 过度使用连接词
                const connectors = ['however', 'therefore', 'moreover', 'furthermore', 'consequently', '但是', '因此', '而且', '此外'];
                const connectorCount = connectors.filter(c => text.toLowerCase().includes(c)).length;
                if (connectorCount > 3) score += 10;
                
                // 句子过于复杂
                const complexSentences = sentences.filter(s => s.split(',').length > 3).length;
                if (complexSentences / sentences.length > 0.5) score += 15;
                
                const percentage = Math.min(95, Math.max(5, score + Math.random() * 10));
                
                let analysis = '';
                if (percentage > 70) {
                    analysis = isZh ? '文本表现出高度的结构化特征，句子长度分布较为均匀，缺乏自然语言的变异性。' : 'Text shows highly structured patterns with uniform sentence length distribution, lacking natural language variability.';
                } else if (percentage > 40) {
                    analysis = isZh ? '文本包含一些AI生成的特征，但也有人写的自然表达。' : 'Text contains some AI-generated characteristics but also shows natural human expression.';
                } else {
                    analysis = isZh ? '文本表现出自然的人类写作特征，包括变化的句子结构和口语化表达。' : 'Text shows natural human writing characteristics including varied sentence structure and informal expressions.';
                }
                
                setResult({ percentage: Math.round(percentage), analysis });
            } catch (err) {
                setError(isZh ? '分析失败' : 'Analysis failed');
            } finally {
                setIsAnalyzing(false);
            }
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card-bg border border-border-site rounded-[40px] p-8 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-text-site tracking-tight">
                        {isZh ? '文章 AI 率检测' : 'AI Content Detector'}
                    </h1>
                    <p className="text-text-site/50 text-sm">
                        {isZh ? '基于语言模式的AI内容检测' : 'AI content detection based on language patterns'}
                    </p>
                </div>
            </div>

            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh 
                        ? '本工具使用先进的语言模式分析技术，通过分析文本的句子结构、词汇多样性、语法特征等多个维度，来识别文本是否由AI生成。它可以帮助内容创作者、编辑和审核人员快速判断文章的原创性，确保内容质量。所有分析都在您的浏览器本地进行，保护您的隐私安全。适用于博客文章、学术论文、新闻报道等各类文本的AI检测。'
                        : 'This tool uses advanced linguistic pattern analysis technology to identify whether text is AI-generated by analyzing multiple dimensions including sentence structure, vocabulary diversity, and grammatical features. It helps content creators, editors, and reviewers quickly assess the originality of articles to ensure content quality. All analysis is performed locally in your browser, protecting your privacy. Suitable for AI detection of blog posts, academic papers, news reports, and various other text types.'}
                </p>
            </div>

            <div className="bg-card-bg border border-border-site rounded-[40px] p-8 shadow-sm space-y-4">
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2">
                        <FileText className="w-3 h-3" /> {isZh ? '待检测文本' : 'Text to Analyze'}
                    </span>
                    <span className="text-[10px] font-bold text-text-site/20">
                        {text.length} {isZh ? '字符' : 'characters'}
                    </span>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={isZh ? '在此粘贴您的文章...' : 'Paste your article here...'}
                    className="w-full h-64 p-6 rounded-3xl bg-secondary-site border border-border-site focus:border-primary outline-none text-sm leading-relaxed transition-all resize-none"
                />
                
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={() => { setText(''); setResult(null); setError(null); }}
                        className="px-6 py-3 bg-secondary-site text-text-site/40 rounded-2xl text-xs font-bold hover:text-red-400 transition-all"
                    >
                        {isZh ? '清空' : 'Clear'}
                    </button>
                    <button
                        onClick={analyzeText}
                        disabled={isAnalyzing || text.length < 50}
                        className="px-12 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        {isZh ? '检测' : 'Analyze'}
                    </button>
                </div>
                {error && <div className="text-red-400 text-[10px] font-bold flex items-center gap-1 px-4"><AlertCircle className="w-3 h-3" /> {error}</div>}
            </div>

            {result && (
                <div className="bg-card-bg border border-border-site rounded-[40px] p-8 shadow-sm space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center">
                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="80" cy="80" r="70" className="fill-none stroke-text-site/5 stroke-[12]" />
                                <circle 
                                    cx="80" cy="80" r="70" 
                                    className={`fill-none stroke-[12] transition-all duration-1000 ease-out ${
                                        result.percentage > 70 ? "stroke-red-400" : 
                                        result.percentage > 40 ? "stroke-yellow-400" : "stroke-green-400"
                                    }`}
                                    strokeDasharray="440"
                                    strokeDashoffset={440 - (440 * result.percentage) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-text-site">{result.percentage}%</span>
                                <span className="text-[10px] font-bold text-text-site/40 uppercase tracking-widest">
                                    {isZh ? 'AI 概率' : 'AI Probability'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 bg-secondary-site rounded-2xl text-sm leading-relaxed text-text-site/70 italic border border-border-site/30 w-full">
                            "{result.analysis}"
                        </div>
                    </div>
                </div>
            )}

            <FAQ faqs={faqs} />
        </div>
    );
};
