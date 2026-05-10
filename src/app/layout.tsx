import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

const SITE_URL = 'https://www.web-tools.top';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: {
    default: 'MOMO工具箱 - 极速、专业的在线工具集合',
    template: '%s | MOMO工具箱',
  },
  description:
    'MOMO工具箱是免费的一站式在线工具平台，提供AI智能抠图、API大模型测速、JSON格式化、Markdown编辑器、密码生成器、二维码工具、图片压缩等数十种高效实用工具，所有数据浏览器本地处理，即开即用保护隐私。',
  keywords:
    'MOMO工具箱, 在线工具, AI抠图, API测速, JSON格式化, Markdown编辑器, 开发者工具, 图像处理',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: 'MOMO工具箱',
    title: 'MOMO工具箱 - 极速、专业的在线工具集合',
    description:
      'MOMO工具箱是免费的一站式在线工具平台，提供AI智能抠图、API大模型测速、JSON格式化、Markdown编辑器等数十种高效实用工具。',
    images: [
      {
        url: 'https://images.icon-icons.com/3178/PNG_WM/256/setting_settings_wrench_cogwheel_icon_193940.png',
        width: 256,
        height: 256,
      },
    ],
  },
  icons: {
    icon: 'https://images.icon-icons.com/3178/PNG_WM/256/setting_settings_wrench_cogwheel_icon_193940.png',
    apple: 'https://images.icon-icons.com/3178/PNG_WM/256/setting_settings_wrench_cogwheel_icon_193940.png',
  },
  verification: {
    other: {
      'baidu-site-verification': 'codeva-zoITxbnddy',
      'bytedance-verification-code': 'okrg5gHYnRxidYnMh5Xu',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'MOMO工具箱',
              description:
                '包含AI抠图、API测速、JSON格式化、Markdown编辑器等多种高效工具的专业在线工具箱',
              url: SITE_URL,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'CNY',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1000',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg-site text-text-site font-sans selection:bg-primary selection:text-white transition-colors duration-200 pb-[env(safe-area-inset-bottom)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
