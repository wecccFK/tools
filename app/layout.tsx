/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../src/i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'MOMO工具箱 - 极速、专业的在线工具集合',
  description: 'MOMO工具箱是免费的一站式在线工具平台，提供AI智能抠图、API大模型测速、JSON格式化、Markdown编辑器、密码生成器、二维码工具、图片压缩等数十种高效实用工具，所有数据浏览器本地处理，即开即用保护隐私。',
  keywords: '在线工具,JSON格式化,Markdown编辑器,密码生成器,二维码,AI抠图,图片压缩,开发者工具',
  openGraph: {
    title: 'MOMO工具箱 - 极速、专业的在线工具集合',
    description: 'MOMO工具箱是免费的一站式在线工具平台，提供AI智能抠图、API大模型测速、JSON格式化、Markdown编辑器、密码生成器、二维码工具、图片压缩等数十种高效实用工具，所有数据浏览器本地处理，即开即用保护隐私。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className="min-h-screen bg-bg-site text-text-site font-sans selection:bg-primary selection:text-white transition-colors duration-200">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
