# ADR-0004: Unified evidence trace model across Takeaway, Trend, and Lineage

- Status: accepted
- Date: 2026-02-12
- Confidence: confirmed
- Owners: CRIS frontend
- Related: ADR-0005, ADR-0006

## Context

Citation/provenance UI diverged by drawer even though user intent stayed the same: understand statement, inspect DPs, open source/original material.

## Decision

Adopt one shared evidence system:

- statement-first reading order
- source-based evidence bundles
- shared renderer and normalization path
- shared action semantics across drawer surfaces

## Consequences

- Positive:
  - one interaction grammar across Pulse and Explore drawers
  - fewer one-off rendering branches
  - easier future UX evolution at system level
- Negative / Tradeoffs:
  - lineage-specific graph concepts become secondary to source-bundle framing

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EVIDENCE_TRACE_SYSTEM.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/public/app.js`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EXPLORE_VERIFY_PARITY_CHECKLIST.md`
