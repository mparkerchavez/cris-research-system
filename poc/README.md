# CRIS PoC Frontend

Purpose: document the current frontend architecture so styling and UI behavior can be changed safely without reintroducing CSS sprawl.

## What changed

- Full class-rename migration to `cr-*` naming with explicit state classes (`is-*`, `state-view-*`).
- Filter panel cohesion pass completed (February 9, 2026):
  - Compression Chain is now single-select with toggle-off-to-all behavior.
  - Compression order is fixed to: Current Understanding, Weekly Learnings, Month Synthesis, Extractions, Raw Inputs, Other.
  - Tags remain multi-select (stacking) and continue to show top-15 global tags.
  - Filter controls use a flat outline style with consistent hover/active behavior across Compression, Tags, and Sort.
- Explore browser cohesion pass completed (February 9, 2026):
  - `cr-explore-browser` now uses a consistent panel/header/list rhythm aligned with Pulse and filter rail.
  - Explore file cards are flat, outline-first (`.cr-file-card--explore`) with restrained hover/selected states.
  - `cr-file-card-path` was removed from card rendering to keep the card focused on `type + title + meta`.
- Explore doc preview read-first pass completed (February 10, 2026):
  - `cr-doc-preview` now prioritizes vertical reading runway with a compact header stack.
  - Large tag sets are collapsed by default with an explicit `Show all tags / Show fewer` control.
  - Claim tracing moved to drawer-first flow (`Trace claims/citations`) with in-drawer claim list and lineage detail.
  - Persistent bottom claims panel was removed from the reading surface.
- Main nav update completed (February 12, 2026):
  - Main nav now has four destinations: Pulse, Ideas, Talking Points, Explore.
  - Verify has been removed from navigation and runtime view state.
  - The ticker bar under the top nav has been removed to reclaim vertical reading space.
  - View URLs are refresh-safe via query param routing:
    - `/` -> Pulse
    - `/?view=ideas` -> Ideas
    - `/?view=talking-points` -> Talking Points
    - `/?view=explore` -> Explore
    - `/?view=verify` -> redirected/normalized to Explore
    - `/?view=talkingpoints` -> redirected/normalized to Talking Points
    - `/?view=talking_points` -> redirected/normalized to Talking Points
  - Explore compression deep links are query-param driven:
    - Canonical format: `/?view=explore&compression=<slug>`
    - Supported slugs: `current-understanding`, `weekly-learnings`, `monthly-synthesis`, `extractions`, `raw-inputs`, `other`
    - Compression query state persists across view switches and restores when returning to Explore.
- Legacy layered CSS overrides removed and replaced with deterministic style modules:
  - `public/styles/tokens.css`
  - `public/styles/foundation.css`
  - `public/styles/layout.css`
  - `public/styles/shell.css`
  - `public/styles/components.css`
  - `public/styles/views.css`
  - `public/styles/responsive.css`
- Confirmed dead styling surfaces removed:
  - `pulseEvidenceList`, `latestList`, `focusTags` JS hooks and related render functions
  - matching dead CSS clusters for latest/focus/pulse-evidence
- Added style contract doc:
  - `STYLE_CONTRACT.md` (old→new map + dynamic class contract)
- Added unified evidence trace system doc (February 12, 2026):
  - `EVIDENCE_TRACE_SYSTEM.md` (shared drawer citation/provenance model, status policy, action semantics)
- Added architecture decision record (ADR) system (February 12, 2026):
  - `decisions/ADR_INDEX.md` (decision index + backfilled records)
  - `decisions/README.md` (process + confidence policy)
  - `decisions/ADR_TEMPLATE.md` (template for new decisions)
  - Includes both frontend decisions and cross-system historical backfill with `confirmed` vs `inferred` confidence.
- Added static audit script:
  - `scripts/style_audit.sh`

## Files to edit

- Tokens and typography:
  - `public/styles/tokens.css`
- Foundation/layout:
  - `public/styles/foundation.css`
  - `public/styles/layout.css`
- Shell and shared components:
  - `public/styles/shell.css`
  - `public/styles/components.css`
- View-level styling:
  - `public/styles/views.css`
- Breakpoints:
  - `public/styles/responsive.css`
- Style contract and guardrails:
  - `STYLE_CONTRACT.md`
  - `EVIDENCE_TRACE_SYSTEM.md`
  - `decisions/ADR_INDEX.md`
  - `decisions/README.md`
  - `scripts/style_audit.sh`
- Markup hooks (`id` wiring for `app.js`):
  - `public/index.html`

## Run locally

```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
python3 /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/server.py
```

If port `5179` is in use, stop the existing process first or run with a different port argument.

## Verification checklist

