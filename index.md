---
layout: null
title: aLandi — личная AI-среда
permalink: /
---

<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0a1220">
  <meta name="description" content="aLandi — личная AI-среда для чатов, проектов и работы с контекстом.">
  <meta name="color-scheme" content="dark light">
  <title>aLandi — личная AI-среда</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script id="markedRuntime" defer src="https://cdn.jsdelivr.net/npm/marked@18.0.14/marked.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.16/purify.min.js"></script>
  <link rel="stylesheet" href="{{ '/assets/css/app.css' | relative_url }}">
</head>
<body class="bg-gray-900 text-white flex flex-col">
  <aside id="sidebar" aria-label="Проекты и чаты" class="fixed inset-y-0 left-0 z-50 w-72 max-w-[88vw] bg-gray-950 border-r border-gray-800 -translate-x-full transition-transform duration-300 flex flex-col overflow-y-auto overscroll-contain">
    <div class="sticky top-0 z-20 bg-gray-950/95 backdrop-blur p-4 border-b border-gray-800 flex justify-between items-center">
      <h2 class="font-bold text-sm" data-i18n="sidebarTitle">💬 Диалоги и память</h2>
      <button type="button" data-action="close-sidebar" aria-label="Закрыть меню" class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gray-800 text-gray-400 hover:text-white text-lg">✕</button>
    </div>
    <section id="sidebarSearchPanel" class="mx-3 mt-3 space-y-2" aria-label="Поиск по названиям чатов и проектов">
      <label class="sr-only" for="sidebarSearchInput">Поиск чатов и проектов</label>
      <input id="sidebarSearchInput" type="search" autocomplete="off" spellcheck="false" aria-label="Поиск чатов и проектов" placeholder="Поиск чатов и проектов…" class="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">
      <div id="sidebarSearchResults" class="hidden max-h-[38vh] overflow-y-auto rounded-xl border border-gray-800 bg-gray-900/80 p-2 space-y-2" aria-label="Результаты поиска" aria-live="polite"></div>
    </section>
    
    <details id="memoryPanel" class="mx-3 mt-2 mb-1 rounded-lg border border-gray-800 px-2 py-1.5" aria-label="Настройки памяти">
      <summary class="flex min-h-9 items-center justify-between gap-2 cursor-pointer select-none list-none">
        <span class="text-xs font-semibold text-gray-200" data-i18n="memoryPanelTitle">⚙ Настройки памяти</span>
        <span class="memory-summary-indicator" aria-hidden="true"></span>
      </summary>
      <div class="mt-1 space-y-2">
        <p id="memoryStatusLine" class="memory-status-line" role="status" aria-live="polite">Личная память выкл. · Общая память выкл.</p>
        <details id="memoryToolsDetails" class="rounded-lg border border-gray-800">
          <summary class="cursor-pointer select-none px-3 py-2 text-xs font-semibold" data-i18n="memoryPanelSummary">Личная и общая память</summary>
          <div class="p-2 space-y-3">
            <section class="space-y-2" aria-labelledby="sharedMemoryTitle">
              <h4 id="sharedMemoryTitle" class="text-xs font-semibold text-amber-200" data-i18n="sharedMemoryTitle">Общая память</h4>
              <details id="sharedMemoryHelp" class="memory-help text-[10px] text-gray-500"><summary class="cursor-pointer select-none py-1" data-i18n="sharedMemoryHelpSummary">Об общей памяти</summary><p class="pl-2 pb-1 leading-relaxed text-gray-400" data-i18n="sharedMemoryHelp">Общие факты могут попасть внешнему провайдеру только при отдельном разрешении и если это допускает область памяти проекта.</p></details>
              <div class="flex gap-1"><input id="sharedMemoryInput" type="text" maxlength="500" placeholder="Факт для общей памяти" class="min-w-0 flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-xs"><button type="button" data-action="save-shared-memory" class="bg-amber-800 hover:bg-amber-700 px-2 rounded text-xs" aria-label="Сохранить в общую память">+</button></div>
              <div id="sharedMemoryBox" class="bg-gray-900 p-2 rounded text-xs text-gray-300 max-h-36 overflow-y-auto border border-gray-800" aria-live="polite">Нет общих заметок.</div>
              <label class="flex items-start gap-2 text-[10px] leading-relaxed text-gray-400"><input id="globalMemoryToggle" type="checkbox" class="mt-0.5"><span data-i18n="globalMemoryOptIn">Разрешить подходящим заметкам общей памяти попадать в контекст запросов.</span></label>
            </section>
            <section class="space-y-2 border-t border-gray-800 pt-3" aria-labelledby="privateMemoryTitle">
              <h4 id="privateMemoryTitle" class="text-xs font-semibold text-emerald-200" data-i18n="privateMemoryTitle">Личная память</h4>
              <details id="privateMemoryHelp" class="memory-help text-[10px] text-gray-500"><summary class="cursor-pointer select-none py-1" data-i18n="privateMemoryHelpSummary">О личной памяти</summary><p class="pl-2 pb-1 leading-relaxed text-gray-400" data-i18n="privateMemoryHelp">Хранится локально в IndexedDB этого браузера. По умолчанию заметки не передаются в запросы; разрешение можно включить ниже.</p></details>
              <div class="flex gap-1"><input id="memoryInput" type="text" maxlength="500" placeholder="Личный факт для локальной модели" class="min-w-0 flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-xs"><button type="button" data-action="save-memory" class="bg-blue-700 hover:bg-blue-600 px-2 rounded text-xs" aria-label="Сохранить в личную память">+</button></div>
              <div id="memoryBox" class="bg-gray-900 p-2 rounded text-xs text-gray-300 max-h-36 overflow-y-auto border border-gray-800" aria-live="polite">Нет личных заметок.</div>
            </section>
            <label class="flex items-start gap-2 border-t border-gray-800 pt-3 text-[10px] leading-relaxed text-gray-300"><input id="privateMemoryContextToggle" type="checkbox" class="mt-0.5"><span data-i18n="privateMemoryContextLabel">Разрешить использовать заметки личной памяти в контексте запросов.</span></label>
          </div>
        </details>
      </div>
    </details>
    <section id="projectPanel" class="sidebar-card mx-3 my-1.5 rounded-xl border border-gray-800 p-2" aria-label="Проекты">
      <div id="projectNavigation" class="space-y-1.5">
        <button id="projectNavToggle" type="button" data-action="toggle-project-navigation" aria-expanded="false" aria-controls="projectNavigationList" class="w-full flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm font-semibold project-nav-heading">
          <span class="flex items-center gap-2"><svg aria-hidden="true" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5h7l2 2H21v8.5H3z"/><path d="M3 7.5V6a1.5 1.5 0 0 1 1.5-1.5H9l2 3"/></svg><span data-i18n="projectsTitle">Проекты</span></span><span id="projectNavChevron" aria-hidden="true">⌄</span>
        </button>
        <button type="button" data-action="open-project-create" class="sidebar-create-project w-full rounded-lg border border-cyan-800 bg-cyan-950/40 px-3 py-2 text-sm font-semibold"><span aria-hidden="true" class="mr-1">+</span><span data-i18n="createProject">Создать проект</span></button>
        <div id="projectNavigationList" class="hidden pl-1 space-y-1" aria-label="Список проектов"></div>
      </div>
      <details id="projectlessGroup" class="mt-1 rounded-lg border border-gray-800 projectless-group">
        <summary class="flex items-center gap-2 rounded-lg px-2 py-2 text-xs cursor-pointer select-none">
          <span aria-hidden="true">○</span><span data-i18n="noProjectNav">Без проекта</span><span id="projectlessChatCount" class="ml-auto text-[10px] text-gray-500">0</span>
        </summary>
        <div class="px-2 pb-2"><button type="button" data-action="projectless-nav" class="w-full rounded-lg border border-gray-700 px-2 py-2 text-left text-xs text-gray-300" data-i18n="showUnassignedChats">Показать личные чаты</button></div>
      </details>
    </section>
    <details id="chatSection" open class="sidebar-card mx-3 my-1.5 rounded-xl border border-gray-800 p-2">
      <summary class="chat-section-summary flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm font-semibold cursor-pointer select-none" aria-controls="chatList">
        <span>💬 <span id="chatSectionTitle" data-i18n="chatsTitle">Чаты</span></span>
        <span class="flex items-center gap-1.5"><span id="projectStatusLine" class="sidebar-inline-status" role="status" aria-live="polite">Личный</span><span id="chatSectionCount" class="text-[10px] text-gray-500">0</span></span>
      </summary>
      <button id="chatListNewButton" type="button" data-action="new-chat" class="sidebar-create-chat mt-1 w-full rounded-lg border border-blue-500/30 bg-blue-600/15 hover:bg-blue-600/25 py-2.5 text-sm font-semibold text-blue-100"><span aria-hidden="true" class="mr-1">+</span><span data-i18n="newPersonalChat">Новый личный чат</span></button>
      <button id="chatListBack" type="button" data-action="chat-list-back" class="hidden mt-1 w-full rounded-lg border border-gray-700 px-3 py-2 text-left text-xs text-gray-300" aria-label="Вернуться ко всем чатам">← Все чаты</button>
      <button id="restoreLastClosedChat" type="button" data-action="restore-last-closed-chat" class="hidden mt-1 w-full rounded-lg border border-gray-700 px-3 py-2 text-left text-xs text-gray-300">↶ Восстановить последний закрытый чат</button>
      <div class="my-1 flex items-center justify-between gap-2 px-1">
        <label for="chatSortSelect" class="text-[10px] text-gray-500">Порядок</label>
        <select id="chatSortSelect" class="min-h-8 max-w-[65%] rounded-lg border border-gray-700 bg-gray-900 px-2 py-1 text-[11px] text-gray-300" aria-label="Порядок чатов">
          <option value="activity">Последняя активность</option><option value="created">Дата создания</option>
        </select>
      </div>
      <div id="chatList" class="overflow-y-auto p-1 space-y-1.5 text-sm" aria-label="Список чатов"></div>
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
              <div class="flex gap-1"><input id="projectMemoryInput" type="text" maxlength="600" class="min-w-0 flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs" placeholder="Факт, решение или ограничение"><button type="button" data-action="add-project-memory" class="rounded-lg border border-gray-700 px-2 text-xs" aria-label="Добавить факт">+</button></div>
              <div id="projectMemoryBox" class="max-h-24 overflow-y-auto text-[11px] text-gray-400 space-y-1"></div>
              <section id="projectSourcesSection" class="rounded-xl border border-gray-800 p-3 space-y-1.5" aria-labelledby="projectSourcesTitle">
                <h3 id="projectSourcesTitle" class="text-xs font-semibold" data-i18n="projectSourcesTitle">Источники проекта</h3>
                <p class="text-[10px] leading-relaxed text-gray-400" data-i18n="projectSourcesUnavailable">Управление источниками пока не подключено: gateway умеет индексировать, удалять и искать документы в рамках scope, но не предоставляет API списка источников. Вложения чата не считаются сохранёнными источниками проекта.</p><div class="roadmap-ticker mt-2" aria-label="Раздел в разработке"><span class="roadmap-ticker-track" aria-hidden="true" data-i18n="projectSourcesRoadmap">1ИV3ИT10И · Управление источниками проекта — в разработке</span></div><p class="roadmap-note" data-i18n="projectSourcesRoadmapNote">Раздел и его место в проекте уже предусмотрены; управление списком станет доступно после появления API источников. Пока никаких действий с источниками не имитируется.</p><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button>
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
        <button type="button" data-action="create-project" class="rounded-lg border border-cyan-700 bg-cyan-900/70 px-4 py-2 text-xs font-semibold text-cyan-100"><span aria-hidden="true" class="mr-1">+</span><span data-i18n="createProject">Создать проект</span></button>
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
        <button type="button" data-action="connect-aservi" aria-controls="aserviStatus" class="w-full min-h-[44px] rounded-xl border border-cyan-700 bg-cyan-950/60 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-900">Проверить и подключить</button>
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
          <details class="settings-category settings-category-appearance rounded-xl border border-gray-700" data-settings-category="appearance">
            <summary class="settings-category-summary" data-i18n="advancedAppearanceCategory">Внешний вид и удобство</summary>
            <div class="settings-category-content space-y-3">
