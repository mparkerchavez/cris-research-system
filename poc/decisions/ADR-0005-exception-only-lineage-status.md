# ADR-0005: Exception-only lineage status policy (noise reduction)

- Status: accepted
- Date: 2026-02-12
- Confidence: confirmed
- Owners: CRIS frontend
- Related: ADR-0004

## Context

Lineage status labels (`Linked`, `No unresolved lineage links`) were accurate but visually repetitive and added noise.

## Decision

Use exception-only status in Lineage:

- hide all "all-good" status labels in default state
- show status only when action is needed (`Ambiguous`, `Unresolved`)
- claim-level warning appears only when unresolved links exist
- overview chips ordered `DPs`, `Extractions`, `Raw Sources`, then `Issues`
- `Issues` chip shows only when count > 0

## Consequences

- Positive:
  - lower visual noise
  - stronger salience for exception states
- Negative / Tradeoffs:
  - less explicit affirmative confirmation when everything is linked

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EVIDENCE_TRACE_SYSTEM.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/public/app.js`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EXPLORE_VERIFY_PARITY_CHECKLIST.md`
