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
| **8.1 Sidebar, memory, projects, chats** | Memory panel above projects; status line above its title; shared-memory block first, personal-memory block second, private-context opt-in last; explanations collapsed by default; closing sidebar collapses only memory disclosures; projectless/project-filtered chat lists; per-project gear/new-chat; Research Studio in Functions; swipe-close; separate project-create dialog; current chat membership preserved; last-closed-chat restore from local storage. | Execute the new accordion/restore regressions in Chromium; refine spacing and keyboard navigation. | [~] |
| **8.2 Typography/header/main surface** | Header has a wordmark, chat title, theme control, clock and mode controls. | Wordmark is a restrained gradient, clock is 54px, type stack is generic system UI; requested distinct wordmark, tighter vertical controls and independent chat-title treatment need visual iteration. | [~] |
| **8.3 Settings/providers** | aLandi Cloud is a separate card; external providers and most other settings are inside one `legacyProviderSettings` disclosure. | Split into three mutually exclusive groups: Cloud, third-party providers, additional settings; Cloud must never appear as a third-party provider. Preserve current provider key isolation and connection state. | [~] |
| **8.4 Tavily/system prompt** | Tavily key remains in a web-tools disclosure; system prompt is global `localStorage` state and is normalized against the legacy built-in prompt. | Verify the empty-by-default behavior against `DEFAULT_SYSTEM` and migration; decide Tavily only after comparing the existing keyless search fallback and live adapter requirements. No premature deletion. | [~] |
| **8.5 Living notes** | Source document already says new owner UI requirements belong in the matching subsection and statuses require code/test evidence. | Keep the source checklist as the owner requirements record; implementation status and evidence live in this ledger and PR. | [x] |
| **8.6 Navigation and visual hierarchy** | Project groups, project settings modal, nested settings and central Escape handling exist. | Audit navigation history/back behavior and all nested settings; standardize headings, group spacing and panel hierarchy without duplicate controls. | [~] |
| **8.7 Project settings / Sources** | Project settings store name, instructions, local project memory, scope, import/export and deletion. | No explicit project-source CRUD/index contract was found in the targeted gateway audit; existing document upload is not proof of project-source management. Do not show fake source actions. Inspect document/RAG APIs and storage ownership; add a read-only “Источники” view only if backed by real project-scoped records, otherwise record a blocker. | [~] |
| **8.8 Message action icons** | Copy, view and speech actions are created as text buttons; the expanded viewer has separate controls. | Replace ambiguous text with compact, consistent icon buttons, accessible names/tooltips and adequate touch targets; keep copy/speech in expanded view. | [~] |
| **8.9 Backdrop lifecycle** | Multiple modals use independent close handlers; some close on backdrop, message viewer directly toggles `.hidden`; Escape central handler does not cover every viewer. | Establish one safe close path per modal, close backdrop atomically, restore focus, unlock scroll and test rapid/repeated open-close, Escape, outside click and transitions. | [~] |
| **8.10 Control sizing system** | Radius and motion tokens exist; control heights/paddings still mix CSS and utility classes. | Add a small shared token scale for compact/regular/icon controls and touch targets; use semantic variants, not one geometry for every control. | [~] |
| **8.11 Theme/language group** | Theme icon is in the header; language selector is buried in Additional settings. | Put equally compact theme and language controls together in the header; preserve the 44px touch hit area on small screens and current language persistence. | [~] |
| **8.12 Remove “Серверная память (Эксперимент)”** | Project settings contain `serverMemoryDetails`, server graph opt-in/upload/list controls and helper-memory suggestion controls; chat state has `serverProjectMemoryEnabled`. | Remove the deprecated product UI and its client-side entry points/state. Preserve ordinary local/private/shared memory. Do not delete unrelated backend code or the normal local memory graph without evidence it belongs exclusively to this feature. Update legacy imports safely and remove stale UI wording. | [~] |
| **8.13 Explicit project context handoff** | Per-chat project-memory toggle and implicit project-memory injection are removed. Project settings now list existing chats and queue selected project context for the chosen chat's next request, without creating a chat or changing project membership; the composer one-shot picker remains. | Execute the E2E scenario for a non-current target chat, verify one-shot consumption/no cross-chat leakage, and decide whether pending handoff should survive reload (currently session-only). | [~] |
| **8.14 Touch selection** | Only the unavailable voice control explicitly disables selection; message content is explicitly selectable. | Add targeted `user-select` / `-webkit-user-select` / `touch-action` to controls and gesture surfaces; keep message text and inputs selectable; test long-press and swipes. | [~] |
| **8.15 Status/progress** | Status uses a gradient animated text treatment and spinner; toast/status roles exist. | Center status rows, use semantic muted state colors, retain truthful progress and reduced-motion behavior; no fabricated progress. | [~] |
| **8.16 Button typography/icon-first** | Button text sizes and paddings vary across utility classes and local CSS. | Normalize type/spacing/alignment through tokens and component variants; use icon-first only where meaning is unambiguous and always provide accessible labels. | [~] |
| **8.17 Adjustable text readability** | Dark/light palettes are fixed CSS variables; no user-adjustable readability controls exist. | Add bounded, understandable text readability controls (not arbitrary theme recoloring), persist locally, apply to both themes, validate text-state contrast and provide reset/default behavior. | [~] |

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

### Latest checkpoint — 2026-10-31, explicit project creation flow

- PR #131 branch: `feat/landing-v1-accessibility-responsive-20261031`.
- Latest UI code commit: `c3855c28317c5b481d59b463e4d4cb985d992dcd`; E2E update commits: `ccb76ea689ddb0ad6ef8d580dee06148aab6f94f` and `24004fe48e506a7d1a7e03b1538f3faed209381b`; subsequent commits in this checkpoint only refresh continuity documentation.
- At the UI code commit, comparison with current `main` was 92 commits ahead / 4 behind; subsequent commits only updated continuity documentation. Merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`.
- Requirement 8.1 correction: project creation now uses its own dialog; full settings remain available from the project's gear. Creating a project no longer mutates the current chat's `projectId` or chat history. The user explicitly creates a project chat from that project's navigation row.
- Regression coverage updated for current-chat preservation, project-filtered chat creation, project-scoped memory/context, project import/export and project deletion.
- JavaScript syntax parsing passed for the inline app script and Playwright test module. Exact-head combined status and PR workflow-run queries for `4c5c583d08d242308b9019417cb0c90bcaf264d3` returned no entries. Playwright/Chromium tests have not been executed in this session; this is not a passing CI result.
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
