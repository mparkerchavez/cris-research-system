# ADR-0003: Main navigation standardized to Pulse, Ideas, Talking Points, Explore

- Status: accepted
- Date: 2026-02-09 (amended 2026-02-12)
- Confidence: confirmed
- Owners: CRIS frontend

## Context

Global navigation previously had extra surface complexity (`Verify`) that overlapped with Explore behavior.
After removing Verify, Talking Points matured into a first-class destination and needed direct access in top navigation.

## Decision

Standardize to four top-level destinations in this exact order:

- Pulse
- Ideas
- Talking Points
- Explore

Legacy `view=verify` is normalized to Explore for compatibility.
Legacy `view=talkingpoints` and `view=talking_points` are normalized to `view=talking-points`.

## Consequences

- Positive:
  - simpler mental model and routing for all core synthesis deliverables
  - direct access to Talking Points without detouring through Explore
- Negative / Tradeoffs:
  - any Verify-specific workflows must still be represented inside Explore
  - top nav now has four links, so mobile layout must preserve tap safety and scanability

## Evidence

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/README.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/STYLE_CONTRACT.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/public/app.js`
