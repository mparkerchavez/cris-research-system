# Curate Mind v1 Architecture Specification

**Date:** March 17, 2026
**Author:** Maicol Parker-Chavez (with Claude)
**Status:** Draft, ready for technical review
**Predecessor:** CRIS Research System (February 2026)

---

## What Curate Mind Is

A personal research curation system for tracking AI trends, extracting insights from sources, synthesizing research positions, and providing a queryable knowledge base that supports analysis, communication, and decision-making.

The system is built on a single principle: **build a robust foundation, generate everything else on demand.**

---

## Design Principles

### 1. Foundation vs. Generated Outputs

The foundation is the persistent, always-maintained knowledge structure. It consists of six entity types (detailed below) that are curated, versioned, and queryable. Everything else, talking points, LinkedIn posts, presentations, client briefs, trend reports, weekly summaries, is generated on demand by prompting against the foundation. No maintained deliverables. No documents that go stale.

### 2. Progressive Disclosure (Analysis, Not Extraction)

When querying the knowledge base, the system defaults to the highest level of compression and drills deeper only when the user requests it:

- **Layer 1 — Themes & Positions:** Research Themes (5-8 macro areas) and Research Positions (specific theses with current stance and confidence). Most queries are answered here.
- **Layer 2 — Evidence:** The data points, curator observations, and mental models that support or challenge a position. Accessed when a claim needs support or stress-testing.
- **Layer 3 — Verification:** Verbatim anchor quotes and extraction notes. Accessed when exact wording or source fidelity needs confirmation.
- **Layer 4 — Full Source:** Original source text and files. Accessed rarely, when the full context of a source is needed beyond what was extracted.

Progressive disclosure applies to how data is queried and surfaced. It does **not** apply to extraction. Every source that enters the pipeline receives full-fidelity extraction.

### 3. Append-Only Data Architecture

Nothing is deleted. Nothing is overwritten. Every change creates a new record.

- Research Positions are versioned: updates create new version records; previous versions remain intact and queryable.
- Data Points are immutable once created.
- Curator Observations are immutable once created.
- Mental Models are immutable with optional annotations.
- Recovery from agent errors is always possible by reverting a pointer, never by restoring deleted data.

### 4. Full-Fidelity Extraction

Every source that enters the pipeline receives thorough extraction regardless of source tier. The tier affects how data points are weighted in analysis and synthesis, not whether they are extracted thoroughly. Data points are abstractions of the original source. They must be captured at sufficient fidelity that the Analyst does not need to return to the original source under normal conditions.

---

## User Personas

### Research Persona (Maicol)

The curator. Uploads sources, tracks the processing pipeline, ensures extraction quality, writes curator observations, captures mental models. This persona controls what enters the system and at what quality bar.

**Needs:** Efficient intake workflow. Full pipeline visibility. Ability to review and annotate at every stage. Iteration on extraction quality over time.

**Interface:** MCP (full access to all tools).

### Analyst Persona (Maicol)

The power user. Queries the knowledge base to analyze new projects, opportunities, and external context against curated research. Needs full traceability: claim to data point to interpretation to verbatim text to original source.

**Needs:** Progressive disclosure navigation. Cross-referencing across time (3-6 months). Semantic search across all entity types. Ability to verify any claim down to the original source.

**Interface:** MCP (full access, all layers of progressive disclosure).

### Reader Persona (Others)

External users who query the curated knowledge base. Can see Research Positions, data points (claim + interpretation + source metadata), and Mental Models. Cannot see verbatim anchor quotes or original source text. Directed to source URLs for independent verification.

**Needs:** Natural language query interface. Evidence-grounded responses. Clear source attribution with URLs. Transparent about what's curator interpretation vs. external evidence.

**Interface:** Authenticated REST API (filtered view) + LLM wrapper (Claude Project, Custom GPT, or similar). Secondary priority; built after the foundation is validated for the Research and Analyst personas.

**Access boundary:** The Reader can access everything through Layer 2 (Evidence) of progressive disclosure, but Layer 3 (Verification: verbatim quotes) and Layer 4 (Full Source: original text/files) are restricted to the Analyst persona only.

