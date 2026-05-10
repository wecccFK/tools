import { Metadata } from 'next';
import { Mail, Info, Target, Cpu, Users, Globe } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: '关于我们 | MOMO工具箱',
  description: '了解 MOMO工具箱 (Web Tools) 的开发初衷、技术栈、团队理念以及联系方式。',
};

export default function AboutPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-14">
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            关于 MOMO工具箱
          </h1>
          <p className="text-lg text-text2 leading-relaxed max-w-3xl">
            MOMO工具箱是一个专注于效率与实用性的在线工具平台，致力于为用户提供无需安装、随用随走的数字处理体验。无论是开发者调试接口、设计师处理图片，还是学生转换文档格式，都能在这里找到趁手的工具。
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-bg2 border border-border-site rounded-[32px] space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-black text-primary uppercase tracking-widest text-xs">产品使命</h3>
            </div>
            <p className="text-sm leading-loose text-text2">
              我们相信，好的工具应该像瑞士军刀一样——功能丰富、一触即达，无需漫长的安装和配置过程。MOMO工具箱的使命是将复杂的技术操作简化为几次点击，让每个人都能高效完成数字任务。
            </p>
            <p className="text-sm leading-loose text-text2">
              我们精心挑选和设计每一个工具，确保它们真正解决实际问题，而不是华而不实的功能堆砌。
            </p>
          </div>
          <div className="p-8 bg-bg2 border border-border-site rounded-[32px] space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-black text-primary uppercase tracking-widest text-xs">核心优势</h3>
            </div>
            <p className="text-sm leading-loose text-text2">
              <strong>本地计算优先：</strong>绝大多数工具运行在您的浏览器中，数据不经过服务器，信息安全有保障。即使是复杂的图像处理，也在您的设备上完成处理。
            </p>
            <p className="text-sm leading-loose text-text2">
              <strong>轻量即时：</strong>无需注册、无需登录、无需安装任何插件。打开网页即可使用，随时随地，不受设备限制。
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="p-8 bg-bg2 border border-border-site rounded-[32px] space-y-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black text-primary uppercase tracking-widest text-xs">技术架构</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-text2">
            <p>MOMO工具箱采用 Next.js 14 App Router 构建，结合 React 18 与 TypeScript，确保代码的可维护性与扩展性。</p>
            <p>前端样式基于 Tailwind CSS，采用深色主题设计语言，提供一致且舒适的视觉体验。</p>
            <p>图像处理工具借助 Canvas API 与 WebGL 实现高效渲染，部分 AI 功能调用 OpenAI 接口。</p>
            <p>使用 Vercel 进行全球 CDN 部署，确保快速响应和稳定可用性。</p>
          </div>
        </div>

        {/* Team */}
        <div className="p-8 bg-bg2 border border-border-site rounded-[32px] space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black text-primary uppercase tracking-widest text-xs">关于开发者</h2>
          </div>
          <p className="text-sm leading-loose text-text2">
            MOMO工具箱由个人开发者独立设计与维护。开发者的背景是 Web 全栈开发，长期活跃于前端工程化与用户体验优化领域。创建这个平台的初衷很简单：想把日常开发中反复使用的工具整理起来，同时分享给有同样需求的朋友。
          </p>
          <p className="text-sm leading-loose text-text2">
            平台的每一个功能都经过真实使用场景的验证，力求做到简洁、易用、稳定。如果您在使用过程中有任何问题或建议，欢迎联系反馈，共同推动平台成长。
          </p>
        </div>

        {/* Contact Card */}
        <div className="p-8 bg-primary/10 border border-primary/20 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/20">
            <Mail className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black mb-1">联系我们</h4>
            <p className="text-sm text-text2 mb-4 md:mb-0">如果您有任何反馈或合作意向，欢迎通过邮件联系。</p>
          </div>
          <a
            href="mailto:1902243211@qq.com"
            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform"
          >
            1902243211@qq.com
          </a>
        </div>
      </div>
    </AppShell>
  );
}