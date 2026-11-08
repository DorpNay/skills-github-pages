import { test, expect } from '@playwright/test';

test('Browser Local previews exact multi-file diffs, requires approval, and restores snapshots', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ url: '/assets/js/browser-local-provider.js' });

  const result = await page.evaluate(async () => {
    const { BrowserLocalProvider } = window.AlandiBrowserLocalProvider;
    class MockFileHandle {
      constructor(name, content) { this.kind = 'file'; this.name = name; this.content = content; }
      async queryPermission() { return 'granted'; }
      async getFile() { return new File([this.content], this.name, { type: 'text/plain' }); }
      async createWritable() {
        let staged = '';
        return {
          write: async value => { staged = String(value); },
          close: async () => { this.content = staged; },
          abort: async () => {}
        };
      }
    }
    class MockDirectoryHandle {
      constructor(entries) { this.kind = 'directory'; this.name = 'workspace'; this.items = entries; }
      async queryPermission() { return 'granted'; }
      async *entries() { for (const entry of this.items) yield entry; }
      async getFileHandle(name) { return this.items.find(([key]) => key === name)?.[1]; }
      async getDirectoryHandle(name) { return this.items.find(([key]) => key === name)?.[1]; }
    }

    const first = new MockFileHandle('a.txt', 'alpha\nbeta\n');
    const second = new MockFileHandle('b.txt', 'one\ntwo\n');
    const root = new MockDirectoryHandle([['a.txt', first], ['b.txt', second]]);
    const provider = new BrowserLocalProvider();
    provider.rootHandle = root;

    const listed = await provider.listFiles();
    const read = await provider.readFiles(['a.txt', 'b.txt']);
    const prepared = await provider.prepareBatch([
      { path: 'a.txt', content: 'alpha\nchanged\n' },
      { path: 'b.txt', content: 'one\nupdated\n' }
    ]);
    const beforeApproval = [first.content, second.content];
    const exactDiff = prepared.files[0].diff;
    let rejected = false;
    try {
      await provider.commitBatch(prepared.id, {
        createRecoverySnapshot: true,
        confirm: async preview => preview.files.length === 2 && false
      });
    } catch (error) { rejected = /not confirmed/.test(error.message); }
    const afterRejectedApproval = [first.content, second.content];

    const result = await provider.commitBatch(prepared.id, {
      createRecoverySnapshot: true,
      confirm: async preview => preview.files.length === 2 &&
        preview.createsLocalRecoveryCopy === true &&
        preview.storage.includes('not uploaded')
    });
    const afterWrite = [first.content, second.content];
    const restored = await provider.restoreBatch(result.snapshotId, {
      rootHandle: root,
      confirm: async preview => preview.files.length === 2 &&
        preview.files.every(file => file.diff.includes('restored/'))
    });

    return {
      listed: listed.map(file => file.path),
      read: read.map(file => file.text),
      beforeApproval,
      exactDiff,
      rejected,
      afterRejectedApproval,
      afterWrite,
      restored: [first.content, second.content],
      restoredCount: restored.filesRestored,
      snapshots: (await provider.listRecoverySnapshots()).length
    };
  });

  expect(result.listed).toEqual(['a.txt', 'b.txt']);
  expect(result.read).toEqual(['alpha\nbeta\n', 'one\ntwo\n']);
  expect(result.beforeApproval).toEqual(['alpha\nbeta\n', 'one\ntwo\n']);
  expect(result.exactDiff).toContain('-beta');
  expect(result.exactDiff).toContain('+changed');
  expect(result.rejected).toBe(true);
  expect(result.afterRejectedApproval).toEqual(result.beforeApproval);
  expect(result.afterWrite).toEqual(['alpha\nchanged\n', 'one\nupdated\n']);
  expect(result.restored).toEqual(result.beforeApproval);
  expect(result.restoredCount).toBe(2);
  expect(result.snapshots).toBe(1);
});

