# ADR-0012: Bottom-up clustered rebuild to reduce idea framing bias

- Status: accepted
- Date: 2026-02-09
- Confidence: inferred
- Owners: CRIS rebuild protocol

## Context

Archive artifacts indicate concern that early Active Ideas were built from a limited extraction subset, which risked path-dependent framing of later synthesis.

## Decision

Run a one-time bottom-up rebuild:

- cluster extraction corpus by theme
- mine clusters independently
- reconstruct ideas/synthesis from full evidence base rather than legacy idea scaffolding

## Consequences

- Positive:
  - reduced anchoring bias from early incomplete coverage
  - broader evidence-led theme discovery
- Negative / Tradeoffs:
  - high execution overhead (multi-session, multi-artifact process)

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/07_Archive/Rebuild_Protocol_Feb2026.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/07_Archive/Rebuild_Protocol_2026-02-09/CRIS_DP_Coverage_Analysis_2026-02-08.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/07_Archive/Rebuild_Protocol_Updates_2026-02-09.md`

## Why Inferred

The protocol and archive notes document the process and motivation, but there is no explicit long-term governance statement declaring this as a recurring policy. The enduring principle is inferred from those artifacts.
