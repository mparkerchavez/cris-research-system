# Style Contract

Purpose: define the current frontend styling contract after the aggressive CSS cleanup and full class rename.

## Naming System

- Component/structure classes use `cr-*`.
- Stateful modifiers use `is-*`.
- Body view-state classes use `state-view-*` and are controlled by `setView()` in `public/app.js`.

## Dynamic State Classes

These are intentionally runtime-driven from JavaScript and must remain supported in CSS:

- View state on `<body>`: `state-view-pulse`, `state-view-ideas`, `state-view-talking-points`, `state-view-explore`
- Drawer/body state: `is-open`, `is-drawer-open`
- Selection/activity states: `is-active`, `is-selected`
- Explore tag visibility state: `is-expanded`
- Document mode states: `is-markdown`, `is-raw`
- Idea/citation/lineage states:
  - `is-confidence`, `is-high`
  - `is-warning`, `is-dp`, `is-extraction`
  - `is-linked`, `is-ambiguous`, `is-unresolved`, `is-empty`, `is-missing`, `is-highlight`
  - `is-plain`, `is-compact`

## ID Contract

- IDs remain the runtime wiring contract for `public/app.js`.
- Do not rename/remove IDs without updating JS refs in the same change.

## Color Token Contract

- Color tokens are layered: `primitive -> semantic -> compatibility aliases -> selector usage`.
- Primitive tokens (`--color-*`) are the only place raw palette values belong.
- Semantic tokens (`--surface-*`, `--border-*`, `--text-*`, `--state-*`, `--overlay-*`, `--gradient-*`) are the only color tokens selectors should use.
- Compatibility alias tokens (`--accent-*`, `--idea-*`, legacy `--surface-*`) remain temporary bridges and should not be used for new work when a semantic token exists.
- `public/styles/foundation.css`, `public/styles/shell.css`, `public/styles/components.css`, and `public/styles/views.css` should not contain raw `#hex` or `rgb/rgba` literals.
- New component-level styles should consume semantic tokens only; add/adjust primitives and semantic roles in `public/styles/tokens.css` first, then map selectors.

## Card Language Contract

- Card styling is layered: `card foundation tokens -> shared recipes -> component variants`.
- Shared card foundation tokens live in `public/styles/tokens.css`:
  - `--card-surface-*`, `--card-border-*`, `--card-shadow-*`
  - `--card-radius`, `--card-padding`
- Citation disclosure cards (`.cr-citation-item`, `.cr-citation-summary`) must use neutral-first surfaces. Status color belongs to badges and thin accents, not full-card tint fills.
- Card density should be compact and consistent:
  - predictable row rhythm
  - stable header/meta/toggle alignment
  - no variant-specific reflow that changes interaction target shape
- Geometry cadence should stay consistent across reusable card surfaces:
  - drawer sections (`.cr-drawer-doc-section`)
  - citation cards (`.cr-citation-item`)
  - trend cards (`.cr-trend-card`)
  - claim and idea list cards (`.cr-claim-item`, `.cr-idea-list-item`)
- When adding a new card variant:
  - do: map to shared `--card-*` tokens first
  - don't: introduce one-off border radius/shadow/surface literals

## Clickable Interaction Contract

- Interactive styling is layered: `interaction tokens -> archetype recipes -> component selectors`.
- Use interaction tokens from `public/styles/tokens.css`:
  - `--interactive-surface-*`, `--interactive-border-*`, `--interactive-text-*`
  - `--interactive-shadow-*`, `--interactive-focus-*`, `--interactive-transition`
  - `--interactive-inverse-*` for dark panel controls
- Shared interaction recipes live in `public/styles/components.css`; avoid redefining hover/focus/active behavior in view-specific files unless it is a true variant.

Required states by archetype:
- `Action Button` (`.cr-btn`, `.cr-shell-nav-link`): `rest`, `hover`, `focus-visible`, `active/current`, `disabled` (when supported).
- `Toggle/Filter` (`.cr-filter-item`, `.cr-filter-tag`): `rest`, `hover`, `focus-visible`, `active/pressed`.
- `Selectable Card` (`.cr-file-card`, `.cr-claim-item`, `.cr-idea-list-item`, `.cr-idea-card`, `.cr-observe-card`): `rest`, `hover`, `focus-visible`, `selected/active`.
- `Disclosure` (`.cr-citation-details > summary`): `rest`, `hover`, `focus-visible`, `open`.

