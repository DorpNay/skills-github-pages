(() => {
  'use strict';
  const url = document.querySelector('meta[name="alandi-service-worker"]')?.content;
  if (!url || !('serviceWorker' in navigator) || !window.isSecureContext) return;
  const revision = document.querySelector('meta[name="alandi-build-revision"]')?.content || 'dev';
  const workerUrl = new URL(url, location.href);
  workerUrl.searchParams.set('v', revision);
  navigator.serviceWorker.register(workerUrl.href).then(() => {
    document.documentElement.dataset.offlineShell = 'registered';
  }).catch(() => {
    document.documentElement.dataset.offlineShell = 'unavailable';
  });
})();
