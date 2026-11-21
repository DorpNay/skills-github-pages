'use strict';

const scopeUrl = new URL(self.registration.scope);
const revision = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE_NAME = 'alandi-shell-' + revision.slice(0, 16);
const SHELL_PATHS = [
  './', 'notebook/', 'workspace/',
  'assets/js/offline-shell.js',
  'assets/js/vendor/tailwindcss-3.4.17.js',
  'assets/js/vendor/marked-18.0.14.min.js',
  'assets/js/vendor/purify-3.4.16.min.js',
  'assets/js/anotebooki-store.js', 'assets/js/anotebooki.js',
  'assets/js/browser-local-provider.js', 'workspace/workspace.js'
];

function cacheKey(url) {
  return new Request(url.origin + url.pathname, { method: 'GET' });
}

function isInScope(url) {
  return url.origin === scopeUrl.origin && url.pathname.startsWith(scopeUrl.pathname);
}

function isSensitivePath(url) {
  return /\/(?:v1|api|oauth|auth)(?:\/|$)/i.test(url.pathname);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(SHELL_PATHS.map(async path => {
      const url = new URL(path, scopeUrl);
      try {
        const response = await fetch(url.href, { cache: 'no-store', credentials: 'same-origin' });
        if (response.ok && response.type === 'basic') await cache.put(cacheKey(url), response);
      } catch (_) {
        // First install requires at least one successful network visit; one missing
        // auxiliary route must not prevent the rest of the shell from being cached.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('alandi-shell-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode === 'navigate' && request.headers.has('authorization')) return;
  const url = new URL(request.url);
  if (!isInScope(url) || isSensitivePath(url) || url.search || url.hash) return;
  const navigation = request.mode === 'navigate';
  const staticAsset = ['script', 'style', 'font', 'image'].includes(request.destination) || url.pathname.includes('/assets/');
  if (!navigation && !staticAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const key = cacheKey(url);
    if (!navigation) {
      const cached = await cache.match(key);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await cache.put(key, response.clone());
      return response;
    }
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await cache.put(key, response.clone());
      return response;
    } catch (_) {
      const cached = await cache.match(key);
      return cached || new Response('aLandi offline shell is not cached yet. Reconnect and open this page once.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
      });
    }
  })());
});
