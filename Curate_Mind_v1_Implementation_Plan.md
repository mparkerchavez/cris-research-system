# Curate Mind v1: Implementation Plan

**Date:** March 17, 2026
**For:** Maicol Parker-Chavez (citizen developer)
**Reference:** Curate Mind v1 Architecture Spec

---

## How You'll Work

You have two AI coding tools available:

- **Claude (Cowork mode):** Best for file creation, reading and editing code, running terminal commands in a sandboxed environment, and working with your CRIS files directly. Use Claude when you need to work with files in your CRIS folder, design prompts, write documentation, or test ideas.

- **OpenAI Codex:** Best for writing and modifying code in a project. Use Codex when you need to write Convex functions, build the MCP server code, or create the triage interface. Codex works well when you point it at a codebase and say "build this."

**Your role in each step:**
- You describe what you want in plain language
- Claude or Codex writes the code
- You review the output (does it make sense?)
- You paste terminal commands when needed (Claude/Codex will give you exact commands)
- You test and provide feedback

**You will never need to write code from scratch.** Every step below tells you exactly what to ask Claude or Codex to do.

---

## Before You Start: What You Need

### Accounts & Tools (Confirm You Have These)

- [ ] **Convex account** (you already have one from CRIS, at convex.dev)
- [ ] **OpenAI API key** (you already have one for embeddings)
- [ ] **Claude Desktop** with Cowork mode
- [ ] **OpenAI Codex** desktop app
- [ ] **A code editor** (VS Code recommended; Codex may already use one)
- [ ] **Node.js installed** (if not, Claude can walk you through it)
- [ ] **Git installed** (if not, Claude can walk you through it)

### Project Setup (Do This First)

Ask Claude in Cowork mode:

> "I need to set up a new project folder for Curate Mind v1. The existing CRIS MCP code is in `/CRIS_Research_System/cris-system/`. I want to create a new project folder called `curate-mind` alongside it (not inside CRIS). Copy over the Convex configuration files and the .env file so I have a working starting point, but don't copy the old MCP code. We're building fresh."

Claude will create the folder structure and copy what's needed. You'll end up with:

```
curate-mind/
├── convex/           (schema and functions, will be rewritten)
├── mcp/              (MCP server, will be rewritten)
├── .env              (your API keys, copied from CRIS)
└── package.json      (dependencies)
```

---

## The Build Phases

We're building in 4 phases. Each phase produces something usable. You don't need to finish all 4 to get value.

---

## Phase 1: New Convex Schema (The Foundation)

**Goal:** Deploy the new database structure to Convex so all other pieces can build on it.

**Time estimate:** 2-3 sessions (roughly 1 day of focused work)

**Tool:** Codex (primary) + Claude (review)

### Step 1.1: Write the New Schema

Open the `curate-mind` project in Codex. Give it this prompt:

> "Read the file `Curate_Mind_v1_Architecture_Spec.md` in my CRIS_Research_System folder. Based on the Foundation Entities section, write a new Convex schema file (`convex/schema.ts`). Follow these rules:
>
> 1. Create tables for: sources, dataPoints, curatorObservations, mentalModels, researchThemes, researchPositions, positionVersions, tags, dataPointTags, curatorObservationTags, mentalModelTags, researchLens
> 2. Use the field definitions from the spec exactly
> 3. Add appropriate indexes on foreign key fields and date fields
> 4. Add vector indexes (1536 dimensions) on: dataPoints, curatorObservations, mentalModels, positionVersions
> 5. The existing CRIS schema is at `CRIS_Research_System/cris-system/convex/schema.ts` for reference on Convex syntax
> 6. This is an append-only architecture. No delete operations will be built."

**What Codex produces:** A complete `convex/schema.ts` file.

**Your review checklist:**
- [ ] Does it have all 12 tables listed above?
- [ ] Do the field names match the architecture spec?
- [ ] Are `sourceId`, `positionId`, etc. defined as `v.id("tableName")`?
- [ ] Are embeddings defined as `v.optional(v.array(v.float64()))`?
- [ ] Are vector indexes set to 1536 dimensions?

### Step 1.2: Write the Core Convex Functions

Still in Codex, prompt:

