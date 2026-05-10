import React, { useState, useEffect, useRef } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import zxcvbn from 'zxcvbn';
import { 
  Shield, 
  Terminal, 
  Fingerprint, 
  Globe, 
  Monitor, 
  Cpu, 
  Type, 
  Video, 
  Music,
  Share2,
  Lock,
  Zap,
  Activity,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

/**
 * Tool 1: Browser Fingerprint Generator
 */
export const FingerprintGenerator = () => {
  const { lang, t } = useLanguage();
  const isZh = lang === 'zh';
  const [loading, setLoading] = useState(true);
  const [visitorId, setVisitorId] = useState('');
  const [components, setComponents] = useState<any>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const faqs = [
    {
      question: {
        en: 'What is a browser fingerprint?',
        zh: '什么是浏览器指纹？'
      },
      answer: {
        en: 'A browser fingerprint is a unique identifier based on your device and browser characteristics like screen resolution, installed fonts, and hardware specs. It works without cookies.',
        zh: '浏览器指纹是基于您的设备和浏览器特征（如屏幕分辨率、已安装字体和硬件规格）的唯一标识符。它无需 Cookie 即可工作。'
      }
    },
    {
      question: {
        en: 'Is my data stored or sent anywhere?',
        zh: '我的数据会被存储或发送到任何地方吗？'
      },
      answer: {
        en: 'No, all fingerprinting happens locally in your browser. We do not store, transmit, or log any of your personal information or fingerprint data.',
        zh: '不会，所有指纹识别都在您的浏览器本地进行。我们不存储、传输或记录您的任何个人信息或指纹数据。'
      }
    },
    {
      question: {
        en: 'How can I protect my privacy?',
        zh: '如何保护我的隐私？'
      },
      answer: {
        en: 'Use privacy-focused browsers like Brave or Firefox with anti-fingerprinting features. Regularly clear cookies, use VPNs, and avoid browser extensions that leak data.',
        zh: '使用注重隐私的浏览器（如 Brave 或 Firefox）并启用反指纹功能。定期清除 Cookie，使用 VPN，并避免泄露数据的浏览器扩展。'
      }
    }
  ];

  useEffect(() => {
    const getFingerprint = async () => {
      setLoading(true);
      setScanProgress(0);
      
      const interval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 5, 95));
      }, 50);

      try {
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        
        setVisitorId(result.visitorId);
        setComponents(result.components);
      } catch (error) {
        console.error('Fingerprint error:', error);
      } finally {
        setScanProgress(100);
        setTimeout(() => {
          setLoading(false);
          clearInterval(interval);
        }, 500);
      }
    };

    getFingerprint();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Fingerprint className="w-10 h-10 text-primary animate-bounce" />
          </div>
          <svg className="absolute -inset-2 w-28 h-28 -rotate-90">
            <circle 
              cx="56" cy="56" r="54" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="text-primary transition-all duration-300"
              strokeDasharray={340}
              strokeDashoffset={340 - (340 * scanProgress) / 100}
            />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black">{isZh ? '正在深度扫描硬件指纹...' : 'Scanning Hardware Fingerprint...'}</h3>
          <p className="text-text-site/40 text-sm font-mono">{scanProgress}% - Analyzing Canvas & WebGL...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { 
      label: isZh ? '身份标识' : 'Identity', 
      icon: Fingerprint,
      items: [
        { key: 'Visitor ID', value: visitorId, highlight: true }
      ]
    },
    { 
      label: isZh ? '显示与图形' : 'Display & Graphics', 
      icon: Monitor,
      items: [
        { key: 'Screen', value: `${components?.screenResolution?.value[0]}x${components?.screenResolution?.value[1]} @ ${components?.screenFrame?.value[0]}x${components?.screenFrame?.value[1]}` },
        { key: 'Color Depth', value: `${components?.colorDepth?.value} bit` },
        { key: 'WebGL Vendor', value: components?.webglVendorAndRenderer?.value[0] || 'Unknown' },
        { key: 'WebGL Renderer', value: components?.webglVendorAndRenderer?.value[1] || 'Unknown' }
      ]
    },
    { 
      label: isZh ? '硬件特征' : 'Hardware', 
      icon: Cpu,
      items: [
        { key: 'CPU Cores', value: components?.hardwareConcurrency?.value || 'N/A' },
        { key: 'RAM Estimate', value: components?.deviceMemory?.value ? `${components?.deviceMemory?.value} GB` : 'N/A' },
        { key: 'Platform', value: components?.platform?.value },
        { key: 'User Agent', value: navigator.userAgent, wrap: true }
      ]
    },
    { 
      label: isZh ? '隐私细节' : 'Privacy Details', 
      icon: Eye,
      items: [
        { key: 'Language', value: components?.languages?.value?.join(', ') },
        { key: 'Timezone', value: components?.timezone?.value },
        { key: 'Cookies', value: components?.cookiesEnabled?.value ? 'Active' : 'Disabled' },
        { key: 'DNT', value: components?.doNotTrack?.value === '1' ? 'Enabled' : 'Disabled' }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? '浏览器指纹生成器可以基于您的设备和浏览器特征（如屏幕分辨率、已安装字体、硬件规格）生成唯一标识符。无需 Cookie 即可工作。所有指纹识别都在浏览器本地进行，不存储或传输任何数据。适用于隐私检查、安全测试、浏览器特征分析等场景。'
            : 'The browser fingerprint generator can generate a unique identifier based on your device and browser characteristics like screen resolution, installed fonts, and hardware specs. Works without cookies. All fingerprinting happens locally in your browser, no data is stored or transmitted. Suitable for privacy checks, security testing, browser characteristic analysis, and other scenarios.'}
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-[28px] md:rounded-[32px] p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary text-white rounded-xl md:rounded-2xl shadow-xl shadow-primary/20">
                <Shield className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">{isZh ? '浏览器指纹检测' : 'Browser Fingerprint'}</h2>
            </div>
            <p className="text-text-site/60 max-w-xl text-sm md:text-base leading-relaxed">
              {isZh 
                ? '不通过 Cookie，仅凭浏览器和显卡的硬件特征即可生成全球唯一的 ID。请看我们在不登录的情况下能获取到关于你的多少信息。' 
                : 'Generate a unique ID based on hardware and browser characteristics without cookies. See how much info we can gather without login.'}
            </p>
          </div>
          <div className="bg-card-bg/80 backdrop-blur-md p-5 md:p-6 rounded-[24px] border border-primary/20 shadow-xl w-full md:w-auto md:min-w-[320px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Unique Fingerprint ID</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="font-mono text-base md:text-lg font-black tracking-tighter break-all">{visitorId}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(visitorId);
                  // toast success
                }}
                className="w-full sm:w-auto p-3 sm:p-2 flex items-center justify-center gap-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-bold sm:hidden">{isZh ? '复制' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-card-bg border border-border-site rounded-[24px] md:rounded-[32px] p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 text-text-site/40">
              <section.icon className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest">{section.label}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item, idy) => (
                <div key={idy} className="group/item">
                  <p className="text-[10px] font-black uppercase tracking-wider text-text-site/30 mb-1">{item.key}</p>
                  <p className={cn(
                    "text-sm font-mono break-all line-clamp-2 group-hover/item:line-clamp-none transition-all",
                    item.highlight ? "text-primary font-black" : "text-text-site/80"
                  )}>
                    {item.value || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[32px] p-8 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
        <div className="space-y-2">
          <h4 className="font-black text-yellow-500">{isZh ? '隐私建议' : 'Privacy Tip'}</h4>
          <p className="text-sm text-text-site/60 leading-relaxed">
            {isZh 
              ? '为了防止这种追踪，建议使用支持“防指纹”功能的浏览器（如 Brave 或 Librewolf），或者定期启用隐身模式并更换网络 IP。' 
              : 'To prevent this tracking, consider using browsers with built-in "anti-fingerprinting" (like Brave or Librewolf) or regularly use incognito modes and rotate your IP.'}
          </p>
        </div>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};

/**
 * Tool 3: Hacker Style Password Strength Simulator
 */
export const PasswordCrackSimulator = () => {
  const { lang, t } = useLanguage();
  const isZh = lang === 'zh';
  const [password, setPassword] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: {
        en: 'Is this actually cracking passwords?',
        zh: '这真的在破解密码吗？'
      },
      answer: {
        en: 'No, this is a simulation that estimates crack time based on mathematical entropy. We do not perform any actual cracking or send your password anywhere.',
        zh: '不，这是一个基于数学熵值估算破解时间的模拟。我们不进行任何实际的破解，也不会将您的密码发送到任何地方。'
      }
    },
    {
      question: {
        en: 'How is crack time calculated?',
        zh: '破解时间是如何计算的？'
      },
      answer: {
        en: 'We use the zxcvbn algorithm to estimate password entropy, then calculate theoretical crack time based on GPU hash rate assumptions. Real-world times may vary.',
        zh: '我们使用 zxcvbn 算法估算密码熵值，然后基于 GPU 哈希率假设计算理论破解时间。实际时间可能会有所不同。'
      }
    },
    {
      question: {
        en: 'What makes a password strong?',
        zh: '什么使密码强？'
      },
      answer: {
        en: 'Strong passwords are long (12+ characters), use a mix of uppercase, lowercase, numbers, and symbols, and avoid common words or patterns. Passphrases are often better.',
        zh: '强密码长度长（12 个以上字符），混合使用大写、小写、数字和符号，并避免常见单词或模式。密码短语通常更好。'
      }
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const runSimulation = () => {
    if (!password) return;
    
    setIsSimulating(true);
    setLogs([]);
    const result = zxcvbn(password);
    setStats(result);

    const stages = [
      'Initializing GPU brute-force cluster...',
      'Targeting password entropy: ' + result.guesses_log10.toFixed(2) + ' bits',
      'Attempting pattern matching (L3 dictionary)...',
      'Brute-forcing sequence variations...',
      'Testing common leetspeak substitutions...',
      'Calculating probability of intersection...',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < stages.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${stages[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLogs(prev => [...prev, '>>> CRACKING ATTEMPT COMPLETE <<<']);
          setIsSimulating(false);
        }, 1000);
      }
    }, 400);

    // Mock high-speed attempts
    const attemptsInterval = setInterval(() => {
      if (i < stages.length) {
        setLogs(prev => [...prev, `Trying: ${Math.random().toString(36).substring(7)}${Math.floor(Math.random()*1000)} ... DENIED`]);
      } else {
        clearInterval(attemptsInterval);
      }
    }, 80);
  };

  const getCrackTime = () => {
    if (!stats) return '';
    const time = stats.crack_times_display.offline_slow_hashing_1e4_per_second;
    return isZh ? time.replace('centuries', '个世纪').replace('years', '年').replace('months', '个月').replace('days', '天').replace('hours', '小时').replace('minutes', '分钟').replace('seconds', '秒') : time;
  };

  return (
    <div className="space-y-8">
      <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
        <p className="text-sm text-text-site/70 leading-relaxed">
          {isZh
            ? '密码破解模拟器基于数学熵值估算密码破解时间，使用 zxcvbn 算法。这是一个模拟工具，不进行实际破解，也不会将密码发送到任何地方。适用于密码强度测试、安全意识教育、密码选择参考等场景。强密码应包含多种字符类型且长度足够。'
            : 'The password crack simulator estimates password crack time based on mathematical entropy using the zxcvbn algorithm. This is a simulation tool that does not perform actual cracking or send passwords anywhere. Suitable for password strength testing, security awareness education, password selection reference, and other scenarios. Strong passwords should include multiple character types and be sufficiently long.'}
        </p>
      </div>

      <div className="bg-card-bg border border-border-site rounded-[32px] md:rounded-[40px] p-6 md:p-12 space-y-8 md:space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Terminal className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">{isZh ? '黑客终端：密码破解测速' : 'Hacker Password Simulator'}</h2>
          <p className="text-text-site/50 text-sm md:text-base px-2">
            {isZh 
              ? '纯数学熵值计算，实时模拟暴力破解耗时。看看黑客用专业显卡扒开你的密码需要多久。' 
              : 'Pure mathematical entropy calculation. Simulate real-world brute-force crack time. See how long a hacker needs to crack your password.'}
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-site/20" />
              <input 
                type="text"
                placeholder={isZh ? '输入密码进行测速...' : 'Enter target password...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 md:py-5 bg-secondary-site border border-border-site rounded-[20px] md:rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono"
              />
            </div>
            <button 
              onClick={runSimulation}
              disabled={isSimulating || !password}
              className="w-full sm:w-auto px-8 py-4 sm:py-0 bg-primary text-white rounded-[20px] md:rounded-[24px] font-black text-sm uppercase tracking-widest disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Zap className={cn("w-4 h-4", isSimulating && "animate-spin")} />
              {isSimulating ? (isZh ? '破解中' : 'CRACKING') : (isZh ? '开始模拟' : 'INITIATE')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[500px]">
          {/* Terminal View */}
          <div className="bg-black rounded-3xl p-6 font-mono text-sm overflow-hidden flex flex-col border border-white/5 relative h-[300px] lg:h-auto">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="text-[10px] text-white/20 uppercase tracking-widest ml-2">Cracking Engine v4.0.2</span>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2"
            >
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/5 italic">
                  Waiting for input target...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={cn(
                    "transition-all duration-300",
                    log.includes('Trying') ? "text-white/20 text-[10px]" : "text-green-500"
                  )}>
                    {log}
                  </div>
                ))
              )}
              {isSimulating && <div className="text-green-500 animate-pulse">_</div>}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>

          {/* Report View */}
          <div className="space-y-6 flex flex-col">
            <AnimatePresence mode="wait">
              {!stats ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 bg-secondary-site/30 rounded-[32px] border border-dashed border-border-site">
                  <Search className="w-12 h-12 text-text-site/10" />
                  <p className="text-sm font-medium text-text-site/30">Enter a target password to see technical impact</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 flex-1 flex flex-col"
                >
                  <div className="p-8 bg-primary text-white rounded-[32px] shadow-2xl shadow-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                      <Activity className="w-24 h-24 opacity-10" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Estimated Crack Time (Offline)</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-4">{getCrackTime()}</h3>
                    <div className="flex items-center gap-4">
                      <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: (stats.score + 1) * 0.2 }}
                          style={{ transformOrigin: 'left center', width: '100%' }}
                          className="h-full bg-white"
                        />
                      </div>
                      <span className="text-xs font-black">Score: {stats.score}/4</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-card-bg border border-border-site rounded-3xl">
                      <p className="text-[10px] font-black uppercase tracking-wider text-text-site/30 mb-1">Entropy</p>
                      <p className="text-xl font-mono font-black">{stats.guesses_log10.toFixed(2)} bits</p>
                    </div>
                    <div className="p-6 bg-card-bg border border-border-site rounded-3xl">
                      <p className="text-[10px] font-black uppercase tracking-wider text-text-site/30 mb-1">Guess Count</p>
                      <p className="text-xl font-mono font-black">10^{Math.floor(stats.guesses_log10)}</p>
                    </div>
                  </div>

                  <div className="flex-1 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-[32px] space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-yellow-600 flex items-center gap-2">
                       <AlertTriangle className="w-3 h-3" /> System Feedback
                    </h4>
                    <div className="space-y-2">
                      {stats.feedback.warning && <p className="text-xs text-yellow-700 font-bold">⚠️ {stats.feedback.warning}</p>}
                      {stats.feedback.suggestions?.map((s: string, i: number) => (
                        <p key={i} className="text-xs text-text-site/60 flex items-start gap-2">
                           <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-green-500" /> {s}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
};
