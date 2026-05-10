import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: '隐私政策 | MOMO工具箱',
  description: '详细了解我们如何保护您的隐私、本地数据存储以及第三方辅助说明。',
};

const sections = [
  {
    title: "数据收集",
    content: "我们不会在服务器上存储您通过本工具处理的任何个人数据、文本内容或图片。所有的处理（加密、转换、格式化）均在您的本地浏览器中完成。"
  },
  {
    title: "AI 功能特别说明",
    content: "当您使用标注有'AI'功能的工具（如 AI 润色）时，您输入的文本会加密发送至大模型服务器进行处理。我们不会存储这些交互记录，但我们会调用 OpenAI 或 Google 的相关接口。"
  },
  {
    title: "LocalStorage 存储",
    content: "我们使用浏览器的 LocalStorage 来存储您的偏好设置（如收藏的工具列表），这些数据完全保留在您的设备上。"
  },
  {
    title: "Google AdSense 广告",
    content: "本站集成 Google AdSense 服务以展示广告。Google 会使用 Cookie 根据您访问本网站或其他网站的情况向您展示相关的广告。您可以访问 Google 的广告设置页面来管理这些个性化设置。"
  }
];

export default function PrivacyPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-green-500" />
            隐私政策
          </h1>
          <p className="text-text-muted">最后更新：2026年4月20日</p>
        </div>
        
        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i} className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-2 h-6 bg-primary rounded-full" />
                {s.title}
              </h2>
              <p className="text-sm leading-loose text-text2 border-l-2 border-border-site pl-6">
                {s.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
