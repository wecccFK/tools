import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Plus, Trash2, Box, Activity, Settings2, HelpCircle, Hand, Hash, Camera, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { FAQ } from './FAQ';

interface FunctionEntry {
    id: string;
    expression: string;
    color: string;
    visible: boolean;
}

export const GraphPlotter = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';

    const faqs = [
        {
            question: {
                en: 'What mathematical functions are supported?',
                zh: '支持哪些数学函数？'
            },
            answer: {
                en: 'You can use standard math functions like sin, cos, tan, log, exp, sqrt, abs, and power (^). Variables like x, y, z are supported for 3D graphs.',
                zh: '您可以使用标准数学函数，如 sin、cos、tan、log、exp、sqrt、abs 和幂运算 (^)。支持 x、y、z 变量用于 3D 图形。'
            }
        },
        {
            question: {
                en: 'Can I plot multiple functions at once?',
                zh: '可以同时绘制多个函数吗？'
            },
            answer: {
                en: 'Yes, you can add multiple function entries and toggle their visibility. Each function can have its own color and styling.',
                zh: '是的，您可以添加多个函数条目并切换它们的可见性。每个函数可以有自己的颜色和样式。'
            }
        },
        {
            question: {
                en: 'How do I export the graph?',
                zh: '如何导出图形？'
            },
            answer: {
                en: 'Click the camera icon to download the current graph as a PNG image. You can also use the zoom and pan controls to adjust the view before exporting.',
                zh: '点击相机图标可将当前图形下载为 PNG 图片。您还可以使用缩放和平移控件在导出前调整视图。'
            }
        }
    ];
    
    // Dynamic plotly loading state
    const [plotlyLoaded, setPlotlyLoaded] = useState(false);
    const [Plot, setPlot] = useState<React.ComponentType<any> | null>(null);
    const [PlotlyLib, setPlotlyLib] = useState<any>(null);
    
    // Load plotly dynamically on mount
    useEffect(() => {
        let mounted = true;
        const loadPlotly = async () => {
            try {
                const [plotlyModule, reactPlotlyModule] = await Promise.all([
                    import('plotly.js-dist-min'),
                    import('react-plotly.js/factory')
                ]);
                if (mounted) {
                    const Plotly = plotlyModule.default;
                    const createPlotlyComponent = reactPlotlyModule.default;
                    const PlotComponent = createPlotlyComponent(Plotly);
                    setPlotlyLib(Plotly);
                    setPlot(() => PlotComponent);
                    setPlotlyLoaded(true);
                }
            } catch (error) {
                console.error('Failed to load plotly:', error);
            }
        };
        loadPlotly();
        return () => { mounted = false; };
    }, []);
    
    // Sidebar resizing and container sizing state
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const [entries, setEntries] = useState<FunctionEntry[]>([
        { id: '1', expression: 'sin(x)', color: '#3b82f6', visible: true },
        { id: '2', expression: 'x * x / 10', color: '#ef4444', visible: true },
        { id: '3', expression: '2 * x', color: '#10b981', visible: true }
    ]);

    const addFunction = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setEntries([...entries, { 
            id, 
            expression: 'x', 
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`, 
            visible: true 
        }]);
    };

    const removeFunction = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const updateEntry = (id: string, updates: Partial<FunctionEntry>) => {
        setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const getFn2D = (expr: string): ((x: number) => number) => {
        try {
            const cleanExpr = expr.replace(/Math\./g, '');
            const sanitized = cleanExpr
                .replace(/\^/g, '**')
                .replace(/(sin|cos|tan|abs|sqrt|pow|exp|log|PI|E|atan|asin|acos)/g, 'Math.$1');
            return new Function('x', `try { return ${sanitized}; } catch(e) { return NaN; }`) as (x: number) => number;
        } catch (e) {
            return () => NaN;
        }
    };

    const [xRange, setXRange] = useState<[number, number]>([-30, 30]);
    const [yRange, setYRange] = useState<[number, number]>([-20, 20]);
    const [dragMode, setDragMode] = useState<'zoom' | 'pan' | 'orbit' | 'turntable' | false>('pan');
    const [revision, setRevision] = useState(0); 
    const [showIntersections, setShowIntersections] = useState(true);
    const plotRef = useRef<any>(null);
    
    // Custom Download Handler
    const handleDownload = async () => {
        if (!PlotlyLib || !containerRef.current) return;
        const gd = (containerRef.current.querySelector('.js-plotly-plot') as any);
        if (!gd) return;

        // Temporarily show legend for screenshot
        await PlotlyLib.relayout(gd, { showlegend: true });
        await PlotlyLib.downloadImage(gd, {
            format: 'png',
            width: containerSize.width * 2,
            height: containerSize.height * 2,
            filename: `graph_${Date.now()}`
        });
        // Hide legend again
        await PlotlyLib.relayout(gd, { showlegend: false });
    };

    // Resize Observer for Plot area sizing
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Fill the container while maintaining 1:1 aspect ratio
    useEffect(() => {
        if (!containerSize.width || !containerSize.height) return;
        
        const physicalAspect = containerSize.width / containerSize.height;
        const centerX = (xRange[0] + xRange[1]) / 2;
        const currentYSpan = yRange[1] - yRange[0];
        
        // Calculate the X span that would perfectly fill the available width at 1:1 ratio
        const targetXSpan = currentYSpan * physicalAspect;
        
        // Only update if the difference is significant (>1%)
        const currentXSpan = xRange[1] - xRange[0];
        if (Math.abs(currentXSpan - targetXSpan) / targetXSpan > 0.01) {
            setXRange([centerX - targetXSpan / 2, centerX + targetXSpan / 2]);
            setRevision(r => r + 1);
        }
    }, [containerSize, yRange[0], yRange[1]]);

    // Sidebar resizing effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            const newWidth = Math.min(Math.max(240, e.clientX - 32), 600);
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.body.style.cursor = 'default';
            setRevision(prev => prev + 1);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Smooth range update on zoom/pan
    const handleRelayout = (e: any) => {
        if (e.dragmode) setDragMode(e.dragmode);
        let needsUpdate = false;
        let nx = [...xRange] as [number, number];
        let ny = [...yRange] as [number, number];
        
        // Plotly sometimes provides range as an object with indices
        if (e['xaxis.autorange'] || e['yaxis.autorange']) {
            nx = [-30, 30]; ny = [-20, 20]; needsUpdate = true;
        } else {
            if (e['xaxis.range']) { nx = [e['xaxis.range'][0], e['xaxis.range'][1]]; needsUpdate = true; }
            else if (e['xaxis.range[0]'] !== undefined) { nx = [e['xaxis.range[0]'], e['xaxis.range[1]']]; needsUpdate = true; }
            
            if (e['yaxis.range']) { ny = [e['yaxis.range'][0], e['yaxis.range'][1]]; needsUpdate = true; }
            else if (e['yaxis.range[0]'] !== undefined) { ny = [e['yaxis.range[0]'], e['yaxis.range[1]']]; needsUpdate = true; }
        }
        
        if (needsUpdate) {
            setXRange(nx); 
            setYRange(ny); 
            setRevision(prev => prev + 1);
        }
    };

    const plotData = useMemo(() => {
        const [minX, maxX] = xRange;
        const span = Math.max(0.0001, Math.abs(maxX - minX));
        const startX = minX - (span * 0.5); // Extend slightly to ensure line visibility at edges
        const endX = maxX + (span * 0.5);
        const step = Math.max(0.0001, (endX - startX) / 1000); 

        const xValues: number[] = [];
        for (let i = startX; i <= endX; i += step) xValues.push(i);
        
        const functionTraces = entries.filter(e => e.visible && e.expression.trim() !== '').map(entry => {
            const fn = getFn2D(entry.expression);
            const yValues = xValues.map(x => fn(x));
            return {
                x: xValues, y: yValues, type: 'scatter', mode: 'lines',
                line: { color: entry.color, width: 3, shape: 'spline', smoothing: 1.3 },
                name: entry.expression, hoverinfo: 'x+y'
            } as any;
        });

        const intersectionPoints: {x: number[], y: number[]} = { x: [], y: [] };
        if (showIntersections && functionTraces.length > 0) {
            functionTraces.forEach(trace => {
                for (let i = 0; i < trace.x.length - 1; i++) {
                    const y1 = trace.y[i]; const y2 = trace.y[i+1];
                    if (y1 * y2 <= 0 && Math.abs(y1 - y2) < 10) {
                        intersectionPoints.x.push((trace.x[i] + trace.x[i+1]) / 2);
                        intersectionPoints.y.push(0);
                    }
                }
            });
            for (let i = 0; i < functionTraces.length; i++) {
                for (let j = i + 1; j < functionTraces.length; j++) {
                    const t1 = functionTraces[i]; const t2 = functionTraces[j];
                    for (let k = 0; k < t1.x.length - 1; k++) {
                        const diff1 = t1.y[k] - t2.y[k]; const diff2 = t1.y[k+1] - t2.y[k+1];
                        if (diff1 * diff2 <= 0 && Math.abs(diff1 - diff2) < 10) {
                            intersectionPoints.x.push((t1.x[k] + t1.x[k+1]) / 2);
                            intersectionPoints.y.push((t1.y[k] + t1.y[k+1]) / 2);
                        }
                    }
                }
            }
        }

        const intersectionTrace = {
            x: intersectionPoints.x, y: intersectionPoints.y,
            mode: 'markers', type: 'scatter',
            name: isZh ? '交点' : 'Intersections',
            marker: { color: '#fff', size: 8, symbol: 'circle-open', line: { width: 2, color: '#fff' } },
            hoverinfo: 'x+y', showlegend: false
        };

        return [...functionTraces, intersectionTrace];
    }, [entries, xRange, showIntersections, isZh]);

    const toggleVisibility = (id: string) => {
        const entry = entries.find(e => e.id === id);
        if (entry) updateEntry(id, { visible: !entry.visible });
    };

    const axisStyle = {
        visible: true, showgrid: true,
        gridcolor: 'rgba(255, 255, 255, 0.05)', gridwidth: 1,
        zeroline: true, zerolinewidth: 4,
        tickfont: { size: 10, color: '#94a3b8' }
    };

    const axisStyle2D = {
        ...axisStyle,
        linecolor: '#475569', linewidth: 2,
        mirror: true, showline: true,
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-120px)] min-h-[500px] lg:min-h-[600px] max-w-7xl mx-auto">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '函数绘图器是一个强大的数学可视化工具，支持绘制 2D 和 3D 函数图像。您可以输入多个数学函数，实时查看它们的图像、交点和特征。支持平移、缩放、截图保存等交互功能。适用于数学教学、工程计算、科学研究等多种场景。支持常见的数学函数如 sin、cos、tan、log、exp、sqrt 等。'
                        : 'The function plotter is a powerful mathematical visualization tool that supports plotting 2D and 3D function graphs. You can input multiple mathematical functions and view their graphs, intersections, and features in real-time. Supports interactive features like panning, zooming, and screenshot saving. Suitable for math teaching, engineering calculations, scientific research, and various other scenarios. Supports common mathematical functions like sin, cos, tan, log, exp, sqrt, etc.'}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-0 flex-1 border border-border-site rounded-[32px] overflow-hidden bg-card-bg shadow-sm">
            <div
                style={{ width: sidebarWidth + 'px' }}
                className="flex flex-col bg-secondary-site/10 overflow-hidden shrink-0 max-lg:!w-full max-lg:h-[280px]"
            >
                <div className="p-6 border-b border-border-site flex items-center justify-between bg-secondary-site/30">
                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-primary" />
                        {isZh ? '方程列表' : 'Functions'}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setShowIntersections(!showIntersections)} className={cn("p-1.5 rounded-xl transition-all border", showIntersections ? "bg-primary/20 border-primary text-primary" : "bg-secondary-site border-transparent text-text-site/50 hover:bg-primary/10")}>
                            <Hash className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDragMode(prev => prev === 'pan' ? 'zoom' : 'pan')} className={cn("p-1.5 rounded-xl transition-all border", dragMode === 'pan' ? "bg-primary/20 border-primary text-primary" : "bg-secondary-site border-transparent text-text-site/50 hover:bg-primary/10")}>
                            <Hand className="w-4 h-4" />
                        </button>
                        <button onClick={addFunction} className="p-1.5 bg-primary text-white rounded-xl hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                    {entries.map((entry) => (
                        <div 
                            key={entry.id} 
                            className="pl-4 pr-1 py-1.5 bg-secondary-site/50 border-l-4 rounded-r-2xl border-border-site/50 group hover:border-primary/30 transition-all flex flex-col gap-1.5"
                            style={{ borderLeftColor: entry.color }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-1 font-mono font-bold text-[10px] text-text-site/40 uppercase tracking-tighter">y =</div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => toggleVisibility(entry.id)} className={cn("p-1 rounded-lg transition-colors", entry.visible ? "text-primary hover:bg-primary/10" : "text-text-site/20 hover:bg-secondary-site")}>
                                        <Activity className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => removeFunction(entry.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <input 
                                value={entry.expression} 
                                onChange={(e) => updateEntry(entry.id, { expression: e.target.value })} 
                                className="w-full bg-transparent border-none outline-none text-lg font-mono font-bold text-text-site placeholder:text-text-site/20" 
                                placeholder="e.g. sin(x)" 
                            />
                        </div>
                    ))}
                    {entries.length === 0 && <div className="text-center py-12 text-text-site/20 text-xs italic">{isZh ? '无可用方程，请添加。' : 'No functions added.'}</div>}
                </div>

                <div className="p-6 bg-secondary-site/30 border-t border-border-site space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-site/40 flex items-center gap-2"><Settings2 className="w-3 h-3" /> {isZh ? '视口范围与比例' : 'Range & Ratio'}</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-text-site/30 ml-1">X Axis</span>
                            <div className="flex items-center gap-1">
                                <input type="number" value={Math.round(xRange[0])} onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) setXRange([val, xRange[1]]); }} className="w-full bg-card-bg border border-border-site rounded-xl px-3 py-2 text-xs font-bold" />
                                <span className="opacity-20">~</span>
                                <input type="number" value={Math.round(xRange[1])} onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) setXRange([xRange[0], val]); }} className="w-full bg-card-bg border border-border-site rounded-xl px-3 py-2 text-xs font-bold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-text-site/30 ml-1">Y Axis</span>
                            <div className="flex items-center gap-1">
                                <input type="number" value={Math.round(yRange[0])} onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) setYRange([val, yRange[1]]); }} className="w-full bg-card-bg border border-border-site rounded-xl px-3 py-2 text-xs font-bold" />
                                <span className="opacity-20">~</span>
                                <input type="number" value={Math.round(yRange[1])} onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) setYRange([yRange[0], val]); }} className="w-full bg-card-bg border border-border-site rounded-xl px-3 py-2 text-xs font-bold" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex w-1 bg-border-site hover:bg-primary cursor-col-resize items-center justify-center transition-colors group" onMouseDown={() => { isResizing.current = true; document.body.style.cursor = 'col-resize'; }}>
                <div className="w-[1px] h-8 bg-text-site/20 group-hover:bg-primary-foreground" />
            </div>

            <div ref={containerRef} className="flex-1 bg-black overflow-hidden relative">
                {!plotlyLoaded ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-text-site/50">{isZh ? '图表加载中...' : 'Loading chart...'}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={handleDownload}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-md shadow-xl flex items-center gap-2 text-xs font-bold"
                            title={isZh ? '保存高清图像 (含图例)' : 'Save HD Image (with Legend)'}
                        >
                            <Camera className="w-4 h-4" />
                            {isZh ? '保存截图' : 'Save'}
                        </button>
                        {Plot && (
                            <Plot
                                data={plotData}
                                layout={{
                                    uirevision: revision, dragmode: dragMode, autosize: true,
                                    margin: { l: 35, r: 5, b: 35, t: 5, pad: 2 },
                                    paper_bgcolor: 'black', plot_bgcolor: 'black',
                                    showlegend: false,
                                    xaxis: { 
                                        ...axisStyle2D, title: { text: 'x-axis', font: { size: 10, color: '#ff4d4d', weight: 'bold' } },
                                        range: xRange, zerolinecolor: '#ff4d4d',
                                    },
                                    yaxis: {
                                        ...axisStyle2D, title: { text: 'y-axis', font: { size: 10, color: '#3b82f6', weight: 'bold' } },
                                        range: yRange, zerolinecolor: '#3b82f6',
                                        scaleanchor: "x", scaleratio: 1,
                                    },
                                    hovermode: 'closest',
                                }}
                                onRelayout={handleRelayout}
                                useResizeHandler={true}
                                style={{ width: '100%', height: '100%' }}
                                config={{ displayModeBar: true, responsive: true, scrollZoom: true, displaylogo: false }}
                            />
                        )}
                    </>
                )}
            </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
