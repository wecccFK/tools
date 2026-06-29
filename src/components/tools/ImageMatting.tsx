import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type ModelQuality = 'fast' | 'standard';
type OutputFormat = 'png' | 'webp';
// 库的 output.format 需要完整 MIME 类型
const OUTPUT_MIME: Record<OutputFormat, string> = {
  png: 'image/png',
  webp: 'image/webp',
};
type ProgressPhase = 'idle' | 'loading-model' | 'processing' | 'done' | 'error';

interface BatchItem {
  id: string;
  name: string;
  originalUrl: string;
  resultUrl: string | null;
  originalSize: number;
  resultSize: number | null;
  phase: ProgressPhase;
  progress: number; // 0-1
  error: string;
}

// 懒加载 @imgly/background-removal 的 loader
// 库本身从 jsdelivr CDN 加载,模型从 unpkg CDN 加载并缓存到 IndexedDB
// 不打包进构建产物,不占用服务器空间
let bgRemovalModulePromise: Promise<any> | null = null;
async function loadBgRemoval() {
  if (!bgRemovalModulePromise) {
    bgRemovalModulePromise = import(
      /* @vite-ignore */
      'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm'
    ).catch(err => {
      bgRemovalModulePromise = null; // 失败后允许重试
      throw err;
    });
  }
  return bgRemovalModulePromise;
}