<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-gray-800 pb-3">
            <select id="uiLanguage" class="hidden" aria-hidden="true" tabindex="-1"><option value="ru">Русский</option><option value="en">English</option></select>
            <label class="text-[11px] text-gray-400"><span data-i18n="themeLabel">Тема</span><select id="uiTheme" class="advanced-control mt-1 w-full bg-gray-900 rounded border border-gray-700"><option value="dark" data-i18n="themeDark">Тёмная</option><option value="light" data-i18n="themeLight">Светлая</option></select></label>
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
            </div>
          </details>
          <details class="settings-category settings-category-context rounded-xl border border-gray-700" data-settings-category="context">
            <summary class="settings-category-summary" data-i18n="advancedContextCategory">Поиск и инструкции</summary>
            <div class="settings-category-content space-y-3">
<details id="searchToolsSettings" class="rounded-xl border border-gray-700"><summary class="cursor-pointer select-none px-3 py-2.5 text-xs font-semibold">Инструменты и веб-поиск</summary><div class="px-3 pb-3 space-y-2"><p class="text-[10px] leading-relaxed text-gray-400" data-i18n="tavilyDecisionNote">Решение о подключении Tavily ещё не принято. Сначала оцениваем текущий поиск и его качество; ключ можно оставить пустым.</p><div class="flex gap-2"><input type="password" id="tavilyKey" aria-label="Ключ Tavily" autocomplete="off" class="min-w-0 flex-1 p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none advanced-field" placeholder="ключ Tavily"><button type="button" data-action="paste-tavily-key" class="rounded-lg border border-gray-700 px-2 text-xs" aria-label="Вставить ключ Tavily">↓</button></div></div></details>
       <label for="systemPromptInput" data-i18n="systemPromptLabel" class="block text-xs text-gray-400">Системный промпт</label>
       <p class="text-[10px] leading-relaxed text-gray-400" data-i18n="systemPromptEmptyNote">Глобальный системный промпт пуст по умолчанию. Добавляй общие инструкции только если они действительно нужны.</p>
       <div class="prompt-editor"><textarea id="systemPromptInput" rows="4" readonly class="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 text-sm outline-none resize-y" placeholder="Свои правила для всех запросов"></textarea><button type="button" id="editSystemPrompt" data-action="edit-system-prompt" class="prompt-pencil" aria-pressed="false" aria-label="Редактировать системный промпт" title="Редактировать">✎</button></div><p id="promptEditHint" class="sr-only" aria-live="polite"></p>
       <label class="flex items-start gap-2 text-xs text-gray-300 mt-2"><input id="allowCrossProviderFallback" type="checkbox" class="mt-0.5 rounded bg-gray-800 border-gray-700"><span><strong>Разрешить резерв у другого провайдера</strong><span class="block text-[11px] leading-relaxed text-amber-200/80">По умолчанию выключено. При включении текст запроса и контекст могут передаваться другому сервису. Сначала система пробует модели выбранного провайдера.</span></span></label>
      <p class="text-[10px] leading-relaxed text-gray-500">Ключи хранятся в этом браузере. Резервный провайдер может получить текст запроса и контекст.</p>
            </div>
          </details>
          <details class="settings-category settings-category-profile rounded-xl border border-gray-700" data-settings-category="profile">
            <summary class="settings-category-summary" data-i18n="advancedProfileCategory">Профиль и резервные копии</summary>
            <div class="settings-category-content space-y-3">
