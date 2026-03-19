# CRIS Phase 2: MCP Server Spec

**Read this at the start of every Phase 2 session.**
**Owner:** Maicol Parker-Chavez
**Date:** March 2026

---

## What You Are Building

A local MCP (Model Context Protocol) server that runs on Maicol's Mac and gives Claude Cowork tools to read and write the CRIS Convex knowledge base.

This is not a deployed server. It runs as a local stdio process. Claude Cowork spawns it on demand.

---

## What Already Exists — Do Not Touch

- `convex/schema.ts` — deployed and live with 3,517 data points. Never change field names.
- `convex/*.ts` — all Convex functions are deployed to `https://wonderful-panda-136.convex.cloud`
- `migration/` — one-time scripts, already ran. Ignore them.
- `.env` — already has `CONVEX_URL` and `CONVEX_DEPLOY_KEY`. The MCP server will use this same file.

---

## Build Target: `mcp/` directory

Create this structure inside `cris-system/`:

```
mcp/
├── package.json           ← separate from root package.json
├── tsconfig.json
├── index.ts               ← entry point, registers all tools, starts stdio server
├── lib/
│   ├── convex-client.ts   ← Convex HTTP client (reads ../.env)
│   └── jina.ts            ← Jina Reader API wrapper
└── tools/
    ├── intake.ts          ← add_source_from_url, add_source_from_text, upload_source_file
    ├── extraction.ts      ← extract_data_points, save_data_points
    ├── query.ts           ← get_source, get_data_point, get_week_data_points,
    │                         get_data_point_usage, get_source_usage, search_knowledge_base
    └── synthesis.ts       ← create_weekly_learning, update_idea,
                              update_talking_point, add_curator_note
```

---

## `mcp/package.json`

```json
{
  "name": "cris-mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "start": "node --experimental-strip-types index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "convex": "^1.26.2"
  }
}
```

---

## `mcp/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

## Entry Point Pattern: `mcp/index.ts`

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { intakeTools, handleIntakeTool } from "./tools/intake.ts";
import { extractionTools, handleExtractionTool } from "./tools/extraction.ts";
import { queryTools, handleQueryTool } from "./tools/query.ts";
import { synthesisTools, handleSynthesisTool } from "./tools/synthesis.ts";

