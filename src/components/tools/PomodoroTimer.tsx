import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Mode = 'focus' | 'shortBreak' | 'longBreak';
type TimerState = 'idle' | 'running' | 'paused' | 'finished';

const DEFAULT_DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const STORAGE_KEY = 'momo-pomodoro-stats';

interface Stats {
  date: string; // YYYY-MM-DD
  focusCount: number;
  totalFocusMinutes: number;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayStr(), focusCount: 0, totalFocusMinutes: 0 };
    const parsed = JSON.parse(raw) as Stats;
    if (parsed.date !== todayStr()) {
      return { date: todayStr(), focusCount: 0, totalFocusMinutes: 0 };
    }
    return parsed;
  } catch {
    return { date: todayStr(), focusCount: 0, totalFocusMinutes: 0 };
  }
}

export default function PomodoroTimer() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [durations, setDurations] = useState<Record<Mode, number>>(DEFAULT_DURATIONS);
  const [mode, setMode] = useState<Mode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.focus);
  const [state, setState] = useState<TimerState>('idle');
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 监听全屏变化(ESC 退出)
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  const modeLabel: Record<Mode, { zh: string; en: string }> = {
    focus: { zh: '专注', en: 'Focus' },
    shortBreak: { zh: '短休息', en: 'Short Break' },
    longBreak: { zh: '长休息', en: 'Long Break' },
  };

  const modeColor: Record<Mode, string> = {
    focus: '#d97706',
    shortBreak: '#16a34a',
    longBreak: '#3b82f6',
  };

  const saveStats = useCallback((next: Stats) => {
    setStats(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const notify = useCallback((title: string, body: string) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try { new Notification(title, { body }); } catch {}
    }
  }, []);

  const handleFinished = useCallback(() => {
    setState('finished');
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (mode === 'focus') {
      const next: Stats = {
        date: todayStr(),
        focusCount: stats.focusCount + 1,
        totalFocusMinutes: stats.totalFocusMinutes + Math.round(durations.focus / 60),
      };
      saveStats(next);
      notify(
        isZh ? '专注完成!' : 'Focus complete!',
        isZh ? `已完成 ${next.focusCount} 个番茄钟` : `${next.focusCount} pomodoros completed`
      );
    } else {
      notify(
        isZh ? '休息结束' : 'Break ended',
        isZh ? '继续专注吧' : 'Back to work!'
      );
    }
  }, [mode, stats, durations.focus, isZh, notify, saveStats]);

  // 计时循环
  useEffect(() => {
    if (state !== 'running') return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          handleFinished();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [state, handleFinished]);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setSecondsLeft(durations[newMode]);
    setState('idle');
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const start = () => {
    if (state === 'finished') {
      setSecondsLeft(durations[mode]);
    }
    setState('running');
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  };

  const pause = () => {
    setState('paused');
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const reset = () => {
    setState('idle');
    setSecondsLeft(durations[mode]);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const updateDuration = (m: Mode, value: number) => {
    const clamped = Math.max(1, Math.min(120, value));
    const next = { ...durations, [m]: clamped * 60 };
    setDurations(next);
    if (mode === m && state === 'idle') setSecondsLeft(next[m]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const progress = 1 - secondsLeft / durations[mode];
  const circumference = 2 * Math.PI * 120;
  const offset = circumference * (1 - progress);

  // 全屏容器尺寸(全屏下加大)
  const svgSize = isFullscreen ? 'min(60vh, 60vw)' : '288px';
  const timeFontSize = isFullscreen ? 'min(20vw, 20vh)' : '3.75rem';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 全屏容器 */}
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center"
        style={{
          background: isFullscreen ? '#000' : 'transparent',
          borderRadius: isFullscreen ? 0 : '1rem',
          minHeight: isFullscreen ? '100vh' : 'auto',
          height: isFullscreen ? '100vh' : 'auto',
          width: isFullscreen ? '100vw' : '100%',
          maxWidth: '100%',
          padding: isFullscreen ? '0' : '0',
          position: isFullscreen ? 'fixed' : 'static',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: isFullscreen ? 9999 : 'auto',
          gap: isFullscreen ? '4vh' : '0',
        }}
      >
        {/* 模式切换 */}
        <div className="flex gap-2 flex-wrap justify-center">
          {(Object.keys(modeLabel) as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 animate-bounce-in"
              style={{
                background: mode === m ? modeColor[m] : (isFullscreen ? 'rgba(255,255,255,0.1)' : 'var(--bg-2)'),
                color: mode === m ? '#fff' : (isFullscreen ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)'),
                border: `1px solid ${mode === m ? modeColor[m] : (isFullscreen ? 'rgba(255,255,255,0.2)' : 'var(--border)')}`,
                fontSize: isFullscreen ? 'min(2.5vw, 2.5vh)' : undefined,
              }}
            >
              {modeLabel[m][lang]}
            </button>
          ))}
        </div>

        {/* 圆形进度条 */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: svgSize,
            height: svgSize,
          }}
        >
          <svg
            className="absolute inset-0 -rotate-90"
            width="100%"
            height="100%"
            viewBox="0 0 288 288"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle
              cx="144" cy="144" r="120"
              fill="none"
              stroke={isFullscreen ? 'rgba(255,255,255,0.15)' : 'var(--border)'}
              strokeWidth="6"
            />
            <circle
              cx="144" cy="144" r="120"
              fill="none"
              stroke={modeColor[mode]}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear', filter: isFullscreen ? 'drop-shadow(0 0 8px currentColor)' : undefined }}
            />
          </svg>
          <div className="text-center relative z-10">
            <div
              className="font-bold font-mono tabular-nums"
              style={{
                color: isFullscreen ? '#ffffff' : 'var(--text)',
                fontSize: timeFontSize,
                lineHeight: 1,
                textShadow: isFullscreen ? `0 0 40px ${modeColor[mode]}99` : undefined,
              }}
            >
              {formatTime(secondsLeft)}
            </div>
            <div
              className="mt-2 font-medium"
              style={{
                color: isFullscreen ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)',
                fontSize: isFullscreen ? 'min(3vw, 3vh)' : '0.75rem',
              }}
            >
              {modeLabel[mode][lang]}
            </div>
          </div>
        </div>

        {/* 控制按钮 + 全屏切换 */}
        <div className="flex gap-3 flex-wrap justify-center">
          {state !== 'running' ? (
            <button
              onClick={start}
              className="px-6 py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: modeColor[mode], fontSize: isFullscreen ? 'min(2vw, 2vh)' : undefined }}
            >
              {state === 'paused' ? (isZh ? '继续' : 'Resume') : (isZh ? '开始' : 'Start')}
            </button>
          ) : (
            <button
              onClick={pause}
              className="px-6 py-3 rounded-xl font-medium transition-colors"
              style={{ background: 'var(--bg-3)', color: 'var(--text)', fontSize: isFullscreen ? 'min(2vw, 2vh)' : undefined }}
            >
              {isZh ? '暂停' : 'Pause'}
            </button>
          )}
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-medium transition-colors"
            style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', fontSize: isFullscreen ? 'min(2vw, 2vh)' : undefined }}
          >
            {isZh ? '重置' : 'Reset'}
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-6 py-3 rounded-xl font-medium transition-opacity hover:opacity-90 flex items-center gap-1.5"
            style={{
              background: isFullscreen ? 'rgba(255,255,255,0.1)' : 'var(--bg-3)',
              color: isFullscreen ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${isFullscreen ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              fontSize: isFullscreen ? 'min(2vw, 2vh)' : undefined,
            }}
            title={isZh ? '全屏显示' : 'Fullscreen'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isFullscreen ? (
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3m13 0v-3a2 2 0 0 1-2-2h-3" />
              ) : (
                <path d="M3 8V5a2 2 0 0 1 2-2h3m13 0h3a2 2 0 0 1 2 2v3m0 13v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
              )}
            </svg>
            {isFullscreen ? (isZh ? '退出' : 'Exit') : (isZh ? '全屏' : 'Fullscreen')}
          </button>
        </div>

        {/* 全屏下显示今日统计(简化版) */}
        {isFullscreen && (
          <div className="flex gap-6 text-center" style={{ marginTop: '2vh' }}>
            <div>
              <div className="font-bold font-mono tabular-nums" style={{ color: modeColor[mode], fontSize: 'min(3.5vw, 3.5vh)' }}>
                {stats.focusCount}
              </div>
              <div className="mt-1" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'min(1.5vw, 1.5vh)' }}>
                {isZh ? '今日' : 'Today'}
              </div>
            </div>
            <div>
              <div className="font-bold font-mono tabular-nums" style={{ color: modeColor[mode], fontSize: 'min(3.5vw, 3.5vh)' }}>
                {stats.totalFocusMinutes}
              </div>
              <div className="mt-1" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'min(1.5vw, 1.5vh)' }}>
                {isZh ? '专注分钟' : 'Focus min'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 今日统计(非全屏显示) */}
      {!isFullscreen && (
        <div
          className="w-full max-w-md rounded-xl p-4 flex items-center justify-around"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold accent-text">{stats.focusCount}</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {isZh ? '今日番茄钟' : 'Today Pomodoros'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold accent-text">{stats.totalFocusMinutes}</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {isZh ? '专注分钟数' : 'Focus Minutes'}
            </div>
          </div>
        </div>
      )}

      {/* 时长设置(非全屏显示) */}
      {!isFullscreen && (
        <details className="w-full max-w-md">
          <summary className="text-xs cursor-pointer select-none" style={{ color: 'var(--text-muted)' }}>
            {isZh ? '自定义时长(分钟)' : 'Custom durations (minutes)'}
          </summary>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {(Object.keys(modeLabel) as Mode[]).map(m => (
              <label key={m} className="flex flex-col gap-1">
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {modeLabel[m][lang]}
                </span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={Math.round(durations[m] / 60)}
                  onChange={e => updateDuration(m, Number(e.target.value))}
                  className="px-2 py-1 rounded-lg text-sm font-mono outline-none"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </label>
            ))}
          </div>
        </details>
      )}

      {!isFullscreen && (
        <p className="text-[10px] text-center max-w-md" style={{ color: 'var(--text-muted)' }}>
          {isZh
            ? '提示:首次开始会请求浏览器通知权限,完成时会弹出提醒。统计仅本地存储,刷新页面会保留。'
            : 'Tip: First start requests browser notification permission. Stats are stored locally and persist across refreshes.'}
        </p>
      )}
    </div>
  );
}
