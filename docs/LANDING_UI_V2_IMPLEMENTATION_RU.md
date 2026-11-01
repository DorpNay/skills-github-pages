# aLandi Landing UI v2.0 — implementation ledger

**Owner priority source:** docs/V1_UI_FINALIZATION_RU.md, unified section 8.0; mandatory owner scope 8.1–8.17 plus optional proposals 8.18–8.27 (2026-11-02).  
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
| **8.1 Sidebar, memory, projects, chats** | Memory status precedes the title; shared facts → personal facts → private-context opt-in; explanations collapsed; sidebar close preserves project/chat disclosure state; project-filtered chats, explicit project chat creation, per-project gear, separate create dialog, unchanged current-chat membership and local last-closed-chat restore. | Added Playwright coverage that horizontal touch swipe closes the sidebar while vertical movement does not; verifies project disclosure remains open after close/reopen. Existing accordion/restore regression and real-device checks remain. | [~] |
| **8.2 Typography/header/main surface** | Dedicated wordmark/chat-title styling, shared system font stack, compact theme/language group, clock and mode controls; mobile control targets use consistent touch sizing. | Added responsive Playwright checks at 320/360/390/768/1024/1440px for header overflow, distinct chat-title treatment, clock presence, wordmark styling and compact Fast/Thorough controls; actual browser execution and visual review remain. | [~] |
| **8.3 Settings/providers** | aServi remains exclusive; opening third-party providers closes aServi; provider and additional-settings disclosures can remain open together. | Execute E2E and review keyboard/narrow-screen behavior. | [~] |
| **8.4 Tavily/system prompt** | Tavily key remains in a web-tools disclosure; system prompt is global `localStorage` state and is normalized against the legacy built-in prompt. | Verify the empty-by-default behavior against `DEFAULT_SYSTEM` and migration; decide Tavily only after comparing the existing keyless search fallback and live adapter requirements. No premature deletion. | [~] |
| **8.5 Living notes** | Source document already says new owner UI requirements belong in the matching subsection and statuses require code/test evidence. | Keep the source checklist as the owner requirements record; implementation status and evidence live in this ledger and PR. | [x] |
| **8.6 Navigation and visual hierarchy** | Browser history stores nested project-filter/modal depth; Back closes/restores the preceding level and Forward reopens the saved project filter or modal; Escape follows the same stack. | Execute Back/Forward/Escape regressions and inspect visual hierarchy and keyboard behavior. | [~] |
| **8.7 Project settings / Sources** | Project settings retain name/instructions/local memory/scope/import/export/delete; Sources shows a truthful unsupported-state explanation; project settings can explicitly hand project context to an existing chat. | Gateway still lacks a source-list API; do not add CRUD until project-scoped list/delete semantics exist. | [~] |
| **8.8 Message action icons** | Copy and speech controls remain available in the expanded viewer; user messages expose copy but not speech; controls carry accessible names/tooltips and 44px hit targets. | Execute compact/expanded viewer regressions and verify speech/copy on target devices. | [~] |
| **8.9 Backdrop lifecycle** | Modal stack covers settings, project settings/create, message viewer, chat actions, research, function panel and trace; browser Back/Escape, focus return, Tab trap, body scroll lock and backdrop close share a consistent lifecycle. Tab containment now targets the topmost rendered modal by z-index and filters hidden/inert descendants. | Run repeated open/close, outside-click and focus/scroll regressions in Chromium; inspect native mobile behavior. | [~] |
| **8.10 Control sizing system** | Shared control sizing and typography rules normalize compact controls, menu options, composer tools, header actions, chat creation and icon buttons while retaining 44px touch targets. | Run viewport snapshots and finish remaining one-off controls. | [~] |
| **8.11 Theme/language group** | Theme and language controls are grouped in the header, persistent and sized for touch/keyboard use. | Narrow viewport and keyboard review. | [~] |
| **8.12 Remove “Серверная память (Эксперимент)”** | Browser UI/client dispatch, per-chat opt-in and `/v1/memory/graph/*` routes/flags removed; local/private/shared/project-local memory, conversation delta sync and RAG remain. Internal `MemoryManager` is Graphify-only; existing SQLite data is untouched. | Execute exact-head Gateway + Chromium regressions; confirm no legacy UI or client calls. | [~] |
| **8.13 Explicit project context handoff** | Project settings list existing chats and queue the selected project's context for the chosen chat's next request; no new chat or project-membership change; five-project cap and one-shot consumption retained. Pending handoff is session-only until sent. | Execute non-current-chat/no-cross-chat/one-shot E2E and decide whether pending handoff should survive reload. | [~] |
| **8.14 Touch selection** | Targeted user-select/-webkit-user-select/touch-action rules keep controls from selecting the whole interface while message text, expanded viewer content and editable fields remain selectable; horizontal sidebar swipe is separated from vertical scrolling. | Chromium regression now checks buttons, disclosures, input fields, assistant text and expanded viewer selection styles; native iOS Safari long-press, VoiceOver and gesture tests remain. | [~] |
| **8.15 Status/progress** | Status and toast elements expose neutral/info/success/warning/error data states with restrained semantic colors; status text and ticker are centered; no synthetic progress added. | Playwright coverage now checks all five status colors, toast semantic styling, centered alignment and marquee suppression under `prefers-reduced-motion`; browser execution and theme contrast review remain. | [~] |
| **8.16 Button typography/icon-first** | Shared control typography/spacing and 44px message-action targets; copy/view/speech actions are icon-first. Inline message-action labels/tooltips now use one consistent value for both `title` and `aria-label`. | Added E2E assertions for all inline and expanded-view message actions: matching accessible name/tooltip and 44px hit targets. Remaining one-off controls and full panel review remain. | [~] |
| **8.17 Adjustable text readability** | Persistent text scale and standard/high-contrast preference apply in light/dark themes; high contrast adjusts secondary, disabled, link, error and status text. | Added Playwright coverage comparing normal/high-contrast colors for secondary, disabled, links, errors and status in both themes while confirming primary text remains stable; actual WCAG ratio review and browser execution remain. | [~] |

### 8.17 — preliminary base-token contrast calculation

A deterministic E2E check now calculates WCAG relative luminance/contrast from the actual CSS custom properties against the solid theme surface, in standard/high-contrast mode. Current base-token calculations (rounded to 2 decimals):

| Theme surface | Primary | Secondary | Success | Warning | Error |
|---|---:|---:|---:|---:|---:|
| Dark #0f1b2b | 15.93:1 | 8.26:1 | 9.02:1 | 10.92:1 | 6.59:1 |
| Light #ffffff | 15.48:1 | 5.91:1 | 4.90:1 | 6.59:1 | 5.26:1 |

High-contrast disabled/info tokens are included in the automated calculation. These are **base-token vs base-surface values**, not a complete WCAG audit: actual cards, gradient/translucent surfaces, small text, hover/focus states, disabled controls and non-text contrast still require inspection and native-device review.

## Cross-cutting inherited UI work (requirements before section 8)

The original V1 document contains 18 inherited control directions before section 8 (not merely seven numbered lines). Their exact titles, current [x]/[~] statuses, remaining acceptance and links into 8.1–8.17 are enumerated in the matrix in docs/V1_UI_FINALIZATION_RU.md. The summary below is a grouping, not a replacement checklist. The pre-8 checklist is not a second backlog.

| Inherited requirement | Remaining outcome | Linked V2 items |
|---|---|---|
| Overall visual polish | Responsive screenshot review, typography, contrast, spacing, empty/error states and secondary controls. | 8.2, 8.6, 8.10, 8.15–8.17 |
| Composer/mobile keyboard | VisualViewport, safe-area, top/bottom composer, long input, nested scroll and scroll-position retention. | 8.2, 8.6, 8.9, 8.14 |
| Provider routes and catalog | Legacy route migration, RU/EN labels, model catalog persistence/failure, auth errors and no cross-provider leakage. | 8.3, 8.11 |
| Inline validation and gateway status | Required fields, URL/model errors, CORS/401/5xx, redaction, model completion + /healthz, stale-response handling. | 8.3, 8.9, 8.17 |
| Global prompt editing | Empty default + legacy migration, keyboard-visible edit affordance, accessible name and readonly restoration. | 8.4, 8.10, 8.16, 8.17 |
| Provider instructions and Tavily | Remove duplicate copy, verify upstream links/privacy notes, test key lifecycle and keyless fallback before any removal decision. | 8.3, 8.4 |
| Modal, scroll and secondary controls | Escape/Back/Forward, focus return, scroll lock, long chats/attachments, nested scroll and stale controls. | 8.1, 8.6, 8.9, 8.10 |
| RU/EN and theme completeness | Dialogs, statuses, errors, tooltips, Roadmap, empty states and both themes. | 8.11, 8.15, 8.17 |
| Research/skills/agents honesty | Preserve draft and chat settings, test mobile/Escape/no-auto-send; don't label a four-stage single-model pipeline as independent agents. | 8.6, 8.15, 8.16 |