Behavior and semantics:
- Prefer native controls (`button`, `a`, `summary`, `select`) for anything clickable.
- If a non-native container must stay clickable, require `role="button"` + `tabindex="0"` and Enter/Space activation parity in JS.
- Ensure selected/current states expose semantics:
  - `aria-current="page"` for active top nav link
  - `aria-pressed` for toggle-like controls and selectable button items
- Avoid one-off interaction styling; add to the global recipe first, then apply per-selector variants only when needed.

## Main Navigation Contract

- Top nav (`.cr-shell-nav`) is the only global navigation surface.
- Top nav links (`.cr-shell-nav-link`) include exactly:
  - Pulse
  - Ideas
  - Talking Points
  - Explore
- Verify has been removed and must not be reintroduced as a nav link or view state.
- The ticker bar/sub-navigation surface has been removed and must not be reintroduced (`.cr-shell-ticker*`).
- URL routing behavior is view-query driven:
  - `/` => Pulse
  - `/?view=ideas` => Ideas
  - `/?view=talking-points` => Talking Points
  - `/?view=explore` => Explore
  - `/?view=verify` => normalized to Explore (legacy compatibility)
  - `/?view=talkingpoints` => normalized to Talking Points
  - `/?view=talking_points` => normalized to Talking Points
- Explore compression deep-link behavior is query-param driven:
  - canonical format: `/?view=explore&compression=<slug>`
  - supported slugs:
    - `current-understanding`
    - `weekly-learnings`
    - `monthly-synthesis`
    - `extractions`
    - `raw-inputs`
    - `other`
  - invalid `compression` values are normalized by removing `compression`
  - `compression` query state is intentionally preserved when switching to Pulse/Ideas/Talking Points and rehydrated when returning to Explore

## Filter Panel Contract

- Left rail (`.cr-filter-panel`) remains an inverse-theme control surface with flat outline controls (no raised/3D button effects).
- Compression Chain (`#compressionList`) behavior:
  - single-select only (`0..1` active type at a time)
  - clicking the active type clears type filtering (returns to all types)
  - display order is fixed:
    1. Current Understanding
    2. Weekly Learnings
    3. Month Synthesis (label) / Monthly Synthesis (type key)
    4. Extractions
    5. Raw Inputs
    6. Other
  - URL sync:
    - selecting a compression item sets `compression=<slug>` in URL
    - selecting the active item again clears the type filter and removes `compression`
    - clearing filters removes `compression`
- Tags (`#tagsList`) behavior:
  - multi-select stacking remains enabled
  - list is sourced from the top 15 most frequent tags across indexed files
- Sort (`#sortList`) remains mutually exclusive single-select.
- Hover/active state recipe for Compression, Tags, and Sort must stay consistent and be driven by shared inverse interaction tokens in `public/styles/tokens.css` and selectors in `public/styles/components.css`.

## Drawer Experience Contract

- Drawer styling is layered: `drawer role tokens -> drawer primitives -> status variants -> usage`.
- Shared drawer shell classes (`.cr-drawer`, `.cr-drawer-panel`, `.cr-drawer-header`, `.cr-drawer-body`) define entry/exit behavior and should not be redefined per drawer type.
- Shared drawer primitives are the only supported structure for content payloads:
  - `.cr-drawer-doc`, `.cr-drawer-doc-identity-row`, `.cr-drawer-doc-kicker`, `.cr-drawer-doc-meta`
  - `.cr-drawer-doc-lead`, `.cr-drawer-doc-lead-text`
  - `.cr-drawer-doc-section`, `.cr-drawer-doc-section-title`, `.cr-drawer-doc-section-body`
  - `.cr-drawer-doc-stack`

Canonical anatomy:
- `Header -> Identity Row -> Hero/Lead -> Section Stack -> Actions/Evidence`

Header titling rule:
- Drawer header title is the drawer type label (for example: `Active Idea`, `Key Takeaway`, `Lineage Trace`).
- The specific record/item title appears in drawer content (identity/lead area), not as the header title.
- Do not repeat the exact drawer type label again as the first content eyebrow directly under the header.

### Drawer Role Mapping (Current)

| Surface | Identity Row | Lead Block | Section Stack |
| --- | --- | --- | --- |
| Takeaway drawer | `citation count` | hero title (`.cr-drawer-doc-takeaway-title`) | `Detail`, `Citations` |
| Idea drawer | `Idea synthesis + evidence/open question counts` | `Summary` in `.cr-drawer-doc-lead` | `Drivers`, `Top Evidence`, `Open Questions` |
| Lineage drawer | `Provenance trail + supporting node count` | `Claim` in `.cr-drawer-doc-lead` | status node cards (`Issue`, `DP`, `Extraction`, `Raw`) |

