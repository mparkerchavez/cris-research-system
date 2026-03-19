# ADR-0008: Progressive disclosure context loading via index/header files

- Status: accepted
- Date: 2026-02-07
- Confidence: confirmed
- Owners: CRIS system + synthesis workflows

## Context

Loading full CRIS history for each task is costly and degrades focus and coverage quality.

## Decision

Adopt progressive disclosure context loading:

- load lightweight index/header files first
- decide which specific detail files to load second
- avoid bulk-loading full lower layers by default

## Consequences

- Positive:
  - lower context pressure and better task focus
  - faster path to relevant evidence
- Negative / Tradeoffs:
  - quality depends on accurate index/header maintenance

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Folder_Structure.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Overview.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Workflows/Weekly_Synthesis.md`
