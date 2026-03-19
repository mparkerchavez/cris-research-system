# ADR-0006: Raw source fallback resolution and `View original` action label

- Status: accepted
- Date: 2026-02-12
- Confidence: confirmed
- Owners: CRIS frontend
- Related: ADR-0004

## Context

Some evidence bundles had raw-source metadata but no raw-source action because metadata paths drifted from indexed raw-input paths. Action labels also varied.

## Decision

1. Add resilient raw-source resolution fallback order:
- exact indexed path
- alias lookup
- month alias rewrite for raw-input paths
- month + basename fallback
- basename fallback (newest `mtime`)
- final evidence-name lookup fallback

2. Standardize raw source action label:
- `View original`

## Consequences

- Positive:
  - more consistent raw-source action availability
  - clearer action semantics
- Negative / Tradeoffs:
  - fallback matching can select by best available heuristic when metadata is imperfect

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/public/app.js`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EVIDENCE_TRACE_SYSTEM.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EXPLORE_VERIFY_PARITY_CHECKLIST.md`
