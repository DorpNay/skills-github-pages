---
layout: null
title: AI Mobile Agent v10.0
permalink: /
---

<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0a1220">
  <meta name="color-scheme" content="dark">
  <title>AI Mobile Agent v10.0</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script id="markedRuntime" defer src="https://cdn.jsdelivr.net/npm/marked@18.0.14/marked.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.16/purify.min.js"></script>
  <style>
    :root { color-scheme: dark; --ink: #e8eefc; --panel: #101827; --line: #273349; }
    html, body { height: 100%; }
    body { background: radial-gradient(ellipse at 12% 0%, rgb(37 66 108 / 24%), transparent 36%), radial-gradient(ellipse at 95% 70%, rgb(26 85 74 / 12%), transparent 32%), linear-gradient(150deg, #080d17, #101827 55%, #0a1220); }
    #settingsModal > .settings-surface { background: rgb(13 20 33 / 96%); border-color: rgb(96 165 250 / 24%); box-shadow: 0 24px 80px rgb(0 0 0 / 45%), 0 0 28px rgb(96 165 250 / 6%); backdrop-filter: blur(18px); }
    #settingsModal label { letter-spacing: .015em; }
    #settingsModal input, #settingsModal textarea, #settingsModal select { background: rgb(6 12 22 / 82%); border-color: #344158; }
    #settingsModal input:focus, #settingsModal textarea:focus, #settingsModal select:focus { border-color: #7dd3fc; box-shadow: 0 0 0 1px rgb(125 211 252 / 18%), 0 0 18px rgb(96 165 250 / 11%); }
    .ambient-control { border: 1px solid rgb(96 165 250 / 24%); background: linear-gradient(135deg, rgb(30 41 59 / 94%), rgb(12 20 34 / 94%)); box-shadow: inset 0 1px rgb(255 255 255 / 3%); }
    .ambient-control[aria-pressed="true"] { color: #fef3c7; border-color: rgb(251 191 36 / 50%); box-shadow: inset 0 0 14px rgb(251 191 36 / 8%), 0 0 14px rgb(251 191 36 / 8%); }
    .api-key-row { display: flex; align-items: center; gap: .55rem; border: 1px solid #344158; border-radius: .7rem; padding: .35rem .55rem; background: rgb(6 12 22 / 82%); transition: border-color .2s ease, box-shadow .2s ease; }
    .api-key-row #apiKey { min-width: 0; flex: 1; border: 0; box-shadow: none; background: transparent; padding: .4rem .1rem; }
    .api-key-row:focus-within { border-color: #7dd3fc; box-shadow: 0 0 0 1px rgb(125 211 252 / 12%); }
    .api-key-row[data-state="pending"] { border-color: rgb(251 191 36 / 52%); box-shadow: inset 0 0 20px rgb(251 191 36 / 5%), 0 0 16px rgb(251 191 36 / 8%); }
    .api-key-row[data-state="connected"] { border-color: rgb(74 222 128 / 65%); box-shadow: inset 0 0 22px rgb(74 222 128 / 7%), 0 0 18px rgb(74 222 128 / 11%); }
    .api-key-row[data-state="error"] { border-color: rgb(248 113 113 / 72%); box-shadow: inset 0 0 20px rgb(248 113 113 / 5%), 0 0 15px rgb(248 113 113 / 10%); }
    .key-lamp { width: .63rem; height: .63rem; flex: 0 0 .63rem; border-radius: 50%; background: #64748b; box-shadow: 0 0 0 3px rgb(100 116 139 / 9%); }
    [data-state="pending"] .key-lamp { background: #fbbf24; box-shadow: 0 0 8px rgb(251 191 36 / 80%), 0 0 18px rgb(251 191 36 / 24%); }
    [data-state="connected"] .key-lamp { background: #4ade80; box-shadow: 0 0 8px rgb(74 222 128 / 90%), 0 0 20px rgb(74 222 128 / 30%); }
    [data-state="error"] .key-lamp { background: #f87171; box-shadow: 0 0 8px rgb(248 113 113 / 85%); }
    .prompt-editor { position: relative; }
    .prompt-editor textarea { padding-right: 3.2rem; }
    .prompt-editor textarea[readonly] { cursor: default; opacity: .82; }
    .prompt-pencil { position: absolute; right: .45rem; top: .45rem; width: 2.2rem; height: 2.2rem; border-radius: .6rem; border: 1px solid #344158; background: #111c2d; color: #bfdbfe; }
    .prompt-pencil { width:2.65rem;height:2.65rem;border-color:var(--ui-tiffany);background:var(--ui-tiffany-soft);color:var(--ui-tiffany-bright);font-size:1.3rem;box-shadow:0 0 16px color-mix(in srgb,var(--ui-tiffany) 20%,transparent); }
    .prompt-pencil[aria-pressed="true"] { border-color:rgb(74 222 128 / 75%);color:#bbf7d0;box-shadow:0 0 0 2px rgb(74 222 128 / 12%),0 0 18px rgb(74 222 128 / 26%);animation:prompt-edit-pulse 1.5s ease-in-out infinite; }
    @keyframes prompt-edit-pulse { 0%,100%{box-shadow:0 0 0 2px rgb(74 222 128 / 10%),0 0 10px rgb(74 222 128 / 16%)} 50%{box-shadow:0 0 0 5px rgb(74 222 128 / 16%),0 0 23px rgb(74 222 128 / 42%)} }
    @media (prefers-reduced-motion:reduce){.prompt-pencil[aria-pressed="true"]{animation:none}}
    .settings-header { position:sticky;top:-1rem;z-index:12;display:flex;align-items:center;justify-content:space-between;gap:.55rem;margin:-1rem -1rem .5rem;padding:.8rem 1rem;background:color-mix(in srgb,var(--ui-surface) 94%,transparent);border-bottom:1px solid var(--ui-border);backdrop-filter:blur(16px); }
    .settings-header-actions { display:flex;align-items:center;gap:.35rem; }
    .settings-header-actions button { display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.45rem .65rem;border:1px solid var(--ui-border);border-radius:10px;font-size:11px;white-space:nowrap; }
    .settings-header-actions [data-action="save-settings"] { background:var(--ui-primary);color:#fff;border-color:transparent;font-weight:750; }
    .settings-header-actions [data-action="close-settings"] { background:var(--ui-surface-raised);color:var(--ui-text-muted); }
    .aservi-card input[data-state="connected"] { border-color:#35d39a!important;box-shadow:0 0 0 1px rgb(53 211 154 / 14%),0 0 13px rgb(53 211 154 / 8%); }
    .aservi-card input[data-state="error"] { border-color:#ff737a!important;box-shadow:0 0 0 1px rgb(255 115 122 / 14%); }
    .field-error { margin-top:-.35rem;font-size:10px;line-height:1.25;color:var(--ui-danger); }
    .advanced-field,.advanced-control { font-size:11px!important;padding:.42rem .55rem!important;min-height:30px; }
    #aserviStatus { margin:0;font-size:10px;line-height:1.2; }
    #aserviStatusDot { margin-top:0; }
    .message-model-meta { color: #93a4bd; font-size: .67rem; line-height: 1.3; padding: .15rem .25rem; opacity: .9; }
    .message-model-meta::before { content: "●"; display: inline-block; margin-right: .4rem; color: #4ade80; font-size: .58rem; text-shadow: 0 0 8px rgb(74 222 128 / 45%); }
    #thinkingTime { color: #a5b4fc; font-variant-numeric: tabular-nums; white-space: nowrap; }
    #statusText { color: transparent; background: linear-gradient(100deg, #bfdbfe 5%, #c4b5fd 42%, #6ee7b7 70%, #bfdbfe 95%); background-size: 220% 100%; background-clip: text; -webkit-background-clip: text; animation: status-sheen 4.5s ease-in-out infinite; }
    @keyframes status-sheen { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; height: 100dvh; min-height: 0; overflow: hidden; }
    button, input, textarea { font: inherit; }
    button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid #60a5fa; outline-offset: 2px; }
    .safe-bottom { padding-bottom: max(env(safe-area-inset-bottom), 1rem); }
    body.composer-at-top #composerFooter { order: 1; padding-top: max(env(safe-area-inset-top), .5rem); padding-bottom: .5rem; }
    body.composer-at-top #chatBox { order: 2; }
    body.composer-at-top #searchStatus { order: 3; }
    #chatBox { overscroll-behavior: contain; overflow-wrap: anywhere; }
    #userInput { line-height: 1.45; }
    .assistant-content p { margin: 0 0 .65rem; }
    .assistant-content p:last-child { margin-bottom: 0; }
    .assistant-content ul, .assistant-content ol { padding-left: 1.35rem; margin: .4rem 0 .75rem; }
    .assistant-content ul { list-style: disc; }
    .assistant-content ol { list-style: decimal; }
    .assistant-content blockquote { border-left: 3px solid #4b5563; padding-left: .8rem; color: #d1d5db; margin: .6rem 0; }
    .assistant-content table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; margin: .7rem 0; }
    .assistant-content th, .assistant-content td { border: 1px solid #4b5563; padding: .35rem .55rem; }
    .assistant-content a { color: #93c5fd; text-decoration: underline; overflow-wrap: anywhere; }
    .assistant-content pre { max-width: 100%; overflow-x: auto; }
    .code-block pre { background: #090d16; padding: .8rem; border-radius: .6rem; margin: .5rem 0; }
    .code-block code { white-space: pre; }
    .code-actions { display: flex; flex-wrap: wrap; gap: .25rem; position: absolute; top: .55rem; right: .55rem; }
    .code-action { background: #374151; color: #fff; border-radius: .35rem; padding: .25rem .45rem; font-size: .72rem; }
    .code-action:hover { background: #4b5563; }
    .code-action[data-action="run-python"] { background: #166534; }
    .code-action[data-action="download-code"] { background: #1d4ed8; }
    .code-output { white-space: pre-wrap; overflow-wrap: anywhere; margin-top: .5rem; padding: .6rem; border: 1px solid #374151; border-radius: .5rem; background: #111827; }
    .chat-bubble { min-width: 0; overflow-wrap: anywhere; }
    .memory-item { display: flex; gap: .45rem; align-items: flex-start; padding: .3rem 0; }
    .memory-item span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .memory-item button { color: #9ca3af; padding: 0 .2rem; }
    .memory-item button:hover { color: #f87171; }
    #settingsModal, #sidebar { overscroll-behavior: contain; }
    button, a, input, textarea, select { transition: background-color .14s ease, border-color .14s ease, box-shadow .14s ease, color .14s ease; }
    button:hover:not(:disabled) { filter: brightness(1.06); }
    input:focus, textarea:focus, select:focus { border-color: #60a5fa; box-shadow: 0 0 0 2px rgb(96 165 250 / 12%); }
    .toast { position: fixed; left: 50%; bottom: calc(env(safe-area-inset-bottom) + 5.4rem); z-index: 100; max-width: min(92vw, 30rem); padding: .65rem .9rem; border: 1px solid rgb(96 165 250 / 40%); border-radius: .8rem; background: rgb(15 23 42 / 96%); color: #e5efff; font-size: .8rem; line-height: 1.35; text-align: center; box-shadow: 0 8px 28px rgb(0 0 0 / 25%); opacity: 0; transform: translate(-50%, .5rem); pointer-events: none; transition: opacity .16s ease, transform .16s ease; backdrop-filter: blur(8px); }
    .toast.toast-visible { opacity: 1; transform: translate(-50%, 0); }
    .toast.toast-error { border-color: rgb(248 113 113 / 55%); color: #fecaca; }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }

    /* aLandi AI — Obsidian Studio / Clean Light + restrained Tiffany Motion. */
    :root, html[data-theme="dark"] {
      color-scheme: dark;
      --ui-bg:#08111d; --ui-surface:#0f1b2b; --ui-surface-raised:#142438;
      --ui-border:#26384b; --ui-text:#f1f6fa; --ui-text-muted:#a4b5c7;
      --ui-primary:#3b82f6; --ui-success:#35d39a; --ui-danger:#ff737a; --ui-info:#a9caff; --ui-warning:#f2c77c;
      --ui-tiffany:#68e8d0; --ui-tiffany-bright:#a3fff0; --ui-tiffany-soft:rgba(104,232,208,.13);
      --motion-fast:140ms; --motion-normal:190ms; --motion-panel:220ms;
      --motion-ease:cubic-bezier(.2,.7,.2,1);
    }
    html[data-theme="light"] {
      color-scheme: light;
      --ui-bg:#f4f7f8; --ui-surface:#ffffff; --ui-surface-raised:#f8fbfc;
      --ui-border:#d9e4e8; --ui-text:#152633; --ui-text-muted:#526775;
      --ui-primary:#2563eb; --ui-success:#087f72; --ui-danger:#c83244; --ui-info:#174ea6; --ui-warning:#805400;
      --ui-tiffany:#087f72; --ui-tiffany-bright:#25a995; --ui-tiffany-soft:rgba(8,127,114,.10);
    }
    body { background:var(--ui-bg)!important; color:var(--ui-text)!important; }
    #sidebar, header, #searchStatus, footer { background:var(--ui-surface)!important; border-color:var(--ui-border)!important; }
    #settingsModal > .settings-surface { background:var(--ui-surface)!important; border-color:var(--ui-border)!important; }
    body,button,input,textarea,select { font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Roboto,Arial,sans-serif; }
    :root {
      --ui-radius-sm:10px; --ui-radius-md:14px; --ui-radius-lg:20px;
      --ui-control-compact:32px; --ui-control-standard:40px; --ui-control-touch:44px;
      --ui-control-gap:8px; --ui-control-font:12px; --ui-control-icon:18px;
      --ui-content-scale:1; --ui-content-contrast:1;
    }
    button, [role="button"], summary {
      -webkit-user-select:none; user-select:none; -webkit-touch-callout:none;
      touch-action:manipulation;
    }
    input, textarea, select, [contenteditable="true"], .assistant-content, .message-viewer-content {
      -webkit-user-select:text; user-select:text;
    }
    button:focus-visible, summary:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
      outline:2px solid var(--ui-tiffany); outline-offset:2px;
    }
    .header-icon {
      display:inline-flex; align-items:center; justify-content:center;
      min-width:var(--ui-control-touch); min-height:var(--ui-control-touch);
      padding:.35rem; border:1px solid var(--ui-border); border-radius:var(--ui-radius-sm);
      font-size:var(--ui-control-icon); line-height:1;
    }
    .header-preferences { display:flex; align-items:center; gap:4px; flex:0 0 auto; }
    .header-chat-title {
      padding:5px 9px; border:1px solid var(--ui-border); border-radius:12px;
      background:color-mix(in srgb,var(--ui-surface-raised) 78%,transparent);
    }
    .brand-wordmark {
      font-family:ui-rounded,"Arial Rounded MT Bold",system-ui,sans-serif;
      font-weight:900; letter-spacing:-.075em; transform:rotate(-2deg) skewX(-3deg);
      text-shadow:1px 1px 0 color-mix(in srgb,var(--ui-tiffany) 20%,transparent);
    }
    .clock-face { width:58px; height:58px; }
    #searchStatus { justify-content:center; text-align:center; color:var(--ui-text-muted); }
    #statusText { color:var(--ui-text); background:none; -webkit-background-clip:initial; background-clip:initial; animation:none; }
    #thinkingTime { color:var(--ui-text-muted); margin-left:0; }
    #chatBox, .message-viewer-content { font-size:calc(1rem * var(--ui-content-scale)); }
    #chatBox, .chat-bubble, .assistant-content, .message-viewer-content { -webkit-user-select:text; user-select:text; }
    .assistant-content, .message-viewer-content, #readabilityPreview { color:color-mix(in srgb,var(--ui-text) calc(100% * var(--ui-content-contrast)),var(--ui-text-muted)); }
    #readabilityPreview { font-size:calc(.75rem * var(--ui-content-scale)); }
    html[data-theme="light"] #readabilityPreview { color:color-mix(in srgb,#10212b calc(100% * var(--ui-content-contrast)),#526775); }
    html[data-theme="light"] .assistant-content, html[data-theme="light"] .message-viewer-content {
      color:color-mix(in srgb,#10212b calc(100% * var(--ui-content-contrast)),#526775);
    }
    .message-actions { display:flex; align-items:center; gap:var(--ui-control-gap); margin-top:4px; }
    .message-actions button.hidden { display:none!important; }
    .message-actions button {
      display:inline-flex; align-items:center; justify-content:center;
      width:var(--ui-control-touch); min-width:var(--ui-control-touch);
      height:var(--ui-control-touch); min-height:var(--ui-control-touch);
      padding:0; border:1px solid var(--ui-border); border-radius:var(--ui-radius-sm);
      color:var(--ui-text-muted); background:var(--ui-surface-raised); font-size:var(--ui-control-icon);
    }
    .message-actions button:hover { color:var(--ui-tiffany); border-color:var(--ui-tiffany); background:var(--ui-tiffany-soft); }
    .language-menu { position:relative; }
    .language-menu summary { list-style:none; cursor:pointer; }
    .language-menu summary::-webkit-details-marker { display:none; }
    .language-menu-panel {
      position:absolute; right:0; top:calc(100% + 7px); z-index:90; min-width:132px;
      padding:5px; border:1px solid var(--ui-border); border-radius:12px;
      background:var(--ui-surface); box-shadow:0 12px 32px rgb(0 0 0 / 28%);
    }
    .language-menu-panel button {
      display:block; width:100%; min-height:36px; padding:8px 10px;
      border-radius:8px; text-align:left; font-size:var(--ui-control-font);
    }
    .language-menu-panel button[aria-pressed="true"] { color:var(--ui-tiffany); background:var(--ui-tiffany-soft); }
    @media (max-width:420px) {
      .header-chat-title { padding:4px 6px; }
      .clock-face { width:54px; height:54px; }
      .brand-wordmark { font-size:1rem; }
    }
    @media (max-width:360px) {
      .app-header { padding-left:4px!important; padding-right:4px!important; gap:4px!important; }
      .header-chat-title { padding:3px 4px; }
      .brand-wordmark { font-size:.875rem; letter-spacing:-.09em; }
    }
    button,input,textarea,select { border-radius:var(--ui-radius-sm); }
    .settings-surface { border-radius:22px!important; }
    .settings-subpanel { background:color-mix(in srgb,var(--ui-surface-raised) 86%,transparent); overflow:hidden; }
    .settings-subpanel > summary::marker,#searchToolsSettings > summary::marker { color:var(--ui-tiffany); }
    .settings-subpanel[open] > summary,#searchToolsSettings[open] > summary { border-bottom:1px solid var(--ui-border); background:var(--ui-tiffany-soft); }
    .aservi-card { background:radial-gradient(ellipse at 95% 0%,rgba(104,232,208,.13),transparent 48%),linear-gradient(140deg,var(--ui-surface-raised),var(--ui-surface)); border-color:rgba(104,232,208,.34)!important; box-shadow:0 18px 45px rgba(0,0,0,.14),inset 0 1px rgba(255,255,255,.04); }
    .aservi-card input { background:var(--ui-bg)!important;color:var(--ui-text)!important;border-color:var(--ui-border)!important; }
    .aservi-status-indicator { width:12px;height:12px;flex:0 0 12px;margin-top:7px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 5px rgba(239,68,68,.12),0 0 16px rgba(239,68,68,.45); }
    .aservi-status-indicator[data-state="connected"] { background:#22c55e;box-shadow:0 0 0 5px rgba(34,197,94,.12),0 0 18px rgba(34,197,94,.65); }
    .aservi-status-indicator[data-state="checking"] { background:#f59e0b;box-shadow:0 0 0 5px rgba(245,158,11,.12),0 0 18px rgba(245,158,11,.45); }
    .aservi-status-copy { color:var(--ui-danger); }
    .aservi-status-copy[data-state="connected"] { color:var(--ui-success); }
    .aservi-status-copy[data-state="checking"] { color:var(--ui-warning); }
    .aservi-key-row button,.composer-tool,.header-icon { border-color:var(--ui-border);background:var(--ui-surface-raised);color:var(--ui-text); }
    .aservi-key-row button:hover,.composer-tool:hover:not(:disabled),.header-icon:hover { border-color:var(--ui-tiffany);background:var(--ui-tiffany-soft); }
    .app-header { background:var(--ui-surface)!important;border-color:var(--ui-border)!important; }
    .brand-wordmark { display:inline-block;background:linear-gradient(120deg,var(--ui-text),var(--ui-tiffany-bright));color:transparent;background-clip:text;-webkit-background-clip:text;white-space:nowrap;user-select:none; }
    .header-chat-title { flex:1;min-width:0;max-width:none;line-height:1.2; }
    .active-project-title { display:block;color:var(--ui-tiffany-bright);font-size:9px;font-weight:750;line-height:1.15;letter-spacing:.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .mode-hint-row { display:flex;align-items:center;gap:.5rem;min-width:0; }
    .mode-hint { min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .brand-subtitle { display:block;font-size:9px;letter-spacing:.06em;color:var(--ui-text-muted);white-space:nowrap; }
    .clock-face { position:relative;width:54px;height:54px;border:1px solid rgba(104,232,208,.55);border-radius:50%;background:radial-gradient(circle at 35% 22%,rgba(255,255,255,.09),transparent 48%),var(--ui-bg);box-shadow:inset 0 0 12px rgba(104,232,208,.08),0 0 16px rgba(104,232,208,.06);overflow:hidden; }
    .clock-face::before { content:"";position:absolute;inset:2px;border-radius:50%;background:repeating-conic-gradient(from -90deg,rgba(104,232,208,.78) 0deg 1.3deg,transparent 1.3deg 30deg);mask:radial-gradient(circle,transparent 0 72%,#000 74%);-webkit-mask:radial-gradient(circle,transparent 0 72%,#000 74%);opacity:.75;pointer-events:none;z-index:0; }
    .clock-digital { position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-weight:800;font-size:11px;letter-spacing:-.08em;font-variant-numeric:tabular-nums;color:var(--ui-tiffany);opacity:.94;z-index:1;text-shadow:0 0 5px color-mix(in srgb,var(--ui-tiffany) 30%,transparent); }
    .clock-hand { position:absolute;left:calc(50% - 1px);bottom:50%;width:2px;border-radius:999px;transform-origin:50% 100%;transform:rotate(0deg);transition:none!important;z-index:2;background:var(--ui-text); }
    .clock-hour { height:14px;width:3px;left:calc(50% - 1.5px);background:var(--ui-text); }
    .clock-minute { height:20px;background:var(--ui-tiffany-bright); }
    .clock-second { height:22px;width:1px;background:#f59e0b; }
    .clock-pin { position:absolute;left:calc(50% - 2px);top:calc(50% - 2px);width:4px;height:4px;border-radius:50%;background:#f59e0b;z-index:3; }
    .voice-menu { position:absolute;right:10px;bottom:calc(100% + 9px);z-index:70;width:min(92vw,330px);padding:8px;border:1px solid var(--ui-border);border-radius:20px;background:color-mix(in srgb,var(--ui-surface) 90%,transparent);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 16px 48px rgba(0,0,0,.28);transform-origin:bottom right;animation:voice-pop 170ms cubic-bezier(.2,.7,.2,1); }
    #settingsModal,#messageViewerModal,#chatActionModal,#researchStudioModal,#functionPanelModal,#traceModal { backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px); }
    @media (prefers-reduced-transparency:reduce) { #settingsModal,#messageViewerModal,#chatActionModal,#researchStudioModal,#functionPanelModal,#traceModal { backdrop-filter:none;-webkit-backdrop-filter:none; } }
    .voice-menu-option { width:100%;display:flex;align-items:center;gap:12px;text-align:left;padding:13px 12px;border-radius:14px; }
    .voice-menu-option:hover { background:var(--ui-tiffany-soft); }
    .voice-menu-option strong { display:block;font-size:11px;letter-spacing:.04em; }
    .voice-menu-option small { display:block;font-size:10px;color:var(--ui-text-muted);margin-top:3px; }
    .voice-direction { display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--ui-border);border-radius:12px;color:var(--ui-tiffany);font-size:20px; }
    @keyframes voice-pop { from { opacity:0;transform:translateY(6px) scale(.96); } to { opacity:1;transform:translateY(0) scale(1); } }
    @media (prefers-reduced-motion:reduce) { .voice-menu { animation:none!important; } }
    .chat-row { position:relative; min-height:44px; }
    #composerFooter { position:relative; }
    .composer-popover { position:absolute;left:8px;bottom:calc(100% + 8px);z-index:100;width:min(92vw,330px);padding:8px;border:1px solid var(--ui-border);border-radius:18px;background:color-mix(in srgb,var(--ui-surface) 94%,transparent);backdrop-filter:blur(26px) saturate(150%);-webkit-backdrop-filter:blur(26px) saturate(150%);box-shadow:0 20px 55px rgb(0 0 0 / 40%); }
    .composer-popover-option { display:flex;align-items:center;gap:11px;width:100%;padding:12px;border-radius:12px;text-align:left; }
    .composer-popover-option:hover { background:var(--ui-tiffany-soft); }
    .composer-popover-option > span:first-child { display:grid;place-items:center;width:34px;height:34px;border-radius:10px;border:1px solid var(--ui-border);color:var(--ui-tiffany); }
    .composer-popover-option strong { display:block;font-size:12px; }
    .composer-popover-option small { display:block;margin-top:3px;color:var(--ui-text-muted);font-size:10px;line-height:1.35; }
    .context-popover { max-height:min(72dvh,480px);overflow-y:auto; }
    .request-project-choice { display:flex;align-items:flex-start;gap:9px;padding:10px;border-radius:10px;cursor:pointer;font-size:12px; }
    .request-project-choice:hover { background:var(--ui-tiffany-soft); }
    .request-project-choice input { margin-top:2px;accent-color:var(--ui-tiffany); }
    .request-project-choice .description { display:block;margin-top:3px;color:var(--ui-text-muted);font-size:10px; }
    .draft-attachment { display:flex;align-items:center;gap:7px;max-width:min(100%,300px);padding:6px 8px;border:1px solid var(--ui-border);border-radius:11px;background:color-mix(in srgb,var(--ui-surface) 85%,transparent);font-size:10px; }
    .draft-attachment-warning { border-color:rgb(234 179 8 / 55%); }
    .draft-attachment-name { overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:195px; }
    .draft-attachment-remove { flex:none;border-radius:7px;padding:2px 5px;color:var(--ui-text-muted); }
    .draft-attachment-remove:hover { background:rgb(244 63 94 / 14%);color:#fb7185; }
    #voiceUnavailableButton { touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none; }
    @media (prefers-reduced-transparency:reduce) { .composer-popover,.draft-attachment { background:var(--ui-surface);backdrop-filter:none;-webkit-backdrop-filter:none; } }

    .mode-hint { min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .toolbar-menu { position:relative;min-width:0; }
    .toolbar-menu > summary { list-style:none;display:block;width:100%;min-width:0;padding:8px 10px;border:1px solid var(--ui-border);border-radius:11px;background:var(--ui-surface);color:var(--ui-text);font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer; }
    .toolbar-menu > summary::-webkit-details-marker { display:none; }
    .toolbar-menu[open] > summary,.toolbar-menu > summary:hover { background:var(--ui-tiffany-soft);border-color:var(--ui-tiffany); }
    .toolbar-menu-panel { position:absolute;left:0;top:calc(100% + 6px);z-index:110;width:min(92vw,340px);max-height:min(58dvh,420px);overflow-y:auto;padding:6px;border:1px solid var(--ui-border);border-radius:14px;background:var(--ui-surface);color:var(--ui-text);box-shadow:0 18px 48px rgb(0 0 0 / 38%); }
    .toolbar-menu-panel-right { left:auto;right:0; }
    .toolbar-menu-option { display:block;width:100%;padding:10px;text-align:left;border-radius:9px;font-size:12px; }
    .toolbar-menu-option:hover,.toolbar-menu-option:focus-visible { background:var(--ui-tiffany-soft);outline-color:var(--ui-tiffany); }
    .toolbar-menu-option strong { display:block;font-size:12px; }
    .toolbar-menu-option small { display:block;margin-top:3px;color:var(--ui-text-muted);font-size:10px;line-height:1.35;white-space:normal; }
    @media (max-width:380px) { .toolbar-menu > summary { padding:7px 6px;font-size:10px; } .toolbar-menu-option { padding:9px; } }
    @media (max-width:640px) {
      .app-header .header-icon { min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center; }
      #modeToolbar [role="group"] > button,#modeToolbar .toolbar-menu > summary,#modeToolbar .toolbar-menu-option { min-height:44px; }
      #modeToolbar .toolbar-menu > summary { display:flex;align-items:center; }
      #inputArea .composer-tool,#inputArea #sendBtn,#inputArea #stopBtn { min-width:44px;min-height:44px;display:grid;place-items:center; }
      #inputArea #userInput { min-height:44px; }
      #researchStudioModal [data-action="close-research-studio"],#researchStudioModal [data-action="start-research-studio"] { min-height:44px; }
      #researchStudioModal header [data-action="close-research-studio"] { min-width:44px; }
    }
    @media (prefers-reduced-transparency:reduce) { .toolbar-menu-panel { background:var(--ui-surface);backdrop-filter:none;-webkit-backdrop-filter:none; } }

    .project-nav-heading { color:var(--ui-text);background:var(--ui-surface-raised);border:1px solid var(--ui-border); }
    .project-nav-heading:hover { background:var(--ui-tiffany-soft);border-color:var(--ui-tiffany); }
    .project-nav-unassigned { color:var(--ui-text-muted);background:color-mix(in srgb,var(--ui-surface) 82%,transparent); }
    .project-nav-unassigned:hover,.project-nav-unassigned.is-active { color:var(--ui-tiffany);background:var(--ui-tiffany-soft); }
    .project-nav-item { border:1px solid var(--ui-border);border-radius:11px;overflow:hidden;background:color-mix(in srgb,var(--ui-surface) 86%,transparent); }
    .project-nav-item[open] { border-color:color-mix(in srgb,var(--ui-tiffany) 55%,var(--ui-border)); }
    .project-nav-item > summary { display:flex;align-items:center;gap:8px;padding:10px 9px;cursor:pointer;list-style:none;font-size:12px; }
    .project-nav-item > summary::-webkit-details-marker { display:none; }
    .project-nav-item > summary:hover { background:var(--ui-tiffany-soft); }
    .project-nav-chats { padding:0 6px 6px 13px;display:grid;gap:4px; }
    #chatSection { border-color:var(--ui-border);background:color-mix(in srgb,var(--ui-surface) 60%,transparent); }
    .chat-section-summary { color:var(--ui-text); }
    #chatSection[open] .chat-section-summary { border-bottom:1px solid var(--ui-border);color:var(--ui-tiffany);background:var(--ui-tiffany-soft); }
    #chatList { min-height:5rem;max-height:min(38vh,420px); }
    #chatList.is-empty::after { content:attr(data-empty-label);display:block;padding:12px;color:var(--ui-text-muted);font-size:11px; }
    #projectNavigationList .chat-row { min-height:38px; }
    #projectNavigationList .chat-row .chat-row-menu summary { width:30px;height:30px; }
    @media (prefers-reduced-transparency:reduce) { .project-nav-item,#chatSection { background:var(--ui-surface); } }

    .chat-action-dialog { background:color-mix(in srgb,var(--ui-surface) 94%,transparent);border:1px solid var(--ui-border);backdrop-filter:blur(28px) saturate(160%);-webkit-backdrop-filter:blur(28px) saturate(160%);box-shadow:0 24px 80px rgb(0 0 0 / 45%); }
    .chat-action-dialog input,.chat-action-dialog select { border-color:var(--ui-border);color:var(--ui-text);min-height:44px; }
    .chat-action-dialog select option { color:#111827;background:#fff; }
    @media (prefers-reduced-transparency:reduce) { .chat-action-dialog { background:var(--ui-surface);backdrop-filter:none;-webkit-backdrop-filter:none; } }
    .chat-row-menu { position:relative; }
    #chatRowMenuPageScrim { display:none;position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.07); }
    #chatRowMenuSidebarScrim { display:none;position:absolute;inset:0;z-index:89;background:transparent; }
    body:has(#sidebar .chat-row-menu[open]) #chatRowMenuPageScrim,
    body:has(#sidebar .chat-row-menu[open]) #chatRowMenuSidebarScrim { display:block; }
    .chat-row-menu summary { list-style:none;display:grid;place-items:center;width:36px;height:36px;border:1px solid transparent;border-radius:10px;color:var(--ui-text-muted);font-size:19px;cursor:pointer; }
    .chat-row-menu summary::-webkit-details-marker { display:none; }
    .settings-actions { position:sticky;bottom:-1rem;z-index:5;display:grid;grid-template-columns:1fr 1fr;gap:.5rem;padding:.8rem 0 .25rem;background:linear-gradient(to bottom,transparent 0,var(--ui-surface) 14px,var(--ui-surface) 100%); }
    .settings-actions [data-action="download-recovery-backup"] { grid-column:1 / -1; }
    @media (max-width:360px) { .app-header { gap:.3rem!important;padding-inline:.45rem!important; } .clock-face { width:54px;height:54px; } .brand-wordmark { font-size:1rem!important; } .header-chat-title { max-width:none; } }
    .chat-row-menu[open] summary,.chat-row-menu summary:hover { background:var(--ui-tiffany-soft);border-color:var(--ui-border);color:var(--ui-tiffany); }
    .chat-row-menu-panel { position:fixed;left:0;top:0;right:auto;bottom:auto;z-index:90;width:min(190px,calc(100vw - 16px));max-height:min(70dvh,420px);overflow-y:auto;padding:5px;border:1px solid var(--ui-border);border-radius:14px;background:color-mix(in srgb,var(--ui-surface) 94%,transparent);backdrop-filter:blur(24px) saturate(150%);-webkit-backdrop-filter:blur(24px) saturate(150%);box-shadow:0 18px 50px rgb(0 0 0 / 38%); }
    .chat-row-menu-panel button { display:block;width:100%;padding:10px;border-radius:9px;text-align:left;font-size:12px; }
    .chat-row-menu-panel button:hover { background:var(--ui-tiffany-soft); }
    .chat-row-menu-panel button.danger { color:#fb7185; }
    .chat-row-menu-panel button.danger:hover { background:rgb(244 63 94 / 12%); }
    #userInput { scroll-margin-block:24px 180px; }
    @media (max-width:640px) { #userInput { font-size:16px!important;line-height:1.45; } .chat-row-menu-panel { width:min(190px,calc(100vw - 16px)); } }
    @media (prefers-reduced-transparency:reduce) { .chat-row-menu-panel { background:var(--ui-surface);backdrop-filter:none;-webkit-backdrop-filter:none; } }
    .language-menu { position:relative; }
    .language-menu summary { list-style:none;cursor:pointer;border:1px solid var(--ui-border);border-radius:10px; }
    .language-menu summary::-webkit-details-marker { display:none; }
    .language-menu-panel { position:absolute;right:0;top:calc(100% + 8px);z-index:80;min-width:130px;padding:5px;background:var(--ui-surface);border:1px solid var(--ui-border);border-radius:14px;box-shadow:0 16px 36px rgba(0,0,0,.25); }
    .language-menu-panel button { display:block;width:100%;padding:9px 10px;border-radius:9px;text-align:left;font-size:12px; }
    .language-menu-panel button[aria-pressed="true"] { color:var(--ui-tiffany);background:var(--ui-tiffany-soft); }
    .header-chat-title { max-width:none; }
    /* The composer stays in the normal flex layout at the bottom. Centering it on
       an empty chat caused iOS keyboard resizes to move the whole input surface. */
    #composerFooter { position:relative; flex-shrink:0; width:100%; }
    #composerFooter #inputArea { align-items:flex-end; }
    #inputArea { transition:gap 180ms ease; }
    #userInput { min-height:44px;max-height:min(35vh,320px);max-height:min(35dvh,320px); }
    @media (max-width:639px) {
      .clock-face { width:46px;height:46px; }
      .clock-digital { font-size:10px; }
      .header-chat-title { max-width:none; }
      .brand-subtitle { font-size:8px; }
      #composerFooter { padding-left:8px;padding-right:8px; }
      #userInput { max-height:min(30vh,240px);max-height:min(30dvh,240px); }
    }
    #sidebar { overflow-y:auto; overscroll-behavior:contain; }
    #sidebar > :not(#chatList) { flex-shrink:0; }
    #sidebar #chatList { flex:1 0 8rem; min-height:8rem; }
    #chatBox, #memoryBox { color:var(--ui-text); }
    #sidebar .border-b, #sidebar .border-t, header, footer, #searchStatus { border-color:var(--ui-border)!important; }
    #settingsModal input, #settingsModal textarea, #settingsModal select, #userInput, #memoryInput,
    #chatList button, #sidebar .bg-gray-900, #chatBox .bg-gray-800 { border-color:var(--ui-border)!important; }
    #settingsModal input, #settingsModal textarea, #settingsModal select, #userInput, #memoryInput,
    #sidebar .bg-gray-900 { background:var(--ui-bg)!important; color:var(--ui-text)!important; }
    #settingsModal label, #settingsModal p { color:var(--ui-text-muted)!important; }
    :where(button,input,textarea,select,[tabindex]):focus-visible { outline:2px solid var(--ui-tiffany)!important; outline-offset:2px; }
    button { transition:color var(--motion-fast) var(--motion-ease),background-color var(--motion-fast) var(--motion-ease),border-color var(--motion-fast) var(--motion-ease),opacity var(--motion-fast) var(--motion-ease),transform var(--motion-fast) var(--motion-ease); }
    button:active:not(:disabled) { transform:translateY(1px); }
    .motion-accent { position:relative; isolation:isolate; overflow:hidden; }
    .motion-accent::after { content:""; position:absolute; z-index:1; pointer-events:none; inset:auto auto 0 0; width:30%; height:2px; border-radius:999px; background:linear-gradient(90deg,transparent,var(--ui-tiffany) 48%,var(--ui-tiffany-bright) 58%,transparent); opacity:0; transform:translateX(-130%); }
    .motion-active.motion-accent::after { opacity:.95; animation:tiffany-sweep 1450ms var(--motion-ease) infinite; }
    @keyframes tiffany-sweep { from { transform:translateX(-130%); } to { transform:translateX(430%); } }
    .status-thinking-dots { display:inline-flex; align-items:center; gap:4px; margin-left:.15rem; }
    .status-thinking-dots > span { width:4px; height:4px; flex:0 0 4px; border-radius:50%; background:var(--ui-tiffany); opacity:.32; }
    .status-thinking-dots.is-active > span { animation:tiffany-dot 1200ms ease-in-out infinite; }
    .status-thinking-dots.is-active > span:nth-child(2) { animation-delay:140ms; }
    .status-thinking-dots.is-active > span:nth-child(3) { animation-delay:280ms; }
    @keyframes tiffany-dot { 0%,100% { opacity:.28; transform:translateY(0); } 50% { opacity:.95; transform:translateY(-2px); } }
    .roadmap-ticker { overflow:hidden; border:1px solid var(--ui-border); border-radius:999px; background:var(--ui-surface); color:var(--ui-tiffany); }
    .roadmap-ticker-track { display:inline-block; min-width:max-content; padding:4px 1.5rem; animation:roadmap-marquee 22s linear infinite; will-change:transform; }
    @keyframes roadmap-marquee { from { transform:translateX(100%); } to { transform:translateX(-100%); } }
    .roadmap-note { margin:.35rem 0 0; color:var(--ui-text-muted); font-size:10px; line-height:1.45; }
    html[data-motion="reduced"] .roadmap-ticker-track, html[data-motion="off"] .roadmap-ticker-track { animation:none!important; transform:none!important; }
    @media (prefers-reduced-motion:reduce) { .roadmap-ticker-track { animation:none!important; transform:none!important; padding-inline:.75rem; white-space:normal; } }
    html[data-motion="reduced"] .motion-active.motion-accent::after,
    html[data-motion="off"] .motion-active.motion-accent::after,
    html[data-motion="reduced"] .status-thinking-dots.is-active > span,
    html[data-motion="off"] .status-thinking-dots.is-active > span { animation:none!important; transform:none!important; }
    html[data-motion="reduced"] .motion-active.motion-accent::after { opacity:.7; }
    html[data-motion="off"] .motion-active.motion-accent::after { opacity:0; }
    html[data-motion="off"] *, html[data-motion="off"] *::before, html[data-motion="off"] *::after { animation:none!important; transition:none!important; }
    @media (prefers-reduced-motion:reduce) {
      html:not([data-motion="on"]) *, html:not([data-motion="on"]) *::before, html:not([data-motion="on"]) *::after {
        scroll-behavior:auto!important; animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important;
      }
      html:not([data-motion="on"]) .motion-active.motion-accent::after { opacity:.7; animation:none!important; transform:none!important; }
    }
    html[data-theme="light"] .bg-gray-950, html[data-theme="light"] .bg-gray-900,
    html[data-theme="light"] .bg-gray-800, html[data-theme="light"] .bg-gray-700 { background:var(--ui-surface)!important; }
    html[data-theme="light"] .border-gray-800, html[data-theme="light"] .border-gray-700,
    html[data-theme="light"] .border-gray-600 { border-color:var(--ui-border)!important; }
    html[data-theme="light"] .text-white, html[data-theme="light"] .text-gray-100,
    html[data-theme="light"] .text-gray-200, html[data-theme="light"] .text-gray-300 { color:var(--ui-text)!important; }
    html[data-theme="light"] .text-gray-400, html[data-theme="light"] .text-gray-500 { color:var(--ui-text-muted)!important; }
    html[data-theme="light"] .assistant-content blockquote { color:var(--ui-text-muted)!important; border-color:var(--ui-border)!important; }
    html[data-theme="light"] .assistant-content th, html[data-theme="light"] .assistant-content td { border-color:var(--ui-border)!important; }
    html[data-theme="light"] .code-block pre, html[data-theme="light"] .code-output { background:var(--ui-surface-raised)!important; color:var(--ui-text)!important; border-color:var(--ui-border)!important; }
    html[data-theme="light"] .assistant-content a { color:#1d4ed8!important; }
    @media (max-width:639px) {
      #settingsModal { padding:max(env(safe-area-inset-top),.5rem) .5rem max(env(safe-area-inset-bottom),.5rem)!important; }
      #settingsModal > .settings-surface { max-height:calc(100dvh - 1rem)!important; max-width:none!important; border-radius:14px!important; }
      #chatBox { padding:.75rem!important; }
      #inputArea { gap:.4rem!important; }
      #sendBtn,#stopBtn { padding:.7rem .8rem!important; }
    }
      .message-actions{display:flex;align-items:center;gap:6px;margin-top:1px;min-height:28px;opacity:.9}
    .message-actions button{min-width:var(--ui-control-touch);min-height:var(--ui-control-touch);width:var(--ui-control-touch);height:var(--ui-control-touch);padding:0;border:1px solid var(--ui-border);border-radius:var(--ui-radius-sm);color:var(--ui-text-muted);background:var(--ui-surface-raised);font-size:var(--ui-control-icon)}
    .message-actions button:hover{color:var(--ui-tiffany);border-color:var(--ui-tiffany);background:var(--ui-tiffany-soft)}
    .message-viewer-surface{background:var(--ui-surface);border:1px solid var(--ui-border);box-shadow:0 24px 80px rgb(0 0 0 / 50%);color:var(--ui-text)}
    .message-viewer-content{min-height:0;flex:1;overflow-y:auto;overscroll-behavior:contain;user-select:text;-webkit-user-select:text;overflow-wrap:anywhere;white-space:normal;padding:8px 4px 16px;line-height:1.65;font-size:14px;color:var(--ui-text)}
    .message-viewer-content pre,.message-viewer-content table{max-width:100%;overflow:auto}
    .message-viewer-content .plain-message{white-space:pre-wrap;overflow-wrap:anywhere;user-select:text;-webkit-user-select:text}
    .jump-to-latest{position:fixed;z-index:35;right:14px;bottom:max(calc(env(safe-area-inset-bottom) + 6.5rem),6.5rem);min-width:42px;min-height:42px;border-radius:14px;border:1px solid color-mix(in srgb,var(--ui-tiffany) 42%,var(--ui-border));background:var(--ui-surface-raised);color:var(--ui-tiffany);font-size:24px;box-shadow:0 5px 22px rgb(0 0 0 / 24%)}
    /* Final V2 presentation overrides are intentionally centralized after legacy component rules. */
    .brand-wordmark { font-family:ui-rounded,"Arial Rounded MT Bold",system-ui,sans-serif;font-weight:900;letter-spacing:-.075em;transform:rotate(-2deg) skewX(-3deg);text-shadow:1px 1px 0 color-mix(in srgb,var(--ui-tiffany) 20%,transparent); }
    .header-chat-title { padding:5px 9px;border:1px solid var(--ui-border);border-radius:12px;background:color-mix(in srgb,var(--ui-surface-raised) 78%,transparent); }
    .clock-face { width:58px;height:58px; }
    #modeFast,#modeDeep { min-height:28px;padding-block:4px;line-height:1.1; }
    #searchStatus { width:100%;display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;padding-inline:8px; }
    #statusText { color:var(--ui-text-muted);background:none;animation:none;font-weight:550; }
    #thinkingTime { margin-left:0!important;color:var(--ui-text-muted); }
    .message-viewer-content { font-size:calc(1rem * var(--ui-content-scale));color:color-mix(in srgb,var(--ui-text) calc(100% * var(--ui-content-contrast)),var(--ui-text-muted)); }
    html[data-theme="light"] .message-viewer-content { color:color-mix(in srgb,#10212b calc(100% * var(--ui-content-contrast)),#526775); }
    .header-icon,.message-actions button { -webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation; }
    .project-nav-row > .header-icon { width:44px;height:44px; }
    .advanced-control,.advanced-field { min-height:var(--ui-control-standard);font-size:var(--ui-control-font);line-height:1.25; }
    .settings-subpanel > summary { display:flex;align-items:center;min-height:44px; }
    .settings-header-actions button { min-height:36px;padding:8px 12px;font-size:var(--ui-control-font);line-height:1.2; }
    .toolbar-menu-option { min-height:36px;padding:8px 10px;font-size:var(--ui-control-font);line-height:1.2; }
    .composer-tool { min-width:40px;min-height:40px;display:inline-flex;align-items:center;justify-content:center; }
    #chatListNewButton { min-height:40px; }
    @media (max-width:420px) { .clock-face { width:54px;height:54px; } .header-chat-title { padding:4px 6px; } }
    @media (max-width:360px) { .clock-face { width:54px;height:54px; } }
  
     :root { --ui-info:#8db8ff; --ui-warning:#d6ae65; }
     html[data-theme="light"] { --ui-info:#2458a6; --ui-warning:#815600; }
     body,button,input,textarea,select { font-family:"Avenir Next","Segoe UI Variable",Inter,"SF Pro Text",system-ui,-apple-system,BlinkMacSystemFont,"Noto Sans",Roboto,Arial,sans-serif; }
     .brand-wordmark { font-family:"Avenir Next","Segoe UI Variable",ui-rounded,system-ui,sans-serif; font-weight:950; letter-spacing:-.085em; }
     #activeChatTitle { font-weight:700; letter-spacing:-.015em; }
     button { line-height:1.2; }
     .toolbar-menu-option,.composer-tool,#chatListNewButton,#restoreLastClosedChat { min-height:44px; }
     .composer-tool { min-width:44px; }
     .message-actions button { min-width:44px;min-height:44px; }
     .roadmap-ticker { text-align:center;color:var(--ui-text-muted); }
     .roadmap-ticker-track { text-align:center; }
     #searchStatus[data-state="neutral"] #statusText { color:var(--ui-text-muted); }
     #searchStatus[data-state="info"] #statusText { color:var(--ui-info); }
     #searchStatus[data-state="success"] #statusText { color:var(--ui-success); }
     #searchStatus[data-state="warning"] #statusText { color:var(--ui-warning); }
     #searchStatus[data-state="error"] #statusText { color:var(--ui-danger); }
     .toast[data-state="info"] { border-color:color-mix(in srgb,var(--ui-info) 55%,var(--ui-border));color:var(--ui-info); }
     .toast[data-state="warning"] { border-color:color-mix(in srgb,var(--ui-warning) 55%,var(--ui-border));color:var(--ui-warning); }
     .toast[data-state="success"] { border-color:color-mix(in srgb,var(--ui-success) 55%,var(--ui-border));color:var(--ui-success); }
     .toast[data-state="error"] { border-color:color-mix(in srgb,var(--ui-danger) 60%,var(--ui-border));color:var(--ui-danger); }
     html[data-text-contrast="high"] { --ui-text-muted:#d0dce6; --ui-disabled-text:#aebdca; --ui-info:#a9caff; --ui-warning:#f2c77c; --ui-success:#72e3bb; --ui-danger:#ff969d; }
     html[data-theme="light"][data-text-contrast="high"] { --ui-text-muted:#344e5e; --ui-disabled-text:#5b7280; --ui-info:#174ea6; --ui-warning:#805400; --ui-success:#006b5e; --ui-danger:#a51f32; }
     html[data-text-contrast="high"] .text-gray-400,html[data-text-contrast="high"] .text-gray-500,html[data-text-contrast="high"] .text-gray-600,html[data-text-contrast="high"] #memoryStatusLine,html[data-text-contrast="high"] #projectStatusLine { color:var(--ui-text-muted)!important; }
     html[data-text-contrast="high"] button:disabled,html[data-text-contrast="high"] input:disabled,html[data-text-contrast="high"] select:disabled,html[data-text-contrast="high"] textarea:disabled { color:var(--ui-disabled-text)!important;opacity:.9; }
     html[data-text-contrast="high"] #chatBox button:disabled { color:var(--ui-disabled-text)!important; }
     html[data-text-contrast="high"] .assistant-content a,html[data-text-contrast="high"] .message-viewer-content a { color:var(--ui-info)!important; }
     html[data-text-contrast="high"] .field-error,html[data-text-contrast="high"] [role="alert"] { color:var(--ui-danger)!important; }
     html[data-text-contrast="high"] .aservi-status-copy[data-state="connected"] { color:var(--ui-success)!important; }
     html[data-text-contrast="high"] .aservi-status-copy[data-state="checking"] { color:var(--ui-warning)!important; }
     body.ui-modal-open { overflow:hidden;overscroll-behavior:none; }

    /* Shared touch sizing for compact navigation and disclosure controls. */
    .settings-header-actions button,
    .language-menu-panel button,
    .chat-row-menu-panel button,
    .project-nav-item > summary,
    .toolbar-menu > summary {
      min-height:var(--ui-control-touch);
    }
    .chat-row-menu summary,
    #projectNavigationList .chat-row .chat-row-menu summary {
      width:var(--ui-control-touch);
      min-width:var(--ui-control-touch);
      height:var(--ui-control-touch);
      min-height:var(--ui-control-touch);
      padding:0;
    }
    .memory-item button {
      min-width:var(--ui-control-touch);
      min-height:var(--ui-control-touch);
    }

</style>
</head>
<body class="bg-gray-900 text-white flex flex-col">
  <aside id="sidebar" aria-label="Проекты и чаты" class="fixed inset-y-0 left-0 z-50 w-72 max-w-[88vw] bg-gray-950 border-r border-gray-800 -translate-x-full transition-transform duration-300 flex flex-col overflow-y-auto overscroll-contain">
    <div class="sticky top-0 z-20 bg-gray-950/95 backdrop-blur p-4 border-b border-gray-800 flex justify-between items-center">
      <h2 class="font-bold text-sm" data-i18n="sidebarTitle">💬 Диалоги и память</h2>
      <button type="button" data-action="close-sidebar" aria-label="Закрыть меню" class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gray-800 text-gray-400 hover:text-white text-lg">✕</button>
    </div>
    
    <section id="memoryPanel" class="mx-3 my-2 rounded-xl border border-gray-800 p-2 space-y-2" aria-label="Настройки памяти">
      <p id="memoryStatusLine" class="px-2 text-[9px] leading-tight text-gray-500" role="status" aria-live="polite">Память · личных 0 · общих 0 · общая в контексте выкл. · личная в контексте выкл.</p>
      <h3 class="px-2 text-[11px] font-semibold text-gray-300" data-i18n="memoryPanelTitle">Настройки памяти</h3>
      <details id="memoryToolsDetails" class="rounded-xl border border-gray-800">
        <summary class="cursor-pointer select-none px-3 py-2 text-xs font-semibold" data-i18n="memoryPanelSummary">Личная и общая память</summary>
        <div class="p-2 space-y-3">
          <section class="space-y-2" aria-labelledby="sharedMemoryTitle">
            <h4 id="sharedMemoryTitle" class="text-xs font-semibold text-amber-200" data-i18n="sharedMemoryTitle">Общая память</h4>
            <details id="sharedMemoryHelp" class="memory-help text-[10px] text-gray-500"><summary class="cursor-pointer select-none py-1" data-i18n="sharedMemoryHelpSummary">Об общей памяти</summary><p class="pl-2 pb-1 leading-relaxed text-gray-400" data-i18n="sharedMemoryHelp">Общие факты могут попасть внешнему провайдеру только при отдельном разрешении и если это допускает область памяти проекта.</p></details>
            <div class="flex gap-1"><input id="sharedMemoryInput" type="text" maxlength="500" placeholder="Факт для общей памяти" class="min-w-0 flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-xs"><button type="button" data-action="save-shared-memory" class="bg-amber-800 hover:bg-amber-700 px-2 rounded text-xs" aria-label="Сохранить в общую память">＋</button></div>
            <div id="sharedMemoryBox" class="bg-gray-900 p-2 rounded text-xs text-gray-300 max-h-36 overflow-y-auto border border-gray-800" aria-live="polite">Нет общих заметок.</div>
            <label class="flex items-start gap-2 text-[10px] leading-relaxed text-gray-400"><input id="globalMemoryToggle" type="checkbox" class="mt-0.5"><span data-i18n="globalMemoryOptIn">Разрешить подходящим заметкам общей памяти попадать в контекст запросов.</span></label>
          </section>
          <section class="space-y-2 border-t border-gray-800 pt-3" aria-labelledby="privateMemoryTitle">
            <h4 id="privateMemoryTitle" class="text-xs font-semibold text-emerald-200" data-i18n="privateMemoryTitle">Личная память</h4>
            <details id="privateMemoryHelp" class="memory-help text-[10px] text-gray-500"><summary class="cursor-pointer select-none py-1" data-i18n="privateMemoryHelpSummary">О личной памяти</summary><p class="pl-2 pb-1 leading-relaxed text-gray-400" data-i18n="privateMemoryHelp">Хранится локально в IndexedDB этого браузера. По умолчанию заметки не передаются в запросы; разрешение можно включить ниже.</p></details>
            <div class="flex gap-1"><input id="memoryInput" type="text" maxlength="500" placeholder="Личный факт для локальной модели" class="min-w-0 flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-xs"><button type="button" data-action="save-memory" class="bg-blue-700 hover:bg-blue-600 px-2 rounded text-xs" aria-label="Сохранить в личную память">＋</button></div>
            <div id="memoryBox" class="bg-gray-900 p-2 rounded text-xs text-gray-300 max-h-36 overflow-y-auto border border-gray-800" aria-live="polite">Нет личных заметок.</div>
          </section>
          <label class="flex items-start gap-2 border-t border-gray-800 pt-3 text-[10px] leading-relaxed text-gray-300"><input id="privateMemoryContextToggle" type="checkbox" class="mt-0.5"><span data-i18n="privateMemoryContextLabel">Разрешить использовать заметки личной памяти в контексте запросов.</span></label>
        </div>
      </details>
    </section>
    <details id="projectlessGroup" class="mx-3 my-2 rounded-xl border border-gray-800 projectless-group">
      <summary class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer select-none">
        <span aria-hidden="true">○</span><span data-i18n="noProjectNav">Без проекта</span><span id="projectlessChatCount" class="ml-auto text-[10px] text-gray-500">0</span>
      </summary>
      <div class="px-2 pb-2"><button type="button" data-action="projectless-nav" class="w-full rounded-lg border border-gray-700 px-2 py-2 text-left text-[10px] text-gray-300" data-i18n="showUnassignedChats">Показать личные чаты</button></div>
    </details>
    <section id="projectPanel" class="px-3 py-2 border-t border-gray-800 space-y-2" aria-label="Проекты и настройки проекта">
      <div class="mb-2">
        <button type="button" data-action="open-project-create" data-i18n="createProject" class="w-full rounded-lg border border-cyan-800 bg-cyan-950/40 px-3 py-2 text-left text-xs font-semibold">＋ Создать проект</button>
      </div>
      <div id="projectNavigation" class="space-y-1.5">
        <button id="projectNavToggle" type="button" data-action="toggle-project-navigation" aria-expanded="false" aria-controls="projectNavigationList" class="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold project-nav-heading">
          <span>▣ <span data-i18n="projectsTitle">Проекты</span></span><span id="projectNavChevron" aria-hidden="true">⌄</span>
        </button>
        <div id="projectNavigationList" class="hidden pl-2 space-y-1" aria-label="Список проектов"></div>
      </div>

    </section>
    <p id="projectStatusLine" class="mx-3 -mt-1 mb-1 px-2 text-[10px] leading-relaxed text-gray-500" role="status" aria-live="polite">Личный чат · без проекта</p>
    <button id="chatListBack" type="button" data-action="chat-list-back" class="hidden mx-3 mt-2 w-[calc(100%-1.5rem)] rounded-lg border border-gray-700 px-3 py-2 text-left text-xs text-gray-300" aria-label="Вернуться ко всем чатам">← Все чаты</button>
    <button id="chatListNewButton" type="button" data-action="new-chat" data-i18n="newPersonalChat" class="mx-3 mt-2 w-[calc(100%-1.5rem)] rounded-lg border border-blue-500/25 bg-blue-600/10 hover:bg-blue-600/20 py-2.5 text-xs font-semibold text-blue-200">＋ Новый личный чат</button>
    <button id="restoreLastClosedChat" type="button" data-action="restore-last-closed-chat" class="hidden mx-3 mt-1 w-[calc(100%-1.5rem)] rounded-lg border border-gray-700 px-3 py-2 text-left text-[10px] text-gray-300">↶ Восстановить последний закрытый чат</button>
    <details id="chatSection" open class="mx-3 my-2 rounded-xl border border-gray-800">
      <summary class="chat-section-summary flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold cursor-pointer select-none" aria-controls="chatList">
        <span>💬 <span id="chatSectionTitle" data-i18n="chatsTitle">Чаты</span></span><span id="chatSectionCount" class="text-[10px] text-gray-500">0</span>
      </summary>
      <div id="chatList" class="overflow-y-auto p-2 space-y-1.5 text-sm" aria-label="Список чатов"></div>
    </details>


    
     <div id="chatRowMenuSidebarScrim" aria-hidden="true"></div>
    <input id="importFile" type="file" class="hidden" accept="application/json,.json">
  </aside>

  <div id="projectSettingsModal" class="hidden fixed inset-0 z-[64] bg-black/80 p-3 sm:p-5 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="projectSettingsModalTitle">
    <section class="w-full max-w-xl max-h-[94dvh] overflow-y-auto overscroll-contain rounded-2xl border border-gray-700 bg-gray-950 p-3 sm:p-4 shadow-2xl">
      <header class="sticky top-0 z-10 -mx-3 -mt-3 mb-3 flex items-center justify-between gap-3 border-b border-gray-800 bg-gray-950/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:-mt-4 sm:px-4">
        <h2 id="projectSettingsModalTitle" class="text-sm font-bold" data-i18n="manageProject">Настройки проекта</h2>
        <button type="button" data-action="close-project-settings" aria-label="Назад к меню проектов" class="rounded-xl border border-gray-700 px-3 py-2 text-xs text-gray-300">← Назад</button>
      </header>
          <details id="projectManagerDetails" open class="rounded-xl border border-gray-800">
            <summary class="hidden" aria-hidden="true">Настройки проекта</summary>
            <div class="p-2 space-y-2">
              <label for="currentProjectSelect" class="block text-[11px] text-gray-400" data-i18n="currentProjectLabel">Проект текущего чата</label>
              <p id="projectSettingsStatus" class="text-[10px] text-gray-500">Проект не выбран — создай его ниже.</p>
              <select id="currentProjectSelect" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs"><option value="">Без проекта · личный чат</option></select>
              <label for="projectMemoryScopeSelect" data-i18n="projectMemoryScopeLabel" class="block text-[11px] text-gray-400">Режим памяти проекта</label>
              <select id="projectMemoryScopeSelect" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs">
                <option value="project-only" data-i18n="projectMemoryScopeOnly">Память только внутри проекта</option>
                <option value="project-and-global" data-i18n="projectMemoryScopeGlobal">Память проекта + общая память (если она разрешена)</option>
              </select>
              <p id="projectSummary" class="text-[10px] leading-relaxed text-gray-500">Чат не привязан к проекту.</p>
                        <label for="projectNameInput" class="block text-[11px] text-gray-400" data-i18n="projectNameLabel">Название</label>
              <input id="projectNameInput" type="text" maxlength="100" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs" placeholder="Название проекта">
              <label for="projectInstructionsInput" class="block text-[11px] text-gray-400" data-i18n="projectInstructionsLabel">Инструкции проекта</label>
              <textarea id="projectInstructionsInput" rows="3" maxlength="6000" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs resize-y" placeholder="Цель, стиль, ограничения и критерии результата"></textarea>
              
                
                <button id="saveProjectSubmit" type="button" data-action="save-project" class="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 text-xs" data-i18n="saveProject">Сохранить изменения</button>
              
    
              <label for="projectMemoryInput" class="block text-[11px] text-gray-400" data-i18n="projectMemoryLabel">Добавить факт в память проекта</label>
              <div class="flex gap-1"><input id="projectMemoryInput" type="text" maxlength="600" class="min-w-0 flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs" placeholder="Факт, решение или ограничение"><button type="button" data-action="add-project-memory" class="rounded-lg border border-gray-700 px-2 text-xs" aria-label="Добавить факт">＋</button></div>
              <div id="projectMemoryBox" class="max-h-24 overflow-y-auto text-[11px] text-gray-400 space-y-1"></div>
              <section id="projectSourcesSection" class="rounded-xl border border-gray-800 p-3 space-y-1.5" aria-labelledby="projectSourcesTitle">
                <h3 id="projectSourcesTitle" class="text-xs font-semibold" data-i18n="projectSourcesTitle">Источники проекта</h3>
                <p class="text-[10px] leading-relaxed text-gray-400" data-i18n="projectSourcesUnavailable">Управление источниками пока не подключено: gateway умеет индексировать, удалять и искать документы в рамках scope, но не предоставляет API списка источников. Вложения чата не считаются сохранёнными источниками проекта.</p>
              </section>
              <section id="projectContextHandoff" class="rounded-xl border border-gray-800 p-3 space-y-2" aria-labelledby="projectContextHandoffTitle">
                <h3 id="projectContextHandoffTitle" class="text-xs font-semibold" data-i18n="projectContextHandoffTitle">Передать контекст в чат</h3>
                <p id="projectContextHandoffHelp" class="text-[10px] leading-relaxed text-gray-400">Выбери существующий чат. Контекст этого проекта будет добавлен только к следующему запросу; чат не перемещается и новый чат не создаётся.</p>
                <label for="projectContextTargetChat" class="block text-[10px] text-gray-400" data-i18n="projectContextHandoffLabel">Существующий чат</label>
                <select id="projectContextTargetChat" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs"></select>
                <button type="button" data-action="handoff-project-context" class="w-full rounded-lg border border-cyan-800 bg-cyan-950/30 px-3 py-2 text-xs text-cyan-100" data-i18n="projectContextHandoffButton" disabled>Передать для следующего запроса</button>
              </section>
              
              <div class="grid grid-cols-2 gap-2">
                <button type="button" data-action="export-project" class="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 text-xs" data-i18n="exportProject">Экспорт проекта</button>
                <button type="button" data-action="import-project" class="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 text-xs" data-i18n="importProject">Импорт проекта</button>
              </div>
              <input type="file" id="importProjectFile" class="hidden" accept="application/json,.json">
              <button type="button" data-action="detach-current-chat" class="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 text-xs" data-i18n="detachChat">Извлечь чат из проекта</button>
              <button type="button" data-action="delete-project" class="w-full bg-red-950/50 hover:bg-red-900/60 border border-red-900/50 rounded-lg py-2 text-xs text-red-200" data-i18n="deleteProject">Удалить проект и его чаты</button>
    
            </div>
          </details>
    </section>
  </div>
  <div id="projectCreateModal" class="hidden fixed inset-0 z-[65] bg-black/80 p-3 sm:p-5 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="projectCreateModalTitle">
    <section class="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-2xl">
      <header class="mb-3 flex items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <h2 id="projectCreateModalTitle" class="text-sm font-bold" data-i18n="projectCreateTitle">Создать проект</h2>
        <button type="button" data-action="close-project-create" aria-label="Назад к меню проектов" class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gray-700 text-sm text-gray-300">←</button>
      </header>
      <p class="mb-3 text-xs leading-relaxed text-gray-400" data-i18n="projectCreateHelp">Создание проекта не перемещает текущий чат. Новый чат можно отдельно создать из строки проекта.</p>
      <div class="space-y-2">
        <label for="projectCreateNameInput" class="block text-[11px] text-gray-400" data-i18n="projectCreateNameLabel">Название проекта</label>
        <input id="projectCreateNameInput" type="text" maxlength="100" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm" placeholder="Название проекта">
        <label for="projectCreateInstructionsInput" class="block text-[11px] text-gray-400" data-i18n="projectCreateInstructionsLabel">Краткие инструкции (необязательно)</label>
        <textarea id="projectCreateInstructionsInput" rows="3" maxlength="6000" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm resize-y" placeholder="Цель, стиль, ограничения и критерии результата"></textarea>
      </div>
      <footer class="mt-4 flex justify-end gap-2">
        <button type="button" data-action="close-project-create" class="rounded-lg border border-gray-700 px-4 py-2 text-xs text-gray-300" data-i18n="cancel">Отмена</button>
        <button type="button" data-action="create-project" class="rounded-lg border border-cyan-700 bg-cyan-900/70 px-4 py-2 text-xs font-semibold text-cyan-100" data-i18n="createProject">＋ Создать проект</button>
      </footer>
    </section>
  </div>
  <div id="sidebarOverlay" class="fixed inset-0 bg-black/60 z-40 hidden" aria-hidden="true"></div>
  <div id="chatRowMenuPageScrim" aria-hidden="true"></div>

  <div id="settingsModal" class="hidden fixed inset-0 bg-black/80 p-2 sm:p-4 z-50 overflow-y-auto overscroll-contain" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
    <div class="settings-surface bg-gray-800 p-3 sm:p-4 rounded-xl max-w-2xl mx-auto w-full border border-gray-700 space-y-3 my-auto max-h-[94dvh] overflow-y-auto overscroll-contain">
      <header class="settings-header"><h2 id="settingsTitle" class="text-base font-bold" data-i18n="settingsTitle">⚙️ Настройки</h2><div class="settings-header-actions"><button type="button" data-action="save-settings" data-i18n="saveSettings">Сохранить</button><button type="button" data-action="close-settings" data-i18n-aria-label="closeSettings" aria-label="Закрыть" title="Закрыть">✕</button></div></header>
      <details id="aserviSettingsGroup" open class="settings-subpanel rounded-xl border border-gray-700">
        <summary class="px-3 py-3 text-sm font-semibold cursor-pointer select-none" data-i18n="aserviGroupTitle">aLandi aServi</summary>
        <div class="p-3">
<section id="aserviSettingsCard" class="aservi-card rounded-2xl border p-4 space-y-3" aria-labelledby="aserviCardTitle">
        <div class="flex items-center justify-between gap-3"><div class="min-w-0 flex-1"><p class="text-lg uppercase tracking-[.18em] text-cyan-300 font-extrabold leading-none">aLandi aServi</p><h3 id="aserviCardTitle" data-i18n="aserviCardTitle" class="text-2xl font-bold mt-2">Мой сервер</h3></div><span class="aservi-status-indicator" id="aserviStatusDot" data-state="disconnected" aria-hidden="true"></span></div>
        <div class="grid grid-cols-1 gap-2">
          <input id="aserviBaseUrl" type="url" autocomplete="url" aria-label="URL моего сервера" aria-describedby="aserviBaseUrlError" class="w-full p-3 rounded-xl border text-sm" placeholder="URL моего сервера · https://…/v1"><p id="aserviBaseUrlError" class="field-error hidden" role="alert"></p>
          <input id="aserviModel" type="text" autocomplete="off" aria-label="Модель моего сервера" aria-describedby="aserviModelError" class="w-full p-3 rounded-xl border text-sm" placeholder="Модель gateway · точный ID"><p id="aserviModelError" class="field-error hidden" role="alert"></p>
          <div class="aservi-key-row flex gap-2"><input id="aserviApiKey" type="password" autocomplete="off" aria-label="Ключ доступа к серверу" aria-describedby="aserviApiKeyError" class="min-w-0 flex-1 p-3 rounded-xl border text-sm" placeholder="Ключ доступа"><button type="button" data-action="paste-aservi-key" class="rounded-xl border px-3 text-xs" title="Вставить ключ">↓</button></div><p id="aserviApiKeyError" class="field-error hidden" role="alert"></p>
        </div>
        <p id="aserviStatus" class="aservi-status-copy text-[10px]" data-state="disconnected" role="status" aria-live="polite">Не подключено</p>
      </section>
        </div>
      </details>
      <details id="thirdPartyProviderSettings" class="settings-subpanel rounded-xl border border-gray-700">
        <summary class="px-3 py-3 text-sm font-semibold cursor-pointer select-none" data-i18n="thirdPartySettingsTitle">Сторонние провайдеры</summary>
        <div class="p-3 space-y-3">
          
       <label for="providerPreset" data-i18n="providerLabel" class="sr-only">Сторонний API</label>
       <select id="providerPreset" aria-label="Сторонний API-провайдер" class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm advanced-field"><option value="" selected disabled>Сторонний API</option><optgroup id="providerExternalGroup" label="Сторонние провайдеры"><option value="kilo">Kilo</option><option value="gemini">Google AI Studio · Gemini</option><option value="groq">Groq</option><option value="xai">xAI · Grok</option><option value="pollinations">Pollinations.ai</option><option value="cloudflare">Cloudflare Workers AI</option><option value="openrouter">OpenRouter</option><option value="nvidia">NVIDIA NIM</option><option value="huggingface">Hugging Face</option><option value="custom">Свой OpenAI-совместимый API</option></optgroup></select>
       <input type="search" id="modelSearch" aria-label="Поиск модели" autocomplete="off" class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none advanced-field" placeholder="Поиск модели">
       <select id="modelPreset" aria-label="Каталог моделей" class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm advanced-field"></select>
<div class="flex items-start justify-between gap-2">
        <p id="modelCatalogStatus" class="min-w-0 text-[11px] leading-relaxed text-gray-400" role="status" aria-live="polite">Встроенный каталог моделей.</p>
        <button type="button" data-action="refresh-model-catalog" id="refreshModelCatalog" title="Обновить каталоги всех настроенных провайдеров; полезно для межпровайдерного резерва" class="shrink-0 bg-gray-700 hover:bg-gray-600 border border-gray-600 px-2 py-1.5 rounded text-[11px] text-gray-200">Обновить все</button>
      </div>
      <p id="providerHint" class="hidden" aria-live="polite"></p>
      
      <a id="providerDocsLink" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" class="inline-block text-xs text-blue-300 underline underline-offset-2">Открыть страницу API-ключа</a> <a href="https://github.com/DorpNay/skills-github-pages/blob/main/PROVIDER_SETUP.md" target="_blank" rel="noopener noreferrer" class="inline-block text-xs text-cyan-300 underline underline-offset-2">Инструкция по подключению</a>
      <div id="cloudflareAccountGroup" class="hidden space-y-1.5">
        <label for="cloudflareAccountId" class="block text-xs text-gray-400">Cloudflare Account ID (32 hex-символа)</label>
        <input type="text" id="cloudflareAccountId" inputmode="text" autocomplete="off" spellcheck="false" class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none" placeholder="Ваш Account ID из Cloudflare Dashboard">
        <p class="text-[10px] leading-relaxed text-gray-500">Адрес соберётся автоматически. Нужен Workers AI Read token; Account ID не секрет.</p>
      </div>
             <input type="url" id="baseUrl" aria-label="Base URL" autocomplete="url" class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none advanced-field" placeholder="Base URL · https://…/v1">
       <label for="apiKey" id="apiKeyLabel" class="sr-only">API Key</label>
       <div id="apiKeyShell" class="api-key-row" data-state="empty"><span class="key-lamp" aria-hidden="true"></span><input type="password" id="apiKey" autocomplete="off" aria-describedby="apiKeyStatus" class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none advanced-field" placeholder="Ключ API"><button type="button" data-action="paste-provider-key" class="shrink-0 rounded-md border border-gray-700 px-2 py-1 text-[11px] text-gray-300" title="Вставить ключ">↓</button></div><p id="apiKeyStatus" class="field-error hidden" role="status" aria-live="polite"></p>
<div id="pollinationsAuthGroup" class="hidden rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-3 space-y-2">
        <p class="text-[11px] leading-relaxed text-cyan-100/90">Используй App Key <code>pk_…</code> и OAuth PKCE. Временный <code>sk_…</code> хранится только в sessionStorage этой вкладки.</p>
        <button type="button" data-action="connect-pollinations" class="w-full bg-cyan-900/50 hover:bg-cyan-800/70 border border-cyan-700/50 py-2 rounded-lg text-xs text-cyan-100">Подключить аккаунт Pollinations · PKCE</button>
        <button type="button" data-action="disconnect-pollinations" class="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 py-1.5 rounded-lg text-[11px] text-gray-300">Завершить сессию Pollinations</button>
      </div>
      <div class="flex gap-2"><button type="button" data-action="test-connection" class="flex-1 bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/50 py-2 rounded-lg text-xs text-emerald-100">Проверить соединение и модель</button><button type="button" data-action="clear-provider-key" class="bg-gray-700 hover:bg-gray-600 border border-gray-600 py-2 px-3 rounded-lg text-xs text-gray-300">Удалить ключ</button></div>
             <input type="text" id="modelName" aria-label="Модель" autocomplete="off" class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none advanced-field" placeholder="ID модели">
        </div>
      </details>
      <details id="additionalSettings" class="settings-subpanel rounded-xl border border-gray-700">
        <summary class="px-3 py-3 text-sm font-semibold cursor-pointer select-none" data-i18n="legacySettings">Дополнительные настройки</summary>
        <div class="p-3 space-y-3">
<input type="hidden" id="uiTheme" value="dark">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-gray-800 pb-3">
            <select id="uiLanguage" class="hidden" aria-hidden="true" tabindex="-1"><option value="ru">Русский</option><option value="en">English</option></select>
            <label class="text-[11px] text-gray-400">Анимация<select id="uiMotion" class="advanced-control mt-1 w-full bg-gray-900 rounded border border-gray-700"><option value="auto">Авто</option><option value="reduced">Уменьшить</option><option value="off">Выкл.</option></select></label>
            <label class="text-[11px] text-gray-400">Поле ввода<select id="composerPosition" class="advanced-control mt-1 w-full bg-gray-900 rounded border border-gray-700"><option value="bottom" data-i18n="composerBottom">Снизу</option><option value="top" data-i18n="composerTop">Сверху</option></select></label>
            
          </div>
          <section id="readabilitySettings" class="rounded-xl border border-gray-700 p-3 space-y-3" aria-labelledby="readabilityTitle">
            <h3 id="readabilityTitle" class="text-xs font-semibold" data-i18n="readabilityTitle">Читаемость текста</h3>
            <label for="uiTextScale" class="block text-[11px] text-gray-400">
              <span data-i18n="readabilityScaleLabel">Размер текста</span>
              <span class="float-right tabular-nums" id="uiTextScaleValue">100%</span>
              <input id="uiTextScale" type="range" min="90" max="120" step="5" value="100" class="mt-2 w-full" aria-describedby="readabilityPreview">
            </label>
            <label for="uiTextContrast" class="block text-[11px] text-gray-400">
              <span data-i18n="readabilityContrastLabel">Контраст текста</span>
              <select id="uiTextContrast" class="advanced-control mt-1 w-full bg-gray-900 rounded border border-gray-700">
                <option value="normal" data-i18n="readabilityContrastNormal">Стандартный</option>
                <option value="high" data-i18n="readabilityContrastHigh">Повышенный</option>
              </select>
            </label>
            <p id="readabilityPreview" class="rounded-lg border border-gray-800 bg-gray-900/50 p-2 text-xs leading-relaxed" data-i18n="readabilityPreview">Пример текста — так будут выглядеть сообщения.</p>
            <button type="button" data-action="reset-readability" class="rounded-lg border border-gray-700 px-2 py-1 text-[10px] text-gray-400 hover:text-gray-200" data-i18n="readabilityReset">Сбросить</button>
          </section>
       <details id="searchToolsSettings" class="rounded-xl border border-gray-700"><summary class="cursor-pointer select-none px-3 py-2.5 text-xs font-semibold">Инструменты и веб-поиск</summary><div class="px-3 pb-3 space-y-2"><p class="text-[10px] leading-relaxed text-gray-400" data-i18n="tavilyDecisionNote">Решение о подключении Tavily ещё не принято. Сначала оцениваем текущий поиск и его качество; ключ можно оставить пустым.</p><div class="flex gap-2"><input type="password" id="tavilyKey" aria-label="Ключ Tavily" autocomplete="off" class="min-w-0 flex-1 p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none advanced-field" placeholder="ключ Tavily"><button type="button" data-action="paste-tavily-key" class="rounded-lg border border-gray-700 px-2 text-xs" aria-label="Вставить ключ Tavily">↓</button></div></div></details>
       <label for="systemPromptInput" data-i18n="systemPromptLabel" class="block text-xs text-gray-400">Системный промпт</label>
       <p class="text-[10px] leading-relaxed text-gray-400" data-i18n="systemPromptEmptyNote">Глобальный системный промпт пуст по умолчанию. Добавляй общие инструкции только если они действительно нужны.</p>
       <div class="prompt-editor"><textarea id="systemPromptInput" rows="4" readonly class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none resize-y" placeholder="Свои правила для всех запросов"></textarea><button type="button" id="editSystemPrompt" data-action="edit-system-prompt" class="prompt-pencil" aria-pressed="false" aria-label="Редактировать системный промпт" title="Редактировать">✎</button></div><p id="promptEditHint" class="sr-only" aria-live="polite"></p>
       <label class="flex items-start gap-2 text-xs text-gray-300 mt-2"><input id="allowCrossProviderFallback" type="checkbox" class="mt-0.5 rounded bg-gray-800 border-gray-700"><span><strong>Разрешить резерв у другого провайдера</strong><span class="block text-[11px] leading-relaxed text-amber-200/80">По умолчанию выключено. При включении текст запроса и контекст могут передаваться другому сервису. Сначала система пробует модели выбранного провайдера.</span></span></label>
      <p class="text-[10px] leading-relaxed text-gray-500">Ключи хранятся в этом браузере. Резервный провайдер может получить текст запроса и контекст.</p>
       <div class="grid grid-cols-2 gap-2">
        <button type="button" data-action="export-settings-profile" class="bg-gray-700 hover:bg-gray-600 py-2 px-2 rounded text-xs text-gray-200">Скачать профиль настроек</button>
        <button type="button" data-action="import-settings-profile" class="bg-gray-700 hover:bg-gray-600 py-2 px-2 rounded text-xs text-gray-200">Импорт профиля</button>
      </div>
      <input type="file" id="settingsProfileFile" class="hidden" accept="application/json,.json">
      <p class="text-[10px] leading-relaxed text-gray-500">Профиль переносит настройки, но намеренно не содержит API-ключи и токены. Импорт не меняет уже сохранённые секреты.</p>
        </div>
      </details>
      <button type="button" id="recoveryBackupButton" data-action="download-recovery-backup" class="hidden w-full bg-amber-800 hover:bg-amber-700 py-2 rounded text-xs text-amber-50">Скачать резервную копию истории</button>
    </div>
  </div>

  <header class="app-header px-3 py-2 border-b flex items-center shrink-0 gap-2">
    <button type="button" id="appSidebarToggle" data-action="toggle-sidebar" aria-label="Открыть меню" class="header-icon text-xl px-2 py-1 shrink-0">☰</button>
    <div class="header-chat-title min-w-0 flex-1">
      <span id="activeProjectTitle" class="active-project-title hidden"></span>
      <h1 id="activeChatTitle" class="font-semibold text-xs sm:text-sm truncate">Новый чат</h1>
    </div>
    <div id="aLandiClock" class="clock-shell shrink-0" aria-label="Местное время">
      <div class="clock-face" aria-hidden="true"><span class="clock-digital" id="clockDigital">00:00</span><span class="clock-hand clock-hour" id="clockHour"></span><span class="clock-hand clock-minute" id="clockMinute"></span><span class="clock-hand clock-second" id="clockSecond"></span><span class="clock-pin"></span></div>
      <span id="clockAccessible" class="sr-only" aria-live="off">Местное время</span>
    </div>
    <span id="brandWordmark" class="brand-wordmark font-bold text-lg tracking-tight shrink-0">aLandi</span>
    <div class="header-preferences" role="group" aria-label="Настройки отображения">
      <button type="button" id="headerThemeToggle" data-action="toggle-theme-cycle" class="header-icon" aria-label="Сменить тему" title="Сменить тему">☾</button>
      <details id="languageMenu" class="language-menu">
        <summary id="languageSummary" class="header-icon" aria-label="Выбрать язык" title="Выбрать язык">RU</summary>
        <div class="language-menu-panel">
          <button type="button" data-action="set-language" data-language="ru" aria-pressed="true">Русский</button>
          <button type="button" data-action="set-language" data-language="en" aria-pressed="false">English</button>
        </div>
      </details>
      <button type="button" data-action="toggle-settings" aria-label="Настройки" class="header-icon">⚙</button>
    </div>
  </header>

  <div id="modeToolbar" class="bg-gray-950 px-3 py-2 border-b border-gray-800 shrink-0 space-y-1.5">
    <div class="mode-hint-row"><p id="modeHint" class="mode-hint text-[10px] text-gray-500 leading-tight" aria-live="polite" title="Объём работы и ширина веб-поиска управляются независимо.">Быстро · Веб: обычный · Прямой · Авто</p><span id="pyStatus" class="hidden sm:inline-flex shrink-0 text-[9px] text-gray-500" title="Python загрузится только после запуска блока кода">Py: по запросу</span></div>
    <div class="flex items-center gap-2 text-xs">
      <span class="text-gray-400 shrink-0" data-i18n="modeLabel">Объём:</span>
      <div class="flex flex-1 min-w-0 rounded-lg bg-gray-900 p-1 gap-1" role="group" aria-label="Объём работы" data-i18n-aria-label="modeGroupAria">
        <button type="button" id="modeFast" data-i18n="modeFast" aria-pressed="true" class="flex-1 min-w-0 rounded-md px-2 py-1 bg-blue-600 font-semibold">⚡ Быстро</button>
        <button type="button" id="modeDeep" data-i18n="modeDeep" aria-pressed="false" class="flex-1 min-w-0 rounded-md px-2 py-1 text-gray-300">🔬 Тщательно</button>
      </div>
    </div>
    <div class="flex items-center gap-2 text-xs">
      <details id="searchModeMenu" class="toolbar-menu flex-1 min-w-0">
        <summary id="searchModeSummary" class="toolbar-menu-summary">🌐 Веб: обычный ▾</summary>
        <div class="toolbar-menu-panel">
          <button type="button" data-action="select-search-mode" data-search-mode="normal" class="toolbar-menu-option"><strong data-i18n="searchModeNormal">Обычный</strong><small data-i18n="searchModeNormalHelp">Стандартный охват результатов и источников; не меняет бюджет обработки.</small></button>
          <button type="button" data-action="select-search-mode" data-search-mode="more" class="toolbar-menu-option"><strong data-i18n="searchModeMore">Расширенный</strong><small data-i18n="searchModeMoreHelp">Больше результатов и источников на каждый поиск; не увеличивает число раундов.</small></button>
          <button type="button" data-action="select-search-mode" data-search-mode="offline" class="toolbar-menu-option"><strong data-i18n="searchModeOffline">Выкл.</strong><small data-i18n="searchModeOfflineHelp">Веб-инструменты выключены; облачному API всё ещё может требоваться интернет.</small></button>
        </div>
      </details>
      <details id="functionsMenu" class="toolbar-menu flex-1 min-w-0">
        <summary id="functionsMenuSummary" class="toolbar-menu-summary" data-i18n="functionsMenuLabel">Функции ▾</summary>
        <div class="toolbar-menu-panel toolbar-menu-panel-right">
          <button type="button" data-action="open-function-panel" data-function="agents" class="toolbar-menu-option" data-i18n="functionAgents">🧭 Структурированный разбор</button>
          <button type="button" data-action="open-function-panel" data-function="skills" class="toolbar-menu-option" data-i18n="functionSkills">🧩 Профиль задачи</button>
          <button type="button" data-action="open-function-panel" data-function="connectors" class="toolbar-menu-option" data-i18n="functionConnectors">🔌 Интеграции</button>
          <button type="button" data-action="open-research-studio" class="toolbar-menu-option" data-i18n="functionResearchStudio">⌕ Студия исследования</button>
        </div>
      </details>
    </div>
    <input type="checkbox" id="toggleSearch" class="hidden" checked>
    <input type="checkbox" id="toggleMultiAgent" class="hidden">
    <span id="offlineToggle" class="sr-only" aria-live="polite"></span>
  </div>

  <main id="chatBox" class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-sm" aria-live="polite" aria-label="Сообщения чата"></main>
  <div id="searchStatus" class="hidden px-4 py-2 bg-gray-800/80 border-t border-gray-700 text-xs text-blue-300 flex items-center gap-2 shrink-0" role="status" aria-live="polite">
    <span class="animate-spin" aria-hidden="true">⏳</span><span id="statusText">Выполняется запрос...</span><span class="status-thinking-dots" aria-hidden="true"><span></span><span></span><span></span></span><span id="thinkingTime" class="text-[10px]">Прошло 00:00</span>
  </div>
  <footer id="composerFooter" class="px-3 py-2 bg-gray-800/95 border-t border-gray-700 shrink-0 safe-bottom">
    <div id="draftAttachments" class="hidden flex flex-wrap gap-1.5 pb-2" aria-label="Вложения черновика"></div>
    <div class="flex gap-2 items-end" id="inputArea">
      <button id="contextPickerButton" type="button" data-action="toggle-request-context" aria-label="Выбрать контекст для следующего запроса" aria-expanded="false" title="Контекст этого запроса: выбрать проекты" class="composer-tool rounded-xl border border-gray-700 px-3 py-2.5 relative">◎<span id="requestContextCount" class="hidden absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-bold items-center justify-center px-1">0</span></button>
      <button type="button" data-action="attach-text-file" id="attachTextButton" aria-label="Добавить вложение" title="Выбрать фото, видео или файл любого формата" aria-expanded="false" class="composer-tool rounded-xl border border-gray-700 px-3 py-2.5">＋</button>
      <input type="file" id="mediaAttachmentInput" class="hidden" accept="image/*,video/*" multiple>
      <input type="file" id="textAttachmentInput" class="hidden" multiple>
      <textarea id="userInput" rows="1" maxlength="30000" placeholder="Напиши сообщение..." aria-label="Сообщение" data-i18n-placeholder="composerPlaceholder" class="flex-1 min-w-0 bg-gray-900 border border-gray-700 px-3 py-2.5 rounded-xl text-base outline-none resize-none max-h-32"></textarea>
      <button id="voiceUnavailableButton" type="button" aria-label="Зажми, чтобы открыть режимы голоса" aria-expanded="false" title="Удерживай, чтобы открыть голосовое меню; обычное нажатие ничего не открывает" class="composer-tool rounded-xl border border-gray-700 px-3 py-2.5">◉</button>
      <button id="sendBtn" type="button" data-action="send" class="bg-blue-600 hover:bg-blue-500 px-3 py-2.5 rounded-xl font-bold text-sm shrink-0" aria-label="Отправить сообщение">➤</button>
      <button id="stopBtn" type="button" data-action="stop" class="hidden bg-red-600 hover:bg-red-500 px-3 py-2.5 rounded-xl font-bold text-sm shrink-0" aria-label="Остановить генерацию">⏹</button>
    </div>
    <div id="attachmentMenu" class="composer-popover hidden" role="group" aria-label="Добавить вложение">
      <button type="button" data-action="choose-media" class="composer-popover-option"><span aria-hidden="true">▧</span><span><strong data-i18n="attachMediaTitle">Фото или видео</strong><small data-i18n="attachMediaHelp">Изображения и выбор кадров из ролика</small></span></button>
      <button type="button" data-action="choose-any-file" class="composer-popover-option"><span aria-hidden="true">▤</span><span><strong data-i18n="attachAnyFileTitle">Файл любого формата</strong><small data-i18n="attachAnyFileHelp">Системный выбор нескольких файлов; доступность разбора зависит от формата.</small></span></button>
    </div>
    <div id="requestContextMenu" class="composer-popover context-popover hidden" role="dialog" aria-label="Контекст следующего запроса" aria-describedby="requestContextHelp">
      <div class="flex items-start justify-between gap-3 px-2 pb-2"><div><h3 class="text-sm font-semibold" data-i18n="requestContextTitle">Контекст этого запроса</h3><p id="requestContextHelp" data-i18n="requestContextHelp" class="text-[10px] text-gray-500 mt-1">Выбранные проекты будут учтены только при следующей отправке. Сам чат и его проект не изменятся.</p></div><button type="button" data-action="clear-request-context" data-i18n="clearRequestContext" aria-label="Снять выбор проектов" class="text-xs text-gray-400 hover:text-white">Сбросить</button></div>
      <div id="requestProjectChecks" class="max-h-48 overflow-y-auto space-y-1"></div>
      <div class="mt-2 pt-2 border-t border-gray-700 space-y-1.5">
        <p class="text-[10px] text-gray-400" data-i18n="skillsAutoHint"><strong>Навыки</strong> · автоматический подбор по задаче; отдельный каталог выбора пока не подключён.</p>
        <p class="text-[10px] text-amber-300/80" data-i18n="requestContextLimitHint">Контекст ограничен пятью проектами и общим лимитом, чтобы не переполнять запрос.</p>
      </div>
    </div>
    <div id="voiceMenu" class="voice-menu hidden" role="group" aria-label="Режимы голоса">
      <button type="button" data-action="voice-chat-preview" class="voice-menu-option"><span class="voice-direction">↑</span><span><strong>ГОЛОСОВОЙ ДИАЛОГ</strong><small>Локально · реплики по очереди</small></span></button>
      <button type="button" data-action="voice-message-preview" class="voice-menu-option"><span class="voice-direction">↓</span><span><strong>ГОЛОСОВОЕ СООБЩЕНИЕ</strong><small>Записать → локально расшифровать → отредактировать</small></span></button>
    </div>
    <div id="voiceRecordingPanel" class="hidden mx-auto mb-2 w-full max-w-3xl rounded-xl border border-red-500/40 bg-gray-900 px-3 py-2 shadow-lg" role="group" aria-label="Запись голосового сообщения">
      <div class="flex items-center justify-between gap-3"><p id="voiceRecordingStatus" class="text-xs text-gray-200" role="status" aria-live="polite">● Запись…</p><div id="voiceRecordingActions" class="flex gap-2"><button type="button" data-action="cancel-voice-recording" class="rounded-lg border border-gray-700 px-3 py-2 text-xs">Отмена</button><button type="button" data-action="stop-voice-recording" class="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">Остановить и расшифровать</button></div><button id="stopVoiceConversationBtn" type="button" data-action="stop-voice-conversation" class="hidden rounded-lg border border-red-500/60 px-3 py-2 text-xs text-red-200">Завершить диалог</button></div>
    </div>
  </footer>
  <div id="ttsMiniPlayer" class="hidden fixed bottom-24 right-3 z-[75] w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border border-cyan-700/60 bg-gray-950 p-3 shadow-2xl" role="region" aria-label="Миниплеер озвучивания">
    <div class="mb-2 flex items-center justify-between gap-3"><p id="ttsMiniPlayerStatus" class="text-xs text-gray-300">Локальное озвучивание</p><button type="button" data-action="stop-speech" class="rounded-md border border-gray-700 px-2 py-1 text-xs">Стоп</button></div><label id="ttsVoiceChoiceWrap" class="hidden mb-2 block text-xs text-gray-300">Голос ответа<select id="ttsVoiceSelect" class="mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-sm" aria-label="Голос локального озвучивания"></select></label>
    <audio id="ttsAudioPlayer" class="w-full" controls preload="none"></audio>
  </div>
  <div id="toast" class="toast hidden" role="status" aria-live="polite"></div>
  <button id="jumpToLatest" type="button" data-action="jump-to-latest" class="jump-to-latest hidden" aria-label="Перейти к последнему сообщению" title="В конец чата">↓</button>
  <div id="composerPopoverScrim" class="hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]" aria-hidden="true"></div>
  <div id="messageViewerModal" class="hidden fixed inset-0 z-[86] bg-black/80 p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="messageViewerTitle">
    <section class="message-viewer-surface w-full max-w-4xl max-h-[92dvh] rounded-2xl p-3 sm:p-5 flex flex-col">
      <header class="flex items-center gap-3 border-b border-gray-700 pb-3 mb-3 shrink-0">
        <button type="button" data-action="close-message-viewer" class="rounded-xl border px-3 py-2 text-xl" aria-label="Вернуться в чат" title="Вернуться в чат">←</button>
        <div class="min-w-0"><h2 id="messageViewerTitle" class="font-semibold text-base">Сообщение</h2><p id="messageViewerRole" class="text-xs text-gray-400"></p></div>
        <div class="message-actions ml-auto mt-0">
          <button id="messageViewerCopy" type="button" data-action="copy-message" aria-label="Скопировать сообщение" title="Скопировать сообщение">⧉</button>
          <button id="messageViewerSpeak" type="button" data-action="speak-message" aria-label="Озвучить сообщение" title="Озвучить сообщение">◖))</button>
        </div>
      </header>
      <div id="messageViewerContent" class="message-viewer-content" tabindex="0" aria-label="Полный текст сообщения"></div>
    </section>
  </div>
  <div id="chatActionModal" class="hidden fixed inset-0 z-[85] bg-black/65 p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="chatActionTitle" aria-describedby="chatActionHelp">
    <section class="chat-action-dialog w-full max-w-sm rounded-2xl p-4 sm:p-5 space-y-4">
      <header class="flex items-center justify-between gap-3"><h2 id="chatActionTitle" class="font-semibold text-base">Действие с чатом</h2><button type="button" data-action="chat-action-cancel" class="rounded-lg px-2.5 py-2" aria-label="Закрыть">✕</button></header>
      <form id="chatActionForm" class="space-y-3">
        <label id="chatActionFieldLabel" for="chatActionName" class="block text-sm">Название</label>
        <input id="chatActionName" class="w-full rounded-xl border px-3 py-3 bg-transparent" maxlength="120" autocomplete="off">
        <select id="chatActionProject" class="hidden w-full rounded-xl border px-3 py-3 bg-transparent"></select>
        <p id="chatActionHelp" class="text-xs text-gray-500">Изменение применяется только к выбранному чату.</p>
        <footer class="flex justify-end gap-2 pt-1"><button type="button" data-action="chat-action-cancel" class="rounded-xl border px-3 py-2.5 text-sm">Отмена</button><button type="submit" data-action="chat-action-save" class="rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-medium">Сохранить</button></footer>
      </form>
    </section>
  </div>

  <div id="researchStudioModal" class="hidden fixed inset-0 z-[65] bg-black/80 p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="researchStudioTitle">
    <section class="w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-2xl border border-cyan-800/60 bg-gray-950 p-4 sm:p-6 shadow-2xl space-y-4">
      <header class="flex items-start justify-between gap-3"><div><p class="text-[10px] uppercase tracking-[.22em] font-bold text-cyan-300">aLandi · Studio</p><h2 id="researchStudioTitle" class="mt-1 text-lg font-bold" data-i18n="researchStudioTitle">Студия исследования</h2><p class="mt-1 text-xs leading-relaxed text-gray-400" data-i18n="researchStudioDescription">Окно подготовки исследовательского запроса. Запуск использует текущие параметры этого чата.</p></div><button type="button" data-action="close-research-studio" class="rounded-lg px-2 py-1 text-gray-400 hover:text-white" aria-label="Закрыть студию" data-i18n-aria-label="researchStudioClose">✕</button></header>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="block text-xs text-gray-400">Усилие
          <select id="researchStudioEffort" class="advanced-control mt-1 w-full rounded-lg border border-gray-700 bg-gray-900"><option value="fast">Быстро</option><option value="deep">Тщательно</option></select>
        </label>
        <label class="block text-xs text-gray-400">Веб-поиск
          <select id="researchStudioSearchMode" class="advanced-control mt-1 w-full rounded-lg border border-gray-700 bg-gray-900"><option value="normal">Обычный</option><option value="more">Расширенный</option><option value="offline">Выкл.</option></select>
        </label>
      </div>
      <label class="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/60 p-3 text-xs text-gray-300">
        <input id="researchStudioStructured" type="checkbox" class="rounded">
        <span><strong class="block">Структурированный разбор</strong><span class="mt-0.5 block text-[10px] text-gray-500">Четыре последовательных этапа на выбранной модели.</span></span>
      </label>
      <div class="rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-3 space-y-1.5">
        <p id="researchStudioSettingsSummary" class="text-xs font-semibold text-gray-200" aria-live="polite">Текущие параметры чата</p>
        <p class="text-[11px] leading-relaxed text-gray-400">Текст задачи вводи в основном поле сообщения. Это окно меняет только режимы.</p>
      </div>
      <p class="text-[10px] leading-relaxed text-gray-500">Прикрепи документы в чате. Внешние источники остаются недоверенными данными, а не инструкциями.</p>
      <div class="flex flex-wrap justify-end gap-2"><button type="button" data-action="close-research-studio" class="rounded-xl border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800">Отмена</button><button type="button" data-action="start-research-studio" class="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-500">Применить режим</button></div>
      <p id="researchStudioStatus" class="text-[11px] text-gray-500" role="status" aria-live="polite">Параметры ещё не изменены.</p>
    </section>
  </div>
  <div id="functionPanelModal" class="hidden fixed inset-0 z-[66] bg-black/80 p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="functionPanelTitle">
    <section class="w-full max-w-lg max-h-[88dvh] overflow-y-auto rounded-2xl border border-gray-700 bg-gray-950 p-4 sm:p-5 shadow-2xl space-y-4">
      <header class="flex items-start justify-between gap-3">
        <div class="min-w-0"><h2 id="functionPanelTitle" class="font-bold text-base">Функции</h2><p id="functionPanelDescription" class="mt-1 text-xs leading-relaxed text-gray-400"></p></div>
        <button type="button" data-action="close-function-panel" class="shrink-0 rounded-lg px-2 py-1 text-gray-400 hover:text-white" aria-label="Закрыть">✕</button>
      </header>
      <section id="agentFunctionSettings" class="hidden space-y-3">
        <label class="flex items-start gap-2 rounded-xl border border-gray-800 p-3 text-sm"><input type="checkbox" id="agentModeControl" class="mt-1 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-0"><span><strong class="block" data-i18n="agentModeOption">Использовать структурированный разбор</strong><span class="mt-1 block text-[11px] leading-relaxed text-gray-500" data-i18n="agentModeHelp">Четыре последовательных этапа на выбранной модели.</span></span></label>
        <div class="grid grid-cols-2 gap-3">
          <label class="block text-xs text-gray-400">Размер команды · blueprint
            <input id="agentTeamSize" type="range" min="1" max="50" step="1" value="4" class="mt-2 w-full"><span id="agentTeamSizeValue" class="text-[11px] font-semibold text-cyan-300">4 агента</span>
          </label>
          <label class="block text-xs text-gray-400">Сценарий
            <select id="agentTeamScenario" class="advanced-control mt-1 w-full rounded-lg border border-gray-700 bg-gray-900"><option value="general">Общий</option><option value="research">Исследование</option><option value="software">Разработка</option><option value="product">Продукт</option><option value="due-diligence">Due diligence</option><option value="custom">Свой вариант</option></select>
          </label>
          <label class="block text-xs text-gray-400 col-span-2">Роли
            <select id="agentRolePreset" class="advanced-control mt-1 w-full rounded-lg border border-gray-700 bg-gray-900"><option value="balanced">Сбалансированные</option><option value="research">Исследовательская команда</option><option value="software">Разработка ПО</option><option value="product">Продуктовая команда</option><option value="custom">Свой вариант</option></select>
          </label>
        </div>
        <div id="agentCustomFields" class="hidden space-y-2 rounded-xl border border-gray-800 p-3">
          <textarea id="agentTeamCustomScenario" maxlength="1000" rows="2" class="advanced-control w-full resize-y rounded-lg border border-gray-700 bg-gray-900" placeholder="Опиши сценарий команды"></textarea>
          <textarea id="agentCustomRoles" maxlength="1500" rows="3" class="advanced-control w-full resize-y rounded-lg border border-gray-700 bg-gray-900" placeholder="Роли и обязанности, по одной на строку"></textarea>
        </div>
        <p class="rounded-lg border border-amber-900/50 bg-amber-950/20 p-2 text-[10px] leading-relaxed text-amber-100/80">Команда — сохраняемый blueprint. Runtime сейчас выполняет четыре фиксированных этапа на одной выбранной модели; создание 50 независимых агентов ещё не реализовано.</p>
        <div class="roadmap-ticker mt-2" aria-label="Планируемое улучшение"><span class="roadmap-ticker-track" aria-hidden="true">1nv3nt10n 1n PrOc3ss… · Независимое исполнение ролей — в дорожной карте</span></div>
        <p class="roadmap-note">Это планируемое направление, а не активный runtime или индикатор фоновой работы.</p>
        <p id="agentConfigSummary" class="text-[10px] text-gray-500" aria-live="polite"></p>
      </section>
      <section id="skillFunctionSettings" class="hidden space-y-2">
        <label for="skillPresetSelect" class="block text-xs font-semibold" data-i18n="skillPresetLabel">Навык этого чата</label>
        <select id="skillPresetSelect" class="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-sm">
          <option value="auto" data-i18n="skillAuto">Автоматически по задаче</option>
          <option value="planning" data-i18n="skillPlanning">Планирование</option>
          <option value="research" data-i18n="skillResearch">Исследование</option>
          <option value="code-review" data-i18n="skillCodeReview">Код и ревью</option>
          <option value="data-analysis" data-i18n="skillDataAnalysis">Анализ данных</option>
          <option value="agent-systems" data-i18n="skillAgentSystems">Системы агентов</option>
          <option value="multimodal" data-i18n="skillMultimodal">Мультимодальные задачи</option>
          <option value="custom">Свой вариант</option>
        </select>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label class="block text-[11px] text-gray-400">Задача по ответам
            <select id="skillGoalSelect" class="advanced-control mt-1 w-full rounded-lg border border-gray-700 bg-gray-900"><option value="planning">Планирование</option><option value="research">Исследование</option><option value="code-review">Код и ревью</option><option value="data-analysis">Анализ данных</option><option value="agent-systems">Системы агентов</option><option value="multimodal">Мультимодальные задачи</option><option value="custom">Свой вариант</option></select>
          </label>
          <label class="block text-[11px] text-gray-400">Формат результата
            <select id="skillOutputSelect" class="advanced-control mt-1 w-full rounded-lg border border-gray-700 bg-gray-900"><option value="summary">Краткое резюме</option><option value="checklist">Чек-лист</option><option value="steps">Пошагово</option><option value="table">Таблица</option><option value="report">Отчёт</option><option value="custom">Свой вариант</option></select>
          </label>
        </div>
        <div id="skillCustomFields" class="hidden space-y-2 rounded-xl border border-cyan-900/50 bg-cyan-950/15 p-3">
          <input id="customSkillName" maxlength="80" class="advanced-field w-full rounded-lg border border-gray-700 bg-gray-900" placeholder="Название своего навыка">
          <textarea id="customSkillInstructions" rows="3" maxlength="3000" class="advanced-field w-full resize-y rounded-lg border border-gray-700 bg-gray-900" placeholder="Свои инструкции для задачи"></textarea>
          <textarea id="customSkillOutput" rows="2" maxlength="500" class="advanced-field w-full resize-y rounded-lg border border-gray-700 bg-gray-900" placeholder="Свой формат результата (необязательно)"></textarea>
        </div>
        <button type="button" data-action="apply-skill-quiz" class="w-full rounded-lg border border-cyan-800 bg-cyan-950/40 px-3 py-2 text-xs font-semibold text-cyan-200">Подобрать навык</button>
        <p id="skillConfigSummary" class="text-[10px] text-gray-500" aria-live="polite"></p>
        <p class="text-[11px] leading-relaxed text-gray-500" data-i18n="skillPresetHelp">Профиль добавляет инструкции, но не открывает инструменты или данные.</p>
      </section>
      <section id="connectorFunctionStatus" class="hidden rounded-xl border border-gray-800 bg-gray-900/60 p-3 text-sm leading-relaxed text-gray-300"><p data-i18n="functionConnectorsDescription">Показываем только реально подключённые источники. Внешние коннекторы пока не подключены; они не будут имитироваться переключателями.</p><div class="roadmap-ticker mt-3" aria-label="Планируемое улучшение"><span class="roadmap-ticker-track" aria-hidden="true">1nv3nt10n 1n PrOc3ss… · Интеграции с контролируемыми разрешениями — в дорожной карте</span></div><p class="roadmap-note">Подключение источников появится только после проверки прав, границ данных и реального соединения. Анимация декоративная и не означает, что сервис уже выполняет работу.</p></section>
      <footer class="flex justify-end border-t border-gray-800 pt-3"><button type="button" data-action="close-function-panel" data-i18n="functionPanelClose" class="rounded-xl border border-gray-700 px-4 py-2 text-sm">Закрыть</button></footer>
    </section>
  </div>
  <div id="traceModal" class="hidden fixed inset-0 z-[70] bg-black/75 p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="traceTitle">
    <div class="w-full max-w-3xl max-h-[90dvh] overflow-y-auto bg-gray-950 border border-gray-700 rounded-xl p-3 sm:p-4 space-y-3">
      <div class="flex items-center justify-between gap-3"><h2 id="traceTitle" class="font-bold text-base">Журнал исследования</h2><button type="button" data-action="close-trace" class="text-gray-400 hover:text-white px-2 py-1" aria-label="Закрыть журнал">✕</button></div>
      <p class="text-xs text-gray-400">План, черновик исследователя и критика перед итоговым ответом. Это журнал выполненных этапов, а не скрытая внутренняя цепочка мыслей модели.</p>
      <div id="traceContent" class="space-y-4 text-sm"></div>
      <div class="flex flex-wrap gap-2"><button type="button" data-action="download-trace" class="bg-blue-700 hover:bg-blue-600 rounded-lg px-3 py-2 text-sm">Скачать журнал .md</button><button type="button" data-action="download-trace-json" class="bg-blue-900 hover:bg-blue-800 rounded-lg px-3 py-2 text-sm">Скачать журнал .json</button><button type="button" data-action="copy-trace-link" class="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm">Копировать локальную ссылку</button><button type="button" data-action="close-trace" class="bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 text-sm">Закрыть</button></div>
      <p class="text-[11px] text-gray-500">Локальная ссылка работает в этом же браузере, где сохранена история. Для передачи на другое устройство используйте файл журнала.</p>
    </div>
  </div>
  <script defer src="{{ '/assets/js/app.js' | relative_url }}"></script>
</body>
</html>
