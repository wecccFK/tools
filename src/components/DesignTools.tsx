import React, { useState, useEffect } from 'react';
import { Palette, RefreshCw, Copy, Check, Type, Layers } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

// --- Color Converter ---
export const ColorConverter = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [hex, setHex] = useState('#6366f1');
    const [rgb, setRgb] = useState('100, 102, 241');
    const [hsl, setHsl] = useState('239, 84%, 67%');

    const faqs = [
        {
            question: {
                en: 'What color formats are supported?',
                zh: '支持哪些颜色格式？'
            },
            answer: {
                en: 'We support HEX, RGB, and HSL color formats. All conversions are bidirectional and update in real-time.',
                zh: '我们支持 HEX、RGB 和 HSL 颜色格式。所有转换都是双向的，并且实时更新。'
            }
        },
        {
            question: {
                en: 'Can I pick colors visually?',
                zh: '可以直观地选择颜色吗？'
            },
            answer: {
                en: 'Yes, click on the color preview to open the system color picker and select any color visually.',
                zh: '是的，点击颜色预览可以打开系统取色器，直观地选择任何颜色。'
            }
        },
        {
            question: {
                en: 'How do I copy the color values?',
                zh: '如何复制颜色值？'
            },
            answer: {
                en: 'Click the copy button next to any format to copy it to your clipboard. Perfect for use in CSS or design tools.',
                zh: '点击任何格式旁边的复制按钮将其复制到剪贴板。非常适合在 CSS 或设计工具中使用。'
            }
        }
    ];

    const handleHex = (val: string) => {
        setHex(val);
        if (/^#?[0-9A-Fa-f]{6}$/.test(val)) {
            const h = val.replace('#', '');
            const r = parseInt(h.substring(0, 2), 16);
            const g = parseInt(h.substring(2, 4), 16);
            const b = parseInt(h.substring(4, 6), 16);
            setRgb(`${r}, ${g}, ${b}`);
            // Simple HSL conversion
            const r1 = r / 255, g1 = g / 255, b1 = b / 255;
            const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
            let h_val = 0, s_val = 0, l_val = (max + min) / 2;
            if (max !== min) {
                const d = max - min;
                s_val = l_val > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r1: h_val = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
                    case g1: h_val = (b1 - r1) / d + 2; break;
                    case b1: h_val = (r1 - g1) / d + 4; break;
                }
                h_val /= 6;
            }
            setHsl(`${Math.round(h_val*360)}, ${Math.round(s_val*100)}%, ${Math.round(l_val*100)}%`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '颜色转换器支持 HEX、RGB 和 HSL 三种颜色格式之间的相互转换。输入任意一种格式的颜色值，自动转换为其他格式。适用于网页设计、UI 开发、图形设计等场景。支持颜色选择器直观选择颜色，一键复制转换结果。'
                        : 'The color converter supports conversion between HEX, RGB, and HSL color formats. Enter any color format and automatically convert to other formats. Suitable for web design, UI development, graphic design, and other scenarios. Supports color picker for intuitive color selection with one-click copy of conversion results.'}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <input type="color" value={hex} onChange={e => handleHex(e.target.value)} className="w-32 h-32 p-0 border-0 rounded-full cursor-pointer overflow-hidden shadow-xl" />
                <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-site/40 uppercase">HEX</label>
                        <input type="text" value={hex} onChange={e => handleHex(e.target.value)} className="w-full p-3 bg-card-bg border border-border-site rounded-xl font-mono text-text-site" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-site/40 uppercase">RGB</label>
                        <input type="text" value={rgb} readOnly className="w-full p-3 bg-secondary-site border border-border-site rounded-xl font-mono text-text-site" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-site/40 uppercase">HSL</label>
                        <input type="text" value={hsl} readOnly className="w-full p-3 bg-secondary-site border border-border-site rounded-xl font-mono text-text-site" />
                    </div>
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Gradient Generator ---
export const GradientGenerator = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [c1, setC1] = useState('#6366f1');
    const [c2, setC2] = useState('#ec4899');
    const [angle, setAngle] = useState(135);
    const [copied, setCopied] = useState(false);

    const grad = `linear-gradient(${angle}deg, ${c1}, ${c2})`;

    const faqs = [
        {
            question: {
                en: 'What gradient types are supported?',
                zh: '支持哪些渐变类型？'
            },
            answer: {
                en: 'We support linear gradients with customizable colors and angle. Perfect for modern web design backgrounds.',
                zh: '我们支持可自定义颜色和角度的线性渐变。非常适合现代网页设计背景。'
            }
        },
        {
            question: {
                en: 'How do I use the generated CSS?',
                zh: '如何使用生成的 CSS？'
            },
            answer: {
                en: 'Copy the CSS code and paste it into your stylesheet. You can use it for backgrounds, buttons, or any element that supports CSS gradients.',
                zh: '复制 CSS 代码并粘贴到您的样式表中。您可以将其用于背景、按钮或任何支持 CSS 渐变的元素。'
            }
        },
        {
            question: {
                en: 'Can I randomize colors?',
                zh: '可以随机颜色吗？'
            },
            answer: {
                en: 'Yes, click the random button to generate two random colors. Great for discovering new color combinations.',
                zh: '是的，点击随机按钮生成两个随机颜色。非常适合发现新的颜色组合。'
            }
        }
    ];

    const random = () => {
        const rc = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        setC1(rc());
        setC2(rc());
        setAngle(Math.floor(Math.random() * 360));
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '渐变生成器可以创建线性渐变效果，支持自定义两个颜色和渐变角度。实时预览渐变效果，生成对应的 CSS 代码。适用于网页背景、按钮样式、卡片装饰等现代 UI 设计。支持随机颜色生成，发现新的颜色组合。'
                        : 'The gradient generator can create linear gradient effects with customizable two colors and gradient angle. Preview the gradient effect in real-time and generate the corresponding CSS code. Suitable for web backgrounds, button styles, card decorations, and other modern UI designs. Supports random color generation to discover new color combinations.'}
                </p>
            </div>

            <div className="h-64 rounded-3xl shadow-lg relative overflow-hidden group" style={{ background: grad }}>
                <button onClick={random} className="absolute bottom-4 right-4 p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 active:scale-95 transition-all">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase">Color 1</label>
                    <input type="color" value={c1} onChange={e => setC1(e.target.value)} className="w-full h-12 p-0 border-0 rounded-xl cursor-pointer" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase">Color 2</label>
                    <input type="color" value={c2} onChange={e => setC2(e.target.value)} className="w-full h-12 p-0 border-0 rounded-xl cursor-pointer" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase">Angle ({angle}°)</label>
                    <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full h-12 accent-primary" />
                </div>
            </div>

            <div className="p-6 bg-secondary-site rounded-2xl border border-border-site relative">
                <div className="text-[10px] font-bold text-text-site/40 uppercase mb-2">CSS Code</div>
                <code className="text-xs text-text-site font-mono block break-all">background: {grad};</code>
                <button 
                  onClick={() => { navigator.clipboard.writeText(`background: ${grad};`); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
                  className="absolute top-6 right-6 p-2 bg-card-bg border border-border-site rounded-lg text-primary"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Font Preview ---
export const FontPreview = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [text, setText] = useState(isZh ? '君不见黄河之水天上来，奔流到海不复回。' : 'All that is gold does not glitter, not all those who wander are lost.');
    const [size, setSize] = useState(32);

    const faqs = [
        {
            question: {
                en: 'What fonts can I preview?',
                zh: '可以预览哪些字体？'
            },
            answer: {
                en: 'We preview system fonts including sans-serif, serif, monospace, and cursive. These are the fonts available on your device.',
                zh: '我们预览系统字体，包括无衬线、衬线、等宽和草书字体。这些是您设备上可用的字体。'
            }
        },
        {
            question: {
                en: 'Can I adjust the font size?',
                zh: '可以调整字体大小吗？'
            },
            answer: {
                en: 'Yes, use the slider to adjust font size from 12px to 72px. The preview updates in real-time.',
                zh: '是的，使用滑块调整字体大小从 12px 到 72px。预览会实时更新。'
            }
        },
        {
            question: {
                en: 'Is this useful for design work?',
                zh: '这对设计工作有用吗？'
            },
            answer: {
                en: 'Yes, this helps you test how text looks in different fonts and sizes before implementing in your design or website.',
                zh: '是的，这有助于您在实施到设计或网站之前测试文本在不同字体和大小下的外观。'
            }
        }
    ];
    const fonts = ['Serif', 'Sans-Serif', 'Monospace', 'Cursive', 'Fantasy'];

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '字体预览工具可以实时预览不同字体的显示效果。支持五种常见字体：衬线体、无衬线体、等宽字体、手写体和艺术字体。可以调整字体大小，输入任意文字进行预览。适用于网页设计、排版选择、字体对比等场景。'
                        : 'The font preview tool can real-time preview the display effect of different fonts. Supports five common fonts: Serif, Sans-Serif, Monospace, Cursive, and Fantasy. You can adjust font size and enter any text for preview. Suitable for web design, typography selection, font comparison, and other scenarios.'}
                </p>
            </div>

            <div className="space-y-4">
                <textarea 
                    value={text} onChange={e => setText(e.target.value)}
                    className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site outline-none h-24"
                    placeholder="Enter text to preview..."
                />
                <div className="flex items-center gap-4">
                   <span className="text-xs font-bold text-text-site/40 whitespace-nowrap">Size: {size}px</span>
                   <input type="range" min="12" max="100" value={size} onChange={e => setSize(Number(e.target.value))} className="flex-1 accent-primary" />
                </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border-site">
                {fonts.map(f => (
                    <div key={f} className="space-y-2">
                        <div className="text-[10px] font-bold text-text-site/40 uppercase tracking-widest">{f}</div>
                        <div 
                          className="p-6 bg-secondary-site rounded-2xl border border-border-site text-text-site leading-relaxed break-all"
                          style={{ fontFamily: f.toLowerCase(), fontSize: `${size}px` }}
                        >
                            {text}
                        </div>
                    </div>
                ))}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
