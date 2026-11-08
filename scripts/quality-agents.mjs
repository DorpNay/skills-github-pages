#!/usr/bin/env node
/**
 * Deterministic quality sentinels for the static AI Mobile Agent.
 * No LLM, API key, runtime dependency, network access, or user-device work.
 * Inspired by deterministic-before-LLM and evidence-first review practices.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'index.md');
const source = readFileSync(sourcePath, 'utf8');
const appPath = resolve(root, 'assets/js/app.js');
const appSource = readFileSync(appPath, 'utf8');
const appCss = readFileSync(resolve(root, 'assets/css/app.css'), 'utf8');
const landingCss = readFileSync(resolve(root, 'assets/css/landing.css'), 'utf8');
const combinedSource = [source, appSource, appCss, landingCss].join('\n');
const fail = (message) => { throw new Error(message); };
// Keep HTML structure checks on index.md; runtime checks span the external app assets.
const includes = (needle, message) => assert.ok(combinedSource.includes(needle), message);
const matches = (pattern, message) => assert.match(source, pattern, message);
const suites = {
  integrity: [
    ['Jekyll front matter and standalone HTML', () => {
      matches(/^---\s*\n[\s\S]*?layout:\s*null[\s\S]*?---\s*\n/, 'Expected layout: null front matter.');
      matches(/<html\s+lang="ru">/i, 'Russian document language is missing.');
      matches(/<meta\s+name="viewport"[^>]*>/i, 'Mobile viewport metadata is missing.');
      matches(/<\/html>\s*$/, 'Document must close its html element.');
    }],
    ['critical UI controls exist', () => {
      for (const id of ['chatBox', 'userInput', 'sendBtn', 'stopBtn', 'settingsModal', 'apiKey', 'apiKeyShell', 'apiKeyStatus', 'baseUrl', 'modelName', 'systemPromptInput', 'memoryBox', 'toggleSearch', 'toggleMultiAgent', 'modeFast', 'modeDeep', 'modeHint', 'providerPreset', 'modelPreset', 'modelSearch', 'refreshModelCatalog', 'providerHint', 'providerDocsLink', 'traceModal', 'traceContent', 'settingsProfileFile', 'toast', 'uiTheme', 'uiLanguage', 'uiMotion', 'aserviSettingsCard', 'aserviCardTitle', 'aserviStatusDot', 'aserviStatus', 'aserviBaseUrl', 'aserviBaseUrlError', 'aserviModel', 'aserviModelError', 'aserviApiKey', 'aserviApiKeyError', 'clockDigital', 'brandWordmark', 'projectPanel', 'projectSettingsModal', 'projectCreateModal', 'currentProjectSelect', 'projectMemoryScopeSelect', 'privateMemoryContextToggle', 'globalMemoryToggle', 'projectManagerDetails', 'projectMemoryBox', 'importProjectFile', 'functionsMenu', 'functionsMenuSummary', 'functionPanelModal', 'functionsDrawerNav', 'notebookFunctionSettings', 'notebookWorkspace', 'notebookTextFile', 'notebookRightsConsent', 'skillPresetSelect', 'agentModeControl', 'voiceMenu', 'attachTextButton', 'textAttachmentInput']) {
        matches(new RegExp('id="' + id + '"'), 'Missing required UI element #' + id);
      }
      assert.ok(source.includes('<div id="functionsMenu"'), 'The owner-approved Functions drawer launcher must exist.');
      assert.ok(source.includes('aria-controls="functionPanelModal"') && source.includes('aria-modal="true"'), 'Functions drawer must expose an accessible dialog trigger and modal.');
      for (const section of ['agents', 'research', 'notebook', 'skills']) {
        assert.ok(source.includes('data-action="open-function-panel" data-function="' + section + '"'), 'Functions drawer must expose the ' + section + ' section.');
      }
      assert.ok(source.includes('data-action="open-functions-drawer"'), 'Functions drawer must have an explicit opener.');
      assert.ok(combinedSource.includes('data-action="select-processing-mode" data-processing-mode="deep"'), 'Deep Research must expose the Thorough-mode shortcut.');
      assert.equal(source.includes('data-function="connectors"'), false, 'Do not expose placeholder Integrations without registered connectors.');
    }],
    ['independent processing controls and on-demand resources', () => {
      includes('async function runMultiAgentResearch', 'Multi-agent research needs its own staged pipeline.');
      includes('function collectResearchEvidence(messages)', 'Research traces must preserve actual source results returned by tools.');
      includes('function normalizeResearchEvidenceUrl(rawUrl)', 'Research evidence links must be validated as public HTTPS URLs.');
      includes('const researchMessages = workChat.messages.slice(researchStart)', 'Evidence must come from the actual researcher execution.');
      includes('systemPromptCharCount:String(systemPrompt||\'\').length', 'Research trace must include effective system context size.');
      includes("id: 'S' + (sources.length + 1)", 'Research source identifiers must be sequential.');
      includes('const evidenceSection = document.createElement', 'Research evidence must be rendered with DOM nodes rather than HTML strings.');
      includes('const MAX_RESEARCH_EVIDENCE = 40;', 'Research evidence must have a deterministic size cap.');
      includes('const PROVIDERS = {', 'Provider/model presets must be available.');
      includes("alandi: { label: 'aServi'", 'The aLandi private gateway must be a first-class provider.');
      includes("allowCrossProvider&&selectedProvider!=='alandi'", 'Selecting aLandi must never silently route private prompts to another provider even if global fallback is enabled.');
      includes('<section id="cloudSettingsCard"', 'aLandi must have a dedicated first-party server card.');
      includes('<h3 id="cloudCardTitle"', 'The private server card must have its own heading.');
      includes('<optgroup id="providerExternalGroup" label="Сторонние провайдеры">', 'The external provider picker must contain only third-party providers.');
      const pickerStart = source.indexOf('<select id="providerPreset"');
      const pickerClose = source.indexOf('</select>', pickerStart);
      const providerPicker = pickerStart >= 0 && pickerClose > pickerStart ? source.slice(pickerStart, pickerClose + '</select>'.length) : '';
      const extractGroup = (id) => {
        const start = providerPicker.indexOf('<optgroup id="' + id + '"');
        const close = providerPicker.indexOf('</optgroup>', start);
        return start >= 0 && close > start ? providerPicker.slice(start, close + '</optgroup>'.length) : '';
      };
      const externalRouteGroup = extractGroup('providerExternalGroup');
      const aserviStart = source.indexOf('<details id="aserviSettingsGroup"');
      const aserviClose = source.indexOf('</details>', aserviStart);
      const aserviSettings = aserviStart >= 0 && aserviClose > aserviStart ? source.slice(aserviStart, aserviClose + '</details>'.length) : '';
      assert.ok(source.includes('<details id="aserviSettingsGroup"'), 'aLandi aServi must have a dedicated settings disclosure.');
      assert.ok(aserviSettings.includes('data-action="connect-alandi-aservi"'), 'aServi must expose an explicit connection action inside its own settings group.');
      includes("if(currentProvider()!=='alandi'){setCloudStatus('disconnected');return;}", 'aServi probes must not run while a third-party provider is selected.');
      assert.ok(source.includes('aLandi aServi'), 'The first-party server route must use the current aLandi aServi product name.');
      assert.equal(source.includes('aLandi Cloud'), false, 'Do not reintroduce the retired aLandi Cloud product label.');
      includes('data-action="paste-aservi-key"', 'The first-party key action must use the aServi identifier.');
      assert.equal(source.includes('data-action="paste-cloud-key"'), false, 'Do not reintroduce the retired Cloud DOM action.');
      assert.equal(source.includes('data-action="connect-alandi-cloud"'), false, 'Do not reintroduce the retired Cloud connection action.');
      assert.ok(source.includes('<details id="legacyProviderSettings"'), 'Third-party providers must have a separate settings disclosure.');
      assert.ok(source.includes('<details id="additionalSettings"'), 'Additional settings must have a separate disclosure.');
      assert.equal(providerPicker.includes('<option value="alandi"'), false, 'The private aLandi route must never appear in the third-party provider picker.');
      assert.equal(source.includes('providerPrimaryGroup'), false, 'The obsolete hidden primary-provider optgroup must be removed.');
      assert.ok(externalRouteGroup.includes('<option value="gemini">') && externalRouteGroup.includes('<option value="custom">'), 'External providers must remain selectable.');
      includes("const peerSettingsGroups=[$('legacyProviderSettings'),$('additionalSettings')]", 'aServi must be mutually exclusive with third-party and additional settings; those two sections may coexist.');
      assert.equal((source.match(/id="cloudConnect"/g) || []).length, 0, 'The retired cloud connection element ID must remain absent.');
      includes('function connectAlandiAServi()', 'The aServi UI must verify a real model response before showing connected.');
      includes('function scheduleCloudAutoConnect()', 'Changes to private server settings must trigger a bounded automatic connection check.');
      includes('function setCloudFieldError(id,message', 'Invalid server fields must show an inline field-specific error.');
      includes("setCloudFieldConnection('connected')", 'The server fields must only turn green after the connection and health checks pass.');
      includes('Never show a green connection lamp for proxy text, HTML, or an unknown error body.', 'HTTP 200 with unrecognized text must not be considered a successful model probe.');
      includes("globalMemoryEnabled=safeGet(STORAGE.globalMemoryEnabled)==='true'", 'Global memory must be explicitly enabled, not added to every request by default.');
      includes("indexedDB.open('AI_Agent_DB_v87', 3)", 'Memory schema migration must create a separate shared store without deleting legacy private notes.');
      includes("database.createObjectStore('sharedMemory')", 'Shared memory must use a distinct IndexedDB object store.');
      includes("database.createObjectStore('notebooks')", 'Research notebooks must use a separate object store.');
      includes("database.createObjectStore('notebookEntries')", 'Notebook entries must use a separate object store.');
      includes("const privateMemories=selectedProviderForMemory==='alandi'?await MemoryDB.getAll():[]", 'Private notes must only be read for the local aLandi route.');
      assert.equal(combinedSource.includes('serverMemoryDetails'), false, 'The retired experimental server-memory UI must be fully removed.');
      assert.equal(combinedSource.includes('getServerProjectMemories'), false, 'The retired server graph-memory feature must not remain callable.');
      assert.equal(combinedSource.includes('serverProjectMemoryEnabled'), false, 'The retired server-memory opt-in state must not remain in chat contracts.');
      includes("const containsPrivateMemory=Array.isArray(body.messages)", 'Private-memory requests must be detected before provider fallback.');
      includes("if(containsPrivateMemory)candidates=candidates.filter(candidate=>candidate.provider==='alandi')", 'Private-memory requests must never fall back to a third-party provider.');
      includes("if(containsPrivateMemory)candidates=candidates.filter(candidate=>candidate.provider==='alandi')", 'Requests carrying personal memory must never fall back to a third-party provider.');
      includes("let candidates=getApiCandidates(preferredModel)", 'Provider candidate routing must be filterable before a request is sent.');
      includes("if(containsPrivateMemory)candidates=candidates.filter(candidate=>candidate.provider==='alandi')", 'A request carrying private memory must never fall back to a third-party provider.');
      includes("activeChatForPrivacy?.privateMemoryUsed && selectedProvider!=='alandi'", 'Chats that consumed private memory must not later upload their history to a third-party provider.');
      includes("[Команда сохранения в личную память; содержимое не дублируется в истории чата.]", 'Private remember commands must not leave the private fact in provider-bound chat history.');
      includes("[Команда сохранения факта в общую память; значение не дублируется в истории чата.]", 'Shared-memory command values must only enter later prompts through the explicit shared-memory opt-in.');
      includes("promote.dataset.action", 'Private-to-shared promotion must be a per-fact user action.');
      includes("data-action=\"save-shared-memory\"", 'The user must be able to save a fact directly to the separate shared store.');
      includes('function loadProjects()', 'Project data must have a bounded and validated loader.');
      includes('chat.projectMemoryEnabled&&activeProject', 'Project memory must be opt-in at chat scope.');
      includes('data-action="export-project"', 'Project bundle export must be available.');
      includes('chat.projectId', 'Project associations must be modeled on chats.');
      includes('projectInstructionContext', 'Project instructions must be included only for the selected project.');
      includes("safeSet(STORAGE.globalMemoryEnabled,String(event.target.checked))", 'Global memory opt-in toggle must persist explicitly.');
      includes('function importProjectBundle(event)', 'Project bundle import must validate its version and size.');
      includes("const suffix=getUiLanguage()==='en'?' (imported)':' (импорт)'", 'Importing a bundle must create a distinct project instead of silently merging it into the active project.');
      includes("if(projects.length>=200)throw new Error('Достигнут предел проектов (200). Сначала удали ненужный проект.');", 'Project import must respect the local project-count bound.');
      includes("if(chats.length+importedChats.length>1000)throw new Error('Импорт превысит безопасный лимит локальных чатов (1000).');", 'Project import must bound total local chat count.');
      includes('data-action="voice-chat-preview"', 'Voice mode chooser must be present without claiming a live voice runtime.');
      includes('async function handleTextAttachment()', 'Text attachments must be size/type bounded and treated as untrusted data.');
      includes("provider==='custom'||provider==='alandi'", 'Custom gateway providers must not fall back to the default cloud endpoint.');
      includes("requestHeaders['X-AI-Cache-Bypass']='1'", 'Dynamic agent turns must explicitly bypass the server response cache.');
      includes('X-AI-Cache', 'The browser should read the exposed private gateway cache status.');
      includes("safeSet('ai_ui_theme_v2'", 'Theme preference must persist locally.');
      includes("safeSet('ai_ui_motion_v2'", 'Motion preference must persist locally.');
      includes('function applyAppearance(theme, motion)', 'Appearance state needs a single validated application function.');
      includes('tiffany-sweep', 'Tiffany Motion styles must be present.');
      includes('async function refreshModelCatalog(options = {})', 'Provider model catalogs must be refreshed through the bounded safe loader.');
      includes('async function refreshConnectedModelCatalogs(options = {})', 'Connected provider catalogs must refresh for the cross-provider fallback.');
      includes('const modelIsListed = model && all.some(item => item.id === model);', 'A missing saved model must not hide all discovered model options.');
      includes('function normalizeModelCatalog(payload, provider)', 'Dynamic models must be normalized and filtered before entering the UI.');
      includes('function getProviderFallbackModelIds(provider, primary, limit = MODEL_CATALOG_FALLBACK_LIMIT)', 'Auto fallback must share the bounded model inventory.');
      includes('const MODEL_CATALOG_MAX_ITEMS = 250', 'Dynamic catalog rendering must be capped for mobile browsers.');
      includes("return 'https://gen.pollinations.ai/text/models'", 'Pollinations catalog should use the dedicated text-only public endpoint.');
      includes('output_modalities=text&sort=most-popular', 'OpenRouter catalog should request text output and popularity ordering.');
      includes('task=text-generation&hide_experimental=true', 'Cloudflare catalog should be scoped to text generation and non-experimental models.');
      includes('const maxRouterCandidates = 16;', 'Cross-provider fallback must have a global attempt bound.');
      includes('if ((stale || expired) && !allowStale) return null;', 'Expired or explicitly stale catalogs must not be used for automatic fallback.');
      includes('keyFingerprint, fetchedAt: Date.now(), models', 'Catalog persistence must store credential fingerprints, not credentials.');
      includes('async function refreshModelCatalog(options = {})', 'Model list refresh is a first-class action.');
      includes("xai: { label: 'xAI · Grok'", 'xAI Grok must be a separate provider from Groq.');
      includes("pollinations: { label: 'Pollinations.ai'", 'Pollinations must use its own API catalog and endpoint.');
      includes("cloudflare: { label: 'Cloudflare Workers AI'", 'Cloudflare Workers AI must be a selectable provider.');
      includes('function finishPollinationsOAuth()', 'Pollinations OAuth callback must be implemented.');
      includes("token: 'ai_pollinations_access_token_v1'", 'Pollinations access token storage must be session-scoped.');
      includes("https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1", 'Cloudflare endpoint must include the validated account ID.');
      includes("nvidia: { label: 'NVIDIA NIM'", 'NVIDIA NIM should be included as an active alternative.');
      assert.ok(!source.includes('cerebras: {') && !source.includes('value="cerebras"'), 'Cerebras must remain removed per product decision.');
      assert.ok(!source.includes('value="github">GitHub Models'), 'Retired GitHub Models must not be offered as a provider.');
      const allSmokeWorkflow = readFileSync(resolve(root, '.github/workflows/provider-smoke-all.yml'), 'utf8');
      const allSmokeRunner = readFileSync(resolve(root, 'scripts/provider-smoke-all.mjs'), 'utf8');
      assert.ok(allSmokeRunner.includes("config.id === 'pollinations' && /^pk_/i.test(secret)"), 'Pollinations browser App Keys must not be used as server smoke credentials.');
      assert.ok(allSmokeWorkflow.includes('confirm_live_requests:'), 'Live provider smoke must declare an explicit confirmation input.');
      assert.ok(allSmokeWorkflow.includes('default: false'), 'Live provider smoke confirmation must default to unchecked.');
      assert.ok(allSmokeWorkflow.includes('if: ${{ inputs.confirm_live_requests == true }}'), 'Live provider probes must run only after affirmative confirmation.');
      assert.ok(allSmokeWorkflow.includes('if: ${{ inputs.confirm_live_requests != true }}'), 'Unconfirmed dispatches must report that no live requests were sent.');
      for (const provider of ['GEMINI', 'GROQ', 'XAI', 'POLLINATIONS', 'OPENROUTER', 'NVIDIA', 'HUGGINGFACE', 'CLOUDFLARE']) {
        assert.ok(allSmokeWorkflow.includes('MODEL_OVERRIDE_' + provider + ': ${{ vars.MODEL_OVERRIDE_' + provider), 'Provider smoke workflow must expose the optional model override variable for ' + provider + '.');
      }
      includes("const DEFAULT_MODEL = 'gemini-3.8-flash'", 'Default Gemini model must match the current official catalogue.');
      for (const alias of ['secrets.GEMINI ||', 'secrets.GROQ ||', 'secrets.GROK }', 'secrets.POLLINATIONS ||', 'secrets.OPENROUTER ||', 'secrets.NVIDIA ||', 'secrets.HUGGINGFACE ||', 'secrets.CLOUDFLARE }']) {
        assert.ok(allSmokeWorkflow.includes(alias), 'All-provider smoke workflow is missing secret alias: ' + alias);
      }
      includes('function exportSettingsProfile()', 'Portable settings profile export must remain available.');
      includes('async function importSettingsProfile(event)', 'Portable settings profile import must remain available.');
      includes('function downloadTraceJson()', 'Research trace JSON export must remain available.');
      assert.ok(!source.includes("safeGet(STORAGE.model) === 'gemini-3.8-flash'"), 'A valid Gemini 3.8 model must not be downgraded on load.');
      includes('function getApiCandidates(requestedModel)', 'Provider failover must discover only configured credentials.');
      includes("if(!key && provider!=='kilo') continue;", 'Only the explicitly selected Kilo Free route may omit an API key.');
      includes('function connectAlandiAServi()', 'The primary aServi route status must be verified with a real completion.');
      includes('id="cloudStatusDot" data-state="disconnected"', 'Cloud connection must begin unconfirmed.');
      includes('if(error.modelUnavailable)', 'Only a model-specific provider failure may trigger same-provider model selection.');
      includes('function applyUiLanguage(language)', 'The main UI must support a persisted language choice.');
      includes('function updateClockFace()', 'The branded local clock must use real local time.');
      includes('function handleTextAttachment()', 'Text attachment handling must validate extension, size and content boundaries.');
      includes('function shouldUseMultiAgentResearch(value)', 'Multi-agent orchestration must be routed by task complexity.');
      includes('async function testProviderConnection()', 'Provider connections must have an actionable diagnostic.');
      includes('function parseRetryAfterMs(value)', 'HTTP Retry-After must be respected rather than using a fixed retry delay.');
      includes('if(!modelError)break;', 'Transient server and rate-limit errors must not trigger fast model/provider failover.');
      includes('id="offlineToggle"', 'User must be able to explicitly disable online search tools.');
      includes('function getRunEstimateMs()', 'Response timing should learn a lightweight per-route estimate.');
      includes('data-state="connected"', 'A confirmed API connection must have a distinct UI state.');
      includes('message.providerInfo', 'Assistant responses must display the actual provider/model route.');
      includes('function syncSettingsToActualRoute(route)', 'Settings must follow the final successful provider/model route after the response finishes.');
      includes('syncSettingsToActualRoute(lastSuccessfulRoute)', 'Settings must not change until the full answer pipeline completes.');
      includes("source:'successful-request'", 'A successful model response should store only non-secret connection-verification metadata.');
      includes('await recordSuccessfulRoute(candidate,stageName,data?.model,{elapsedMs,attemptIndex:i+1,cacheStatus:data?.__alCacheStatus})', 'Successful requests must preserve per-attempt timings and carry the optional server-cache status.');
      includes('async function requestChatCompletion(body,signal', 'All model calls must use the classified provider fallback path.');
      includes("Запрос не выполнен. Исходный текст сохранён.", 'Fallback errors must preserve the original user prompt.');
      includes("showToast('Настройки сохранены')", 'Saving settings should use the toast and keep the modal open.');
      includes("node.classList.add('toast-visible')", 'Toast notification must use lightweight CSS animation.');
      includes("$('userInput').disabled = false;", 'Composer must remain editable during generation.');
      includes("['openai/gpt-oss-120b:fastest'", 'Hugging Face preset should use a routed chat model.');
      includes('A removed provider preset must not leave a stale endpoint active.', 'Removed provider settings must migrate safely.');
      includes("docsUrl: 'https://openrouter.ai/settings/keys'", 'OpenRouter key setup link must be available.');
      includes("docsUrl: 'https://build.nvidia.com/settings'", 'NVIDIA API key setup link must be available.');
      includes('function getConfiguredApiKey()', 'API keys must be selected per provider.');
      includes('safeSet(providerKeyStorage(provider),enteredApiKey)', 'Only an explicitly entered provider key should overwrite its stored value.');
      includes("provider==='gemini'&&enteredApiKey?[safeSet(STORAGE.apiKey,enteredApiKey)]:[]", 'Saving settings must not erase the Gemini key when the password field is blank.');
      includes('Older builds wrote every provider\'s key into the legacy Gemini slot.', 'Legacy cross-provider key contamination must be migrated safely.');
      includes('текст запроса и контекст могут передаваться другому сервису', 'Cross-provider fallback must disclose that request content can be sent to another provider.');
      includes('Ключ не сохранён для выбранного провайдера.', 'Settings must explain why the API key field is blank after switching providers.');
      includes("const selectedProvider=safeGet(STORAGE.provider)||'alandi',allowCrossProvider=safeGet(STORAGE.crossProviderFallback)==='true'", 'Cross-provider fallback must be a user-controlled opt-in.');
      includes('function isGenericModelRefusal(value)', 'Generic model refusals must not be accepted as successful research stages.');
      includes('Конвейер остановлен', 'A refused multi-agent stage must stop clearly rather than repeat the refusal as a final answer.');
      includes('if (!savedChats || !savedCurrent)', 'Chat persistence failures must be visible to the user.');
      includes('function preserveUnreadableChats(rawText)', 'Unreadable chat history must be preserved before a fresh chat is persisted.');
      includes('ai_chats_recovery_backup', 'Chat recovery backup must use a separate local-storage key.');
      includes('function downloadRecoveryBackup()', 'A user must be able to export the preserved recovery backup.');
      includes('id="recoveryBackupButton"', 'The recovery backup download control must exist.');
      includes('if (chatStorageCorruptNotBackedUp)', 'Unreadable source data must not be overwritten when backup creation fails.');
      includes('if (chatRecoveryWarning) showToast(', 'The user must be warned when stored chat history cannot be read.');
      includes('content: finalText, researchTrace', 'Multi-agent output must preserve the research journal.');
      includes('Открыть журнал исследования', 'Assistant research results must expose a trace action.');
      includes('body.textContent=typeof value', 'Research trace must render as text rather than unsafe HTML.');
      includes('function downloadTrace()', 'Research journal must be downloadable as Markdown.');
      includes('function downloadTraceJson()', 'Research journal must also have a structured JSON export.');
      includes('configuredPromptFingerprint', 'Research traces must carry a one-way prompt fingerprint, not raw prompt text.');
      includes('activeRunTelemetry.attempts.push({...attempt})', 'Successful provider attempts must be recorded for trace diagnostics.');
      includes('failureType:classifyRouteFailure(error,modelError)', 'Failed attempts must record a safe category rather than raw error contents.');
      includes("appendTraceSection('Параметры запуска'", 'The research trace viewer must show reproducibility metadata.');
      includes("appendTraceSection('Попытки вызова модели'", 'The research trace viewer must show provider attempt telemetry.');
      includes("format: 'ai-mobile-agent-settings'", 'Portable settings profiles must be versioned.');
      includes('function exportSettingsProfile()', 'Settings profile export must be available.');
      includes('function importSettingsProfile(event)', 'Settings profile import must validate input.');
      includes('Профиль импортирован. Сохранённые API-ключи не изменены.', 'Profile import must make secret preservation explicit.');
      includes("location.hash.match(/^#trace=([^&]+)/)", 'Local trace deep links must be supported.');
      includes('Локальная ссылка работает в этом же браузере', 'Trace links must disclose their local-only scope.');
      includes("const extendedToolBudget = mode === 'deep';", 'Only work effort may expand the tool execution budget.');
      includes("const searchResultMode = extendedSearch ? 'deep' : 'fast';", 'Only web-search scope may expand result and extraction volume.');
      includes("const maxToolRounds = extendedToolBudget ? MAX_TOOL_ROUNDS : 1;", 'Fast and thorough modes must have different tool budgets.');
      includes("const maxToolCallsPerRound = extendedToolBudget ? MAX_TOOL_CALLS_PER_DEEP_ROUND : 1;", 'Only work effort may increase per-round tool calls.');
      includes("const maxToolCallsPerRun = extendedToolBudget ? MAX_TOOL_CALLS_PER_DEEP_RUN : 1;", 'Only work effort may increase per-run tool calls.');
      includes("performTavilySearch(args.query.trim().slice(0, 500), signal, searchResultMode)", 'Tavily result breadth must use the independent search scope.');
      includes("performPublicKnowledgeSearch(args.source, args.query.trim().slice(0, 300), signal, searchResultMode)", 'Public search breadth must use the independent search scope.');
      includes("readPublicWebpage(args.url.trim().slice(0, 1500), signal, searchResultMode)", 'Webpage extraction depth must use the independent search scope.');
      assert.ok(!combinedSource.includes("const extendedToolBudget = mode === 'deep' || extendedSearch;"), 'Search scope must not increase execution budget.');
      assert.ok(!combinedSource.includes("mode === 'fast' && index > 0 && !extendedSearch"), 'Fast-mode tool limits must not depend on search scope.');
      assert.equal(combinedSource.includes('researchStudio'), false, 'Retired Research Studio source and UI must be absent.');
      assert.equal(combinedSource.includes('open-research-studio'), false, 'Retired Research Studio actions must be absent.');
      assert.ok(source.includes('data-action="select-processing-mode" data-processing-mode="deep"'), 'Deep Research must set Thorough mode through a bounded UI action.');
      assert.equal(combinedSource.includes('serverMemory'), false, 'Retired Server Memory experiment code and copy must be absent.');
      assert.equal(combinedSource.includes('serverProjectMemory'), false, 'Retired server project-memory flags must be absent.');
      assert.equal(combinedSource.includes('/memory/graph/'), false, 'The static app must not call the retired server-memory graph API.');
      assert.ok(source.includes('id="projectMemoryHelperDetails"') && source.includes('suggestProjectMemoryWithHelper'), 'Independent manual local-project helper must remain available.');
      includes("await runAssistant(workChat, signal, useSearch, false, mode, true,", 'The structured workflow must honor the selected effort budget in its research stage.');
      includes("if (mode !== 'deep' && !useMultiAgent && chosenSkill === 'auto') return '';", 'Automatic skills must not load in fast mode unless research is explicitly enabled.');
      includes("chosenSkill !== 'auto' ? chosenSkill", 'A manually selected skill must be usable in fast mode.');
      includes("new URL('skills/' + selectedSkill + '.txt', document.baseURI)", 'Task skills should load from repository assets only on demand.');
      assert.ok(!source.includes('<script src="https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js"'), 'Pyodide must not load on initial page render.');
      includes("script.src = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js'", 'Pyodide should load only when requested.');
      includes("const isMultimodalTask = /", 'Multimodal task classifier must be explicit and reviewable.');
      includes("const skill = isMultimodalTask ? 'multimodal'", 'Multimodal prompts must select the specialist skill before generic research.');
      for (const skill of ['research', 'code-review', 'data-analysis', 'planning', 'multimodal']) {
        assert.ok(existsSync(resolve(root, 'skills/' + skill + '.txt')), 'Missing on-demand skill: ' + skill);
      }
    }],
    ['external JavaScript parses without executing', () => {
      assert.match(source, /<script[^>]+src=["'][^"']*assets\/js\/app\.js["']/i, 'The app runtime must be loaded as an external asset.');
      assert.match(source, /<link[^>]+href=["'][^"']*assets\/css\/app\.css["']/i, 'The app stylesheet must be loaded as an external asset.');
      assert.equal((source.match(/<script\b(?![^>]*\bsrc=)[^>]*>/gi) || []).length, 0, 'The app page must not carry an inline application script.');
      // nosemgrep: javascript.lang.security.audit.unknown-value-with-script-tag.unknown-value-with-script-tag -- vm.Script parses source only; it never inserts a DOM script element.
      try { new Script(appSource, { filename: 'assets/js/app.js' }); } // nosemgrep: javascript.lang.security.audit.unknown-value-with-script-tag.unknown-value-with-script-tag -- vm.Script parses source; it does not create a DOM script element.
      catch (error) { console.error(error.stack || String(error)); throw error; }
    }],
    ['markdown rendering has an explicit sanitizer', () => {
      includes('DOMPurify.sanitize', 'DOMPurify sanitization is required.');
      assert.match(appSource, /innerHTML\s*=\s*safeMarkdown\(/, 'Rendered assistant HTML must pass through safeMarkdown.');
    }]
  ],
  security: [
    ['no obvious API keys committed in source', () => {
      assert.doesNotMatch(combinedSource, /AIza[0-9A-Za-z_-]{30,}/, 'Possible Google API key found in source.');
      assert.doesNotMatch(source, /\bsk-[A-Za-z0-9]{24,}/, 'Possible secret API key found in source.');
      assert.doesNotMatch(source, /\btvly-[A-Za-z0-9_-]{20,}/, 'Possible Tavily key found in source.');
    }],
    ['API credentials are user-configured, not hard-coded', () => {
      includes("apiKey: 'ai_api_key'", 'API key storage slot is missing.');
      includes('safeGet(STORAGE.apiKey)', 'API key must be read from user settings.');
      includes("...(candidate.key?{'Authorization':`Bearer ${candidate.key}`}:{})", 'Requests must use an optional provider-specific bearer key and omit Authorization for keyless Kilo Free.');
      includes('type="password" id="apiKey"', 'API key field must be masked.');
    }],
    ['untrusted output is not inserted as raw HTML', () => {
      includes("bubble.textContent = message.content || ''", 'User message should use textContent.');
      includes('DOMPurify.sanitize', 'DOMPurify sanitizer must remain enabled.');
      const assignments = [...appSource.matchAll(/\.innerHTML\s*=\s*([^;\n]+)/g)].map((m) => m[1].trim());
      assert.ok(assignments.length > 0, 'Expected the one sanitized markdown rendering assignment.');
      assert.ok(assignments.every((value) => value.startsWith('safeMarkdown(')), 'Found an innerHTML assignment that bypasses safeMarkdown: ' + assignments.join(' | '));
    }],
    ['no dynamic code evaluation primitives', () => {
      assert.doesNotMatch(source, /\beval\s*\(/, 'eval() is not allowed in the application shell.');
      assert.doesNotMatch(source, /\bnew\s+Function\s*\(/, 'new Function() is not allowed in the application shell.');
    }],
    ['web search tool input is schema-bounded', () => {
      includes("additionalProperties: false", 'Tool schema must reject unexpected fields.');
      includes("args.query.trim().slice(0, 500)", 'Search queries must be trimmed and length-limited.');
      includes("name: 'public_knowledge_search'", 'No-key public knowledge search tool must remain available.');
      includes("name: 'read_webpage'", 'Direct public webpage reading must remain available.');
      includes('async function performPublicKnowledgeSearch(source, query, signal', 'Specialized public APIs must be implemented in the browser.');
      includes('async function readPublicWebpage(rawUrl, signal', 'Public webpage text extraction must remain implemented.');
      includes('validatePublicHttpsUrl', 'Direct page reading must validate public HTTPS URLs.');
      includes("host.includes(':')", 'Direct page reading must reject IPv6 literal addresses, including IPv4-mapped loopback forms.');
      includes("https://hn.algolia.com/api/v1/search", 'Hacker News search API must be available without a key.');
      includes("https://api.stackexchange.com/2.3/search/advanced", 'Stack Exchange search API must be available without a key.');
    }]
  ],
  context: [
    ['history and tool loops have hard bounds', () => {
      includes('const MAX_TOOL_ROUNDS = 4;', 'Tool-call round limit changed unexpectedly.');
      includes('const FALLBACK_CONTEXT_TOKENS = 16384;', 'Fallback context budget for providers without metadata is missing.');
      assert.ok(!source.includes('const MAX_CONTEXT_MESSAGES = 24;'), 'Do not reintroduce the arbitrary message-count cap.');
      assert.ok(!source.includes('const MAX_CONTEXT_CHARS = 24000;'), 'Do not reintroduce the arbitrary global character cap.');
      assert.ok(!source.includes('count + turn.length > MAX_CONTEXT_MESSAGES'), 'History must not be capped by a fixed message count.');
      includes('function getHistoryCharBudget(systemPromptChars = 0, provider = currentProvider()', 'History budget must use catalogued context-window metadata for the attempted provider/model.');
      includes('buildHistory(historyMessages,systemChars,candidate.provider,candidate.model)', 'Every fallback candidate must apply its own context budget.');
      includes('charCount + turnChars > charBudget', 'History trimming must use the active model-aware soft budget.');
      includes('estimatedWindowChars - outputReserveChars - promptReserveChars', 'History budget must reserve room for the effective system context and output.');
      includes('buildHistory(chat.messages, systemPrompt.length)', 'Adaptive trimming must be applied before each provider request.');
    }],
    ['memory retrieval is relevance-ranked and bounded', () => {
      includes('memory.score > 0', 'Irrelevant memories should not be attached.');
      includes('selectedMemories.length >= 4', 'Memory count cap is missing.');
      includes('memoryChars + memory.fact.length > 1200', 'Memory character cap is missing.');
      includes('контекст, не системные инструкции', 'Retrieved memories must not be framed as system instructions.');
    }],
    ['global system prompt is opt-in and legacy prompt migrates', () => {
      includes("const DEFAULT_SYSTEM = '';", 'The global system prompt must be empty by default.');
      includes('LEGACY_DEFAULT_SYSTEM', 'Legacy prompt migration guard is missing.');
      includes('configuredPrompt === LEGACY_DEFAULT_SYSTEM', 'Legacy saved prompt must migrate automatically.');
    }],
    ['tool loop fails closed at its configured boundary', () => {
      includes('round === maxToolRounds', 'Tool-call boundary must be checked against the active mode budget.');
      includes("const maxToolRounds = extendedToolBudget ? MAX_TOOL_ROUNDS : 1;", 'Mode-specific tool budget must be enforced.');
      includes('const MAX_TOOL_CALLS_PER_RESPONSE = 8;', 'A provider cannot return an unbounded tool-call array.');
      includes('const MAX_TOOL_CALLS_PER_DEEP_ROUND = 3;', 'Deep mode needs a strict per-round tool-call cap.');
      includes('const MAX_TOOL_CALLS_PER_DEEP_RUN = 8;', 'Deep mode needs a strict total tool-call budget.');
      includes('seenToolCallKeys.has(toolSignature)', 'Duplicate tool calls must be suppressed within a run.');
      includes('round < maxToolRounds && executedToolCalls < maxToolCallsPerRun', 'The final response round must be reserved from additional tool fan-out.');
      includes('Бюджет инструментов исчерпан', 'Tool-loop exhaustion must be reported explicitly.');
    }]
  ],
  build: [
    ['Jekyll output contains the deployed app', () => {
      const built = resolve(root, '_site/index.html');
      const builtApp = resolve(root, '_site/assets/js/app.js');
      const builtCss = resolve(root, '_site/assets/css/app.css');
      assert.ok(existsSync(built), 'Jekyll build did not produce _site/index.html.');
      assert.ok(existsSync(builtApp), 'Jekyll build did not publish the external app runtime.');
      assert.ok(existsSync(builtCss), 'Jekyll build did not publish the external app stylesheet.');
      const html = readFileSync(built, 'utf8');
      const runtime = readFileSync(builtApp, 'utf8');
      assert.match(html, /<html\s+lang="ru">/i, 'Built page is missing the expected document.');
      assert.match(html, /id="chatBox"/, 'Built page is missing the chat UI.');
      assert.match(html, /assets\/js\/app\.js/, 'Built page must reference the external runtime.');
      assert.match(html, /assets\/css\/app\.css/, 'Built page must reference the external stylesheet.');
      assert.match(runtime, /DOMPurify\.sanitize/, 'Built app runtime is missing the sanitization path.');
      assert.ok(existsSync(resolve(root, '_site/skills/research.txt')), 'Built site must publish the on-demand research skill.');
      assert.ok(existsSync(resolve(root, '_site/skills/multimodal.txt')), 'Built site must publish the on-demand multimodal skill.');
    }]

  ]
};

const requested = process.argv[2] || 'all';
const selected = requested === 'all' ? Object.keys(suites) : [requested];
if (selected.some((name) => !suites[name])) {
  console.error('Usage: node scripts/quality-agents.mjs [integrity|security|context|build|all]');
  process.exit(2);
}
let failures = 0;
for (const suiteName of selected) {
  for (const [name, check] of suites[suiteName]) {
    try {
      check();
      console.log('PASS [' + suiteName + '] ' + name);
    } catch (error) {
      failures++;
      console.error('FAIL [' + suiteName + '] ' + name + '\n  ' + (error?.message || String(error)));
    }
  }
}
console.log('\nQuality sentinels: ' + (selected.join(', ')) + ' — ' + (failures ? failures + ' failure(s)' : 'all checks passed') + '.');
if (failures) process.exit(1);
