import { test, expect } from '@playwright/test';
const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';
const NOTEBOOK_PATH = process.env.LIVE_SITE_URL ? './notebook/' : '/notebook/';

test('root navigation opens aNoteBooki as a shared application mode', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const shortcut = page.locator('#sidebar [data-action="open-notebook-mode"]');
  await expect(shortcut).toBeVisible();
  await expect(shortcut).toHaveAccessibleName('Открыть aNoteBooki Notebook');
  await expect(page.locator('#sidebar a[href*="/notebook/"]')).toHaveCount(0);
  await shortcut.click();
  await expect(page).toHaveURL(/#mode=notebook$/);
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'notebook');
  await expect(page.locator('#notebookModePanel')).toBeVisible();
  await expect(page.locator('#projectPanel')).toBeHidden();
  await expect(page.locator('#chatBox')).toBeVisible();
});

test('aNoteBooki persists notes and URL references locally with project/chat provenance', async ({ page }) => {
  let sourceFetches = 0;
  await page.addInitScript(() => {
    localStorage.setItem('ai_ui_language_v1', 'en');
    localStorage.setItem('ai_ui_theme_v2', 'light');
    localStorage.setItem('ai_projects_v1', JSON.stringify([{ id: 'project-notebook-1', name: 'Notebook Project' }, { id: 'project-notebook-2', name: 'Other Project' }]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([{ id: 'chat-notebook-1', title: 'Notebook Development Chat', projectId: 'project-notebook-1', messages: [] }, { id: 'chat-other', title: 'Other Project Chat', projectId: 'project-notebook-2', messages: [] }]));
  });
  await page.route('https://example.com/**', route => { sourceFetches++; return route.abort(); });
  await page.goto(NOTEBOOK_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('aNoteBooki');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#pageDescription')).toContainText('private workspace');
  await expect(page.locator('#notebookProject')).toContainText('Notebook Project');
  await expect(page.locator('#notebookChat')).toContainText('Notebook Development Chat');

  await page.locator('#newNotebookName').fill('Research notebook');
  await page.locator('#createNotebookButton').click();
  await expect(page.locator('#activeNotebookTitle')).toHaveText('Research notebook');
  await page.locator('#notebookProject').selectOption('project-notebook-1');
  await expect(page.locator('#notebookChat option[value="chat-other"]')).toHaveCount(0);
  await page.locator('#notebookChat').selectOption('chat-notebook-1');
  await page.locator('#saveLinksButton').click();
  await expect(page.locator('#scopeStatus')).toContainText('Links saved');

  await page.locator('#noteTitle').fill('Verified finding');
  await page.locator('#noteBody').fill('A concise note with an explicit project and chat scope.');
  await page.locator('#saveNoteButton').click();
  await expect(page.locator('#notebookItems')).toContainText('Verified finding');
  await page.locator('#sourceTitle').fill('Credentialed reference');
  await page.locator('#sourceUrl').fill('https://user:secret@example.com/private');
  await page.locator('#saveSourceButton').click();
  await expect(page.locator('#globalStatus')).toContainText('URL credentials are not allowed.');
  await expect(page.locator('#notebookItems')).not.toContainText('Credentialed reference');

  await page.locator('#sourceTitle').fill('Example reference');
  await page.locator('#sourceUrl').fill('https://example.com/reference');
  await page.locator('#saveSourceButton').click();
  await expect(page.locator('#notebookItems')).toContainText('Example reference');
  await page.locator('#sourceFiles').setInputFiles({ name: 'research-notes.md', mimeType: 'text/markdown', buffer: Buffer.from('# Research\n\nEvidence stays local.') });
  await page.locator('#importFilesButton').click();
  await expect(page.locator('#notebookItems')).toContainText('research-notes.md');
  const fileRecord = await page.evaluate(async () => { const notebook=(await window.AlandiNotebookStore.listNotebooks())[0]; return (await window.AlandiNotebookStore.listItems(notebook.id)).find(item=>item.type==='source_file'); });
  expect(fileRecord.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(fileRecord.provenance.originalBytesRetained).toBe(false);
  expect(fileRecord.extractedText).toContain('Evidence stays local.');
  await page.locator('#sourceFiles').setInputFiles([{ name: 'would-be-partial.md', mimeType: 'text/markdown', buffer: Buffer.from('Should not persist.') }, { name: 'unsupported.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.7') }]);
  await page.locator('#importFilesButton').click();
  await expect(page.locator('#globalStatus')).toContainText('Supported text formats');
  const noPartialImport = await page.evaluate(async () => { const n=(await window.AlandiNotebookStore.listNotebooks())[0]; return (await window.AlandiNotebookStore.listItems(n.id)).some(x=>x.fileName==='would-be-partial.md'); });
  expect(noPartialImport).toBe(false);
  expect(sourceFetches).toBe(0);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#activeNotebookTitle')).toHaveText('Research notebook');
  await expect(page.locator('#notebookItems')).toContainText('Verified finding');
  await expect(page.locator('#notebookItems')).toContainText('Example reference');
  await expect(page.locator('#notebookItems')).toContainText('research-notes.md');
  await expect(page.locator('#notebookProject')).toHaveValue('project-notebook-1');
  await expect(page.locator('#notebookChat')).toHaveValue('chat-notebook-1');
  const audit = await page.evaluate(async () => {
    const notebook = (await window.AlandiNotebookStore.listNotebooks())[0];
    return { notebook, items: await window.AlandiNotebookStore.listItems(notebook.id), events: await window.AlandiNotebookStore.listEvents(notebook.id) };
  });
  expect(audit.notebook.schemaVersion).toBe(1);
  expect(audit.notebook.autoTransfer).toBe(false);
  expect(audit.items.some(x => x.type === 'note' && x.provenance.kind === 'user_authored')).toBe(true);
  expect(audit.items.some(x => x.type === 'source_reference' && x.provenance.fetched === false)).toBe(true);
  expect(audit.events.some(x => x.type === 'notebook_scope_updated')).toBe(true);
});


test('Notebook answers source questions with local, selectable, traceable evidence only', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ai_ui_language_v1', 'en'));
  await page.goto(NOTEBOOK_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#newNotebookName').fill('Evidence notebook');
  await page.locator('#createNotebookButton').click();
  await page.locator('#sourceFiles').setInputFiles({ name: 'climate-research.md', mimeType: 'text/markdown', buffer: Buffer.from('# Carbon capture\n\nDirect air capture removes carbon dioxide from ambient air. It requires energy and geological storage for durable removal.\n\nOcean alkalinity enhancement increases seawater capacity to absorb carbon dioxide.') });
  await page.locator('#importFilesButton').click();
  await expect(page.locator('#sourcePicker')).toContainText('climate-research.md');
  await page.locator('#sourcePicker input').check();
  await page.locator('#sourceQuestion').fill('What does direct air capture remove?');
  let requests = 0;
  page.on('request', request => { if (/rag|chat\/completions|responses/i.test(request.url())) requests++; });
  await page.locator('#askSourcesButton').click();
  await expect(page.locator('#sourceChatLog')).toContainText('Direct air capture removes carbon dioxide from ambient air.');
  await expect(page.locator('#sourceChatLog')).toContainText('[1] climate-research.md');
  await expect(page.locator('#sourceChatStatus')).toContainText('Matching passages');
  expect(requests).toBe(0);
  await page.locator('#sourcePicker input').uncheck();
  await page.locator('#askSourcesButton').click();
  await expect(page.locator('#sourceChatStatus')).toContainText('Select at least one uploaded source.');
});

test('Notebook asks aServi only with explicitly selected excerpts and persists source evidence', async ({ page }) => {
  const outbound=[];
  await page.addInitScript(()=>{
    localStorage.setItem('ai_ui_language_v1','en');
    localStorage.setItem('ai_alandi_cloud_base_url','https://gateway.example.test/v1');
    localStorage.setItem('ai_alandi_cloud_model','notebook-e2e-model');
    localStorage.setItem('ai_api_key_alandi','notebook-e2e-key');
  });
  await page.route('https://gateway.example.test/**',async route=>{
    const request=route.request(),origin=request.headers().origin||'https://dorpnay.github.io';
    const cors={'access-control-allow-origin':origin,'access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'authorization,content-type','access-control-max-age':'600'};
    if(request.method()==='OPTIONS')return route.fulfill({status:204,headers:cors,body:''});
    if(request.url().endsWith('/v1/chat/completions')){outbound.push({authorization:request.headers().authorization,payload:request.postDataJSON()});return route.fulfill({status:200,headers:cors,contentType:'application/json',body:JSON.stringify({choices:[{message:{role:'assistant',content:'The selected pilot report recorded 42 participants [E1].'}}]})});}
    return route.fulfill({status:404,headers:cors,contentType:'application/json',body:'{}'});
  });
  page.on('dialog',dialog=>dialog.accept());
  await page.goto(NOTEBOOK_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('#newNotebookName').fill('aServi source chat');
  await page.locator('#createNotebookButton').click();
  await page.locator('#noteTitle').fill('Selected pilot report');
  await page.locator('#noteBody').fill('The selected pilot report recorded 42 participants and used a twelve-week evaluation.');
  await page.locator('#saveNoteButton').click();
  await page.locator('#noteTitle').fill('Unselected budget note');
  await page.locator('#noteBody').fill('Unrelated budget allocation was 9000 units.');
  await page.locator('#saveNoteButton').click();
  const sourceId=await page.evaluate(async()=>{const n=(await window.AlandiNotebookStore.listNotebooks())[0];return(await window.AlandiNotebookStore.listItems(n.id)).find(x=>x.title==='Selected pilot report').id;});
  await page.locator('#sourcePicker label').filter({hasText:'Selected pilot report'}).locator('input').check();
  await page.locator('#sourceQuestion').fill('How many participants joined the pilot?');
  await page.locator('#askSourcesAiButton').click();
  await expect(page.locator('#sourceChatLog')).toContainText('42 participants');
  expect(outbound).toHaveLength(1);
  expect(outbound[0].authorization).toBe('Bearer notebook-e2e-key');
  expect(outbound[0].payload.model).toBe('notebook-e2e-model');
  expect(outbound[0].payload.tools).toBeUndefined();
  const sent=JSON.stringify(outbound[0].payload.messages);
  expect(sent).toContain('42 participants');
  expect(sent).not.toContain('9000 units');
  const turn=await page.evaluate(async()=>{const n=(await window.AlandiNotebookStore.listNotebooks())[0];return(await window.AlandiNotebookStore.listItems(n.id)).find(x=>x.type==='source_chat_turn');});
  expect(turn.selectedSourceIds).toEqual([sourceId]);
  expect(turn.evidence).toHaveLength(1);
  expect(turn.evidence[0].quote).toContain('42 participants');
  expect(turn.citationStatus).toBe('ids_resolved');
  expect(turn.citationValidationLevel).toBe('exact_evidence_id_membership_only');
  expect(turn.claimVerification).toBe('not_performed');
  const unresolvedTurn=await page.evaluate(async({sourceId,turn})=>{
    const notebook=(await window.AlandiNotebookStore.listNotebooks())[0];
    return window.AlandiNotebookStore.addSourceChatTurn(notebook.id,{
      question:'Does the selected report prove a different fact?',
      answer:'This unrelated claim is attributed to the source [E99].',
      model:'notebook-e2e-model',selectedSourceIds:[sourceId],
      selectedSourceHashes:turn.selectedSourceHashes,evidence:turn.evidence
    });
  },{sourceId,turn});
  expect(unresolvedTurn.citationStatus).toBe('unresolved');
  expect(unresolvedTurn.invalidCitationIds).toEqual(['E99']);
  expect(unresolvedTurn.claimVerification).toBe('not_performed');
  const reportDownloadPromise=page.waitForEvent('download');
  await page.locator('#exportEvidenceButton').click();
  const reportDownload=await reportDownloadPromise;
  expect(reportDownload.suggestedFilename()).toContain('anotebooki-evidence-');
  const reportStream=await reportDownload.createReadStream();
  let reportText=''; for await (const chunk of reportStream) reportText+=chunk.toString('utf8');
  const evidenceReport=JSON.parse(reportText);
  expect(evidenceReport.schema).toBe('alandi.notebook.evidence-report');
  expect(evidenceReport.schemaVersion).toBe(1);
  expect(evidenceReport.summary).toMatchObject({turnCount:2,currentEvidenceTurns:2,staleEvidenceTurns:0,unresolvedCitationTurns:1});
  expect(evidenceReport.turns[0].selectedSources[0].sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(evidenceReport.turns[0].evidence[0].quote).toContain('42 participants');
  expect(evidenceReport.turns.some(x=>x.citationStatus==='ids_resolved'&&x.claimVerification==='not_performed')).toBe(true);
  expect(evidenceReport.turns.some(x=>x.citationStatus==='unresolved'&&x.invalidCitationIds.includes('E99'))).toBe(true);
  expect(reportText).not.toContain('9000 units');
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#sourceChatLog')).toContainText('The selected pilot report recorded 42 participants');
  await page.evaluate(id=>window.AlandiNotebookStore.deleteItem(id),sourceId);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#sourceChatLog')).toContainText('Evidence is stale');
  const staleReportDownloadPromise=page.waitForEvent('download');
  await page.locator('#exportEvidenceButton').click();
  const staleReportDownload=await staleReportDownloadPromise,staleStream=await staleReportDownload.createReadStream();
  let staleText=''; for await (const chunk of staleStream) staleText+=chunk.toString('utf8');
  const staleReport=JSON.parse(staleText);
  expect(staleReport.summary.staleEvidenceTurns).toBe(2);
  expect(staleReport.turns.every(x=>x.evidenceCurrent===false)).toBe(true);
});
