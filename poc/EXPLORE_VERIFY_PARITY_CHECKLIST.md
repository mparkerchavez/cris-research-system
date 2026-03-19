# Explore Validation Checklist

Purpose: validate Explore browse-first behavior now that Verify has been removed.

## Core explore scenarios

- [ ] `File selection with claims`: selecting a file loads the correct claim count and trace summary.
- [ ] `Trace claim scanability`: drawer claim list text, DP refs, and citation counts remain readable.
- [ ] `Citation expansion`: citation disclosure and compact context render without errors.
- [ ] `Lineage open`: selecting a drawer claim opens lineage and reflects the selected claim index.
- [ ] `Source navigation`: citation/source buttons route back to the expected file path.
- [ ] `Compression chain`: only one type can be active at a time; clicking active type clears type filtering.
- [ ] `Tag filters`: multiple tags can be active simultaneously and filters stack correctly.

## Explore reading behavior

- [ ] Reading view shows markdown content space immediately for high-claim files.
- [ ] Explore has no persistent bottom claims tray.
- [ ] Header metadata supports large tag sets using collapsed-by-default tags with explicit expand/collapse.
- [ ] Citation/claim trace attempts open the right drawer from reading view.
- [ ] Claim focus remains synchronized with the selected lineage in the drawer.

## Unified evidence trace behavior

- [ ] Takeaway, Trend, and Lineage all render source-based evidence bundles (statement -> source -> DP -> actions).
- [ ] Actions use standardized labels: `View source` (extraction), `View original` (raw source).
- [ ] `View original` appears when raw source resolves to a local path or URL.
- [ ] Unresolvable raw source shows text fallback (`Raw source: ...`) without broken action buttons.
- [ ] Lineage shows exception-only status: no `Linked` badges in default state.
- [ ] Lineage claim overview warning appears only when unresolved lineage exists.
- [ ] Lineage overview chips are ordered `DPs`, `Extractions`, `Raw Sources`, then `Issues`.
- [ ] Lineage `Issues` chip is hidden when issue count is zero.

## Routing behavior

- [ ] Top nav shows exactly three links: Pulse, Explore, Ideas.
- [ ] No ticker/sub-navigation bar appears below the top nav.
- [ ] `/?view=explore` loads Explore and remains Explore on refresh.
- [ ] `/?view=ideas` loads Ideas and remains Ideas on refresh.
- [ ] `/?view=verify` redirects to Explore and normalizes URL state.
- [ ] Compression deep links load Explore and activate exactly one matching type filter:
  - [ ] `/?view=explore&compression=current-understanding`
  - [ ] `/?view=explore&compression=weekly-learnings`
  - [ ] `/?view=explore&compression=monthly-synthesis`
  - [ ] `/?view=explore&compression=extractions`
  - [ ] `/?view=explore&compression=raw-inputs`
  - [ ] `/?view=explore&compression=other`
- [ ] Invalid `compression` values are normalized by removing the query param.
- [ ] Compression selection updates the URL; toggling active type off removes `compression`.
- [ ] Browser back/forward restores both `view` and `compression` state.
- [ ] `compression` query param persists across Pulse/Ideas view switches and restores when returning to Explore.

## Regression checks

- [ ] `./scripts/style_audit.sh` passes with no missing CSS classes or missing JS IDs.
- [ ] `python3 /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/regression_citation_parser.py` passes.
