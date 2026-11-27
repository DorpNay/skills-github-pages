(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const provider = new window.AlandiBrowserLocalProvider.BrowserLocalProvider();
  const codingStore = window.AlandiCodingWorkspaceStore;
  let savedDirectoryHandle = null;
  let codingHandlePersistenceWarning = '';
  let availableFiles = [];
  let editors = [];
  let prepared = null;
  const requestedCodingProjectId=new URLSearchParams(location.search).get('projectId')||'';
  const codingProjectId=/^[a-zA-Z0-9._:-]{1,128}$/.test(requestedCodingProjectId)?requestedCodingProjectId:'';
  let codingProject=null,codingProjectError='';
  if(requestedCodingProjectId&&!codingProjectId)codingProjectError='Invalid Coding Project reference.';
  if(codingProjectId){try{if(codingProjectId.length>128)throw new Error('Invalid Coding Project reference.');const raw=localStorage.getItem('ai_projects_v1'),projects=raw?JSON.parse(raw):[];codingProject=Array.isArray(projects)?projects.find(item=>item&&item.id===codingProjectId&&item.kind==='coding')||null:null;if(!codingProject)throw new Error('Coding Project was not found in this browser profile. Open it again from aLandi.');}catch(error){codingProject=null;codingProjectError=error.message||'Coding Project data could not be read.';}}

  function tr(ru,en){return (localStorage.getItem('ai_ui_language_v1')||document.documentElement.lang||'ru').toLowerCase().startsWith('en')?en:ru;}
  function localizeWorkspace(){
    const english=(localStorage.getItem('ai_ui_language_v1')||document.documentElement.lang||'ru').toLowerCase().startsWith('en');
    document.documentElement.lang=english?'en':'ru';
    document.querySelectorAll('[data-copy-ru][data-copy-en]').forEach(node=>{node.textContent=english?node.dataset.copyEn:node.dataset.copyRu;});
    const back=document.querySelector('header a');if(back)back.setAttribute('aria-label',english?'Back to aLandi':'Вернуться в aLandi');
  }
  function status(message, kind) {
    const el = $('workspaceStatus');
    el.textContent = message;
    el.className = 'status' + (kind ? ' ' + kind : '');
  }
  async function renderWorkspaceActivity(){
    const host=$('workspaceActivityList');if(!host||!codingProjectId||!codingStore)return;
    host.replaceChildren();
    try{
      const events=await codingStore.listEvents(codingProjectId);
      const labels={workspace_opened:tr('Рабочее пространство открыто','Workspace opened'),project_selected:tr('Проект выбран','Project selected'),root_selected:tr('Папка привязана','Folder linked'),root_reauthorized:tr('Доступ к папке подтверждён','Folder access re-authorized'),files_loaded:tr('Файлы открыты','Files loaded'),diff_prepared:tr('Diff подготовлен','Diff prepared'),files_written:tr('Файлы записаны','Files written'),files_restored:tr('Файлы восстановлены','Files restored'),workspace_exported:tr('Метаданные экспортированы','Metadata exported'),root_removed:tr('Привязка папки удалена','Folder link removed')};
      for(const event of events.slice(-20).reverse()){
        const item=document.createElement('li'),title=document.createElement('span'),meta=document.createElement('small');
        const detail=event.details||{},label=labels[event.type]||tr('Событие workspace','Workspace event');
        const suffix=typeof detail.rootLabel==='string'&&detail.rootLabel?' · '+detail.rootLabel:Number.isInteger(detail.count)?' · '+detail.count:'';
        title.textContent=label+suffix;meta.textContent=new Date(event.createdAt).toLocaleString();item.append(title,meta);host.append(item);
      }
      if(!events.length){const empty=document.createElement('li');empty.textContent=tr('Пока нет событий.','No activity yet.');host.append(empty);}
    }catch(error){const item=document.createElement('li');item.textContent=tr('История недоступна: ','Activity unavailable: ')+error.message;host.append(item);}
  }
  async function recordWorkspaceEvent(type,details={}){
    if(!codingProjectId||!codingStore)return;
    try{await codingStore.recordEvent(codingProjectId,type,details);await renderWorkspaceActivity();}
    catch(error){status(tr('Не удалось сохранить событие workspace: ','Could not save workspace activity: ')+error.message,'error');}
  }
  function renderCodingProjectContext(){const panel=$('codingProjectContext');if(!panel||!requestedCodingProjectId)return;panel.hidden=false;if(!codingProject){$('codingProjectName').textContent=tr('Проект недоступен','Coding Project unavailable');$('codingProjectInstructions').textContent=codingProjectError;$('chooseFolder').disabled=true;$('chooseFiles').disabled=true;$('exportWorkspaceMetadata').hidden=true;status(codingProjectError,'error');return;}$('codingProjectName').textContent=String(codingProject.name||'Coding Project').slice(0,100);$('codingProjectInstructions').textContent=String(codingProject.instructions||'').slice(0,6000);const rootLabel=typeof codingProject.codingWorkspace?.rootLabel==='string'?codingProject.codingWorkspace.rootLabel:'';$('codingProjectFolderBinding').textContent=rootLabel?tr('Последняя выбранная папка: ','Last selected folder: ')+rootLabel+tr('. Это подсказка; проверь содержимое.','. This is a reminder; inspect the contents.') : tr('Папка ещё не выбрана для этого проекта.','No folder selected for this project.');}
  async function saveCodingProjectFolderLabel(rootName,rootHandle){
    if(!codingProjectId||!codingProject)return true;
    const raw=localStorage.getItem('ai_projects_v1'),current=raw?JSON.parse(raw):[];
    if(!Array.isArray(current))throw new Error('Project storage is invalid; folder selection was not bound.');
    const index=current.findIndex(item=>item&&item.id===codingProjectId&&item.kind==='coding');
    if(index<0)throw new Error('Coding Project changed or was removed; folder selection was not bound.');
    const previous=String(current[index].codingWorkspace?.rootLabel||'');
    let previousHandle=null,sameEntry=false;
    try{previousHandle=await codingStore?.getRootHandle(codingProjectId);if(previousHandle&&typeof previousHandle.isSameEntry==='function')sameEntry=await previousHandle.isSameEntry(rootHandle);}catch(_){previousHandle=null;}
    const changedHandle=previousHandle?!sameEntry:Boolean(previous&&previous!==rootName);
    if(changedHandle&&!confirm(tr('Для этого Coding Project уже привязана другая папка. Заменить её на «'+rootName+'»? Содержимое новой папки нужно проверить отдельно.','This Coding Project already has a different folder linked. Replace it with "'+rootName+'"? Review the new folder contents separately.')))return false;
    const updated=current.slice();updated[index]={...current[index],codingWorkspace:{schemaVersion:1,rootLabel:String(rootName).slice(0,128),lastOpenedAt:new Date().toISOString()},updatedAt:new Date().toISOString()};
    localStorage.setItem('ai_projects_v1',JSON.stringify(updated));codingProject=updated[index];renderCodingProjectContext();
    if(codingStore){try{await codingStore.saveRootHandle(codingProjectId,rootHandle);codingHandlePersistenceWarning='';await renderWorkspaceActivity();}catch(error){codingHandlePersistenceWarning=tr('Папка доступна только в этой вкладке; IndexedDB не сохранил дескриптор: ','Folder access is available only in this tab; IndexedDB did not persist the handle: ')+error.message;}}
    return true;
  }
  async function restoreCodingProjectFolder(){
    if(!codingProjectId||!codingProject||!codingStore)return;
    try{
      savedDirectoryHandle=await codingStore.getRootHandle(codingProjectId);if(!savedDirectoryHandle)return;
      const permission=await savedDirectoryHandle.queryPermission({mode:'readwrite'});
      if(permission==='granted'){
        provider.rootHandle=savedDirectoryHandle;await refreshFolder();
        await recordWorkspaceEvent('root_reauthorized',{rootLabel:savedDirectoryHandle.name||''});
        status(tr('Сохранённая папка восстановлена; разрешение браузера проверено.','Saved folder restored; browser permission was re-checked.'),'success');
      }else{
        $('reauthorizeFolder').hidden=false;
        status(tr('Папка найдена в локальном хранилище, но браузер требует повторного разрешения.','The folder handle is stored locally, but the browser requires permission again.'),'');
      }
    }catch(error){$('reauthorizeFolder').hidden=false;status(tr('Не удалось автоматически восстановить папку. Подтверди доступ или выбери её заново. ','Could not restore the folder automatically. Re-authorize access or choose it again. ')+error.message,'');}
  }
  async function initializeWorkspace(){
    localizeWorkspace();renderCodingProjectContext();
    if(codingProjectId&&codingProject&&codingStore){
      try{await codingStore.ensureWorkspace(codingProjectId);await recordWorkspaceEvent('workspace_opened');await restoreCodingProjectFolder();}
      catch(error){status(tr('Локальное хранилище workspace недоступно: ','Local workspace storage is unavailable: ')+error.message,'error');}
      $('exportWorkspaceMetadata').hidden=false;
    }
    await renderRecovery();
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
      empty.textContent = tr('В выбранной области нет файлов.','No files in the selected workspace.');
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
      empty.textContent = tr('Выберите файлы слева.','Select files on the left.');
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
      title.textContent = file.path + (file.conflict ? tr(' — конфликт: файл изменён после снимка',' — conflict: file changed after the snapshot') : '');
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
      $('approveAction').textContent = actionLabel || tr('Подтвердить','Approve');
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
    try { snapshots = await provider.listRecoverySnapshots(codingProjectId || null); }
    catch (error) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = tr('Локальное хранилище восстановления недоступно: ','Local recovery storage is unavailable: ') + error.message;
      host.append(empty);
      return;
    }
    if (!snapshots.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = tr('Локальных снимков пока нет.','No local snapshots yet.');
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
      restore.textContent = tr('Восстановить','Restore');
      restore.addEventListener('click', async () => {
        try {
          const result = await provider.restoreBatch(snapshot.id, {
            rootHandle: provider.rootHandle,
            workspaceId: codingProjectId || undefined,
            confirm: preview => askApproval(
              tr('Восстановить исходные версии?','Restore original versions?'),
              preview.conflicts.length
                ? tr('Обнаружены изменения после снимка (' + preview.conflicts.length + '). Подтверждение перезапишет эти файлы исходным содержимым. Проверьте каждый отмеченный конфликт и diff.','Changes were found after the snapshot (' + preview.conflicts.length + '). Approval will overwrite these files with the original contents. Review each conflict and the diff.')
                : tr('Будут восстановлены исходные версии файлов. Проверьте diff перед подтверждением.','Original file versions will be restored. Review the diff before approval.'),
              preview.files,
              tr('Восстановить файлы','Restore files')
            )
          });
          status(tr('Восстановлено файлов: ','Files restored: ') + result.filesRestored + tr('. Конфликтов подтверждено: ','. Confirmed conflicts: ') + result.conflicts, 'success');
          if(codingProjectId&&codingStore)await recordWorkspaceEvent('files_restored',{count:result.filesRestored});
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
      if(!(await saveCodingProjectFolderLabel(selected.name,provider.rootHandle))){provider.rootHandle=null;provider.fileHandles.clear();availableFiles=[];renderFiles();status(tr('Привязка папки отменена.','Folder binding was cancelled.'));return;}
      await refreshFolder();
      editors = [];
      renderEditors();
      status(tr('Папка «' + selected.name + '» выбрана. Прочитайте нужные файлы.','Folder "' + selected.name + '" selected. Choose the files you need.'), 'success');if(codingHandlePersistenceWarning)status(codingHandlePersistenceWarning,'error');
    } catch (error) {
      status(error.name === 'AbortError' ? tr('Выбор отменён.','Selection cancelled.') : error.message, error.name === 'AbortError' ? '' : 'error');
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
      status(tr('Выбрано файлов: ','Files selected: ') + selected.length + tr('. Разрешение на запись браузер запросит при подготовке изменений.','. The browser will request write permission when preparing changes.'), 'success');
    } catch (error) {
      status(error.name === 'AbortError' ? tr('Выбор отменён.','Selection cancelled.') : error.message, error.name === 'AbortError' ? '' : 'error');
    }
  });
  $('refreshFiles').addEventListener('click', async () => {
    try { await refreshFolder(); status(tr('Список файлов обновлён.','File list refreshed.'), 'success'); }
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
      status(tr('Открыто файлов: ','Files opened: ') + editors.length + tr('. Изменения пока не записаны.','. No changes have been written.'), 'success');if(codingProjectId&&codingStore)await recordWorkspaceEvent('files_loaded',{count:editors.length});
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
      status(tr('Diff готов. Файлы на диске ещё не изменены.','Diff is ready. Disk files have not been changed.'), 'success');if(codingProjectId&&codingStore)await recordWorkspaceEvent('diff_prepared',{count:prepared.files.length});
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
    status(tr('Черновые изменения отменены.','Draft changes discarded.'), 'success');
  });
  $('writeChanges').addEventListener('click', async () => {
    if (!prepared || !$('recoveryConsent').checked) return;
    try {
      const result = await provider.commitBatch(prepared.id, {
        createRecoverySnapshot: true,
        workspaceId: codingProjectId || undefined,
        confirm: preview => askApproval(
          tr('Подтвердить запись нескольких файлов?','Approve writing multiple files?'),
          tr('Точный diff показан ниже. До записи будет сохранена локальная recovery-копия исходного содержимого в этом браузере. Никакая передача в сеть не выполняется.','The exact diff is shown below. A local recovery copy of original contents will be saved before writing. No network transfer is performed.'),
          preview.files,
          tr('Записать файлы','Write files')
        )
      });
      editors = editors.map(item => Object.assign({}, item, { original: item.text }));
      prepared = null;
      $('diffPanel').hidden = true;
      renderEditors();
      status(tr('Записано файлов: ','Files written: ') + result.filesWritten + tr('. Recovery-снимок сохранён локально.','. Recovery snapshot saved locally.'), 'success');if(codingProjectId&&codingStore)await recordWorkspaceEvent('files_written',{count:result.filesWritten});
      await renderRecovery();
    } catch (error) {
      status(error.message, 'error');
      if (error.recoverySnapshotId) await renderRecovery();
    }
  });

  $('reauthorizeFolder').addEventListener('click',async()=>{
    try{if(!savedDirectoryHandle)savedDirectoryHandle=await codingStore?.getRootHandle(codingProjectId);if(!savedDirectoryHandle)throw new Error(tr('Сохранённая папка не найдена. Выбери её заново.','Saved folder handle not found. Choose it again.'));await provider.ensurePermission(savedDirectoryHandle,'readwrite',true);provider.rootHandle=savedDirectoryHandle;await refreshFolder();$('reauthorizeFolder').hidden=true;status(tr('Доступ к папке восстановлен.','Folder access restored.'),'success');await recordWorkspaceEvent('root_reauthorized',{rootLabel:savedDirectoryHandle.name||''});}catch(error){status(error.message,'error');}
  });
  $('exportWorkspaceMetadata').addEventListener('click',async()=>{
    try{const data=await codingStore.exportMetadata(codingProjectId);const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download='alandi-coding-workspace-'+codingProjectId+'.json';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status(tr('Метаданные workspace экспортированы. Дескриптор папки и содержимое файлов не включены.','Workspace metadata exported. The folder handle and file contents are not included.'),'success');await renderWorkspaceActivity();}catch(error){status(error.message,'error');}
  });
  if (!provider.capabilities.openDirectory) $('chooseFolder').disabled = true;
  if (!provider.capabilities.openFiles) $('chooseFiles').disabled = true;
  if (!provider.capabilities.openDirectory && !provider.capabilities.openFiles) {
    status(tr('Этот браузер не поддерживает File System Access API. Прямое редактирование локальных файлов здесь недоступно.','This browser does not support the File System Access API. Direct local file editing is unavailable.'), 'error');
  }
  void initializeWorkspace();
})();
