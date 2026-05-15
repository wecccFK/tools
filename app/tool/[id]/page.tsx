/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Metadata } from 'next';
import { TOOLS } from '../../../src/constants';
import { ToolRenderer } from '../../../src/components/ToolRenderer';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = TOOLS.find(t => t.id === id);
  
  if (!tool) {
    return {
      title: '工具未找到 - MOMO工具箱',
      description: '您访问的工具不存在，请返回首页查看所有可用工具。',
    };
  }

  const title = tool.seoTitle?.zh || `${tool.name.zh} - MOMO工具箱`;
  const description = tool.seoDescription?.zh || tool.description.zh;

  return {
    title: `${title} | MOMO工具箱 - 免费在线工具`,
    description,
    keywords: tool.tags.join(','),
    openGraph: {
      title: `${title} | MOMO工具箱`,
      description,
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { id } = await params;
  const tool = TOOLS.find(t => t.id === id);

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-card-bg border border-border-site rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-purple-500 opacity-70" />
        
        <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-border-site">
          <tool.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
          <h1 className="font-rajdhani text-lg sm:text-xl font-semibold tracking-wide text-text-site">
            {tool.name.zh}
          </h1>
        </div>

        <div className="overflow-x-hidden min-h-[400px]">
          <ToolRenderer toolId={id} />
        </div>
      </div>
    </div>
  );
}
