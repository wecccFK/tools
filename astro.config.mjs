import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.web-tools.top',
  // 统一使用尾斜杠 URL(/tool/aes-tool/),避免 308 重定向
  // 让内部链接、sitemap、构建产物都用同一个规范 URL,Googlebot 不会看到重定向
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // 强制 React 单实例，避免多副本导致 Hooks 失效
      dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    optimizeDeps: {
      // 强制 React 与懒加载组件用到的第三方库进入预构建单 chunk，
      // 避免 Vite 为每个 lazy 组件单独预打包导致 ERR_ABORTED 与动态导入失败
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'marked',
        'crypto-js',
        'qrcode',
        'jszip',
      ],
    },
  },
  build: {
    format: 'directory',
  },
});