export default function ImageMatting() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [model, setModel] = useState<ModelQuality>('standard');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [phase, setPhase] = useState<ProgressPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);

  // 批量处理
  const [batchQueue, setBatchQueue] = useState<BatchItem[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const batchInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    batchQueue.forEach(item => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const processSingle = async (file: File): Promise<Blob> => {
    const mod = await loadBgRemoval();
    const config: any = {
      model: model === 'fast' ? 'isnet_fp16' : 'isnet_quint8',
      output: { format: OUTPUT_MIME[outputFormat], quality: 0.8 },
      progress: (key: string, current: number, total: number) => {
        const pct = total > 0 ? current / total : 0;
        setProgress(pct);
        // key 形如 'fetch:/path/to/model.onnx' 或 'compute:inference'
        if (key.startsWith('fetch:')) {
          setProgressLabel(isZh ? '加载 AI 模型(首次约 80MB,已缓存则秒载)...' : 'Loading AI model (~80MB first time, cached after)...');
        } else if (key.startsWith('compute:')) {
          setProgressLabel(isZh ? 'AI 推理中...' : 'AI inference...');
        } else {
          setProgressLabel(key);
        }
      },
    };
    return await mod.removeBackground(file, config);
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(isZh ? '请选择图片文件' : 'Please select an image file');
      return;
    }
    setError('');
    setResultUrl(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalUrl(URL.createObjectURL(file));
    setOriginalSize(file.size);
    setPhase('loading-model');
    setProgress(0);
    setProgressLabel(isZh ? '准备中...' : 'Preparing...');

    try {
      setPhase('processing');
      const blob = await processSingle(file);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      setPhase('done');
      setProgress(1);
      setProgressLabel(isZh ? '完成' : 'Done');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || String(e));
      setPhase('error');
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const base = (fileInputRef.current?.files?.[0]?.name || 'image').replace(/\.[^.]+$/, '');
    a.download = `${base}-nobg.${outputFormat}`;
    a.click();
  };

  // 批量处理
  const handleBatchFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (arr.length === 0) {
      setError(isZh ? '未发现图片文件' : 'No image files found');
      return;
    }
    // 清理旧批次
    batchQueue.forEach(item => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });

    const items: BatchItem[] = arr.map((file, idx) => ({
      id: `batch-${Date.now()}-${idx}`,
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
      originalSize: file.size,
      resultSize: null,
      phase: 'idle',
      progress: 0,
      error: '',
    }));
    setBatchQueue(items);
    setIsBatchProcessing(true);
    setError('');

    // 预加载模型(确保首次下载在批量前完成)
    try {
      setPhase('loading-model');
      await loadBgRemoval();
      setPhase('processing');
    } catch (e: any) {
      setError(e?.message || String(e));
      setPhase('error');
      setIsBatchProcessing(false);
      return;
    }

    // 顺序处理(并发 ONNX 推理会爆内存)
    for (let i = 0; i < items.length; i++) {
      const file = arr[i];
      // 更新当前项为 processing
      setBatchQueue(prev => prev.map((it, idx) => idx === i ? { ...it, phase: 'processing', progress: 0 } : it));

      try {
        const blob = await processSingle(file);
        const url = URL.createObjectURL(blob);
        setBatchQueue(prev => prev.map((it, idx) => idx === i ? {
          ...it,
          phase: 'done',
          progress: 1,
          resultUrl: url,
          resultSize: blob.size,
        } : it));
      } catch (e: any) {
        setBatchQueue(prev => prev.map((it, idx) => idx === i ? {
          ...it,
          phase: 'error',
          error: e?.message || String(e),
        } : it));
      }
    }

    setIsBatchProcessing(false);
    setPhase('done');
    setProgressLabel(isZh ? `批量完成 ${items.length} 张` : `Batch done: ${items.length} images`);
  };

  const downloadAll = async () => {
    const done = batchQueue.filter(it => it.resultUrl);
    if (done.length === 0) return;

    // 单张直接下载,多张打包 ZIP
    if (done.length === 1) {
      const a = document.createElement('a');
      a.href = done[0].resultUrl!;
      a.download = done[0].name.replace(/\.[^.]+$/, '') + `-nobg.${outputFormat}`;
      a.click();
      return;
    }

    // 动态加载 JSZip 打包
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (const item of done) {
        const res = await fetch(item.resultUrl!);
        const buf = await res.arrayBuffer();
        const base = item.name.replace(/\.[^.]+$/, '');
        zip.file(`${base}-nobg.${outputFormat}`, buf);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `momo-matting-batch-${Date.now()}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      // 降级:逐张下载
      done.forEach(item => {
        const a = document.createElement('a');
        a.href = item.resultUrl!;
        a.download = item.name.replace(/\.[^.]+$/, '') + `-nobg.${outputFormat}`;
        a.click();
      });
    }
  };

  const clearBatch = () => {
    batchQueue.forEach(item => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setBatchQueue([]);
    setPhase('idle');
    setProgress(0);
    setProgressLabel('');
  };

  // 拖拽
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files.length === 1) {
        handleFile(files[0]);
      } else {
        handleBatchFiles(files);
      }
    }
  }, [model, outputFormat]);

  const labelStyle = { color: 'var(--text-muted)' } as const;
  const cardStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  } as const;
  const accentBtn = {
    background: 'var(--accent)',
    color: '#fff',
  } as const;

  const batchDoneCount = batchQueue.filter(it => it.phase === 'done').length;
  const batchErrorCount = batchQueue.filter(it => it.phase === 'error').length;

  return (
    <div className="flex flex-col gap-4">
      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg p-3 text-sm" style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* 设置面板 */}
      <div className="flex flex-col gap-3">
        {/* 模型选择 */}
        <div>
          <label className="text-xs font-medium mb-2 block" style={labelStyle}>
            {isZh ? 'AI 模型' : 'AI Model'}
          </label>
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'fast' as ModelQuality, label: isZh ? '快速(isnet_fp16)' : 'Fast (isnet_fp16)', desc: isZh ? '~40MB · 速度优先' : '~40MB · Speed-first' },
              { id: 'standard' as ModelQuality, label: isZh ? '标准(isnet_quint8)' : 'Standard (isnet_quint8)', desc: isZh ? '~80MB · 精度优先(推荐)' : '~80MB · Quality-first (recommended)' },
            ]).map(m => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                disabled={isBatchProcessing || phase === 'processing' || phase === 'loading-model'}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 animate-bounce-in disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: model === m.id ? 'var(--accent)' : 'var(--bg-2)',
                  color: model === m.id ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${model === m.id ? 'var(--accent)' : 'var(--border)'}`,
                }}
                title={m.desc}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] mt-1" style={labelStyle}>
            {isZh
              ? '🔒 AI 模型从 CDN(unpkg)加载,首次约 40-80MB,缓存到浏览器 IndexedDB 后离线可用。模型与图片都不上传服务器。'
              : '🔒 AI model loaded from CDN (unpkg), ~40-80MB first time, cached in IndexedDB for offline use. Neither model nor images touch the server.'}
          </p>
        </div>

        {/* 输出格式 */}
        <div>
          <label className="text-xs font-medium mb-2 block" style={labelStyle}>
            {isZh ? '输出格式' : 'Output Format'}
          </label>
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'png' as OutputFormat, label: isZh ? 'PNG(无损,透明)' : 'PNG (lossless, transparent)' },
              { id: 'webp' as OutputFormat, label: isZh ? 'WebP(体积小,透明)' : 'WebP (smaller, transparent)' },
            ]).map(f => (
              <button
                key={f.id}
                onClick={() => setOutputFormat(f.id)}
                disabled={isBatchProcessing || phase === 'processing' || phase === 'loading-model'}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: outputFormat === f.id ? 'var(--accent)' : 'var(--bg-2)',
                  color: outputFormat === f.id ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${outputFormat === f.id ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 拖拽上传区 */}
      <div
        ref={dragRef}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className="rounded-xl p-6 text-center cursor-pointer transition-all"
        style={{
          background: isDragging ? 'var(--accent)10' : 'var(--bg-2)',
          border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
        <div className="text-3xl mb-2">🖼️</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          {isZh ? '点击或拖拽图片到这里(单张)' : 'Click or drop an image here (single)'}
        </div>
        <div className="text-[10px] mt-1" style={labelStyle}>
          {isZh ? '支持 JPG / PNG / WebP / BMP' : 'Supports JPG / PNG / WebP / BMP'}
        </div>
      </div>

      {/* 批量上传按钮 */}
      <div className="flex gap-2 flex-wrap">
        <input
          ref={batchInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
              handleBatchFiles(e.target.files);
            }
            e.target.value = '';
          }}
        />
        <button
          onClick={() => batchInputRef.current?.click()}
          disabled={isBatchProcessing || phase === 'processing' || phase === 'loading-model'}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          style={{ background: 'var(--bg-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          {isZh ? '批量处理(多张)' : 'Batch (multiple)'}
        </button>
        {batchQueue.length > 0 && (
          <>
            <button
              onClick={downloadAll}
              disabled={batchDoneCount === 0 || isBatchProcessing}
              className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              style={accentBtn}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {isZh
                ? batchDoneCount > 1 ? `下载 ZIP(${batchDoneCount}/${batchQueue.length})` : `下载(${batchDoneCount}/${batchQueue.length})`
                : batchDoneCount > 1 ? `Download ZIP (${batchDoneCount}/${batchQueue.length})` : `Download (${batchDoneCount}/${batchQueue.length})`}
            </button>
            <button
              onClick={clearBatch}
              disabled={isBatchProcessing}
              className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
              style={{ background: 'var(--bg-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {isZh ? '清空' : 'Clear'}
            </button>
          </>
        )}
      </div>

      {/* 进度条 */}
      {(phase === 'loading-model' || phase === 'processing') && (
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {progressLabel || (isZh ? '处理中...' : 'Processing...')}
            </span>
            <span className="text-xs font-mono" style={labelStyle}>
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-3)' }}>
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>
      )}

      {/* 单图结果对比 */}
      {phase === 'done' && resultUrl && (
        <div className="grid grid-cols-2 gap-3 animate-bounce-in">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <div className="px-3 py-2 text-xs font-medium flex items-center justify-between" style={labelStyle}>
              <span>{isZh ? '原图' : 'Original'}</span>
              <span className="font-mono">{formatSize(originalSize)}</span>
            </div>
            <div className="relative" style={{
              backgroundImage: 'linear-gradient(45deg, #99999920 25%, transparent 25%), linear-gradient(-45deg, #99999920 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #99999920 75%), linear-gradient(-45deg, transparent 75%, #99999920 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
            }}>
              {originalUrl && <img src={originalUrl} alt="original" className="w-full h-auto max-h-80 object-contain" />}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <div className="px-3 py-2 text-xs font-medium flex items-center justify-between" style={labelStyle}>
              <span>{isZh ? '抠图结果' : 'Result'}</span>
              <span className="font-mono" style={{ color: 'var(--accent)' }}>{formatSize(resultSize)}</span>
            </div>
            <div className="relative" style={{
              backgroundImage: 'linear-gradient(45deg, #99999920 25%, transparent 25%), linear-gradient(-45deg, #99999920 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #99999920 75%), linear-gradient(-45deg, transparent 75%, #99999920 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
            }}>
              <img src={resultUrl} alt="result" className="w-full h-auto max-h-80 object-contain" />
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && resultUrl && (
        <button
          onClick={handleDownload}
          className="px-5 py-2 rounded-lg text-sm font-medium self-start flex items-center gap-1.5 transition-opacity hover:opacity-90"
          style={accentBtn}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {isZh ? `下载 .${outputFormat}` : `Download .${outputFormat}`}
        </button>
      )}

      {/* 批量结果列表 */}
      {batchQueue.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs" style={labelStyle}>
            <span>
              {isZh
                ? `批量进度: ${batchDoneCount} 成功${batchErrorCount > 0 ? ` / ${batchErrorCount} 失败` : ''} / 共 ${batchQueue.length} 张`
                : `Batch: ${batchDoneCount} done${batchErrorCount > 0 ? ` / ${batchErrorCount} failed` : ''} / ${batchQueue.length} total`}
            </span>
            {isBatchProcessing && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
                {isZh ? '处理中' : 'Processing'}
              </span>
            )}
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {batchQueue.map(item => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{
                  background: 'var(--bg-2)',
                  border: `1px solid ${item.phase === 'error' ? '#ef4444' : item.phase === 'done' ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                <div className="relative" style={{
                  backgroundImage: 'linear-gradient(45deg, #99999920 25%, transparent 25%), linear-gradient(-45deg, #99999920 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #99999920 75%), linear-gradient(-45deg, transparent 75%, #99999920 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                  minHeight: '120px',
                }}>
                  {item.phase === 'done' && item.resultUrl ? (
                    <img src={item.resultUrl} alt={item.name} className="w-full h-32 object-contain" />
                  ) : item.originalUrl ? (
                    <img src={item.originalUrl} alt={item.name} className="w-full h-32 object-contain opacity-50" />
                  ) : null}
                  {item.phase === 'processing' && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {item.phase === 'done' && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                  {item.phase === 'error' && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#ef4444' }}>
                      <span className="text-white text-[10px] font-bold">!</span>
                    </div>
                  )}
                </div>
                <div className="px-2 py-1.5">
                  <div className="text-[10px] font-mono truncate" style={{ color: 'var(--text)' }} title={item.name}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-[9px]" style={labelStyle}>
                    <span>{formatSize(item.originalSize)}</span>
                    {item.resultSize !== null && (
                      <span style={{ color: 'var(--accent)' }}>{formatSize(item.resultSize)}</span>
                    )}
                  </div>
                  {item.error && (
                    <div className="text-[9px] mt-0.5 truncate" style={{ color: '#ef4444' }} title={item.error}>
                      {item.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="rounded-xl p-4 text-xs" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
        <div className="font-medium mb-2" style={{ color: 'var(--text)' }}>
          {isZh ? '使用说明' : 'Usage Notes'}
        </div>
        <ul className="flex flex-col gap-1" style={labelStyle}>
          <li>{isZh ? '🤖 基于 ISNet 神经网络,人像/商品/动物抠图效果最佳' : '🤖 Powered by ISNet neural network; best for people, products, animals'}</li>
          <li>{isZh ? '💾 首次使用需下载模型(快速 ~40MB / 标准 ~80MB),后续从浏览器缓存秒载' : '💾 First use downloads model (Fast ~40MB / Standard ~80MB); cached for instant reuse'}</li>
          <li>{isZh ? '⚡ 快速模型适合预览,标准模型适合最终输出' : '⚡ Fast model for previews; Standard for final output'}</li>
          <li>{isZh ? '🔒 图片完全在浏览器本地处理,不上传任何数据到服务器' : '🔒 Images processed entirely in browser; no data uploaded'}</li>
          <li>{isZh ? '📦 批量结果可一键打包 ZIP 下载' : '📦 Batch results can be downloaded as ZIP'}</li>
          <li>{isZh ? '🖥️ 推荐 Chrome 90+ / Edge 90+ / Firefox 88+(需支持 WebAssembly SIMD)' : '🖥️ Requires Chrome 90+ / Edge 90+ / Firefox 88+ (WebAssembly SIMD)'}</li>
        </ul>
      </div>
    </div>
  );
}
