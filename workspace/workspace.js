(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const provider = new window.AlandiBrowserLocalProvider.BrowserLocalProvider();
  let availableFiles = [];
  let editors = [];
  let prepared = null;

  function status(message, kind) {
    const el = $('workspaceStatus');
    el.textContent = message;
    el.className = 'status' + (kind ? ' ' + kind : '');
  }
  function formatBytes(value) {
    if (value < 1024) return value + ' B';
    if (value < 1048576) return (value / 1024).toFixed(1) + ' KB';
    return (value / 1048576).toFixed(1) + ' MB';
  }
  function selectedPaths() {
    return Array.from(document.querySelectorAll('#fileList input[data-path]:checked')).map(el => el.dataset.path);
  }
  function renderFiles() {
    const host = $('fileList');
    host.replaceChildren();
    if (!availableFiles.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'В выбранной области нет файлов.';
      host.append(empty);
    }
    for (const file of availableFiles) {
      const row = document.createElement('label');
      row.className = 'file-row';
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.dataset.path = file.path;
      check.addEventListener('change', updateControls);
      const name = document.createElement('span');
      name.className = 'file-name';
      name.textContent = file.path;
      const size = document.createElement('span');
      size.className = 'file-size';
      size.textContent = formatBytes(file.size);
      row.append(check, name, size);
      host.append(row);
    }
    $('refreshFiles').disabled = !provider.rootHandle;
    $('selectAll').disabled = !availableFiles.length;
    updateControls();
  }
  function updateControls() {
    const hasSelection = selectedPaths().length > 0;
    $('loadSelected').disabled = !hasSelection;
    $('previewChanges').disabled = !editors.length;
    $('discardChanges').disabled = !editors.length;
    $('writeChanges').disabled = !prepared || !$('recoveryConsent').checked;
  }
  function renderEditors() {
    const host = $('editors');
    host.replaceChildren();
    if (!editors.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Выберите файлы слева.';
      host.append(empty);
    }
    for (const item of editors) {
      const card = document.createElement('div');
      card.className = 'editor';
      const label = document.createElement('label');
      label.textContent = item.path;
      const textarea = document.createElement('textarea');
      textarea.spellcheck = false;
      textarea.dataset.path = item.path;
      textarea.value = item.text;
      textarea.setAttribute('aria-label', 'Содержимое ' + item.path);
      textarea.addEventListener('input', () => {
        item.text = textarea.value;
        prepared = null;
        $('diffPanel').hidden = true;
        updateControls();
      });
      card.append(label, textarea);
      host.append(card);
    }
    updateControls();
  }
  function renderDiff(files, host) {
    host.replaceChildren();
    for (const file of files) {
      const card = document.createElement('section');
      card.className = 'diff-card';
      const title = document.createElement('h3');
      title.textContent = file.path;
      const pre = document.createElement('pre');
      pre.textContent = file.diff;
      card.append(title, pre);
      host.append(card);
    }
  }
  function askApproval(title, description, files, actionLabel) {
    return new Promise(resolve => {
      $('approvalTitle').textContent = title;
      $('approvalDescription').textContent = description;
      renderDiff(files, $('approvalDiffs'));
      $('approveAction').textContent = actionLabel || 'Подтвердить';
      const dialog = $('approvalDialog');
      const finish = value => {
        $('approveAction').removeEventListener('click', approve);
        $('rejectAction').removeEventListener('click', reject);
        dialog.removeEventListener('cancel', cancel);
        dialog.close();
        resolve(value);
      };
      const approve = () => finish(true);
      const reject = () => finish(false);
      const cancel = event => { event.preventDefault(); finish(false); };
      $('approveAction').addEventListener('click', approve);
      $('rejectAction').addEventListener('click', reject);
      dialog.addEventListener('cancel', cancel);
      dialog.showModal();
    });
  }
  async function refreshFolder() {
    availableFiles = await provider.listFiles();
    renderFiles();
  }
  async function renderRecovery() {
    const host = $('recoveryList');
    host.replaceChildren();
    let snapshots;
    try { snapshots = await provider.listRecoverySnapshots(); }
    catch (error) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Локальное хранилище восстановления недоступно: ' + error.message;
      host.append(empty);
      return;
    }
    if (!snapshots.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Локальных снимков пока нет.';
      host.append(empty);
      return;
    }
    snapshots.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    for (const snapshot of snapshots) {
      const row = document.createElement('div');
      row.className = 'recovery-row';
      const meta = document.createElement('div');
      meta.className = 'recovery-meta';
      const date = document.createElement('strong');
      date.textContent = new Date(snapshot.createdAt).toLocaleString();
      const files = document.createElement('small');
      files.textContent = snapshot.files.map(file => file.path).join(' · ');
      meta.append(date, files);
      const actions = document.createElement('div');
      actions.className = 'toolbar';
      const restore = document.createElement('button');
      restore.textContent = 'Восстановить';
      restore.addEventListener('click', async () => {
        try {
          const result = await provider.restoreBatch(snapshot.id, {
            rootHandle: provider.rootHandle,
            confirm: preview => askApproval(
              'Восстановить исходные версии?',
              'Будут заменены только файлы, которые не менялись после этого снимка. Проверьте diff.',
              preview.files,
              'Восстановить файлы'
            )
          });
          status('Восстановлено файлов: ' + result.filesRestored, 'success');
          await refreshFolderIfSelected();
          await renderRecovery();
        } catch (error) { status(error.message, 'error'); }
      });
      actions.append(restore);
      row.append(meta, actions);
      host.append(row);
    }
  }
  async function refreshFolderIfSelected() {
    if (provider.rootHandle) await refreshFolder();
  }

  $('chooseFolder').addEventListener('click', async () => {
    try {
      const selected = await provider.selectDirectory();
      await refreshFolder();
      editors = [];
      renderEditors();
      status('Папка «' + selected.name + '» выбрана. Прочитайте нужные файлы.', 'success');
    } catch (error) {
      status(error.name === 'AbortError' ? 'Выбор отменён.' : error.message, error.name === 'AbortError' ? '' : 'error');
    }
  });
  $('chooseFiles').addEventListener('click', async () => {
    try {
      const selected = await provider.selectFiles();
      availableFiles = [];
      for (const item of selected) {
        const handle = provider.fileHandles.get(item.path);
        const file = await handle.getFile();
        availableFiles.push({ path: item.path, size: file.size, type: file.type });
      }
      renderFiles();
      editors = [];
      renderEditors();
      status('Выбрано файлов: ' + selected.length + '. Разрешение записи запрашивается браузером отдельно.', 'success');
    } catch (error) {
      status(error.name === 'AbortError' ? 'Выбор отменён.' : error.message, error.name === 'AbortError' ? '' : 'error');
    }
  });
  $('refreshFiles').addEventListener('click', async () => {
    try { await refreshFolder(); status('Список файлов обновлён.', 'success'); }
    catch (error) { status(error.message, 'error'); }
  });
  $('selectAll').addEventListener('click', () => {
    const boxes = Array.from(document.querySelectorAll('#fileList input[data-path]'));
    const shouldCheck = boxes.some(box => !box.checked);
    boxes.forEach(box => { box.checked = shouldCheck; });
    updateControls();
  });
  $('loadSelected').addEventListener('click', async () => {
    try {
      const loaded = await provider.readFiles(selectedPaths());
      editors = loaded.map(file => ({
        path: file.path, original: file.text, text: file.text,
        handle: provider.fileHandles.get(file.path)
      }));
      renderEditors();
      status('Открыто файлов: ' + editors.length + '. Изменения пока не записаны.', 'success');
    } catch (error) { status(error.message, 'error'); }
  });
  $('previewChanges').addEventListener('click', async () => {
    try {
      const changes = editors.map(item => ({ path: item.path, handle: item.handle, content: item.text }));
      prepared = await provider.prepareBatch(changes);
      renderDiff(prepared.files, $('diffList'));
      $('diffPanel').hidden = false;
      $('recoveryConsent').checked = false;
      updateControls();
      status('Diff готов. Файлы на диске ещё не изменены.', 'success');
      $('diffPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) { status(error.message, 'error'); }
  });
  $('recoveryConsent').addEventListener('change', updateControls);
  $('cancelPreview').addEventListener('click', () => {
    prepared = null;
    $('diffPanel').hidden = true;
    updateControls();
  });
  $('discardChanges').addEventListener('click', () => {
    editors = editors.map(item => Object.assign({}, item, { text: item.original }));
    prepared = null;
    $('diffPanel').hidden = true;
    renderEditors();
    status('Черновые изменения отменены.', 'success');
  });
  $('writeChanges').addEventListener('click', async () => {
    if (!prepared || !$('recoveryConsent').checked) return;
    try {
      const result = await provider.commitBatch(prepared.id, {
        createRecoverySnapshot: true,
        confirm: preview => askApproval(
          'Подтвердить запись нескольких файлов?',
          'Точный diff показан ниже. До записи будет сохранена локальная recovery-копия исходного содержимого в этом браузере. Никакая передача в сеть не выполняется.',
          preview.files,
          'Записать файлы'
        )
      });
      editors = editors.map(item => Object.assign({}, item, { original: item.text }));
      prepared = null;
      $('diffPanel').hidden = true;
      renderEditors();
      status('Записано файлов: ' + result.filesWritten + '. Recovery-снимок сохранён локально.', 'success');
      await renderRecovery();
    } catch (error) { status(error.message, 'error'); }
  });

  if (!provider.capabilities.openDirectory) $('chooseFolder').disabled = true;
  if (!provider.capabilities.openFiles) $('chooseFiles').disabled = true;
  if (!provider.capabilities.openDirectory && !provider.capabilities.openFiles) {
    status('Этот браузер не поддерживает File System Access API. Прямое редактирование локальных файлов здесь недоступно.', 'error');
  }
  renderRecovery();
})();
