import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Unit = 's' | 'ms';

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function formatLocal(d: Date): string {
  // YYYY-MM-DDTHH:mm:ss 本地时间
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function toLocalInputValue(d: Date): string {
  // <input type="datetime-local"> 需要的格式 YYYY-MM-DDTHH:mm:ss
  return formatLocal(d);
}

export default function TimestampConverter() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [ts, setTs] = useState('');
  const [unit, setUnit] = useState<Unit>('s');
  const [dateStr, setDateStr] = useState('');
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [error, setError] = useState('');

  // 时间戳 → 可读
  const tsResult = (() => {
    if (!ts.trim()) return null;
    const n = Number(ts);
    if (Number.isNaN(n)) return { error: isZh ? '无效数字' : 'Invalid number' };
    const ms = unit === 's' ? n * 1000 : n;
    if (ms < -8.64e15 || ms > 8.64e15) return { error: isZh ? '超出范围' : 'Out of range' };
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return { error: isZh ? '无效日期' : 'Invalid date' };
    return {
      local: d.toLocaleString(),
      utc: d.toUTCString(),
      iso: d.toISOString(),
      relative: relativeTime(d, isZh),
    };
  })();

  // 日期 → 时间戳
  const dateResult = (() => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return { error: isZh ? '无效日期' : 'Invalid date' };
    const ms = d.getTime();
    return {
      s: Math.floor(ms / 1000),
      ms,
    };
  })();

  // 当前时间实时刷新
  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const setNowTs = () => {
    setTs(String(now));
    setUnit('s');
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const cardStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };
  const Row = ({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {}
    };
    return (
      <div className="flex items-center gap-2 py-1.5">
        <span className="text-xs w-20 shrink-0" style={labelStyle}>{label}</span>
        <code className={`flex-1 text-sm ${mono ? 'font-mono' : ''} break-all`}>{value}</code>
        <button
          onClick={copy}
          className="px-2 py-1 rounded text-xs transition-colors shrink-0"
          style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}
        >
          {copied ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 当前时间 */}
      <div
        className="rounded-lg p-3 flex items-center justify-between"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
      >
        <div>
          <div className="text-xs" style={labelStyle}>{isZh ? '当前 Unix 时间戳' : 'Current Unix Timestamp'}</div>
          <code className="text-lg font-mono font-semibold" style={{ color: 'var(--accent)' }}>{now}</code>
        </div>
        <button
          onClick={setNowTs}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {isZh ? '填入' : 'Use'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* 时间戳 → 日期 */}
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {isZh ? '时间戳 → 可读时间' : 'Timestamp → Readable'}
          </label>
          <div className="flex gap-2">
            <input
              value={ts}
              onChange={(e) => { setTs(e.target.value); setError(''); }}
              placeholder={isZh ? '输入时间戳...' : 'Enter timestamp...'}
              className="flex-1 rounded-lg p-3 font-mono text-sm outline-none"
              style={cardStyle}
            />
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <button
                onClick={() => setUnit('s')}
                className="px-3 text-xs font-medium transition-colors"
                style={unit === 's' ? { background: 'var(--accent)', color: '#fff' } : { background: 'var(--bg-3)', color: 'var(--text-muted)' }}
              >
                s
              </button>
              <button
                onClick={() => setUnit('ms')}
                className="px-3 text-xs font-medium transition-colors"
                style={unit === 'ms' ? { background: 'var(--accent)', color: '#fff' } : { background: 'var(--bg-3)', color: 'var(--text-muted)' }}
              >
                ms
              </button>
            </div>
          </div>
          {tsResult && 'error' in tsResult && tsResult.error && (
            <p className="text-xs mt-2" style={{ color: '#dc2626' }}>{tsResult.error}</p>
          )}
          {tsResult && !('error' in tsResult) && (
            <div className="mt-2 rounded-lg p-2" style={cardStyle}>
              <Row label={isZh ? '本地' : 'Local'} value={tsResult.local} />
              <Row label="UTC" value={tsResult.utc} />
              <Row label="ISO" value={tsResult.iso} />
              <Row label={isZh ? '相对' : 'Relative'} value={tsResult.relative} mono={false} />
            </div>
          )}
        </div>

        {/* 日期 → 时间戳 */}
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
            {isZh ? '日期 → 时间戳' : 'Date → Timestamp'}
          </label>
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            step="1"
            className="w-full rounded-lg p-3 text-sm outline-none"
            style={cardStyle}
          />
          {dateResult && 'error' in dateResult && dateResult.error && (
            <p className="text-xs mt-2" style={{ color: '#dc2626' }}>{dateResult.error}</p>
          )}
          {dateResult && !('error' in dateResult) && (
            <div className="mt-2 rounded-lg p-2" style={cardStyle}>
              <Row label={isZh ? '秒' : 'Seconds'} value={String(dateResult.s)} />
              <Row label={isZh ? '毫秒' : 'Millis'} value={String(dateResult.ms)} />
            </div>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {isZh
          ? 'Unix 时间戳是从 1970-01-01 00:00:00 UTC 起经过的秒数。常用秒级，JavaScript 内部使用毫秒级。'
          : 'Unix timestamp is seconds elapsed since 1970-01-01 00:00:00 UTC. Commonly in seconds; JavaScript uses milliseconds internally.'}
      </p>
    </div>
  );
}

function relativeTime(d: Date, isZh: boolean): string {
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);
  let str: string;
  if (mins < 1) str = isZh ? '刚刚' : 'just now';
  else if (mins < 60) str = isZh ? `${mins} 分钟` : `${mins} minutes`;
  else if (hours < 24) str = isZh ? `${hours} 小时` : `${hours} hours`;
  else str = isZh ? `${days} 天` : `${days} days`;
  if (mins >= 1) str += future ? (isZh ? '后' : ' later') : (isZh ? '前' : ' ago');
  return str;
}
