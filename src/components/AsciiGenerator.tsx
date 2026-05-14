import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, 
  Type, 
  Download, 
  Copy, 
  Settings2,
  Terminal,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { cn } from '../lib/utils';
import { FAQ } from './FAQ';

const ASCII_RAMPS = [
  " .:-=+*#%@",
  " ░▒▓█",
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  " ▂▃▄▅▆▇█"
];

export const AsciiGenerator = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const faqs = [
    {
      question: {
        en: 'What image formats are supported?',
        zh: '支持哪些图片格式？'
      },
      answer: {
        en: 'We support common image formats including PNG, JPG, GIF, and WebP. The image is processed locally in your browser.',
        zh: '我们支持常见的图片格式，包括 PNG、JPG、GIF 和 WebP。图片在您的浏览器中本地处理。'
      }
    },
    {
      question: {
        en: 'Can I adjust the ASCII resolution?',
        zh: '可以调整 ASCII 分辨率吗？'
      },
      answer: {
        en: 'Yes, you can adjust the width and resolution settings to control the detail level of the ASCII output. Higher resolution means more characters.',
        zh: '是的，您可以调整宽度和分辨率设置来控制 ASCII 输出的细节级别。分辨率越高意味着字符越多。'
      }
    },
    {
      question: {
        en: 'How do I use the ASCII art?',
        zh: '如何使用 ASCII 艺术字？'
      },
      answer: {
        en: 'You can copy the ASCII text to clipboard or download it as a text file. It works great in code comments, terminal outputs, and geeky signatures.',
        zh: '您可以将 ASCII 文本复制到剪贴板或下载为文本文件。它非常适合代码注释、终端输出和极客签名。'
      }
    }
  ];
  
  const [mode, setMode] = useState<'image' | 'text'>('text');
  const [renderStyle, setRenderStyle] = useState<'filled' | 'outline'>('filled');
  const [textInput, setTextInput] = useState('MOMO');
  const [imageInput, setImageInput] = useState<string | null>(null);
  
  const [rampIndex, setRampIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const [invert, setInvert] = useState(false);
  const [fontSize, setFontSize] = useState(10);

  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateAscii = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ramp = ASCII_RAMPS[rampIndex];
    const rampArr = ramp.split('');

    const processCanvas = (sourceWidth: number, sourceHeight: number, callback: () => void) => {
        const targetWidth = Math.floor(width / 2); // We output 2 characters per pixel, so internal canvas width is halved
        const aspectRatio = sourceHeight / sourceWidth;
        // Characters are usually roughly 2x as tall as they are wide.
        const targetHeight = Math.floor(targetWidth * aspectRatio * 0.45);

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        callback(); // draw the content

        let imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        
        if (renderStyle === 'outline' && mode === 'image') {
            const data = imageData.data;
            const out = new Uint8ClampedArray(data.length);
            const w = targetWidth;
            const h = targetHeight;

            const getGray = (x: number, y: number) => {
                if (x < 0 || x >= w || y < 0 || y >= h) return 0;
                const i = (y * w + x) * 4;
                return 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
            };

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const pixelX = (
                        -1 * getGray(x - 1, y - 1) + 1 * getGray(x + 1, y - 1) +
                        -2 * getGray(x - 1, y)     + 2 * getGray(x + 1, y) +
                        -1 * getGray(x - 1, y + 1) + 1 * getGray(x + 1, y + 1)
                    );
                    const pixelY = (
                        -1 * getGray(x - 1, y - 1) + -2 * getGray(x, y - 1) + -1 * getGray(x + 1, y - 1) +
                         1 * getGray(x - 1, y + 1) +  2 * getGray(x, y + 1) +  1 * getGray(x + 1, y + 1)
                    );
                    
                    const mag = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY)) * 1.5; 
                    const val = mag > 255 ? 255 : mag;
                    
                    const i = (y * w + x) * 4;
                    const edgeVal = 255 - val;
                    out[i] = edgeVal;
                    out[i+1] = edgeVal;
                    out[i+2] = edgeVal;
                    out[i+3] = 255;
                }
            }
            for(let i=0; i<data.length; i++) data[i] = out[i];
        }

        const data = imageData.data;
        let asciiStr = '';
        for (let y = 0; y < targetHeight; y++) {
            for (let x = 0; x < targetWidth; x++) {
                const offset = (y * targetWidth + x) * 4;
                const r = data[offset];
                const g = data[offset + 1];
                const b = data[offset + 2];
                
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                const normalizedBright = invert ? (brightness / 255) : (1 - brightness / 255);
                const charIndex = Math.floor(normalizedBright * (rampArr.length - 1));
                const char = rampArr[charIndex];
                
                // Duplicate characters horizontally so it looks proportional in text editors where line-height is large
                asciiStr += char + char;
            }
            asciiStr += '\n';
        }
        setOutput(asciiStr);
    };

    if (mode === 'text' && textInput) {
        // Draw text
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        const baseFontSize = width > 100 ? 150 : 100;
        const testFont = `bold ${baseFontSize}px sans-serif`;
        tempCtx.font = testFont;
        const textMetrics = tempCtx.measureText(textInput);
        const textWidth = Math.max(textMetrics.width, 100);
        
        tempCanvas.width = textWidth + baseFontSize; 
        tempCanvas.height = baseFontSize * 1.5;
        
        // Fill white background
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        tempCtx.font = testFont;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        
        if (renderStyle === 'filled') {
            tempCtx.fillStyle = 'black';
            tempCtx.fillText(textInput, tempCanvas.width / 2, tempCanvas.height / 2);
        } else {
            tempCtx.strokeStyle = 'black';
            tempCtx.lineWidth = baseFontSize * 0.04;
            tempCtx.strokeText(textInput, tempCanvas.width / 2, tempCanvas.height / 2);
        }

        processCanvas(tempCanvas.width, tempCanvas.height, () => {
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        });

    } else if (mode === 'image' && imageInput) {
        const img = new Image();
        img.onload = () => {
            processCanvas(img.width, img.height, () => {
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height); 
            });
        };
        img.src = imageInput;
    } else {
        setOutput('');
    }
  };

  useEffect(() => {
    generateAscii();
  }, [mode, textInput, imageInput, rampIndex, width, invert, renderStyle]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageInput(event.target?.result as string);
        setMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? 'ASCII 字符画生成器可以将图片或文字转换为 ASCII 字符艺术。支持多种字符集和渲染模式，包括填充和轮廓样式。可以调整输出宽度、字符大小和颜色反转。适用于制作独特的头像、装饰文本或创意艺术作品。所有处理都在浏览器本地完成，支持一键复制和下载生成的字符画。'
            : 'The ASCII art generator can convert images or text into ASCII character art. Supports multiple character sets and rendering modes, including filled and outline styles. You can adjust output width, character size, and color inversion. Suitable for creating unique avatars, decorative text, or creative artwork. All processing is done locally in your browser with one-click copy and download support.'}
        </p>
      </div>

      {/* Header */}
      <div className="bg-card-bg border border-border-site rounded-[40px] p-8 md:p-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Terminal className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tight">{isZh ? 'ASCII 字符画生成' : 'ASCII Art Generator'}</h2>
          <p className="text-text-site/50">
            {isZh 
              ? '将文字或图片转换成复古极客风格的纯字符画。自带强烈的“黑客感”，完美适用于代码注释与终端输出。' 
              : 'Convert text or images into retro geek-style pure character art. Perfect for code comments and terminal logs.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-8">
                {/* Mode Switcher */}
                <div className="flex p-1 bg-secondary-site rounded-2xl">
                    <button 
                        onClick={() => setMode('text')}
                        className={cn(
                            "flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-black transition-all",
                            mode === 'text' ? "bg-card-bg shadow-sm text-primary" : "text-text-site/40 hover:text-text-site/80"
                        )}
                    >
                        <Type className="w-4 h-4" /> {isZh ? '文字转换' : 'Text Input'}
                    </button>
                    <button 
                        onClick={() => setMode('image')}
                        className={cn(
                            "flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-black transition-all",
                            mode === 'image' ? "bg-card-bg shadow-sm text-primary" : "text-text-site/40 hover:text-text-site/80"
                        )}
                    >
                        <ImageIcon className="w-4 h-4" /> {isZh ? '图片上传' : 'Image Upload'}
                    </button>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                    {mode === 'text' ? (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-site/40">{isZh ? '输入文字' : 'Enter Text'}</label>
                            <input 
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="MOMO"
                                className="w-full bg-secondary-site border border-border-site rounded-2xl px-4 py-3 font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-site/40">{isZh ? '选择图片' : 'Select Image'}</label>
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-site rounded-2xl hover:bg-secondary-site hover:border-primary/50 cursor-pointer transition-all">
                                <ImageIcon className="w-8 h-8 text-text-site/20 mb-2" />
                                <span className="text-sm font-bold text-text-site/60">{isZh ? '点击上传图片' : 'Click to upload image'}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    )}
                </div>

                {/* Settings */}
                <div className="bg-secondary-site/50 border border-border-site rounded-[24px] p-6 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-text-site/60">
                        <Settings2 className="w-4 h-4" /> {isZh ? '参数调整' : 'Adjustments'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-text-site/60">
                                <span>{isZh ? '输出宽度 (列数)' : 'Output Width (Cols)'}</span>
                                <span className="font-mono text-primary">{width}</span>
                            </div>
                            <input 
                                type="range" min="20" max="300" step="5"
                                value={width} onChange={(e) => setWidth(parseInt(e.target.value))}
                                className="w-full accent-primary h-1 bg-border-site rounded-full cursor-pointer appearance-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-text-site/60">
                                <span>{isZh ? '预览字号' : 'Preview Font Size'}</span>
                                <span className="font-mono text-primary">{fontSize}px</span>
                            </div>
                            <input 
                                type="range" min="4" max="24" step="1"
                                value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full accent-primary h-1 bg-border-site rounded-full cursor-pointer appearance-none"
                            />
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border-site">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-site/40">{isZh ? '渲染模式' : 'Render Style'}</label>
                            <div className="flex p-1 bg-card-bg border border-border-site rounded-xl">
                                <button 
                                    onClick={() => setRenderStyle('filled')}
                                    className={cn(
                                        "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        renderStyle === 'filled' ? "bg-primary text-white shadow-md" : "text-text-site/50 hover:text-text-site"
                                    )}
                                >
                                    {isZh ? '块状填充' : 'Filled'}
                                </button>
                                <button 
                                    onClick={() => setRenderStyle('outline')}
                                    className={cn(
                                        "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        renderStyle === 'outline' ? "bg-primary text-white shadow-md" : "text-text-site/50 hover:text-text-site"
                                    )}
                                >
                                    {isZh ? '轻量边框' : 'Outline'}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border-site space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-site/40">{isZh ? '字符集样式' : 'Character Ramp'}</label>
                            <div className="flex flex-col gap-2">
                                {ASCII_RAMPS.map((ramp, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setRampIndex(i)}
                                        className={cn(
                                            "font-mono text-xs p-2 rounded-xl text-left truncate transition-all",
                                            rampIndex === i ? "bg-primary text-white font-black" : "bg-card-bg border border-border-site text-text-site/60 hover:border-primary/50"
                                        )}
                                        title={ramp}
                                    >
                                        {ramp}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="flex items-center gap-3 pt-4 cursor-pointer group">
                            <div className={cn(
                                "w-10 h-6 rounded-full transition-colors flex items-center px-1",
                                invert ? "bg-primary" : "bg-text-site/20"
                            )}>
                                <div className={cn(
                                    "w-4 h-4 bg-white rounded-full transition-transform",
                                    invert ? "translate-x-4" : "translate-x-0"
                                )}/>
                            </div>
                            <span className="text-sm font-bold text-text-site/60 group-hover:text-text-site transition-colors">
                                {isZh ? '反转明暗' : 'Invert Brightness'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Output */}
            <div className="lg:col-span-8 bg-card-bg border border-border-site rounded-[32px] p-6 lg:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2">
                        <Wand2 className="w-4 h-4" /> {isZh ? '生成结果' : 'Generated Result'}
                    </h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCopy}
                            className="p-2 bg-secondary-site text-text-site/60 hover:text-primary rounded-xl transition-all"
                            title={isZh ? '复制纯字符' : 'Copy pure text'}
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="p-2 bg-secondary-site text-text-site/60 hover:text-primary rounded-xl transition-all"
                            title={isZh ? '下载为 .txt' : 'Download as .txt'}
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="w-full bg-black rounded-2xl p-6 overflow-x-auto relative border border-white/10 group shadow-inner">
                    {!output && mode === 'image' && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 italic text-sm">
                            {isZh ? '上传图片后在此预览...' : 'Upload an image to preview here...'}
                        </div>
                    )}
                    <pre 
                        className="font-mono text-green-500 leading-[1.1] transition-all w-fit min-w-full"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {output}
                    </pre>

                    {/* Copy layer instruction */}
                    {output && (
                        <div className="sticky bottom-0 right-0 w-full flex justify-end opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none pt-4">
                            <span className="bg-black/80 text-white/50 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm -mb-2">
                                {isZh ? '你可以直接框选复制内容' : 'Select and copy directly'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <FAQ faqs={faqs} />
      </div>
    </div>
  );
};
