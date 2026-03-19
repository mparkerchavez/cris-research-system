# CRIS Phase 3: Batch Embedding Job

**Date:** 2026-03-04
**Status:** Ready to build
**Owner:** Maicol Parker-Chavez

---

## Context

The CRIS research system uses a Convex database (deployed at `https://wonderful-panda-136.convex.cloud`) with 3,517 data points already migrated in Phase 1B. The Convex schema has `embedding: v.optional(v.array(v.float64()))` on five tables: `dataPoints`, `sourceChunks`, `weeklyThemes`, `ideas`, and `talkingPoints`. All vector indexes are defined for 1536 dimensions.

Phase 3 generates embeddings for all 3,517 `dataPoints` using OpenAI's `text-embedding-3-small` model (1536 dims) and writes them back to Convex. This enables the `search_knowledge_base` MCP tool to upgrade from text-fallback to true vector search.

---

## What to Build

A standalone batch embedding script at:

```
cris-system/embedding/embed_datapoints.ts
```

With a supporting package config at:

```
cris-system/embedding/package.json
cris-system/embedding/tsconfig.json
```

Run with:

```bash
cd cris-system/embedding
npm install
npm run embed
```

---

## Architecture

### Input
- Query all `dataPoints` from Convex that have `embedding == undefined` (not yet embedded)
- For each data point, build the text to embed: `claimText` + optionally `anchorQuote`

### Processing
- Batch OpenAI embedding API calls (max 100 items per request, stay well within token limit)
- Use `text-embedding-3-small` model
- Respect rate limits: 3,000 RPM / 1M TPM for tier 1; add a small delay between batches

### Output
- For each data point, write the 1536-dimension embedding vector back to Convex
- Use a Convex mutation: `dataPoints:setEmbedding`

### Resilience
- Skip data points that already have `embedding != undefined`
- Log progress every 100 records
- On API error: log the failed data point ID, continue (don't abort the whole batch)
- Write a final report: total embedded, total skipped, total failed

---

## Convex Functions to Add

Add two functions to `cris-system/convex/dataPoints.ts`:

### 1. `dataPoints:listDataPointsNeedingEmbedding`

```typescript
// Query: return data points where embedding field is undefined
// Returns: array of { _id, claimText, anchorQuote }
// Pagination: take a cursor + limit arg so the batch job can page through
export const listDataPointsNeedingEmbedding = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    // Use pagination or a simple filter — pick whichever is simpler in Convex
    // Return: { dataPoints: Array<{_id, claimText, anchorQuote}>, isDone: boolean, nextCursor? }
  }
});
```

### 2. `dataPoints:setEmbedding`

```typescript
// Mutation: write the embedding array to a data point
export const setEmbedding = mutation({
  args: {
    dataPointId: v.id("dataPoints"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dataPointId, { embedding: args.embedding });
  }
});
```

---

## Embedding Script: `embed_datapoints.ts`

```typescript
// Pseudocode — Codex fills in the real implementation

import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import OpenAI from "openai";

// 1. Load env (CONVEX_URL, CONVEX_DEPLOY_KEY, OPENAI_API_KEY) from .env or process.env
// 2. Create ConvexHttpClient with admin auth
// 3. Create OpenAI client
// 4. Page through listDataPointsNeedingEmbedding until isDone
//    - Build text: `${dp.claimText}${dp.anchorQuote ? "\n" + dp.anchorQuote : ""}`
//    - Batch into groups of 100
//    - Call openai.embeddings.create({ model: "text-embedding-3-small", input: [texts] })
//    - For each result, call setEmbedding with the data point ID and embedding vector
//    - Log progress: "Embedded X / Y data points"
//    - Add 200ms delay between batches (rate limit safety)
// 5. Print final report: total embedded, total skipped, total failed
```

---

## Text to Embed per Data Point

Build a combined string for each data point:

```typescript
function buildEmbeddingText(dp: { claimText: string; anchorQuote?: string }): string {
  const parts = [dp.claimText];
  if (dp.anchorQuote) {
    parts.push(`"${dp.anchorQuote}"`);
  }
  return parts.join("\n");
}
```

This gives the embedding model the interpreted claim PLUS the verbatim quote, which improves recall for both semantic search ("what are the productivity findings?") and anchor-text search.

---

## Package Config

### `package.json`

```json
{
  "name": "cris-embedding",
  "type": "module",
  "scripts": {
    "embed": "node --experimental-strip-types embed_datapoints.ts"
  },
  "dependencies": {
    "convex": "^1.17.0",
    "openai": "^4.0.0"
  }
}
```

Note: Reuse the same `node --experimental-strip-types` runner pattern used across the migration scripts.

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true
  }
}
```

---

## Environment Variables

The script reads from `.env` in the `cris-system/` directory (same file used by migration scripts):

```
CONVEX_URL=https://wonderful-panda-136.convex.cloud
CONVEX_DEPLOY_KEY=<from Convex dashboard>
OPENAI_API_KEY=<from OpenAI dashboard>
```

Use the existing `migration/lib/convexClient.ts` helper (`createConvexClient`, `runConvexQuery`, `runConvexMutation`) rather than reinventing the client setup. The embedding script can import from `../migration/lib/convexClient.ts`.

---

## Rate Limit Safety

OpenAI `text-embedding-3-small` limits (Tier 1):
- 3,000 requests per minute
- 1,000,000 tokens per minute

At ~50 tokens per data point average, 3,517 data points = ~175,850 tokens total. This fits in a single minute of quota, but to be safe:
- Batch 100 data points per API call
- Add a 200ms delay between API calls
- Total estimated runtime: ~8-12 seconds for 35 batches

---

## Build Order

1. Add `dataPoints:listDataPointsNeedingEmbedding` and `dataPoints:setEmbedding` to `cris-system/convex/dataPoints.ts`
2. Run `npx convex deploy` from `cris-system/` to deploy the new Convex functions
3. Create `cris-system/embedding/` directory with `package.json`, `tsconfig.json`, `embed_datapoints.ts`
4. Run `npm install` in `cris-system/embedding/`
5. Run `npm run embed` — first as a dry run (log what would be embedded, don't call OpenAI), then for real

---

## Testing Checkpoint

After running:

1. Query Convex: count data points where `embedding != undefined` — should be 3,517
2. Test vector search: call `search_knowledge_base` MCP tool with a topic like "agent adoption barriers" — should return semantically relevant results (not just keyword matches)
3. Spot-check 3 random data points: verify their embeddings are 1536-dimensional float arrays

---

## What Phase 3b Will Add (Deferred)

Phase 3b will embed `sourceChunks` (raw source text chunks for RAG retrieval). This is deferred until needed. The schema already supports it (`sourceChunks.embedding`), but Phase 3 focuses only on `dataPoints` which are the primary search target.

---

## Files to Create

```
cris-system/
└── embedding/
    ├── package.json
    ├── tsconfig.json
    └── embed_datapoints.ts

cris-system/convex/
└── dataPoints.ts   (add two new functions)
```

No other files need to change.
