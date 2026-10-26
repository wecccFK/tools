import type { APIRoute } from 'astro';
import template from '../service-worker.template.js?raw';

// 每次构建/启动只生成一次，避免 dev 下每次请求都换版本
const buildId = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);

export const GET: APIRoute = () => {
  const body = template.replace('__BUILD_ID__', buildId);
  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
