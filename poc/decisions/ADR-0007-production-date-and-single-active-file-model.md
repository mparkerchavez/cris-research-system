# ADR-0007: Production-date naming with one-active-file archive model

- Status: accepted
- Date: 2026-02-07
- Confidence: confirmed
- Owners: CRIS system + frontend

## Context

Multiple evolving documents (Weekly, Talking Points, Current Synthesis, Active Ideas) needed clean lineage without filename version sprawl.

## Decision

Use production-date naming and archive-by-replacement:

- Date files by production date, not coverage period.
- Keep one active file for living surfaces (for example `Current_Synthesis.md`, `Active_Ideas.md`).
- Archive previous versions before overwrite.
- Avoid `_v2`, `_v3` suffixes.

## Consequences

- Positive:
  - cleaner lineage and deterministic "current" pointers
  - simpler frontend file discovery for latest artifacts
- Negative / Tradeoffs:
  - requires strict archive hygiene on every update cycle

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Workflows/Versioning_and_File_Management.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Folder_Structure.md`
