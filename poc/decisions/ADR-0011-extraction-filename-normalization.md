# ADR-0011: Canonical extraction filename normalization for parser stability

- Status: accepted
- Date: 2026-02-07
- Confidence: confirmed
- Owners: CRIS extraction + parser

## Context

Extraction filenames had inconsistent punctuation/source naming, causing citation mismatch and parser fragility.

## Decision

Normalize extraction filenames to:

- `Source_DescriptiveSlug_YYYY-MM-DD.md`
- no hyphens/periods in source or slug segments
- stable inline citation form without date: `[Source_DescriptiveSlug DPx]`

## Consequences

- Positive:
  - deterministic citation-to-file matching
  - improved lineage resolution in frontend
- Negative / Tradeoffs:
  - one-time rename migration cost and mapping maintenance

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Extraction_Name_Mapping.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Citation_Contract.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/scripts/regression_citation_parser.py`