Required drawer states:
- `closed`, `open`, `backdrop active`, `scrollable body`, `focus-visible close action`

Required citation states inside drawer-like contexts:
- `rest`, `hover`, `focus-visible`, `open`

Color and semantics rules:
- Link/accent orange is reserved for actionable affordances (buttons/links/focus contexts), not static headings.
- Non-interactive labels and kickers must use drawer role tokens (`--drawer-label-color`, `--drawer-label-color-strong`, `--drawer-meta-color`).
- Drawer section titles (`.cr-drawer-doc-section-title`) use `--drawer-section-title-color` for consistent branded hierarchy across drawers.
- Lineage status meaning is conveyed by variant tokens only (`--drawer-status-*`) via left rail + tint + label color, not by changing component structure.
- Citation summary source labels are non-clickable text; navigation actions belong only in citation body action rows.

Behavior and semantics:
- Right-side overlays (`lineage`, `idea`, `takeaway`) keep shared shell semantics with `is-open`.
- Avoid mixing page-level document styles (`.cr-doc-*`) inside drawer payloads unless the class is explicitly part of the drawer primitive contract.

Do/Don't guardrails:
- Do: add new drawer visual decisions at token level first (`public/styles/tokens.css`), then consume via primitives.
- Do: keep section spacing, typography, and card geometry consistent by role across all drawer surfaces.
- Don't: introduce one-off drawer heading colors tied to accent/link tokens.
- Don't: create drawer-specific typography classes when an existing role token can express the need.

## Explore Experience Contract

- Explore now owns the primary browse + trace experience in a single reading surface:
  - Read-first by default, with markdown as the dominant vertical surface.
  - Claims/citation tracing is always available while reading via drawer-first actions.
- Explore browser (`.cr-explore-browser`) is the canonical file-navigation surface:
  - Header stack order remains `search -> filter summary -> active filter chips`.
  - File list remains a continuous scroll surface (no grouped sections).
  - File cards use the Explore variant class (`.cr-file-card--explore`) with flat outline-first states.
  - Selected file cards use `outline + soft tint` (no thick left rail treatment).
  - File cards show `type + title + meta`; path row is intentionally removed from the card body.
- Explore doc preview (`.cr-doc-preview`) structure remains:
  - `header row (type/title + actions) -> metadata tray -> markdown content`.
  - Header actions remain top-right: `View Markdown/View Preview`, `Copy Markdown`.
  - Filename copy action remains icon-only in metadata row.
  - Tag overflow is collapsed by default with explicit expand/collapse control.
- Trace workspace in Explore is drawer-first:
  - `Trace claims/citations` opens the right drawer.
  - Drawer anatomy remains `claims list -> lineage trace`.
  - Citation click inside markdown opens the same drawer flow and focuses the selected claim.
- No persistent bottom claims tray should consume reading height in Explore.
- Verify has been removed. Explore is the only claim-trace workspace.

## Pulse Source Mapping

Pulse is a composed view with fixed section ownership. Each section has a single source of truth.

| Pulse Section | Source File | Source Section |
| --- | --- | --- |
| Current Position | `06_Current_Understanding/Current_Synthesis.md` | `## Summary` |
| Key Takeaways | `06_Current_Understanding/Current_Synthesis.md` | `## Key Takeaways` |
| Trends | latest `03_Weekly_Learnings/.../WL_YYYY-MM-DD.md` | `## Synthesis by Tag` |
| Open Threads | latest `03_Weekly_Learnings/.../WL_YYYY-MM-DD.md` | `## Open Threads` |
| Reflection | latest `03_Weekly_Learnings/.../WL_YYYY-MM-DD.md` | `## Reflection` |

Rules:
- Pulse does not consume `06_Current_Understanding/_Index.md`.
- Pulse does not render `Active Ideas` or `Observe Next`; those belong to the Ideas experience.
- Trends are rendered as editorial cards (`.cr-trend-card`) with this anatomy:
  - tag chip (`.cr-trend-tag`)
  - concise summary paragraph (`.cr-trend-summary`)
  - optional callouts (`.cr-trend-callout`) for `What Shifted` / `What Held Steady`
  - optional connection list (`.cr-trend-connection-list`)
  - explicit open action (`.cr-btn.cr-btn--sm` with `data-trend-index`)
- Trend deep-read uses a drawer (`#trendDrawer`) and follows this anatomy:
  - identity row (`tag + subtrend/citation counts`)
  - lead summary
  - optional callout/connection sections
  - subtrend stack (`.cr-trend-subtrend-list`) where each subtrend card owns its citation host