---

## Foundation Entities

### 1. Sources

The provenance record for every piece of external content that enters the system.

| Field | Description | Notes |
|-------|-------------|-------|
| title | Source title | Required |
| authorName | Author or creator | Optional |
| publisherName | Publication or platform | Optional |
| canonicalUrl | URL to original source | Optional (not all sources have URLs) |
| publishedDate | Original publication date | Optional |
| sourceType | article, report, podcast, video, etc. | Required |
| tier | 1 (primary research), 2 (informed analysis), 3 (commentary) | Required |
| intakeNote | Curator's reason for adding this source | Optional (sometimes it's a gut feeling) |
| urlAccessibility | public, paywalled, private | Required (informs Reader experience) |
| fullText | Complete source text | For Analyst access only |
| contentHash | SHA256 for deduplication | Auto-generated |
| storageId | Reference to uploaded file in Convex storage | Optional |
| sourceRelationships | References to related sources (derivative, responds-to, etc.) | Optional |
| ingestedDate | When the source was added to the system | Auto-generated |
| status | indexed, extracted, failed | Auto-managed by pipeline |

### 2. Data Points

The atomic unit of the entire system. Each data point represents a single curated claim extracted from a source, anchored by verbatim text.

| Field | Description | Notes |
|-------|-------------|-------|
| sourceId | Reference to parent source | Required |
| dpSequenceNumber | Order within the source extraction | Auto-incremented |
| claimText | The synthesized claim | Required |
| anchorQuote | Verbatim 5-15 words from source | Required (Analyst-only access) |
| extractionNote | Why this DP matters; significance and context | Added in Pass 2 enrichment |
| evidenceType | statistic, framework, prediction, case-study, observation, recommendation | Required |
| confidence | strong, moderate, suggestive | Added in Pass 2 enrichment |
| locationType | paragraph, page, timestamp, section | Required |
| locationStart | Location reference within source | Required |
| relatedDataPoints | Array of DP IDs from the same source that form an argument chain | Optional, added in Pass 2 |
| extractionDate | When this DP was extracted | Auto-generated |
| embedding | 1536-dim vector (OpenAI text-embedding-3-small) | Auto-generated |
| tags | Linked via junction table (dataPointTags) | Required (at least 1) |

### 3. Curator Observations

The curator's connective insights. These bridge data points and positions in ways the original sources don't, grounded in the curator's professional experience and perspective.

| Field | Description | Notes |
|-------|-------------|-------|
| observationText | The insight or connection being made | Required |
| referencedDataPoints | Array of DP IDs this observation builds on | Optional (may reference positions instead, or both) |
| referencedPositions | Array of Research Position IDs this relates to | Optional |
| capturedDate | When the observation was made | Auto-generated |
| embedding | 1536-dim vector | Auto-generated |
| tags | Linked via junction table | Optional |

### 4. Mental Models

Reusable cognitive tools: frameworks, analogies, memorable terms, and concepts. Captured during extraction, used for recall and communication.

| Field | Description | Notes |
|-------|-------------|-------|
| modelType | framework, analogy, term, metaphor, principle | Required |
| title | Name of the mental model (e.g., "Capability-Dissipation Gap") | Required |
| description | What it means and how to use it | Required |
| sourceId | Source where first encountered | Required |
| sourceDataPointId | Specific DP it was extracted from | Optional |
| capturedDate | When it was added | Auto-generated |
| embedding | 1536-dim vector | Auto-generated |
| tags | Linked via junction table | Optional |

### 5. Research Positions (Versioned)

The curator's synthesized theses about the research landscape. Organized under Research Themes. Every update creates a new version; nothing is overwritten.

**Research Themes table:**

| Field | Description | Notes |
|-------|-------------|-------|
| title | Theme name (e.g., "Enterprise AI Adoption Constraints") | Required |
| description | Brief description of the theme's scope | Optional |
| createdDate | When the theme was established | Auto-generated |

**Research Positions table (identity record):**

