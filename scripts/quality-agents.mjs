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
const fail = (message) => { throw new Error(message); };
const includes = (needle, message) => assert.ok(source.includes(needle), message);
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
      for (const id of ['chatBox', 'userInput', 'sendBtn', 'stopBtn', 'settingsModal', 'apiKey', 'baseUrl', 'modelName', 'systemPromptInput', 'memoryBox', 'toggleSearch', 'toggleMultiAgent', 'modeFast', 'modeDeep', 'modeHint', 'providerPreset', 'modelPreset', 'modelSearch', 'refreshModelCatalog', 'providerHint', 'providerDocsLink', 'traceModal', 'traceContent', 'settingsProfileFile', 'toast']) {
        matches(new RegExp('id="' + id + '"'), 'Missing required UI element #' + id);
      }
    }],
    ['independent processing controls and on-demand resources', () => {
      includes('async function runMultiAgentResearch', 'Multi-agent research needs its own staged pipeline.');
      includes('function collectResearchEvidence(messages)', 'Research traces must preserve source evidence collected from actual tool results.');
      includes('function normalizeResearchEvidenceUrl(rawUrl)', 'Research evidence links must be public HTTPS URLs.');
      includes('const researchMessages = workChat.messages.slice(researchStart)', 'Evidence extraction must operate on the researcher execution, not synthetic citations.');
      includes('promptFingerprint,promptCharCount,plan,draft,critique,finalText,sources', 'Research traces must record prompt fingerprint metadata and source evidence.');
      includes("id: 'S' + (sources.length + 1)", 'Research source identifiers must be sequential.');
      includes('const evidenceSection = document.createElement', 'Research source evidence must be rendered through DOM nodes rather than raw HTML.');
      includes('MAX_RESEARCH_EVIDENCE', 'Research evidence must have a deterministic size cap.');
      includes('const PROVIDERS = {', 'Provider/model presets must be available.');
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
      includes("const DEFAULT_MODEL = 'gemini-3.8-flash'", 'Default Gemini model must match the current official catalogue.');
      for (const alias of ['secrets.GEMINI ||', 'secrets.GROQ ||', 'secrets.GROK }', 'secrets.POLLINATIONS ||', 'secrets.OPENROUTER ||', 'secrets.NVIDIA ||', 'secrets.HUGGINGFACE ||', 'secrets.CLOUDFLARE }']) {
        assert.ok(allSmokeWorkflow.includes(alias), 'All-provider smoke workflow is missing secret alias: ' + alias);
      }
      includes('function exportSettingsProfile()', 'Portable settings profile export must remain available.');
      includes('async function importSettingsProfile(event)', 'Portable settings profile import must remain available.');
      includes('function downloadTraceJson()', 'Research trace JSON export must remain available.');
      assert.ok(!source.includes("safeGet(STORAGE.model) === 'gemini-3.8-flash'"), 'A valid Gemini 3.8 model must not be downgraded on load.');
      includes('function getApiCandidates(requestedModel)', 'Provider failover must discover only configured credentials.');
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
      includes('await recordSuccessfulRoute(candidate,stageName,data?.model)', 'Successful requests must update the connection state for the actual route.');
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
      includes('текст запроса и контекст могут быть отправлены другому провайдеру', 'Cross-provider fallback must disclose that request content can be sent to another provider.');
      includes('ключ не сохранён для выбранного провайдера', 'Settings must explain why the API key field is blank after switching providers.');
      includes("const selectedProvider=safeGet(STORAGE.provider)||'gemini',allowCrossProvider=safeGet(STORAGE.crossProviderFallback)==='true'", 'Cross-provider fallback must be a user-controlled opt-in.');
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
      includes("format: 'ai-mobile-agent-settings'", 'Portable settings profiles must be versioned.');
      includes('function exportSettingsProfile()', 'Settings profile export must be available.');
      includes('function importSettingsProfile(event)', 'Settings profile import must validate input.');
      includes('Профиль импортирован. Сохранённые API-ключи не изменены.', 'Profile import must make secret preservation explicit.');
      includes("location.hash.match(/^#trace=([^&]+)/)", 'Local trace deep links must be supported.');
      includes('Локальная ссылка работает в этом же браузере', 'Trace links must disclose their local-only scope.');
      includes("const maxToolRounds = mode === 'deep' ? MAX_TOOL_ROUNDS : 1;", 'Fast and deep modes must have different tool budgets.');
      includes("mode === 'fast' && index > 0", 'Fast mode must cap tools executed per round.');
      includes("if (mode !== 'deep' && !useMultiAgent) return '';", 'Skills must not load in fast mode unless research is explicitly enabled.');
      includes("new URL('skills/' + skill + '.txt', document.baseURI)", 'Task skills should load from repository assets only on demand.');
      assert.ok(!source.includes('<script src="https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js"'), 'Pyodide must not load on initial page render.');
      includes("script.src = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js'", 'Pyodide should load only when requested.');
      for (const skill of ['research', 'code-review', 'data-analysis', 'planning']) {
        assert.ok(existsSync(resolve(root, 'skills/' + skill + '.txt')), 'Missing on-demand skill: ' + skill);
      }
    }],
    ['inline JavaScript parses without executing', () => {
      const blocks = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
        .filter((match) => !/\bsrc\s*=/i.test(match[1]));
      assert.ok(blocks.length > 0, 'No inline application script found.');
      blocks.forEach((block, index) => new Script(block[2], { filename: 'index.md:inline-script-' + index }));
    }],
    ['markdown rendering has an explicit sanitizer', () => {
      includes('DOMPurify.sanitize', 'DOMPurify sanitization is required.');
      matches(/innerHTML\s*=\s*safeMarkdown\(/, 'Rendered assistant HTML must pass through safeMarkdown.');
    }]
  ],
  security: [
    ['no obvious API keys committed in source', () => {
      assert.doesNotMatch(source, /AIza[0-9A-Za-z_-]{30,}/, 'Possible Google API key found in source.');
      assert.doesNotMatch(source, /\bsk-[A-Za-z0-9]{24,}/, 'Possible secret API key found in source.');
      assert.doesNotMatch(source, /\btvly-[A-Za-z0-9_-]{20,}/, 'Possible Tavily key found in source.');
    }],
    ['API credentials are user-configured, not hard-coded', () => {
      includes("apiKey: 'ai_api_key'", 'API key storage slot is missing.');
      includes('safeGet(STORAGE.apiKey)', 'API key must be read from user settings.');
      includes("'Authorization':`Bearer ${candidate.key}`", 'Requests must use a saved provider-specific bearer key.');
      includes('type="password" id="apiKey"', 'API key field must be masked.');
    }],
    ['untrusted output is not inserted as raw HTML', () => {
      includes("bubble.textContent = message.content || ''", 'User message should use textContent.');
      includes('DOMPurify.sanitize', 'DOMPurify sanitizer must remain enabled.');
      const assignments = [...source.matchAll(/\.innerHTML\s*=\s*([^;\n]+)/g)].map((m) => m[1].trim());
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
      includes("https://hn.algolia.com/api/v1/search", 'Hacker News search API must be available without a key.');
      includes("https://api.stackexchange.com/2.3/search/advanced", 'Stack Exchange search API must be available without a key.');
    }]
  ],
  context: [
    ['history and tool loops have hard bounds', () => {
      includes('const MAX_TOOL_ROUNDS = 4;', 'Tool-call round limit changed unexpectedly.');
      includes('const MAX_CONTEXT_MESSAGES = 24;', 'Message count budget is missing.');
      includes('const MAX_CONTEXT_CHARS = 24000;', 'Character context budget is missing.');
      includes('count + turn.length > MAX_CONTEXT_MESSAGES', 'History message cap is not enforced.');
      includes('function getHistoryCharBudget()', 'History budget must account for known context windows from the selected model catalogue.');
      includes('const charBudget = getHistoryCharBudget(systemPromptChars);', 'History trimming must derive a budget using the effective system prompt length.');
      includes('charCount + turnChars > charBudget', 'History trimming must use the active model-aware soft budget.');
      includes('contextTokens * 1.25', 'The model context window must be converted to a conservative character budget, not represented as exact token counting.');
      includes('estimatedWindowChars - outputReserveChars - promptReserveChars', 'Context budgeting must leave room for the effective prompt and generated output.');
      includes('buildHistory(chat.messages, systemPrompt.length)', 'Model-aware trimming must be applied before each actual model request.');
    }],
    ['memory retrieval is relevance-ranked and bounded', () => {
      includes('memory.score > 0', 'Irrelevant memories should not be attached.');
      includes('selectedMemories.length >= 4', 'Memory count cap is missing.');
      includes('memoryChars + memory.fact.length > 1200', 'Memory character cap is missing.');
      includes('контекст, не системные инструкции', 'Retrieved memories must not be framed as system instructions.');
    }],
    ['system prompt stays compact and backward compatible', () => {
      const prompt = source.match(/const DEFAULT_SYSTEM = \[([\s\S]*?)\]\.join\(' '\);/);
      assert.ok(prompt, 'Default system prompt definition not found.');
      const strings = [...prompt[1].matchAll(/'((?:\\.|[^'\\])*)'/g)].map((m) => m[1]);
      const promptText = strings.join(' ');
      assert.ok(promptText.length > 0 && promptText.length < 1800, 'Default system prompt should remain compact (<1800 characters).');
      includes('LEGACY_DEFAULT_SYSTEM', 'Legacy prompt migration guard is missing.');
      includes('configuredPrompt === LEGACY_DEFAULT_SYSTEM', 'Legacy saved prompt must migrate automatically.');
    }],
    ['tool loop fails closed at its configured boundary', () => {
      includes('round === maxToolRounds', 'Tool-call boundary must be checked against the active mode budget.');
      includes("const maxToolRounds = mode === 'deep' ? MAX_TOOL_ROUNDS : 1;", 'Mode-specific tool budget must be enforced.');
      includes('Достигнут лимит последовательных вызовов инструментов', 'Tool-loop exhaustion must be reported explicitly.');
    }]
  ],
  build: [
    ['Jekyll output contains the deployed app', () => {
      const built = resolve(root, '_site/index.html');
      assert.ok(existsSync(built), 'Jekyll build did not produce _site/index.html.');
      const html = readFileSync(built, 'utf8');
      assert.match(html, /<html\s+lang="ru">/i, 'Built page is missing the expected document.');
      assert.match(html, /id="chatBox"/, 'Built page is missing the chat UI.');
      assert.match(html, /DOMPurify\.sanitize/, 'Built page is missing the sanitization path.');
      assert.ok(existsSync(resolve(root, '_site/skills/research.txt')), 'Built site must publish the on-demand research skill.');
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