> "Now write the Convex functions for the new schema. I need separate files for each domain:
>
> `convex/sources.ts` - insert source, get source by ID, get source with data points, find by content hash
>
> `convex/dataPoints.ts` - insert data point with tags (creates tag links in junction table), get data point with full context (source info, tags), get data points by source, set embedding, get data points needing embeddings
>
> `convex/positions.ts` - create theme, create position, create new position version (append-only: inserts new version row + updates currentVersionId pointer on position), get position with current version, get position history (all versions), get positions by theme
>
> `convex/observations.ts` - create curator observation, get observation with linked data points and positions
>
> `convex/mentalModels.ts` - create mental model, get mental model with source context
>
> `convex/search.ts` - vector search across data points (action that embeds query via OpenAI then searches Convex vector index), also search across positions, observations, and mental models
>
> `convex/tags.ts` - create tag, list tags, get tag by slug
>
> `convex/researchLens.ts` - generate lens from current position states (query all active positions, compress into lens format), get current lens
>
> IMPORTANT: This is append-only. No update mutations that overwrite data. No delete mutations. The only field that gets updated in place is `currentVersionId` on the researchPositions table and `status` on sources. Everything else is insert-only.
>
> Reference the existing CRIS functions at `CRIS_Research_System/cris-system/convex/` for Convex patterns and syntax."

**What Codex produces:** 8 TypeScript files with all the database functions.

**Your review checklist:**
- [ ] No `delete` or destructive `patch` operations anywhere
- [ ] Position updates create new version rows (not modify existing)
- [ ] Search functions use OpenAI embeddings (check for API call)
- [ ] Tag creation uses slug-based deduplication

### Step 1.3: Deploy to Convex

Ask Claude in Cowork:

> "I have my new Convex schema and functions ready in the `curate-mind` folder. Walk me through deploying this to a new Convex project. I don't want to overwrite my existing CRIS deployment. Give me the exact terminal commands to run."

Claude will give you something like:

```bash
cd curate-mind
npx convex dev --once
```

**What to expect:** Convex will create the new tables. You'll see output confirming each table was created. If there are errors, paste the error message back to Claude and it will fix it.

---

## Phase 2: New MCP Server (Your Personal Interface)

**Goal:** Build the MCP that connects Claude to your new Convex database.

**Time estimate:** 3-4 sessions (roughly 2 days of focused work)

**Tool:** Codex (primary) + Claude (review and testing)

### Step 2.1: Build the MCP Server Structure

In Codex:

> "Build a new MCP server for Curate Mind. Use the `@modelcontextprotocol/sdk` package with stdio transport (same pattern as the existing CRIS MCP at `CRIS_Research_System/cris-system/mcp/`).
>
> The server should expose these tools, organized by file:
>
> `mcp/tools/intake.ts`:
> - `add_source` (from URL via Jina, from file, or from text)
> - `add_mental_model`
> - `add_curator_observation`
>
> `mcp/tools/extraction.ts`:
> - `extract_source` (returns source text + extraction prompt for the agent to process)
> - `save_data_points` (persists extracted DPs to Convex)
> - `save_mental_models` (persists Mental Models flagged during extraction)
>
> `mcp/tools/query.ts`:
> - `get_themes` (Layer 1)
> - `get_positions` (Layer 1, filterable by theme)
> - `get_position_detail` (Layer 2, full evidence chain)
> - `get_data_point` (Layer 3, includes anchor quote)
> - `get_source_text` (Layer 4, full source)
> - `search_knowledge_base` (semantic search, returns results at highest applicable layer)
> - `get_tag_trends` (tag frequency over time)
> - `get_position_history` (version diffs)
>
> `mcp/tools/synthesis.ts`:
> - `create_theme`
> - `create_position`
> - `update_position` (creates new version, append-only)
> - `update_research_lens`
>
> `mcp/lib/convex-client.ts` - Convex HTTP client wrapper (same pattern as CRIS)
> `mcp/lib/openai-client.ts` - OpenAI client for embeddings
> `mcp/lib/jina.ts` - URL fetching via Jina
>
> Reference the existing CRIS MCP code for patterns, but this is a fresh build."