test('Browser Local refuses a write when a file changes after diff preview', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ url: '/assets/js/browser-local-provider.js' });

  const result = await page.evaluate(async () => {
    const { BrowserLocalProvider } = window.AlandiBrowserLocalProvider;
    const file = {
      kind: 'file', name: 'note.txt', content: 'before',
      async queryPermission() { return 'granted'; },
      async getFile() { return new File([this.content], this.name); },
      async createWritable() {
        let staged = '';
        return { write: async value => { staged = String(value); }, close: async () => { this.content = staged; } };
      }
    };
    const provider = new BrowserLocalProvider();
    const prepared = await provider.prepareBatch([{ path: 'note.txt', handle: file, content: 'after' }]);
    file.content = 'changed elsewhere';
    let message = '';
    try {
      await provider.commitBatch(prepared.id, {
        createRecoverySnapshot: true,
        confirm: async () => true
      });
    } catch (error) { message = error.message; }
    return { message, content: file.content };
  });

  expect(result.message).toContain('changed after diff preview');
  expect(result.content).toBe('changed elsewhere');
});


test('Coder Workspace UI edits a user-selected file only after diff and recovery approval', async ({ page }) => {
  await page.addInitScript(() => {
    class MockFileHandle {
      constructor(name, content) { this.kind = 'file'; this.name = name; this.content = content; }
      async queryPermission() { return 'granted'; }
      async getFile() { return new File([this.content], this.name, { type: 'text/plain' }); }
      async createWritable() {
        let staged = '';
        return {
          write: async value => { staged = String(value); },
          close: async () => { this.content = staged; },
          abort: async () => {}
        };
      }
    }
    class MockDirectoryHandle {
      constructor(entries) { this.kind = 'directory'; this.name = 'owner-selected'; this.items = entries; }
      async queryPermission() { return 'granted'; }
      async *entries() { for (const entry of this.items) yield entry; }
      async getFileHandle(name) { return this.items.find(([key]) => key === name)?.[1]; }
      async getDirectoryHandle(name) { return this.items.find(([key]) => key === name)?.[1]; }
    }
    const file = new MockFileHandle('notes.md', '# Original\\nKeep this line.\\n');
    const root = new MockDirectoryHandle([['notes.md', file]]);
    window.__mockWorkspace = { file, root };
    window.FileSystemFileHandle = MockFileHandle;
    window.showDirectoryPicker = async () => root;
  });

  await page.goto('/workspace/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Выбрать папку' }).click();
  await expect(page.locator('#fileList')).toContainText('notes.md');
  await page.locator('#fileList input[data-path="notes.md"]').check();
  await page.getByRole('button', { name: 'Открыть выбранные' }).click();

  const editor = page.locator('textarea[data-path="notes.md"]');
  await expect(editor).toHaveValue('# Original\\nKeep this line.\\n');
  await editor.fill('# Updated\\nKeep this line.\\n');
  await page.getByRole('button', { name: 'Подготовить diff' }).click();
  await expect(page.locator('#diffPanel')).toBeVisible();
  await expect(page.locator('#diffList')).toContainText('-# Original');
  await expect(page.locator('#diffList')).toContainText('+# Updated');
  await expect.poll(() => page.evaluate(() => window.__mockWorkspace.file.content))
    .toBe('# Original\\nKeep this line.\\n');

  await page.locator('#recoveryConsent').check();
  await page.getByRole('button', { name: 'Подтвердить запись файлов' }).click();
  await expect(page.locator('#approvalDialog')).toBeVisible();
  await expect(page.locator('#approvalDiffs')).toContainText('-# Original');
  await page.getByRole('button', { name: 'Записать файлы' }).click();
  await expect(page.locator('#workspaceStatus')).toContainText('Записано файлов: 1');
  await expect.poll(() => page.evaluate(() => window.__mockWorkspace.file.content))
    .toBe('# Updated\\nKeep this line.\\n');

  await page.getByRole('button', { name: 'Восстановить' }).click();
  await expect(page.locator('#approvalDialog')).toBeVisible();
  await page.getByRole('button', { name: 'Восстановить файлы' }).click();
  await expect(page.locator('#workspaceStatus')).toContainText('Восстановлено файлов: 1');
  await expect.poll(() => page.evaluate(() => window.__mockWorkspace.file.content))
    .toBe('# Original\\nKeep this line.\\n');
});
