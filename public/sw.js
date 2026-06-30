// Momo工具箱 Service Worker
// 策略:核心页面 Network First(回退缓存);静态资源 Cache First;跨域请求直接放行

const SW_VERSION = 'momo-toolbox-v1';
const CORE_CACHE = `${SW_VERSION}-core`;
const ASSET_CACHE = `${SW_VERSION}-assets`;

// 预缓存的核心资源(安装时拉取)
const CORE_URLS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/og-image.svg',
];

// ============ 安装:预缓存核心资源 ============
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ============ 激活:清理旧版本缓存 ============
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !k.startsWith(SW_VERSION))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ============ fetch 拦截 ============
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只处理 GET;POST/PUT 等直接放行
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 跨域请求放行(如 Google Fonts、CDN 模型)
  if (url.origin !== self.location.origin) return;

  // 浏览器扩展协议放行
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // HTML 导航请求:Network First(回退缓存,再回退离线页)
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CORE_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
    return;
  }

  // 静态资源(JS/CSS/图片/字体等):Cache First,缺失再上网络
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // 只缓存成功的同一源响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const copy = response.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});

// ============ 消息:支持客户端主动更新 ============
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