**What Codex produces:** The complete MCP server codebase.

### Step 2.2: Connect to Claude Desktop

Ask Claude in Cowork:

> "I've built the Curate Mind MCP server. Walk me through connecting it to Claude Desktop. I need the exact configuration to add to my Claude Desktop config file, and how to test that it's working."

Claude will give you the config JSON to add and a test you can run.

### Step 2.3: Test Each Tool

Once connected, test in Claude Desktop by having a conversation:

> "Use the Curate Mind MCP to create a test Research Theme called 'Test Theme' and then create a Research Position under it called 'Test Position' with a stance of 'This is a test.'"

If it works, you'll see the data in your Convex dashboard. If it doesn't, paste the error back to Claude.

---

## Phase 3: Extraction Pipeline (The Processing Engine)

**Goal:** Build the three-pass extraction pipeline as Cowork skills.

**Time estimate:** 3-4 sessions (roughly 2 days)

**Tool:** Claude in Cowork (primary, since skills are markdown + prompts)

### Step 3.1: Build the Pass 1 Extraction Skill

Ask Claude in Cowork:

> "Read the Curate Mind v1 Architecture Spec, specifically the Extraction Pipeline section. Build me a Cowork skill for Pass 1: Core Extraction.
>
> The skill should:
> 1. Take a source ID as input
> 2. Retrieve the source text from Convex via the MCP
> 3. For PDFs over 20 pages, split into chunks and process each chunk separately
> 4. Extract atomic data points with: claim text, verbatim anchor quote (5-15 words), location, and evidence type
> 5. Flag any frameworks, analogies, or memorable terms for Mental Model capture
> 6. NOT use the Research Lens (Pass 1 is interpretation-free)
> 7. Save all extracted data points to Convex via the MCP
> 8. Return a summary of what was extracted + flagged Mental Models
>
> Put the skill in my CRIS_Research_System/_System/skills/ folder for now. We'll move it to the Curate Mind project later."

### Step 3.2: Build the Pass 2 Enrichment Skill

> "Now build the Pass 2: Enrichment skill.
>
> The skill should:
> 1. Take a source ID as input (Pass 1 must be complete for this source)
> 2. Retrieve the extracted data points from Convex
> 3. Retrieve the current Research Lens from Convex
> 4. For each data point, add: confidence signal (strong/moderate/suggestive), extraction note (why it matters, connections to current positions), related DP links within the source
> 5. Create Mental Model records for items flagged in Pass 1
> 6. Update the data points in Convex with the enrichment data
> 7. Flag any DPs that contradict current Research Positions
> 8. The intake note from the source is optional. If present, use it as additional context. If absent, proceed without it."

### Step 3.3: Build the Pass 3 Curator Review Skill

> "Build the Pass 3: Curator Review skill.
>
> This skill should:
> 1. Take a source ID as input (Pass 2 must be complete)
> 2. Show me ONLY the flagged items: low-confidence from Tier 1 sources, high-confidence from Tier 3 sources, DPs contradicting current positions, verification issues
> 3. For each flagged item, show: the claim, the confidence, the extraction note, and why it was flagged
> 4. Ask me to approve, adjust, or annotate each flagged item
> 5. Save my decisions to Convex
> 6. If I want to add a Curator Observation connecting multiple DPs, help me create one"

### Step 3.4: Build the Orchestration Skill

> "Build a batch orchestration skill that coordinates all three passes.
>
> The skill should:
> 1. Accept a list of source IDs (or 'all pending' to process everything in the queue)
> 2. For each source, run Pass 1 → wait for completion → run Pass 2 → collect flags → queue for Pass 3
> 3. Process sources one at a time (to keep context windows clean)
> 4. After all sources complete Pass 1 and Pass 2, present me with all flagged items for Pass 3 review
> 5. Track progress: show me how many sources are done, pending, failed
> 6. Handle failures: if a source fails, log the error, skip it, continue with the next one"

---

## Phase 4: February Reprocessing (Validation)

**Goal:** Reprocess all 178 February sources through the new pipeline to validate everything works.

**Time estimate:** 1 week (triage + processing + review)

### Step 4.1: Build the Triage Interface

