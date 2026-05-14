/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Metadata } from 'next';
import { Mail, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我们 - MOMO工具箱',
  description: 'MOMO工具箱是一个为您量身定制的一站式在线平台，旨在简化您的日常数字任务。不论是文本转换、图像处理还是开发调试，您都能在这里找到趁手的工具。',
  openGraph: {
    title: '关于我们 - MOMO工具箱',
    description: 'MOMO工具箱是一个为您量身定制的一站式在线平台，旨在简化您的日常数字任务。',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            关于 Web Tools (MOMO工具箱)
          </h1>
          <p className="text-xl text-text-site/60 leading-relaxed max-w-3xl font-medium">
            MOMO工具箱是一个为您量身定制的一站式在线平台，旨在简化您的日常数字任务。不论是文本转换、图像处理还是开发调试，您都能在这里找到趁手的工具，无需下载，即点即用。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-secondary-site/30 border border-border-site rounded-[32px] space-y-4">
            <h3 className="font-black text-primary uppercase tracking-widest text-xs">产品特色</h3>
            <p className="text-sm leading-loose opacity-80">
              我们精选了一系列高频使用的工具。您可以直接在搜索框输入关键词快速定位，或通过侧边栏分类浏览。大部分操作都经过直观设计，即使是复杂的转换工作也能在几秒内直观呈现。
            </p>
          </div>
          <div className="p-8 bg-secondary-site/30 border border-border-site rounded-[32px] space-y-4">
            <h3 className="font-black text-primary uppercase tracking-widest text-xs">隐私承诺</h3>
            <p className="text-sm leading-loose opacity-80">
              我们高度尊重您的隐私。除非涉及必要的 AI 联网功能，本站绝大部分计算均在您的浏览器本地完成，数据绝不上传，让您的敏感信息始终掌控在自己手中。
            </p>
          </div>
        </div>

        <div className="p-8 bg-primary/10 border border-primary/20 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/20">
            <Mail className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black mb-1">联系我们</h4>
            <p className="text-sm opacity-60 mb-4 md:mb-0">如果您有任何反馈或合作意向，欢迎通过邮件联系。</p>
          </div>
          <a 
            href="mailto:1902243211@qq.com" 
            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform"
          >
            1902243211@qq.com
          </a>
        </div>

        <div className="text-center pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-site border border-border-site rounded-xl text-sm font-medium text-text-site/60 hover:text-primary hover:border-primary/50 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
