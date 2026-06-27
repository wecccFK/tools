import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Format = 'image/jpeg' | 'image/webp';

interface ImgState {
  file: File;
  url: string;
  width: number;
  height: number;
  size: number;
}

interface Result {
  url: string;
  blob: Blob;
  width: number;
  height: number;
  size: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [img, setImg] = useState<ImgState | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<Format>('image/jpeg');
  const [result, setResult] = useState<Result | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(isZh ? '请选择图片文件' : 'Please select an image file');
      return;
    }
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      setImg({ file, url, width: im.naturalWidth, height: im.naturalHeight, size: file.size });
      setResult(null);
      setError('');
    };
    im.onerror = () => setError(isZh ? '图片加载失败' : 'Failed to load image');
    im.src = url;
  }, [isZh]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const compress = useCallback(() => {
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError(isZh ? 'Canvas 不支持' : 'Canvas not supported');
      return;
    }
    const im = new Image();
    im.onload = () => {
      ctx.drawImage(im, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError(isZh ? '压缩失败' : 'Compression failed');
            return;
          }
          const url = URL.createObjectURL(blob);
          setResult({ url, blob, width: img.width, height: img.height, size: blob.size });
          setError('');
        },
        format,
        quality
      );
    };
    im.src = img.url;
  }, [img, quality, format]);

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    const ext = format === 'image/jpeg' ? 'jpg' : 'webp';
    a.download = `compressed.${ext}`;
    a.click();
  };

  const reset = () => {
    if (img) URL.revokeObjectURL(img.url);
    if (result) URL.revokeObjectURL(result.url);
    setImg(null);
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const cardStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  const savedPct = img && result ? Math.max(0, Math.round((1 - result.size / img.size) * 100)) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* 上传区 */}
      {!img && (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="rounded-2xl p-10 text-center cursor-pointer transition-all"
          style={{
            background: 'var(--bg-3)',
            border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div className="flex flex-col items-center gap-3" style={{ color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <p className="text-sm font-medium">
              {isZh ? '点击或拖拽图片到此处' : 'Click or drag an image here'}
            </p>
            <p className="text-xs">JPG / PNG / WebP</p>
          </div>
        </label>
      )}

      {error && (
        <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}>
          {error}
        </div>
      )}

      {img && (
        <div className="flex flex-col gap-4">
          {/* 配置 */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium mb-1.5 flex justify-between" style={labelStyle}>
                <span>{isZh ? '质量' : 'Quality'}</span>
                <span className="font-mono">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
                {isZh ? '格式' : 'Format'}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="px-3 py-1.5 rounded-lg text-sm outline-none"
                style={cardStyle}
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            <button
              onClick={compress}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 self-end"
              style={{ background: 'var(--accent)', boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.25)' }}
            >
              {isZh ? '压缩' : 'Compress'}
            </button>
          </div>

          {/* 预览对比 */}
          <div className="grid grid-cols-2 gap-3">
            {/* 原图 */}
            <div className="rounded-lg p-3" style={cardStyle}>
              <div className="text-xs font-medium mb-2" style={labelStyle}>
                {isZh ? '原图' : 'Original'}
              </div>
              <div className="aspect-video rounded overflow-hidden flex items-center justify-center mb-2" style={{ background: 'var(--bg-2)' }}>
                <img src={img.url} alt="original" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="text-xs space-y-0.5" style={labelStyle}>
                <div>{img.width} × {img.height}</div>
                <div className="font-mono">{formatSize(img.size)}</div>
              </div>
            </div>
            {/* 结果 */}
            <div className="rounded-lg p-3" style={cardStyle}>
              <div className="text-xs font-medium mb-2 flex justify-between" style={labelStyle}>
                <span>{isZh ? '压缩后' : 'Compressed'}</span>
                {result && savedPct > 0 && (
                  <span style={{ color: '#16a34a' }}>-{savedPct}%</span>
                )}
              </div>
              <div className="aspect-video rounded overflow-hidden flex items-center justify-center mb-2" style={{ background: 'var(--bg-2)' }}>
                {result ? (
                  <img src={result.url} alt="compressed" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {isZh ? '点击压缩' : 'Click compress'}
                  </span>
                )}
              </div>
              <div className="text-xs space-y-0.5" style={labelStyle}>
                {result ? (
                  <>
                    <div>{result.width} × {result.height}</div>
                    <div className="font-mono">{formatSize(result.size)}</div>
                  </>
                ) : (
                  <div>&nbsp;</div>
                )}
              </div>
            </div>
          </div>

          {/* 操作 */}
          <div className="flex gap-2">
            <button
              onClick={download}
              disabled={!result}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent)' }}
            >
              {isZh ? '下载' : 'Download'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
            >
              {isZh ? '重新选择' : 'Reset'}
            </button>
          </div>
        </div>
      )}

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {isZh
          ? '使用 Canvas API 在浏览器本地压缩，图片不会上传到服务器。JPEG 为有损压缩，适合照片；WebP 体积更小且支持透明。'
          : 'Compressed locally with Canvas API, images never leave your browser. JPEG is lossy (good for photos); WebP is smaller and supports transparency.'}
      </p>
    </div>
  );
}
