import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, FileImage, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

type Format = 'image/jpeg' | 'image/png' | 'image/webp';

export const ImageConverter: React.FC = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const faqs = [
    {
      question: {
        en: 'What image formats are supported?',
        zh: '支持哪些图片格式？'
      },
      answer: {
        en: 'We support WebP, PNG, JPG, and Apple HEIC formats. HEIC files from iPhones are automatically converted to standard formats.',
        zh: '我们支持 WebP、PNG、JPG 和苹果 HEIC 格式。来自 iPhone 的 HEIC 文件会自动转换为标准格式。'
      }
    },
    {
      question: {
        en: 'Is my image data private?',
        zh: '我的图片数据是否私密？'
      },
      answer: {
        en: 'Yes, all conversion happens entirely in your browser. Your images are never uploaded to any server, ensuring complete privacy.',
        zh: '是的，所有转换完全在您的浏览器中进行。您的图片永远不会上传到任何服务器，确保完全隐私。'
      }
    },
    {
      question: {
        en: 'Will conversion reduce image quality?',
        zh: '转换会降低图片质量吗？'
      },
      answer: {
        en: 'You can control the quality level from 10% to 100%. Higher quality means larger file size. We recommend 85% for good balance.',
        zh: '您可以控制质量级别从 10% 到 100%。质量越高文件越大。我们建议 85% 以获得良好的平衡。'
      }
    }
  ];
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>('image/jpeg');
  const [quality, setQuality] = useState(0.85);
  const [converting, setConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    setError(null);
    setConvertedUrl(null);
    setFile(selectedFile);
    
    // Check if it's HEIC/HEIF
    const fileNameLower = selectedFile.name.toLowerCase();
    const isHeic = fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif') || 
                   selectedFile.type.includes('heic') || selectedFile.type.includes('heif');

    if (isHeic) {
      // Browsers cannot render HEIC directly in <img>, so we show a placeholder
      setPreview('heic_placeholder');
    } else {
      // Create regular preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setConverting(true);
    setError(null);
    setConvertedUrl(null);
    
    try {
      let sourceBlob: Blob = file;
      
      // Handle HEIC/HEIF
      const fileNameLower = file.name.toLowerCase();
      const isHeic = fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';
      
      if (isHeic) {
        const { default: heic2anyModule } = await import('heic2any');
        try {
          const convertedHeic = await heic2anyModule({
            blob: file,
            toType: 'image/jpeg',
            quality: quality
          });
          sourceBlob = Array.isArray(convertedHeic) ? convertedHeic[0] : convertedHeic;
        } catch (heicErr: any) {
          throw new Error(isZh ? 'HEIC 转换库加载或处理失败: ' + heicErr.message : 'HEIC conversion failed: ' + heicErr.message);
        }
      }
      
      // Use Canvas for final format conversion & compression
      const img = new Image();
      const objectUrl = URL.createObjectURL(sourceBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            throw new Error('Canvas context failed');
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Artificial delay for ad impressions as requested by user strategy
        setTimeout(() => {
            try {
                const dataUrl = canvas.toDataURL(targetFormat, quality);
                setConvertedUrl(dataUrl);
            } catch (err) {
                setError(isZh ? '生成图片失败，请尝试其他格式' : 'Failed to generate image, try another format');
            } finally {
                setConverting(false);
                URL.revokeObjectURL(objectUrl);
            }
        }, 1200);
      };
      
      img.onerror = () => {
        setError(isZh ? '无法加载处理后的图片，请确保文件未损坏' : 'Failed to load processed image');
        setConverting(false);
        URL.revokeObjectURL(objectUrl);
      };
      
      img.src = objectUrl;
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isZh ? '转换过程中出现错误' : 'An error occurred during conversion'));
      setConverting(false);
    }
  };

  const downloadFile = () => {
    if (!convertedUrl || !file) return;
    const link = document.createElement('a');
    const ext = targetFormat.split('/')[1];
    const newName = file.name.split('.')[0] + '.' + (ext === 'jpeg' ? 'jpg' : ext);
    link.href = convertedUrl;
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? '这是一个功能强大的图片格式转换工具，支持 WebP、PNG、JPG 以及苹果 HEIC 格式之间的相互转换。特别针对 iPhone 用户，可以轻松将 HEIC 照片转换为通用的 JPG 格式，方便在社交媒体上分享。您还可以自定义图片质量，在文件大小和画质之间找到最佳平衡。所有转换都在您的浏览器本地完成，确保图片隐私安全，无需上传到任何服务器。适用于网站开发、图片优化、格式兼容等多种场景。'
            : 'This is a powerful image format conversion tool that supports conversion between WebP, PNG, JPG, and Apple HEIC formats. Especially designed for iPhone users, it can easily convert HEIC photos to universal JPG format for easy sharing on social media. You can also customize image quality to find the best balance between file size and image quality. All conversions are performed locally in your browser, ensuring image privacy and security without uploading to any server. Suitable for web development, image optimization, format compatibility, and various other scenarios.'}
        </p>
      </div>

      {/* Upload Region */}
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) processFile(droppedFile);
          }}
          className="border-2 border-dashed border-border-site/50 bg-secondary-site/30 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-secondary-site/50 transition-all group"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-text-site">
              {isZh ? '上传原始图片' : 'Upload Source Image'}
            </p>
            <p className="text-sm text-text-site/50">
              {isZh ? '支持 WebP, PNG, JPG, HEIC 等格式' : 'Supports WebP, PNG, JPG, HEIC, etc.'}
            </p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,.heic,.heif"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview & Info */}
          <div className="bg-secondary-site border border-border-site rounded-3xl p-6 space-y-4">
             <div className="aspect-square bg-black/5 rounded-2xl overflow-hidden relative flex items-center justify-center">
                {preview === 'heic_placeholder' ? (
                   <div className="flex flex-col items-center gap-2 text-primary">
                      <FileImage className="w-12 h-12" />
                      <span className="text-xs font-bold uppercase tracking-widest">HEIC / HEIF</span>
                   </div>
                ) : preview ? (
                   <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                   <FileImage className="w-12 h-12 text-text-site/20" />
                )}
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-text-site/50 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                    {file.name}
                </span>
                <button 
                  onClick={() => { setFile(null); setConvertedUrl(null); }}
                  className="text-primary font-bold hover:underline"
                >
                  {isZh ? '更换' : 'Change'}
                </button>
             </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-text-site/70">
                {isZh ? '目标格式' : 'Target Format'}
              </label>
              <div className="flex gap-2">
                {(['image/jpeg', 'image/png', 'image/webp'] as Format[]).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      targetFormat === fmt 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border-site bg-card-bg text-text-site/50 hover:border-primary/50'
                    }`}
                  >
                    {fmt.split('/')[1].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-text-site/70">
                    {isZh ? '图片质量 / 压缩率' : 'Quality / Compression'}
                </label>
                <span className="text-primary font-mono font-bold">{Math.round(quality * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="1" step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-primary bg-border-site rounded-lg appearance-none h-2"
              />
            </div>

            <button
               onClick={handleConvert}
               disabled={converting}
               className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {converting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {isZh ? '正在极速转换中...' : 'Converting...'}
                </>
              ) : (
                isZh ? '立即转换并下载' : 'Convert & Download'
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {convertedUrl && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  {isZh ? '转换已完成!' : 'Conversion Complete!'}
                </div>
                <button 
                  onClick={downloadFile}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isZh ? '下载' : 'Download'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEO/Instruction Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border-site">
         <div className="p-6 bg-secondary-site/30 rounded-3xl space-y-2 border border-border-site/30">
            <h4 className="font-bold text-text-site">{isZh ? '100% 隐私安全' : '100% Private'}</h4>
            <p className="text-xs text-text-site/50 leading-relaxed">
              {isZh ? '所有的图片处理均在您的浏览器本地完成，文件永远不会上传到我们的服务器。' : 'All image processing happens locally in your browser. Files are never uploaded to our servers.'}
            </p>
         </div>
         <div className="p-6 bg-secondary-site/30 rounded-3xl space-y-2 border border-border-site/30">
            <h4 className="font-bold text-text-site">{isZh ? '极速转换' : 'Fast Conversion'}</h4>
            <p className="text-xs text-text-site/50 leading-relaxed">
              {isZh ? '利用 Canvas 硬件加速技术，数毫秒内即可完成 WebP 转 JPG 或 PNG 转换。' : 'Utilizing Canvas hardware acceleration to complete WebP to JPG or PNG in milliseconds.'}
            </p>
         </div>
         <div className="p-6 bg-secondary-site/30 rounded-3xl space-y-2 border border-border-site/30">
            <h4 className="font-bold text-text-site">{isZh ? '万能适配' : 'Smart Support'}</h4>
            <p className="text-xs text-text-site/50 leading-relaxed">
              {isZh ? '完美支持苹果手机 HEIC 原始照片格式，轻松转换为通用的 JPG 格式，方便社交分享。' : 'Full support for Apple HEIC photos, converting them to standard JPG for easy social sharing.'}
            </p>
         </div>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};
