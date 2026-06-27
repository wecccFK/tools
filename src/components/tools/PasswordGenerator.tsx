import { useState, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getStrength(len: number, pool: number): { score: number; label: string; color: string } {
  if (pool === 0) return { score: 0, label: '', color: '#dc2626' };
  const bits = len * Math.log2(pool);
  if (bits < 40) return { score: 1, label: 'weak', color: '#dc2626' };
  if (bits < 60) return { score: 2, label: 'fair', color: '#d97706' };
  if (bits < 80) return { score: 3, label: 'good', color: '#0ea5e9' };
  return { score: 4, label: 'strong', color: '#16a34a' };
}

export default function PasswordGenerator() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = '';
    if (useUpper) pool += UPPER;
    if (useLower) pool += LOWER;
    if (useDigits) pool += DIGITS;
    if (useSymbols) pool += SYMBOLS;
    if (excludeAmbiguous) {
      pool = pool.replace(/[O0lI1|`]/g, '');
    }
    if (!pool) {
      setPassword('');
      return;
    }
    // 使用 crypto.getRandomValues 安全随机
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool[arr[i] % pool.length];
    }
    setPassword(result);
    setCopied(false);
  }, [length, useUpper, useLower, useDigits, useSymbols, excludeAmbiguous]);

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const poolSize =
    (useUpper ? UPPER.length : 0) +
    (useLower ? LOWER.length : 0) +
    (useDigits ? DIGITS.length : 0) +
    (useSymbols ? SYMBOLS.length : 0);
  const strength = getStrength(length, poolSize);

  const labelStyle = { color: 'var(--text-muted)' };
  const labelZh: Record<string, string> = {
    weak: '弱', fair: '中', good: '良', strong: '强',
  };

  const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label
      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
      style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
        style={{ accentColor: 'var(--accent)' }}
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* 密码显示 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '生成的密码' : 'Generated Password'}
        </label>
        <div className="flex gap-2">
          <input
            readOnly
            value={password}
            placeholder={isZh ? '点击生成按钮...' : 'Click generate...'}
            className="flex-1 rounded-lg p-3 font-mono text-sm outline-none"
            style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
          <button
            onClick={copy}
            disabled={!password}
            className="px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
            style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            {copied ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
          </button>
        </div>
        {/* 强度指示 */}
        {password && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{ background: i <= strength.score ? strength.color : 'var(--border)' }}
                />
              ))}
            </div>
            <span className="text-xs font-medium" style={{ color: strength.color }}>
              {isZh ? labelZh[strength.label] : strength.label}
            </span>
          </div>
        )}
      </div>

      {/* 长度 */}
      <div>
        <label className="text-xs font-medium mb-1.5 flex justify-between" style={labelStyle}>
          <span>{isZh ? '密码长度' : 'Length'}</span>
          <span className="font-mono">{length}</span>
        </label>
        <input
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
      </div>

      {/* 字符类型 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '字符类型' : 'Character Types'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Checkbox checked={useUpper} onChange={setUseUpper} label={isZh ? '大写 A-Z' : 'Upper A-Z'} />
          <Checkbox checked={useLower} onChange={setUseLower} label={isZh ? '小写 a-z' : 'Lower a-z'} />
          <Checkbox checked={useDigits} onChange={setUseDigits} label={isZh ? '数字 0-9' : 'Digits 0-9'} />
          <Checkbox checked={useSymbols} onChange={setUseSymbols} label={isZh ? '符号 !@#' : 'Symbols !@#'} />
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            className="w-4 h-4"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="text-sm" style={labelStyle}>
            {isZh ? '排除易混淆字符 (O 0 l I 1)' : 'Exclude ambiguous (O 0 l I 1)'}
          </span>
        </label>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={generate}
        className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 self-start"
        style={{ background: 'var(--accent)', boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.25)' }}
      >
        {isZh ? '生成密码' : 'Generate Password'}
      </button>

      {/* 提示 */}
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {isZh
          ? '使用 crypto.getRandomValues 生成密码学安全随机数，所有操作在浏览器本地完成。'
          : 'Uses crypto.getRandomValues for cryptographically secure randomness. All processing happens locally in your browser.'}
      </p>
    </div>
  );
}
