import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Mode = 'clock' | 'stopwatch' | 'countdown';
type SwState = 'idle' | 'running' | 'paused';
type CdState = 'idle' | 'running' | 'paused' | 'finished';

interface Lap {
  index: number;
  total: number; // ms
  split: number; // ms
}

export default function Clock() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [mode, setMode] = useState<Mode>('clock');
  const [now, setNow] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is24h, setIs24h] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);

  // 秒表
  const [swState, setSwState] = useState<SwState>('idle');
  const [swElapsed, setSwElapsed] = useState<number>(0); // ms
  const [laps, setLaps] = useState<Lap[]>([]);

  // 倒计时
  const [cdState, setCdState] = useState<CdState>('idle');
  const [cdInput, setCdInput] = useState({ h: 0, m: 5, s: 0 });
  const [cdLeft, setCdLeft] = useState<number>(0); // ms
  const [cdTotal, setCdTotal] = useState<number>(0); // 用于进度条

  const swStartRef = useRef<number>(0); // 开始时刻(墙钟,ms)
  const swAccumRef = useRef<number>(0); // 暂停累计已计时
  const swTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdEndRef = useRef<number>(0); // 倒计时结束墙钟时刻
  const cdTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdFinRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 实时时钟(每秒更新一次)
  useEffect(() => {
    if (mode !== 'clock') return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [mode]);

  // 秒表计时
  useEffect(() => {
    if (swState !== 'running') return;
    swTickRef.current = setInterval(() => {
      setSwElapsed(swAccumRef.current + (Date.now() - swStartRef.current));
    }, 50);
    return () => {
      if (swTickRef.current) { clearInterval(swTickRef.current); swTickRef.current = null; }
    };
  }, [swState]);

  // 倒计时计时
  useEffect(() => {
    if (cdState !== 'running') return;
    cdTickRef.current = setInterval(() => {
      const left = cdEndRef.current - Date.now();
      if (left <= 0) {
        setCdLeft(0);
        finishCountdown();
      } else {
        setCdLeft(left);
      }
    }, 100);
    return () => {
      if (cdTickRef.current) { clearInterval(cdTickRef.current); cdTickRef.current = null; }
    };
  }, [cdState]);

  // 监听全屏变化(ESC 退出会触发)
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => () => {
    if (swTickRef.current) clearInterval(swTickRef.current);
    if (cdTickRef.current) clearInterval(cdTickRef.current);
    if (cdFinRef.current) clearTimeout(cdFinRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
  }, []);

  // ===== 秒表操作 =====
  const swStart = () => {
    if (swState === 'finished' || swState === 'idle') {
      swAccumRef.current = 0;
      setSwElapsed(0);
      setLaps([]);
    }
    swStartRef.current = Date.now();
    setSwState('running');
  };
  const swPause = () => {
    if (swState !== 'running') return;
    swAccumRef.current += Date.now() - swStartRef.current;
    setSwElapsed(swAccumRef.current);
    setSwState('paused');
  };
  const swReset = () => {
    swAccumRef.current = 0;
    setSwElapsed(0);
    setLaps([]);
    setSwState('idle');
  };
  const swLap = () => {
    if (swState !== 'running') return;
    const total = swElapsed;
    const lastTotal = laps.length > 0 ? laps[laps.length - 1].total : 0;
    setLaps(prev => [...prev, { index: prev.length + 1, total, split: total - lastTotal }]);
  };

  // ===== 倒计时操作 =====
  const cdStart = () => {
    const totalMs = (cdInput.h * 3600 + cdInput.m * 60 + cdInput.s) * 1000;
    if (totalMs <= 0) return;
    setCdTotal(totalMs);
    setCdLeft(totalMs);
    cdEndRef.current = Date.now() + totalMs;
    setCdState('running');
  };
  const cdPause = () => {
    if (cdState !== 'running') return;
    setCdState('paused');
    // 暂存剩余时间在 cdLeft 中(下次恢复时基于此重算结束时刻)
  };
  const cdResume = () => {
    if (cdState !== 'paused') return;
    cdEndRef.current = Date.now() + cdLeft;
    setCdState('running');
  };
  const cdReset = () => {
    if (cdTickRef.current) { clearInterval(cdTickRef.current); cdTickRef.current = null; }
    if (cdFinRef.current) { clearTimeout(cdFinRef.current); cdFinRef.current = null; }
    setCdLeft(0);
    setCdTotal(0);
    setCdState('idle');
  };
  const finishCountdown = useCallback(() => {
    if (cdTickRef.current) { clearInterval(cdTickRef.current); cdTickRef.current = null; }
    setCdState('finished');
    playBeep();
  }, []);

  // 蜂鸣提示(Web Audio API)
  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      // 三声短促提示音
      [0, 0.4, 0.8].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0, ctx.currentTime + offset);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + offset + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + offset + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.3);
      });
    } catch (e) {
      // AudioContext 失败静默处理
    }
  };

  // ===== 全屏 =====
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
    } catch (e) {
      // 全屏失败静默处理
    }
  };

  // ===== 格式化 =====
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');

  const formatClockTime = (d: Date) => {
    let h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    let suffix = '';
    if (!is24h) {
      suffix = h >= 12 ? ' PM' : ' AM';
      h = h % 12 || 12;
    }
    return `${pad(h)}:${pad(m)}${showSeconds ? ':' + pad(s) : ''}${suffix}`;
  };

  const formatSwTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10); // 厘秒
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`;
    return `${pad(m)}:${pad(s)}.${pad(cs)}`;
  };

  const formatCdTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  };

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = isZh
      ? ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
    return isZh ? `${y}年${m}月${day}日 ${weekday}` : `${weekday}, ${y}-${pad(m)}-${pad(day)}`;
  };

  // ===== 渲染 =====
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

  // 主显示内容(全屏与非全屏共用)
  const renderDisplay = () => {
    // 全屏时强制纯白高对比,避免 CSS 变量继承导致灰字
    const fullscreenColor = '#ffffff';
    const fullscreenGlow = '0 0 60px rgba(255,255,255,0.25), 0 0 120px rgba(217,119,6,0.15)';
    const fullscreenMuted = 'rgba(255,255,255,0.55)';

    if (mode === 'clock') {
      return (
        <div className="flex flex-col items-center gap-4" style={isFullscreen ? { gap: '4vh' } : undefined}>
          <div
            className="font-mono font-bold leading-none tabular-nums"
            style={{
              fontSize: isFullscreen ? 'min(28vw, 28vh)' : 'clamp(3rem, 12vw, 8rem)',
              color: isFullscreen ? fullscreenColor : 'var(--text)',
              letterSpacing: '-0.04em',
              textShadow: isFullscreen ? fullscreenGlow : undefined,
              fontWeight: isFullscreen ? 800 : 700,
            }}
          >
            {formatClockTime(now)}
          </div>
          {showDate && (
            <div
              className="font-medium"
              style={{
                fontSize: isFullscreen ? 'min(4vw, 4vh)' : '1rem',
                color: isFullscreen ? fullscreenMuted : 'var(--text-muted)',
                textShadow: isFullscreen ? '0 0 20px rgba(255,255,255,0.2)' : undefined,
              }}
            >
              {formatDate(now)}
            </div>
          )}
        </div>
      );
    }
    if (mode === 'stopwatch') {
      return (
        <div className="flex flex-col items-center gap-6" style={isFullscreen ? { gap: '4vh' } : undefined}>
          <div
            className="font-mono font-bold leading-none tabular-nums"
            style={{
              fontSize: isFullscreen ? 'min(30vw, 30vh)' : 'clamp(2.5rem, 10vw, 6rem)',
              color: isFullscreen ? fullscreenColor : 'var(--text)',
              letterSpacing: '-0.04em',
              textShadow: isFullscreen ? fullscreenGlow : undefined,
              fontWeight: isFullscreen ? 800 : 700,
            }}
          >
            {formatSwTime(swElapsed)}
          </div>
          {!isFullscreen && laps.length > 0 && (
            <div className="w-full max-w-md max-h-48 overflow-y-auto rounded-lg" style={cardStyle}>
              {laps.slice().reverse().map(lap => (
                <div
                  key={lap.index}
                  className="flex items-center justify-between px-3 py-2 text-sm font-mono border-b last:border-b-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>
                    {isZh ? '第' : 'Lap'} {lap.index}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>+{formatSwTime(lap.split)}</span>
                  <span style={{ color: 'var(--text)' }}>{formatSwTime(lap.total)}</span>
                </div>
              ))}
            </div>
          )}
          {isFullscreen && laps.length > 0 && (
            <div
              className="font-mono tabular-nums"
              style={{
                fontSize: 'min(3.5vw, 3.5vh)',
                color: fullscreenMuted,
                marginTop: '2vh',
              }}
            >
              {isZh ? `计次 ${laps.length} · 最近 +${formatSwTime(laps[laps.length - 1].split)}` : `Lap ${laps.length} · last +${formatSwTime(laps[laps.length - 1].split)}`}
            </div>
          )}
        </div>
      );
    }
    // countdown
    const progress = cdTotal > 0 ? (cdTotal - cdLeft) / cdTotal : 0;
    const isFinished = cdState === 'finished';
    return (
      <div
        className="flex flex-col items-center w-full"
        style={{
          maxWidth: isFullscreen ? '90vw' : '32rem',
          gap: isFullscreen ? '4vh' : '1rem',
        }}
      >
        <div
          className="font-mono font-bold leading-none tabular-nums"
          style={{
            fontSize: isFullscreen ? 'min(30vw, 30vh)' : 'clamp(2.5rem, 10vw, 6rem)',
            color: isFullscreen ? (isFinished ? '#ef4444' : fullscreenColor) : (isFinished ? '#ef4444' : 'var(--text)'),
            letterSpacing: '-0.04em',
            textShadow: isFullscreen
              ? (isFinished ? '0 0 60px rgba(239,68,68,0.5), 0 0 120px rgba(239,68,68,0.3)' : fullscreenGlow)
              : undefined,
            animation: isFinished ? 'pulse 1s ease-in-out infinite' : undefined,
            fontWeight: isFullscreen ? 800 : 700,
          }}
        >
          {isFinished ? (isZh ? '时间到!' : 'TIME UP!') : formatCdTime(cdLeft)}
        </div>
        {cdTotal > 0 && (
          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: isFullscreen ? 'min(1.2vh, 8px)' : '8px',
              background: isFullscreen ? 'rgba(255,255,255,0.1)' : 'var(--bg-3)',
            }}
          >
            <div
              className="h-full transition-all duration-200 ease-linear"
              style={{
                width: `${progress * 100}%`,
                background: isFinished ? '#ef4444' : (isFullscreen ? '#d97706' : 'var(--accent)'),
                boxShadow: isFullscreen ? '0 0 12px currentColor' : undefined,
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 模式切换 + 全屏按钮 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'clock', label: isZh ? '时钟' : 'Clock' },
            { id: 'stopwatch', label: isZh ? '秒表' : 'Stopwatch' },
            { id: 'countdown', label: isZh ? '倒计时' : 'Countdown' },
          ] as { id: Mode; label: string }[]).map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 animate-bounce-in"
              style={{
                background: mode === m.id ? 'var(--accent)' : 'var(--bg-2)',
                color: mode === m.id ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${mode === m.id ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          onClick={toggleFullscreen}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-90 flex items-center gap-1.5"
          style={accentBtn}
          title={isZh ? '全屏显示' : 'Fullscreen'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isFullscreen ? (
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3m13 0v-3a2 2 0 0 1-2-2h-3" />
            ) : (
              <path d="M3 8V5a2 2 0 0 1 2-2h3m13 0h3a2 2 0 0 1 2 2v3m0 13v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
            )}
          </svg>
          {isFullscreen ? (isZh ? '退出全屏' : 'Exit') : (isZh ? '全屏' : 'Fullscreen')}
        </button>
      </div>

      {/* 全屏容器(同时承载非全屏的主显示) */}
      <div
        ref={containerRef}
        className="flex items-center justify-center transition-all"
        style={{
          background: isFullscreen ? '#000' : 'var(--bg-2)',
          border: isFullscreen ? 'none' : '1px solid var(--border)',
          borderRadius: isFullscreen ? 0 : '1rem',
          minHeight: isFullscreen ? '100vh' : '320px',
          height: isFullscreen ? '100vh' : 'auto',
          width: '100vw',
          maxWidth: '100%',
          padding: isFullscreen ? '0' : '2.5rem 1.5rem',
          position: isFullscreen ? 'fixed' : 'static',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: isFullscreen ? 9999 : 'auto',
        }}
      >
        {renderDisplay()}
      </div>

      {/* 模式特定的控制区(全屏时隐藏,便于纯净显示) */}
      {!isFullscreen && (
        <>
          {mode === 'clock' && (
            <div className="flex flex-wrap items-center gap-3 text-sm" style={labelStyle}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={is24h}
                  onChange={e => setIs24h(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--accent)' }}
                />
                {isZh ? '24 小时制' : '24-hour'}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSeconds}
                  onChange={e => setShowSeconds(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--accent)' }}
                />
                {isZh ? '显示秒' : 'Show seconds'}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDate}
                  onChange={e => setShowDate(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--accent)' }}
                />
                {isZh ? '显示日期' : 'Show date'}
              </label>
            </div>
          )}

          {mode === 'stopwatch' && (
            <div className="flex flex-wrap gap-2">
              {swState === 'idle' || swState === 'finished' ? (
                <button onClick={swStart} className="px-5 py-2 rounded-lg text-sm font-medium" style={accentBtn}>
                  {isZh ? '开始' : 'Start'}
                </button>
              ) : swState === 'running' ? (
                <>
                  <button onClick={swPause} className="px-5 py-2 rounded-lg text-sm font-medium" style={accentBtn}>
                    {isZh ? '暂停' : 'Pause'}
                  </button>
                  <button
                    onClick={swLap}
                    className="px-5 py-2 rounded-lg text-sm font-medium"
                    style={{ background: 'var(--bg-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {isZh ? '计次' : 'Lap'}
                  </button>
                </>
              ) : (
                <button onClick={swStart} className="px-5 py-2 rounded-lg text-sm font-medium" style={accentBtn}>
                  {isZh ? '继续' : 'Resume'}
                </button>
              )}
              <button
                onClick={swReset}
                disabled={swState === 'idle'}
                className="px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ background: 'var(--bg-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
              >
                {isZh ? '重置' : 'Reset'}
              </button>
            </div>
          )}

          {mode === 'countdown' && (
            <div className="flex flex-col gap-3">
              {cdState === 'idle' && (
                <div className="flex flex-wrap items-end gap-2">
                  {([
                    { key: 'h', max: 23 },
                    { key: 'm', max: 59 },
                    { key: 's', max: 59 },
                  ] as const).map(({ key, max }, idx) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          min={0}
                          max={max}
                          value={cdInput[key]}
                          onChange={e => {
                            const v = Math.max(0, Math.min(max, Number(e.target.value) || 0));
                            setCdInput(prev => ({ ...prev, [key]: v }));
                          }}
                          className="w-16 px-2 py-1.5 rounded-lg text-center font-mono text-lg outline-none"
                          style={cardStyle}
                        />
                        <span className="text-[10px] mt-1" style={labelStyle}>
                          {isZh ? { h: '时', m: '分', s: '秒' }[key] : { h: 'hrs', m: 'min', s: 'sec' }[key]}
                        </span>
                      </div>
                      {idx < 2 && <span className="text-xl font-bold mb-5" style={labelStyle}>:</span>}
                    </div>
                  ))}
                  <button onClick={cdStart} className="px-5 py-2 rounded-lg text-sm font-medium ml-2" style={accentBtn}>
                    {isZh ? '开始' : 'Start'}
                  </button>
                </div>
              )}
              {cdState === 'running' && (
                <button onClick={cdPause} className="px-5 py-2 rounded-lg text-sm font-medium w-fit" style={accentBtn}>
                  {isZh ? '暂停' : 'Pause'}
                </button>
              )}
              {cdState === 'paused' && (
                <div className="flex gap-2">
                  <button onClick={cdResume} className="px-5 py-2 rounded-lg text-sm font-medium" style={accentBtn}>
                    {isZh ? '继续' : 'Resume'}
                  </button>
                  <button
                    onClick={cdReset}
                    className="px-5 py-2 rounded-lg text-sm font-medium"
                    style={{ background: 'var(--bg-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {isZh ? '重置' : 'Reset'}
                  </button>
                </div>
              )}
              {cdState === 'finished' && (
                <button onClick={cdReset} className="px-5 py-2 rounded-lg text-sm font-medium w-fit" style={accentBtn}>
                  {isZh ? '再来一次' : 'Restart'}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