| Field | Description | Notes |
|-------|-------------|-------|
| themeId | Parent Research Theme | Required |
| title | Position title | Required |
| currentVersionId | Pointer to the latest version | Updated on each new version |
| createdDate | When the position was first created | Auto-generated |

**Position Versions table (append-only):**

| Field | Description | Notes |
|-------|-------------|-------|
| positionId | Parent Research Position | Required |
| versionNumber | Sequential version number | Auto-incremented |
| previousVersionId | Pointer to prior version | Null for version 1 |
| currentStance | The curator's current thesis statement | Required |
| confidenceLevel | emerging, active, established | Required |
| status | emerging, active, established, evolved, retired | Required |
| supportingEvidence | Array of DP IDs | Required (at least 1) |
| counterEvidence | Array of DP IDs | Optional |
| curatorObservations | Array of Curator Observation IDs | Optional |
| mentalModels | Array of Mental Model IDs | Optional |
| openQuestions | Array of strings: what would change this position | Optional |
| changeSummary | What triggered this version (which new DPs, what shifted) | Required (except version 1) |
| versionDate | When this version was created | Auto-generated |
| embedding | 1536-dim vector of currentStance | Auto-generated |

### 6. Tags

Flat controlled vocabulary applied to data points. Powers retrieval and trend detection.

| Field | Description | Notes |
|-------|-------------|-------|
| name | Display name | Required |
| slug | URL-safe identifier | Required, unique |
| category | Optional grouping (topic, method, sector, etc.) | Optional |

**Junction tables:** dataPointTags, curatorObservationTags, mentalModelTags. Tags do not attach to Research Positions directly; position-level tag queries traverse through linked evidence.

### 7. Research Lens (System Artifact)

A compressed document reflecting the current state of Research Positions. Auto-generated, not manually maintained.

| Field | Description | Notes |
|-------|-------------|-------|
| currentPositions | Compressed list of active position stances (5-8 strongest) | Auto-generated from position versions |
| openQuestions | Aggregated from position open questions | Auto-generated |
| surpriseSignals | What evidence would challenge current positions | Auto-generated |
| generatedDate | When this lens was created | Auto-generated |
| triggeredBy | "weekly-synthesis" or "exception-signal" | Auto-set |

Regenerated weekly after position updates. Exception trigger: when extraction flags data points that contradict current positions.

---

## Extraction Pipeline

### Overview

Every source goes through a three-pass pipeline. Each pass is a separate sub-agent with a bounded task. Sources are processed one at a time to preserve context window effectiveness and extraction fidelity.

### Document Preparation (Pre-Pass)

Before extraction, a prep step classifies the document and determines processing strategy:

- **Markdown files (any length):** Send directly to Pass 1 as a single unit.
- **PDFs under 20 pages:** Extract text, send to Pass 1 as a single unit.
- **PDFs over 20 pages:** Extract text, split by chapters or section breaks into chunks of 8-15 pages. Each chunk gets its own Pass 1 sub-agent. Results are merged before Pass 2.

### Pass 1: Core Extraction

**Agent focus:** Accuracy and fidelity. One job: read the source and extract atomic data points with verbatim anchors.

**Inputs:** Source text (or chunk). Source metadata (title, author, type).

**Outputs per data point:** Claim text, anchor quote, location, evidence type.

**Also flags:** Any notable frameworks, analogies, or terms encountered (flagged for Mental Model capture, not fully described in this pass).

**Does NOT receive:** The Research Lens. No interpretive frame. No enrichment. The model extracts what the source contains, not what the curator is looking for.

### Pass 2: Enrichment

**Agent focus:** Judgment and evaluation. Adds the interpretive layer to extracted data points.

**Inputs:** Pass 1 data points (structured, not the full source text). Source metadata (including tier and intake note, if provided). The current Research Lens.

**Outputs per data point:** Confidence signal (strong/moderate/suggestive). Extraction note (why this DP matters, connections to current positions or open questions). Related DP links within the source (argument chains).

**Also creates:** Mental Model records for any frameworks/analogies/terms flagged in Pass 1 (title, description, source link).

### Pass 3: Curator Review

