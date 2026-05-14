import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Download, 
  FileCode, 
  Type, 
  Image as ImageIcon, 
  Hash, 
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FolderArchive,
  Layers,
  Zap,
  Code,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { cn } from '../lib/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const WebAssetExtractor = () => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [assets, setAssets] = useState<{
    images: string[];
    fonts: string[];
    scripts: string[];
    techStack: string[];
    cssVariables: { name: string; value: string }[];
    text: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const faqs = [
    {
      question: {
        en: 'What assets can be extracted?',
        zh: '可以提取哪些资产？'
      },
      answer: {
        en: 'We extract images (including lazy-loaded), fonts, scripts, CSS variables, text content, and detect the tech stack used by the website.',
        zh: '我们提取图片（包括懒加载）、字体、脚本、CSS 变量、文字内容，并检测网站使用的技术栈。'
      }
    },
    {
      question: {
        en: 'How does the extraction work?',
        zh: '提取是如何工作的？'
      },
      answer: {
        en: 'We use CORS proxies to fetch the website HTML, then parse it to extract assets. Multiple proxy fallbacks ensure better success rates.',
        zh: '我们使用 CORS 代理获取网站 HTML，然后解析它以提取资产。多个代理后备确保更高的成功率。'
      }
    },
    {
      question: {
        en: 'Can I download all images at once?',
        zh: '可以一次下载所有图片吗？'
      },
      answer: {
        en: 'Yes, you can select specific images or download all at once as a ZIP file. Perfect for asset collection and analysis.',
        zh: '可以，您可以选择特定图片或一次性下载所有图片为 ZIP 文件。非常适合资产收集和分析。'
      }
    }
  ];

  const toggleImageSelection = (img: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(img)) {
      newSelected.delete(img);
    } else {
      newSelected.add(img);
    }
    setSelectedImages(newSelected);
  };

  const selectAllImages = () => {
    if (!assets) return;
    if (selectedImages.size === assets.images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(assets.images));
    }
  };

  const extractAssets = async () => {
    if (!url) return;
    
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    try {
      new URL(targetUrl);
    } catch (e) {
      setError(isZh ? '请输入有效的网址。' : 'Please enter a valid URL.');
      return;
    }

    setError(null);
    setIsExtracting(true);
    setAssets(null);
    setSelectedImages(new Set());

    // Using our own server-side proxy + list of public CORS proxies as fallbacks
    const proxies = [
      (u: string) => `/api/proxy?url=${encodeURIComponent(u)}`,
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`
    ];
    
    let html = '';
    let success = false;

    for (const getProxy of proxies) {
      try {
        const response = await fetch(getProxy(targetUrl));
        if (!response.ok) continue;
        
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          html = data.contents;
        } else {
          html = await response.text();
        }

        if (html && html.length > 100) {
          success = true;
          break;
        }
      } catch (e) {
        console.warn('Proxy failed, trying next...');
      }
    }

    if (!success) {
      setError(isZh ? '所有提取代理均失败。可能是目标网站防火墙拦截或 CORS 限制过严。' : 'All extraction proxies failed. The target site might have a strong firewall or strict CORS policies.');
      setIsExtracting(false);
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 1. Extract Images
      const images = Array.from(doc.querySelectorAll('img, [style*="background-image"], [data-src], [data-lazy-src], [data-original]')).map(el => {
        let src = '';
        if (el.tagName === 'IMG') {
          src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('data-lazy-src') || el.getAttribute('data-original') || '';
          const srcset = el.getAttribute('srcset');
          if (!src && srcset) {
            src = srcset.split(',')[0].split(' ')[0];
          }
        } else {
          const style = el.getAttribute('style') || '';
          const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (match) src = match[1];
          else {
            // Check for background-image in data-src/data-original as well (some lazy load libs do this)
            src = el.getAttribute('data-src') || el.getAttribute('data-original') || '';
          }
        }

        if (!src) return '';
        if (src.startsWith('data:')) return '';
        if (src.startsWith('http')) return src;
        if (src.startsWith('//')) return 'https:' + src;
        try {
          return new URL(src, targetUrl).href;
        } catch { return src; }
      }).filter(src => src && src.length > 5);

      // 2. Extract Scripts & Tech Stack
      const scripts = Array.from(doc.querySelectorAll('script')).map(s => s.getAttribute('src')).filter(src => src) as string[];
      const techStack: string[] = [];
      const bodyHtml = html.toLowerCase();
      
      const detections = [
        { name: 'React', keywords: ['react', 'react-dom'] },
        { name: 'Vue.js', keywords: ['vue', 'v-bind'] },
        { name: 'Angular', keywords: ['ng-version', 'angular'] },
        { name: 'Next.js', keywords: ['_next/static'] },
        { name: 'Nuxt', keywords: ['__nuxt'] },
        { name: 'Tailwind CSS', keywords: ['tailwind'] },
        { name: 'Bootstrap', keywords: ['bootstrap.css', 'bootstrap.js'] },
        { name: 'jQuery', keywords: ['jquery.min.js', 'jquery-'] },
        { name: 'Google Analytics', keywords: ['google-analytics', 'gtag'] },
        { name: 'WordPress', keywords: ['wp-content', 'wp-includes'] },
        { name: 'Shopify', keywords: ['cdn.shopify.com'] },
        { name: 'Elementor', keywords: ['elementor'] }
      ];

      detections.forEach(d => {
        if (d.keywords.some(k => bodyHtml.includes(k))) techStack.push(d.name);
      });

      // 3. Extract CSS Variables & Fonts
      const cssVariables: { name: string; value: string }[] = [];
      
      // Improved Regex for variables
      const varRegex = /(--[a-zA-Z0-9-]+):\s*([^;{}!]+)/g;
      let m;
      while ((m = varRegex.exec(html)) !== null) {
        cssVariables.push({ name: m[1], value: m[2].trim() });
      }

      const fontRegex = /font-family:[^;!]+|@font-face/g;
      const fontMatches = html.match(fontRegex);
      const fonts = Array.from(new Set(
        fontMatches?.map(f => f.replace('font-family:', '').trim())
          .filter(f => f !== '@font-face' && f.length < 50) || []
      )) as string[];

      const uniqueVars = Array.from(
        cssVariables.reduce((map, obj) => map.set(obj.name, obj), new Map()).values()
      ) as { name: string; value: string }[];

      // 4. Extract Text Content
      const bodyText = doc.body?.innerText || '';
      const cleanText = bodyText.replace(/\s+/g, ' ').trim().substring(0, 5000);

      setTimeout(() => {
        setAssets({
          images: Array.from(new Set(images)).slice(0, 100),
          fonts: fonts.slice(0, 15),
          scripts: Array.from(new Set(scripts)),
          techStack: Array.from(new Set(techStack)),
          cssVariables: uniqueVars.slice(0, 40),
          text: cleanText
        });
        setIsExtracting(false);
      }, 1000);

    } catch (err) {
      setError(isZh ? '解析 HTML 时出错。' : 'Error parsing HTML content.');
      setIsExtracting(false);
    }
  };

  const downloadSelectedImages = async () => {
    const imagesToDownload = selectedImages.size > 0 
      ? Array.from(selectedImages) 
      : (assets?.images || []);

    if (!imagesToDownload.length) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    const zip = new JSZip();
    const imgFolder = zip.folder("images");
    
    for (let i = 0; i < imagesToDownload.length; i++) {
      try {
        const imgUrl = imagesToDownload[i];
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(imgUrl)}`);
        
        // Only process if response is successful
        if (!response.ok) {
          console.warn(`Skipping image ${i} due to fetch failure: ${response.status}`);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        
        // Ensure we actually got data
        if (arrayBuffer.byteLength < 100) {
          console.warn(`Skipping image ${i} because it's too small or empty (${arrayBuffer.byteLength} bytes)`);
          continue;
        }
        
        // Try to determine extension
        const urlObj = new URL(imgUrl);
        const pathname = urlObj.pathname;
        let ext = pathname.split('.').pop()?.toLowerCase() || 'png';
        
        // Clean extension from query params
        if (ext.includes('?')) ext = ext.split('?')[0];

        if (!['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico', 'avif'].includes(ext)) {
          // Fallback to content-type if extension lookup fails
          const type = response.headers.get('content-type');
          if (type?.includes('jpeg')) ext = 'jpg';
          else if (type?.includes('png')) ext = 'png';
          else if (type?.includes('webp')) ext = 'webp';
          else if (type?.includes('gif')) ext = 'gif';
          else if (type?.includes('svg')) ext = 'svg';
          else if (type?.includes('avif')) ext = 'avif';
          else ext = 'png'; 
        }
        
        imgFolder?.file(`image_${i + 1}.${ext}`, arrayBuffer);
        setDownloadProgress(Math.round(((i + 1) / imagesToDownload.length) * 100));
      } catch (e) { 
        console.error('Failed to download image', imagesToDownload[i]); 
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `extracted_images_${new Date().getTime()}.zip`;
    link.click();
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  return (
    <div className="space-y-8">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? '网页资产提取器可以深度扫描任意网页，提取图片（包括懒加载）、字体、脚本、CSS 变量、文字内容，并检测网站使用的技术栈。使用 CORS 代理获取网页数据，支持选择特定图片或批量下载为 ZIP 文件。适用于前端开发、设计参考、资产收集、技术分析等场景。'
            : 'The web asset extractor can deep scan any webpage to extract images (including lazy-loaded), fonts, scripts, CSS variables, text content, and detect the tech stack used. Uses CORS proxies to fetch webpage data, supports selecting specific images or batch downloading as ZIP file. Suitable for frontend development, design reference, asset collection, technical analysis, and other scenarios.'}
        </p>
      </div>

      <div className="bg-card-bg border border-border-site rounded-[40px] p-8 md:p-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tight">{isZh ? '网页资产逆向提取器' : 'Web Asset Extractor'}</h2>
          <p className="text-text-site/50">
            {isZh 
              ? '输入任意网址，深度扫描并提取页面的图片、字体、CSS变量及技术栈构成。' 
              : 'Enter any URL to deep scan and extract images, fonts, CSS variables, and tech stack components.'}
          </p>
        </div>

        <div className="max-w-2xl mx-auto flex gap-4">
          <div className="flex-1 relative group">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-site/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder={isZh ? 'https://example.com' : 'Enter URL to analyze...'}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-6 py-5 bg-secondary-site border border-border-site rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
          <button 
            onClick={extractAssets}
            disabled={isExtracting || !url}
            className="px-8 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {isExtracting ? (isZh ? '正在通过代理提取...' : 'EXTRACTING...') : (isZh ? '一键提取' : 'EXTRACT')}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="max-w-2xl mx-auto bg-red-500 border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] rounded-2xl p-5 flex items-center gap-4 text-white"
            >
              <div className="bg-white/20 p-2 rounded-xl">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">
                  System Alert / 提取提示
                </p>
                <p className="font-bold text-sm leading-tight">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {assets && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: isZh ? '图片资产' : 'Images', value: assets.images.length, icon: ImageIcon },
                  { label: isZh ? '字体库' : 'Fonts', value: assets.fonts.length, icon: Type },
                  { label: isZh ? '技术栈' : 'Techs', value: assets.techStack.length, icon: Code },
                  { label: isZh ? 'CSS 变量' : 'CSS Vars', value: assets.cssVariables.length, icon: Hash },
                  { label: isZh ? '文字内容' : 'Text', value: assets.text.length, icon: FileCode },
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-secondary-site/30 border border-border-site rounded-3xl flex flex-col items-center justify-center space-y-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <p className="text-[10px] font-black uppercase text-text-site/40 tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Details Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tech Stack & Fonts */}
                <div className="lg:col-span-1 bg-card-bg border border-border-site rounded-[32px] p-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> {isZh ? '识别到的技术栈' : 'Detected Tech Stack'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {assets.techStack.length > 0 ? assets.techStack.map(tech => (
                      <span key={tech} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20">
                        {tech}
                      </span>
                    )) : <p className="text-xs italic text-text-site/20">{isZh ? '未匹配到特定技术栈' : 'No specific stacks matched'}</p>}
                  </div>
                  
                  <div className="pt-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2">
                      <Type className="w-4 h-4" /> {isZh ? '导出字体' : 'Fonts'}
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {assets.fonts.map(font => (
                        <div key={font} className="p-3 bg-secondary-site rounded-xl text-xs font-mono font-bold truncate">
                          {font}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2">
                      <Code className="w-4 h-4" /> {isZh ? '脚本文件' : 'Scripts'}
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {assets.scripts.length > 0 ? assets.scripts.map(script => (
                        <div key={script} className="p-3 bg-secondary-site rounded-xl text-xs font-mono truncate">
                          {script}
                        </div>
                      )) : <p className="text-xs italic text-text-site/20">{isZh ? '未检测到脚本' : 'No scripts detected'}</p>}
                    </div>
                  </div>
                </div>

                {/* Images Grid */}
                <div className="lg:col-span-2 bg-card-bg border border-border-site rounded-[32px] p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> {isZh ? '图片资源' : 'Image Assets'}
                    </h3>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={selectAllImages}
                        className="text-[10px] font-black text-text-site/40 hover:text-primary transition-colors underline decoration-dotted"
                      >
                        {selectedImages.size === assets.images.length 
                          ? (isZh ? '取消全选' : 'Deselect All') 
                          : (isZh ? '全选图片' : 'Select All')}
                      </button>
                      <button 
                        onClick={downloadSelectedImages}
                        disabled={isDownloading}
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {isZh ? `正在打包 ${downloadProgress}%` : `Zipping ${downloadProgress}%`}
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" /> 
                            {selectedImages.size > 0 
                              ? (isZh ? `下载所选 (${selectedImages.size})` : `Download Selected (${selectedImages.size})`)
                              : (isZh ? '下载全部 ZIP' : 'Download All ZIP')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {assets.images.map((img, i) => (
                      <div 
                        key={i} 
                        onClick={() => toggleImageSelection(img)}
                        className={cn(
                          "aspect-square rounded-xl overflow-hidden group relative cursor-pointer border-2 transition-all",
                          selectedImages.has(img) ? "border-primary ring-4 ring-primary/10" : "border-border-site hover:border-text-site/20"
                        )}
                      >
                        <img 
                          src={img} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className={cn(
                            "w-full h-full object-cover transition-transform duration-500",
                            selectedImages.has(img) ? "scale-90" : "group-hover:scale-110"
                          )} 
                        />
                        
                        {/* Selection Checkbox UI */}
                        <div className={cn(
                          "absolute top-2 right-2 w-5 h-5 rounded-md flex items-center justify-center transition-all z-10 border",
                          selectedImages.has(img) 
                            ? "bg-primary border-primary text-white scale-100" 
                            : "bg-black/20 border-white/20 text-transparent scale-0 group-hover:scale-100"
                        )}>
                          <CheckCircle2 className="w-3 h-3" />
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={e => e.stopPropagation()}>
                          <a href={img} target="_blank" rel="noreferrer" className="p-2 bg-white text-black rounded-lg hover:bg-primary hover:text-white transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CSS Variables */}
                <div className="lg:col-span-3 bg-[#0a0a0b] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                      <FileCode className="w-4 h-4" /> {isZh ? 'CSS 主题变量' : 'CSS Theme Variables'}
                    </h3>
                    <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-mono text-white/40 uppercase tracking-tighter">
                      {isZh ? '逆向工程 (启发式)' : 'Reverse Engineered (Heuristic)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assets.cssVariables.length > 0 ? assets.cssVariables.map((v, idx) => (
                      <div key={idx} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-mono group hover:bg-primary/10 hover:border-primary/20 transition-all cursor-crosshair overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-primary font-black">--</span>
                          <span className="text-white font-bold truncate">{v.name.replace('--', '')}</span>
                        </div>
                        <div className="text-white/40 truncate text-[10px] bg-black/20 p-1.5 rounded">
                          {v.value}
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-12 flex flex-col items-center justify-center space-y-2 opacity-20">
                        <FileCode className="w-8 h-8" />
                        <p className="text-xs italic font-mono">{isZh ? '未提取到变量' : 'No variables extracted'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="lg:col-span-3 bg-card-bg border border-border-site rounded-[32px] p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2">
                      <FileCode className="w-4 h-4" /> {isZh ? '网页文字内容' : 'Webpage Text Content'}
                    </h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(assets.text);
                      }}
                      className="px-3 py-1.5 bg-secondary-site hover:bg-primary/10 text-primary rounded-lg text-[10px] font-black flex items-center gap-1.5 transition-all"
                    >
                      <Copy className="w-3 h-3" /> {isZh ? '复制文字' : 'Copy Text'}
                    </button>
                  </div>
                  <div className="p-6 bg-secondary-site/30 rounded-2xl">
                    <p className="text-sm text-text-site/70 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {assets.text || (isZh ? '未提取到文字内容' : 'No text content extracted')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};
