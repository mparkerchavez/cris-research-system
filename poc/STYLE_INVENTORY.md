# Style Inventory

Snapshot after cleanup and class rename.

## Style modules

- `public/styles/tokens.css`
- `public/styles/foundation.css`
- `public/styles/layout.css`
- `public/styles/shell.css`
- `public/styles/components.css`
- `public/styles/views.css`
- `public/styles/responsive.css`

## Runtime class families

- Shell/frame: `cr-shell-*`, `cr-filter-*`, `cr-main-layout`, `cr-content-area`
- Views: `cr-view-*`, `cr-pulse-*`, `cr-observe-*`, `cr-ideas-*`
- Document surfaces: `cr-doc-*`, `cr-inset-tray*`, `cr-file-*`, `cr-file-card--explore`, `cr-claim-*`
- Drawers and lineage: `cr-drawer*`, `cr-lineage-*`
- Citation context: `cr-citation-*`
- Utility: `cr-text-label`, `cr-meta-cluster`, `cr-divider-row`

## State classes

- View state on body: `state-view-pulse`, `state-view-ideas`, `state-view-talking-points`, `state-view-explore`
- Selection/open states: `is-active`, `is-selected`, `is-open`, `is-drawer-open`
- Rendering/status variants: `is-raw`, `is-markdown`, `is-plain`, `is-compact`, `is-linked`, `is-ambiguous`, `is-unresolved`, `is-warning`, `is-dp`, `is-extraction`, `is-high`, `is-confidence`

## Current interaction contracts

- Main navigation: Pulse/Ideas/Talking Points/Explore only (`.cr-shell-nav-link`).
- View routing: query-param based (`/`, `/?view=ideas`, `/?view=talking-points`, `/?view=explore`, legacy `/?view=verify` -> Explore, legacy `talkingpoints`/`talking_points` -> Talking Points).
- Explore compression routing: `/?view=explore&compression=<slug>` where slug is one of `current-understanding`, `weekly-learnings`, `monthly-synthesis`, `extractions`, `raw-inputs`, `other`.
- Compression query state is preserved when switching views and rehydrated when returning to Explore.
- Compression Chain: single-select (`0..1` active type), toggle active item off to clear.
- Tags: multi-select stacking (top-15 global frequency list).
- Sort: mutually exclusive single-select.
- Filter panel controls: flat outline-first interaction style (no raised shadows).
- Explore reading: compact header + metadata tray, with tag overflow collapse and drawer-first trace flow.

## JS-to-DOM ID contract

All IDs referenced via `$("...")` in `public/app.js` are present in `public/index.html`.

## Removed dead surfaces

- `pulseEvidenceList`
- `latestList`
- `focusTags`
- render functions: `renderPulseEvidenceGlance`, `renderLatestList`, `renderFocusTags`, and associated data helpers.
- Explore file card path row (`cr-file-card-path`) removed from rendering contract.
- Explore bottom claims tray (`cr-lineage-panel*`) removed from reading layout; trace lives in drawer surface.
- Ticker bar surface removed (`cr-shell-ticker`, `cr-shell-ticker-item`, `cr-shell-ticker-label`, `cr-shell-ticker-value`, `cr-shell-ticker-divider`).
