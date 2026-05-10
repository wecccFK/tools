import React from 'react';
import { Mail, ShieldCheck, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const AboutPage = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';

    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Info className="w-6 h-6" />
                    </div>
                    {isZh ? '关于 Web Tools (MOMO工具箱)' : 'About Web Tools (MOMO)'}
                </h1>
                <p className="text-xl text-text-site/60 leading-relaxed max-w-3xl font-medium">
                    {isZh 
                        ? 'MOMO工具箱是一个为您量身定制的一站式在线平台，旨在简化您的日常数字任务。不论是文本转换、图像处理还是开发调试，您都能在这里找到趁手的工具，无需下载，即点即用。' 
                        : 'MOMO is a one-stop online platform tailored for you, designed to simplify your daily digital tasks. Whether it is text conversion, image processing, or developer debugging, you can find the right tools here—no download needed, just click and use.'}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-secondary-site/30 border border-border-site rounded-[32px] space-y-4">
                    <h3 className="font-black text-primary uppercase tracking-widest text-xs">{isZh ? '产品特色' : 'FEATURES'}</h3>
                    <p className="text-sm leading-loose opacity-80">
                        {isZh 
                            ? '我们精选了一系列高频使用的工具。您可以直接在搜索框输入关键词快速定位，或通过侧边栏分类浏览。大部分操作都经过直观设计，即使是复杂的转换工作也能在几秒内直观呈现。' 
                            : 'We have curated a series of high-frequency tools. You can search keywords to find them quickly or browse via sidebar categories. Most operations are intuitively designed to deliver results in seconds.'}
                    </p>
                </div>
                <div className="p-8 bg-secondary-site/30 border border-border-site rounded-[32px] space-y-4">
                    <h3 className="font-black text-primary uppercase tracking-widest text-xs">{isZh ? '隐私承诺' : 'PRIVACY COMMITMENT'}</h3>
                    <p className="text-sm leading-loose opacity-80">
                        {isZh 
                            ? '我们高度尊重您的隐私。除非涉及必要的 AI 联网功能，本站绝大部分计算均在您的浏览器本地完成，数据绝不上传，让您的敏感信息始终掌控在自己手中。' 
                            : 'We highly respect your privacy. Unless necessary for AI online features, most computations on this site are completed locally in your browser. Your data is never uploaded, keeping your sensitive information in your own hands.'}
                    </p>
                </div>
            </div>

            <div className="p-8 bg-primary/10 border border-primary/20 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/20">
                    <Mail className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-black mb-1">{isZh ? '联系我们' : 'Contact Us'}</h4>
                    <p className="text-sm opacity-60 mb-4 md:mb-0">{isZh ? '如果您有任何反馈或合作意向，欢迎通过邮件联系。' : 'If you have any feedback or business inquiry, please contact us via email.'}</p>
                </div>
                <a 
                    href="mailto:1902243211@qq.com" 
                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform"
                >
                    1902243211@qq.com
                </a>
            </div>
        </div>
    );
};

export const PrivacyPolicyPage = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';

    const sections = isZh ? [
        {
            title: "数据收集",
            content: "我们不会在服务器上存储您通过本工具处理的任何个人数据、文本内容或图片。所有的处理（加密、转换、格式化）均在您的本地浏览器中完成。"
        },
        {
            title: "AI 功能特别说明",
            content: "当您使用标注有“AI”功能的工具（如 AI 润色）时，您输入的文本会加密发送至大模型服务器进行处理。我们不会存储这些交互记录，但我们会调用 OpenAI 或 Google 的相关接口。"
        },
        {
            title: "LocalStorage 存储",
            content: "我们使用浏览器的 LocalStorage 来存储您的偏好设置（如收藏的工具列表），这些数据完全保留在您的设备上。"
        },
        {
            title: "Google AdSense 广告",
            content: "本站集成 Google AdSense 服务以展示广告。Google 会使用 Cookie 根据您访问本网站或其他网站的情况向您展示相关的广告。您可以访问 Google 的广告设置页面来管理这些个性化设置。"
        }
    ] : [
        {
            title: "Data Collection",
            content: "We do not store any personal data, text content, or images you process through this toolkit on our servers. All processing (encryption, conversion, formatting) is finished within your local browser."
        },
        {
            title: "AI Feature Notice",
            content: "When using tools marked with 'AI' features (e.g., AI Enhancer), your input text is encrypted and sent to LLM servers for processing. We do not store these records, but we invoke related APIs from OpenAI or Google."
        },
        {
            title: "Local Storage",
            content: "We use browser LocalStorage to store your preferences (such as your starred tool list), which stays entirely on your device."
        },
        {
            title: "Google AdSense",
            content: "We use Google AdSense to serve ads. Google uses cookies to serve ads based on a user's prior visits to this website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings."
        }
    ];

    return (
        <div className="space-y-12 max-w-4xl">
            <div className="space-y-6">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                    {isZh ? '隐私政策' : 'Privacy Policy'}
                </h1>
                <p className="text-text-site/60">{isZh ? '最后更新：2026年4月20日' : 'Last Updated: April 20, 2026'}</p>
            </div>
            
            <div className="space-y-10">
                {sections.map((s, i) => (
                    <section key={i} className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <div className="w-2 h-6 bg-primary rounded-full" />
                            {s.title}
                        </h2>
                        <p className="text-sm leading-loose opacity-70 border-l-2 border-secondary-site pl-6">
                            {s.content}
                        </p>
                    </section>
                ))}
            </div>
        </div>
    );
};

export const DisclaimerPage = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';

    return (
        <div className="space-y-12 max-w-4xl">
            <div className="space-y-6">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                    {isZh ? '免责声明' : 'Disclaimer'}
                </h1>
            </div>
            
            <div className="bg-secondary-site/30 border border-border-site rounded-[40px] p-10 space-y-8 leading-loose text-sm opacity-80">
                <p>
                    {isZh 
                        ? '1. 本网站（Web Tools / MOMO工具箱）提供的所有功能均“按原样”提供，不附带任何明示或暗示的保证。对于使用本站工具而导致的数据丢失、误读或任何其他形式的损害，我们概不负责。' 
                        : '1. All functions provided by this website (Web Tools / MOMO) are provided "as is" without any express or implied guarantees. We are not responsible for any data loss, misreading, or any other form of damage caused by using tools on this site.'}
                </p>
                <p>
                    {isZh 
                        ? '2. 本站由 Web Tools (MOMO) 提供，致力于提供实用的各种开发者与设计工具。本站集成 Google AdSense 广告以维持运营。点击外部链接风险由您自行承担。' 
                        : '2. This site is provided by Web Tools (MOMO), committed to providing useful developer and design tools. This site integrates Google AdSense ads for operation. Clicking external links is at your own risk.'}
                </p>
                <p>
                    {isZh 
                        ? '3. 虽然我们尽力确保所有计算和处理的准确性，但用户在将计算结果用于金融、法律、医疗等严肃领域前，请务必进行独立核实。' 
                        : '3. While we strive to ensure accuracy, users must independently verify results before using them for serious fields such as finance, law, or medicine.'}
                </p>
            </div>
        </div>
    );
};
