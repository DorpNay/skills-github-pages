#!/usr/bin/env node
// Manual live API probe for GitHub Actions. Credentials are never written to logs.
const providers = {
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', secretName: 'GEMINI_API_KEY', defaultModel: 'gemini-3.8-flash' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', secretName: 'GROQ_API_KEY', defaultModel: 'openai/gpt-oss-120b' },
  xai: { baseUrl: 'https://api.x.ai/v1', secretName: 'XAI_API_KEY', defaultModel: 'grok-4.7' },
  pollinations: { baseUrl: 'https://gen.pollinations.ai/v1', secretName: 'POLLINATIONS_API_KEY', defaultModel: 'openai/gpt-5.4-nano' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', secretName: 'OPENROUTER_API_KEY', defaultModel: 'openrouter/free' },
  nvidia: { baseUrl: 'https://integrate.api.nvidia.com/v1', secretName: 'NVIDIA_API_KEY', defaultModel: 'z-ai/glm-5.3' },
  huggingface: { baseUrl: 'https://router.huggingface.co/v1', secretName: 'HF_TOKEN', defaultModel: 'openai/gpt-oss-120b:fastest' },
  cloudflare: { baseUrl: '', secretName: 'CLOUDFLARE_API_TOKEN', defaultModel: '@cf/openai/gpt-oss-120b', accountIdEnv: 'CLOUDFLARE_ACCOUNT_ID' }
};

function safeMessage(value, secret) {
  return String(value || '')
    .replaceAll(secret, '[REDACTED]')
    .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
    .replace(/(?:sk[_-]|pk[_-]|AIza)[A-Za-z0-9_-]{12,}/g, '[REDACTED]')
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 240);
}

async function main() {
  const providerName = process.argv[2], provider = providers[providerName];
  if (!provider) {
    console.error('Choose one supported provider: ' + Object.keys(providers).join(', '));
    process.exitCode = 2; return;
  }
  const secret = process.env.API_KEY || '';
  if (!secret) {
    console.error('Missing GitHub Actions secret ' + provider.secretName + '. The secret value is never printed.');
    process.exitCode = 2; return;
  }
  const model = (process.env.MODEL_OVERRIDE || '').trim() || provider.defaultModel;
  let baseUrl = provider.baseUrl;
  if (provider.accountIdEnv) {
    const accountId = (process.env[provider.accountIdEnv] || '').trim();
    if (!/^[a-f0-9]{32}$/i.test(accountId)) {
      console.error('Missing or invalid GitHub Actions secret ' + provider.accountIdEnv + '. The secret value is never printed.');
      process.exitCode = 2; return;
    }
    baseUrl = 'https://api.cloudflare.com/client/v4/accounts/' + accountId + '/ai/v1';
  }
  const headers = { Authorization: 'Bearer ' + secret, Accept: 'application/json' };
  const startedAt = Date.now();
  try {
    // A tiny real completion is the decisive probe. /models is optional because some
    // OpenAI-compatible providers do not expose every discovery endpoint.
    const response = await fetch(baseUrl + '/chat/completions', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Reply with exactly OK. No other words.' }],
        max_tokens: 8,
        stream: false
      }),
      signal: AbortSignal.timeout(25000)
    });
    if (!response.ok) {
      const message = safeMessage(await response.text().catch(() => ''), secret);
      console.error(JSON.stringify({
        provider: providerName, model, stage: 'chat-completion', status: response.status,
        elapsedMs: Date.now() - startedAt, message
      }));
      process.exitCode = 1; return;
    }
    const completion = await response.json();
    const answer = completion?.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) {
      console.error(JSON.stringify({
        provider: providerName, model, stage: 'validate-response', status: response.status,
        elapsedMs: Date.now() - startedAt, message: 'Completion endpoint returned no text content.'
      }));
      process.exitCode = 1; return;
    }

    let catalogueModels = null;
    try {
      const listResponse = await fetch(baseUrl + '/models', {
        headers, signal: AbortSignal.timeout(10000)
      });
      if (listResponse.ok) {
        const catalogue = await listResponse.json();
        const data = Array.isArray(catalogue?.data) ? catalogue.data
          : Array.isArray(catalogue?.models) ? catalogue.models : null;
        if (data) catalogueModels = data.length;
      }
    } catch (_) {}

    console.log(JSON.stringify({
      status: 'success', provider: providerName, model, completionStatus: response.status,
      catalogueModels, elapsedMs: Date.now() - startedAt, answerLength: answer.length
    }));
  } catch (error) {
    console.error(JSON.stringify({
      provider: providerName, model, stage: 'network', elapsedMs: Date.now() - startedAt,
      message: safeMessage(error?.name === 'TimeoutError' ? 'Request timed out.' : error?.message || 'Request failed.', secret)
    }));
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error('Unexpected provider smoke-test failure: ' + safeMessage(error?.message || 'unknown error', process.env.API_KEY || ''));
  process.exitCode = 1;
});