- Nav switches views: Pulse, Ideas, Talking Points, Explore.
- No ticker/sub-navigation bar is rendered below the top nav.
- Explore filters and search still work (type/tag/sort/clear).
- Compression filter behaves as single-select and toggle-off-to-all.
- Compression deep links hydrate Explore filter state from URL and stay in sync with filter clicks.
- Tag filters still stack across multiple selected tags.
- File selection updates preview and trace summary.
- Explore keeps markdown content as the primary vertical surface.
- Citation/claim tracing opens the right drawer from Explore reading view.
- Trace drawer shows claim index + lineage in one flow.
- Markdown/raw toggle works.
- Mobile layout remains usable at `768px` and `390px`.

### Explore validation checks

- Canonical checklist: `EXPLORE_VERIFY_PARITY_CHECKLIST.md`
- Select files with claims in Explore and confirm claim counts and metadata render correctly.
- Trace drawer claim list scan/readability remains consistent after each UI update.
- Citation expansion works in the Explore drawer workflow.
- Lineage opens and renders via the expected lineage payload structure.
- Source navigation from citations/lineage remains functional from Explore.
- Unified citation/provenance behavior follows `EVIDENCE_TRACE_SYSTEM.md`.
- Route behavior:
  - `/` opens Pulse.
  - `/?view=ideas` opens Ideas and persists on refresh.
  - `/?view=talking-points` opens Talking Points and persists on refresh.
  - `/?view=explore` opens Explore and persists on refresh.
  - `/?view=verify` normalizes to Explore.
  - `/?view=talkingpoints` and `/?view=talking_points` normalize to Talking Points.
  - Compression deep links open Explore with exactly one active type filter:
    - `/?view=explore&compression=current-understanding`
    - `/?view=explore&compression=weekly-learnings`
    - `/?view=explore&compression=monthly-synthesis`
    - `/?view=explore&compression=extractions`
    - `/?view=explore&compression=raw-inputs`
    - `/?view=explore&compression=other`
  - Invalid compression values are removed from URL during normalization.
  - Compression query state persists when switching to Pulse/Ideas/Talking Points and restores on return to Explore.

## Static style audit

Run the contract audit before shipping style changes:

```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc
./scripts/style_audit.sh
```

The audit checks:

- orphan CSS classes
- missing CSS definitions for classes referenced by HTML/JS
- JS IDs referenced but missing in HTML
- orphan tokens
- duplicate selectors (informational)

## Citation parser regression check

Run parser/linkage regression checks after citation or extraction-naming changes:

```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
python3 /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/regression_citation_parser.py
```

The regression check validates:

- extraction filename contract alignment with `_System/Extraction_Name_Mapping.md`
- new citation parsing (`Source_Slug DPx`, multi-source, WL references)
- citation resolution to extraction and weekly files
- metadata override handling (`<!-- cite:path=...;dp=... -->`)
- cache rebuild behavior when parser type/version changes
- frontend citation-context endpoint contract

## Citation contract preflight (blocking)

Run strict citation preflight before publishing synthesis updates:

```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
python3 /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/validate_citation_contract.py --file 06_Current_Understanding/Current_Synthesis.md
```

Validate all synthesis layers:

```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
python3 /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/validate_citation_contract.py --all-synthesis
```

The command exits non-zero on any citation contract failure.

## Prepublish lineage gate (single command)

Run the full blocking lineage gate before publishing CRIS deliverables:

```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/prepublish_lineage_gate.sh
```

This gate blocks publish on:

- latest weekly learnings citation contract violations
- current synthesis citation contract violations
- latest talking points citation contract violations
- citation parser/resolver regressions

## Canonical citation snippet generator

Generate copy-paste citation blocks from indexed extraction `source_id` values:

```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
python3 /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/generate_citation_snippet.py \
  --ref BCG_EmergingAgenticEnterprise:3,7 \
  --ref Anthropic_ClaudesConstitution:12
```

Output format:

- Bracket citation line with canonical source IDs
- One metadata line per source including exact path, `source_id`, and DP ids

## Wave 1 Final Closure (Stage 5)

Use `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/QA_WAVE1_SIGNOFF.md` as the official signoff artifact for:

- Atlas/manual end-to-end verification evidence
- Accessibility and performance sanity checks
- Defect triage loop (blocking/high/minor)
- Final closure decision
- Post-signoff final polish notes
- Wave 1.2 citation-context notes and fallback behavior

### Closure status

- [x] Stage 1-4 implementation complete
- [x] Wave 1.1 drawer + typography refinements complete
- [x] Stage 5 manual verification evidence captured
- [x] Stage 5 accessibility/performance confirmation complete
- [x] Final Wave 1 signoff complete

### Reporting workflow

1. Run the app locally and execute the full checklist in `QA_WAVE1_SIGNOFF.md`.
2. Log defects in the defect table with severity and reproducible steps.
3. Apply fixes, re-test only impacted sections, then update table status.
4. Mark final decision in the signoff file once all acceptance criteria pass.
