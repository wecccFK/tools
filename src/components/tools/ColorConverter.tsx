import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }
interface HSV { h: number; s: number; v: number; }

// ====== 颜色空间转换 ======
function hexToRgb(hex: string): RGB | null {
  const m = hex.replace('#', '').trim();
  const full = m.length === 3
    ? m.split('').map((c) => c + c).join('')
    : m;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
      case g1: h = (b1 - r1) / d + 2; break;
      case b1: h = (r1 - g1) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const h1 = (h % 360) / 360, s1 = s / 100, l1 = l / 100;
  if (s1 === 0) {
    const v = Math.round(l1 * 255);
    return { r: v, g: v, b: v };
  }
  const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1;
  const p = 2 * l1 - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(hue2rgb(p, q, h1 + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h1) * 255),
    b: Math.round(hue2rgb(p, q, h1 - 1 / 3) * 255),
  };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r1: h = ((g1 - b1) / d) % 6; break;
      case g1: h = (b1 - r1) / d + 2; break;
      case b1: h = (r1 - g1) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
}

export default function ColorConverter() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [hex, setHex] = useState('#D97706');
  const [rgb, setRgb] = useState<RGB>({ r: 217, g: 119, b: 6 });
  const [copied, setCopied] = useState<string | null>(null);

  // 由 RGB 更新 hex
  const updateFromRgb = useCallback((next: RGB) => {
    setRgb(next);
    setHex(rgbToHex(next));
  }, []);

  // 由 hex 输入更新 RGB（容错）
  const updateFromHex = (input: string) => {
    setHex(input);
    const parsed = hexToRgb(input);
    if (parsed) setRgb(parsed);
  };

  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cssRgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const cssHsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const inputStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  const formats: { key: string; label: string; value: string }[] = [
    { key: 'hex', label: 'HEX', value: hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: cssRgb },
    { key: 'hsl', label: 'HSL', value: cssHsl },
    { key: 'hsv', label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* 预览 + 取色器 */}
      <div className="flex items-center gap-3">
        <label
          className="relative w-16 h-16 rounded-xl cursor-pointer shrink-0"
          style={{ background: hex, border: '2px solid var(--border)' }}
        >
          <input
            type="color"
            value={hexToRgb(hex) ? hex : '#d97706'}
            onChange={(e) => updateFromHex(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        <div>
          <div className="text-xs font-medium" style={labelStyle}>
            {isZh ? '点击色块取色' : 'Click swatch to pick color'}
          </div>
          <div className="font-mono text-sm mt-1" style={{ color: 'var(--text)' }}>
            {hex.toUpperCase()}
          </div>
        </div>
      </div>

      {/* HEX 输入 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          HEX
        </label>
        <input
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          placeholder="#D97706"
          className="w-full rounded-lg p-3 font-mono text-sm outline-none"
          style={inputStyle}
        />
      </div>

      {/* RGB 滑块 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          RGB
        </label>
        <div className="flex flex-col gap-2">
          {(['r', 'g', 'b'] as const).map((ch) => (
            <div key={ch} className="flex items-center gap-3">
              <span className="w-4 text-xs font-mono uppercase" style={labelStyle}>{ch}</span>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => updateFromRgb({ ...rgb, [ch]: Number(e.target.value) })}
                className="flex-1"
                style={{ accentColor: ch === 'r' ? '#ef4444' : ch === 'g' ? '#22c55e' : '#3b82f6' }}
              />
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => updateFromRgb({ ...rgb, [ch]: Math.max(0, Math.min(255, Number(e.target.value) || 0)) })}
                className="w-16 rounded-lg p-1.5 text-sm font-mono outline-none"
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* HSL 滑块 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          HSL
        </label>
        <div className="flex flex-col gap-2">
          {([
            { key: 'h', max: 360, color: `hsl(${hsl.h}, 100%, 50%)` },
            { key: 's', max: 100, color: 'var(--accent)' },
            { key: 'l', max: 100, color: 'var(--text-muted)' },
          ] as const).map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <span className="w-4 text-xs font-mono" style={labelStyle}>{item.key}</span>
              <input
                type="range"
                min={0}
                max={item.max}
                value={hsl[item.key]}
                onChange={(e) => {
                  const next = { ...hsl, [item.key]: Number(e.target.value) };
                  updateFromRgb(hslToRgb(next));
                }}
                className="flex-1"
                style={{ accentColor: item.color }}
              />
              <input
                type="number"
                min={0}
                max={item.max}
                value={hsl[item.key]}
                onChange={(e) => {
                  const next = { ...hsl, [item.key]: Math.max(0, Math.min(item.max, Number(e.target.value) || 0)) };
                  updateFromRgb(hslToRgb(next));
                }}
                className="w-16 rounded-lg p-1.5 text-sm font-mono outline-none"
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 各格式输出 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '所有格式（点击复制）' : 'All formats (click to copy)'}
        </label>
        <div className="flex flex-col gap-2">
          {formats.map((f) => (
            <button
              key={f.key}
              onClick={() => copy(f.value, f.key)}
              className="flex items-center justify-between gap-2 rounded-lg p-3 text-left transition-colors hover:opacity-80"
              style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}
            >
              <span className="text-xs font-medium font-mono" style={labelStyle}>{f.label}</span>
              <span className="font-mono text-sm flex-1 truncate" style={{ color: 'var(--text)' }}>
                {f.value}
              </span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}>
                {copied === f.key ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {isZh
          ? '支持 HEX、RGB、HSL、HSV 互转，可拖动滑块或使用浏览器原生取色器调整。所有转换在浏览器本地完成。'
          : 'Convert between HEX, RGB, HSL, and HSV. Adjust via sliders or the native color picker. All conversions run locally.'}
      </p>
    </div>
  );
}