<div class="grid grid-cols-2 gap-2">
        <button type="button" data-action="export-settings-profile" class="bg-gray-700 hover:bg-gray-600 py-2 px-2 rounded text-xs text-gray-200">Скачать профиль настроек</button>
        <button type="button" data-action="import-settings-profile" class="bg-gray-700 hover:bg-gray-600 py-2 px-2 rounded text-xs text-gray-200">Импорт профиля</button>
      </div>
      <input type="file" id="settingsProfileFile" class="hidden" accept="application/json,.json">
      <p class="text-[10px] leading-relaxed text-gray-500">Профиль переносит настройки, но намеренно не содержит API-ключи и токены. Импорт не меняет уже сохранённые секреты.</p>
            </div>
          </details>
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
    <div class="flex justify-end">
      <button id="deepResearchStudioButton" type="button" data-action="open-research-studio" data-i18n="deepResearchStudioButton" class="rounded-lg px-2 py-1 text-[11px] text-cyan-300 hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">⌕ Настроить исследование</button>
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
        <div class="toolbar-menu-panel toolbar-menu-panel-right function-menu-content">
          <p class="toolbar-menu-group-label" data-i18n="functionMenuWorkGroup">Работа с задачей</p>
          <button type="button" data-action="open-function-panel" data-function="agents" class="toolbar-menu-option" data-i18n="functionAgents">🧭 Агенты и структурированный разбор</button>
          <button type="button" data-action="open-function-panel" data-function="skills" class="toolbar-menu-option" data-i18n="functionSkills">🧩 Профиль и навыки</button>
          <p class="toolbar-menu-group-label" data-i18n="functionMenuResearchGroup">Исследование и источники</p>
          <label class="roadmap-pause-control"><input id="functionsRoadmapPause" type="checkbox"><span data-i18n="functionRoadmapPause">Остановить бегущие строки</span></label>
          <div class="function-roadmap-items">
            <div class="function-roadmap-item"><strong data-i18n="functionMenuDeepResearch">Глубокое исследование 2.0</strong><div class="roadmap-ticker" aria-label="Планируемая функция"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Evidence graph, source collections, claim verification and research runs</span></div><p class="roadmap-note" data-i18n="functionMenuDeepResearchNote">Студия исследования уже доступна в блоке «Тщательно»; расширенный конвейер, коллекции источников и восстановление долгих задач ещё проектируются.</p><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></div>
          </div>
          <p class="toolbar-menu-group-label" data-i18n="functionMenuCreateGroup">Создание и преобразование</p>
          <div class="function-roadmap-items">
            <div class="function-roadmap-item"><strong data-i18n="functionMenuLocalFiles">Локальные файлы и папки</strong><div class="roadmap-ticker" aria-label="Планируемая функция"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Каталог локальных источников и папок</span></div><p class="roadmap-note" data-i18n="functionMenuLocalFilesNote">Выбор файла в чате уже доступен; постоянная библиотека, разрешённые папки и повторная индексация ещё проектируются.</p><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></div>
            <div class="function-roadmap-item"><strong data-i18n="functionMenuConverters">Конвертеры и извлечение</strong><div class="roadmap-ticker" aria-label="Планируемая функция"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Страницы, изображения, PDF и медиа → структурированные данные</span></div><p class="roadmap-note" data-i18n="functionMenuConvertersNote">Часть извлечения документов существует; универсальная конвертация, OCR, screenshot-to-code и VERT-подобные профили не подключены.</p><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></div>
            <div class="function-roadmap-item"><strong data-i18n="functionMenuKnowledgeSkill">Знания → навык или агент</strong><div class="roadmap-ticker" aria-label="Планируемая функция"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Knowledge-to-Skill / Knowledge-to-Agent</span></div><p class="roadmap-note" data-i18n="functionMenuKnowledgeSkillNote">Будущий конвейер с происхождением источников, лицензией, проверкой инъекций, человеческим подтверждением и версиями.</p><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></div>
            <div class="function-roadmap-item"><strong data-i18n="functionMenuMedia">Аудио, изображения и видео</strong><div class="roadmap-ticker" aria-label="Планируемая функция"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Генерация, монтаж и мультимодальные конвейеры</span></div><p class="roadmap-note" data-i18n="functionMenuMediaNote">Локальная транскрипция и озвучивание частично существуют; генерация изображений/видео и полноценный потоковый голос не включены.</p><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></div>
          </div>
          <p class="toolbar-menu-group-label" data-i18n="functionMenuConnectionsGroup">Подключения</p>
          <button type="button" data-action="open-function-panel" data-function="connectors" class="toolbar-menu-option" data-i18n="functionConnectors">🔌 Интеграции</button>
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
    <p id="networkStatus" class="network-status hidden" role="status" aria-live="polite" aria-atomic="true"></p>
    <div class="flex gap-2 items-end" id="inputArea">
      <button id="contextPickerButton" type="button" data-action="toggle-request-context" aria-label="Выбрать контекст для следующего запроса" aria-expanded="false" title="Контекст этого запроса: выбрать проекты" class="composer-tool rounded-xl border border-gray-700 px-3 py-2.5 relative">◎<span id="requestContextCount" class="hidden absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-bold items-center justify-center px-1">0</span></button>
      <button type="button" data-action="attach-text-file" id="attachTextButton" aria-label="Добавить вложение" title="Выбрать фото, видео или файл любого формата" aria-expanded="false" class="composer-tool rounded-xl border border-gray-700 px-3 py-2.5">+</button>
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
  <div id="toast" class="toast hidden" role="status" aria-live="polite" aria-atomic="true" tabindex="0"></div>
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
        <section class="function-config-group rounded-xl border border-gray-800 p-3 space-y-3" aria-labelledby="agentModeGroupTitle">
          <h3 id="agentModeGroupTitle" class="function-config-group-title" data-i18n="agentModeGroupTitle">Режим выполнения</h3>
          <label class="flex items-start gap-2 rounded-xl border border-gray-800 p-3 text-sm"><input type="checkbox" id="agentModeControl" class="mt-1 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-0"><span><strong class="block" data-i18n="agentModeOption">Использовать структурированный разбор</strong><span class="mt-1 block text-[11px] leading-relaxed text-gray-500" data-i18n="agentModeHelp">Четыре последовательных этапа на выбранной модели.</span></span></label>
        </section>
        <section class="function-config-group rounded-xl border border-gray-800 p-3 space-y-3" aria-labelledby="agentBlueprintGroupTitle">
          <h3 id="agentBlueprintGroupTitle" class="function-config-group-title" data-i18n="agentBlueprintGroupTitle">Черновик команды</h3>
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
        </section>
        <details id="agentBlueprintLibrary" class="agent-settings-category">
          <summary data-i18n="agentBlueprintLibraryTitle">Сохранённые черновики команд</summary>
          <section class="agent-future-section space-y-2">
            <p data-i18n="agentBlueprintLibraryHelp">Сохраняй повторно используемые планы состава команды в этом браузере. Это не запускает агентов и не синхронизируется между устройствами.</p>
            <label class="block text-xs font-semibold" for="agentBlueprintSelect" data-i18n="agentBlueprintSelectLabel">Мои черновики</label>
            <select id="agentBlueprintSelect" class="agent-blueprint-select advanced-control w-full rounded-lg border border-gray-700 bg-gray-900">
              <option value="" data-i18n="agentBlueprintSelectPlaceholder">Выбери черновик</option>
            </select>
            <div class="agent-blueprint-actions">
              <button type="button" id="agentBlueprintApply" class="agent-blueprint-action" data-i18n="agentBlueprintApply" disabled>Применить к этому чату</button>
              <button type="button" id="agentBlueprintDelete" class="agent-blueprint-action" data-i18n="agentBlueprintDelete" disabled>Удалить выбранный</button>
            </div>
            <label class="block text-xs font-semibold" for="agentBlueprintName" data-i18n="agentBlueprintNameLabel">Название нового черновика</label>
            <input id="agentBlueprintName" type="text" maxlength="60" autocomplete="off" class="agent-blueprint-name advanced-control rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs" data-i18n-placeholder="agentBlueprintNamePlaceholder" placeholder="Например, Исследование продукта">
            <button type="button" id="agentBlueprintSave" class="agent-blueprint-action w-full" data-i18n="agentBlueprintSave">Сохранить текущий черновик</button>
            <p class="text-[10px] leading-relaxed text-gray-500" data-i18n="agentBlueprintStorageNote">До 20 шаблонов хранятся только в локальном браузере; экспорт и облачная синхронизация не включены.</p>
            <button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="blueprint-only" data-i18n="roadmapDetailsButton">Подробнее</button>
          </section>
        </details>
        <div id="agentCustomFields" class="hidden space-y-2 rounded-xl border border-gray-800 p-3">
          <textarea id="agentTeamCustomScenario" maxlength="1000" rows="2" class="advanced-control w-full resize-y rounded-lg border border-gray-700 bg-gray-900" placeholder="Опиши сценарий команды"></textarea>
          <textarea id="agentCustomRoles" maxlength="1500" rows="3" class="advanced-control w-full resize-y rounded-lg border border-gray-700 bg-gray-900" placeholder="Роли и обязанности, по одной на строку"></textarea>
        </div>
        <p class="rounded-lg border border-amber-900/50 bg-amber-950/20 p-2 text-[10px] leading-relaxed text-amber-100/80" data-i18n="agentRuntimeBoundary">Параметры ниже сохраняют черновик команды для этого чата. Runtime сейчас выполняет четыре фиксированных этапа на одной выбранной модели; независимые процессы агентов не запускаются.</p>
        <label class="roadmap-pause-control"><input id="agentRoadmapPause" type="checkbox"><span data-i18n="functionRoadmapPause">Остановить бегущие строки</span></label>
        <div class="agent-future-groups space-y-2">
          <details class="agent-settings-category">
            <summary data-i18n="agentCategoryUsage">Применение и роли</summary>
            <section class="agent-future-section space-y-2"><h3 data-i18n="agentUseCasesTitle">Способы применения</h3><p data-i18n="agentUseCasesText">Текущий конвейер подходит для сложного исследования, проверки источников, планирования разработки и критики решения. Это последовательные роли одной модели, а не параллельные исполнители.</p></section>
            <section class="agent-future-section space-y-2"><h3 data-i18n="agentProfilesTitle">Мои агенты и профили</h3><p data-i18n="agentProfilesText">Реестр профилей агентов ещё не подключён. Здесь будут отдельные конфигурации с версией, назначением, модельной политикой, областью данных и привязками навыков; сохранённый Team Blueprint не является профилем агента.</p><div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Agent profiles, versions and capability bindings</span></div><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></section>
            <section class="agent-future-section space-y-2"><h3 data-i18n="agentRolesTitle">Профессии и каталог ролей</h3><p data-i18n="agentRolesText">В проектной карте описаны 64 логические профессии и роли. Это каталог проектирования, не 64 работающих агента и не ограничение будущего числа ролей.</p><div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Реестр профессий, специализаций и контрактов ролей</span></div><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></section>
          </details>
          <details class="agent-settings-category">
            <summary data-i18n="agentCategoryExecution">Оркестрация, модели и ресурсы</summary>
            <section class="agent-future-section space-y-2"><h3 data-i18n="agentOrchestrationTitle">Режимы оркестрации</h3><ul class="agent-capability-list"><li data-i18n="agentOrchestrationCurrent">Доступно: прямой ответ и последовательный четырёхэтапный разбор.</li><li data-i18n="agentOrchestrationFuture">В проектировании: независимые субагенты, параллельные команды, fan-out/fan-in и долговременные задания с восстановлением.</li></ul><div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Параллельные workers, очередь, checkpoints и отмена</span></div><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></section>
            <section class="agent-future-section space-y-2"><h3 data-i18n="agentModelsTitle">Модели и ресурсы</h3><p data-i18n="agentModelsText">Будущий реестр малых моделей: классификация, извлечение, reranking, краткое резюме, memory candidates и синтез навыков. Выбор — только по проверенному ID, лицензии, digest и результатам RU/EN/TH eval.</p><div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · SLM registry, benchmark, VRAM/RAM и latency budgets</span></div><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></section>
          </details>
          <details class="agent-settings-category">
            <summary data-i18n="agentCategoryPermissions">Инструменты и разрешения</summary>
            <section class="agent-future-section space-y-2"><h3 data-i18n="agentPermissionsTitle">Инструменты и разрешения</h3><p data-i18n="agentPermissionsText">Каждая будущая роль получает только явно выданные capabilities: файлы, сеть, память, shell и внешние действия не наследуются от названия роли или навыка.</p><div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Capability scopes, approval gates и audit trail</span></div><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></section>
          </details>
          <details class="agent-settings-category">
            <summary data-i18n="agentCategoryTasksHistory">Задачи и история</summary>
            <section class="agent-future-section space-y-2"><h3 data-i18n="agentTasksHistoryTitle">Запуски и история</h3><p data-i18n="agentTasksHistoryText">Этот раздел станет рабочим после появления durable AgentRun API. До этого здесь не отображаются фиктивные очереди, запуски, run ID или результаты.</p><div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Run IDs, queue, approvals, artifacts and recovery</span></div><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button></section>
          </details>
        </div>
        <p class="roadmap-note" data-i18n="agentRoadmapNote">Бегущие строки обозначают проектируемые возможности, а не фоновые процессы. Уменьшение движения системы отключает анимацию.</p>
        <p id="agentConfigSummary" class="text-[10px] text-gray-500" aria-live="polite"></p>
      </section>
      <section id="skillFunctionSettings" class="hidden space-y-3">
        <section class="function-config-group rounded-xl border border-gray-800 p-3 space-y-3" aria-labelledby="skillTaskProfileTitle">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 id="skillTaskProfileTitle" class="function-config-group-title" data-i18n="skillTaskProfileTitle">Профиль текущего чата</h3>
            <span class="rounded-full border border-emerald-800/70 bg-emerald-950/30 px-2 py-1 text-[10px] font-semibold text-emerald-200" data-i18n="skillScopeBadge">Работает · только этот чат</span>
          </div>
          <label for="skillPresetSelect" class="block text-xs font-semibold" data-i18n="skillPresetLabel">Профиль задачи</label>
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
            <label class="block text-[11px] text-gray-400"><span data-i18n="skillGoalLabel">Задача по ответам</span>
              <select id="skillGoalSelect" class="advanced-control mt-1 w-full rounded-lg border border-gray-700 bg-gray-900"><option value="planning">Планирование</option><option value="research">Исследование</option><option value="code-review">Код и ревью</option><option value="data-analysis">Анализ данных</option><option value="agent-systems">Системы агентов</option><option value="multimodal">Мультимодальные задачи</option><option value="custom">Свой вариант</option></select>
            </label>
            <label class="block text-[11px] text-gray-400"><span data-i18n="skillOutputLabel">Формат результата</span>
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
        <details id="skillLibraryDisclosure" class="agent-settings-category">
          <summary data-i18n="skillLibraryTitle">Библиотека навыков · планируется</summary>
          <section class="agent-future-section space-y-2">
            <p data-i18n="skillLibraryText">Общая библиотека Skill packages пока не подключена. Текущий профиль хранится в настройках чата; импортированные пакеты не запускаются.</p>
            <p class="font-semibold text-gray-300" data-i18n="skillLibraryWorkflow">Будущий процесс: источник → извлечение → проверка происхождения и лицензии → черновик → тесты → проверка безопасности → ручное утверждение → версия.</p>
            <p data-i18n="skillLibrarySafety">Импорт не будет автоматически давать доступ к файлам, сети, памяти, shell или внешним действиям. Запуск скриптов требует отдельного runtime и разрешений.</p>
            <label class="roadmap-pause-control"><input id="skillRoadmapPause" type="checkbox"><span data-i18n="functionRoadmapPause">Остановить бегущие строки</span></label>
            <div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Каталог, импорт, проверка, версии, сравнение и откат Skill packages</span></div>
            <div class="roadmap-ticker"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Книга / документ / сайт / репозиторий → Skill или Agent blueprint</span></div><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-i18n="roadmapDetailsButton">Подробнее</button>
          </section>
        </details>
      </section>
      <section id="connectorFunctionStatus" class="hidden rounded-xl border border-gray-800 bg-gray-900/60 p-3 text-sm leading-relaxed text-gray-300"><p data-i18n="functionConnectorsDescription">Показываем только реально подключённые источники. Внешние коннекторы пока не подключены; они не будут имитироваться переключателями.</p><div class="roadmap-ticker mt-3" aria-label="Планируемое улучшение"><span class="roadmap-ticker-track" aria-hidden="true">1ИV3ИT10И · Интеграции с контролируемыми разрешениями</span></div><p class="roadmap-note">Подключение источников появится только после проверки прав, границ данных и реального соединения. Анимация декоративная и не означает, что сервис уже выполняет работу.</p><button type="button" class="roadmap-details-button" data-action="open-roadmap-details" data-roadmap-status="in-development" data-roadmap-title="Интеграции" data-i18n="roadmapDetailsButton">Подробнее</button></section>
      <footer class="flex justify-end border-t border-gray-800 pt-3"><button type="button" data-action="close-function-panel" data-i18n="functionPanelClose" class="rounded-xl border border-gray-700 px-4 py-2 text-sm">Закрыть</button></footer>
    </section>
  </div>
  <div id="roadmapDetailsModal" class="hidden fixed inset-0 z-[90] bg-black/80 p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="roadmapDetailsTitle" aria-describedby="roadmapDetailsDescription">
    <section class="roadmap-details-dialog w-full max-w-lg max-h-[88dvh] overflow-y-auto rounded-2xl border border-gray-700 bg-gray-950 p-4 sm:p-5 shadow-2xl space-y-4">
      <header class="flex items-start justify-between gap-3">
        <div class="min-w-0"><p class="text-[10px] font-semibold uppercase tracking-wide text-cyan-300"><span data-i18n="roadmapDetailsStatusLabel">Статус</span> · <span id="roadmapDetailsStatus" data-status="in-development">В разработке</span></p><h2 id="roadmapDetailsTitle" class="mt-1 font-bold text-base">Карточка возможности</h2></div>
        <button type="button" data-action="close-roadmap-details" class="shrink-0 rounded-lg px-2 py-1 text-gray-400 hover:text-white" aria-label="Закрыть" data-i18n-aria-label="roadmapDetailsClose">✕</button>
      </header>
      <p id="roadmapDetailsDescription" class="text-sm leading-relaxed text-gray-300"></p>
      <p id="roadmapDetailsBoundary" class="rounded-lg border border-gray-800 bg-gray-900/70 p-3 text-[11px] leading-relaxed text-gray-400" data-i18n="roadmapDetailsBoundary">Это описание планируемой возможности. Окно не запускает операцию, не меняет настройки и не выдаёт разрешения.</p>
      <footer class="flex justify-end border-t border-gray-800 pt-3"><button type="button" data-action="close-roadmap-details" class="rounded-xl border border-gray-700 px-4 py-2 text-sm" data-i18n="roadmapDetailsClose">Закрыть</button></footer>
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
