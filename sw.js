'use strict';

const scopeUrl = new URL(self.registration.scope);
const revision = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE_NAME = 'alandi-shell-' + revision.slice(0, 16);
const CACHE_META_URL = new URL('__al_cache_meta__', scopeUrl).href;
const SHELL_PATHS = [
  './', 'notebook/', 'workspace/',
  'assets/js/offline-shell.js',
  'assets/css/tailwind.generated.css',
  'assets/js/vendor/marked-18.0.14.min.js',
  'assets/js/vendor/purify-3.4.16.min.js',
  'assets/js/anotebooki-store.js', 'assets/js/anotebooki.js', 'assets/js/coding-workspace-store.js', 'assets/js/shared-modes.js',
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
    await cache.put(CACHE_META_URL, new Response(JSON.stringify({ revision, installedAt: Date.now() }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    }));
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
    const previous = await Promise.all(names.filter(name => name.startsWith('alandi-shell-') && name !== CACHE_NAME).map(async (name, order) => {
      const cache = await caches.open(name);
      const marker = await cache.match(CACHE_META_URL);
      let installedAt = 0;
      if (marker) {
        try { installedAt = Number((await marker.json()).installedAt) || 0; } catch (_) {}
      }
      return { name, installedAt, order };
    }));
    previous.sort((a, b) => b.installedAt - a.installedAt || b.order - a.order);
    const keep = new Set([CACHE_NAME, ...(previous[0] ? [previous[0].name] : [])]);
    await Promise.all(names.filter(name => name.startsWith('alandi-shell-') && !keep.has(name)).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode === 'navigate' && request.headers.has('authorization')) return;
  const url = new URL(request.url);
  const navigation=request.mode==='navigate';
  const projectWorkspaceNavigation=navigation&&url.pathname.endsWith('/workspace/');
  if(!isInScope(url)||isSensitivePath(url)||url.hash||(url.search&&!projectWorkspaceNavigation))return;
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
