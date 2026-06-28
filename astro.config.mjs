import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.web-tools.top',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // 强制 React 单实例，避免多副本导致 Hooks 失效
      dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    optimizeDeps: {
      // 强制 React 进预构建单 chunk，避免分裂
      include: ['react', 'react-dom'],
    },
  },
  build: {
    format: 'directory',
  },
});
