import React, { useState } from 'react';
import { Layers, Copy, Check, RefreshCw, Palette } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { cn } from '../lib/utils';
import { FAQ } from './FAQ';

export const GlassmorphismGen = () => {
    const { lang } = useLanguage();
    const [blur, setBlur] = useState(15);
    const [opacity, setOpacity] = useState(0.2);
    const [color, setColor] = useState('#ffffff');
    const [saturation, setSaturation] = useState(100);
    const [copied, setCopied] = useState(false);

    const faqs = [
        {
            question: {
                en: 'What is glassmorphism?',
                zh: '什么是毛玻璃效果？'
            },
            answer: {
                en: 'Glassmorphism is a design trend that uses background blur, transparency, and subtle borders to create a frosted glass effect. It adds depth and modern aesthetics to UI.',
                zh: '毛玻璃效果是一种设计趋势，使用背景模糊、透明度和微妙的边框来创建磨砂玻璃效果。它为 UI 增加了深度和现代美感。'
            }
        },
        {
            question: {
                en: 'How do I use the generated CSS?',
                zh: '如何使用生成的 CSS？'
            },
            answer: {
                en: 'Copy the CSS code and apply it to any element in your project. Make sure the element has a colorful background behind it for the effect to be visible.',
                zh: '复制 CSS 代码并将其应用到项目中的任何元素。确保元素后面有彩色背景，以便效果可见。'
            }
        },
        {
            question: {
                en: 'Can I customize the glass effect?',
                zh: '可以自定义毛玻璃效果吗？'
            },
            answer: {
                en: 'Yes, you can adjust blur amount, opacity, color, and saturation to create different glass styles from subtle to strong.',
                zh: '是的，您可以调整模糊量、不透明度、颜色和饱和度，以创建从微妙到强烈的不同毛玻璃风格。'
            }
        }
    ];

    const cssCode = `/* Glassmorphism card effect */
background: ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: 20px;
border: 1px solid rgba(255, 255, 255, 0.1);`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        setBlur(15);
        setOpacity(0.2);
        setColor('#ffffff');
        setSaturation(100);
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {lang === 'zh'
                        ? '毛玻璃效果生成器可以帮助您快速创建现代 UI 设计中流行的毛玻璃效果。通过调整模糊度、透明度、颜色和饱和度等参数，实时预览效果并生成对应的 CSS 代码。适用于制作卡片、导航栏、弹窗等 UI 组件。生成的 CSS 代码可以直接复制到您的项目中使用。'
                        : 'The glassmorphism generator helps you quickly create the popular frosted glass effect in modern UI design. Adjust parameters like blur, opacity, color, and saturation to preview the effect in real-time and generate the corresponding CSS code. Suitable for creating cards, navigation bars, modals, and other UI components. The generated CSS code can be copied directly into your project.'}
                </p>
            </div>

            <div className="bg-card-bg rounded-3xl p-8 border border-border-site shadow-xl overflow-hidden relative">
                {/* Visual Preview Section */}
                <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden flex items-center justify-center">
                    {/* Background Blobs for depth */}
                    <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/40 rounded-full blur-[60px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/40 rounded-full blur-[80px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400/30 rounded-full blur-[50px]" />
                    
                    {/* The Glass Card */}
                    <div 
                        style={{
                            background: `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                            backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            border: '1px solid rgba(255, 255, 255, 0.18)'
                        }}
                        className="w-[280px] h-[180px] rounded-[20px] z-10 flex flex-col items-center justify-center p-6 text-center select-none shadow-2xl"
                    >
                        <Layers className="w-10 h-10 mb-3 text-white drop-shadow-md" />
                        <h4 className="text-white font-black uppercase tracking-widest text-sm drop-shadow-md">
                            {lang === 'zh' ? '预览效果' : 'Preview glass'}
                        </h4>
                        <p className="text-white/70 text-[10px] mt-1 font-medium drop-shadow-sm uppercase tracking-tighter">
                            Modern UI Design Kit
                        </p>
                    </div>

                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                                <Palette className="w-4 h-4" /> 
                                {lang === 'zh' ? '参数调节' : 'Parameters'}
                            </h3>
                            <button 
                                onClick={reset}
                                className="text-[10px] uppercase font-bold text-primary hover:underline flex items-center gap-1"
                            >
                                <RefreshCw className="w-3 h-3" /> {lang === 'zh' ? '重置' : 'Reset'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="font-bold uppercase tracking-widest opacity-60">Blur ({blur}px)</span>
                                </div>
                                <input 
                                    type="range" min="0" max="40" step="1" 
                                    value={blur} onChange={(e) => setBlur(Number(e.target.value))}
                                    className="w-full h-1.5 bg-secondary-site rounded-lg appearance-none cursor-pointer accent-primary" 
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="font-bold uppercase tracking-widest opacity-60">Opacity ({Math.round(opacity * 100)}%)</span>
                                </div>
                                <input 
                                    type="range" min="0" max="1" step="0.01" 
                                    value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}
                                    className="w-full h-1.5 bg-secondary-site rounded-lg appearance-none cursor-pointer accent-primary" 
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="font-bold uppercase tracking-widest opacity-60">Saturation ({saturation}%)</span>
                                </div>
                                <input 
                                    type="range" min="0" max="300" step="1" 
                                    value={saturation} onChange={(e) => setSaturation(Number(e.target.value))}
                                    className="w-full h-1.5 bg-secondary-site rounded-lg appearance-none cursor-pointer accent-primary" 
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="font-bold uppercase tracking-widest opacity-60">Base Color</span>
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={color} onChange={(e) => setColor(e.target.value)}
                                        className="w-12 h-8 rounded border-0 cursor-pointer bg-transparent" 
                                    />
                                    <input 
                                        type="text" 
                                        value={color} onChange={(e) => setColor(e.target.value)}
                                        className="flex-1 bg-secondary-site rounded px-3 text-xs font-mono border border-border-site"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Code */}
                    <div className="space-y-4">
                        <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                            <Copy className="w-4 h-4" /> 
                            CSS Code
                        </h3>
                        <div className="relative group">
                            <pre className="bg-secondary-site text-text-site p-6 rounded-2xl text-[10px] font-mono leading-relaxed border border-border-site overflow-x-auto min-h-[160px]">
                                {cssCode}
                            </pre>
                            <button 
                                onClick={copyToClipboard}
                                className={cn(
                                    "absolute top-4 right-4 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                    copied ? "bg-green-500 text-white" : "bg-primary text-white hover:scale-105 active:scale-95"
                                )}
                            >
                                {copied ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                                {copied ? (lang === 'zh' ? '已复制' : 'Copied') : (lang === 'zh' ? '复制代码' : 'Copy Code')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