### 8.6 / 8.9 — modal keyboard containment

The modal keyboard trap now selects the actually topmost visible dialog by computed z-index instead of relying on a fixed modal array order. It filters disabled, hidden, inert, aria-hidden and visibility-hidden controls; Tab/Shift+Tab wrap between the first and last usable controls, and a dialog with no focusable descendants receives programmatic focus. A dedicated E2E verifies both wrap directions and recovery when focus starts outside the dialog. This complements the existing Escape/Back/Forward, backdrop and focus-return paths; screen-reader/native-device validation remains outstanding.

### Runtime source-of-truth

The active Jekyll app shell, markup and CSS are in index.md; browser runtime logic is extracted to assets/js/app.js (refactor commit 9e5cf6465c8be4908ada83f1806bcd82a8907149). Runtime IDs/actions use the aServi naming family (aserviBaseUrl, aserviModel, aserviApiKey, paste-aservi-key, aserviStatus); E2E must target those current controls and not superseded selector contracts. Keep HTML structure in index.md, application CSS in assets/css/app.css, public landing CSS in assets/css/landing.css, and browser runtime logic in assets/js/app.js.

### Work completed in this cross-cutting pass (not yet browser-verified)

- aServi URL validation now has RU/EN messages, required URL/model/key errors, aria-invalid and aria-describedby linkage; aServi field labels, paste action and connection status are localized. Theme-aware semantic info/warning tokens were added, and the checking state uses the warning token in both themes.
- aServi health refresh now checks that URL/model/key still match after asynchronous fingerprint and /healthz work, so an old response cannot restore a green state after credentials change.
- The global system-prompt edit pencil now localizes its title/accessibility name and edit-state announcement; E2E covers keyboard focus and the return to read-only.
- Mobile viewport resize now captures whether the chat was near the bottom before layout changes: users reading older messages keep their position, while users at the latest message stay anchored. E2E coverage was added.
- Playwright CI diagnostics changed to trace on first retry, screenshot on failure and no video. CI uses one worker and a 30-minute Playwright global timeout inside a 35-minute Actions job, allowing the test runner to finish and flush reports. The high-contrast E2E also verifies that the aServi checking-state color follows the selected theme.
- The browser package remains pinned at @playwright/test 1.56.1 for the current stabilization baseline. Upgrade is deliberately separated from UI debugging: issue #38489 documents a 1.57 Chrome-for-Testing memory spike report, while issue #41562 documents a distinct 1.61.1/Chromium 149 view-transition stability regression fixed in later upstream builds. Neither is proven to be the cause of aLandi's failures; avoid changing browser and application variables simultaneously.

## aLandi aServi naming, asset optimization and modal focus — 2026-11-01

- Renamed the first-party self-hosted endpoint surface to **aLandi aServi** in UI labels, RU/EN copy, status messages, DOM IDs, CSS classes and related E2E selectors. Cloudflare remains a separate infrastructure/provider name and was not renamed.
- Extracted the 361 KB inline application runtime into assets/js/app.js with defer, and externalized the 48.1 KB app stylesheet plus 10.4 KB landing stylesheet into assets/css/app.css and assets/css/landing.css. The app HTML fell from about 468.6 KB to 61.3 KB; landing HTML fell from 26.1 KB to 15.8 KB. Jekyll relative_url keeps project-site paths correct and the assets can be cached independently. No framework, build step or dependency was added.
- Marked and DOMPurify now use ordered defer loading before the application runtime, avoiding the prior async execution-order race. CSS declarations were moved without minification or cascade reordering. Repeated selectors remain intentionally untouched until a measured, bounded cleanup can preserve cascade behavior.
- Kept the persisted ai_alandi_cloud_* localStorage keys unchanged behind the new ASERVI_STORAGE code contract. These keys are internal compatibility identifiers, not user-facing product names; retaining them avoids breaking existing saved server URL/model/connection state. No storage migration or data deletion is performed.
- Modal focus containment was corrected to select the actual topmost visible dialog; E2E now checks Shift+Tab and Tab wrap using rendered focusable elements. V8 parse-only syntax check passed for assets/js/app.js and all 11 E2E modules; extracted CSS brace counts are balanced. These are source checks only, not browser execution.
- No branch or source file was deleted: no ownership/usage proof established an orphan.

## Chromium / Playwright reliability findings (research snapshot 2026-11-01)

1. **Worker contention is a real CI variable.** Playwright's current CI guide recommends one worker on constrained CI runners; parallel workers are an opt-in for powerful self-hosted systems. aLandi previously used two workers after a three-worker run timed out. This pass switches the hosted CI suite to one worker, sets a 30-minute runner-level global timeout and leaves five extra minutes at the Actions job level for teardown/report upload. If runtime proves too long, shard independent suites across separate jobs rather than immediately increasing workers.
2. **Retries are diagnostics, not a cure.** Keep one CI retry to classify intermittent failures, but do not treat a retry pass as a clean pass. A test that passes only on retry remains flaky and must be investigated.
3. **Capture actionable evidence, not maximum artifacts.** Trace on first retry is the Playwright-recommended CI pattern; video is disabled and screenshots remain only-on-failure. The trace is the primary source for DOM snapshots, actionability checks, network and console state.
4. **Do not synchronize with sleeps or forced clicks.** Prefer role/label/user-visible locators and web-first assertions. locator.click() already waits for unique resolution, visibility, stability, event reception and enabled state. A timeout should be diagnosed as an unmet actionability condition, not bypassed with force:true unless the test explicitly targets a gesture/overlay behavior.
   - Current E2E audit found one forced sidebar-close click that ran after the preceding New Chat action had already closed the sidebar. The test now reopens the sidebar and uses a normal click; all audited E2E files contain zero force:true, waitForTimeout and networkidle usages.
5. **Treat browser-version regressions separately from app regressions.** Public issue #41562 describes locator.click() hanging in the stability check with Chromium 149 and active MPA View Transitions; it was reproduced on Playwright 1.61.1 and fixed on later tip-of-tree. aLandi does not currently declare MPA View Transitions, so this is a cautionary example, not an attribution. Public issue #38489 reports high memory use with Playwright 1.57 Chrome for Testing under parallel execution; this reinforces the choice to keep a pinned baseline until UI behavior is stable.
6. **Keep test state independent.** Every test must own its local/session storage, network mocks and project/chat fixtures. No test should rely on a preceding test, ordering within a file, external provider uptime or a real credential.
7. **Pin and report the browser runtime.** Keep Playwright and its browser install version aligned; record Playwright/Chromium versions in CI diagnostics before a future controlled upgrade. Never silently bump only the npm package while reusing a mismatched browser binary.

