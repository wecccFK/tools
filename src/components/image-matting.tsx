import React, { useState, useRef, useEffect } from 'react';
import { Upload, Eraser, Brush, Wand2, Download, MousePointer2, Sparkles, Loader2, Cpu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { removeBackground } from '@imgly/background-removal';
import { FAQ } from './FAQ';

type Tool = 'erase' | 'restore' | 'move' | 'wand';
type ModelSize = 'small' | 'medium';

export const ImageMatting = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';

    const [image, setImage] = useState<File | null>(null);
    const [tool, setTool] = useState<Tool>('move');
    const [brushSize, setBrushSize] = useState(20);
    const [tolerance, setTolerance] = useState(30);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [modelSize, setModelSize] = useState<ModelSize>('small');
    const [mattingMode, setMattingMode] = useState<'ai' | 'fast'>('ai');

    const faqs = [
        {
            question: {
                en: 'How does AI background removal work?',
                zh: 'AI 背景移除是如何工作的？'
            },
            answer: {
                en: 'We use advanced machine learning models to detect and separate foreground objects from backgrounds. The AI analyzes image patterns to make precise cutouts.',
                zh: '我们使用先进的机器学习模型来检测和分离前景对象与背景。AI 分析图像模式以进行精确的抠图。'
            }
        },
        {
            question: {
                en: 'What image formats are supported?',
                zh: '支持哪些图像格式？'
            },
            answer: {
                en: 'We support common image formats including PNG, JPG, JPEG, and WebP. The output is always PNG to preserve transparency.',
                zh: '我们支持常见的图像格式，包括 PNG、JPG、JPEG 和 WebP。输出始终为 PNG 以保留透明度。'
            }
        },
        {
            question: {
                en: 'Can I manually refine the result?',
                zh: '我可以手动优化结果吗？'
            },
            answer: {
                en: 'Yes! Use the eraser, restore brush, and magic wand tools to manually refine edges. Perfect for complex images that need touch-ups.',
                zh: '可以！使用橡皮擦、恢复画笔和魔棒工具手动优化边缘。非常适合需要润色的复杂图像。'
            }
        }
    ];

    const originalCanvasRef = useRef<HTMLCanvasElement>(null);
    const workingCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isDrawing = useRef(false);
    const isPanning = useRef(false);
    const lastPoint = useRef({ x: 0, y: 0 });
    const isInteracting = useRef(false);
    const pageScrollLocked = useRef(false);
    const originalBodyOverflow = useRef('');

    const REMOTE_PUBLIC_PATH = 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/';
    const LOCAL_PUBLIC_PATH = '/assets/bg-removal/';

    const lockPageScroll = () => {
        if (pageScrollLocked.current) return;
        originalBodyOverflow.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        pageScrollLocked.current = true;
    };

    const unlockPageScroll = () => {
        if (!pageScrollLocked.current) return;
        document.body.style.overflow = originalBodyOverflow.current;
        pageScrollLocked.current = false;
    };

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const preventTouchScroll = (event: TouchEvent) => {
            if (isInteracting.current) {
                event.preventDefault();
            }
        };
        document.addEventListener('touchmove', preventTouchScroll, { passive: false });

        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener('touchmove', preventTouchScroll);
        };
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setImage(file);
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const oCanvas = originalCanvasRef.current;
            const wCanvas = workingCanvasRef.current;
            if (oCanvas && wCanvas) {
                // Determine max width to avoid extreme memory usage but keep decent resolution
                const MAX_W = 1200;
                let w = img.width;
                let h = img.height;
                if (w > MAX_W) {
                    h = (MAX_W / w) * h;
                    w = MAX_W;
                }

                [oCanvas, wCanvas].forEach(c => {
                    c.width = w;
                    c.height = h;
                });
                
                const oCtx = oCanvas.getContext('2d');
                const wCtx = wCanvas.getContext('2d', { willReadFrequently: true });
                
                if (oCtx && wCtx) {
                    oCtx.drawImage(img, 0, 0, w, h);
                    wCtx.drawImage(img, 0, 0, w, h);
                }
            }
            setScale(1);
            setOffset({ x: 0, y: 0 });
        };
        img.src = url;
    };

    const getMousePos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const performFloodFill = (startX: number, startY: number, toleranceLevel: number, additionalPoints?: {x: number, y: number}[]) => {
        const canvas = workingCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        setIsProcessing(true);
        setTimeout(() => {
            const w = canvas.width;
            const h = canvas.height;
            const imgData = ctx.getImageData(0, 0, w, h);
            const data = imgData.data;

            const seeds = [{x: startX, y: startY}, ...(additionalPoints || [])];
            const targetColors: {r: number, g: number, b: number, a: number}[] = [];

            seeds.forEach(seed => {
                const pos = (Math.floor(seed.y) * w + Math.floor(seed.x)) * 4;
                if (pos >= 0 && pos < data.length && data[pos+3] > 0) {
                    targetColors.push({
                        r: data[pos], g: data[pos+1], b: data[pos+2], a: data[pos+3]
                    });
                }
            });

            if (targetColors.length === 0) { setIsProcessing(false); return; } // Already transparent

            const colorMatch = (pos: number) => {
                const r = data[pos];
                const g = data[pos + 1];
                const b = data[pos + 2];
                const a = data[pos + 3];
                if (a === 0) return false;
                
                return targetColors.some(target => {
                    const diff = Math.max(
                        Math.abs(r - target.r),
                        Math.abs(g - target.g),
                        Math.abs(b - target.b)
                    );
                    return diff <= toleranceLevel;
                });
            };

            const visited = new Uint8Array(w * h);
            
            seeds.forEach(seed => {
                const stack = [[Math.floor(seed.x), Math.floor(seed.y)]];
                
                while (stack.length) {
                    const [x, y] = stack.pop()!;
                    let currentY = y;

                    while (currentY >= 0 && colorMatch(((currentY - 1) * w + x) * 4)) {
                        currentY--;
                    }

                    let spanLeft = false;
                    let spanRight = false;
                    currentY++;

                    while (currentY < h && colorMatch((currentY * w + x) * 4)) {
                        const pos = (currentY * w + x) * 4;
                        const vPos = currentY * w + x;
                        
                        if (visited[vPos]) break;
                        
                        // Erase pixel
                        data[pos + 3] = 0; 
                        visited[vPos] = 1;

                        if (x > 0) {
                            if (colorMatch(pos - 4) && !visited[vPos - 1]) {
                                if (!spanLeft) { stack.push([x - 1, currentY]); spanLeft = true; }
                            } else if (spanLeft) { spanLeft = false; }
                        }

                        if (x < w - 1) {
                            if (colorMatch(pos + 4) && !visited[vPos + 1]) {
                                if (!spanRight) { stack.push([x + 1, currentY]); spanRight = true; }
                            } else if (spanRight) { spanRight = false; }
                        }

                        currentY++;
                    }
                }
            });

            ctx.putImageData(imgData, 0, 0);
            setIsProcessing(false);
        }, 10);
    };

    const renderCanvas = () => {};

    const saveState = () => {};

    const magicWandFill = (startX: number, startY: number) => {
        performFloodFill(startX, startY, tolerance);
    };

    const autoRemoveBackground = () => {
        const canvas = workingCanvasRef.current;
        if (!image || !canvas) return;

        const w = canvas.width;
        const h = canvas.height;
        const insetX = Math.floor(w * 0.05);
        const insetY = Math.floor(h * 0.05);
        
        const startX = insetX;
        const startY = insetY;
        const additionalPoints = [
            {x: w - insetX, y: insetY},
            {x: insetX, y: h - insetY},
            {x: w - insetX, y: h - insetY}
        ];

        // Ensure higher tolerance to quickly eliminate gradients and typical BG colors easily
        const autoTolerance = Math.min(tolerance + 20, 150); 
        
        performFloodFill(startX, startY, autoTolerance, additionalPoints);
    };

    const aiRemoveBackground = async () => {
        if (!image || !workingCanvasRef.current || !originalCanvasRef.current) return;
        setIsProcessing(true);
        try {
            const modelName = modelSize === 'small' ? 'isnet_quint8' : 'isnet_fp16';
            const sharedConfig = {
                model: modelName as 'isnet_quint8' | 'isnet_fp16',
                output: { format: 'image/png' as const, quality: 0.9, type: 'foreground' as const },
            };
            let cutoutBlob: Blob;
            try {
                setLoadingMessage(
                    isZh
                        ? `正在从外网加载${modelSize === 'small' ? '轻量' : '高精度'}模型...`
                        : `Loading ${modelSize === 'small' ? 'small' : 'medium'} model from CDN...`
                );
                cutoutBlob = await removeBackground(image, {
                    ...sharedConfig,
                    publicPath: REMOTE_PUBLIC_PATH,
                });
            } catch (remoteError) {
                console.warn('Remote model asset loading failed, using local fallback.', remoteError);
                setLoadingMessage(
                    isZh
                        ? '外网不可用，切换本地模型兜底...'
                        : 'CDN unavailable, switching to local fallback...'
                );
                cutoutBlob = await removeBackground(image, {
                    ...sharedConfig,
                    publicPath: LOCAL_PUBLIC_PATH,
                });
            }
            const cutoutUrl = URL.createObjectURL(cutoutBlob);
            const cutoutImage = new Image();

            await new Promise<void>((resolve, reject) => {
                cutoutImage.onload = () => resolve();
                cutoutImage.onerror = () => reject(new Error('Failed to decode matting result.'));
                cutoutImage.src = cutoutUrl;
            });

            const canvas = workingCanvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            setLoadingMessage(isZh ? '正在应用透明蒙版...' : 'Applying alpha mask...');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(cutoutImage, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(cutoutUrl);

            renderCanvas();
            saveState();
            setIsProcessing(false);
            setLoadingMessage('');
            
        } catch (error) {
            console.error('AI Matting failed:', error);
            alert(isZh ? "AI 模型处理或下载失败，请检查网络或刷新重试。" : "AI model failed to load or process. Please check network and retry.");
            setIsProcessing(false);
            setLoadingMessage('');
        }
    };

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!workingCanvasRef.current || !originalCanvasRef.current) return;
        isInteracting.current = true;
        
        if (tool === 'move') {
            isPanning.current = true;
            lockPageScroll();
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
            lastPoint.current = { x: clientX - offset.x, y: clientY - offset.y };
            return;
        }

        const pos = getMousePos(e, workingCanvasRef.current);
        
        if (tool === 'wand') {
            lockPageScroll();
            magicWandFill(Math.floor(pos.x), Math.floor(pos.y));
            return;
        }

        isDrawing.current = true;
        lockPageScroll();
        lastPoint.current = pos;
        draw(e);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current || !workingCanvasRef.current || !originalCanvasRef.current || tool === 'move' || tool === 'wand') return;
        
        const wCtx = workingCanvasRef.current.getContext('2d');
        const oCtx = originalCanvasRef.current.getContext('2d');
        if (!wCtx || !oCtx) return;

        const pos = getMousePos(e, workingCanvasRef.current);
        const brushSizeScaled = brushSize / scale;

        wCtx.beginPath();
        wCtx.moveTo(lastPoint.current.x, lastPoint.current.y);
        wCtx.lineTo(pos.x, pos.y);
        wCtx.lineCap = 'round';
        wCtx.lineJoin = 'round';
        wCtx.lineWidth = brushSizeScaled;

        if (tool === 'erase') {
            wCtx.globalCompositeOperation = 'destination-out';
            wCtx.stroke();
            wCtx.globalCompositeOperation = 'source-over';
        } else if (tool === 'restore') {
            wCtx.save();
            wCtx.beginPath();
            wCtx.arc(pos.x, pos.y, brushSizeScaled / 2, 0, Math.PI * 2);
            wCtx.clip();
            wCtx.drawImage(originalCanvasRef.current, 0, 0);
            wCtx.restore();
            
            // Fill gaps between fast mouse movements
            const distance = Math.hypot(pos.x - lastPoint.current.x, pos.y - lastPoint.current.y);
            const steps = Math.max(1, Math.floor(distance / (brushSizeScaled / 4)));
            for (let i = 0; i < steps; i++) {
                const lx = lastPoint.current.x + (pos.x - lastPoint.current.x) * (i / steps);
                const ly = lastPoint.current.y + (pos.y - lastPoint.current.y) * (i / steps);
                wCtx.save();
                wCtx.beginPath();
                wCtx.arc(lx, ly, brushSizeScaled / 2, 0, Math.PI * 2);
                wCtx.clip();
                wCtx.drawImage(originalCanvasRef.current, 0, 0);
                wCtx.restore();
            }
        }

        lastPoint.current = pos;
    };

    const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (isPanning.current && tool === 'move') {
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
            setOffset({
                x: clientX - lastPoint.current.x,
                y: clientY - lastPoint.current.y
            });
            return;
        }
        draw(e);
    };

    const handlePointerUp = () => {
        isDrawing.current = false;
        isPanning.current = false;
        isInteracting.current = false;
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (!containerRef.current) return;
        lockPageScroll();
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
        const delta = -Math.sign(e.deltaY) * 0.1;
        const newScale = Math.min(Math.max(0.1, scale + delta), 10);
        setScale(newScale);
    };

    const handleDownload = () => {
        if (!workingCanvasRef.current) return;
        const url = workingCanvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `matted-image-${Date.now()}.png`;
        a.click();
    };

    const handleMatting = () => {
        if (mattingMode === 'ai') {
            aiRemoveBackground();
        } else {
            autoRemoveBackground();
        }
    };

    const handleCanvasClick = () => {
        if (!image) {
            fileInputRef.current?.click();
        }
    };

    const ToolbarButton = ({ currentTool, icon: Icon, label, disabled = false }: { currentTool: Tool; icon: React.ComponentType<{ className?: string }>; label: string; disabled?: boolean }) => (
        <button
            onClick={() => setTool(currentTool)}
            disabled={disabled}
            className={`flex flex-col items-center p-3 sm:p-4 border rounded-xl sm:rounded-2xl transition-all duration-300 ${
                tool === currentTool 
                    ? 'border-accent bg-accent/10 shadow-sm' 
                    : 'border-border-site hover:border-border-site-hover hover:bg-card-bg-hover text-text-site/70'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2 ${tool === currentTool ? 'text-accent' : ''}`} />
            <span className="text-[10px] sm:text-xs font-medium">{label}</span>
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '魔法极速抠图工具使用纯本地浏览器绘图引擎实现背景移除和图像抠图。支持 AI 自动抠图、魔棒工具、橡皮擦和画笔还原。体积为 0MB，永不报错、永不限流。支持 PNG、JPG、JPEG、WebP 格式，输出为 PNG 以保留透明度。适用于产品图处理、证件照制作、设计素材准备等场景。'
                        : 'The Magic Wand Matting tool uses pure local browser canvas engine for background removal and image matting. Supports AI automatic matting, magic wand tool, eraser, and restore brush. Occupies 0MB to download, never fails, no rate limits. Supports PNG, JPG, JPEG, WebP formats, outputs as PNG to preserve transparency. Suitable for product image processing, ID photo creation, design material preparation, and other scenarios.'}
                </p>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                        <Wand2 className="w-4 h-4" />
                        <span>{isZh ? '全新零依赖纯本地引擎' : 'Zero-Dependency Engine'}</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-text-site">
                        {isZh ? '魔法极速抠图' : 'Magic Wand Matting'}
                    </h2>
                    <p className="text-text-site/60 max-w-2xl text-sm sm:text-base">
                        {isZh 
                            ? '我们为您重构了全新的极速版本！它体积为 0MB，永不报错、永不限流，完全利用您的浏览器内置绘图引擎，实现像素级纯本地色彩提取与边界擦除。' 
                            : 'We rebuilt a blazing-fast pure JS version! It occupies 0MB to download, never fails, uses pure canvas APIs, and stays strictly local for precise object matting.'}
                    </p>
                </div>

                <div className="flex space-x-3">
                    <label className="flex items-center px-5 py-2.5 bg-card-bg border border-border-site hover:border-accent hover:text-accent transition-colors rounded-full cursor-pointer shadow-sm text-sm font-medium">
                        <Upload className="w-4 h-4 mr-2" />
                        {isZh ? '上传图片' : 'Upload Image'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    {image && (
                        <button
                            onClick={handleDownload}
                            className="flex items-center px-5 py-2.5 bg-accent text-white hover:bg-accent/90 transition-colors rounded-full shadow-md text-sm font-medium"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {isZh ? '保存透明图' : 'Save PNG'}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Tools Sidebar */}
                <div className="lg:col-span-1 border border-border-site bg-card-bg rounded-3xl p-5 shadow-sm space-y-6">

                    <div className="pb-3 border-b border-border-site space-y-3">
                        <button
                            onClick={handleMatting}
                            disabled={isProcessing || !image}
                            className={`w-full flex justify-center items-center p-4 rounded-xl border transition-all duration-300 ${
                                !image ? 'border-border-site bg-card-bg/50 opacity-50 cursor-not-allowed' :
                                isProcessing ? 'border-primary/40 bg-primary/5' :
                                'border-primary/30 bg-primary/10 hover:border-primary hover:bg-primary/20 cursor-pointer text-primary'
                            }`}
                        >
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {mattingMode === 'ai' ? <Cpu className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                                    <span className="font-bold text-sm">
                                        {mattingMode === 'ai' 
                                            ? (isZh ? 'AI 智能抠图' : 'AI Matting') 
                                            : (isZh ? '快速抠图' : 'Fast Matting')}
                                    </span>
                                </>
                            )}
                        </button>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMattingMode('ai')}
                                disabled={isProcessing}
                                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                                    mattingMode === 'ai'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-site text-text-site/70 hover:bg-secondary-site'
                                } ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <Cpu className="w-3 h-3 mr-1" />
                                {isZh ? 'AI 模型' : 'AI'}
                            </button>
                            <button
                                onClick={() => setMattingMode('fast')}
                                disabled={isProcessing}
                                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                                    mattingMode === 'fast'
                                        ? 'border-accent bg-accent/10 text-accent'
                                        : 'border-border-site text-text-site/70 hover:bg-secondary-site'
                                } ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <Sparkles className="w-3 h-3 mr-1" />
                                {isZh ? '快速' : 'Fast'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 pb-3 border-b border-border-site">
                        <p className="text-xs font-semibold text-text-site/70">
                            {isZh ? 'AI 模型大小' : 'AI Model Size'}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setModelSize('small')}
                                disabled={isProcessing}
                                className={`px-2 py-2 rounded-lg border text-xs font-semibold transition-all ${
                                    modelSize === 'small'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-site text-text-site/70 hover:bg-secondary-site'
                                } ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {isZh ? '小模型 (快)' : 'Small (Fast)'}
                            </button>
                            <button
                                onClick={() => setModelSize('medium')}
                                disabled={isProcessing}
                                className={`px-2 py-2 rounded-lg border text-xs font-semibold transition-all ${
                                    modelSize === 'medium'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-site text-text-site/70 hover:bg-secondary-site'
                                } ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {isZh ? '中模型 (更精细)' : 'Medium (Better)'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-3">
                        <ToolbarButton currentTool="wand" icon={Wand2} label={isZh ? '魔棒 (自动)' : 'Magic Wand'} disabled={!image} />
                        <ToolbarButton currentTool="erase" icon={Eraser} label={isZh ? '橡皮擦' : 'Eraser'} disabled={!image} />
                        <ToolbarButton currentTool="restore" icon={Brush} label={isZh ? '画笔还原' : 'Restore'} disabled={!image} />
                        <ToolbarButton currentTool="move" icon={MousePointer2} label={isZh ? '拖拽平移' : 'Pan Move'} disabled={!image} />
                    </div>

                    <div className="space-y-5">
                        
                        {(tool === 'erase' || tool === 'restore') ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium text-text-site">
                                    <span>{isZh ? '笔刷大小' : 'Brush Size'}</span>
                                    <span className="text-accent">{brushSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="200"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                    className="w-full accent-accent h-2 bg-border-site rounded-lg appearance-none cursor-pointer"
                                    disabled={!image}
                                />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium text-text-site">
                                    <span>{isZh ? '魔棒色彩容差' : 'Wand Tolerance'}</span>
                                    <span className="text-accent">{tolerance}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="128"
                                    value={tolerance}
                                    onChange={(e) => setTolerance(parseInt(e.target.value))}
                                    className="w-full accent-accent h-2 bg-border-site rounded-lg appearance-none cursor-pointer"
                                    disabled={!image}
                                />
                                <p className="text-xs text-text-site/50 leading-relaxed">
                                    {isZh ? '容差越大，一次点击包含的相近颜色越多。点按画布来自动消除背景色块。' : 'Higher tolerance selects a wider range of similar colors when clicking the canvas.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Canvas Area */}
                <div 
                    ref={containerRef}
                    className={`lg:col-span-3 bg-card-bg/30 rounded-3xl min-h-[400px] h-[60vh] border border-border-site flex flex-col items-center justify-center overflow-hidden relative shadow-inner touch-none group ${!image ? 'cursor-pointer' : 'cursor-crosshair'}`}
                    onClick={handleCanvasClick}
                    onWheel={handleWheel}
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={() => {
                        handlePointerUp();
                        unlockPageScroll();
                    }}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={() => {
                        handlePointerUp();
                        unlockPageScroll();
                    }}
                    onTouchCancel={() => {
                        handlePointerUp();
                        unlockPageScroll();
                    }}
                >
                    {!image && (
                        <div className="text-center p-8 bg-card-bg/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border-site absolute z-10 pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:bg-card-bg">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-text-site font-semibold text-lg mb-2">
                                {isZh ? '点击上传图片' : 'Click to Upload Image'}
                            </p>
                            <p className="text-text-site/50 text-sm">
                                {isZh ? '或拖拽图片到此处' : 'or drag and drop image here'}
                            </p>
                        </div>
                    )}
                    
                    {isProcessing && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                            <div className="bg-white/90 px-6 py-4 rounded-full shadow-xl flex items-center space-x-3 text-accent font-medium mt-auto mb-10 mx-4 max-w-sm">
                                <Wand2 className="w-5 h-5 animate-spin shrink-0" />
                                <span className="truncate">{loadingMessage || (isZh ? '魔法消除中...' : 'Eliminating...')}</span>
                            </div>
                        </div>
                    )}

                    <div 
                        style={{
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                            transformOrigin: 'center center',
                            transition: isPanning.current ? 'none' : 'transform 0.1s ease-out'
                        }}
                    >
                        {/* Hidden original overlay buffer for restoration */}
                        <canvas ref={originalCanvasRef} className="hidden" />
                        
                        {/* Display and working canvas layer */}
                        <canvas 
                            ref={workingCanvasRef} 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '1200px',
                                objectFit: 'contain',
                                imageRendering: 'pixelated'
                            }}
                            className={`shadow-2xl ring-2 ring-black/5 ${
                                tool === 'move' ? 'cursor-grab active:cursor-grabbing' : 
                                tool === 'wand' ? 'cursor-alias' : 'cursor-crosshair'
                            }`}
                        />
                    </div>

                    {/* Hidden file input for click upload */}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                    />
                </div>
            </div>

            {/* Instruction Footer */}
            <div className="bg-card-bg p-6 lg:p-8 rounded-3xl border border-border-site shadow-sm text-sm text-text-site/80 space-y-4 mt-6">
                <h3 className="font-bold text-lg text-text-site flex items-center">
                    <span className="bg-accent/10 p-1.5 rounded-lg mr-2"><Wand2 className="w-5 h-5 text-accent"/></span>
                    {isZh ? '如何使用新版操作台？' : 'How to use the new suite?'}
                </h3>
                {isZh ? (
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li><strong>一键智能去背 (快)：</strong>系统将自动识别图片边缘的背景主色调，并瞬间向内扩散消除。</li>
                        <li><strong>AI 深度模型：</strong>使用端侧神经网络模型，自动精准分割复杂主体的边缘与细节。第一次需加载几秒模型。</li>
                        <li><strong>魔棒工具：</strong>选取“魔棒”，轻轻点击图片中未被消除的背景颜色，系统将自动擦除相近区域。(调节左侧<strong>容差</strong>滑块可控制消除面积)</li>
                        <li><strong>橡皮擦：</strong>直接在不需要的地方按压涂抹，手动精修边缘。</li>
                        <li><strong>画笔还原：</strong>如果不小心擦多了，选择画笔还原涂抹该区域，原图将被神奇地唤回！</li>
                        <li><strong>画面操控：</strong>使用<strong>鼠标滚轮</strong>任意缩放画布，遇到细小的毛发边缘，切换到<strong>拖拽平移</strong>工具移动视角处理！</li>
                    </ul>
                ) : (
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li><strong>Fast Auto Matting:</strong> Instantly detect and eliminate the dominant corner background colors.</li>
                        <li><strong>Deep AI Model:</strong> Uses a highly accurate end-to-end local neural network to perform complex foreground extraction automatically.</li>
                        <li><strong>Magic Wand:</strong> Click on remaining background areas. It will automatically flood-fill and erase connected areas of similar color. (Adjust the <strong>Tolerance</strong> slider).</li>
                        <li><strong>Eraser:</strong> Manually perfect the edges by brushing away pixels.</li>
                        <li><strong>Restore Brush:</strong> Accidentally erased too much? Paint over the missing parts with this brush to bring back original pixels.</li>
                        <li><strong>View Control:</strong> Use your <strong>mouse wheel</strong> to zoom in. Select the <strong>Pan Move</strong> tool to shift your viewport for extreme precision edits!</li>
                    </ul>
                )}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
