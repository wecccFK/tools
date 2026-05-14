/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '免责声明 - MOMO工具箱',
  description: 'MOMO工具箱免责声明。本网站提供的所有功能均"按原样"提供，不附带任何明示或暗示的保证。',
  openGraph: {
    title: '免责声明 - MOMO工具箱',
    description: 'MOMO工具箱免责声明。本网站提供的所有功能均"按原样"提供。',
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
            免责声明
          </h1>
        </div>
        
        <div className="bg-secondary-site/30 border border-border-site rounded-[40px] p-10 space-y-8 leading-loose text-sm opacity-80">
          <p>
            1. 本网站（Web Tools / MOMO工具箱）提供的所有功能均"按原样"提供，不附带任何明示或暗示的保证。对于使用本站工具而导致的数据丢失、误读或任何其他形式的损害，我们概不负责。
          </p>
          <p>
            2. 本站由 Web Tools (MOMO) 提供，致力于提供实用的各种开发者与设计工具。本站集成 Google AdSense 广告以维持运营。点击外部链接风险由您自行承担。
          </p>
          <p>
            3. 虽然我们尽力确保所有计算和处理的准确性，但用户在将计算结果用于金融、法律、医疗等严肃领域前，请务必进行独立核实。
          </p>
        </div>

        <div className="text-center pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-site border border-border-site rounded-xl text-sm font-medium text-text-site/60 hover:text-primary hover:border-primary/50 transition-all"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
