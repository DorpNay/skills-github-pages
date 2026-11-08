/* aLandi Browser Local Workspace Provider.
 * User-granted browser filesystem access only. No arbitrary paths, network transfer,
 * background watchers, or implicit writes. Load as a classic script.
 */
(() => {
  'use strict';

  const LIMITS = Object.freeze({ maxFiles: 40, maxFileBytes: 2097152, maxBatchBytes: 8388608, maxDiffCells: 400000 });
  const DB_NAME = 'alandi-browser-local-recovery-v1';
  const STORE = 'snapshots';

  function assert(ok, message) { if (!ok) throw new Error(message); }
  function normalizePath(value) {
    const path = String(value || '').replace(/\\/g, '/');
    const parts = path.split('/');
    assert(path && !path.startsWith('/') && parts.every(part => part && part !== '.' && part !== '..'),
      'Invalid workspace-relative path.');
    return parts.join('/');
  }
  async function hashText(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2, '0')).join('');
  }
  function decodeText(bytes) {
    assert(!bytes.includes(0), 'Binary files are not supported by Browser Local v1.');
    try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { throw new Error('File is not valid UTF-8 text.'); }
  }
  function diffText(before, after, oldName, newName, maxCells) {
    const a = before.split('\n'), b = after.split('\n'), n = a.length, m = b.length;
    const header = ['--- ' + oldName, '+++ ' + newName];
    if (n * m > maxCells) {
      return header.concat(['@@ full replacement (' + n + ' lines -> ' + m + ' lines) @@'],
        a.map(x => '-' + x), b.map(x => '+' + x)).join('\n');
    }
    const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
    const lines = [];
    let i = 0, j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && a[i] === b[j]) { lines.push(' ' + a[i]); i++; j++; }
      else if (j < m && (i === n || lcs[i][j + 1] >= lcs[i + 1][j])) { lines.push('+' + b[j]); j++; }
      else { lines.push('-' + a[i]); i++; }
    }
    return header.concat(['@@ -1,' + n + ' +1,' + m + ' @@'], lines).join('\n');
  }
  function openDb() {
    return new Promise((resolve, reject) => {
      assert(globalThis.indexedDB, 'IndexedDB is unavailable; recovery snapshots cannot be stored.');
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not open local recovery storage.'));
    });
  }
  async function dbRequest(mode, method, value) {
    const db = await openDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = value === undefined ? tx.objectStore(STORE)[method]() : tx.objectStore(STORE)[method](value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Local recovery storage request failed.'));
        tx.onabort = () => reject(tx.error || new Error('Local recovery transaction aborted.'));
      });
    } finally { db.close(); }
  }

  class BrowserLocalProvider {
    constructor(options = {}) {
      this.limits = Object.assign({}, LIMITS, options);
      this.rootHandle = null;
      this.fileHandles = new Map();
      this.prepared = new Map();
    }
    get capabilities() {
      return Object.freeze({
        openFiles: typeof window.showOpenFilePicker === 'function',
        openDirectory: typeof window.showDirectoryPicker === 'function',
        read: true, write: typeof FileSystemFileHandle !== 'undefined',
        persistentPermission: false, backgroundWatch: false,
        arbitraryPaths: false, networkTransfer: false
      });
    }
    async ensurePermission(handle, mode, mayRequest = false) {
      assert(handle && typeof handle.queryPermission === 'function', 'Invalid file-system handle.');
      let state = await handle.queryPermission({ mode: mode || 'read' });
      if (state !== 'granted' && mayRequest && typeof handle.requestPermission === 'function') {
        state = await handle.requestPermission({ mode: mode || 'read' });
      }
      assert(state === 'granted', 'Permission to ' + (mode || 'read') + ' this selection was not granted.');
      return state;
    }
    async selectDirectory() {
      assert(typeof window.showDirectoryPicker === 'function',
        'Folder access is not supported in this browser. Use the file picker instead.');
      // Invoke directly from a user gesture; the browser owns the picker and permission prompt.
      const handle = await window.showDirectoryPicker({ id: 'alandi-workspace', mode: 'readwrite' });
      await this.ensurePermission(handle, 'readwrite', true);
      this.rootHandle = handle;
      return { name: handle.name, kind: handle.kind, permission: 'granted' };
    }
    async selectFiles() {
      assert(typeof window.showOpenFilePicker === 'function',
        'The File System Access file picker is not supported in this browser.');
      // Invoke directly from a user gesture; selected files are not copied into app storage.
      const handles = await window.showOpenFilePicker({ multiple: true });
      const selected = [];
      for (let i = 0; i < handles.length; i++) {
        const handle = handles[i];
        await this.ensurePermission(handle, 'read', true);
        const path = '@selected/' + i + '/' + handle.name;
        this.fileHandles.set(path, handle);
        selected.push({ path, name: handle.name, kind: handle.kind });
      }
      return selected;
    }
    async listFiles(rootHandle = this.rootHandle) {
      assert(rootHandle && rootHandle.kind === 'directory', 'Choose a folder first.');
      await this.ensurePermission(rootHandle, 'read');
      const files = [];
      const visit = async (directory, prefix) => {
        for await (const pair of directory.entries()) {
          const name = pair[0], handle = pair[1];
          const path = prefix ? prefix + '/' + name : name;
          if (handle.kind === 'directory') await visit(handle, path);
          else if (handle.kind === 'file') {
            const file = await handle.getFile();
            files.push({ path, name, size: file.size, type: file.type || 'text/plain', lastModified: file.lastModified });
            this.fileHandles.set(path, handle);
            assert(files.length <= this.limits.maxFiles, 'Folder contains more than ' + this.limits.maxFiles + ' files.');
          }
        }
      };
      await visit(rootHandle, '');
      return files.sort((a, b) => a.path.localeCompare(b.path));
    }
    async readFiles(paths) {
      assert(Array.isArray(paths) && paths.length > 0, 'Select at least one file.');
      const unique = Array.from(new Set(paths.map(normalizePath)));
      assert(unique.length <= this.limits.maxFiles, 'Too many files selected.');
      const result = [];
      for (const path of unique) {
        const handle = this.fileHandles.get(path);
        assert(handle, 'File is not in the current user selection: ' + path);
        await this.ensurePermission(handle, 'read');
        const file = await handle.getFile();
        assert(file.size <= this.limits.maxFileBytes, 'File exceeds the size limit: ' + path);
        const text = decodeText(new Uint8Array(await file.arrayBuffer()));
        result.push({ path, name: file.name, size: file.size, text, hash: await hashText(text) });
      }
      return result;
    }
    async prepareBatch(changes) {
      assert(Array.isArray(changes) && changes.length > 0, 'No file changes were supplied.');
      assert(changes.length <= this.limits.maxFiles, 'Too many files in one change set.');
      const seen = new Set(), files = [];
      let totalBytes = 0;
      for (const change of changes) {
        const path = normalizePath(change.path);
        assert(!seen.has(path), 'Duplicate file in change set: ' + path);
        seen.add(path);
        const handle = change.handle || this.fileHandles.get(path);
        assert(handle && handle.kind === 'file' && typeof handle.createWritable === 'function',
          'No selected writable file handle for ' + path);
        await this.ensurePermission(handle, 'readwrite');
        const file = await handle.getFile();
        assert(file.size <= this.limits.maxFileBytes, 'File exceeds the size limit: ' + path);
        const before = decodeText(new Uint8Array(await file.arrayBuffer()));
        const after = String(change.content);
        totalBytes += new TextEncoder().encode(before).byteLength + new TextEncoder().encode(after).byteLength;
        assert(totalBytes <= this.limits.maxBatchBytes, 'Change set exceeds the total byte limit.');
        files.push({
          path, handle, before, after,
          beforeHash: await hashText(before), afterHash: await hashText(after),
          diff: diffText(before, after, 'a/' + path, 'b/' + path, this.limits.maxDiffCells)
        });
      }
      const id = crypto.randomUUID();
      this.prepared.set(id, { id, files, totalBytes });
      return {
        id, totalFiles: files.length, totalBytes,
        files: files.map(({ path, before, after, beforeHash, afterHash, diff }) =>
          ({ path, before, after, beforeHash, afterHash, diff }))
      };
    }
    async commitBatch(preparedId, options = {}) {
      const prepared = this.prepared.get(preparedId);
      assert(prepared, 'Prepared change set was not found or has expired.');
      assert(options.createRecoverySnapshot === true,
        'Enable the local recovery snapshot explicitly before writing.');
      assert(typeof options.confirm === 'function', 'An explicit confirmation callback is required.');
      const approved = await options.confirm({
        id: prepared.id,
        files: prepared.files.map(({ path, before, after, diff }) => ({ path, before, after, diff })),
        createsLocalRecoveryCopy: true,
        storage: 'This browser profile only; not uploaded or synchronized.'
      });
      assert(approved === true, 'Write was not confirmed by the user.');

      // Re-read after confirmation to detect edits made since the preview was generated.
      for (const item of prepared.files) {
        await this.ensurePermission(item.handle, 'readwrite');
        const file = await item.handle.getFile();
        const current = decodeText(new Uint8Array(await file.arrayBuffer()));
        assert(await hashText(current) === item.beforeHash,
          'File changed after diff preview; prepare and review a fresh diff: ' + item.path);
      }

      const snapshot = {
        id: crypto.randomUUID(), createdAt: new Date().toISOString(),
        rootName: this.rootHandle ? this.rootHandle.name : null,
        files: prepared.files.map(({ path, before, afterHash }) => ({ path, before, afterHash }))
      };
      // A local copy is persisted only after the user explicitly approved the preview and recovery.
      await dbRequest('readwrite', 'put', snapshot);

      const attempted = [];
      try {
        for (const item of prepared.files) {
          attempted.push(item);
          const writable = await item.handle.createWritable({ keepExistingData: false });
          try { await writable.write(item.after); await writable.close(); }
          catch (error) { try { if (writable.abort) await writable.abort(); } catch {} throw error; }
          if (options.onProgress) options.onProgress({ path: item.path, completed: attempted.length, total: prepared.files.length });
        }
      } catch (error) {
        const rollbackErrors = [];
        for (const item of attempted.reverse()) {
          try {
            const writable = await item.handle.createWritable({ keepExistingData: false });
            await writable.write(item.before);
            await writable.close();
          } catch (rollbackError) {
            rollbackErrors.push({ path: item.path, message: rollbackError.message });
          }
        }
        this.prepared.delete(preparedId);
        if (rollbackErrors.length) {
          const failure = new Error('Write failed and automatic rollback was incomplete. Recovery snapshot: ' + snapshot.id);
          failure.recoverySnapshotId = snapshot.id;
          failure.rollbackErrors = rollbackErrors;
          throw failure;
        }
        throw new Error('Write failed; attempted files were restored. Recovery snapshot: ' + snapshot.id);
      }
      this.prepared.delete(preparedId);
      return { snapshotId: snapshot.id, filesWritten: attempted.length, createdAt: snapshot.createdAt };
    }
    async listRecoverySnapshots() { return dbRequest('readonly', 'getAll'); }
    async restoreBatch(snapshotId, options = {}) {
      assert(typeof options.confirm === 'function', 'An explicit restore confirmation callback is required.');
      const snapshot = await dbRequest('readonly', 'get', snapshotId);
      assert(snapshot, 'Recovery snapshot was not found.');
      const root = options.rootHandle || this.rootHandle;
      assert(root && root.kind === 'directory', 'Select the original workspace folder before restoring.');
      await this.ensurePermission(root, 'readwrite');
      const targets = [];
      for (const item of snapshot.files) {
        let directory = root;
        const parts = normalizePath(item.path).split('/');
        for (const segment of parts.slice(0, -1)) directory = await directory.getDirectoryHandle(segment);
        const handle = await directory.getFileHandle(parts[parts.length - 1]);
        await this.ensurePermission(handle, 'readwrite');
        const file = await handle.getFile();
        const current = decodeText(new Uint8Array(await file.arrayBuffer()));
        assert(await hashText(current) === item.afterHash,
          'File changed since this snapshot; refusing to overwrite newer content: ' + item.path);
        targets.push({ path: item.path, handle, current, before: item.before });
      }
      const approved = await options.confirm({
        snapshotId,
        files: targets.map(({ path, current, before }) => ({
          path, current, restoreTo: before,
          diff: diffText(current, before, 'current/' + path, 'restored/' + path, this.limits.maxDiffCells)
        }))
      });
      assert(approved === true, 'Restore was not confirmed by the user.');
      const attempted = [];
      try {
        for (const target of targets) {
          attempted.push(target);
          const writable = await target.handle.createWritable({ keepExistingData: false });
          await writable.write(target.before);
          await writable.close();
        }
      } catch (error) {
        for (const target of attempted.reverse()) {
          try {
            const writable = await target.handle.createWritable({ keepExistingData: false });
            await writable.write(target.current);
            await writable.close();
          } catch {}
        }
        throw new Error('Restore failed. Original recovery snapshot remains available: ' + snapshotId);
      }
      return { snapshotId, filesRestored: attempted.length };
    }
    async deleteRecoverySnapshot(snapshotId) {
      await dbRequest('readwrite', 'delete', snapshotId);
      return true;
    }
  }

  globalThis.AlandiBrowserLocalProvider = Object.freeze({
    BrowserLocalProvider, normalizePath, diffText
  });
})();
