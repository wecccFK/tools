import React, { useState, useRef } from 'react';
import { Upload, Scissors, Download, RefreshCw, Grid3X3, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import JSZip from 'jszip';
import { FAQ } from './FAQ';

type SplitMode = {
    rows: number;
    cols: number;
    label: string;
};

const splitModes: SplitMode[] = [
    { rows: 2, cols: 2, label: '4 (2x2)' },
    { rows: 3, cols: 2, label: '6 (3x2)' },
    { rows: 2, cols: 3, label: '6 (2x3)' },
    { rows: 3, cols: 3, label: '9 (3x3)' },
];

export const ImageSplitter: React.FC = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';

    const faqs = [
        {
            question: {
                en: 'What split modes are available?',
                zh: '支持哪些分割模式？'
            },
            answer: {
                en: 'We support 2x2 (4-grid), 3x3 (9-grid), and 4x4 (16-grid) splits. Perfect for social media posts and stories.',
                zh: '我们支持 2x2（4宫格）、3x3（9宫格）和 4x4（16宫格）分割。非常适合社交媒体帖子和故事。'
            }
        },
        {
            question: {
                en: 'Can I download all split images at once?',
                zh: '可以一次性下载所有分割图片吗？'
            },
            answer: {
                en: 'Yes, we provide a ZIP download option that contains all split images. You can also download individual images if needed.',
                zh: '是的，我们提供 ZIP 下载选项，包含所有分割图片。如果需要，您也可以单独下载每张图片。'
            }
        },
        {
            question: {
                en: 'Is my image data private?',
                zh: '我的图片数据是否私密？'
            },
            answer: {
                en: 'Yes, all processing happens locally in your browser. Your images are never uploaded to any server.',
                zh: '是的，所有处理完全在您的浏览器中进行。您的图片永远不会上传到任何服务器。'
            }
        }
    ];

    const [image, setImage] = useState<string | null>(null);
    const [mode, setMode] = useState<SplitMode>(splitModes[3]); // Default 9-grid
    const [previewParts, setPreviewParts] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setPreviewParts([]); // Reset preview
            };
            reader.readAsDataURL(file);
        }
    };

    const processSplit = async () => {
        if (!image) return;
        setIsProcessing(true);
        
        const img = new Image();
        img.src = image;
        await new Promise((resolve) => (img.onload = resolve));

        const { rows, cols } = mode;
        const partWidth = img.width / cols;
        const partHeight = img.height / rows;
        
        const parts: string[] = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                canvas.width = partWidth;
                canvas.height = partHeight;
                ctx.drawImage(
                    img, 
                    c * partWidth, r * partHeight, partWidth, partHeight, // source
                    0, 0, partWidth, partHeight // destination
                );
                parts.push(canvas.toDataURL('image/png'));
            }
        }
        
        setPreviewParts(parts);
        setIsProcessing(false);
    };

    const downloadAll = async () => {
        if (previewParts.length === 0) return;
        
        const zip = new JSZip();
        previewParts.forEach((part, index) => {
            const base64Data = part.split(',')[1];
            zip.file(`image_part_${index + 1}.png`, base64Data, { base64: true });
        });
        
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `momo_split_images_${mode.rows}x${mode.cols}.zip`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {lang === 'zh'
                        ? '图片切割工具可以将一张图片按照指定的行列数分割成多个小图，非常适合制作朋友圈九宫格、Instagram 拼图等社交媒体内容。支持多种预设分割模式，如 2x2、3x3、4x4 等，也可以自定义行列数。所有切割都在浏览器本地完成，保护您的图片隐私。切割完成后可以一键下载所有小图为 ZIP 压缩包。'
                        : 'The image splitter tool can split a single image into multiple small images according to specified rows and columns, perfect for creating 9-grid layouts for social media like WeChat Moments and Instagram. Supports various preset split modes like 2x2, 3x3, 4x4, and also allows custom row and column settings. All splitting is done locally in your browser, protecting your image privacy. After splitting, you can download all small images as a ZIP file with one click.'}
                </p>
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-text-site flex items-center justify-center gap-2">
                    <Grid3X3 className="text-primary" />
                    {lang === 'zh' ? '图片切割' : 'Image Splitter'}
                </h2>
                <p className="text-text-site/60">
                    {lang === 'zh' ? '一键通过行列分割图片，完美契合朋友圈、Instagram 布局。' : 'Split images into grids for Social Media Moments/Instagram.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card-bg p-6 rounded-2xl border border-border-site shadow-sm space-y-6">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-border-site rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden"
                        >
                            {image ? (
                                <img src={image} alt="Upload" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload className="w-10 h-10 text-text-site/30 group-hover:text-primary transition-colors mb-2" />
                                    <span className="text-sm font-medium text-text-site/50 group-hover:text-primary transition-colors">
                                        {lang === 'zh' ? '点击上传源图' : 'Upload Image'}
                                    </span>
                                </>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-text-site/40 uppercase tracking-widest px-1">
                                {lang === 'zh' ? '选择分割方式' : 'Split Mode'}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {splitModes.map((m) => (
                                    <button
                                        key={m.label}
                                        onClick={() => setMode(m)}
                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                                            mode.label === m.label 
                                            ? 'border-primary bg-primary/5 text-primary' 
                                            : 'border-border-site hover:border-text-site/20 text-text-site/60'
                                        }`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={processSplit}
                            disabled={!image || isProcessing}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                            {lang === 'zh' ? '开始切割' : 'Start Splitting'}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="md:col-span-2 space-y-4">
                    {previewParts.length > 0 ? (
                        <div className="space-y-6">
                            <div 
                                className="grid gap-1 bg-secondary-site p-2 rounded-2xl border border-border-site shadow-inner mx-auto max-w-lg"
                                style={{ 
                                    gridTemplateColumns: `repeat(${mode.cols}, 1fr)`,
                                    aspectRatio: '1/1'
                                }}
                            >
                                {previewParts.map((part, i) => (
                                    <div key={i} className="bg-card-bg overflow-hidden border border-border-site/50 animate-in fade-in zoom-in duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                                        <img src={part} alt={`Part ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={downloadAll}
                                className="w-full py-4 bg-secondary-site text-text-site rounded-xl font-bold border-2 border-border-site flex items-center justify-center gap-2 hover:bg-card-bg transition-colors shadow-sm"
                            >
                                <Download className="w-5 h-5" />
                                {lang === 'zh' ? '打包下载全部' : 'Download All as ZIP'}
                            </button>
                            <p className="text-center text-xs text-text-site/40">
                                {lang === 'zh' ? '小提示：移动端用户若打包下载失败，可以长按单个切图手动保存。' : 'Pro tip: Mobile users can long-press previews to save individual images.'}
                            </p>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-secondary-site/50 rounded-3xl border-2 border-dashed border-border-site text-text-site/30">
                            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-sm font-medium">
                                {lang === 'zh' ? '切割预览将显示在这里' : 'Preview will appear here'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
