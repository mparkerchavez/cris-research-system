# ADR-0010: Machine-parseable citation metadata alongside readable citations

- Status: accepted
- Date: 2026-02-07
- Confidence: confirmed
- Owners: CRIS parser + frontend

## Context

Human-readable citations alone were insufficient for deterministic parser resolution and lineage linking in the UI.

## Decision

Pair bracket citations with machine-readable metadata comments:

- keep readable citation text for authors/readers
- include `<!-- cite:path=...;dp=... -->` blocks for parser determinism
- one metadata block per cited source in multi-source citations

## Consequences

- Positive:
  - stable lineage linking and source actions in frontend drawers
  - better unresolved/ambiguous detection
- Negative / Tradeoffs:
  - stricter authoring discipline required in markdown files

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Citation_Contract.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/regression_citation_parser.py`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/public/app.js`
