# CRIS System

## Setup

1. Clone the repository.
2. Change into `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/cris-system`.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and fill in the values you need.
5. Run `npx convex dev`.

## Phase 1B Migration

These one-time scripts migrate the trusted lineage foundation first:

1. `sources`
2. `tags`
3. `dataPoints` and `dataPointTags`
4. `extractionTracker`
5. `weeklyLearnings` and `weeklyThemes`

Run the dry parses first:

```bash
npm run migration:sources -- --dry-run
npm run migration:tags -- --dry-run
npm run migration:datapoints -- --dry-run
npm run migration:weekly -- --dry-run
```

Run the actual imports after the dry runs look correct:

```bash
npm run migration:sources
npm run migration:tags
npm run migration:datapoints
npm run migration:weekly
npm run migration:validate:phase1b
```

Notes:

- The scripts read `CONVEX_URL` and `CONVEX_DEPLOY_KEY` from `.env` or the shell environment.
- They are guarded against accidental reruns. To force a rerun, set `CRIS_ALLOW_RERUN=1`.
- Generated migration artifacts are written under `cris-system/migration/`.
- `migration/artifacts/tag_id_map.json` is created by the real tag migration and then consumed by the datapoint migration.