**Agent focus:** Human-in-the-loop quality check. Review by exception, not exhaustive review.

**System flags for curator attention:**
- Low-confidence DPs from Tier 1 sources (unexpected; may indicate extraction missed something)
- High-confidence DPs from Tier 3 sources (suspicious; may indicate over-crediting a weak source)
- DPs flagged as contradicting a current Research Position (important signal)
- DPs where the verbatim anchor could not be verified against source text (quality issue)

**Curator actions:** Approve, adjust confidence, add a curator note, flag for re-extraction, or add a Curator Observation that connects this DP to existing research.

### Post-Pipeline

- Data points saved to Convex (append-only)
- Embeddings generated (triggered inline or via batch process)
- Source status updated to "extracted"
- If any DPs were flagged as contradicting current positions, evaluate whether the Research Lens needs an exception update

---

## Batch Reprocessing Architecture

For processing large backlogs (e.g., reprocessing all 178 February sources through the new pipeline):

### Triage Interface

A lightweight single-page React app for rapid source classification:

- Displays all sources in the processing queue
- For each source: name, file type, size/page count
- Curator inputs: tier (1/2/3), optional intake note, optional source relationships, process yes/no
- Reads from and writes to Convex
- Build target: one afternoon in Cowork

### Batch Orchestration

A processing coordinator (Cowork skill or standalone script) that:

- Manages the queue of triaged sources
- Spawns Pass 1 sub-agents (parallelized across sources, one agent per source/chunk)
- Queues Pass 2 for each source after its Pass 1 completes
- Collects flagged DPs for curator review
- Handles failures gracefully (log, skip, continue, report)
- Tracks progress: how many sources processed, pending, failed

### Model Selection for Cost Optimization

- **Pass 1 (extraction):** Sonnet-tier model. Precision task (structured extraction, verbatim quotes). Strong at this without needing Opus-level reasoning.
- **Pass 2 (enrichment):** Opus-tier model. Judgment task (assessing significance, connecting to research lens). Benefits from deeper reasoning.
- **Document prep:** Haiku-tier model. Classification task (determine chunk strategy). Lightweight.

### Deduplication

When reprocessing sources that were previously extracted:

- Compare new DP claim text embeddings against existing DPs from the same source
- Flag high-similarity matches for curator review
- Original extraction data preserved as v1; reprocessed data stored as v2
- Curator decides which version to treat as current

---

## MCP Tool Architecture (Curate Mind v1)

### Research Persona Tools (Intake & Extraction)

| Tool | Description |
|------|-------------|
| `add_source` | Ingest a source from URL, file, or text. Requires: title, sourceType, tier. Optional: intakeNote, sourceRelationships, urlAccessibility. |
| `extract_source` | Trigger the three-pass extraction pipeline on a source. Returns progress and flagged items for curator review. |
| `add_curator_observation` | Create a new Curator Observation, linking it to data points and/or positions. |
| `add_mental_model` | Create a new Mental Model record (can also be created automatically during Pass 2). |

### Analyst Persona Tools (Query & Analysis)

| Tool | Description |
|------|-------------|
| `get_themes` | Return all Research Themes with position counts and summary stats. (Layer 1) |
| `get_positions` | Return positions within a theme, or all positions matching a filter. Current stance, confidence, status. (Layer 1) |
| `get_position_detail` | Return a position with all linked evidence, counter-evidence, observations, mental models, and version history. (Layer 2) |
| `get_data_point` | Return a single DP with full detail including anchor quote and extraction note. (Layer 3) |
| `get_source_text` | Return the full text of a source. (Layer 4) |
| `search_knowledge_base` | Semantic vector search across data points, positions, observations, and mental models. Returns results at the highest applicable layer. |
| `get_tag_trends` | Return tag frequency over time periods. Identifies emerging and growing topics. |
| `get_position_history` | Return all versions of a position with diffs. Supports the 3-6 month cross-referencing use case. |
| `compare_positions` | Show how two or more positions relate, including shared evidence and tension points. |

### Synthesis Tools (Position Management)

