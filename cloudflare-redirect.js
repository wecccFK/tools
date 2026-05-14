// Cloudflare Worker: 统一重定向到 https://www.web-tools.top

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const protocol = url.protocol;
    
    // 需要重定向的情况：
    // 1. http:// 协议
    // 2. 不是 www 开头的主机名
    
    const needsRedirect = protocol === 'http:' || !hostname.startsWith('www.');
    
    if (needsRedirect) {
      // 构建目标 URL
      const targetUrl = `https://www.web-tools.top${url.pathname}${url.search}`;
      
      return new Response(null, {
        status: 301,
        statusText: 'Moved Permanently',
        headers: {
          'Location': targetUrl,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // 已经是正确的地址，直接请求源站
    return fetch(request);
  }
};
