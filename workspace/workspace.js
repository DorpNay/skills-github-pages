(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const provider = new window.AlandiBrowserLocalProvider.BrowserLocalProvider();
  let availableFiles = [];
  let editors = [];
  let prepared = null;
  const codingProjectId=new URLSearchParams(location.search).get('projectId')||'';
  let codingProject=null,codingProjectError='';
  if(codingProjectId){try{if(codingProjectId.length>128)throw new Error('Invalid Coding Project reference.');const raw=localStorage.getItem('ai_projects_v1'),projects=raw?JSON.parse(raw):[];codingProject=Array.isArray(projects)?projects.find(item=>item&&item.id===codingProjectId&&item.kind==='coding')||null:null;if(!codingProject)throw new Error('Coding Project was not found in this browser profile. Open it again from aLandi.');}catch(error){codingProject=null;codingProjectError=error.message||'Coding Project data could not be read.';}}

  function status(message, kind) {
    const el = $('workspaceStatus');
    el.textContent = message;
    el.className = 'status' + (kind ? ' ' + kind : '');
  }
  function renderCodingProjectContext(){const panel=$('codingProjectContext');if(!panel||!codingProjectId)return;panel.hidden=false;if(!codingProject){$('codingProjectName').textContent='Coding Project unavailable';$('codingProjectInstructions').textContent=codingProjectError;$('chooseFolder').disabled=true;$('chooseFiles').disabled=true;status(codingProjectError,'error');return;}$('codingProjectName').textContent=String(codingProject.name||'Coding Project').slice(0,100);$('codingProjectInstructions').textContent=String(codingProject.instructions||'').slice(0,6000);const rootLabel=typeof codingProject.codingWorkspace?.rootLabel==='string'?codingProject.codingWorkspace.rootLabel:'';$('codingProjectFolderBinding').textContent=rootLabel?'Последняя выбранная папка: '+rootLabel+'. Это напоминание; выбери папку заново и проверь содержимое. / Last selected folder: '+rootLabel+'. This is a reminder; reselect the folder and inspect its contents.':'Папка ещё не выбрана для этого проекта. / No folder selected for this project.';}
  function saveCodingProjectFolderLabel(rootName){if(!codingProjectId||!codingProject)return true;const raw=localStorage.getItem('ai_projects_v1'),current=raw?JSON.parse(raw):[];if(!Array.isArray(current))throw new Error('Project storage is invalid; folder selection was not bound.');const index=current.findIndex(item=>item&&item.id===codingProjectId&&item.kind==='coding');if(index<0)throw new Error('Coding Project changed or was removed; folder selection was not bound.');const previous=String(current[index].codingWorkspace?.rootLabel||'');if(previous&&previous!==rootName&&!confirm('Для этого Coding Project ранее выбиралась папка «'+previous+'». Привязать новую папку «'+rootName+'»? Имя — только напоминание; проверь содержимое самостоятельно.'))return false;const updated=current.slice();updated[index]={...current[index],codingWorkspace:{schemaVersion:1,rootLabel:String(rootName).slice(0,128),lastOpenedAt:new Date().toISOString()},updatedAt:new Date().toISOString()};localStorage.setItem('ai_projects_v1',JSON.stringify(updated));codingProject=updated[index];renderCodingProjectContext();return true;}
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
      title.textContent = file.path + (file.conflict ? ' — конфликт: файл изменён после снимка' : '');
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
              preview.conflicts.length
                ? 'Обнаружены изменения после снимка (' + preview.conflicts.length + '). Подтверждение перезапишет эти файлы исходным содержимым. Проверьте каждый отмеченный конфликт и diff.'
                : 'Будут восстановлены исходные версии файлов. Проверьте diff перед подтверждением.',
              preview.files,
              'Восстановить файлы'
            )
          });
          status('Восстановлено файлов: ' + result.filesRestored + '. Конфликтов подтверждено: ' + result.conflicts, 'success');
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
      if(codingProjectId&&!codingProject)throw new Error(codingProjectError);
      const selected=await provider.selectDirectory();
      if(!saveCodingProjectFolderLabel(selected.name)){provider.rootHandle=null;provider.fileHandles.clear();availableFiles=[];renderFiles();status('Привязка папки отменена. / Folder binding was cancelled.');return;}
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
      status('Выбрано файлов: ' + selected.length + '. Разрешение на запись браузер запросит при подготовке изменений.', 'success');
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
    } catch (error) {
      status(error.message, 'error');
      if (error.recoverySnapshotId) await renderRecovery();
    }
  });

  renderCodingProjectContext();
  if (!provider.capabilities.openDirectory) $('chooseFolder').disabled = true;
  if (!provider.capabilities.openFiles) $('chooseFiles').disabled = true;
  if (!provider.capabilities.openDirectory && !provider.capabilities.openFiles) {
    status('Этот браузер не поддерживает File System Access API. Прямое редактирование локальных файлов здесь недоступно.', 'error');
  }
  renderRecovery();
})();