| Tool | Description |
|------|-------------|
| `update_position` | Create a new version of a Research Position. Append-only: previous version preserved. Requires change summary. |
| `create_position` | Create a new Research Position under a theme with initial stance and evidence. |
| `create_theme` | Create a new Research Theme. |
| `update_research_lens` | Regenerate the Research Lens from current position states. |

### Reader Persona API (Authenticated REST, Phase 2)

Filtered subset of Analyst tools. Returns all data except:
- `anchorQuote` on data points (omitted)
- `fullText` on sources (omitted)
- `storageId` on sources (omitted)
- Layer 3 and Layer 4 access (restricted)

Adds:
- Query logging (timestamp, query text, results returned) for understanding Reader usage patterns.

---

## What Was Removed from CRIS

| CRIS Artifact | Curate Mind Replacement |
|---------------|------------------------|
| Weekly Learnings (documents) | Position version history + change summaries |
| Current Synthesis (document) | Queryable aggregate state of Research Positions |
| Active Ideas (document) | Research Positions in Convex |
| Talking Points (maintained artifacts) | Generated on demand from positions |
| Language Assets (library) | Mental Models (captured during extraction) |
| Evolution logs (narrative) | Structured position versioning (append-only) |
| Markdown extraction files | Convex as source of truth (no dual-write) |
| Citation HTML metadata | No frontend parser contract |
| Filename validation | No file system naming conventions needed |
| Index file synchronization | Convex handles indexing natively |
| Tag hygiene protocol | Flat tag list, trend detection at query time |
| Three-session synthesis workflow | Position updates as needed (not session-bound) |
| Multiple system files to load per operation | Research Lens as single context document |

---

## Migration Path from CRIS

### Phase 1: Schema & MCP (Build the foundation)

1. Design and deploy new Convex schema (preserving existing tables during transition)
2. Build updated MCP tools for Research and Analyst personas
3. Build extraction pipeline (Pass 1, Pass 2, Pass 3 orchestration)
4. Build Research Lens generation

### Phase 2: Reprocess February (Validate the pipeline)

1. Build triage interface
2. Build batch orchestration skill
3. Triage all 178 February sources (assign tiers, intake notes)
4. Run full reprocessing pipeline
5. Curator review of flagged items
6. Validate: are the reprocessed extractions higher quality than the originals?

### Phase 3: Synthesize (Build the position layer)

1. Create Research Themes from the patterns in February's data
2. Create initial Research Positions (migrating and refining the 18 CRIS Active Ideas)
3. Link evidence from reprocessed data points
4. Generate initial Research Lens
5. Create Curator Observations that capture the connective insights from CRIS User Observations

### Phase 4: Reader Access (Expose the foundation)

1. Add authenticated HTTP endpoints to Convex (filtered view)
2. Add query logging
3. Build first Reader interface (Claude Project or Custom GPT with API as tool)
4. Test with 2-3 external users
5. Iterate based on Reader usage patterns

---

## Open Questions for Technical Review

1. **Embedding model lock-in:** Currently using OpenAI text-embedding-3-small (1536 dims). If we switch providers or models, all embeddings need regeneration. Should we abstract the embedding layer?

2. **Convex as sole backend:** All data lives in Convex. Should we build an export/backup strategy from day one?

3. **Pass 1 model selection:** Is Sonnet sufficient for high-fidelity verbatim extraction on complex PDFs, or does extraction quality justify Opus for Tier 1 sources?

4. **Research Lens size:** The lens needs to fit in Pass 2's context window alongside the extracted DPs. As positions grow, the lens grows. What's the compression strategy when positions exceed a manageable size?

5. **Reader authentication model:** API keys? OAuth? Usage-based pricing? Deferred to Phase 4 but worth early consideration.

6. **Curator Observation as a connection:** When an observation references 5+ data points across multiple sources and positions, how should the search index handle it? Embed the full observation text, or create multiple embeddings for different facets?

---

*This spec was developed through a collaborative design session on March 17, 2026, starting from an outside-in audit of the CRIS Research System and iterating through persona definition, data model design, extraction pipeline architecture, and deliverable simplification.*
