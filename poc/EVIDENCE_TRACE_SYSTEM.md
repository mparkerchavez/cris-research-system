# Evidence Trace System (Drawers)

Purpose: document the shared citation/provenance interaction model across Pulse and Explore drawers so future work extends one system instead of reintroducing one-off patterns.

Last updated: February 12, 2026.

## Scope

This document covers evidence/citation experiences in:

- Pulse `Key Takeaway` drawer
- Pulse `Trend` drawer
- Explore `Lineage Trace` drawer

It does not cover backend parser implementation details except where frontend behavior depends on backend fields.

## Core User Job

Across all three drawers, users are doing the same task:

1. Understand a statement.
2. Inspect supporting data points (DPs).
3. Trace DPs to extraction source(s).
4. Optionally open original raw source(s).

This is the system invariant. Any UI change should preserve this reading flow.

## Canonical Information Architecture

The unified interaction grammar is statement-first:

1. Statement context
2. Evidence bundles (one per source/extraction)
3. DP details
4. Source actions
5. Issues (when present)

## Key Decisions (And Why)

1. One shared renderer for citation/provenance bundles.
- Why: remove divergent behavior between Takeaway, Trend, and Lineage.
- Outcome: shared rendering and status behavior in `public/app.js`.

2. Standardized source actions.
- `View source` = extraction/source file.
- `View original` = raw source file/URL.
- Why: users should not decode mixed action labels.

3. Raw-source visibility in all three drawers.
- Why: provenance completeness should not depend on surface.
- Outcome: raw source is shown when resolvable; otherwise fallback text is shown.

4. Exception-only status policy (noise reduction).
- Hide "all good" status labels (`Linked`, `No unresolved lineage links`).
- Show status only when action is needed (`Ambiguous`, `Unresolved`, or claim-level warning when unresolved exists).
- Why: preserve trust signals without repetitive visual noise.

5. Claim overview chip policy in Lineage.
- Chip order: `DPs`, `Extractions`, `Raw Sources`, `Issues`.
- `Issues` chip renders only when count > 0.
- Why: keep baseline state calm and emphasize exceptions.

## Frontend Contract

Shared normalized model for rendering:

```js
// EvidenceTraceBundle
{
  statementId: string,
  sourceLabel: string,
  sourcePath: string | null,
  rawSource: string | null,
  rawSourcePath: string | null,
  rawSourceUrl: string | null,
  status: "linked" | "ambiguous" | "unresolved",
  dpIds: string[],
  dpDetails: Array<{ dp_id: string, claim: string | null, anchor: string | null, citation: string | null }>,
  issues: string[],
  candidates: Array<{ path: string, title: string }>,
  sourceTitle: string | null,
  confidence: number
}
```

## Implementation Entry Points

Shared bundle path:

- `normalizeEvidenceTraceFromCitationContexts(...)`
- `normalizeEvidenceTraceFromLineagePayload(...)`
- `renderEvidenceTraceBundles(...)`

Source enrichment and raw-source resolution:

- `resolveCitationContexts(...)`
- `enrichCitationEntryWithSourceDetails(...)`
- `resolveRawSourceTarget(...)`
- `resolveRawSourcePath(...)`

Lineage composition:

- `buildLineageMarkup(...)`
- `buildLineageOverviewMarkup(...)`

## Non-Obvious Behavior (Important)

### Raw-source path drift handling

`View original` is shown only when the raw source can be resolved to:

- a local indexed file path, or
- an external URL.

Resolver order:

1. exact indexed path
2. alias map lookup
3. raw-input month alias rewrite (`01_Raw_Inputs/YYYY-MM/<file>`)
4. month + basename fallback (prefer newest `mtime`)
5. global basename fallback (prefer newest `mtime`)
6. final evidence-name lookup fallback

If resolution fails, UI shows `Raw source: ...` text without an action button.

### Status semantics

- `linked`: resolved cleanly (status badge hidden by default under exception-only policy)
- `ambiguous`: multiple candidate matches
- `unresolved`: missing or uncertain required linkage

## System Guardrails For Future Agents

1. Do not add new drawer-specific provenance card systems when shared primitives can be extended.
2. Extend shared classes/components first (`cr-citation-*`), then adapt surface wrappers.
3. Keep action wording consistent (`View source`, `View original`).
4. Preserve native disclosure semantics (`details/summary`) for keyboard behavior.
5. Keep exception-only status policy unless there is a product decision to increase explicitness.
6. When changing citation/resolution logic, run both:
   - `./scripts/style_audit.sh`
   - `python3 scripts/regression_citation_parser.py`

## Manual QA Scenarios (High Value)

1. Statement with one source, multiple DPs, raw source available.
2. Statement with multiple sources and mixed DP coverage.
3. Ambiguous source resolution with candidate actions.
4. Unresolved source path with issue note.
5. Lineage claim with no DPs.
6. No layout width flicker when switching claims.
7. Verify that resolved raw sources render `View original`.

## Open Questions

1. Should unresolved warnings be surfaced globally (one top-line summary) in addition to per-bundle exceptions?
2. Should non-clickable raw sources offer a "copy path" action?
3. Should status/confidence ever be user-toggleable for audit workflows?
