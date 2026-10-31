# aLandi Landing UI v2.0 — implementation ledger

**Owner priority source:** `docs/V1_UI_FINALIZATION_RU.md`, sections 8.1–8.17, dated 2026-10-31.  
**Implementation PR:** [#131 — aLandi Landing UI v2.0](https://github.com/DorpNay/skills-github-pages/pull/131).  
**Baseline:** V1 remains in `main`. All V2 interface work stays on PR #131; do not merge or deploy until the owner explicitly requests it.

## Scope and constraints

- Keep the approved client stack: `index.md` (static HTML/CSS/JavaScript) + Jekyll/GitHub Pages; use existing FastAPI gateway contracts only where already supported.
- No framework migration, new runtime, new dependency, new backend route, hosted service or provider integration without explicit approval.
- Preserve local-first storage, per-project boundaries, explicit user consent, provider isolation, secret handling, keyboard access and reduced-motion behavior.
- Never render a control for a capability that does not exist. For project sources, first establish a real source contract and only then expose supported operations.
- V1 files in main are the stable baseline. This PR may retain its earlier `/landing/` accessibility changes, but its main product scope is the root browser client `/`.

## Audit snapshot — current main / PR #131 baseline

| Requirement | Observed implementation | Gap / implementation direction | Status |
|---|---|---|---|
| **8.1 Sidebar, memory, projects, chats** | Memory status precedes the title; shared facts → personal facts → private-context opt-in; explanations collapsed; sidebar close preserves project/chat disclosure state; project-filtered chats, explicit project chat creation, per-project gear, separate create dialog, unchanged current-chat membership and local last-closed-chat restore. | Execute accordion/restore regressions in Chromium; refine spacing, keyboard navigation and real-device behavior. | [~] |
| **8.2 Typography/header/main surface** | Dedicated wordmark/chat-title styling, shared system font stack, compact theme/language group, clock and mode controls; mobile control targets use consistent touch sizing. | Visual review across breakpoints and final clock/header proportion check remain. | [~] |
| **8.3 Settings/providers** | Cloud remains exclusive; opening third-party providers closes Cloud; provider and additional-settings disclosures can remain open together. | Execute E2E and review keyboard/narrow-screen behavior. | [~] |
| **8.4 Tavily/system prompt** | Tavily key remains in a web-tools disclosure; system prompt is global `localStorage` state and is normalized against the legacy built-in prompt. | Verify the empty-by-default behavior against `DEFAULT_SYSTEM` and migration; decide Tavily only after comparing the existing keyless search fallback and live adapter requirements. No premature deletion. | [~] |
| **8.5 Living notes** | Source document already says new owner UI requirements belong in the matching subsection and statuses require code/test evidence. | Keep the source checklist as the owner requirements record; implementation status and evidence live in this ledger and PR. | [x] |
| **8.6 Navigation and visual hierarchy** | Browser history now tracks nested project filters and modal depth; Back restores the prior project filter or closes the top modal; Escape follows the same stack. | Execute browser Back/Escape regressions and inspect forward-navigation behavior. | [~] |
| **8.7 Project settings / Sources** | Project settings retain name/instructions/local memory/scope/import/export/delete; Sources shows a truthful unsupported-state explanation; project settings can explicitly hand project context to an existing chat. | Gateway still lacks a source-list API; do not add CRUD until project-scoped list/delete semantics exist. | [~] |
| **8.8 Message action icons** | Copy and speech controls remain available in the expanded viewer; user messages expose copy but not speech; controls carry accessible names/tooltips and 44px hit targets. | Execute compact/expanded viewer regressions and verify speech/copy on target devices. | [~] |
| **8.9 Backdrop lifecycle** | Modal stack covers settings, project settings/create, message viewer, chat actions, research, function panel and trace; browser Back/Escape, focus return, Tab trap, body scroll lock and backdrop close share a consistent lifecycle. | Run repeated open/close, outside-click and focus/scroll regressions in Chromium; inspect native mobile behavior. | [~] |
| **8.10 Control sizing system** | Shared control sizing and typography rules normalize compact controls, menu options, composer tools, header actions, chat creation and icon buttons while retaining 44px touch targets. | Run viewport snapshots and finish remaining one-off controls. | [~] |
| **8.11 Theme/language group** | Theme and language controls are grouped in the header, persistent and sized for touch/keyboard use. | Narrow viewport and keyboard review. | [~] |
| **8.12 Remove “Серверная память (Эксперимент)”** | Deprecated feature UI, per-chat/server opt-in and stale client dispatch paths are absent; independent local/private/shared/project-local memory remains. | Audit gateway/backend route ownership and legacy migration references before deleting backend code. | [~] |
| **8.13 Explicit project context handoff** | Project settings list existing chats and queue the selected project's context for the chosen chat's next request; no new chat or project-membership change; five-project cap and one-shot consumption retained. Pending handoff is session-only until sent. | Execute non-current-chat/no-cross-chat/one-shot E2E and decide whether pending handoff should survive reload. | [~] |
| **8.14 Touch selection** | Targeted user-select/-webkit-user-select/touch-action rules keep controls from selecting the whole interface while message text and inputs remain selectable; horizontal sidebar swipe is separated from vertical scrolling. | Native iOS Safari long-press, VoiceOver and gesture tests remain. | [~] |
| **8.15 Status/progress** | Status and toast elements expose neutral/info/success/warning/error data states with restrained semantic colors; status text and ticker are centered; no synthetic progress added. | Execute status/reduced-motion checks and review contrast in both themes. | [~] |
| **8.16 Button typography/icon-first** | Shared font/line-height/spacing rules; expanded-view copy/speech actions are icon-first with accessible labels and tooltips; ambiguous actions retain text. | Normalize remaining one-off buttons and verify tooltips/target sizes across all panels. | [~] |
| **8.17 Adjustable text readability** | Persistent text scale and standard/high-contrast preference have a live preview/reset and apply to light/dark themes; high contrast also raises secondary/disabled/link/error/status text. | Run contrast checks for all states and confirm readability on actual devices. | [~] |

## Acceptance and test plan

1. Keep all existing V1 regression tests unless a test asserts behavior explicitly superseded by owner requirements 8.1–8.17; replace those assertions with the new acceptance contract rather than simply deleting coverage.
2. Add Playwright coverage for:
   - sidebar order, accordion defaults/state retention, projectless/project chat filtering, project gear actions, back-to-general navigation and swipe-close;
   - mutually exclusive settings sections and Cloud/provider separation;
   - global empty system prompt migration and no implicit project-memory injection;
   - project-source UI only when a real scoped source contract exists;
   - icon actions in compact and expanded message views;
   - modal close paths, focus restoration, scroll lock and rapid repeated cycles;
   - compact control geometry, header theme/language controls, touch selection;
   - status colors/centering/reduced motion and user readability preferences in both themes.
3. Run focused Chromium tests per slice, then the full Quality workflow (Security, Integrity, Context, Jekyll, static analysis, Chromium), Freshness, Provenance and Graphify on the exact PR head.
4. Manual gates: real iPhone Safari, VoiceOver, long-press/gesture behavior, safe-area and virtual keyboard. Do not claim these from desktop Chromium.
5. No merge, retarget to a release branch, or deployment without explicit owner approval.

## Work sequence

- [x] Rename PR #131 and reserve it as the sole V2 UI workstream; keep V1 in main.
- [~] Complete source-code and gateway-contract audit for 8.1–8.17.
- [~] Implement shared UI tokens, selected modal/focus paths, accessible message actions and touch ergonomics.
- [~] Implement sidebar/projects/chats and memory UX, including project-filtered chats and explicit request context.
- [~] Implement header theme/language controls and Cloud/provider/additional-settings grouping.
- [~] Remove deprecated server-memory UI and client dispatch entry points; preserve independent local/private/shared/project-local memory.
- [~] Resolve project Sources contract: show an explicit unsupported-state explanation; do not present fake source-management actions.
- [~] Implement initial status, button and text-readability system.
- [~] Update superseded E2E tests and add focused V2 regression coverage.
- [ ] Execute focused Chromium tests and exact-head CI; PR remains unmerged.
- [ ] Manual device review (iPhone Safari, VoiceOver, long-press, safe-area and virtual keyboard).

## Current implementation state — 2026-10-31

| Requirement | Verified in branch source | Remaining gap | Status |
|---|---|---|---|
| 8.1 Sidebar/memory/projects/chats | Shared memory before personal memory; private-context opt-in last; sidebar closes only memory disclosures; project/chat accordion state retained; create dialog separate; existing chat membership preserved; last-closed-chat restore from local storage. | Execute accordion/restore E2E and review spacing/keyboard navigation. | [~] |
| 8.2 Typography/header | Wordmark and chat title have dedicated styling; theme/language grouped; compact clock breakpoints and header controls. | Final responsive/visual iteration and font-system review. | [~] |
| 8.3 Settings/providers | Cloud, third-party providers and additional settings are separate disclosures. Cloud closes peer groups; peer groups cannot open while Cloud is open. | Execute E2E; review keyboard and narrow-screen behavior. | [~] |
| 8.4 Tavily/system prompt | Global prompt defaults to empty; Tavily remains under web-tools settings with a documented decision note. | Complete current search-path audit before any removal or change. | [~] |
| 8.5 Living notes | Owner checklist remains source of requirements; this ledger tracks implementation separately. | Keep statuses evidence-based. | [x] |
| 8.6 Navigation | Project filtering, back-to-unassigned and per-project settings are present. | Browser history/back behavior across nested panels remains incomplete. | [~] |
| 8.7 Project sources | Project settings show a clear unsupported-state explanation: gateway can index/delete/search scoped documents but has no source-list API; chat attachments are not misrepresented as saved project sources. | Implement CRUD only after a real project-scoped source-list contract exists. | [~] |
| 8.8 Message actions | Message actions use accessible labels and touch-sized controls; viewer close path has focus-return assertions. | Finish icon consistency/tooltips and verify every compact/expanded action. | [~] |
| 8.9 Backdrop lifecycle | Settings backdrop and project/message modal keyboard/focus paths have targeted E2E assertions. | Audit every dialog, scroll lock, backdrop transition and repeated open/close cycle. | [~] |
| 8.10 Control sizing | Shared radius, control-height, gap, font and icon tokens; advanced fields, summaries, menus, composer tools and chat-create control consume shared rules. | Apply consistently to remaining controls; run viewport tests. | [~] |
| 8.11 Theme/language | Header controls are grouped, persistent and tested for 44px hit targets. | Narrow viewport and keyboard review. | [~] |
| 8.12 Experimental server memory | Removed feature UI, per-chat/server opt-in, automatic project-memory retrieval and stale delegated action cases. Ordinary local/private/shared memory and project-local facts remain. | Audit gateway/backend route ownership and legacy migration references before deleting backend code. | [~] |
| 8.13 Project context | Project settings expose an existing-chat selector and explicit handoff action. Context is queued for the selected chat's next request, with a five-project cap; chat membership/current chat remain unchanged and no new chat is created. | Run E2E for a non-current target chat and one-shot consumption; pending handoff is currently in-memory/session-only and is lost on reload before sending. | [~] |
| 8.14 Touch selection | Targeted user-select, -webkit-user-select, touch-action; message text remains selectable; sidebar swipe distinguishes horizontal close from vertical scroll. | Native iOS Safari/long-press testing still required. | [~] |
| 8.15 Status | Status row is centered and uses neutral, non-gradient text rather than decorative sheen. | Add semantic information/success/warning/error states without fabricated progress; verify reduced motion. | [~] |
| 8.16 Button typography/icon-first | Shared control typography/spacing and icon-first message actions with accessible names. | Normalize remaining one-off button classes and tooltip coverage. | [~] |
| 8.17 Readability | Persistent 90–120% text scale and standard/high contrast preference apply in light/dark themes. | Expand contrast handling to links, secondary/disabled/error/status text and add visual contrast checks. | [~] |

### Latest checkpoint — 2026-10-31, navigation/modal/readability follow-up

- PR #131 branch: `feat/landing-v1-accessibility-responsive-20261031`; current verified head before this documentation update: `a051b6bfb518e39ff85a07aa4f7218c7e43bc769`.
- Current comparison with `main`: 97 commits ahead / 4 behind; merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`.
- Requirement 8.6: project-filter and modal navigation now use browser history. Back/Escape closes only the top dialog or restores the prior project filter; modal focus is trapped and returned, and body scroll/overscroll is locked while a modal is open.
- Requirements 8.8/8.16: expanded message view keeps copy and speech actions, with accessible labels/tooltips and 44px hit targets; speech is not offered for user messages.
- Requirements 8.3/8.13: Cloud remains exclusive while provider and additional settings may coexist; project settings can explicitly hand off context to an existing chat for its next request without changing chat membership.
- Requirements 8.15/8.17: status/toast states use restrained semantic colors; high-contrast text extends to secondary, disabled, link, error and status content in both themes.
- Regression tests cover nested browser Back, modal Back/repeated lifecycle, one-shot context handoff, viewer controls, status states and high-contrast tokens. Existing restore and sidebar-order tests remain.
- Exact-head combined status and workflow-run queries for `a051b6bfb518e39ff85a07aa4f7218c7e43bc769` returned no entries. Playwright/Chromium and the modal/history additions have not been executed on this exact head; no passing CI result is claimed.
- No merge, deployment, framework migration or dependency addition performed.

## Decision log

- 2026-10-31: V1 is the stable main baseline. PR #131 is renamed **aLandi Landing UI v2.0** and reserved for ongoing V2 interface work. The owner sections 8.1–8.17 are priority requirements, not presumed completed.
- 2026-10-31: Project sources are not to be represented by placeholder controls. First establish whether existing document/RAG storage has project ownership and supported list/delete semantics.
- 2026-10-31: Removal of the experimental server-memory UI must not delete ordinary local/private/shared memory.


### Follow-up — memory hierarchy and sidebar accordion state

- Requirement 8.1 memory layout now follows shared → personal → personal-context opt-in. Sidebar close collapses only memory disclosures; project/chat accordion state is retained.
- E2E assertions cover memory block order and preservation of project navigation, projectless and Chats state. Syntax parsing passed; actual Playwright execution remains pending.


### Follow-up — last-closed-chat restore coverage

- Added a Playwright scenario that deletes a chat, reloads the application and restores the chat from local storage. The existing restore implementation is now covered for the reload path.
- Test commit: `2bfc6c080abeef00ed2566e54e0b847f40c11e2d`. Syntax parsing passed; E2E execution remains pending.


### Follow-up — project context handoff (8.13)

- Project settings now allow explicit selection of an existing target chat and queue the selected project's context for its next request. The handoff does not change the active chat, create a chat or mutate `projectId`; the request-context cap remains five projects.
- Fixed the handoff button selector typo in `renderProjectUI()` and added a non-current-chat one-shot E2E scenario. Pending context is currently session-only and does not survive a page reload before the next send.
- Syntax parsing passed; Playwright execution remains pending.


### Follow-up — browser navigation and modal lifecycle (8.6, 8.9)

- Browser history records project-filter depth and every top-level modal. Browser Back and Escape close the top modal or restore the preceding project filter without navigating away from the app.
- Modal lifecycle now includes focus entry/return, Tab trapping, body scroll lock and shared cleanup for settings, project, viewer, chat-action, research, function and trace dialogs.
- Added E2E scenarios for nested project Back, project-settings Back and repeated settings/create-dialog open-close. Exact-head Chromium remains pending.

### Follow-up — expanded message actions and semantic status (8.8, 8.15, 8.16)

- Expanded message view now retains copy and speech controls; speech is hidden for user-authored messages. Icon controls have accessible names/tooltips and touch-sized targets.
- Status and toast elements expose neutral/information/success/warning/error states with restrained theme-aware colors; ticker/status alignment is centered.
- Added viewer and status E2E assertions. Browser execution remains pending.

### Follow-up — adjustable text contrast (8.17)

- High-contrast preference now adjusts secondary, disabled, link, error and status text in both light and dark themes, while preserving the existing scale preview and reset.
- Added computed-style assertions for the high-contrast tokens. Visual contrast acceptance and device review remain pending.
