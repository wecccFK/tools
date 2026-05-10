'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, AlertCircle, FileImage, CheckCircle, RefreshCw, Type, Camera, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import html2canvas from 'html2canvas';
import { FAQ } from './FAQ';

// --- Image Compression ---
export const ImageCompression: React.FC = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    
    const [imageCompression, setImageCompression] = useState<any>(null);

    const faqs = [
        {
            question: { en: 'How does image compression work?', zh: '图片压缩是如何工作的？' },
            answer: { en: 'We use smart algorithms to reduce file size while maintaining visual quality.', zh: '我们使用智能算法在保持视觉质量的同时减小文件大小。' }
        },
        {
            question: { en: 'Will compression affect image quality?', zh: '压缩会影响图片质量吗？' },
            answer: { en: 'Higher compression reduces file size more but may affect quality. We recommend 0.7-0.8.', zh: '更高的压缩会更多地减小文件大小，但可能会影响质量。我们建议 0.7-0.8。' }
        },
        {
            question: { en: 'Is my image data private?', zh: '我的图片数据是否私密？' },
            answer: { en: 'Yes, all compression happens locally in your browser.', zh: '是的，所有压缩完全在您的浏览器中进行。' }
        }
    ];
    
    useEffect(() => {
        let mounted = true;
        const loadImageCompression = async () => {
            try {
                const module = await import('browser-image-compression');
                if (mounted) setImageCompression(() => module.imageCompression);
            } catch (error) {
                console.error('Failed to load browser-image-compression:', error);
            }
        };
        loadImageCompression();
        return () => { mounted = false; };
    }, []);
    
    const [file, setFile] = useState<File | null>(null);
    const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
    const [compressing, setCompressing] = useState(false);
    const [stats, setStats] = useState({ oldSize: 0, newSize: 0 });

    const handleCompress = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (!imageCompression) {
            alert(isZh ? '图片压缩库正在加载中，请稍后...' : 'Image compression library is loading, please wait...');
            return;
        }
        setFile(selected);
        setCompressing(true);
        setCompressedUrl(null);
        try {
            const compressedFile = await imageCompression()(selected, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
            setStats({ oldSize: selected.size, newSize: compressedFile.size });
            setCompressedUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error(error);
        } finally {
            setCompressing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh ? '图片压缩工具使用智能算法在保持视觉质量的同时减小文件大小。所有压缩都在浏览器本地完成，保护您的图片隐私。' : 'The image compression tool uses smart algorithms to reduce file size while maintaining visual quality. All compression is done locally in your browser.'}
                </p>
            </div>
            <div className="border-2 border-dashed border-border-site rounded-3xl p-12 text-center bg-secondary-site/30 relative">
                <input type="file" accept="image/*" onChange={handleCompress} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="space-y-2">
                    <FileImage className="w-12 h-12 text-primary mx-auto opacity-50" />
                    <p className="font-bold text-text-site">{isZh ? '点击上传要压缩的图片' : 'Click to compress image'}</p>
                    <p className="text-xs text-text-site/40">Powered by browser-image-compression</p>
                </div>
            </div>
            {compressing && (
                <div className="text-center p-8 bg-secondary-site rounded-3xl border border-border-site">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <span className="text-sm font-bold text-primary">{isZh ? '努力压缩中...' : 'Compressing...'}</span>
                </div>
            )}
            {compressedUrl && !compressing && (
                <div className="p-6 bg-green-500/5 rounded-3xl border border-green-500/20 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <div className="text-xs font-bold text-green-600 uppercase tracking-widest">{isZh ? '压缩成功' : 'Success'}</div>
                            <div className="text-sm font-mono text-green-700">
                                {(stats.oldSize / 1024 / 1024).toFixed(2)}MB → {(stats.newSize / 1024 / 1024).toFixed(2)}MB ({Math.round(((stats.oldSize - stats.newSize) / stats.oldSize) * 100)}% {isZh ? '缩减' : 'Saved'})
                            </div>
                        </div>
                        <a href={compressedUrl} download="compressed.jpg" className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/20">
                            <Download className="w-4 h-4" /> {isZh ? '下载压缩图' : 'Download'}
                        </a>
                    </div>
                </div>
            )}
            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Image Watermark ---
export const ImageWatermark = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('MOMO Toolbox');
    const [result, setResult] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const faqs = [
        { question: { en: 'What text can I use for watermark?', zh: '可以使用什么文字作为水印？' }, answer: { en: 'You can use any text including your name, brand, or copyright notice.', zh: '您可以使用任何文字，包括您的姓名、品牌或版权声明。' } },
        { question: { en: 'Can I adjust the watermark position?', zh: '可以调整水印位置吗？' }, answer: { en: 'Currently, the watermark is automatically centered on the image.', zh: '目前，水印会自动居中显示在图片上。' } },
        { question: { en: 'Is my image data private?', zh: '我的图片数据是否私密？' }, answer: { en: 'Yes, all watermark processing happens locally in your browser.', zh: '是的，所有水印处理完全在您的浏览器中进行。' } }
    ];

    const applyWatermark = (f: File) => {
        setFile(f);
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0);
            ctx.font = `${Math.round(img.width / 20)}px sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.textAlign = 'center';
            ctx.fillText(text, img.width / 2, img.height / 2);
            setResult(canvas.toDataURL('image/jpeg'));
        };
        img.src = URL.createObjectURL(f);
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh ? '图片水印工具可以为您的图片添加文字水印，支持自定义水印文字。所有处理都在浏览器本地完成。' : 'The image watermark tool can add text watermarks to your images with customizable watermark text. All processing is done locally.'}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '水印文字' : 'Watermark Text'}</label>
                    <input type="text" value={text} onChange={e => { setText(e.target.value); if(file) applyWatermark(file); }} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-text-site/40 uppercase tracking-widest">{isZh ? '上传图片' : 'Upload Image'}</label>
                   <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && applyWatermark(e.target.files[0])} className="w-full p-3 bg-secondary-site border border-border-site rounded-2xl text-xs" />
                </div>
            </div>
            <div className="hidden"><canvas ref={canvasRef} /></div>
            {result && (
                <div className="space-y-4">
                    <div className="bg-secondary-site rounded-3xl border border-border-site p-4 flex items-center justify-center min-h-[300px]">
                        <img src={result} alt="Watermarked" className="max-w-full rounded-xl shadow-lg" />
                    </div>
                    <a href={result} download="watermarked.jpg" className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" /> {isZh ? '下载带水印图片' : 'Download Result'}
                    </a>
                </div>
            )}
            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Screenshot Helper (Captures current element) ---
export const UIExporter = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const targetRef = useRef<HTMLDivElement>(null);
    const [capturing, setCapturing] = useState(false);

    const [title, setTitle] = useState('MOMO TOOLBOX');
    const [subtitle, setSubtitle] = useState('Web Developer Tools');
    const [url, setUrl] = useState('www.web-tools.top');
    const [iconText, setIconText] = useState('M');
    const [bgStyle, setBgStyle] = useState('white');

    type GradientDef = { bg: string; textColor: string; subColor: string; iconBg: string; iconColor: string; borderColor: string };
    const gradients: Record<string, GradientDef> = {
        white:   { bg: '#ffffff', textColor: '#000000', subColor: 'rgba(0,0,0,0.4)', iconBg: 'rgba(59,130,246,0.15)', iconColor: '#3b82f6', borderColor: 'rgba(0,0,0,0.05)' },
        dark:    { bg: '#0f172a', textColor: '#ffffff', subColor: 'rgba(255,255,255,0.4)', iconBg: 'rgba(59,130,246,0.3)', iconColor: '#60a5fa', borderColor: 'rgba(255,255,255,0.1)' },
        ocean:   { bg: 'linear-gradient(135deg, #22d3ee, #2563eb)', textColor: '#ffffff', subColor: 'rgba(255,255,255,0.6)', iconBg: 'rgba(255,255,255,0.2)', iconColor: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' },
        sunset:  { bg: 'linear-gradient(135deg, #fb923c, #db2777)', textColor: '#ffffff', subColor: 'rgba(255,255,255,0.6)', iconBg: 'rgba(255,255,255,0.2)', iconColor: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' },
        forest:  { bg: 'linear-gradient(135deg, #34d399, #0d9488)', textColor: '#ffffff', subColor: 'rgba(255,255,255,0.6)', iconBg: 'rgba(255,255,255,0.2)', iconColor: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' },
        purple:  { bg: 'linear-gradient(135deg, #c084fc, #4338ca)', textColor: '#ffffff', subColor: 'rgba(255,255,255,0.6)', iconBg: 'rgba(255,255,255,0.2)', iconColor: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' },
        midnight:{ bg: 'linear-gradient(135deg, #111827, #581c87, #111827)', textColor: '#ffffff', subColor: 'rgba(255,255,255,0.4)', iconBg: 'rgba(139,92,246,0.3)', iconColor: '#c4b5fd', borderColor: 'rgba(255,255,255,0.1)' },
    };

    const faqs = [
        { question: { en: 'What can I capture?', zh: '可以截取什么？' }, answer: { en: 'Customize the card and export as PNG.', zh: '自定义卡片后导出为PNG图片。' } },
        { question: { en: 'Is it local?', zh: '是否本地处理？' }, answer: { en: 'Yes, all done in browser.', zh: '是的，全部在浏览器本地完成。' } },
    ];

    const g: GradientDef = gradients[bgStyle] || gradients.white;

    const capture = async () => {
        if (!targetRef.current) return;
        setCapturing(true);
        try {
            const canvas = await html2canvas(targetRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: null,
                logging: false,
            });
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${title.replace(/\s+/g, '-').toLowerCase() || 'snapshot'}.png`;
            link.click();
        } catch (e) {
            console.error(e);
        } finally {
            setCapturing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6 space-y-4">
               <h3 className="text-primary font-bold text-lg flex items-center gap-2">
                   <Camera className="w-5 h-5" /> {isZh ? '网页元素截图 / 分享卡片生成' : 'UI Snapshot / Card Generator'}
               </h3>
               <p className="text-sm text-text-site/60 leading-relaxed">
                   {isZh ? '自定义标题、副标题、网址和背景风格，实时预览后一键导出为高质量PNG图片。' : 'Customize title, subtitle, URL and background. Preview in real-time and export as high-quality PNG.'}
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1">
                       <label className="text-[10px] uppercase font-bold text-text-site/40 tracking-widest">{isZh ? '主标题' : 'Title'}</label>
                       <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-card-bg border border-border-site rounded-xl text-sm text-text-site outline-none focus:ring-1 focus:ring-primary" />
                   </div>
                   <div className="space-y-1">
                       <label className="text-[10px] uppercase font-bold text-text-site/40 tracking-widest">{isZh ? '副标题' : 'Subtitle'}</label>
                       <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full p-3 bg-card-bg border border-border-site rounded-xl text-sm text-text-site outline-none focus:ring-1 focus:ring-primary" />
                   </div>
                   <div className="space-y-1">
                       <label className="text-[10px] uppercase font-bold text-text-site/40 tracking-widest">{isZh ? '网址' : 'Website URL'}</label>
                       <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full p-3 bg-card-bg border border-border-site rounded-xl text-sm text-text-site outline-none focus:ring-1 focus:ring-primary" placeholder="www.example.com" />
                   </div>
                   <div className="space-y-1">
                       <label className="text-[10px] uppercase font-bold text-text-site/40 tracking-widest">{isZh ? '图标文字' : 'Icon Text'}</label>
                       <input type="text" value={iconText} onChange={e => setIconText(e.target.value)} maxLength={2} className="w-full p-3 bg-card-bg border border-border-site rounded-xl text-sm text-text-site outline-none focus:ring-1 focus:ring-primary" />
                   </div>
               </div>

               <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-text-site/40 tracking-widest">{isZh ? '背景风格' : 'Background Style'}</label>
                   <div className="flex gap-2 flex-wrap">
                       {Object.keys(gradients).map(key => (
                           <button key={key} onClick={() => setBgStyle(key)}
                               className={`w-8 h-8 rounded-full border-2 transition-all ${bgStyle === key ? 'border-primary scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                               style={{ background: gradients[key].bg }}
                               title={key}
                           />
                       ))}
                   </div>
               </div>

               <button onClick={capture} disabled={capturing}
                   className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
               >
                   {capturing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                   {isZh ? '导出 PNG 图片' : 'Export as PNG'}
               </button>
            </div>

            {/* Live Preview Card — inline styles for html2canvas */}
            <div ref={targetRef} style={{
                background: g.bg,
                padding: '48px',
                borderRadius: '40px',
                border: `1px solid ${g.borderColor}`,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                textAlign: 'center' as const,
                position: 'relative' as const,
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                width: '100%',
                boxSizing: 'border-box' as const,
            }}>
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: 128, height: 128,
                    background: 'rgba(255,255,255,0.1)', borderRadius: '0 0 0 100%',
                    transform: 'translate(32px, -32px)',
                }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                    <div style={{
                        width: 80, height: 80, background: g.iconBg, borderRadius: 24,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, fontWeight: 900, color: g.iconColor,
                    }}>
                        {iconText || 'M'}
                    </div>
                    <div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: g.textColor, lineHeight: 1.2 }}>
                            {title || 'MOMO TOOLBOX'}
                        </div>
                        <div style={{ fontSize: 14, fontFamily: 'monospace', color: g.subColor, letterSpacing: '0.2em', marginTop: 8 }}>
                            {subtitle || 'Web Developer Tools'}
                        </div>
                        {url && <div style={{ fontSize: 12, fontFamily: 'monospace', color: g.subColor, letterSpacing: '0.15em', marginTop: 4 }}>{url}</div>}
                    </div>
                    <div style={{
                        paddingTop: 32, marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', justifyContent: 'center', gap: 32,
                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: g.subColor,
                    }}>
                        <span>{isZh ? '本地执行' : 'Local Execution'}</span>
                        <span>{isZh ? '隐私保护' : 'Privacy Protected'}</span>
                        <span>{isZh ? '免费开源' : 'Free & Open'}</span>
                    </div>
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
