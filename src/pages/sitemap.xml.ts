// 单文件 sitemap.xml:直接包含所有 URL,不带 -0 后缀
// 替代 @astrojs/sitemap 生成的 sitemap-index.xml + sitemap-0.xml 结构
import type { APIRoute } from 'astro';
import { TOOLS } from '../constants';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.toString().replace(/\/$/, '') || 'https://www.web-tools.top');

  interface UrlEntry {
    loc: string;
    changefreq: string;
    priority: string;
  }

  const urls: UrlEntry[] = [];

  // 首页
  urls.push({ loc: `${baseUrl}/`, changefreq: 'weekly', priority: '1.0' });

  // 工具页(21 个)
  for (const tool of TOOLS) {
    urls.push({ loc: `${baseUrl}/tool/${tool.id}/`, changefreq: 'monthly', priority: '0.8' });
  }

  // 教程页(21 个)
  for (const tool of TOOLS) {
    urls.push({ loc: `${baseUrl}/tutorial/${tool.id}/`, changefreq: 'monthly', priority: '0.6' });
  }

  // 静态页面
  urls.push({ loc: `${baseUrl}/about/`, changefreq: 'yearly', priority: '0.3' });
  urls.push({ loc: `${baseUrl}/faq/`, changefreq: 'yearly', priority: '0.3' });
  urls.push({ loc: `${baseUrl}/privacy/`, changefreq: 'yearly', priority: '0.3' });
  urls.push({ loc: `${baseUrl}/terms/`, changefreq: 'yearly', priority: '0.3' });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