Primary references:
- Playwright [Best Practices](https://playwright.dev/docs/best-practices), [CI](https://playwright.dev/docs/ci), [Isolation](https://playwright.dev/docs/browser-contexts), [Retries](https://playwright.dev/docs/test-retries), [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro), [Auto-waiting](https://playwright.dev/docs/actionability), [Timeouts](https://playwright.dev/docs/test-timeouts).
- Upstream reports: [microsoft/playwright#41562](https://github.com/microsoft/playwright/issues/41562) (Chromium 149 view-transition stability check); [#38489](https://github.com/microsoft/playwright/issues/38489) (reported 1.57 memory pressure under parallel execution); [#28705](https://github.com/microsoft/playwright/issues/28705) (CI-only Chromium flakiness report).

## Acceptance and test plan

1. Keep all existing V1 regression tests unless a test asserts behavior explicitly superseded by owner requirements 8.1–8.17; replace those assertions with the new acceptance contract rather than simply deleting coverage.
2. Add Playwright coverage for:
   - sidebar order, accordion defaults/state retention, projectless/project chat filtering, project gear actions, back-to-general navigation and swipe-close;
   - mutually exclusive settings sections and aServi/provider separation;
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
- [~] Implement header theme/language controls and aServi/provider/additional-settings grouping.
- [x] Remove deprecated server-memory UI/client dispatch and graph HTTP API/flags; preserve independent local/private/shared/project-local memory, conversation delta sync and RAG. Existing graph SQLite files are not deleted.
- [~] Execute exact-head Gateway and Chromium regressions for the removal and local-memory preservation.
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
| 8.3 Settings/providers | aServi, third-party providers and additional settings are separate disclosures. aServi closes peer groups; peer groups cannot open while aServi is open. | Execute E2E; review keyboard and narrow-screen behavior. | [~] |
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

### Latest checkpoint — 2026-10-31, browser Back/Forward and modal lifecycle

- PR #131 branch: `feat/landing-v1-accessibility-responsive-20261031`; verified code/test head: `60fb9838d9080fad8420d9bfd97c78faf233b039`.
- Comparison with `main`: 110 commits ahead / 4 behind; merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`.
- 8.6: browser history now stores nested project-filter and modal entries. Back restores the previous project filter or closes the top modal; Forward restores the saved project filter/modal (including chat-action target/mode); Escape follows the same navigation stack.
- 8.9: modal lifecycle includes focus entry/return, Tab trapping, body scroll/overscroll lock and shared backdrop cleanup.
- 8.8/8.16: expanded message view retains accessible copy/speech icon actions, with speech hidden for user-authored messages.
- 8.13: project settings can hand off context to an explicitly selected existing chat for its next request; no new chat or project-membership change, five-project cap retained, pending state session-only.
- 8.15/8.17: semantic status/toast states and high-contrast text for secondary/disabled/link/error/status content in both themes.
- E2E coverage includes nested Back/Forward, modal Back/Forward/repeated lifecycle, chat-action modal Forward restoration, one-shot handoff, viewer controls, semantic status and high-contrast tokens. Playwright/Chromium has not been executed on this exact head.
- Exact-head combined status and workflow-run queries for `60fb9838d9080fad8420d9bfd97c78faf233b039` returned no entries. No passing CI result is claimed.
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


### Follow-up — browser Forward restoration (8.6)

- Navigation entries are now stored in the browser history state. Forward restores the previously selected project filter or reopens the modal that was dismissed with Back.
- Added E2E assertions for Forward after both nested project navigation and project-settings Back. Browser execution remains pending.


### Follow-up — chat-action modal Forward restoration (8.6, 8.9)

- Browser history entries for chat-action dialogs now retain the target chat and action mode. Forward reconstructs the dialog against the existing chat instead of reopening an empty shell.
- Added an E2E scenario for Back → Forward → Back on a project-assignment dialog. Exact-head Chromium remains pending.


### Follow-up — touch selection regression (8.14, 2026-11-01)

- Expanded the Playwright computed-style regression beyond the send button: it now checks button/disclosure non-selection and manipulation touch action, while input, assistant message text and expanded message viewer remain selectable (including the WebKit-prefixed property).
- Test commit: `64a1a811bd5531d8095245d649829fd838486821`. This is source-level coverage only; Chromium and native iOS Safari/VoiceOver have not been executed.
- 8.13 source audit confirms explicit project-to-existing-chat handoff, no automatic project injection based on membership, unchanged chat membership/current chat, five-project cap, and one-shot consumption after successful send. Pending handoff is deliberately session-only; persistence across reload is not required by owner section 8.13 and is not being added without a product decision.
- PR #131 remains open and unmerged; no deployment.


### Follow-up — semantic status and reduced motion regression (8.15, 2026-11-01)

- Added a focused Playwright scenario checking that all five status states resolve to distinct text colors, toast semantic states have visible color/border styling, status and roadmap ticker are centered, and the roadmap marquee is disabled when the browser requests reduced motion.
- Test commit: `9a6cbe71e3c433bd20b1d0fbddfbd799834019d5`. This is regression source only; Chromium has not been executed and no pass is claimed.
- Existing implementation already avoids synthetic progress; status timer reports elapsed time and a historical estimate only when available.


### Follow-up — icon-first message action consistency (8.16, 2026-11-01)

- Fixed inconsistent duplicate `aria-label` assignments on inline message actions. Copy, open-full-message and local-speech controls now each set one label and use the same value for the tooltip and accessible name.
- Extended the message-viewer Playwright scenario to verify all inline and expanded-view action labels/tooltips match and all inline message-action targets are at least 44×44px.
- Code commit: `f1b7792dd6c38af08cf4e3f8979660890a3bea0a`; test commit: `a6ce9eed87d6c239b9f5ea394ab04359939479e2`. Browser execution remains pending.


### Follow-up — high-contrast text-state regression (8.17, 2026-11-01)

- Added a focused Playwright scenario for normal, secondary, disabled, link, error and status text. It checks that high contrast changes the five secondary semantic states in both dark and light themes while leaving primary message text unchanged.
- Test commit: `787c9aaf6026559da31daf51d82f884abdc78c1d`. This adds browser assertions only; Playwright has not been run and no contrast ratio or WCAG conformance is claimed.


### Follow-up — sidebar swipe acceptance (8.1, 2026-11-01)

- Added a Playwright regression at mobile viewport size: vertical touch movement must not close the sidebar; a leftward horizontal swipe beyond the close threshold must close it; reopening must preserve the expanded project navigation list.
- Test commit: `d388a02445ddc1ebccbaec58fd8515b8d0b9adfa`. The event-level regression is added but has not been executed in Chromium or on a physical touch device.
- Requirements 8.3 and 8.7 already have focused source/E2E coverage: aServi/provider disclosure exclusivity and truthful project-source unsupported state (no fake CRUD controls). Do not duplicate these implementations.


### Follow-up — responsive header acceptance (8.2, 2026-11-01)

- Added a Playwright layout regression across 320, 360, 390, 768, 1024 and 1440 CSS px. It checks that the header does not horizontally overflow, the active chat title remains a distinct bordered surface, the clock remains present, the wordmark retains its expressive treatment, and Fast/Thorough controls stay compact.
- Test commit: `9ff326d40ac0567c1c62c293cb396bcd9c4eba82`. The test is added but not executed; it is not a substitute for screenshot review on real devices.


## Legacy checklist reconciliation — 2026-11-01

The older open items from sections 1–7 of V1_UI_FINALIZATION_RU.md and the previous LANDING_UX_POLISH_BACKLOG_RU.md were compared with the current PR #131 source and owner requirements 8.1–8.17. The older audit tables above are historical snapshots; where they disagree with this reconciliation, this section and the latest checkpoint below are authoritative.

| Legacy area | Current disposition | Active follow-up |
|---|---|---|
| Composer position, responsive layout and header controls | Implemented in earlier PRs and refined in 8.1/8.2. Do not restore old duplicate composer/header tasks. | Execute responsive E2E; native keyboard/safe-area review. |
| Provider routing and aServi/third-party separation | Implemented and refined under 8.3; no aServi entry in third-party picker. | Execute disclosure tests; verify error/redaction paths and live status only with owner-approved credentials. |
| Global system prompt | Empty-by-default and global, not chat-scoped. | Recheck legacy migration and no-default regression; no duplicate implementation. |
| Tavily/web search | Tavily remains under web-tools settings; keyless fallback and adapter capability must be audited before any removal. | Contract-test fallback/error states; do not remove by assumption. |
| Dialogs, popovers, focus and backdrop | Shared modal lifecycle and browser Back/Forward/Escape are implemented under 8.6/8.9. | Run repeated-cycle/focus/scroll regressions and native screen-reader review. |
| Sidebar/projects/chats/import-export | Earlier navigation/import-export slices are retained; current hierarchy is 8.1. | Run accordion/restore/swipe E2E; long-list and native gesture review. |
| Research Studio, agents, skills and connectors | Existing Research Studio uses active-chat settings; no independent agent swarm or fake marketplace is claimed. | Audit capability labels, registered entities and permissions; verify no mode conflation. |
| Landing page visual polish and ticker | Landing structure, pause controls and reduced-motion behavior exist. | Screenshot, keyboard/screen-reader and published Pages review. |
| Project Sources | No source-list API exists in the gateway. | Keep unsupported-state; no CRUD until a real scoped API is available. |

### Unified remaining work — current priority

1. **P0 — execute exact-head checks:** focused Playwright/Chromium for 8.1–8.17; Gateway tests including secret redaction and graph-bridge retirement; then full Quality, Freshness, Provenance, Graphify and Dead Code where available. Tests currently exist as source but have not been executed on the current head.
2. **P1 — device/accessibility acceptance:** native iPhone Safari keyboard/VisualViewport/safe-area/touch/rotation; VoiceOver and keyboard-only; real WCAG contrast-ratio audit in both themes.
3. **P1 — visual acceptance:** screenshots at 320/360/390/768/1024/1440 px; review header, sidebar, composer, dialogs, long labels, empty/error states, typography and spacing; complete RU/EN and light/dark review.
4. **P2 — interaction stress:** long project/chat lists and messages, nested scrolling, popover edge placement, rapid modal cycles and focus restoration.
5. **P2 — truthful feature surfaces:** verify Research/Agents/Skills/Connectors labels and permissions; distinguish web-search breadth, offline and sequential pipeline from independent agent runtime; finish Tavily/keyless fallback decision and provider/gateway mock error states.

Not active UI work: project-source CRUD without a gateway list contract; persistence of the 8.13 pending handoff across reload (not required); adding providers/connectors/OAuth/cloud sync or runtime capabilities without owner approval.

### Current checkpoint — 2026-11-01, after checklist reconciliation

- PR #131 branch: feat/landing-v1-accessibility-responsive-20261031; PR remains open and unmerged; V1 in main is unchanged.
- Current known code/test head before these documentation-only reconciliation commits: 8f68c2cc4b4b01a1917e32f75f7d5016517d41c3.
- Requirement 8.12 graph bridge/UI removal and gateway secret-redaction regressions are implemented in source; their tests are not executed.
- Requirements 8.1–8.17 have implementation and/or focused regression source, but exact-head Playwright/Chromium and full CI results are absent. Native iPhone/VoiceOver and WCAG ratio checks remain manual.
- Do not claim CI/E2E pass, merge or deploy. Continue from P0 exact-head verification, then resolve confirmed failures before more UI scope.


### Documentation reconciliation follow-up — 2026-11-01

- Canonical owner queue is section 8.0 in V1_UI_FINALIZATION_RU.md; the older pre-8.1 checklist is historical V1 context, not a parallel active queue.
- The concise polish register, project state, orienter, Volley log and PR body now point to the same residual work.
- Latest code/test head remains 8f68c2cc4b4b01a1917e32f75f7d5016517d41c3; subsequent commits are documentation-only. The latest documentation head is intentionally read from live PR #131 metadata because documentation-only commits may advance it.
- P0 exact-head verification remains the next action; workflow/status queries returned no entries. No test pass, merge or deployment is claimed.


### Source audit follow-up — 8.4 and capability-menu truthfulness (2026-11-01)

- Re-read the current PR branch index.md around settings, search-mode controls, function panels, localization strings and prompt migration.
- Confirmed the search menu distinguishes standard coverage, expanded result/source coverage and offline web-tools; the copy explicitly says expanded search does not change execution budget and offline does not make a cloud API local.
- Confirmed the function panel describes the agent mode as four sequential stages on the selected model; the 1–50 role/team setting is explicitly a saved blueprint, not 50 independent agents. The connector panel says no external integrations are connected and exposes no placeholder switches. RU and EN descriptions are present.
- Confirmed Tavily remains optional with an explicit pending decision note, while the global user prompt is empty by default and the legacy built-in prompt is normalized to empty. No duplicate prompt implementation or premature Tavily removal is needed.
- No source-level contradiction was found in these inspected surfaces. The Tavily/keyless-search decision and runtime/provider error tests remain open; this source review is not browser or live-provider verification.
- Relevant source: index.md (searchToolsSettings, searchModeMenu, functionsMenu, functionPanelModal, DEFAULT_SYSTEM and legacy prompt normalization).


### P0 source inventory — exact-head verification preparation (2026-11-01)

- Inspected the current branch workflow definitions. `.github/workflows/quality-sentinels.yml` runs on every pull request and contains integrity, security, context, Jekyll build, Chromium browser E2E, published-site smoke and static-analysis jobs. `.github/workflows/gateway-tests.yml` runs on pull requests that change `gateway/**` (this PR does) and defines compileall, manifest/INTEL checks, `pytest gateway/tests`, deploy-preflight and offline six-layer evaluation.
- Source inventory on the branch: `tests/e2e/app.spec.mjs` contains 90 Playwright test declarations; `tests/e2e/landing.spec.mjs` contains 8; `gateway/tests/test_app.py` contains 36 pytest test functions.
- Confirmed `gateway/app.py` contains no graph-memory HTTP route/flag references. Gateway regression source includes health-probe secret checks, invalid Bearer token non-echo, and upstream error-body redaction.
- Exact current PR head after the change-log correction: 1ea321ddcd8e81379d572565636b6d0ee1424772. GitHub workflow-run and combined-status lookups return zero entries for this head. The workflow YAML is configured to trigger on PRs, but no run result is currently visible; do not infer pass/fail or treat source inventory as execution.
- Execution blocker: this environment has GitHub read/write repository operations but no workflow-dispatch action and no outbound network for a local clone. Therefore Gateway pytest, Playwright/Chromium and Quality jobs cannot be executed from this session. Continue by obtaining an actual GitHub Actions run through the repository's normal PR workflow; do not replace execution with syntax/source inspection.


### Gateway verification evidence update — 2026-11-01

The earlier note that Gateway tests were unexecuted is superseded by the subsequent exact workflow inspection:

- GitHub Actions run **#640** (`Lite Gateway Tests`, run ID `41280622385`) completed successfully on commit `6f7fde485b2b13aecc50523b20785e0ac615d2ad`.
- Every step passed: dependency install, Python compileall, manifest/INTEL validation, `pytest gateway/tests`, deployment preflight and six-layer offline evaluation.
- A compare from that tested commit through the current PR documentation head `579666d45964f56a4e68e3997293a288d7fd1553` shows **no changes under gateway/**. Therefore the current Gateway source and Gateway test files are identical to the successfully tested state.
- This is valid evidence for the current Gateway code, although the workflow did not run on the latest documentation-only HEAD. It does not verify current Playwright/Chromium or full Quality behavior.


### P0 browser-workflow audit and branch safety — 2026-11-01

- Inspected `.github/workflows/quality-sentinels.yml`, `playwright.config.mjs` and `tests/e2e/landing.spec.mjs`.
- Confirmed the PR browser job builds the branch with Jekyll and runs `npx playwright test --grep-invert "live public site serves the app shell and basic chat controls"`. Without `LIVE_SITE_URL`, Playwright serves the built `_site` locally at `http://127.0.0.1:4173`; therefore the 8 landing tests are included against the PR build, not only after deployment. The separate live-site smoke tests the published V1 site and is not evidence that V2 has been deployed.
- Gateway run #640 is a verified pass and remains applicable to current Gateway code because no `gateway/**` files changed after the tested commit. This closes the Gateway P0 sub-gate; it does not close Quality/Chromium.
- Current PR #131 compare against main: 197 commits ahead / 4 behind; merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`; GitHub reports `mergeable=false`. Main-side changes are confined to `docs/V1_UI_FINALIZATION_RU.md`; line-level content comparison shows the PR branch already contains the substantive new main-side requirement lines, while replacing the older polish wording and adding section 8.0. Still, do not merge/rebase/sync automatically: inspect the four main-side commits and preserve both histories before any pre-merge operation.
- Exact PR-head Quality/Chromium run and combined status remain unavailable through the current Actions lookup. The workflow YAML has a PR trigger; no pass is inferred from configuration. The next verification is to obtain an actual Quality Sentinels run on the current PR head and inspect the browser job result/logs.


### Current PR checkpoint — 2026-11-01

- PR #131 remains open and unmerged. Live branch compare: 199 commits ahead / 4 behind `main`; merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`; GitHub currently reports `mergeable=false`.
- The four main-side commits modify only `docs/V1_UI_FINALIZATION_RU.md`. A line-level comparison confirms the PR branch contains the substantive current main-side requirement lines plus its consolidated section 8.0; however, no branch sync/rebase/merge has been performed.
- Gateway P0 sub-gate is closed by Actions run #640. Browser/Quality exact-head evidence remains unavailable; the workflow definition is not a test result.
- Separate continuity backup is staged as draft PR #132, changing only `ORIENTER.md`, `docs/PROJECT_STATE.yaml` and `docs/VOLLEY_LOG.md` outside PR #131. It is not merged.
- Owner rule: no merge, close, retarget, force update or deployment of either PR without explicit owner instruction.


### CI separation and current verification — 2026-11-01

- Separate safety PR #132 has completed its own checks on its own documentation-only branch: Quality run #1114 passed all jobs, including Jekyll, Integrity, Security, Context, Ruff/static analysis, and Chromium; browser log reports **98 passed** against the main/V1 tree. Published GitHub Pages smoke also passed (**1 passed**). Freshness #258 passed the 16 deterministic unit tests and exact live queue check (main `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`, 8 open PRs excluding #132, issue #111); Provenance #798 passed.
- These runs validate main/V1 plus the documentation backup only. They are **not** evidence for Landing V2 code in PR #131 and must not close its browser gate.
- PR #131's current head `5a5b6636bd5878c597e1d25926b58a43771836ab` has no Actions runs exposed by the current exact-SHA lookup. Gateway run #640 remains applicable to its unchanged `gateway/**` tree.
- Next bounded step: create a documentation-only PR-head checkpoint to request the normal `pull_request` Quality workflow for PR #131; then inspect the exact run, Chromium test count/log and all required sentinels. No main→feature sync, rebase, merge or deployment is authorized/performed.


### P0 Quality Sentinel diagnosis — 2026-11-01

- Inspected the owner-dispatched run [#41285658893](https://github.com/DorpNay/skills-github-pages/actions/runs/41285658893), which executed on older PR SHA `d822cb623b2a72642921654a04e6c9d988091834`, not the latest branch head.
- Confirmed passing jobs: Security sentinel, Jekyll build sentinel and independent static analysis (Ruff gate; Bandit/Semgrep advisory). The Chromium job remained in progress at the last status read.
- Context and Integrity failed because `scripts/quality-agents.mjs` still asserted removed/renamed UI controls and the retired server-memory graph bridge, and expected old memory-context wording. These were test-harness drift, not evidence of a regression in the current UI/memory implementation.
- Corrected the sentinel expectations: current project memory-scope selector and private-memory opt-in; explicit shared-memory scope gating; absence of the retired graph HTTP bridge; current shared/private context wording; current required UI element IDs. A second stale assertion expected a hidden internal `providerPrimaryGroup`; the current UI intentionally has an external-only provider picker and a separate first-party aLandi card, so the sentinel now verifies that separation and the saved-provider fallback. No application code or security guard was weakened.
- Harness commits: `1b30cae806469fa5ef1cf8325a41094c54d042a2`, `5d01a7da02207665ce480a68eba99ce7efbc08a9` and `d94d842608c07aa8def4b5fdc89ed95b80524034`. Static source audit against the latest app source confirms all 189 literal `includes(...)` expectations in the quality sentinel are present, and all current required UI IDs exist. This is a source-level cross-check, not an executed CI result.
- Exact-head Quality/Chromium rerun is still required; the latest quality-harness commit at this checkpoint is `d94d842608c07aa8def4b5fdc89ed95b80524034`. Freshness, Provenance, Graphify and Dead Code gates remain to be checked where available. PR #131 stays open/unmerged; no deployment.
- Next: run Independent Quality Sentinels on the latest PR head, inspect all job conclusions and Chromium output, then continue P1 device/accessibility acceptance.

### P0 Chromium runtime correction — 2026-11-01

- Exact-head Quality run #1124 / run ID `41287868283` executed on `b6a3db77fb9bbf8375f8b9d9010365a0e9010158`. Jekyll, Security, static analysis, Context and Integrity passed. Chromium was cancelled when the job reached its configured 15-minute timeout; the local Jekyll server remained healthy and Playwright had started 118 tests, but no final per-test summary was emitted. The progress stream contains failures/timeouts; their identities are not recoverable from this interrupted run, so no individual test is marked passed or failed.
- The suite was serialized by `fullyParallel: false` and `workers: 1`, which made the 15-minute job budget inadequate. Updated `playwright.config.mjs`: independent tests run fully parallel with 3 CI workers and both GitHub/list reporters. Each test receives its own Playwright context and the app test setup clears browser storage; no shared mutable browser context is used.
- Updated the Chromium job timeout to 20 minutes and changed diagnostics upload to `always()` so traces/results can be retained after interruption. Commits: `6bba3e8`, `d0d38d8`, `14d9dc9`.
- These are test-infrastructure corrections only. The current branch head is `14d9dc9789dfc958d99685d36a7649ada8ce5120`; a new exact-head Quality/Chromium run is still required. Native iPhone Safari, VoiceOver and measured WCAG contrast remain manual gates.

### 8.10 shared touch-target normalization — 2026-11-01

- Source audit found several compact controls below the project's 44px touch target: chat-row action summaries (36px, and 30px in project chat rows), language-menu options (36px), settings header actions (36px override), project disclosures and toolbar summaries without a shared minimum, and memory-item action buttons.
- Added a final shared CSS sizing rule using `--ui-control-touch` for those controls. Existing layout and action behavior are preserved; no new controls or runtime features were added.
- Extended the mobile Playwright touch-target regression to create a chat and measure its row-menu summary, and to open the language menu and measure an option. Existing sidebar/settings/project modal target checks remain.
- Code/test commits: `6e75dbf368b71ccd1660873d5cd0f9870cf58119`, `441d5da57b80399228c0a520d7a867ae3fc5371b`, `2d25b12f100b246a929fc6921dfb44971f7d50e3`. Browser execution is pending; the prior Chromium run was cancelled before its final report. Re-run the full suite on the latest branch head before marking 8.10 complete.

### Current code/test head after 8.10 touch-target work — 2026-11-01

- Latest UI/test commit: `2d25b12f100b246a929fc6921dfb44971f7d50e3`; documentation and continuity updates follow it.
- The only Quality run on the branch remains #41287868283 on older SHA `b6a3db77fb9bbf8375f8b9d9010365a0e9010158`, where Chromium was cancelled by the 15-minute job timeout. Later pushes have produced Provenance runs, but no Quality run on the current code/test head is visible.
- Request an `Independent Quality Sentinels` workflow-dispatch run on the current branch head. Do not mark the new 8.10 assertions or the full Chromium suite passed until that run completes.

### Chromium run #1125 diagnosis and correction batch — 2026-11-01

- Exact-head Quality run #1125 (`41289724442`) on `e0e0f80e678e6b418690ba9f33b808a29fe22fef`: Jekyll, Security, Static Analysis, Context and Integrity PASS. Chromium completed in 11 minutes and reported 78 passed, 38 failed, 2 flaky. Diagnostics were uploaded as artifact `playwright-diagnostics` (artifact ID `13077550536`). The published-site smoke steps were skipped because local Chromium failed.
- Confirmed stale E2E contracts corrected: provider settings are `#thirdPartyProviderSettings` (not retired `#legacyProviderSettings`); Research Studio is opened from `#functionsMenu` (not the sidebar); language changes use the visible header language menu (the backing `#uiLanguage` select is intentionally hidden); the aServi group is open by default; the Research menu has four options; the new-chat action is outside `#chatSection`.
- Provider connectivity checks send `Reply with exactly OK. No other words.` before a real chat. Test fixtures for multi-agent, 401, model fallback and web-search budgets now distinguish this probe from user requests so call counts assert the intended behavior.
- Confirmed source fixes: preserve a 54px clock face at <=360px instead of shrinking to 42px; ensure `.message-actions button.hidden` is actually hidden so the message-viewer speech action is absent for user messages.
- Additional test/CI corrections: project chat navigation now returns to the personal-chat scope before creating a personal chat; the status fixture answers connectivity probes immediately and only blocks the actual user request; the semantic ticker assertion uses the first matching track; CI uses 1 worker, a 30-minute Playwright global timeout and a 35-minute Chromium job timeout to reduce resource contention while retaining the full suite.
- Code/test commits in this correction batch include `003f2f3`, `7ff1e28`, `6fea65d`, `dfde158`, `6aca858`, `ffd5d7c`, `174747f`, `4f3e387`, `984de39`, `b91988d`, `2735e31`, `cbb6282`, `b59ac0f`, `7060ba6`, `b42797c`. These changes have not yet been exercised by a new Quality run.
- Remaining failures to verify after rerun: high-contrast disabled text state; aServi/provider/additional disclosure transitions; project/chat scope and handoff flows; message viewer actions; same-provider model fallback and 401 request count; new 44px touch targets. Native iPhone Safari, VoiceOver and measured WCAG contrast remain manual gates.
- PR #131 is still open and unmerged. GitHub currently reports `mergeable_state=dirty`; treat this as a merge-conflict blocker to investigate separately before any merge. No deployment was performed.

### 8.11 compact, separate theme and language controls — 2026-11-01

- Replaced the combined `☼ RU` dropdown with two adjacent controls: a compact icon-only theme toggle and a language selector showing the current locale. Both reuse the existing `.header-icon` design token, preserving equal 44px touch targets; language menu now contains language choices only.
- Updated `updateHomeThemeButton()` to localize accessible names/tooltips and expose the current theme with `aria-pressed`; theme switching remains immediate and persistent, language selection remains in the existing menu.
- Updated the shared theme-toggle helper and added E2E coverage for equal geometry, accessible names, narrow 320px overflow, theme switching, and language selection. A prior compact-group test now checks both controls separately.
- Code/test commits: `9433cca`, `6b7236e`, `669b808`, `652c3b4`. Browser execution remains pending; 8.11 is not marked complete until exact-head Quality/Chromium passes.


### Chromium run #1126 diagnosis and corrective batch — 2026-11-01

- Exact-head Quality run #1126 (`41291438804`) on `7cdf35d581d9d6bca39256e67a0b0db6083e486c`: Jekyll, Security, Static Analysis, Context and Integrity PASS. Chromium completed with 101 passed and 18 failed; diagnostics artifact ID `13077583320`. Published-site smoke was skipped after local Chromium failed.
- Confirmed contract drift in the remaining local-gateway tests: aLandi is configured in the separate aServi card, not the third-party provider preset. The aLandi provider, audio and PDF fixtures now configure aServi fields, answer the exact connectivity probe, and return a successful `/healthz` response before the user-path assertion.
- Corrected E2E assumptions: project settings leave the sidebar open; private memory controls require expanding `#memoryToolsDetails`; the project-create modal has two close actions; header language selection does not open the settings modal. Research Studio checkbox coverage now clicks its visible label.
- Source corrections: narrow 320px header uses reduced horizontal padding and compact wordmark; disabled text in the chat fixture receives the high-contrast token despite the chat container's ID-level styles; Research Studio close hides immediately and then cleans its matching browser-history entry.
- Corrective code/test commits include `53c384a`, `54e90c3`, `a793f5d`, `8302b8f`, `ecc5118`, `c9c1df9`, `929ebcf`, `6845b8a`, `e64cfad`. Current code/test head: `929ebcf20db87eca949c6f5a386c16e75f2856a1`; exact-head rerun is required before closing 8.11 or declaring the suite green.
- Remaining manual gates unchanged: native iPhone Safari/VoiceOver, multi-breakpoint screenshot review, and measured WCAG contrast ratios. PR remains open/unmerged; no deployment.


### aServi naming and deterministic script loading — 2026-11-01

- Renamed primary-route action identifiers and JS handlers to aServi; aligned app markup, Playwright selectors and Quality Sentinels static contracts. The first-party server card and status indicator use the `aservi*` DOM contract.
- Preserved existing `ai_alandi_cloud_*` localStorage keys as backwards-compatible storage identifiers. They are not user-facing labels; migration/deletion is deliberately avoided to protect existing connections.
- Updated the card/group label to `aLandi aServi`; Cloudflare remains a separate provider/infrastructure brand. `aLandi aCloudi` is reserved only as a possible future information-storage product name.
- Externalized the 48.1 KB app stylesheet and 10.4 KB public landing stylesheet into cacheable `assets/css/app.css` and `assets/css/landing.css`. This reduced `index.md` from 109.3 KB to 61.3 KB and `landing/index.html` from 26.1 KB to 15.8 KB without changing CSS rules.
- Changed Marked and DOMPurify script loading from `async` to ordered `defer`, ensuring both utilities execute in document order before the deferred application runtime. The app runtime remains external in `assets/js/app.js`; no inline executable JavaScript, framework, dependency or new build step was introduced.
- Static assertions were updated, but this is not a substitute for exact-head Chromium. Browser verification remains pending.


### Research Studio placement clarification — 2026-11-01

- Research Studio is not a standalone product area, sidebar item or top-level Functions entry. Its single entry point is nested directly under the effort/deep-research controls (`#deepResearchStudioButton`).
- The window remains a helper for configuring the active chat's research settings; it preserves the composer draft and does not start a request on open/close. The existing E2E suite follows this entry point.
- Roadmap visibility is intentional: planned sections/windows remain visible and can be configured ahead of runtime delivery. Under-development areas use the shared ticker; unavailable actions must not pretend to succeed or mutate user data.

- Project source management remains visible inside project settings and now has the shared roadmap ticker plus localized explanation; it does not expose fake source actions while the gateway source-list API is absent.
### Chromium contract correction — Research Studio and cancelled sidebar gestures (2026-11-01)

- Reconciled an E2E assertion left behind by the earlier navigation layout: `index.md` exposes Research Studio only through `#deepResearchStudioButton` under the deep-research controls; it is absent from both the sidebar and the Functions menu. The sidebar-order test now asserts that exact contract instead of expecting the retired Functions-menu entry.
- Extended the sidebar swipe regression: a vertical gesture must not close the sidebar; a horizontal gesture cancelled by `touchcancel` must also leave it open; only a completed deliberate horizontal swipe closes it. This preserves the browser's right to cancel touch input when it takes over scrolling or viewport manipulation.
- Test commits: `df4faa9ee8c57a458fef3804db2153297c325375` (Research Studio selector contract), `69ff6ad8b574fdcd05e9c292db2a6f02448996aa` (cancelled swipe coverage).
- Source research: Playwright recommends one CI worker for reproducibility, a bounded global timeout, and traces on the first retry rather than tracing every test. Modern Chrome Headless shares the browser implementation with headful Chrome. VisualViewport and touch/pointer cancellation remain distinct mobile behaviors; Chromium does not replace native iOS Safari/VoiceOver acceptance.
- Official references: https://playwright.dev/docs/ci ; https://playwright.dev/docs/best-practices ; https://playwright.dev/docs/trace-viewer-intro ; https://developer.chrome.com/docs/automation-and-testing/headless/ ; https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport ; https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action
- Validation boundary: the test source was updated and reviewed against the current markup/handler. No Playwright/Chromium run has been executed on this new head; this is not a test pass. Native iPhone Safari remains unverified.


### App identity and native theme metadata — 2026-11-02

- Replaced the stale root-app title `AI Mobile Agent v10.0` with `aLandi — личная AI-среда` in Jekyll front matter and the browser document title.
- Aligned the site-wide Jekyll title/description with aLandi and added a concise app description for browser/search metadata.
- Changed the app's `color-scheme` hint to `dark light`, matching the existing user-selectable light/dark themes instead of advertising dark-only controls.
- Added deterministic Quality Sentinel and Playwright assertions for the page title, description and color-scheme metadata. These assertions are committed but not yet executed in Chromium.
- No JavaScript runtime behavior, provider routing, stored data, dependencies or deployment settings were changed.


### GitHub repository hygiene checkpoint — 2026-11-02
- Read-only inventory at the major-slice boundary: main `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`; PR #131 was `5b9aa7abcc70fc1fa6f3c0fba402e025cb44c772` at the inventory snapshot.
- 126 branch refs and 9 open PRs; 117 refs are not open-PR heads and require individual PR/issue/ancestry/reference review before cleanup.
- Rulesets endpoint returned 0; classic main protection unknown (integration 403); delete-branch-on-merge disabled.
- Standard CODEOWNERS, SECURITY.md and Dependabot config files were not found; account-level security settings unverified.
- Provenance passed on the audit snapshot; exact-head Quality/Chromium absent. Previous Quality #1126 (101 passed / 18 failed) is stale.
- No deletion, settings mutation, rebase, force-push, merge or deployment. See `docs/REPOSITORY_HYGIENE_RU.md`.


### CSS cascade cleanup — 2026-11-02

- Removed 504 bytes of legacy CSS declarations that were unconditionally overridden later in the same stylesheet: the old body gradient, duplicate body font-family, the earlier focus outline rule and settings-surface background/border declarations superseded by theme tokens.
- Kept the effective system UI font stack, Tiffany focus-visible tokens, theme-driven surface colors, settings shadow and backdrop blur unchanged.
- Static CSS brace balance remains zero. This is a cascade/source cleanup; no browser visual regression run has been executed yet.



### aServi persistence compatibility note — 2026-11-02

- Added an inline source comment above ASERVI_STORAGE explaining that the ai_alandi_cloud_* localStorage names are intentionally retained persistence identifiers, not current product/UI labels.
- This prevents a future cleanup from silently renaming keys and disconnecting existing saved server settings. No migration or storage mutation was performed.



### Integrated UI and Graphify checkpoint — 2026-11-02

- Reconfirmed owner scope: finish the remaining applicable requirements inherited from sections 1–7 together with 8.1–8.17. Section 8.0 is the single open-work register; old V1 statuses remain historical and must not create a parallel queue.
- The existing polish register is a concise mirror, not an independent source of tasks. Detailed implementation/test evidence remains here; owner requirements remain in `V1_UI_FINALIZATION_RU.md`.
- Latest UI source checkpoint: `9aa74853478a6a680cdd36ab0f84c851721405a4`. Latest PR #131 branch head after the Graphify workflow change: `c8facdac2eebc7d2217b807f1b7e314ae3abf2dd`. The new workflow commit changes only path filters; it does not change app runtime behavior.
- Found and fixed a Graphify coverage gap: the code-only pilot now watches `assets/js/**/*.js`, `assets/css/**/*.css` and `landing/**/*.html` in both PR and main-push path filters. This is important because the app runtime and landing/app CSS are externalized from the original Markdown/HTML sources.
- Graphify has not yet been confirmed on this new head; inspect the run and artifact before recording graph metrics or architecture findings.
- Exact-head Quality/Chromium is still pending. No browser pass, merge or deployment is claimed.
- The next implementation pass must remain cross-cutting: sidebar/chat restoration, responsive header/composer, provider and settings state, modal/browser history/focus, message actions, explicit project handoff, touch behavior, semantic status/reduced motion, readable theme states, and truthful Research/Agents/Skills/Connectors surfaces.


### Windows Forced Colors accessibility — 2026-11-02

- Added a forced-colors media override: keyboard focus uses the system Highlight color, interactive controls use ButtonText borders, invalid controls use Mark, and status dots retain a CanvasText outline.
- Added a Playwright E2E contract using page.emulateMedia({ forcedColors: 'active' }) to verify the media mode and a visible 2px keyboard focus outline.
- The API is supported by the project's pinned Playwright 1.56.1 (forcedColors emulation has been available since Playwright 1.15). This test has been added but not executed yet.
- This complements the app's existing user-selectable high-contrast text preference; it does not claim native Windows assistive-technology acceptance.


## Product proposal audit — 2026-11-02

**Scope:** owner proposals 8.18–8.27 were compared with the current PR #131 source. They remain candidate improvements, not mandatory requirements. This is a source inspection, not a browser verification. The latest known runtime/source checkpoint remains 9aa74853478a6a680cdd36ab0f84c851721405a4; current PR branch head is later because of documentation/workflow commits.

| Proposal | Existing mechanism found in source | Actual gap / conflict to avoid | Recommendation |
|---|---|---|---|
| Unified interaction lifecycle | uiNavigationStack + History API; modal ids and individual closers; popstate restores project filters/modals; shared body scroll lock; topmost modal selection and focus handling. | Close paths and per-modal cleanup remain distributed. A second router/history stack would conflict with the existing one. | Consolidate behind the current manager in a bounded refactor; test outside-click, rapid cycles, focus return and scroll restoration before changing markup. |
| Notifications / operation states | One global toast node with replace-in-place display and fixed 2.4s timeout; separate searchStatus for active generation with elapsed time; aServi has its own probe state. | Toasts are not keyed to async operation IDs, errors also auto-dismiss, there is no queue or shared lifecycle. Multiple status surfaces can contradict each other. | Extend existing toast/status APIs with operation IDs and real pending/success/failure/cancel states; retain inline field errors and do not add another notification library. |
| Undo | Last deleted chat is saved locally and can be restored for 7 days. | Project deletion cascades to its chats and is explicitly irreversible; rename/move/settings have no general undo. A second chat restore feature would duplicate current behavior. | Add a small bounded command history only for local reversible operations. Do not promise undo for external provider calls. |
| Chat/project organization | Separate projectless/project chats; project filtering and back-to-all; project gear; chat menu with rename/clone/export/move/clear/delete. First user message sets initial title once; manual rename exists. Project memory is stored on project and has project-only/project-and-global scope. | No title search, pinning or user-defined folders were found. Avoid auto-renaming after manual rename and avoid a second memory store. | Start with local title search, pinning and stable sort. Defer folders until the flat collection model proves insufficient. |
| Adaptive workspace | Responsive single chat surface; mobile sidebar drawer; modal panels for project/settings/research. | No docked project/source inspector or multi-model comparison surface was found. | Use one DOM and CSS Grid with one optional desktop inspector as the first slice. Tablet gets a switchable panel; phone remains sequential. Model comparison requires explicit cost/privacy/concurrency design. |
| Files and sources | Composer stores pending File objects and data URLs in in-memory state; supports images/video frames/audio/docs and local-gateway extraction; chat/project export exists. Project Sources explicitly explains missing source-list API. Research trace can retain source URLs and metadata. | No persistent unified file library, reusable project-source list or first-class generated-file registry was found. A local OS path cannot be treated as a durable browser permission. | Define file metadata and provenance first. Separate origin from processing state. Keep Project Sources CRUD blocked until a real scoped source-list API exists. File System Access API is progressive enhancement only. |
| Contextual actions | Chat-row action menu, project gear, message copy/speech/view actions; provider/model selection and search are present. | File/model contextual action surfaces are incomplete. Global settings should not become a second object-action menu. | Extend existing object menus only when the action is real and supported. Keep primary actions visible and rare/destructive actions under ⋯. |
| Offline recovery | Chats/current chat persist to localStorage; corrupt history is backed up before replacement; storage failure is surfaced; last closed chat restore exists. isGenerating/isPreparingDocumentAttachments guard duplicate generation; retry is explicit. | Composer text is not persisted as a durable per-chat draft; attachment state is held in memory; current offlineToggle describes web-search mode, not network reachability. No provider-wide idempotency contract was found. | Add per-chat draft recovery and IndexedDB-backed blobs; add true online/offline status; never auto-resend. Explain uncertain remote acceptance on timeout. Add idempotency only where gateway/provider contract supports it. |
| Accessibility / one hand | 44px targets on several primary controls; reduced-motion CSS and user setting; readability scale/contrast; modal keyboard/history handling; sidebar swipe and touch-selection rules. | Full VoiceOver/iPhone Safari/Forced Colors and all-component hit-area/contrast review remain open. | Treat as a continuous acceptance gate, not a final cosmetic pass. Keep gestures local and cancel-safe; one-handed placement is lower priority. |
| Scenario-first UX | Thorough/deep research and nested Research Studio; project settings, explicit context handoff, composer attachment flow. | No dedicated end-to-end scenario entry points for research/file/project work were found. | Build around existing composer and contextual surfaces; avoid a new dashboard or wizard. Research Studio remains nested under deep research. |

### Important implementation facts

- showToast() writes to one shared node and uses a fixed timeout; it is not yet an operation lifecycle manager.
- showStatus() is tied to generation timing, but the toast system is separate. The new design must unify their semantics without hiding the useful elapsed-generation status.
- deleteChat() already stores the deleted chat in the last-closed-chat recovery slot; this is a useful Undo foundation, not a complete history.
- deleteCurrentProject() deletes its project chats after confirmation. It currently has no transactional restore.
- sendMessage() exits while generation/document preparation is active; this prevents local double invocation. It does not establish exactly-once delivery after an ambiguous network timeout to arbitrary third-party providers.
- Chat history is stored in localStorage. Draft text is not saved as a recoverable per-chat draft in the inspected runtime; pending attachment state is in memory.
- updateOfflineUI() describes the web-search mode. It is not a reliable online/offline connectivity indicator.
- Project Sources CRUD remains unsupported because the gateway lacks a scoped source-list API. Existing attachment handling must not be represented as persistent project sources.
- Existing source code keeps ai_alandi_cloud_* storage keys for compatibility. Repository/product branding cleanup must not rename persisted keys or break saved provider state.

### Repository identity audit

The repository still contains four GitHub Skills exercise workflows: .github/workflows/0-start-exercise.yml, 1-step.yml, 2-step.yml, 3-step.yml. They reference skills/exercise-toolkit and skills/action-*. The first workflow listens to pushes on main, has contents: write, and its dependent job creates/replaces _config.yml and index.md if the exercise workflow proceeds. The repository template flag and actual run history were not available in this audit, so the workflows were not removed. Verify both before cleanup. The associated .github/steps/1-step.md–4-step.md are exercise instructions; temp/1 and temp/2 are historical research notes with some GitHub Skills template references and must be reconciled/archived before any deletion. Issue #1 is already documented as a closed historical exercise.

Keep the actual aLandi task-profile files under skills/*.txt; they are not the GitHub Skills exercise scaffold. Preserve the Jekyll/Pages publishing mechanism and current Quality/Security/Graphify/deploy automation.

GitHub's repository rename guidance explicitly says project Pages URLs are not redirected by a rename. Therefore a rename to aLandi/alandi must wait for a stable custom domain and a migration checklist covering Jekyll baseurl, canonical/OG URLs, absolute links, OAuth redirect URIs, Pages publishing and published-site smoke.

### Open-source patterns reviewed — no dependencies added

- [KittyGiraudel/a11y-dialog](https://github.com/KittyGiraudel/a11y-dialog) — MIT, small framework-agnostic dialog helper; useful for focus/ARIA/close behavior. Reference only: current modal manager already exists and should be improved rather than replaced blindly.
- [nathancahill/split](https://github.com/nathancahill/split) — MIT, zero-dependency split-view sizing utilities; candidate only if the desktop inspector slice is approved and CSS Grid alone is insufficient.
- [agrinko/js-undo-manager](https://github.com/agrinko/js-undo-manager) — MIT, no-dependency command/transaction pattern; design reference, not a package recommendation without a current maintenance and integration review.
- [vscarpenter/scratchpad](https://github.com/vscarpenter/scratchpad) — useful local-first patterns for IndexedDB drafts, recovery and trash; repository license was not verified in this pass, so do not copy/vendor its code.
- [kea0811/headless-toast](https://github.com/kea0811/headless-toast) — useful state-store pattern for stable IDs, loading-to-success replacement, pause-on-focus and ARIA roles; its React-oriented API is not a reason to add React to aLandi.
- [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) — browser-native storage for structured data and Blob/File objects; suitable for larger drafts/attachments than localStorage.
- [MDN File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) — explicit picker/permission/handle model; secure-context and browser-support constraints mean this is an optional enhancement, not universal file-path access.
- [GitHub — Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository) — project Pages URLs are not automatically redirected; custom domain is recommended before rename.

**Dependency decision:** no external UI package was installed or vendored. First implement the smallest compatible patterns with the existing HTML/CSS/JavaScript stack. A library may be adopted only after license, maintenance, browser support, bundle impact and integration tests are checked.

### Recommended execution order

1. Close current 8.1–8.17 and inherited UI acceptance gaps; do not let optional features delay correctness of existing flows.
2. Implement one interaction contract and operation-state notifications (8.18–8.19).
3. Add draft recovery and connectivity/retry clarity (8.25), then focused long-chat performance work based on measurements.
4. Add chat title search, pinning and stable sorting (8.21); then extend contextual actions (8.24).
5. Add bounded Undo for the safest local operations (8.20).
6. Design file registry/provenance and obtain a real source-list API before file-library CRUD (8.23).
7. Prototype a single optional desktop inspector; only then evaluate multi-model comparison (8.22).
8. Refine scenario entry points without a new dashboard (8.27). Keep accessibility and real-device review continuous (8.26).

### 8.19 implementation slice — accessible notification queue (2026-11-02)

- Extended the existing `showToast()` mechanism; no third notification subsystem or dependency was added.
- Toast messages now enter a FIFO queue. Identical message/state pairs are deduplicated while active or queued, preventing rapid repeated events from silently replacing one another.
- Success/info, warning and error messages use differentiated visible durations (3.2s / 5.5s / 7s). The timer pauses while the toast is hovered, focused or the document is hidden; it resumes only when the user can see/interact with the page again.
- The existing toast remains non-modal and does not move focus. It is now keyboard-focusable so keyboard users can pause its timeout; CSS permits pointer interaction.
- Live-region semantics switch by urgency: ordinary notifications use `role=status` / `aria-live=polite`; errors use `role=alert` / `aria-live=assertive`. The live region is atomic.
- Focused Playwright assertions were added to the existing semantic-status scenario, including the FIFO transition from a success message to a subsequent error and the corresponding ARIA semantics.
- **Scope boundary:** this is only the notification presentation sub-slice of optional 8.19. It does not yet implement durable operation records/states, stable operation IDs, pending-to-result replacement, persistent unacknowledged errors, inline recovery actions or keyboard/composer-aware placement. Do not mark 8.19 complete.
- **Verification:** source changes and test assertions are committed; browser tests have not been executed in this environment. Exact-head workflow/status lookup returned no PR workflow runs and no commit statuses for the current source checkpoint. No test pass is claimed.
- Source files: `assets/js/app.js`, `assets/css/app.css`, `index.md`, `tests/e2e/app.spec.mjs`.
- Current source checkpoint at time of this note: `fed3137bae2355629a976515719f498940ad8601`.


### 2026-11-02 — Quality harness triage after split runtime extraction

- Investigated Independent Quality Sentinels run #1192 (ID `41348586700`) on old PR SHA `777fdcab442c9b8ebd8483e7bca7d776a022a260`.
- Integrity, Security, Context and Jekyll Build sentinels still searched the pre-extraction monolithic `index.md` for runtime code. The product runtime had already moved to `assets/js/app.js`; styles are in `assets/css/app.css` and `assets/css/landing.css`. Updated `scripts/quality-agents.mjs` to inspect the split assets, parse external JS without executing it, and verify sanitizer presence in the built runtime asset.
- The old Semgrep invocation passed `audit-reports/ui-inline-*.js` even when extraction produced zero inline scripts. Semgrep returned exit 2 with `Invalid scanning root`. Updated `.github/workflows/quality-sentinels.yml` to use Bash `nullglob`, a target array, and include `assets/js/app.js` in SAST.
- Static inspection confirms the positive source assertions now resolve against the intended HTML/JS/CSS assets. The repaired script/workflow have not yet run on the current HEAD.
- Ruff passed on old SHA `777fdcab442c9b8ebd8483e7bca7d776a022a260`. Bandit reported two low-confidence B608 medium-severity advisory findings: placeholder-only dynamic SQL clauses in `gateway/memory/manager.py` and bounded placeholder-count construction in `gateway/rag/lazy_graph_rag.py`; all user values remain bound parameters. No SQL change was justified.
- Old run #1192 Chromium remains in progress; it is not evidence for the newer HEAD. Current branch HEAD at time of this note: `515b3f62271027e69acc2d76f4ef40289fa9cfb8`; exact-head Quality/Chromium rerun is pending. No merge, rebase, deployment or destructive cleanup.



## Quality harness repair and owner-recommended reference audit — 2026-11-02

### Exact-head workflow triage

- User-started Quality run #1193 (ID 41349570822) was dispatched on SHA 5c45de5e728cb280ef9524ac1c45ee500f210138, not the later PR HEAD. Static analysis passed; Integrity, Security, Context and Jekyll sentinels failed at module parse time because the sanitizer assertion regex was over-escaped and invalid. Chromium was still in progress when inspected.
- Corrected the assertion to match whitespace and safeMarkdown call syntax in commit 37996b80300272f2d0e62f87e653f0840390f12a. This strengthens the intended assertion; it does not relax sanitizer checks.
- The first PROJECT_STATE YAML indentation correction exposed a second schema issue: owner_proposals and repository_identity_cleanup had been nested inside improvements, whose values must each carry a status. Commit 84948798d4fdcce1257dbaaddae0c4b39a754ffe restores them as sibling mappings. Provenance run #960 passed on that SHA.
- Current branch HEAD after the research/documentation batch is recorded in ORIENTER.md and project-reference/FILE_ORIENTER_RU.md. No Quality run exists for that current HEAD; no exact-head Quality/Chromium pass is claimed. Manually dispatch the workflow on the branch and inspect the full run before treating these fixes as verified.

### External references

- Evaluated Hermes Agent v0.22.2, ECC 2.2.3, screenshot-to-code, scroll-craft, ThinkRail, DeepTutor v1.7.1, Hallmark v2, qybaihe/bla, Qwenputer and Orbit candidates.
- Decisions and source links are in docs/TECHNIQUE_REGISTER_RU.md and docs/OPEN_SOURCE_TRIAGE_RU.md. Adopt only process patterns: TDD/fresh-context review, deny-by-default approvals, isolated worktrees, screenshot-based review, browser contrast/scroll QA and inspectable evidence.
- No package, service, model or runtime was installed. BLA anti-analysis/decoy behavior is explicitly excluded. Qwenputer is not a computer-use agent. agent.sys and the intended Orbit AI Agents project remain ambiguous.
- Product architecture remains static HTML/CSS/JavaScript + Jekyll/GitHub Pages + existing FastAPI gateway. No framework migration or new dependency.



## Latest state after harness/reference audit — 2026-11-02

- Current PR #131 HEAD: `9fc0948fee9d26390545748287475b3cc597d6da`; compare 587 ahead / 4 behind main; PR open/unmerged and mergeable=false.
- Provenance #962 passed on the prior state checkpoint SHA `21a8317d36c7ca4c66f04d5ada56553b3db75094`. It validates project metadata/provenance, not UI runtime.
- Quality #1193 is still associated with old SHA `5c45de5e728cb280ef9524ac1c45ee500f210138`; current HEAD has no Quality run. The next gate is a manual workflow_dispatch on the latest branch HEAD.
- No product runtime code was changed in this research/repair slice. No dependencies, agent runtimes or services were installed.

