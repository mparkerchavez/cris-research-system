# ADR-0001: Frontend style contract and `cr-*` naming system

- Status: accepted
- Date: 2026-02-09
- Confidence: confirmed
- Owners: CRIS frontend

## Context

Frontend CSS had accumulated overlapping styles and naming drift, making changes risky and hard to audit.

## Decision

Adopt a deterministic style contract:

- `cr-*` for component/structure classes
- `is-*` for state modifiers
- token-driven styling with layered style files
- explicit style audit checks before shipping

## Consequences

- Positive:
  - predictable selector model
  - lower risk when refactoring drawer/component styles
  - better onboarding for future agents
- Negative / Tradeoffs:
  - migration overhead and temporary orphan/compatibility classes

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/STYLE_CONTRACT.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/README.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/style_audit.sh`