Ask Claude in Cowork:

> "Build me a simple single-page React app for triaging sources. It should:
> 1. Read the list of files from my 01_Raw_Inputs/2026-02/ folders
> 2. For each file, show: filename, file type (MD or PDF), size, and page count for PDFs
> 3. Let me set: tier (1/2/3 dropdown), intake note (text field, optional), process yes/no toggle
> 4. Save my triage decisions to a JSON file that the orchestration skill can read
> 5. Show progress: how many files triaged out of total
>
> This doesn't need to connect to Convex yet. Just a local tool for getting through 178 files quickly. Save it as an HTML artifact I can open in my browser."

### Step 4.2: Triage All Sources

Open the triage interface in your browser. Go through all 178 files:

- Set tiers (expect roughly: 37 PDFs are mostly Tier 1-2, 141 markdown files are mostly Tier 2-3)
- Add intake notes where you remember why you saved the source
- Mark any sources you don't want to reprocess as "no"

**Time estimate:** 2-3 hours (about 1 minute per source)

### Step 4.3: Ingest Sources to New Convex

Ask Claude in Cowork:

> "I have my triage JSON file with tier assignments and intake notes for all February sources. I need to ingest all these sources into the new Curate Mind Convex database. Walk me through using the MCP's add_source tool to batch-ingest them, preserving the triage metadata."

### Step 4.4: Run the Extraction Pipeline

> "Run the Curate Mind extraction orchestration skill on all ingested sources. Start with a small batch first (5 sources, mix of PDFs and markdown) so we can verify quality before processing the full set."

Review the first batch carefully. If quality is good, run the rest. If not, iterate on the skills with Claude.

### Step 4.5: Build Initial Research Positions

After extraction is complete:

> "I now have all my February data points in Curate Mind. Help me create the initial Research Themes and Research Positions. Start by looking at the tags and data points to suggest theme groupings. Then help me migrate and refine my 18 CRIS Active Ideas into the new Research Position format."

---

## Phase 5: Reader Access (Future, After Foundation Is Validated)

Not detailed here. Once Phases 1-4 are complete and you've been using the system for 2-4 weeks, we'll design the Reader layer based on what you've learned about how you actually use the foundation.

---

## Suggested Order of Work

| Week | What You're Doing | Tool |
|------|-------------------|------|
| Week 1, Sessions 1-2 | Phase 1: Convex schema + functions | Codex |
| Week 1, Session 3 | Phase 1: Deploy and test | Claude |
| Week 2, Sessions 1-3 | Phase 2: MCP server | Codex |
| Week 2, Session 4 | Phase 2: Connect to Claude Desktop + test | Claude |
| Week 3, Sessions 1-3 | Phase 3: Extraction skills | Claude |
| Week 3, Session 4 | Phase 3: Test on 3-5 sources | Claude |
| Week 4 | Phase 4: Triage + reprocess February | Claude + browser |

---

## If You Get Stuck

**Terminal errors:** Copy the entire error message and paste it to Claude or Codex. Say "I got this error, what do I do?" They will diagnose and give you the fix.

**Code doesn't work:** Don't try to debug it yourself. Describe what you expected to happen and what actually happened. Let Claude or Codex fix it.

**Not sure which tool to use:** If the task involves writing or modifying code files in the project, use Codex. If the task involves working with your CRIS files, running terminal commands, building skills, or testing, use Claude in Cowork.

**Convex dashboard:** You can always check what's in your database at dashboard.convex.dev. This is your visual verification that things are working.

---

## Key Decisions Still Needed

Before starting Phase 1, decide:

1. **New Convex project or same one?** I recommend a new Convex project so your CRIS data stays untouched during development. You can always migrate data later.

2. **Domain purchase timing:** Buy curatemind.io when ready, but it's not needed for Phases 1-4. The domain only matters when you build the Reader layer.

3. **Embedding model:** Stay with OpenAI text-embedding-3-small for now. It works, it's cheap, and switching later is possible (just requires re-embedding).

---

*This plan was designed for a citizen developer workflow. Every step assumes you will not write code directly. Claude and Codex write the code. You describe what you want, review what they produce, and paste terminal commands when needed.*
