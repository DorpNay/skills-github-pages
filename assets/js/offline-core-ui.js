(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const language = () => {
    const selected = $('uiLanguage')?.value;
    const stored = localStorage.getItem('ai_ui_language_v1');
    return String(selected || stored || document.documentElement.lang || 'ru').toLowerCase().startsWith('en') ? 'en' : 'ru';
  };
  const copy = (ru, en) => language() === 'en' ? en : ru;
  const setText = (id, ru, en) => { const node = $(id); if (node) node.textContent = copy(ru, en); };
  const formatBytes = value => {
    if (!Number.isFinite(value) || value < 0) return '—';
    const units = ['B','KiB','MiB','GiB','TiB'];
    let size = value, unit = 0;
    while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit += 1; }
    return size.toFixed(unit === 0 ? 0 : 1) + ' ' + units[unit];
  };
  async function refresh() {
    setText('offlineNetworkValue',
      navigator.onLine ? 'Браузер сообщает: сеть доступна' : 'Браузер сообщает: нет сети',
      navigator.onLine ? 'Browser hint: online' : 'Browser hint: offline');
    const controlled = Boolean(navigator.serviceWorker?.controller);
    const registered = document.documentElement.dataset.offlineShell === 'registered';
    setText('offlineShellValue',
      controlled ? 'Эта страница под контролем Service Worker' : registered ? 'Service Worker зарегистрирован; перезагрузи страницу для контроля' : 'Service Worker пока не активен',
      controlled ? 'This page is controlled by its Service Worker' : registered ? 'Service Worker registered; reload to gain control' : 'Service Worker is not active yet');
    const storage = navigator.storage;
    if (!storage) {
      setText('offlineStorageValue','Оценка хранилища недоступна в этом браузере','Storage estimate is unavailable in this browser');
      setText('offlinePersistenceValue','Не поддерживается','Not supported');
      $('offlineCorePersistButton').disabled = true;
      return;
    }
    try {
      if (typeof storage.estimate === 'function') {
        const estimate = await storage.estimate();
        const usage = formatBytes(estimate.usage), quota = formatBytes(estimate.quota);
        const ratio = Number.isFinite(estimate.usage) && Number.isFinite(estimate.quota) && estimate.quota > 0
          ? ' (' + (estimate.usage / estimate.quota * 100).toFixed(1) + '%)' : '';
        $('offlineStorageValue').textContent = Number.isFinite(estimate.usage) && Number.isFinite(estimate.quota)
          ? copy('Приблизительно ' + usage + ' из ' + quota + ratio, 'Approx. ' + usage + ' of ' + quota + ratio)
          : copy('Квота не сообщается браузером', 'Quota not reported by browser');
      } else setText('offlineStorageValue','Оценка квоты не поддерживается','Quota estimates are not supported');
    } catch (error) {
      setText('offlineStorageValue','Оценка недоступна: ' + error.message,'Estimate unavailable: ' + error.message);
    }
    try {
      if (typeof storage.persisted === 'function') {
        const persistent = await storage.persisted();
        setText('offlinePersistenceValue',
          persistent ? 'Постоянное хранение разрешено' : 'Хранение может быть вытеснено браузером',
          persistent ? 'Persistent storage is granted' : 'Browser may evict this storage');
        $('offlineCorePersistButton').disabled = persistent || typeof storage.persist !== 'function';
        $('offlineCorePersistButton').hidden = persistent;
      } else {
        setText('offlinePersistenceValue','Статус persistent storage не поддерживается','Persistent storage status is not supported');
        $('offlineCorePersistButton').disabled = typeof storage.persist !== 'function';
      }
    } catch (error) {
      setText('offlinePersistenceValue','Статус недоступен: ' + error.message,'Status unavailable: ' + error.message);
    }
  }
  async function requestPersistence() {
    const button = $('offlineCorePersistButton'), status = $('offlineCoreStatus');
    if (!navigator.storage || typeof navigator.storage.persist !== 'function') {
      status.textContent = copy('Этот браузер не поддерживает запрос persistent storage.','This browser does not support persistent storage requests.');
      return;
    }
    button.disabled = true;
    status.textContent = copy('Запрашивается разрешение браузера…','Requesting browser storage persistence…');
    try {
      const granted = await navigator.storage.persist();
      await refresh();
      status.textContent = granted
        ? copy('Браузер разрешил persistent storage. Это не резервная копия: экспортируй важные данные отдельно.','The browser granted persistent storage. This is not a backup: export important data separately.')
        : copy('Браузер не предоставил persistent storage. Данные могут быть удалены при нехватке места или очистке сайта.','The browser did not grant persistent storage. Data may be evicted under storage pressure or when site data is cleared.');
    } catch (error) {
      status.textContent = copy('Не удалось запросить persistent storage: ','Could not request persistent storage: ') + error.message;
      button.disabled = false;
    }
  }
  function applyLocale() {
    const en = language() === 'en';
    document.querySelectorAll('[data-offline-ru][data-offline-en]').forEach(node => {
      node.textContent = en ? node.dataset.offlineEn : node.dataset.offlineRu;
    });
    refresh().catch(error => {
      const node = $('offlineCoreStatus');
      if (node) node.textContent = copy('Не удалось обновить сведения о локальном хранилище: ','Could not refresh local storage information: ') + error.message;
    });
  }
  function init() {
    $('offlineCorePersistButton')?.addEventListener('click', () => void requestPersistence());
    $('uiLanguage')?.addEventListener('change', applyLocale);
    window.addEventListener('online', () => void refresh());
    window.addEventListener('offline', () => void refresh());
    navigator.serviceWorker?.addEventListener('controllerchange', () => void refresh());
    applyLocale();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
