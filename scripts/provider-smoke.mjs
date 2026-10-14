#!/usr/bin/env node
// One-shot provider smoke test for GitHub Actions. Never print credentials or response headers.
const providers = {
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', secretName: 'GEMINI_API_KEY', defaultModel: 'gemini-3.8-flash' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', secretName: 'GROQ_API_KEY', defaultModel: 'openai/gpt-oss-120b' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', secretName: 'OPENROUTER_API_KEY', defaultModel: 'openrouter/free' },
  nvidia: { baseUrl: 'https://integrate.api.nvidia.com/v1', secretName: 'NVIDIA_API_KEY', defaultModel: 'z-ai/glm-5.3' },
  huggingface: { baseUrl: 'https://router.huggingface.co/v1', secretName: 'HF_TOKEN', defaultModel: 'openai/gpt-oss-120b:fastest' }
};

function safeMessage(value, secret) {
  return String(value || '')
    .replaceAll(secret, '[REDACTED]')
    .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
    .replace(/(?:sk-|AIza)[A-Za-z0-9_\-]{12,}/g, '[REDACTED]')
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, 240);
}

async function main() {
  const providerName = process.argv[2];
  const provider = providers[providerName];
  if (!provider) {
    console.error('Choose one supported provider: ' + Object.keys(providers).join(', '));
    process.exitCode = 2;
    return;
  }
  const secret = process.env.API_KEY || '';
  if (!secret) {
    console.error('Missing GitHub Actions secret ' + provider.secretName + '. The secret value is never printed.');
    process.exitCode = 2;
    return;
  }
  const model = (process.env.MODEL_OVERRIDE || '').trim() || provider.defaultModel;
  const baseUrl = provider.baseUrl;
  const startedAt = Date.now();
  const headers = { Authorization: 'Bearer ' + secret, Accept: 'application/json' };

  try {
    const listResponse = await fetch(baseUrl + '/models', { headers, signal: AbortSignal.timeout(15000) });
    if (!listResponse.ok) {
      const message = safeMessage(await listResponse.text().catch(() => ''), secret);
      console.error(JSON.stringify({ provider: providerName, model, stage: 'list-models', status: listResponse.status, message }));
      process.exitCode = 1;
      return;
    }
    let catalogue;
    try { catalogue = await listResponse.json(); } catch (_) {
      console.error(JSON.stringify({ provider: providerName, model, stage: 'list-models', status: listResponse.status, message: 'Response was not valid JSON.' }));
      process.exitCode = 1;
      return;
    }
    const listedModels = Array.isArray(catalogue?.data) ? catalogue.data : Array.isArray(catalogue?.models) ? catalogue.models : null;
    if (!listedModels) {
      console.error(JSON.stringify({ provider: providerName, model, stage: 'list-models', status: listResponse.status, message: 'Model catalogue schema was not recognized.' }));
      process.exitCode = 1;
      return;
    }

    const completionResponse = await fetch(baseUrl + '/chat/completions', {
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
    if (!completionResponse.ok) {
      const message = safeMessage(await completionResponse.text().catch(() => ''), secret);
      console.error(JSON.stringify({
        provider: providerName, model, stage: 'chat-completion', status: completionResponse.status,
        catalogueModels: listedModels.length, elapsedMs: Date.now() - startedAt, message
      }));
      process.exitCode = 1;
      return;
    }
    const completion = await completionResponse.json();
    const answer = completion?.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) {
      console.error(JSON.stringify({
        provider: providerName, model, stage: 'validate-response', status: completionResponse.status,
        catalogueModels: listedModels.length, elapsedMs: Date.now() - startedAt,
        message: 'Completion endpoint returned no text content.'
      }));
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify({
      status: 'success', provider: providerName, model, catalogueModels: listedModels.length,
      completionStatus: completionResponse.status, elapsedMs: Date.now() - startedAt,
      answerLength: answer.length
    }));
  } catch (error) {
    console.error(JSON.stringify({
      provider: providerName, model, stage: 'network',
      elapsedMs: Date.now() - startedAt,
      message: safeMessage(error?.name === 'TimeoutError' ? 'Request timed out.' : error?.message || 'Request failed.', secret)
    }));
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error('Unexpected provider smoke-test failure: ' + safeMessage(error?.message || 'unknown error', process.env.API_KEY || ''));
  process.exitCode = 1;
});
