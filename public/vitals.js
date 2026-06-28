/**
 * Momo Toolbox Web Vitals 上报脚本
 * 监听 LCP / CLS / INP / FCP / TTFB,在页面隐藏或卸载时用 sendBeacon 上报
 * 仅在生产环境(web-tools.top)启用,本地开发不上报
 */
(function () {
  'use strict';

  // 仅生产环境上报
  var HOST = 'www.web-tools.top';
  if (location.hostname !== HOST && location.hostname !== 'tools-crb.pages.dev') {
    return;
  }
  // Cloudflare Worker 部署后填入实际 URL,例如 https://vitals.workers.dev
  // 也可以绑定到 web-tools.top 子路径,需要在 Cloudflare 配置 workers.dev 或 routes
  var ENDPOINT = 'https://momo-vitals.wecccfk.workers.dev/api/vitals';

  // 各指标 rating 阈值(Google Web Vitals 官方建议)
  function getRating(name, value) {
    var thresholds = {
      LCP: [2500, 4000],
      CLS: [0.1, 0.25],
      INP: [200, 500],
      FCP: [1800, 3000],
      TTFB: [800, 1800],
    };
    var t = thresholds[name];
    if (!t) return 'good';
    if (value <= t[0]) return 'good';
    if (value <= t[1]) return 'needs-improvement';
    return 'poor';
  }

  var pending = {};
  var reported = {};

  function send(name, value) {
    if (reported[name]) return;
    reported[name] = true;
    var payload = {
      metric_name: name,
      value: Math.round(value * 10000) / 10000,
      rating: getRating(name, value),
      page_path: location.pathname + location.search,
      user_agent: navigator.userAgent,
      ts: Date.now(),
    };
    try {
      navigator.sendBeacon(ENDPOINT, JSON.stringify(payload));
    } catch (e) {
      // sendBeacon 失败时降级为 fetch keepalive
      try {
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(function () {});
      } catch (_) {}
    }
  }

  // FCP & TTFB - 立即上报
  try {
    var paintObs = new PerformanceObserver(function (list) {
      for (var i = 0; i < list.getEntries().length; i++) {
        var entry = list.getEntries()[i];
        if (entry.name === 'first-contentful-paint') {
          send('FCP', entry.startTime);
        }
      }
    });
    paintObs.observe({ type: 'paint', buffered: true });
  } catch (e) {}

  try {
    var navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      var nav = navEntries[0];
      // TTFB = responseStart - requestStart (或直接 responseStart)
      send('TTFB', nav.responseStart);
    }
  } catch (e) {}

  // LCP - 最后一次值
  try {
    var lcpObs = new PerformanceObserver(function (list) {
      var entries = list.getEntries();
      if (entries.length > 0) {
        pending.LCP = entries[entries.length - 1].startTime;
      }
    });
    lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}

  // CLS - 累计
  try {
    var clsValue = 0;
    var clsObs = new PerformanceObserver(function (list) {
      for (var i = 0; i < list.getEntries().length; i++) {
        var entry = list.getEntries()[i];
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      pending.CLS = clsValue;
    });
    clsObs.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}

  // INP - 取所有交互的最大 duration
  try {
    var maxDuration = 0;
    var inpObs = new PerformanceObserver(function (list) {
      for (var i = 0; i < list.getEntries().length; i++) {
        var entry = list.getEntries()[i];
        if (entry.duration > maxDuration) {
          maxDuration = entry.duration;
        }
      }
      pending.INP = maxDuration;
    });
    inpObs.observe({ type: 'event', buffered: true });
  } catch (e) {}

  // 页面隐藏或卸载时上报 LCP/CLS/INP(这些指标的最终值需要等会话结束)
  function flushPending() {
    if (pending.LCP !== undefined) send('LCP', pending.LCP);
    if (pending.CLS !== undefined) send('CLS', pending.CLS);
    if (pending.INP !== undefined) send('INP', pending.INP);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      flushPending();
    }
  });
  window.addEventListener('pagehide', flushPending);
  window.addEventListener('beforeunload', flushPending);
})();
