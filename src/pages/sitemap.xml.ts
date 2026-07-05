// 单文件 sitemap.xml:包含中英双语全部 URL,带 hreflang alternates 声明
// 中文为默认(无前缀),英文加 /en/ 前缀
import type { APIRoute } from 'astro';
import { TOOLS } from '../constants';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.toString().replace(/\/$/, '') || 'https://www.web-tools.top');

  interface UrlEntry {
    loc: string;
    changefreq: string;
    priority: string;
    // 配对的中英文 alternate URL(用于 hreflang)
    alternates?: { hreflang: string; href: string }[];
  }

  const urls: UrlEntry[] = [];

  // 辅助:为给定原始路径生成中英配对 URL + alternates
  function makeEntry(rawPath: string, changefreq: string, priority: string): UrlEntry {
    const zhPath = rawPath; // 中文为默认,无前缀
    const enPath = rawPath === '/' ? '/en/' : '/en' + rawPath;
    const zhUrl = `${baseUrl}${zhPath}`;
    const enUrl = `${baseUrl}${enPath}`;
    // alternates 包含 zh-CN / en / x-default,两个语言版本共用同一组 alternates
    return {
      loc: zhUrl,
      changefreq,
      priority,
      alternates: [
        { hreflang: 'zh-CN', href: zhUrl },
        { hreflang: 'en', href: enUrl },
        { hreflang: 'x-default', href: zhUrl },
      ],
    };
  }

  // 首页
  urls.push(makeEntry('/', 'weekly', '1.0'));

  // 工具页(21 个)
  for (const tool of TOOLS) {
    urls.push(makeEntry(`/tool/${tool.id}/`, 'monthly', '0.8'));
  }

  // 教程页(21 个)
  for (const tool of TOOLS) {
    urls.push(makeEntry(`/tutorial/${tool.id}/`, 'monthly', '0.6'));
  }

  // 静态页面
  urls.push(makeEntry('/about/', 'yearly', '0.3'));
  urls.push(makeEntry('/faq/', 'yearly', '0.3'));
  urls.push(makeEntry('/privacy/', 'yearly', '0.3'));
  urls.push(makeEntry('/terms/', 'yearly', '0.3'));

  // 生成 sitemap XML:
  // - 中文 URL(默认,无前缀)作为 <loc>
  // - 同时为每个 URL 输出 <xhtml:link rel="alternate" hreflang="...">
  // - 英文 URL 也作为独立 <url> 条目出现,让 Google 知道它们存在
  //   (英文条目也带同一组 alternates,Google 会自动归并)
  const allEntries: UrlEntry[] = [];
  for (const entry of urls) {
    // 中文版条目
    allEntries.push(entry);
    // 英文版条目(loc 指向英文 URL,alternates 同一组)
    if (entry.alternates) {
      const enUrl = entry.alternates.find(a => a.hreflang === 'en')!.href;
      allEntries.push({
        loc: enUrl,
        changefreq: entry.changefreq,
        priority: entry.priority,
        alternates: entry.alternates,
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allEntries
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.alternates ? u.alternates
      .map(
        (a) => `
    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`
      )
      .join('') : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
