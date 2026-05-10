import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Upload, Download, ScanLine, AlertCircle, Palette, Image as ImageIcon, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { FAQ } from './FAQ';

// --- QR Generator ---
export const QrGenerator: React.FC = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const faqs = [
    {
      question: {
        en: 'Can I add a logo to the QR code?',
        zh: '可以在二维码中添加 Logo 吗？'
      },
      answer: {
        en: 'Yes, you can upload an image to place in the center of the QR code. The QR code will still be scannable with proper error correction.',
        zh: '是的，您可以上传图片放置在二维码中心。通过适当的纠错级别，二维码仍然可以扫描。'
      }
    },
    {
      question: {
        en: 'What error correction level should I use?',
        zh: '应该使用什么纠错级别？'
      },
      answer: {
        en: 'Higher levels (H, Q) allow more damage to the QR code while remaining scannable. Use H if adding a logo or if the code might be printed.',
        zh: '更高级别（H、Q）允许二维码在受损更多的情况下仍可扫描。如果添加 Logo 或需要打印，请使用 H 级别。'
      }
    },
    {
      question: {
        en: 'Are generated QR codes permanent?',
        zh: '生成的二维码是永久的吗？'
      },
      answer: {
        en: 'The QR code image is permanent, but the content it links to can change. If you change the URL, the old QR code will link to the new destination.',
        zh: '二维码图片是永久的，但其链接的内容可以更改。如果您更改 URL，旧二维码将链接到新目标。'
      }
    }
  ];
  const [text, setText] = useState('https://www.web-tools.top');
  const [qrUrl, setQrUrl] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(512);
  const [logo, setLogo] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    if (!text) {
      setQrUrl('');
      return;
    }
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Generate base QR onto canvas
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor
        },
        errorCorrectionLevel: logo ? 'H' : 'M' // Higher recovery if logo present
      });

      // Overlay logo if exists
      if (logo) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = logo;
          });

          const logoSize = size * 0.22; // Logo is roughly 22% of QR size
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;

          // Background for logo (white border)
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.roundRect(x - 2, y - 2, logoSize + 4, logoSize + 4, 8);
          ctx.fill();

          // Draw logo
          ctx.drawImage(img, x, y, logoSize, logoSize);
        }
      }

      setQrUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(generate, 100); // Debounce
    return () => clearTimeout(timeout);
  }, [text, color, bgColor, size, logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const download = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode-momo.png';
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div className="space-y-8">
         <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
            <p className="text-sm text-text-site/70 leading-relaxed">
              {isZh
                ? '二维码生成器支持自定义颜色、大小、背景色，并可以添加 Logo 到二维码中心。适用于制作品牌二维码、社交媒体分享、名片印刷等多种场景。二维码扫描器可以识别图片中的二维码内容，支持批量上传识别。所有处理都在浏览器本地完成，保护您的隐私安全。'
                : 'The QR code generator supports custom colors, sizes, background colors, and allows adding a logo to the center of the QR code. Suitable for creating branded QR codes, social media sharing, business card printing, and various other scenarios. The QR code scanner can recognize QR code content in images and supports batch upload recognition. All processing is done locally in your browser, protecting your privacy.'}
            </p>
         </div>

         <div className="space-y-3">
            <label className="text-xs font-bold text-text-site/50 uppercase tracking-[0.2em]">{isZh ? '文本或网址内容' : 'QR CONTENT'}</label>
            <textarea 
              value={text} onChange={e => setText(e.target.value)}
              placeholder={isZh ? '输入文字、链接或任何要转换的内容...' : 'Enter text, link, or any content...'}
              className="w-full h-36 p-5 bg-card-bg border border-border-site rounded-[24px] text-text-site outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
         </div>

         <div className="space-y-6">
            <div className="text-xs font-bold text-text-site/50 uppercase tracking-[0.2em]">{isZh ? '样式定制' : 'CUSTOM STYLES'}</div>
            <div className="grid grid-cols-2 gap-6 p-6 bg-secondary-site/30 rounded-[32px] border border-border-site">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-site/40 uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {isZh ? '前景颜色' : 'Foreground'}
                    </label>
                    <div className="flex gap-3 items-center">
                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 bg-transparent border-0 rounded-xl cursor-pointer" />
                        <span className="text-xs font-mono opacity-40 uppercase">{color}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-site/40 uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full border border-border-site" /> {isZh ? '背景颜色' : 'Background'}
                    </label>
                    <div className="flex gap-3 items-center">
                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-12 bg-transparent border-0 rounded-xl cursor-pointer" />
                        <span className="text-xs font-mono opacity-40 uppercase">{bgColor}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold text-text-site/50 uppercase tracking-[0.2em]">{isZh ? '中心图标 (Logo)' : 'CENTER LOGO'}</label>
                <div className="flex gap-4 items-center">
                    {!logo ? (
                        <div className="relative flex-1 group">
                            <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="w-full py-4 px-6 bg-card-bg border-2 border-dashed border-border-site rounded-2xl flex items-center justify-center gap-3 text-text-site/40 group-hover:border-primary group-hover:text-primary transition-all">
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-sm font-bold">{isZh ? '上传图标' : 'Upload Icon'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center gap-4 bg-primary/10 border border-primary/20 p-3 rounded-2xl">
                             <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                             <span className="flex-1 text-xs font-bold text-primary truncate">logo_added.png</span>
                             <button onClick={() => setLogo(null)} className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all text-primary">
                                 <X className="w-4 h-4" />
                             </button>
                        </div>
                    )}
                </div>
                <p className="text-[10px] text-text-site/30 uppercase text-center">{isZh ? '提示：建议使用正方形且带透明背景的图标' : 'TIP: Square icons with transparent BG work best'}</p>
            </div>
         </div>
      </div>

      <div className="sticky top-10 flex flex-col items-center justify-center bg-gray-50 dark:bg-card-bg/40 border border-border-site rounded-[48px] p-12 space-y-8 min-h-[500px] shadow-sm">
         <canvas ref={canvasRef} className="hidden" />
         {qrUrl ? (
            <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center gap-8">
               <div className="p-6 bg-white rounded-[40px] shadow-2xl shadow-black/5 ring-1 ring-black/[0.03]">
                  <img src={qrUrl} alt="QR Code" className="w-64 h-64 md:w-80 md:h-80 rounded-2xl" />
               </div>
               
               <div className="flex gap-3">
                    <button 
                        onClick={download} 
                        className="px-10 py-4 bg-primary text-white rounded-[20px] font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                        <Download className="w-5 h-5" /> {isZh ? '下载 PNG 图片' : 'Download PNG'}
                    </button>
               </div>
               
               <div className="text-[10px] font-bold text-text-site/20 uppercase tracking-[0.3em] flex items-center gap-6 before:h-px before:w-12 before:bg-current after:h-px after:w-12 after:bg-current">
                   Real-time Preview
               </div>
            </div>
         ) : (
            <div className="text-center space-y-6 opacity-20">
                <div className="w-32 h-32 border-4 border-dashed border-current rounded-[40px] flex items-center justify-center mx-auto">
                    <QrCode className="w-16 h-16" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">{isZh ? '等待输入内容...' : 'Waiting for content...'}</p>
            </div>
         )}
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};

