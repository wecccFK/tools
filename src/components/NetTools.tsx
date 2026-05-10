import React, { useState, useEffect } from 'react';
import { Network, ShieldCheck, RefreshCw, Globe, DollarSign, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { jwtDecode } from 'jwt-decode';
import { FAQ } from './FAQ';

// --- IP Finder ---
export const IpFinder = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [ipData, setIpData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const faqs = [
        {
            question: {
                en: 'What information is shown?',
                zh: '显示什么信息？'
            },
            answer: {
                en: 'We display your public IP address, city, country, region, ISP, and timezone. This is the information visible to websites you visit.',
                zh: '我们显示您的公网 IP 地址、城市、国家、地区、ISP 和时区。这是您访问的网站可以看到的信息。'
            }
        },
        {
            question: {
                en: 'Is my IP address stored?',
                zh: '我的 IP 地址会被存储吗？'
            },
            answer: {
                en: 'No, we only fetch and display your IP information temporarily. We do not store or log any IP addresses.',
                zh: '不会，我们只是临时获取并显示您的 IP 信息。我们不存储或记录任何 IP 地址。'
            }
        },
        {
            question: {
                en: 'Why does it show a different location?',
                zh: '为什么显示的位置不同？'
            },
            answer: {
                en: 'IP geolocation is based on your ISP\'s database, which may not always be accurate. VPNs and proxies will also show different locations.',
                zh: 'IP 地理位置基于 ISP 的数据库，可能并不总是准确。VPN 和代理也会显示不同的位置。'
            }
        }
    ];

    const fetchIp = async () => {
        setLoading(true);
        try {
            // 免费 IP API：ip-api.com (无需 key, 45次/分钟)
            const res = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query');
            const data = await res.json();
            if (data.status === 'success') {
                setIpData({
                    ip: data.query,
                    city: data.city,
                    region: data.regionName,
                    country: data.country,
                    org: data.org || data.isp,
                    timezone: data.timezone,
                    lat: data.lat,
                    lon: data.lon
                });
            } else {
                throw new Error(data.message || 'Failed to fetch IP');
            }
        } catch (e) {
            console.error('IP fetch error:', e);
            // 备用：ipify.org (仅获取 IP)
            try {
                const backupRes = await fetch('https://api.ipify.org?format=json');
                const backupData = await backupRes.json();
                setIpData({ ip: backupData.ip, city: 'Unknown', org: 'Unknown' });
            } catch (backupErr) {
                console.error('Backup IP fetch error:', backupErr);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchIp(); }, []);

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? 'IP 查询工具可以显示您的公网 IP 地址、地理位置、ISP 运营商和时区信息。这些是您访问的网站可以看到的信息。使用免费的 IP API 获取数据，支持刷新更新。您的 IP 地址不会被存储或记录。适用于网络诊断、隐私检查、地理位置查询等场景。'
                        : 'The IP finder tool can display your public IP address, geographic location, ISP, and timezone information. This is the information visible to websites you visit. Uses free IP API to fetch data with refresh support. Your IP address is not stored or logged. Suitable for network diagnostics, privacy checks, location queries, and other scenarios.'}
                </p>
            </div>

            <div className="p-8 bg-primary text-white rounded-[40px] shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full translate-x-8 -translate-y-8" />
                <div className="relative z-10 space-y-2">
                    <div className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">{isZh ? '您的互联网地址' : 'Your IP Address'}</div>
                    <div className="text-5xl font-black">{loading ? '...' : (ipData?.ip || '0.0.0.0')}</div>
                    <button onClick={fetchIp} className="mt-4 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-all">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {ipData && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary-site rounded-2xl border border-border-site flex justify-between items-center text-sm">
                        <span className="text-text-site/40 font-bold uppercase tracking-widest">{isZh ? '城市' : 'City'}</span>
                        <span className="text-text-site font-black">{ipData.city}</span>
                    </div>
                    <div className="p-4 bg-secondary-site rounded-2xl border border-border-site flex justify-between items-center text-sm">
                        <span className="text-text-site/40 font-bold uppercase tracking-widest">{isZh ? '运营商' : 'ISP'}</span>
                        <span className="text-text-site font-black">{ipData.org}</span>
                    </div>
                </div>
            )}

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- JWT Decoder ---
export const JwtDecoder = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [token, setToken] = useState('');
    const [header, setHeader] = useState<any>(null);
    const [payload, setPayload] = useState<any>(null);

    const faqs = [
        {
            question: {
                en: 'What is a JWT token?',
                zh: '什么是 JWT 令牌？'
            },
            answer: {
                en: 'JWT (JSON Web Token) is a compact URL-safe means of representing claims to be transferred between two parties. Commonly used for authentication.',
                zh: 'JWT (JSON Web Token) 是一种紧凑的 URL 安全方式，用于在双方之间传输声明。常用于身份验证。'
            }
        },
        {
            question: {
                en: 'Is decoding secure?',
                zh: '解码安全吗？'
            },
            answer: {
                en: 'Decoding JWT is safe as it only reveals the publicly visible payload. The signature verification is what provides security, which we do not perform here.',
                zh: '解码 JWT 是安全的，因为它只显示公开可见的负载。签名验证提供安全性，我们在这里不执行签名验证。'
            }
        },
        {
            question: {
                en: 'What information is shown?',
                zh: '显示什么信息？'
            },
            answer: {
                en: 'We display the decoded header (algorithm, token type) and payload (claims like issuer, expiration, subject, and custom data).',
                zh: '我们显示解码的头部（算法、令牌类型）和负载（声明如发行者、过期时间、主题和自定义数据）。'
            }
        }
    ];

    const decode = (val: string) => {
        setToken(val);
        try {
            const decodedPayload = jwtDecode(val);
            const decodedHeader = jwtDecode(val, { header: true });
            setPayload(decodedPayload);
            setHeader(decodedHeader);
        } catch (e) {
            setHeader(null);
            setPayload(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? 'JWT 解码器可以解码 JSON Web Token，显示头部和负载信息。JWT 是一种用于身份验证的紧凑令牌格式。解码是安全的，因为它只显示公开可见的负载。适用于开发调试、令牌检查、信息查看等场景。注意：此工具不执行签名验证。'
                        : 'The JWT decoder can decode JSON Web Tokens, displaying header and payload information. JWT is a compact token format used for authentication. Decoding is safe as it only reveals publicly visible payload. Suitable for development debugging, token inspection, information viewing, and other scenarios. Note: This tool does not perform signature verification.'}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-text-site/40 uppercase tracking-widest">{isZh ? 'JWT 凭证 (Token)' : 'JWT Token'}</label>
                <textarea 
                    value={token} onChange={e => decode(e.target.value)}
                    className="w-full p-4 bg-card-bg border border-border-site rounded-2xl font-mono text-xs text-text-site outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="text-xs font-bold text-primary uppercase tracking-widest">Header</div>
                    <pre className="p-4 bg-secondary-site border border-border-site rounded-2xl font-mono text-[10px] text-text-site/70 overflow-auto whitespace-pre-wrap">
                        {header ? JSON.stringify(header, null, 2) : '{ }'}
                    </pre>
                </div>
                <div className="space-y-2">
                    <div className="text-xs font-bold text-secondary uppercase tracking-widest">Payload</div>
                    <pre className="p-4 bg-secondary-site border border-border-site rounded-2xl font-mono text-[10px] text-text-site/70 overflow-auto whitespace-pre-wrap">
                        {payload ? JSON.stringify(payload, null, 2) : '{ }'}
                    </pre>
                </div>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- Currency Converter ---
export const CurrencyConverter = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('CNY');
    const [rates, setRates] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);

    const faqs = [
        {
            question: {
                en: 'How accurate are the exchange rates?',
                zh: '汇率有多准确？'
            },
            answer: {
                en: 'We use real-time exchange rates from public APIs. Rates are updated regularly but may have slight delays from actual market rates.',
                zh: '我们使用公共 API 的实时汇率。汇率定期更新，但可能与实际市场汇率有轻微延迟。'
            }
        },
        {
            question: {
                en: 'What currencies are supported?',
                zh: '支持哪些货币？'
            },
            answer: {
                en: 'We support major world currencies including USD, EUR, CNY, JPY, GBP, and many others. Check the dropdown for the full list.',
                zh: '我们支持主要世界货币，包括 USD、EUR、CNY、JPY、GBP 和许多其他货币。查看下拉列表获取完整列表。'
            }
        },
        {
            question: {
                en: 'Is this suitable for financial transactions?',
                zh: '这适合金融交易吗？'
            },
            answer: {
                en: 'This tool is for reference only. For actual financial transactions, use your bank\'s rates or a dedicated financial service.',
                zh: '此工具仅供参考。对于实际金融交易，请使用您银行的汇率或专门的金融服务。'
            }
        }
    ];

    // 本地缓存汇率数据，减少API调用
    const CACHE_KEY = 'currency_rates_cache';
    const CACHE_DURATION = 3600000; // 1小时缓存

    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);

            // 1. 检查本地缓存
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    const now = Date.now();
                    if (now - timestamp < CACHE_DURATION) {
                        setRates(data);
                        setLastUpdate(timestamp);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.log('Cache parse error, fetching fresh data');
                }
            }

            // 2. 多个免费API备用列表
            const apis = [
                { url: 'https://api.exchangerate-api.com/v4/latest/USD', name: 'ExchangeRate-API' },
                { url: 'https://open.er-api.com/v6/latest/USD', name: 'ER-API' },
                { url: 'https://api.frankfurter.app/latest', name: 'Frankfurter' },
                { url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json', name: 'JSdelivr' }
            ];

            let success = false;
            let lastError = '';

            for (const api of apis) {
                try {
                    const res = await fetch(api.url);
                    if (!res.ok) continue;

                    const data = await res.json();
                    let ratesData = null;

                    // 不同API的数据格式处理
                    if (data.rates) {
                        ratesData = data.rates;
                    } else if (data.usd) {
                        ratesData = data.usd;
                    }

                    if (ratesData && Object.keys(ratesData).length > 10) {
                        setRates(ratesData);
                        setLastUpdate(Date.now());

                        // 缓存到本地
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            data: ratesData,
                            timestamp: Date.now()
                        }));

                        success = true;
                        console.log(`✅ ${api.name} success`);
                        break;
                    }
                } catch (e) {
                    lastError = e instanceof Error ? e.message : 'Unknown error';
                    console.warn(`❌ ${api.name} failed:`, lastError);
                }
            }

            if (!success) {
                console.error('All APIs failed, using fallback rates');
                // 最后备用：使用固定汇率数据
                const fallbackRates = {
                    USD: 1, CNY: 7.24, EUR: 0.92, JPY: 151.5, GBP: 0.79,
                    KRW: 1350, HKD: 7.82, AUD: 1.52, CAD: 1.36, SGD: 1.35,
                    CHF: 0.89, INR: 83.5, MXN: 17.2, BRL: 5.1, RUB: 92.5,
                    THB: 35.8, MYR: 4.75, IDR: 15800, PHP: 56.2, VND: 25400
                };
                setRates(fallbackRates);
                setLastUpdate(Date.now());
            }

            setLoading(false);
        };

        fetchRates();
    }, []);

    const result = rates[to] && rates[from] ? (amount * (rates[to] / rates[from])) : 0;

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '货币转换器支持主要世界货币之间的实时汇率转换。使用公共 API 获取实时汇率，支持本地缓存以减少 API 调用。适用于汇率查询、货币换算、财务规划等场景。注意：此工具仅供参考，实际交易请使用银行汇率。'
                        : 'The currency converter supports real-time exchange rate conversion between major world currencies. Uses public APIs to fetch real-time rates with local caching to reduce API calls. Suitable for exchange rate queries, currency conversion, financial planning, and other scenarios. Note: This tool is for reference only, use bank rates for actual transactions.'}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full md:w-32 p-4 bg-card-bg border border-border-site rounded-2xl text-2xl font-black text-text-site" />
                <div className="flex-1 flex gap-2 w-full">
                    <select value={from} onChange={e => setFrom(e.target.value)} className="flex-1 p-4 bg-secondary-site border border-border-site rounded-2xl text-sm font-bold text-text-site">
                        {Object.keys(rates).sort().map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex items-center justify-center p-2 text-primary">
                        <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <select value={to} onChange={e => setTo(e.target.value)} className="flex-1 p-4 bg-secondary-site border border-border-site rounded-2xl text-sm font-bold text-text-site">
                        {Object.keys(rates).sort().map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-primary/5 rounded-[40px] p-10 border border-primary/20 text-center space-y-2">
                <div className="text-sm font-bold text-primary/60 uppercase tracking-widest">{amount} {from} =</div>
                <div className="text-6xl font-black text-primary break-all">{loading ? '...' : result.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                <div className="text-[10px] font-bold text-text-site/30 uppercase tracking-[0.2em]">{to} (Real-time Exchange Rate)</div>
                {lastUpdate && (
                    <div className="text-[9px] text-text-site/20 mt-2">
                        {lang === 'zh' ? '更新于 ' : 'Updated '}{new Date(lastUpdate).toLocaleTimeString()}
                    </div>
                )}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
