importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  workbox.setConfig({ debug: false });
  workbox.routing.registerRoute(
    /\.(?:js|css|html|png|jpg|jpeg|svg|gif|webp|ico|woff2|woff|ttf)$/,
    new workbox.strategies.CacheFirst({ cacheName: 'static-assets' })
  );
} else {
  console.warn('Workbox failed to load');
}
