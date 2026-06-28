import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';
type Quality = 'low' | 'medium' | 'high' | 'custom';
type Resolution = '720p' | '1080p' | '1440p' | 'native';
type AudioSource = 'none' | 'system' | 'mic' | 'both';

// 候选 mimeType 列表(优先级从高到低)
// 浏览器实际支持哪些由 MediaRecorder.isTypeSupported 决定,运行时动态检测
const CANDIDATE_MIME_TYPES: { id: string; label: { zh: string; en: string }; ext: string }[] = [
  { id: 'video/webm;codecs=vp9,opus', label: { zh: 'WebM (VP9 + Opus) - 推荐', en: 'WebM (VP9 + Opus) - Recommended' }, ext: 'webm' },
  { id: 'video/webm;codecs=vp8,opus', label: { zh: 'WebM (VP8 + Opus)', en: 'WebM (VP8 + Opus)' }, ext: 'webm' },
  { id: 'video/webm;codecs=vp9', label: { zh: 'WebM (VP9 无音频编码)', en: 'WebM (VP9 no audio codec)' }, ext: 'webm' },
  { id: 'video/webm;codecs=vp8', label: { zh: 'WebM (VP8 无音频编码)', en: 'WebM (VP8 no audio codec)' }, ext: 'webm' },
  { id: 'video/webm', label: { zh: 'WebM (默认)', en: 'WebM (default)' }, ext: 'webm' },
  { id: 'video/mp4;codecs=h264,aac', label: { zh: 'MP4 (H.264 + AAC) - 兼容性好', en: 'MP4 (H.264 + AAC) - Wide compat' }, ext: 'mp4' },
  { id: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', label: { zh: 'MP4 (H.264 Baseline + AAC)', en: 'MP4 (H.264 Baseline + AAC)' }, ext: 'mp4' },
  { id: 'video/mp4', label: { zh: 'MP4 (默认)', en: 'MP4 (default)' }, ext: 'mp4' },
];

const QUALITY_BITRATES: Record<Quality, number | null> = {
  low: 1_000_000,      // 1 Mbps
  medium: 2_500_000,  // 2.5 Mbps
  high: 5_000_000,    // 5 Mbps
  custom: null,        // 用户输入
};

const RESOLUTIONS: Record<Resolution, { width?: number; height?: number; label: string }> = {
  '720p': { width: 1280, height: 720, label: '1280×720' },
  '1080p': { width: 1920, height: 1080, label: '1920×1080' },
  '1440p': { width: 2560, height: 1440, label: '2560×1440' },
  'native': { label: '原生(跟随屏幕)' },
};

export default function ScreenRecorder() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [state, setState] = useState<RecordingState>('idle');
  const [quality, setQuality] = useState<Quality>('medium');
  const [customBitrate, setCustomBitrate] = useState<number>(3);
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [frameRate, setFrameRate] = useState<number>(30);
  const [audioSource, setAudioSource] = useState<AudioSource>('none');
  const [selectedMimeId, setSelectedMimeId] = useState<string>('');
  const [elapsed, setElapsed] = useState<number>(0);
  const [recordedSize, setRecordedSize] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [outputExt, setOutputExt] = useState<string>('webm');
  const [error, setError] = useState<string>('');

  // 运行时检测浏览器支持的格式
  const supportedMimeTypes = useMemo(() => {
    if (typeof MediaRecorder === 'undefined') return [];
    return CANDIDATE_MIME_TYPES.filter(m => {
      try {
        return MediaRecorder.isTypeSupported(m.id);
      } catch {
        return false;
      }
    });
  }, []);

  // 默认选第一个支持的格式
  useEffect(() => {
    if (!selectedMimeId && supportedMimeTypes.length > 0) {
      setSelectedMimeId(supportedMimeTypes[0].id);
    }
  }, [supportedMimeTypes, selectedMimeId]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sizeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 计时
  useEffect(() => {
    if (state === 'recording') {
      startTimeRef.current = Date.now() - elapsed * 1000;
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      sizeTimerRef.current = setInterval(() => {
        const total = chunksRef.current.reduce((sum, b) => sum + b.size, 0);
        setRecordedSize(total);
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (sizeTimerRef.current) { clearInterval(sizeTimerRef.current); sizeTimerRef.current = null; }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sizeTimerRef.current) clearInterval(sizeTimerRef.current);
    };
  }, [state, elapsed]);

  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => () => {
    stopTracks();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [stopTracks]);

  const pickAudioConstraints = () => {
    if (audioSource === 'none') return false;
    return true;
  };

  const start = async () => {
    setError('');
    setVideoUrl(null);
    chunksRef.current = [];
    setElapsed(0);
    setRecordedSize(0);

    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError(isZh ? '当前浏览器不支持屏幕录制 API(需 Chrome 72+ / Firefox 66+ / Edge 79+ / Safari 13+)' : 'Browser does not support getDisplayMedia (needs Chrome 72+ / Firefox 66+ / Edge 79+ / Safari 13+)');
      return;
    }

    try {
      // 1. 屏幕视频流
      const res = RESOLUTIONS[resolution];
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: res.width ? { ideal: res.width } : undefined,
          height: res.height ? { ideal: res.height } : undefined,
          frameRate: { ideal: frameRate, max: frameRate },
        },
        audio: audioSource === 'system' || audioSource === 'both',
      });

      const tracks = [...displayStream.getVideoTracks()];

      // 2. 麦克风音频(可选)
      if (audioSource === 'mic' || audioSource === 'both') {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          tracks.push(...micStream.getAudioTracks());
        } catch (e) {
          // 麦克风失败不阻塞,继续录制视频
          console.warn('Mic permission denied', e);
        }
      }

      // 合并流
      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      // 用户在浏览器原生 UI 点"停止共享"时同步停止
      displayStream.getVideoTracks()[0].addEventListener('ended', () => {
        stop();
      });

      // 3. 使用用户选择的 mimeType,如果不可用则降级到第一个支持的
      let mimeType = selectedMimeId;
      if (!mimeType && supportedMimeTypes.length > 0) {
        mimeType = supportedMimeTypes[0].id;
      }
      // 二次校验:用户选的格式在当前浏览器可能不支持(例如 Safari 不支持 WebM)
      if (mimeType && !MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = supportedMimeTypes[0]?.id || '';
      }
      const selectedMime = supportedMimeTypes.find(m => m.id === mimeType);
      setOutputExt(selectedMime?.ext || 'webm');

      // 4. bitrate
      let bitrate = QUALITY_BITRATES[quality];
      if (quality === 'custom') {
        bitrate = customBitrate * 1_000_000;
      }
      if (bitrate === null || bitrate < 100_000) bitrate = 2_500_000;

      // 5. MediaRecorder
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType || undefined,
        videoBitsPerSecond: bitrate,
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          setRecordedSize(chunksRef.current.reduce((sum, b) => sum + b.size, 0));
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setState('stopped');
        stopTracks();
      };

      recorder.start(1000); // 每秒一个 chunk,便于实时显示大小
      setState('recording');
    } catch (e: any) {
      if (e.name === 'NotAllowedError') {
        setError(isZh ? '用户拒绝授权或取消了屏幕共享' : 'Permission denied or screen share cancelled');
      } else {
        setError(isZh ? `启动失败: ${e.message}` : `Start failed: ${e.message}`);
      }
      stopTracks();
    }
  };

  const pause = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.pause();
      setState('paused');
    }
  };

  const resume = () => {
    if (mediaRecorderRef.current && state === 'paused') {
      mediaRecorderRef.current.resume();
      setState('recording');
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && state !== 'idle' && state !== 'stopped') {
      mediaRecorderRef.current.stop();
    }
  };

  const reset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setState('idle');
    setElapsed(0);
    setRecordedSize(0);
    chunksRef.current = [];
  };

  const download = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `momo-screen-${Date.now()}.${outputExt}`;
    a.click();
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const labelStyle = { color: 'var(--text-muted)' } as const;
  const cardStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  } as const;

  const isRecording = state === 'recording' || state === 'paused';

  return (
    <div className="flex flex-col gap-5">
      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg p-3 text-sm" style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* 录制中状态条 */}
      {isRecording && (
        <div className="rounded-xl p-4 flex items-center justify-between flex-wrap gap-3" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                background: state === 'recording' ? '#ef4444' : '#f59e0b',
                animation: state === 'recording' ? 'pulse 1.5s ease-in-out infinite' : undefined,
              }}
            />
            <span className="font-mono text-lg font-bold" style={{ color: 'var(--text)' }}>
              {formatTime(elapsed)}
            </span>
            <span className="text-xs" style={labelStyle}>
              {state === 'recording' ? (isZh ? '录制中' : 'Recording') : (isZh ? '已暂停' : 'Paused')}
            </span>
          </div>
          <span className="text-xs font-mono" style={labelStyle}>
            {formatSize(recordedSize)}
          </span>
        </div>
      )}

      {/* 设置面板(仅未录制时显示) */}
      {!isRecording && state !== 'stopped' && (
        <div className="flex flex-col gap-4">
          {/* 质量 */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={labelStyle}>{isZh ? '视频质量(码率)' : 'Video Quality (Bitrate)'}</label>
            <div className="flex flex-wrap gap-2">
              {([
                { id: 'low', label: isZh ? '低 (1 Mbps)' : 'Low (1 Mbps)' },
                { id: 'medium', label: isZh ? '中 (2.5 Mbps)' : 'Medium (2.5 Mbps)' },
                { id: 'high', label: isZh ? '高 (5 Mbps)' : 'High (5 Mbps)' },
                { id: 'custom', label: isZh ? '自定义' : 'Custom' },
              ] as { id: Quality; label: string }[]).map(q => (
                <button
                  key={q.id}
                  onClick={() => setQuality(q.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 animate-bounce-in"
                  style={{
                    background: quality === q.id ? 'var(--accent)' : 'var(--bg-2)',
                    color: quality === q.id ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${quality === q.id ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>
            {quality === 'custom' && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={0.1}
                  max={50}
                  step={0.1}
                  value={customBitrate}
                  onChange={e => setCustomBitrate(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg text-sm font-mono outline-none w-24"
                  style={cardStyle}
                />
                <span className="text-xs" style={labelStyle}>Mbps</span>
              </div>
            )}
          </div>

          {/* 分辨率 */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={labelStyle}>{isZh ? '分辨率' : 'Resolution'}</label>
            <div className="flex flex-wrap gap-2">
              {(['720p', '1080p', '1440p', 'native'] as Resolution[]).map(r => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 animate-bounce-in"
                  style={{
                    background: resolution === r ? 'var(--accent)' : 'var(--bg-2)',
                    color: resolution === r ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${resolution === r ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {r === 'native' ? (isZh ? '原生' : 'Native') : RESOLUTIONS[r].label}
                </button>
              ))}
            </div>
          </div>

          {/* 帧率 */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={labelStyle}>
              {isZh ? `帧率: ${frameRate} FPS` : `Frame Rate: ${frameRate} FPS`}
            </label>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={frameRate}
              onChange={e => setFrameRate(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent)' }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={labelStyle}>
              <span>10</span>
              <span>60</span>
              <span>120</span>
            </div>
            <p className="text-[10px] mt-1" style={labelStyle}>
              {isZh ? '⚠️ 实际帧率受显示器刷新率(常见 60/120/144 Hz)与录制源共同限制,设置过高可能无效' : '⚠️ Actual FPS is limited by display refresh rate (typically 60/120/144 Hz) and capture source; too high may have no effect'}
            </p>
          </div>

          {/* 音频来源 */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={labelStyle}>{isZh ? '音频来源' : 'Audio Source'}</label>
            <div className="flex flex-wrap gap-2">
              {([
                { id: 'none', label: isZh ? '无' : 'None' },
                { id: 'system', label: isZh ? '系统音频' : 'System Audio' },
                { id: 'mic', label: isZh ? '麦克风' : 'Microphone' },
                { id: 'both', label: isZh ? '系统+麦克风' : 'System + Mic' },
              ] as { id: AudioSource; label: string }[]).map(a => (
                <button
                  key={a.id}
                  onClick={() => setAudioSource(a.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 animate-bounce-in"
                  style={{
                    background: audioSource === a.id ? 'var(--accent)' : 'var(--bg-2)',
                    color: audioSource === a.id ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${audioSource === a.id ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
            {audioSource === 'system' && (
              <p className="text-[10px] mt-1" style={labelStyle}>
                {isZh ? '⚠️ 系统音频捕获仅 Chrome/Edge 在共享"整个屏幕"时支持,共享窗口/标签页不会捕获音频' : '⚠️ System audio capture is only supported in Chrome/Edge when sharing "Entire Screen", not for Window/Tab sharing'}
              </p>
            )}
          </div>

          {/* 视频格式 */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={labelStyle}>{isZh ? '视频格式' : 'Video Format'}</label>
            {supportedMimeTypes.length === 0 ? (
              <p className="text-xs" style={{ color: '#ef4444' }}>
                {isZh ? '当前浏览器不支持 MediaRecorder API,无法录制视频' : 'Browser does not support MediaRecorder API, recording unavailable'}
              </p>
            ) : (
              <>
                <select
                  value={selectedMimeId}
                  onChange={e => {
                    setSelectedMimeId(e.target.value);
                    const m = supportedMimeTypes.find(x => x.id === e.target.value);
                    setOutputExt(m?.ext || 'webm');
                  }}
                  className="px-3 py-2 rounded-lg text-sm outline-none w-full cursor-pointer"
                  style={cardStyle}
                >
                  {supportedMimeTypes.map(m => (
                    <option key={m.id} value={m.id}>{m.label[lang]}</option>
                  ))}
                </select>
                <p className="text-[10px] mt-1" style={labelStyle}>
                  {isZh
                    ? '⚠️ 实际可用格式由浏览器与系统决定,以上已自动过滤不可用项。WebM 体积小、质量高;MP4 兼容性好(部分浏览器不支持)。'
                    : '⚠️ Supported formats depend on your browser; unavailable options are filtered out. WebM is smaller & higher quality; MP4 has wider compatibility (not supported in some browsers).'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {state === 'idle' && (
        <button
          onClick={start}
          className="px-6 py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90 w-fit"
          style={{ background: 'var(--accent)' }}
        >
          {isZh ? '开始录制' : 'Start Recording'}
        </button>
      )}

      {state === 'recording' && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={pause}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--bg-3)', color: 'var(--text)' }}
          >
            {isZh ? '暂停' : 'Pause'}
          </button>
          <button
            onClick={stop}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#ef4444' }}
          >
            {isZh ? '停止录制' : 'Stop'}
          </button>
        </div>
      )}

      {state === 'paused' && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={resume}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            {isZh ? '继续' : 'Resume'}
          </button>
          <button
            onClick={stop}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#ef4444' }}
          >
            {isZh ? '停止录制' : 'Stop'}
          </button>
        </div>
      )}

      {/* 录制结果 */}
      {state === 'stopped' && videoUrl && (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {isZh ? '录制完成!' : 'Recording complete!'}
            <span className="ml-2 text-xs" style={labelStyle}>
              {formatTime(elapsed)} · {formatSize(recordedSize)}
            </span>
          </div>
          <video
            src={videoUrl}
            controls
            className="w-full rounded-xl"
            style={{ background: '#000', border: '1px solid var(--border)' }}
          />
          <div className="flex gap-3">
            <button
              onClick={download}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              {isZh ? '下载视频' : 'Download'}
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}
            >
              {isZh ? '重新录制' : 'Record Again'}
            </button>
          </div>
        </div>
      )}

      {/* 说明 */}
      {state === 'idle' && (
        <div className="text-[10px] rounded-lg p-3" style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}>
          {isZh ? (
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>使用说明:</p>
              <p>• 点击"开始录制"后,浏览器会弹出共享选择对话框,选择共享整个屏幕/窗口/标签页</p>
              <p>• 录制为 WebM 格式(VP9/VP8 编码),Chrome/Edge 默认支持,Safari 输出 MP4</p>
              <p>• 系统音频捕获需要 Chrome/Edge 且共享整个屏幕(不支持 macOS)</p>
              <p>• 录制结束在浏览器原生 UI 点"停止共享"按钮也会自动结束录制</p>
              <p>• 录制过程完全在本地,不上传任何数据</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Instructions:</p>
              <p>• Click "Start Recording", browser will prompt you to share entire screen / window / tab</p>
              <p>• Output is WebM (VP9/VP8); Chrome/Edge supported by default, Safari outputs MP4</p>
              <p>• System audio capture requires Chrome/Edge sharing entire screen (not supported on macOS)</p>
              <p>• Clicking "Stop sharing" in the browser native UI also ends the recording</p>
              <p>• Recording is fully local; no data is uploaded</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