const server = new Server(
  { name: "cris-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const allTools = [...intakeTools, ...extractionTools, ...queryTools, ...synthesisTools];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: allTools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    if (intakeTools.find(t => t.name === name))     return await handleIntakeTool(name, args);
    if (extractionTools.find(t => t.name === name)) return await handleExtractionTool(name, args);
    if (queryTools.find(t => t.name === name))      return await handleQueryTool(name, args);
    if (synthesisTools.find(t => t.name === name))  return await handleSynthesisTool(name, args);
    throw new Error(`Unknown tool: ${name}`);
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## `mcp/lib/convex-client.ts`

Reads the `.env` file one directory up (`../`), creates a Convex HTTP client with admin auth.

```typescript
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseDotEnv(text: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return values;
}

let _client: ConvexHttpClient | null = null;

export async function getConvexClient(): Promise<ConvexHttpClient> {
  if (_client) return _client;
  const envPath = path.resolve(__dirname, "../../.env");
  let fileEnv: Record<string, string> = {};
  try {
    fileEnv = parseDotEnv(await fs.readFile(envPath, "utf8"));
  } catch { /* env file optional if env vars are set */ }
  const url = process.env.CONVEX_URL ?? fileEnv.CONVEX_URL;
  const key = process.env.CONVEX_DEPLOY_KEY ?? fileEnv.CONVEX_DEPLOY_KEY;
  if (!url || !key) throw new Error("Missing CONVEX_URL or CONVEX_DEPLOY_KEY");
  _client = new ConvexHttpClient(url);
  _client.setAdminAuth(key);
  return _client;
}

export async function mutation<TArgs, TResult>(name: string, args: TArgs): Promise<TResult> {
  const client = await getConvexClient();
  return await client.mutation(makeFunctionReference<"mutation", TArgs, TResult>(name), args);
}

export async function query<TArgs, TResult>(name: string, args: TArgs): Promise<TResult> {
  const client = await getConvexClient();
  return await client.query(makeFunctionReference<"query", TArgs, TResult>(name), args);
}
```

---

## `mcp/lib/jina.ts`

```typescript
export async function fetchWithJina(url: string): Promise<{
  title: string;
  description: string;
  content: string;
  canonicalUrl: string;
}> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "X-Return-Format": "markdown",
  };
  const apiKey = process.env.JINA_API_KEY;
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const response = await fetch(jinaUrl, { headers });
  if (!response.ok) throw new Error(`Jina fetch failed: ${response.status} ${response.statusText}`);

  const json = await response.json() as {
    data?: { title?: string; description?: string; content?: string; url?: string };
  };
  const data = json.data ?? {};
  return {
    title: data.title ?? "",
    description: data.description ?? "",
    content: data.content ?? "",
    canonicalUrl: data.url ?? url,
  };
}
```

---

## Tool Specifications

Each tool file exports: `const [name]Tools: Tool[]` and `async function handle[Name]Tool(name, args)`.

All tool responses return `{ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }`.

---

### `mcp/tools/intake.ts` — 3 tools

**`add_source_from_url`**
- Inputs: `url` (string, required), `confirm` (boolean, default false)
- Step 1 (`confirm: false`): Call `fetchWithJina(url)`. Return proposed source object for review — do not save to Convex.
- Step 2 (`confirm: true`): Call mutation `sources:migrationInsertSource` (or a new `sources:insertSource` mutation) with the fetched metadata. Return `{ sourceId, title }`.
- Content hash dedup: compute SHA256 of content. If hash already exists in sources, return existing sourceId with a note.

**`add_source_from_text`**
- Inputs: `content` (string), `metadata` object: `{ title, authorName?, canonicalUrl?, publishedDate?, sourceType, publisherName? }`
- Behavior: Content hash dedup check. Save to Convex. Return `{ sourceId, title }`.

**`upload_source_file`**
- Inputs: `filePath` (string, absolute local path), `metadata` object: same shape as above
- Behavior: Read file at `filePath`. If PDF, extract text using `pdf-parse`. Upload raw file to Convex `_storage` via `storageUrl`. Create source record with both `storageId` and `fullText`. Return `{ sourceId, title, wordCount }`.

---

### `mcp/tools/extraction.ts` — 2 tools

**`extract_data_points`**
- Inputs: `sourceId` (string), `forceReExtract` (boolean, default false)
- Behavior: Query source from Convex. Check extractionTracker — if already extracted and `forceReExtract` is false, return warning. Retrieve `fullText`. Return the full text plus the extraction prompt below. Do not save anything — Claude reads the result and performs extraction in-conversation.
- Extraction prompt to return:
  ```
  Extract atomic data points from this source. For each data point:
  - claimText: The interpreted insight (1-2 sentences, your words)
  - anchorQuote: Verbatim text from the source that supports the claim
  - citationDisplay: Human-readable location e.g. "(para. 3)" or "(p. 12)"
  - locationType: "paragraph" | "page" | "timestamp" | "section"
  - locationStart: The number (paragraph number, page number, etc.)
  - evidenceType: "empirical" | "anecdotal" | "framework" | "prediction" | "case_study" | "expert_opinion" | "data_metric"
  - tags: Array of tag slugs from the CRIS tag vocabulary
  Return as JSON array. Aim for 15-25 data points per source.
  ```

**`save_data_points`**
- Inputs: `sourceId` (string), `dataPoints` (array of objects per spec above)
- Behavior: For each data point, call mutation to insert into `dataPoints` table with auto-incremented `dpSequenceNumber`. Look up tag IDs from slugs and create `dataPointTags` links. Create `extractionTracker` record. Return `{ saved: number, dataPointIds: string[], extractionTrackerId: string }`.

---

### `mcp/tools/query.ts` — 6 tools

**`get_source`**
- Inputs: `sourceId` (string)
- Returns: Source metadata + all data points for that source (claimText, anchorQuote, tags, dpSequenceNumber).

**`get_data_point`**
- Inputs: `dataPointId` (string)
- Returns: Full data point fields + source title + source canonicalUrl + tag names.

**`get_week_data_points`**
- Inputs: `weekStartDate` (string, ISO Monday), `weekEndDate` (string, ISO Sunday)
- Returns: All data points with `extractionDate` in that range, grouped by source title, ordered by source then dpSequenceNumber.

**`get_data_point_usage`**
- Inputs: `dataPointId` (string)
- Returns: All downstream content citing this data point: `{ weeklyThemes: [...], ideaEvidence: [...], ideaCounterarguments: [...], talkingPointEvidence: [...] }`. Each entry includes parent entity title and relevant text.

**`get_source_usage`**
- Inputs: `sourceId` (string)
- Returns: Summary count of how many data points from this source appear in: weekly themes, idea evidence, talking point evidence. Include list of which ideas and talking points reference it.

**`search_knowledge_base`**
- Inputs: `query` (string), `limit` (number, default 10), `filters?` (object: `evidenceType?`, `tags?`)
- Behavior: **Phase 3 feature — embeddings required.** If no embeddings exist yet, fall back to Convex text search across `claimText` using the `search_title` index pattern. Return results with note that semantic search becomes available after Phase 3.
- Returns: Array of matching data points with source attribution.

---

### `mcp/tools/synthesis.ts` — 4 tools

**`create_weekly_learning`**
- Inputs: `weekStartDate` (string), `weekEndDate` (string), `title?` (string), `overview?` (string), `themes` (array of `{ themeTitle, themeContent, citedDataPointIds: string[] }`)
- Behavior: Validate all `citedDataPointIds` exist in Convex before saving. Create `weeklyLearnings` record, then one `weeklyThemes` record per theme with `orderIndex`. Return `{ weeklyLearningId }`.

**`update_idea`**
- Inputs: `ideaId?` (string, omit to create new), `title`, `currentPosition`, `status?` (default "active"), `tags?` (string[]), `evidence` (array of `{ evidenceDescription, citedDataPointIds: string[] }`), `counterarguments?` (array of `{ argument, citedDataPointIds: string[] }`)
- Behavior: If updating existing: log previous `currentPosition` to `ideaEvolutionLog` before overwrite. Validate all data point IDs. Replace all evidence and counterargument records (delete existing, insert new). Return `{ ideaId }`.

**`update_talking_point`**
- Inputs: `talkingPointId?` (omit to create new), `title`, `coreMessage`, `audiences` (array of `{ audienceName, audienceConcern, hook }`), `evidence` (array of `{ evidenceText, citedDataPointIds: string[] }`), `pivotPhrases?` (array of `{ phrase, context? }`)
- Behavior: Validate all data point IDs. Replace all related records. Return `{ talkingPointId }`.

**`add_curator_note`**
- Inputs: `entityType` (string: "source" | "data_point" | "idea" | "talking_point" | "weekly_learning" | "language_asset"), `entityId` (string), `noteText` (string), `noteType` (string: "upload_reaction" | "extraction_note" | "synthesis_reflection" | "verification_note" | "general")
- Behavior: Insert to `curatorNotes`. Never update or delete. Return `{ noteId }`.

---

## Convex Functions Needed

The MCP tools call Convex mutations and queries. Most are simple CRUD. Build these in `convex/` alongside the existing functions.

Key mutations needed (check if they already exist before creating):
- `sources:insertSource` — insert a new source record
- `dataPoints:insertDataPoint` — insert single data point, return ID
- `dataPoints:insertDataPointWithTags` — insert data point + tag links atomically
- `synthesis:insertWeeklyLearning` — insert weeklyLearnings + weeklyThemes
- `synthesis:upsertIdea` — create/update idea with evidence and log
- `synthesis:upsertTalkingPoint` — create/update talking point and related records
- `curatorNotes:addNote` — insert immutable note

Key queries needed:
- `sources:getSourceWithDataPoints` — source + its data points
- `dataPoints:getDataPointWithContext` — data point + source + tags
- `dataPoints:getDataPointsByDateRange` — for get_week_data_points
- `dataPoints:getDataPointUsage` — reverse lookup across all synthesis tables
- `sources:getSourceUsage` — usage summary for a source

---

## Key Rules

1. **Never auto-save a source from URL without `confirm: true`.** Always propose first.
2. **Never block insertion on embedding generation.** Embeddings are a Phase 3 step.
3. **Always validate citedDataPointIds before saving synthesis records.** Invalid IDs throw an error.
4. **Curator notes are immutable.** No update or delete mutations.
5. **dpSequenceNumber is unique per source.** When inserting, find max existing sequence for the source and increment.

---

## Convex Queries That Already Exist

Check `convex/sources.ts`, `convex/dataPoints.ts`, `convex/synthesis.ts`, and `convex/tags.ts` before writing new functions — some of what you need may already be built from Phase 1. Reuse what exists.

---

## How to Configure in Claude Cowork (After Build)

Once the MCP server is built, Maicol adds it to Claude Cowork by editing the MCP config file and pointing it to `mcp/index.ts`:

```json
{
  "mcpServers": {
    "cris": {
      "command": "node",
      "args": ["--experimental-strip-types", "/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/cris-system/mcp/index.ts"],
      "env": {}
    }
  }
}
```

The server reads its own `.env` from `../` (the `cris-system/` root) so no env vars needed in the config.

---

## Build Order Within This Phase

Build and test in this order. Do not move to the next group until the current group works:

1. **Scaffolding** — `mcp/package.json`, `mcp/lib/convex-client.ts`, `mcp/lib/jina.ts`, `mcp/index.ts` (empty tool arrays, just the server starts)
2. **Query tools** — `get_source`, `get_data_point`, `get_week_data_points` (read-only, safest to test first)
3. **Intake tools** — `add_source_from_url` (propose only), `add_source_from_text`
4. **Extraction tools** — `extract_data_points`, `save_data_points`
5. **Synthesis tools** — `create_weekly_learning`, `update_idea`, `update_talking_point`, `add_curator_note`
6. **Remaining query tools** — `get_data_point_usage`, `get_source_usage`, `search_knowledge_base` (text fallback)

After each group: run `npm install` in `mcp/`, start the server with `npm start`, confirm it connects without error.

---

## Testing Checkpoints

After each group, verify with a simple smoke test:
- Query tools: call `get_data_point` with any real data point ID from the Convex dashboard
- Intake: call `add_source_from_url` with a real URL, confirm proposed metadata looks right
- Extraction: call `extract_data_points` with a real `sourceId`, confirm source text is returned
- Synthesis: call `create_weekly_learning` with a real data point ID, confirm record appears in Convex dashboard

---

## Dependencies to Install

Run inside `mcp/` after creating `package.json`:

```bash
cd mcp && npm install
```

If using `upload_source_file` with PDF support, also:

```bash
npm install pdf-parse
```
