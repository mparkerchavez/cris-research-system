# Decision Records (ADR)

Purpose: keep a durable, auditable log of product and technical decisions that affect frontend/system behavior.

Use this folder to prevent re-deciding the same problems and to keep future agents aligned with past rationale.

Scope now includes:

- PoC frontend decisions
- cross-system decisions that directly shape frontend behavior (citation contracts, naming, workflow constraints)

## How to Use

1. Read `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/decisions/ADR_INDEX.md` first.
2. Open linked ADR files for full context before changing related behavior.
3. When shipping a meaningful behavior/system decision:
   - add a new ADR file
   - update `ADR_INDEX.md`
   - add evidence links to code/docs/tests

## Record Fields

Every ADR should include:

- `Status`: `proposed`, `accepted`, `superseded`, or `deprecated`
- `Confidence`: `confirmed` or `inferred`
- `Date`: decision date (or backfill date)
- `Context`: why this decision was needed
- `Decision`: what was chosen
- `Consequences`: outcomes and tradeoffs
- `Evidence`: file links proving the decision exists

## Confidence Policy

- `confirmed`: explicitly stated in committed docs/code behavior.
- `inferred`: reconstructed from artifacts when rationale was not explicitly written down.

Do not present inferred decisions as confirmed facts.
