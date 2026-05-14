import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      viteCompression({ algorithm: 'gzip' }),
      viteCompression({ algorithm: 'brotliCompress' }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@imgly/background-removal')) {
              return 'vendor-bg-removal';
            }
            if (id.includes('@tensorflow')) {
              return 'vendor-tensorflow';
            }
            if (id.includes('@xenova')) {
              return 'vendor-xenova';
            }
            if (id.includes('crypto-js') || id.includes('zxcvbn')) {
              return 'vendor-crypto';
            }
            if (id.includes('heic2any')) {
              return 'vendor-heic';
            }
            if (id.includes('exifreader')) {
              return 'vendor-exif';
            }
            if (id.includes('browser-image-compression')) {
              return 'vendor-imgcompress';
            }
            if (id.includes('motion')) {
              return 'vendor-ui';
            }
            if (id.includes('plotly')) {
              return 'vendor-plotly';
            }
            if (id.includes('marked') || id.includes('react-markdown') || id.includes('remark-gfm') || id.includes('prismjs')) {
              return 'vendor-markdown';
            }
            if (id.includes('jszip')) {
              return 'vendor-jszip';
            }
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },
    server: {
      hmr: true,
      watch: {
        usePolling: true,
      }
    },
  };
});