- One trend can contain multiple subtrends.
- Each subtrend owns its own citation context payload and citation disclosure UI.
- Citation metadata comments (`<!-- cite:... -->`) are parser-level artifacts and must not be shown in Pulse UI text.

## Old to New Class Map

The complete deterministic class rename map used for this migration is below.

```tsv
app	cr-app
main-layout	cr-main-layout
content-area	cr-content-area
topbar	cr-shell-topbar
brand	cr-shell-brand
brand-logo	cr-shell-brand-logo
brand-wordmark	cr-shell-brand-wordmark
topbar-nav	cr-shell-nav
nav-link	cr-shell-nav-link
topbar-actions	cr-shell-actions
status-indicator	cr-shell-status
status-dot	cr-shell-status-dot
control-panel	cr-filter-panel
control-section	cr-filter-section
control-section-title	cr-filter-section-title
control-list	cr-filter-list
control-item	cr-filter-item
control-item-label	cr-filter-item-label
control-item-radio	cr-filter-item-radio
control-item-count	cr-filter-item-count
control-item-check	cr-filter-item-check
control-tag	cr-filter-tag
btn	cr-btn
btn-small	cr-btn--sm
btn-ghost	cr-btn--ghost
meta-cluster	cr-meta-cluster
signal-pill	cr-signal-pill
pulse-view	cr-view-pulse
explore-view	cr-view-explore
ideas-view	cr-view-ideas
pulse-layout	cr-pulse-layout
pulse-main	cr-pulse-main
pulse-section	cr-pulse-section
pulse-position	cr-pulse-position
synthesis-kicker	cr-synthesis-kicker
synthesis-headline	cr-synthesis-headline
synthesis-lede	cr-synthesis-lede
synthesis-summary	cr-synthesis-summary
synthesis-meta	cr-synthesis-meta
synthesis-takeaways	cr-synthesis-takeaways
section-header	cr-section-header
section-title	cr-section-title
section-action	cr-section-action
weekly-delta-list	cr-weekly-delta-list
weekly-delta-item	cr-weekly-delta-item
weekly-delta-main	cr-weekly-delta-main
weekly-delta-category	cr-weekly-delta-category
weekly-delta-title	cr-weekly-delta-title
weekly-delta-detail	cr-weekly-delta-detail
pulse-open-threads-list	cr-open-threads-list
pulse-open-thread-item	cr-open-thread-item
pulse-open-thread-rank	cr-open-thread-rank
pulse-open-thread-body	cr-open-thread-body
pulse-open-thread-title	cr-open-thread-title
pulse-open-thread-detail	cr-open-thread-detail
ideas-grid	cr-ideas-grid
idea-card	cr-idea-card
idea-card-status	cr-idea-card-status
idea-card-title	cr-idea-card-title
idea-card-rule	cr-idea-card-rule
idea-card-summary	cr-idea-card-summary
idea-card-meta	cr-idea-card-meta
idea-pill	cr-idea-pill
observe-grid	cr-observe-grid
observe-card	cr-observe-card
observe-card-question	cr-observe-card-question
observe-card-meta	cr-observe-card-meta
observe-card-idea	cr-observe-card-idea
observe-card-date	cr-observe-card-date
file-browser	cr-explore-browser
browser-header	cr-explore-browser-header
search-input	cr-search-input
filter-summary	cr-filter-summary
filter-summary-left	cr-filter-summary-left
filter-count	cr-filter-count
filter-hint	cr-filter-hint
filter-chips	cr-filter-chips
filter-chip	cr-filter-chip
file-list	cr-file-list
file-card	cr-file-card
file-card-header	cr-file-card-header
file-card-title	cr-file-card-title
file-card-date	cr-file-card-date
file-card-type	cr-file-card-type
file-card-meta	cr-file-card-meta
file-card-variant-explore	cr-file-card--explore
doc-preview	cr-doc-preview
empty-state	cr-empty
empty-state-title	cr-empty-title
empty-state-text	cr-empty-text
doc-header	cr-doc-header
doc-eyebrow	cr-doc-eyebrow
doc-title	cr-doc-title
doc-rule	cr-doc-rule
inset-tray	cr-inset-tray
inset-tray-grid	cr-inset-tray-grid
inset-tray-item	cr-inset-tray-item
doc-meta-line	cr-doc-meta-line
doc-tags	cr-doc-tags
doc-tag	cr-doc-tag
doc-actions	cr-doc-actions
doc-content	cr-doc-content
lineage-panel	cr-lineage-panel
lineage-panel-header	cr-lineage-panel-header
lineage-panel-title	cr-lineage-panel-title
lineage-panel-hint	cr-lineage-panel-hint
claim-list	cr-claim-list
claim-item	cr-claim-item
claim-item-text	cr-claim-item-text
claim-item-meta	cr-claim-item-meta
claim-item-support	cr-claim-item-support
claim-citation	cr-claim-citation
drawer	cr-drawer
drawer--lineage	cr-drawer--lineage
drawer--idea	cr-drawer--idea
drawer--takeaway	cr-drawer--takeaway
drawer-backdrop	cr-drawer-backdrop
drawer-panel	cr-drawer-panel
drawer-header	cr-drawer-header
drawer-title	cr-drawer-title
drawer-body	cr-drawer-body
drawer-doc	cr-drawer-doc
drawer-doc--lineage	cr-drawer-doc--lineage
drawer-doc--idea	cr-drawer-doc--idea
drawer-doc--takeaway	cr-drawer-doc--takeaway
drawer-doc-identity-row	cr-drawer-doc-identity-row
drawer-doc-kicker	cr-drawer-doc-kicker
drawer-doc-meta	cr-drawer-doc-meta
drawer-doc-stack	cr-drawer-doc-stack
drawer-doc-lead	cr-drawer-doc-lead
drawer-doc-lead-text	cr-drawer-doc-lead-text
drawer-doc-section	cr-drawer-doc-section
drawer-doc-section-title	cr-drawer-doc-section-title
drawer-doc-section-body	cr-drawer-doc-section-body
drawer-node	cr-drawer-node
drawer-node-actions	cr-drawer-node-actions
lineage-lead	cr-lineage-lead
lineage-lead-kicker	cr-lineage-lead-kicker
lineage-lead-text	cr-lineage-lead-text
lineage-step	cr-lineage-step
lineage-step-label	cr-lineage-step-label
lineage-step-body	cr-lineage-step-body
lineage-step-meta	cr-lineage-step-meta
ideas-layout	cr-ideas-layout
ideas-list-panel	cr-ideas-list-panel
ideas-list-header	cr-ideas-list-header
ideas-list-meta	cr-ideas-list-meta
ideas-list	cr-ideas-list
ideas-detail	cr-ideas-detail
idea-detail-content	cr-idea-detail-content
idea-list-item	cr-idea-list-item
idea-list-title	cr-idea-list-title
idea-list-updated	cr-idea-list-updated
idea-list-meta	cr-idea-list-meta
idea-list-tags	cr-idea-list-tags
idea-list-tag	cr-idea-list-tag
idea-list-counts	cr-idea-list-counts
idea-detail-header	cr-idea-detail-header
idea-detail-kicker	cr-idea-detail-kicker
idea-detail-title	cr-idea-detail-title
idea-detail-meta	cr-idea-detail-meta
idea-detail-tags	cr-idea-detail-tags
idea-detail-tag	cr-idea-detail-tag
idea-detail-updated	cr-idea-detail-updated
idea-detail-actions	cr-idea-detail-actions
idea-detail-section	cr-idea-detail-section
idea-detail-section-title	cr-idea-detail-section-title
idea-detail-section-body	cr-idea-detail-section-body
idea-detail-list	cr-idea-detail-list
citation-context-host	cr-citation-host
citation-context-list	cr-citation-list
citation-context	cr-citation-item
citation-context-item	cr-citation-details
citation-context-summary	cr-citation-summary
citation-source	cr-citation-source
citation-summary-meta	cr-citation-summary-meta
citation-summary-toggle	cr-citation-summary-toggle
citation-dp-chips	cr-citation-dp-chips
citation-dp-chip	cr-citation-dp-chip
citation-status	cr-citation-status
citation-status-badge	cr-citation-status-badge
citation-status-meta	cr-citation-status-meta
citation-context-body	cr-citation-body
citation-dp-context-list	cr-citation-dp-list
citation-dp-context	cr-citation-dp-item
citation-dp-header	cr-citation-dp-header
citation-dp-id	cr-citation-dp-id
citation-dp-claim	cr-citation-dp-claim
citation-dp-anchor	cr-citation-dp-anchor
citation-dp-citation	cr-citation-dp-citation
citation-context-note	cr-citation-note
citation-candidates	cr-citation-candidates
citation-actions	cr-citation-actions
text-label	cr-text-label
editorial-row	cr-divider-row
view-pulse	state-view-pulse
view-explore	state-view-explore
view-ideas	state-view-ideas
view-talking-points	state-view-talking-points
drawer-open	is-drawer-open
```
