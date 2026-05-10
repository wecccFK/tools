import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, History, Trash2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { cn } from '../lib/utils';
import { FAQ } from './FAQ';

export const Stopwatch = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<number | null>(null);
    const lastTickRef = useRef<number>(0);

    const faqs = [
        {
            question: {
                en: 'How accurate is the stopwatch?',
                zh: '秒表的准确度如何？'
            },
            answer: {
                en: 'The stopwatch uses high-precision timing with millisecond accuracy. It is suitable for sports, cooking, and other timing needs.',
                zh: '秒表使用高精度计时，精确到毫秒。适用于运动、烹饪和其他计时需求。'
            }
        },
        {
            question: {
                en: 'What is the lap function?',
                zh: '计次功能是什么？'
            },
            answer: {
                en: 'The lap function records split times without stopping the main timer. Perfect for tracking individual laps in running or intervals.',
                zh: '计次功能记录分段时间而不停止主计时器。非常适合记录跑步中的单圈时间或间隔时间。'
            }
        },
        {
            question: {
                en: 'Can I reset the stopwatch?',
                zh: '可以重置秒表吗？'
            },
            answer: {
                en: 'Yes, click the reset button to clear all time and lap data. The stopwatch will return to zero.',
                zh: '是的，点击重置按钮可清除所有时间和计次数据。秒表将归零。'
            }
        }
    ];

    useEffect(() => {
        if (isRunning) {
            lastTickRef.current = performance.now() - (time * 10);
            const tick = () => {
                const now = performance.now();
                setTime(Math.floor((now - lastTickRef.current) / 10));
                timerRef.current = requestAnimationFrame(tick);
            };
            timerRef.current = requestAnimationFrame(tick);
        } else {
            if (timerRef.current) cancelAnimationFrame(timerRef.current);
        }
        return () => {
            if (timerRef.current) cancelAnimationFrame(timerRef.current);
        };
    }, [isRunning]);

    const formatTime = (t: number) => {
        const ms = (t % 100).toString().padStart(2, '0');
        const s = Math.floor((t / 100) % 60).toString().padStart(2, '0');
        const m = Math.floor((t / 6000) % 60).toString().padStart(2, '0');
        const h = Math.floor(t / 360000).toString().padStart(2, '0');
        return { h, m, s, ms };
    };

    const handleStartStop = () => setIsRunning(!isRunning);
    
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        setLaps(prev => [time, ...prev]);
    };

    const clearLaps = () => setLaps([]);

    const { h, m, s, ms } = formatTime(time);

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '高精度秒表支持毫秒级计时，适用于运动训练、实验测量、游戏计时等多种场景。支持开始、暂停、重置和计次功能，可以记录多个计次时间。使用 requestAnimationFrame 实现高精度计时，确保计时的准确性。界面简洁美观，操作直观，满足各种计时需求。'
                        : 'The high-precision stopwatch supports millisecond-level timing, suitable for sports training, experimental measurements, game timing, and various other scenarios. Supports start, pause, reset, and lap functions, allowing you to record multiple lap times. Uses requestAnimationFrame for high-precision timing to ensure accuracy. The interface is simple and beautiful with intuitive operations to meet various timing needs.'}
                </p>
            </div>

            <div className="bg-card-bg rounded-[40px] p-8 md:p-12 border border-border-site shadow-2xl overflow-hidden relative group">
                {/* Glow Effect */}
                <div className={cn(
                    "absolute inset-0 bg-primary/5 transition-opacity duration-1000 blur-3xl opacity-0 group-hover:opacity-100",
                    isRunning && "opacity-100 animate-pulse"
                )} />

                <div className="relative z-10 flex flex-col items-center justify-center py-12">
                    <div className="flex items-baseline gap-2 mb-12">
                        <div className="flex flex-col items-center">
                            <span className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-text-site tabular-nums">{h}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-site/30 mt-2">Hours</span>
                        </div>
                        <span className="text-4xl md:text-6xl font-black font-mono text-text-site/20">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-text-site tabular-nums">{m}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-site/30 mt-2">Minutes</span>
                        </div>
                        <span className="text-4xl md:text-6xl font-black font-mono text-text-site/20">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-text-site tabular-nums">{s}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-site/30 mt-2">Seconds</span>
                        </div>
                        <span className="text-xl md:text-2xl font-black font-mono text-primary animate-pulse tabular-nums ml-2">.{ms}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={handleReset}
                            className="w-16 h-16 rounded-full border border-border-site flex items-center justify-center text-text-site/50 hover:bg-secondary-site hover:text-red-500 transition-all hover:scale-105 active:scale-95"
                            title="Reset"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>

                        <button 
                            onClick={handleStartStop}
                            className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl",
                                isRunning ? "bg-red-500 text-white shadow-red-500/20" : "bg-primary text-white shadow-primary/20"
                            )}
                        >
                            {isRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                        </button>

                        <button 
                            onClick={handleLap}
                            disabled={!isRunning && time === 0}
                            className="w-16 h-16 rounded-full border border-border-site flex items-center justify-center text-text-site/50 hover:bg-secondary-site hover:text-primary transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                            title="Lap"
                        >
                            <Timer className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Laps Table */}
            <div className="bg-card-bg rounded-3xl p-6 border border-border-site animate-in slide-in-from-bottom-4 transition-all duration-500">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-site">
                    <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                        <History className="w-4 h-4" /> 
                        {lang === 'zh' ? '计次记录' : 'Lap History'}
                    </h3>
                    {laps.length > 0 && (
                        <button 
                            onClick={clearLaps}
                            className="text-[10px] uppercase font-bold text-red-500 hover:opacity-80 flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" /> {lang === 'zh' ? '清空' : 'Clear'}
                        </button>
                    )}
                </div>

                {laps.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {laps.map((lapTime, idx) => {
                            const { h, m, s, ms } = formatTime(lapTime);
                            const prevLap = laps[idx + 1] || 0;
                            const diff = lapTime - prevLap;
                            const diffT = formatTime(diff);

                            return (
                                <div key={laps.length - idx} className="flex items-center justify-between p-4 bg-secondary-site rounded-2xl border border-border-site/50 group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-text-site/20 uppercase tracking-tighter group-hover:text-primary/40 transition-colors">#{laps.length - idx}</span>
                                        <span className="font-mono text-sm font-bold">{h}:{m}:{s}<span className="text-primary text-[10px]">.{ms}</span></span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-text-site/30 uppercase block">+{diffT.s}.{diffT.ms}s</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center text-text-site/20 grayscale opacity-50">
                        <History className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-[10px] uppercase font-black tracking-[0.2em]">{lang === 'zh' ? '暂无记录' : 'No Laps Yet'}</p>
                    </div>
                )}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
