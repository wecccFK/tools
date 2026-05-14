import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const UnitConverter = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [value, setValue] = useState<number>(1);
    const [from, setFrom] = useState('meters');
    const [to, setTo] = useState('feet');

    const faqs = [
        {
            question: {
                en: 'What units are supported?',
                zh: '支持哪些单位？'
            },
            answer: {
                en: 'We support common length units including meters, feet, inches, centimeters, kilometers, and miles. Perfect for international measurements.',
                zh: '我们支持常见的长度单位，包括米、英尺、英寸、厘米、千米和英里。非常适合国际测量。'
            }
        },
        {
            question: {
                en: 'How accurate is the conversion?',
                zh: '转换有多准确？'
            },
            answer: {
                en: 'We use standard conversion factors with 4 decimal precision. Results are suitable for most practical applications including construction and travel planning.',
                zh: '我们使用标准转换系数，精度为 4 位小数。结果适用于大多数实际应用，包括建筑和旅行规划。'
            }
        },
        {
            question: {
                en: 'Can I convert in both directions?',
                zh: '可以双向转换吗？'
            },
            answer: {
                en: 'Yes, simply swap the from/to units to convert in the opposite direction. The conversion is bidirectional and instant.',
                zh: '可以，只需交换从/到单位即可反向转换。转换是双向的且即时完成。'
            }
        }
    ];

    const units: Record<string, number> = {
        meters: 1,
        feet: 3.28084,
        inches: 39.3701,
        centimeters: 100,
        kilometers: 0.001,
        miles: 0.000621371
    };

    const convert = () => {
        const inMeters = value / units[from];
        return (inMeters * units[to]).toFixed(4);
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '单位转换器支持常见长度单位之间的转换，包括米、英尺、英寸、厘米、千米和英里。使用标准转换系数，精度为 4 位小数。适用于国际测量、建筑规划、旅行计算等场景。可以双向转换，只需交换单位即可。'
                        : 'The unit converter supports conversion between common length units including meters, feet, inches, centimeters, kilometers, and miles. Uses standard conversion factors with 4 decimal precision. Suitable for international measurements, construction planning, travel calculations, and other scenarios. Supports bidirectional conversion by simply swapping units.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase text-text-site/50 font-medium">{lang === 'zh' ? '数量' : 'Amount'}</label>
                    <input 
                        type="number" 
                        value={value} 
                        onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                        className="w-full p-3 bg-card-bg border border-border-site rounded-lg outline-none focus:ring-1 focus:ring-primary text-text-site"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-text-site/50 font-medium">{lang === 'zh' ? '来源 (From)' : 'From'}</label>
                    <select 
                        value={from} 
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full p-3 bg-card-bg border border-border-site rounded-lg outline-none text-text-site"
                    >
                        {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-text-site/50 font-medium">{lang === 'zh' ? '目标 (To)' : 'To'}</label>
                    <select 
                        value={to} 
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full p-3 bg-card-bg border border-border-site rounded-lg outline-none text-text-site"
                    >
                        {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            <div className="p-8 bg-secondary-site rounded-2xl text-center border border-border-site">
                <div className="text-sm text-text-site/50 mb-1">{lang === 'zh' ? '结果' : 'Result'}</div>
                <div className="text-4xl font-mono font-bold text-text-site">{convert()} <span className="text-lg font-sans font-medium text-text-site/40">{to}</span></div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

export const AspectRatio = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [w, setW] = useState(1920);
    const [h, setH] = useState(1080);
    const [ratioW, setRatioW] = useState(16);
    const [ratioH, setRatioH] = useState(9);

    const faqs = [
        {
            question: {
                en: 'What is aspect ratio?',
                zh: '什么是纵横比？'
            },
            answer: {
                en: 'Aspect ratio is the proportional relationship between width and height of an image or screen. Common ratios include 16:9 (widescreen), 4:3 (standard), and 1:1 (square).',
                zh: '纵横比是图像或屏幕宽度与高度之间的比例关系。常见比例包括 16:9（宽屏）、4:3（标准）和 1:1（正方形）。'
            }
        },
        {
            question: {
                en: 'How do I calculate dimensions?',
                zh: '如何计算尺寸？'
            },
            answer: {
                en: 'Enter your desired width or height, and we calculate the other dimension based on your selected aspect ratio. Perfect for resizing images while maintaining proportions.',
                zh: '输入您想要的宽度或高度，我们会根据您选择的纵横比计算另一个尺寸。非常适合在保持比例的同时调整图像大小。'
            }
        },
        {
            question: {
                en: 'What are common aspect ratios used for?',
                zh: '常见纵横比用于什么？'
            },
            answer: {
                en: '16:9 for HD videos and monitors, 4:3 for old TVs and presentations, 1:1 for social media posts, and 21:9 for ultrawide monitors.',
                zh: '16:9 用于高清视频和显示器，4:3 用于旧电视和演示文稿，1:1 用于社交媒体帖子，21:9 用于超宽显示器。'
            }
        }
    ];

    const calculateHeight = (newW: number) => {
        setW(newW);
        setH(Math.round((newW * ratioH) / ratioW));
    };

    const calculateWidth = (newH: number) => {
        setH(newH);
        setW(Math.round((newH * ratioW) / ratioH));
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '纵横比计算器可以根据选定的纵横比计算图像或视频的尺寸。输入宽度或高度，自动计算另一个尺寸以保持比例。常见比例包括 16:9（宽屏）、4:3（标准）、1:1（正方形）。适用于图像调整、视频制作、设计规划等场景。'
                        : 'The aspect ratio calculator can calculate image or video dimensions based on selected aspect ratio. Enter width or height, and automatically calculate the other dimension to maintain proportions. Common ratios include 16:9 (widescreen), 4:3 (standard), 1:1 (square). Suitable for image resizing, video production, design planning, and other scenarios.'}
                </p>
            </div>

            <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase text-text-site/50 font-medium">{lang === 'zh' ? '宽比' : 'Ratio Width'}</label>
                    <input 
                        type="number" value={ratioW} onChange={(e) => setRatioW(parseInt(e.target.value))}
                        className="w-full p-3 bg-card-bg border border-border-site rounded-lg text-text-site focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-text-site/50 font-medium">{lang === 'zh' ? '高比' : 'Ratio Height'}</label>
                    <input 
                        type="number" value={ratioH} onChange={(e) => setRatioH(parseInt(e.target.value))}
                        className="w-full p-3 bg-card-bg border border-border-site rounded-lg text-text-site focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
            <div className="h-40 bg-secondary-site rounded-xl flex items-center justify-center overflow-hidden border border-border-site">
                <div 
                    className="bg-primary text-white flex items-center justify-center transition-all duration-300"
                    style={{ aspectRatio: `${ratioW}/${ratioH}`, maxHeight: '80%' }}
                >
                    <span className="text-xs font-mono">{ratioW}:{ratioH}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase text-text-site/50 font-medium">{lang === 'zh' ? '自定义宽度' : 'Custom Width'}</label>
                    <input 
                        type="number" value={w} onChange={(e) => calculateHeight(parseInt(e.target.value))}
                        className="w-full p-3 bg-card-bg border border-border-site rounded-lg text-text-site focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-text-site/50 font-medium">{lang === 'zh' ? '自定义高度' : 'Custom Height'}</label>
                    <input 
                        type="number" value={h} onChange={(e) => calculateWidth(parseInt(e.target.value))}
                        className="w-full p-3 bg-card-bg border border-border-site rounded-lg text-text-site focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <FAQ faqs={faqs} />
            </div>
        </div>
    );
};
