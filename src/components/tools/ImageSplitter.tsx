import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import JSZip from 'jszip';

type GridPreset = {
  id: string;
  label: { zh: string; en: string };
  rows: number;
  cols: number;
};

const PRESETS: GridPreset[] = [
  { id: '1x1', label: { zh: '1×1', en: '1×1' }, rows: 1, cols: 1 },
  { id: '2x2', label: { zh: '2×2 (4宫格)', en: '2×2 (4 grid)' }, rows: 2, cols: 2 },
  { id: '3x3', label: { zh: '3×3 (9宫格)', en: '3×3 (9 grid)' }, rows: 3, cols: 3 },
  { id: '1x3', label: { zh: '1×3 (Instagram 三联)', en: '1×3 (Instagram triptych)' }, rows: 1, cols: 3 },
  { id: '3x1', label: { zh: '3×1', en: '3×1' }, rows: 3, cols: 1 },
  { id: '2x3', label: { zh: '2×3', en: '2×3' }, rows: 2, cols: 3 },
  { id: '3x2', label: { zh: '3×2', en: '3×2' }, rows: 3, cols: 2 },
];

export default function ImageSplitter() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [preset, setPreset] = useState<GridPreset>(PRESETS[2]); // 默认 3x3
  const [slices, setSlices] = useState<string[]>([]); // dataURL 数组
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageName(file.name.replace(/\.[^.]+$/, ''));
        setSlices([]);
        setZipUrl(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const split = useCallback(() => {
    if (!image) return;
    const { rows, cols } = preset;
    const sliceW = Math.floor(image.width / cols);
    const sliceH = Math.floor(image.height / rows);
    const results: string[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const canvas = document.createElement('canvas');
        canvas.width = sliceW;
        canvas.height = sliceH;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.drawImage(
          image,
          c * sliceW, r * sliceH, sliceW, sliceH,
          0, 0, sliceW, sliceH
        );
        results.push(canvas.toDataURL('image/png'));
      }
    }
    setSlices(results);
    setZipUrl(null);
  }, [image, preset]);

  const downloadOne = (dataUrl: string, idx: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${imageName}_${preset.id}_${idx + 1}.png`;
    a.click();
  };

  const downloadZip = async () => {
    if (slices.length === 0) return;
    const zip = new JSZip();
    slices.forEach((dataUrl, i) => {
      const base64 = dataUrl.split(',')[1];
      zip.file(`${imageName}_${preset.id}_${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    setZipUrl(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${imageName}_split_${preset.id}.zip`;
    a.click();
  };

  const reset = () => {
    setImage(null);
    setImageName('');
    setSlices([]);
    setZipUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const labelStyle = { color: 'var(--text-muted)' } as const;

  return (
    <div className="flex flex-col gap-5">
      {/* 上传区 */}
      {!image && (
        <label
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          className="block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors hover:opacity-80"
          style={{ borderColor: 'var(--border)' }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <svg className="w-10 h-10" style={labelStyle} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium">
              {isZh ? '点击或拖拽图片到此处' : 'Click or drag an image here'}
            </p>
            <p className="text-xs" style={labelStyle}>
              {isZh ? '支持 JPG / PNG / WebP / GIF' : 'Supports JPG / PNG / WebP / GIF'}
            </p>
          </div>
        </label>
      )}

      {/* 预览 + 设置 */}
      {image && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span style={labelStyle}>{isZh ? '原图:' : 'Source:'} </span>
              <span className="font-mono">{image.width} × {image.height}px</span>
            </div>
            <button
              onClick={reset}
              className="text-xs px-3 py-1 rounded-md transition-colors"
              style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
            >
              {isZh ? '更换图片' : 'Change'}
            </button>
          </div>

          {/* 预设网格 */}
          <div>
            <div className="text-xs mb-2" style={labelStyle}>{isZh ? '选择切割方式:' : 'Choose split grid:'}</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setPreset(p); setSlices([]); setZipUrl(null); }}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 animate-bounce-in"
                  style={{
                    background: preset.id === p.id ? 'var(--accent)' : 'var(--bg-2)',
                    color: preset.id === p.id ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${preset.id === p.id ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {p.label[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={split}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              {isZh ? '开始切割' : 'Split'}
            </button>
            {slices.length > 0 && (
              <button
                onClick={downloadZip}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'var(--bg-3)', color: 'var(--text)' }}
              >
                {isZh ? `下载全部 ZIP (${slices.length} 张)` : `Download All ZIP (${slices.length})`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 切片预览 */}
      {slices.length > 0 && (
        <div>
          <div className="text-xs mb-2" style={labelStyle}>
            {isZh ? `预览 (${preset.rows} 行 × ${preset.cols} 列 = ${slices.length} 张):` : `Preview (${preset.rows} rows × ${preset.cols} cols = ${slices.length} slices):`}
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${preset.cols}, 1fr)`,
              maxWidth: `${preset.cols * 120}px`,
            }}
          >
            {slices.map((d, i) => (
              <div
                key={i}
                className="relative group rounded overflow-hidden cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{ border: '1px solid var(--border)' }}
                onClick={() => downloadOne(d, i)}
                role="button"
                tabIndex={0}
              >
                <img src={d} alt={`slice ${i + 1}`} className="block w-full h-auto" />
                <div className="absolute bottom-0 left-0 right-0 text-[10px] text-white px-1 py-0.5 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isZh ? '点击下载' : 'Click to download'} #{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
