# ADR-0002: Explore becomes the primary trace workspace (drawer-first)

- Status: accepted
- Date: 2026-02-10
- Confidence: confirmed
- Owners: CRIS frontend

## Context

Explore needed to preserve reading runway while still enabling claim/citation trace workflows.

## Decision

Use drawer-first tracing in Explore:

- keep markdown reading surface primary
- open claims/lineage in right drawer (`Trace claims/citations`)
- remove persistent bottom claims tray

## Consequences

- Positive:
  - less vertical crowding in document view
  - better separation of reading vs provenance tasks
- Negative / Tradeoffs:
  - provenance discovery now depends on drawer interaction

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/README.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EXPLORE_VERIFY_PARITY_CHECKLIST.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/public/app.js`
