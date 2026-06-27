import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../../i18n/LanguageContext';

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

export default function QrGenerator() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [text, setText] = useState('https://www.web-tools.top');
  const [fg, setFg] = useState('#1a1a1a');
  const [bg, setBg] = useState('#ffffff');
  const [level, setLevel] = useState<ErrorLevel>('M');
  const [size, setSize] = useState(320);
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 中心图标相关
  const [useLogo, setUseLogo] = useState(false);
  const [logoSrc, setLogoSrc] = useState('');
  const [logoRatio, setLogoRatio] = useState(0.15); // 相对二维码尺寸的比例（带 Logo 建议 ≤20%）
  // 记住关闭 Logo 前的容错等级，关闭时恢复
  const prevLevelRef = useRef<ErrorLevel>('M');
  const fileRef = useRef<HTMLInputElement>(null);

  // 启用/关闭 Logo 时自动切换容错等级
  const toggleLogo = (enabled: boolean) => {
    setUseLogo(enabled);
    if (enabled) {
      // 启用 Logo：自动切到 H 级（30% 纠错）保证可识别，但记住原值
      prevLevelRef.current = level;
      setLevel('H');
    } else {
      // 关闭 Logo：恢复原容错等级
      setLevel(prevLevelRef.current);
    }
  };

  // 生成二维码（含可选中心图标）
  useEffect(() => {
    if (!text.trim()) {
      setDataUrl('');
      setError('');
      return;
    }
    let cancelled = false;

    QRCode.toDataURL(text, {
      errorCorrectionLevel: level,
      width: size,
      margin: 2,
      color: { dark: fg, light: bg },
    })
      .then((qrUrl) => {
        if (cancelled) return;
        // 无 logo：直接用二维码
        if (!useLogo || !logoSrc) {
          setDataUrl(qrUrl);
          setError('');
          return;
        }
        // 有 logo：在 canvas 上合成
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setDataUrl(qrUrl);
          return;
        }
        const qrImg = new Image();
        qrImg.onload = () => {
          if (cancelled) return;
          // 关闭抗锯齿，保持 QR 模块边缘锐利（提升识别率）
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(qrImg, 0, 0, size, size);
          // 加载 logo
          const logoImg = new Image();
          logoImg.onload = () => {
            if (cancelled) return;
            // 保留 logo 原宽高比，按较长边适配到 logoBox
            const logoBox = Math.round(size * logoRatio);
            const ratio = logoImg.naturalWidth / logoImg.naturalHeight;
            let drawW: number, drawH: number;
            if (ratio >= 1) {
              // 宽图：宽=logoBox，高按比例
              drawW = logoBox;
              drawH = Math.round(logoBox / ratio);
            } else {
              // 高图：高=logoBox，宽按比例
              drawH = logoBox;
              drawW = Math.round(logoBox * ratio);
            }
            // 重新启用抗锯齿绘制 logo
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            // 白底 padding（覆盖 logo 实际尺寸 + padding）
            const pad = Math.round(Math.max(drawW, drawH) * 0.1);
            const bgW = drawW + pad * 2;
            const bgH = drawH + pad * 2;
            const bgX = (size - bgW) / 2;
            const bgY = (size - bgH) / 2;
            // 画白底（圆角更柔和，但方形识别更稳）
            ctx.fillStyle = bg;
            ctx.fillRect(bgX, bgY, bgW, bgH);
            // 画 logo，居中
            const x = (size - drawW) / 2;
            const y = (size - drawH) / 2;
            ctx.drawImage(logoImg, x, y, drawW, drawH);
            try {
              setDataUrl(canvas.toDataURL('image/png'));
              setError('');
            } catch (e) {
              setError(isZh ? 'Logo 合成失败' : 'Logo composition failed');
            }
          };
          logoImg.onerror = () => {
            if (cancelled) return;
            setError(isZh ? 'Logo 加载失败' : 'Logo load failed');
            setDataUrl(qrUrl);
          };
          logoImg.src = logoSrc;
        };
        qrImg.src = qrUrl;
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      });

    return () => {
      cancelled = true;
    };
  }, [text, fg, bg, level, size, useLogo, logoSrc, logoRatio, isZh]);

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(isZh ? '请选择图片文件' : 'Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoSrc(reader.result as string);
      setError('');
    };
    reader.onerror = () => setError(isZh ? '读取文件失败' : 'Failed to read file');
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoSrc('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qr-code.png';
    a.click();
  };

  const copy = async () => {
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(isZh ? '复制失败，请改用下载' : 'Copy failed, try download instead');
    }
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const inputBase = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  const levels: ErrorLevel[] = ['L', 'M', 'Q', 'H'];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-5">
        {/* 左：配置 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
              {isZh ? '内容（文本/链接）' : 'Content (text/URL)'}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isZh ? '输入要生成二维码的文本...' : 'Enter text to encode...'}
              className="w-full h-24 rounded-lg p-3 text-sm outline-none resize-y"
              style={inputBase}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
                {isZh ? '前景色' : 'Foreground'}
              </label>
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="w-full h-9 rounded-lg cursor-pointer"
                style={inputBase}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
                {isZh ? '背景色' : 'Background'}
              </label>
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-full h-9 rounded-lg cursor-pointer"
                style={inputBase}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
              {isZh ? '容错等级' : 'Error Correction'}
            </label>
            <div className="flex gap-1.5">
              {levels.map((lv) => {
                // 启用 Logo 时锁定 H 级（其他选项禁用，防止降低纠错能力导致扫不出）
                const lockedToH = useLogo && lv !== 'H';
                return (
                  <button
                    key={lv}
                    onClick={() => setLevel(lv)}
                    disabled={lockedToH}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={
                      level === lv
                        ? { background: 'var(--accent)', color: '#fff' }
                        : { background: 'var(--bg-3)', color: 'var(--text-muted)' }
                    }
                    title={lockedToH ? (isZh ? '启用 Logo 时强制使用 H 级' : 'Locked to H while Logo enabled') : ''}
                  >
                    {lv}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {isZh ? 'L=7% M=15% Q=25% H=30% 纠错能力' : 'L=7% M=15% Q=25% H=30% recovery'}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block flex justify-between" style={labelStyle}>
              <span>{isZh ? '尺寸' : 'Size'}</span>
              <span>{size}px</span>
            </label>
            <input
              type="range"
              min={128}
              max={512}
              step={32}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          {/* 中心图标开关 */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={useLogo}
                onChange={(e) => toggleLogo(e.target.checked)}
                className="w-4 h-4"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span className="text-sm font-medium">
                {isZh ? '中心图标（Logo）' : 'Center Logo'}
              </span>
            </label>

            {useLogo && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onLogoChange}
                    className="text-xs flex-1"
                    style={inputBase}
                  />
                  {logoSrc && (
                    <button
                      onClick={removeLogo}
                      className="px-2 py-1 rounded text-xs transition-colors shrink-0"
                      style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                    >
                      {isZh ? '移除' : 'Remove'}
                    </button>
                  )}
                </div>

                {/* Logo 预览 */}
                {logoSrc && (
                  <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                    <img src={logoSrc} alt="logo" className="w-10 h-10 object-contain rounded" style={{ background: '#fff' }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={labelStyle}>{isZh ? 'Logo 占比' : 'Logo Ratio'}</span>
                        <span className="font-mono">{Math.round(logoRatio * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.1}
                        max={0.3}
                        step={0.02}
                        value={logoRatio}
                        onChange={(e) => setLogoRatio(Number(e.target.value))}
                        className="w-full"
                        style={{ accentColor: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                )}

                {useLogo && !logoSrc && (
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {isZh ? '上传一张图片作为二维码中心图标' : 'Upload an image as the center logo'}
                  </p>
                )}
                {useLogo && logoSrc && (
                  <p className="text-[11px]" style={{ color: '#16a34a' }}>
                    {isZh
                      ? '已自动切换为 H 容错等级（30% 纠错），关闭 Logo 后恢复原等级'
                      : 'Auto-switched to H error correction (30% recovery). Disabling Logo restores previous level.'}
                  </p>
                )}
                {useLogo && logoSrc && logoRatio > 0.2 && (
                  <p className="text-[11px]" style={{ color: '#d97706' }}>
                    {isZh
                      ? 'Logo 占比偏大可能影响识别，建议 ≤ 20%'
                      : 'Logo ratio too high may affect scannability, recommend ≤ 20%'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右：预览 */}
        <div className="flex flex-col items-center justify-start gap-3">
          <div
            className="rounded-lg p-3 flex items-center justify-center"
            style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', minHeight: size }}
          >
            {dataUrl ? (
              <img src={dataUrl} alt="QR Code" style={{ width: size, height: size }} />
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {isZh ? '输入内容生成二维码' : 'Enter content to generate'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={download}
              disabled={!dataUrl}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent)' }}
            >
              {isZh ? '下载 PNG' : 'Download PNG'}
            </button>
            <button
              onClick={copy}
              disabled={!dataUrl}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
              style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
            >
              {copied ? (isZh ? '已复制' : 'Copied') : isZh ? '复制图片' : 'Copy Image'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
