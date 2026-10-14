#!/usr/bin/env node
// Run one minimal live completion per provider whose Actions secret is configured.
// Secrets are passed only to the child probe environment and never logged verbatim.
import { appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const probePath = fileURLToPath(new URL('./provider-smoke.mjs', import.meta.url));
const providers = [
  { id: 'gemini', env: 'GEMINI_API_KEY' },
  { id: 'groq', env: 'GROQ_API_KEY' },
  { id: 'xai', env: 'XAI_API_KEY' },
  { id: 'pollinations', env: 'POLLINATIONS_API_KEY' },
  { id: 'openrouter', env: 'OPENROUTER_API_KEY' },
  { id: 'nvidia', env: 'NVIDIA_API_KEY' },
  { id: 'huggingface', env: 'HF_TOKEN' },
  { id: 'cloudflare', env: 'CLOUDFLARE_API_TOKEN', accountIdEnv: 'CLOUDFLARE_ACCOUNT_ID' }
];

function safeText(value, secret = '') {
  return String(value ?? '')
    .replaceAll(secret, '[REDACTED]')
    .replace(/Bearer\\s+\\S+/gi, 'Bearer [REDACTED]')
    .replace(/(?:sk[_-]|pk[_-]|AIza)[A-Za-z0-9_-]{12,}/g, '[REDACTED]')
    .replace(/[\\r\\n\\t]+/g, ' ')
    .slice(0, 240);
}

function extractResult(child, provider, secret) {
  const raw = child.stdout?.trim() || child.stderr?.trim() || '';
  if (raw) {
    try {
      const parsed = JSON.parse(raw.split(/\\r?\\n/).filter(Boolean).at(-1));
      return {
        provider,
        status: child.status === 0 && parsed.status === 'success' ? 'success' : 'failed',
        model: safeText(parsed.model, secret),
        ...(Number.isFinite(parsed.completionStatus) ? { httpStatus: parsed.completionStatus } : {}),
        ...(Number.isFinite(parsed.statusCode) ? { httpStatus: parsed.statusCode } : {}),
        ...(Number.isFinite(parsed.elapsedMs) ? { elapsedMs: parsed.elapsedMs } : {}),
        ...(Number.isFinite(parsed.catalogueModels) ? { catalogueModels: parsed.catalogueModels } : {}),
        ...(parsed.stage ? { stage: safeText(parsed.stage, secret) } : {}),
        ...(parsed.message ? { message: safeText(parsed.message, secret) } : {}),
        ...(child.status !== 0 && !parsed.message ? { message: 'Probe exited with status ' + child.status } : {})
      };
    } catch (_) {
      // Do not dump raw child output on parse failure; it could contain unexpected text.
    }
  }
  return {
    provider,
    status: 'failed',
    ...(child.error ? { message: safeText(child.error.message, secret) } : {}),
    ...(child.signal ? { message: 'Probe terminated by signal ' + safeText(child.signal) } : {}),
    ...(child.status !== null ? { exitCode: child.status } : {})
  };
}

async function main() {
  const results = [];
  for (const config of providers) {
    const secret = String(process.env[config.env] || '');
    if (!secret) {
      results.push({ provider: config.id, status: 'skipped', message: 'No supported Actions secret configured.' });
      continue;
    }
    const accountId = config.accountIdEnv ? String(process.env[config.accountIdEnv] || '') : '';
    const childEnv = {
      API_KEY: secret,
      MODEL_OVERRIDE: String(process.env['MODEL_OVERRIDE_' + config.id.toUpperCase()] || ''),
      ...(config.accountIdEnv ? { CLOUDFLARE_ACCOUNT_ID: accountId } : {})
    };
    const child = spawnSync(process.execPath, [probePath, config.id], {
      env: childEnv, encoding: 'utf8', timeout: 35000, maxBuffer: 256 * 1024
    });
    results.push(extractResult(child, config.id, secret));
  }

  const success = results.filter(item => item.status === 'success').length;
  const failed = results.filter(item => item.status === 'failed').length;
  const skipped = results.filter(item => item.status === 'skipped').length;
  console.log(JSON.stringify({ summary: { success, failed, skipped, total: results.length }, results }, null, 2));

  const cells = results.map(item => [
    item.provider, item.status.toUpperCase(), item.model || '—',
    item.httpStatus ?? '—', item.elapsedMs != null ? item.elapsedMs + ' ms' : '—',
    item.message || item.catalogueModels != null ? (item.message || ('Catalog models: ' + item.catalogueModels)) : '—'
  ]);
  const summary = [
    '## Provider smoke test — configured secrets',
    '',
    '| Provider | Result | Model | HTTP | Duration | Detail |',
    '|---|---|---|---:|---:|---|',
    ...cells.map(row => '| ' + row.map(cell => safeText(cell).replace(/\\|/g, '\\|')).join(' | ') + ' |'),
    '',
    'Summary: ' + success + ' succeeded, ' + failed + ' failed, ' + skipped + ' skipped (no matching secret).',
    '',
    'Each configured provider receives one short completion request. Skipped providers are not treated as failures. Secret values are not included in this summary.',
    ''
  ].join('\\n');
  if (process.env.GITHUB_STEP_SUMMARY) {
    try { appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary, { encoding: 'utf8' }); } catch (_) {}
  }
  if (failed) process.exitCode = 1;
}

main().catch(() => {
  console.error('Provider smoke orchestration failed before individual results could be summarized.');
  process.exitCode = 1;
});
