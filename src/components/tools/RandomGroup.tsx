import { useState, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Mode = 'byCount' | 'bySize';

interface Group {
  index: number;
  members: string[];
}

// Fisher-Yates 洗牌
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    // 使用 crypto.getRandomValues 提供密码学安全的随机性(更公平)
    let rand: number;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      rand = buf[0] / 0x100000000;
    } else {
      rand = Math.random();
    }
    const j = Math.floor(rand * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 分组算法:byCount(分成 N 组)/ bySize(每组 N 人)
function distribute(items: string[], mode: Mode, n: number): Group[] {
  if (items.length === 0 || n <= 0) return [];
  const shuffled = shuffle(items);

  if (mode === 'byCount') {
    // 分成 n 组,余数从前往后分配
    const total = items.length;
    const groups: Group[] = Array.from({ length: n }, (_, i) => ({
      index: i,
      members: [] as string[],
    }));
    const base = Math.floor(total / n);
    const extra = total % n;
    let cursor = 0;
    for (let i = 0; i < n; i++) {
      const size = base + (i < extra ? 1 : 0);
      groups[i].members = shuffled.slice(cursor, cursor + size);
      cursor += size;
    }
    return groups;
  }

  // bySize:每组 n 人,余数组成最后一组
  const groupCount = Math.ceil(items.length / n);
  const groups: Group[] = Array.from({ length: groupCount }, (_, i) => ({
    index: i,
    members: [] as string[],
  }));
  for (let i = 0; i < items.length; i++) {
    groups[Math.floor(i / n)].members.push(shuffled[i]);
  }
  return groups;
}

// 9 种柔和的颜色,用于分组标识
const GROUP_COLORS = [
  '#d97706', '#16a34a', '#3b82f6', '#a855f7', '#ec4899',
  '#14b8a6', '#f59e0b', '#6366f1', '#10b981', '#ef4444',
];

export default function RandomGroup() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('byCount');
  const [groupCount, setGroupCount] = useState(4);
  const [groupSize, setGroupSize] = useState(5);
  const [groups, setGroups] = useState<Group[]>([]);
  const [seed, setSeed] = useState(0); // 用于强制重新渲染

  const handleShuffle = useCallback(() => {
    const items = input
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    if (items.length === 0) {
      setGroups([]);
      return;
    }
    const n = mode === 'byCount' ? groupCount : groupSize;
    const result = distribute(items, mode, n);
    setGroups(result);
    setSeed(s => s + 1);
  }, [input, mode, groupCount, groupSize]);

  const handleCopy = async () => {
    if (groups.length === 0) return;
    const text = groups.map(g => {
      const header = isZh ? `第 ${g.index + 1} 组 (${g.members.length} 人)` : `Group ${g.index + 1} (${g.members.length})`;
      return `${header}\n${g.members.join('\n')}`;
    }).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const handleClear = () => {
    setInput('');
    setGroups([]);
  };

  // 解析当前输入项数
  const itemCount = input.split('\n').map(s => s.trim()).filter(Boolean).length;

  // 预估分组分布
  const previewStats = (() => {
    if (itemCount === 0) return null;
    if (mode === 'byCount') {
      const n = groupCount;
      if (n <= 0) return null;
      const base = Math.floor(itemCount / n);
      const extra = itemCount % n;
      return {
        groups: n,
        sizes: Array.from({ length: n }, (_, i) => base + (i < extra ? 1 : 0)),
      };
    }
    const s = groupSize;
    if (s <= 0) return null;
    const count = Math.ceil(itemCount / s);
    return {
      groups: count,
      sizes: Array.from({ length: count }, (_, i) => (i === count - 1 ? itemCount - i * s : s)),
    };
  })();

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

  return (
    <div className="flex flex-col gap-4">
      {/* 模式切换 */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={labelStyle}>
          {isZh ? '分组方式' : 'Grouping Mode'}
        </label>
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'byCount', label: isZh ? '按组数分' : 'By group count', desc: isZh ? '指定分几组' : 'Specify number of groups' },
            { id: 'bySize', label: isZh ? '按每组人数' : 'By group size', desc: isZh ? '指定每组几人' : 'Specify members per group' },
          ] as { id: Mode; label: string; desc: string }[]).map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setGroups([]); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 animate-bounce-in"
              style={{
                background: mode === m.id ? 'var(--accent)' : 'var(--bg-2)',
                color: mode === m.id ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${mode === m.id ? 'var(--accent)' : 'var(--border)'}`,
              }}
              title={m.desc}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 组数/组大小输入 */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 text-sm" style={labelStyle}>
          {mode === 'byCount' ? (isZh ? '组数' : 'Groups') : (isZh ? '每组人数' : 'Per group')}
          <input
            type="number"
            min={1}
            max={100}
            value={mode === 'byCount' ? groupCount : groupSize}
            onChange={e => {
              const v = Math.max(1, Math.min(100, Number(e.target.value) || 1));
              if (mode === 'byCount') setGroupCount(v);
              else setGroupSize(v);
              setGroups([]);
            }}
            className="px-3 py-1.5 rounded-lg text-sm font-mono outline-none w-20"
            style={cardStyle}
          />
        </label>
        {previewStats && (
          <span className="text-xs" style={labelStyle}>
            {isZh
              ? `${itemCount} 项 → ${previewStats.groups} 组 (人数: ${previewStats.sizes.join('/')})`
              : `${itemCount} items → ${previewStats.groups} groups (sizes: ${previewStats.sizes.join('/')})`}
          </span>
        )}
      </div>

      {/* 输入框 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '输入名单(每行一项,支持中英文逗号会自动处理)' : 'Names list (one per line)'}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setGroups([]); }}
          placeholder={isZh ? '张三\n李四\n王五\n赵六\n...' : 'Alice\nBob\nCharlie\n...'}
          className="w-full h-40 rounded-lg p-3 text-sm outline-none resize-y font-mono"
          style={cardStyle}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={labelStyle}>
            {isZh ? `已输入 ${itemCount} 项` : `${itemCount} items entered`}
          </span>
          {input && (
            <button onClick={handleClear} className="text-[10px] hover:underline" style={labelStyle}>
              {isZh ? '清空' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleShuffle}
          disabled={itemCount === 0}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
          style={accentBtn}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
          {isZh ? '随机分组' : 'Shuffle & Group'}
        </button>
        {groups.length > 0 && (
          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'var(--bg-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            {isZh ? '复制结果' : 'Copy Result'}
          </button>
        )}
      </div>

      {/* 分组结果 */}
      {groups.length > 0 ? (
        <div
          key={seed}
          className="grid gap-3 animate-bounce-in"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          }}
        >
          {groups.map(g => {
            const color = GROUP_COLORS[g.index % GROUP_COLORS.length];
            return (
              <div
                key={g.index}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{
                  background: 'var(--bg-2)',
                  border: `2px solid ${color}`,
                  borderLeftWidth: '4px',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-bold"
                    style={{ color }}
                  >
                    {isZh ? `第 ${g.index + 1} 组` : `Group ${g.index + 1}`}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: `${color}20`, color }}
                  >
                    {g.members.length} {isZh ? '人' : 'members'}
                  </span>
                </div>
                <ol className="flex flex-col gap-1 mt-1">
                  {g.members.map((m, idx) => (
                    <li
                      key={idx}
                      className="text-sm flex items-center gap-2 px-2 py-1 rounded"
                      style={{ background: 'var(--bg-3)' }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: color, color: '#fff' }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ color: 'var(--text)' }} className="break-all">{m}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-lg p-8 text-center text-sm"
          style={{ background: 'var(--bg-3)', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
        >
          {isZh
            ? '输入名单后点击"随机分组"开始'
            : 'Enter names above and click "Shuffle & Group"'}
        </div>
      )}

      <p className="text-[10px]" style={labelStyle}>
        {isZh
          ? '🔒 使用 Web Crypto API 提供密码学安全的随机性,完全本地处理,不上传任何名单数据。'
          : '🔒 Uses Web Crypto API for cryptographically secure randomness. All data processed locally, no uploads.'}
      </p>
    </div>
  );
}