// --- QR Reader ---
export const QrReader: React.FC = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faqs = [
    {
      question: {
        en: 'What types of QR codes can be read?',
        zh: '可以读取哪些类型的二维码？'
      },
      answer: {
        en: 'We can read standard QR codes containing URLs, text, contact information, WiFi credentials, and other common QR code formats.',
        zh: '我们可以读取包含 URL、文本、联系信息、WiFi 凭证和其他常见二维码格式的标准二维码。'
      }
    },
    {
      question: {
        en: 'Is the QR reader accurate?',
        zh: '二维码识别准确吗？'
      },
      answer: {
        en: 'Our reader uses the jsQR library for reliable decoding. For best results, ensure the QR code is clear and not distorted.',
        zh: '我们的识别器使用 jsQR 库进行可靠解码。为获得最佳效果，请确保二维码清晰且无变形。'
      }
    },
    {
      question: {
        en: 'Is my uploaded image private?',
        zh: '我上传的图片是否私密？'
      },
      answer: {
        en: 'Yes, all processing happens locally in your browser. Your images are never uploaded to any server.',
        zh: '是的，所有处理完全在您的浏览器中进行。您的图片永远不会上传到任何服务器。'
      }
    }
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) decode(file);
  };

  const decode = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
          setError('');
        } else {
          setError(isZh ? '未识别到二维码，请尝试更清晰的图片' : 'No QR code found. Try a clearer image.');
          setResult('');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border-site/50 bg-secondary-site/30 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-secondary-site/50 transition-all group"
      >
        <ScanLine className="w-12 h-12 text-primary opacity-50 group-hover:scale-110 transition-transform" />
        <div className="text-center">
            <p className="font-bold text-text-site">{isZh ? '点击上传或拖拽二维码图片' : 'Click or drag QR image here'}</p>
            <p className="text-xs text-text-site/40 mt-1 uppercase tracking-widest">{isZh ? '支持 PNG, JPG, WebP' : 'Supports PNG, JPG, WebP'}</p>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
      </div>

      {result && (
        <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-2">
            <label className="text-[10px] font-bold text-green-500/60 uppercase tracking-widest">{isZh ? '解析结果' : 'Decoded Result'}</label>
            <div className="text-lg font-mono text-green-600 break-all">{result}</div>
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs font-bold text-green-500 underline underline-offset-4 mt-2"
            >
              {isZh ? '复制内容' : 'Copy Content'}
            </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
        </div>
      )}

      <FAQ faqs={faqs} />
    </div>
  );
};
