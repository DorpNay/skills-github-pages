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
| **8.1 Sidebar, memory, projects, chats** | Memory panel is already above projects; memory details and projects list are collapsed by default; “Без проекта” exists; chats are project-grouped; per-project “new chat” exists. | Memory status is below the details instead of above the block; memory content order differs from requested order; a global “Настройки проекта” action duplicates per-project settings; project-row settings are text-heavy; no clear back-to-general-chat action; Research Studio still occupies a sidebar button; add swipe-close without breaking scroll/selection. | [~] |
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
| **8.13 Explicit project context handoff** | A per-chat `projectMemoryEnabled` checkbox controls project-memory injection; a separate one-shot composer project-context picker exists. | Remove the per-chat checkbox and automatic project-memory injection. Use the existing one-shot project-context mechanism as the first safe path; add project→existing-chat handoff only if it can be implemented without moving chats, creating chats or silently persisting context. | [~] |
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
- [ ] Implement foundation: shared UI tokens, modal lifecycle, accessible icon controls and touch ergonomics.
- [ ] Implement sidebar/projects/chats and memory UX.
- [ ] Implement settings/provider IA and header typography/theme/language.
- [ ] Remove deprecated server-memory UI and replace implicit project-memory opt-in with explicit one-shot context.
- [ ] Resolve project Sources contract or document a verified blocker; no mock UI.
- [ ] Implement status, button and text-readability system.
- [ ] Update superseded E2E tests and add complete V2 regression matrix.
- [ ] Exact-head CI and manual device review; PR remains unmerged.

## Decision log

- 2026-10-31: V1 is the stable main baseline. PR #131 is renamed **aLandi Landing UI v2.0** and reserved for ongoing V2 interface work. The owner sections 8.1–8.17 are priority requirements, not presumed completed.
- 2026-10-31: Project sources are not to be represented by placeholder controls. First establish whether existing document/RAG storage has project ownership and supported list/delete semantics.
- 2026-10-31: Removal of the experimental server-memory UI must not delete ordinary local/private/shared memory.
