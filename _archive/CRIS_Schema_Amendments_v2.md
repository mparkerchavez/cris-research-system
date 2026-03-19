# CRIS Database Schema: Design Amendments (v2)

**Date:** 2026-02-22
**Context:** Feedback from Maicol on v1 schema, incorporating real workflow requirements
**Depends on:** `CRIS_Database_Schema_Migration.md` (original schema document)

---

## What This Document Is

This is a set of amendments to the original database schema based on how the CRIS system actually needs to work. It covers six areas the original schema didn't fully address:

1. **Dual audience model** -- readers see data points, curator sees full lineage
2. **Richer source representation** -- sources as public-facing "cards" with attribution
3. **Full source text storage** -- self-contained database with original content
4. **Universal citation linkage** -- everything traces back to data points
5. **Vector search architecture** -- embeddings for knowledge base queries
6. **Curator perspective capture** -- notes at upload time and synthesis time
7. **Structured location anchors** -- deep-linking into original sources for verification
8. **Linguistic assets** -- frameworks and terminology with source traceability

Each section explains the *why* in plain language, then provides the SQL for implementation.

---

## How to Use This Document

**If you're implementing with AI assistance:** Share both this document and the original `CRIS_Database_Schema_Migration.md` with your AI tool. This document takes priority where the two conflict. The AI should be able to generate migration scripts, API endpoints, and frontend code from these specifications.

**If you're reviewing the design:** Focus on the "Why" and "What This Enables" sections under each amendment. Skip the SQL blocks -- those are implementation instructions.

---

## Amendment 1: Richer Source Representation

### Why

Sources aren't just internal metadata. They serve two purposes:

1. **For readers:** A "source card" that attributes the original author and links them to the original content. This is about promoting the people whose work you're synthesizing.
2. **For you as curator:** A complete record that lets you verify data points against the original text.

The v1 schema had a minimal `sources` table. This amendment makes it rich enough to render a public attribution card and store the full original content.

### What This Enables

- Readers can click through from a data point to learn about and visit the original source
- You can verify any data point against the full original text without leaving the app
- Vector search can index the full source content for knowledge base queries

### Schema Change: Replace SOURCES table

```sql
CREATE TABLE sources (
    source_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity and attribution (public-facing)
    title VARCHAR(512) NOT NULL,           -- Article/paper/video title
    author_name VARCHAR(255),              -- Primary author
    author_url TEXT,                       -- Author's profile/site (for attribution links)
    publisher VARCHAR(255),                -- Publication name (e.g., "Financial Times", "Every")
    publisher_url TEXT,                    -- Publisher homepage
    canonical_url TEXT,                    -- Permanent link to original content
    published_date DATE,
    source_type VARCHAR(50) NOT NULL,      -- 'article', 'research_paper', 'video_transcript',
                                           -- 'podcast_transcript', 'report', 'blog_post'
    description TEXT,                      -- 1-2 sentence summary for public display
    cover_image_url TEXT,                  -- Optional thumbnail for source cards

    -- Full content (curator-only, never exposed to readers)
    full_text TEXT,                        -- Complete text of the source
    full_text_format VARCHAR(20)
        DEFAULT 'plaintext',              -- 'plaintext', 'markdown', 'html'
    content_hash VARCHAR(64),             -- SHA256 for dedup
    word_count INTEGER,

    -- Ingestion metadata
    ingested_date DATE NOT NULL DEFAULT CURRENT_DATE,
    file_path VARCHAR(512),               -- Original location in 01_Raw_Inputs/
    status VARCHAR(50) DEFAULT 'indexed', -- 'indexed', 'extracted', 'archived'
    metadata JSONB,                       -- Flexible: license info, paywall status, etc.

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT source_title_date_unique UNIQUE(title, published_date)
);

CREATE INDEX idx_sources_published_date ON sources(published_date DESC);
CREATE INDEX idx_sources_source_type ON sources(source_type);
CREATE INDEX idx_sources_status ON sources(status);
CREATE INDEX idx_sources_publisher ON sources(publisher);
CREATE INDEX idx_sources_full_text_search ON sources
    USING gin(to_tsvector('english', title || ' ' || COALESCE(author_name, '')
    || ' ' || COALESCE(description, '')));
```

### What Changed from v1

- Added `author_url`, `publisher`, `publisher_url`, `canonical_url` for public attribution
- Added `description` and `cover_image_url` for source cards
- Added `full_text` and `full_text_format` for self-contained storage
- Renamed `name` to `title` (clearer semantics)
- Renamed `author` to `author_name` (clearer semantics)

---

## Amendment 2: Structured Location Anchors on Data Points

### Why

Right now, `citation_location` is a free-text string like "(para. 3)" or "(p. 42)" or "(12:35)". That's fine for display, but it can't power a "click to jump to the exact passage" experience. For your curator verification workflow, you need to click a data point and land directly on the relevant passage in the original source.

This means storing structured location data so the frontend can compute where to scroll or highlight.

### What This Enables

- Click a data point, get taken to the exact paragraph/page/timestamp in the source
- Highlight the anchor quote in context within the original document
- Support different source types (articles use paragraphs, PDFs use pages, videos use timestamps)

### Schema Change: Add structured location fields to DATA_POINTS

```sql
CREATE TABLE data_points (
    dp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(source_id) ON DELETE RESTRICT,
    extraction_file_id UUID REFERENCES extraction_files(extraction_file_id),
    dp_sequence_number INTEGER NOT NULL,   -- DP1, DP2, etc. within extraction

    -- Core content (never truncated, full fidelity)
    claim_text TEXT NOT NULL,              -- The interpreted insight
    anchor_quote TEXT,                     -- Verbatim text from source (proof)
    curator_interpretation TEXT,           -- How this DP was interpreted/why it matters

    -- Structured location (for deep-linking into source)
    citation_display VARCHAR(255),         -- Human-readable: "(para. 3)", "(p. 42)", "(12:35)"
    location_type VARCHAR(20),             -- 'page', 'paragraph', 'timestamp', 'section', 'offset'
    location_start INTEGER,                -- Start position (page number, para number, or second)
    location_end INTEGER,                  -- End position (for ranges)
    location_section VARCHAR(255),         -- Section/chapter heading if applicable
    location_char_offset INTEGER,          -- Character offset in full_text for precise highlighting

    -- Classification
    evidence_type VARCHAR(50),             -- 'empirical', 'anecdotal', 'framework', 'prediction',
                                           -- 'case_study', 'expert_opinion', 'data_metric'
    confidence_score NUMERIC(3,2),         -- 0.00 to 1.00
    normalization_level INTEGER,           -- 1, 2, or 3 per Data_Point_Normalization.md
    is_controversial BOOLEAN DEFAULT FALSE,

    -- Dates
    extraction_date DATE NOT NULL,
    processed_date DATE,                   -- When used in synthesis

    -- Flexible metadata
    metadata JSONB,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT dp_source_sequence_unique UNIQUE(source_id, dp_sequence_number)
);

CREATE INDEX idx_dp_source_id ON data_points(source_id);
CREATE INDEX idx_dp_extraction_file_id ON data_points(extraction_file_id);
CREATE INDEX idx_dp_extraction_date ON data_points(extraction_date DESC);
CREATE INDEX idx_dp_evidence_type ON data_points(evidence_type);
CREATE INDEX idx_dp_claim_fts ON data_points
    USING gin(to_tsvector('english', claim_text));
CREATE INDEX idx_dp_anchor_fts ON data_points
    USING gin(to_tsvector('english', COALESCE(anchor_quote, '')));
```

### What Changed from v1

- Renamed `citation_location` to `citation_display` (display-only string)
- Added `location_type`, `location_start`, `location_end`, `location_section`, `location_char_offset` for structured deep-linking
- Added `curator_interpretation` for your notes about why this DP matters
- Added full-text search index on `anchor_quote` (not just `claim_text`)
- Removed `context_before` and `context_after` (the full source text + char offset replaces this)

---

## Amendment 3: Universal Citation Table

### Why

In v1, citations were scattered across different relationship tables (idea_supporting_evidence, tp_evidence_lines, etc.). But your requirement is clear: *everything* in the synthesis workflow should trace back to data points. Talking points, weekly learnings, synthesis takeaways, pivot phrases, curator notes -- all of it.

Rather than adding citation columns to every table, a single universal citation table lets any piece of content reference any data point. This is simpler to implement and easier to extend as you add new content types.

### What This Enables

- Every claim anywhere in the system can be traced to its supporting data points
- Readers see "backed by 3 sources" on any piece of content
- You can query "which data points are most cited across the entire system"
- Adding citations to new content types (like linguistic assets) requires zero schema changes

### New Table: CITATIONS (universal)

```sql
CREATE TABLE citations (
    citation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What is being cited (the content making a claim)
    citing_entity_type VARCHAR(50) NOT NULL,  -- 'idea', 'idea_counterargument',
                                              -- 'talking_point', 'tp_pivot_phrase',
                                              -- 'weekly_learning', 'synthesis_takeaway',
                                              -- 'language_asset', 'curator_note'
    citing_entity_id UUID NOT NULL,           -- ID of the entity making the claim
    citing_text_excerpt TEXT,                 -- The specific sentence/passage being supported

    -- What supports it (always a data point)
    dp_id UUID NOT NULL REFERENCES data_points(dp_id) ON DELETE RESTRICT,

    -- Citation metadata
    citation_role VARCHAR(50) DEFAULT 'supports',  -- 'supports', 'contradicts',
                                                    -- 'provides_context', 'quantifies',
                                                    -- 'illustrates', 'originated_from'
    display_label VARCHAR(255),               -- For rendering: "[BCG_EmergingAgenticEnterprise DP4]"
    confidence NUMERIC(3,2),                  -- How strongly this DP supports the claim
    added_by VARCHAR(50) DEFAULT 'system',    -- 'system' (auto-parsed) or 'curator' (manually added)
    verified BOOLEAN DEFAULT FALSE,           -- Curator has confirmed this citation is accurate

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_citation UNIQUE(citing_entity_type, citing_entity_id, dp_id)
);

CREATE INDEX idx_citations_entity ON citations(citing_entity_type, citing_entity_id);
CREATE INDEX idx_citations_dp_id ON citations(dp_id);
CREATE INDEX idx_citations_role ON citations(citation_role);
CREATE INDEX idx_citations_verified ON citations(verified);
```

### How This Replaces v1 Tables

The v1 tables `idea_supporting_evidence` and `idea_counterarguments` still exist but now for storing the *relationship description* (what the evidence says, what the counterargument challenges). The actual citation linkage moves to this universal table. Same for `tp_evidence_lines` -- the evidence description stays, but the DP linkage is in `citations`.

This means you can add citations to talking point pivot phrases, weekly learning themes, or any future content type without touching the schema.

---

## Amendment 4: Curator Notes (Perspective Capture)

### Why

You want to capture your thinking at two moments:

1. **At upload/extraction time:** Your initial reaction to a source. "This confirms what I was seeing about specification as a bottleneck." or "This framework from Dan Shapiro could be useful for the maturity model idea."
2. **At synthesis time:** Your broader reflection when connecting this source to ideas. "This is the third source this week pointing to the same trust deficit. The pattern is accelerating."

These are distinct from the data points themselves. Data points are objective extractions. Curator notes are your subjective interpretation and strategic thinking.

### What This Enables

- Capture initial thinking before it fades (the "marginalia" impulse)
- See the evolution of your perspective: "What did I think when I first saw this vs. what do I think now?"
- Search your own annotations when preparing for meetings or writing
- Future: AI can use your curator notes as context for better synthesis

### New Table: CURATOR_NOTES

```sql
CREATE TABLE curator_notes (
    note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What this note is about
    entity_type VARCHAR(50) NOT NULL,     -- 'source', 'data_point', 'idea',
                                          -- 'talking_point', 'weekly_learning'
    entity_id UUID NOT NULL,              -- ID of the thing being annotated

    -- The note itself
    note_text TEXT NOT NULL,              -- Your perspective/reaction
    note_type VARCHAR(50) NOT NULL,       -- 'upload_reaction' (at source capture time)
                                          -- 'extraction_note' (during DP extraction)
                                          -- 'synthesis_reflection' (during weekly/monthly synthesis)
                                          -- 'verification_note' (when fact-checking)
                                          -- 'general' (anytime)

    -- Context about when this was written
    context_description VARCHAR(512),     -- Optional: "During Feb 15-22 synthesis session"
                                          -- or "After reading the BCG report"

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- Note: intentionally no updated_at. Notes are immutable snapshots of your
    -- thinking at a point in time. Write a new note instead of editing.
);

CREATE INDEX idx_curator_notes_entity ON curator_notes(entity_type, entity_id);
CREATE INDEX idx_curator_notes_type ON curator_notes(note_type);
CREATE INDEX idx_curator_notes_created ON curator_notes(created_at DESC);
CREATE INDEX idx_curator_notes_fts ON curator_notes
    USING gin(to_tsvector('english', note_text));
```

### Design Decision: Notes Are Immutable

Notes don't have an `updated_at` column. This is intentional. A curator note is a snapshot of your thinking at a specific moment. If your perspective changes, you write a *new* note rather than editing the old one. This preserves the evolution of your thinking and avoids the question of "which version of the note was accurate."

---

## Amendment 5: Linguistic Assets with Source Traceability

### Why

Frameworks, terminology, analogies, and other linguistic extractions are valuable output of the CRIS system, but in v1 they were somewhat disconnected from the citation chain. They should have the same source traceability as data points.

### Schema Change: Strengthen LANGUAGE_ASSETS table

```sql
CREATE TABLE language_assets (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Classification
    asset_type VARCHAR(50) NOT NULL,       -- 'framework', 'analogy', 'term',
                                           -- 'comparison', 'provocation',
                                           -- 'anti_pattern', 'numerical_rule'
    title VARCHAR(255) NOT NULL,           -- Short name: "Five-Level Maturity Framework"
    description TEXT NOT NULL,             -- Full description of the asset
    usage_context TEXT,                    -- When/how to deploy this in conversation

    -- Source traceability (same pattern as data points)
    source_id UUID NOT NULL REFERENCES sources(source_id) ON DELETE RESTRICT,
    anchor_quote TEXT,                     -- Verbatim from source where this was found
    citation_display VARCHAR(255),         -- "(p. 12)" or "(14:35)"
    location_type VARCHAR(20),
    location_start INTEGER,
    location_end INTEGER,
    location_char_offset INTEGER,

    -- Lifecycle
    status VARCHAR(50) DEFAULT 'active',   -- 'active', 'archived', 'superseded'
    extraction_week DATE,                  -- Which weekly cycle this was extracted in

    -- Flexible metadata
    metadata JSONB,                        -- Examples used, related assets, etc.

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_la_asset_type ON language_assets(asset_type);
CREATE INDEX idx_la_source_id ON language_assets(source_id);
CREATE INDEX idx_la_status ON language_assets(status);
CREATE INDEX idx_la_fts ON language_assets
    USING gin(to_tsvector('english', title || ' ' || description));
```

### Language Asset Tags (many-to-many)

```sql
CREATE TABLE language_asset_tags (
    la_tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES language_assets(asset_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE RESTRICT,
    CONSTRAINT unique_la_tag UNIQUE(asset_id, tag_id)
);

CREATE INDEX idx_la_tags_asset ON language_asset_tags(asset_id);
CREATE INDEX idx_la_tags_tag ON language_asset_tags(tag_id);
```

---

## Amendment 6: Vector Search Architecture

### Why

You described two search experiences:

1. **Reader search:** Find relevant data points and ideas by topic or question
2. **Curator search:** Query across the full knowledge base, including original sources, for meeting prep, research, and cross-referencing

Both require vector embeddings -- numerical representations of text that let you find semantically similar content even when the exact words don't match.

### What This Enables

- Ask "what do we know about trust in AI agents?" and get relevant DPs, ideas, and source passages
- Meeting prep: provide client context and get relevant insights from across the knowledge base
- Discover connections between sources that share concepts but use different terminology
- Find data points that are semantically similar but were extracted from different sources

### Implementation Approach: pgvector Extension

PostgreSQL's `pgvector` extension stores and indexes vector embeddings natively. We add embedding columns to the tables where search is needed.

```sql
-- Enable the extension (one-time setup)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns to existing tables
-- (these are added via ALTER TABLE, not new tables)

-- Data point embeddings (primary search target)
ALTER TABLE data_points
    ADD COLUMN embedding vector(1536);     -- OpenAI ada-002 dimension
                                            -- or vector(768) for smaller models

-- Source chunk embeddings (for curator deep-search)
-- Full sources are too long for single embeddings, so we chunk them
CREATE TABLE source_chunks (
    chunk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,               -- ~500-1000 token passage
    chunk_sequence INTEGER NOT NULL,        -- Order within source
    char_offset_start INTEGER NOT NULL,     -- Where this chunk starts in full_text
    char_offset_end INTEGER NOT NULL,       -- Where this chunk ends
    embedding vector(1536),                 -- Vector representation
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_source_chunk UNIQUE(source_id, chunk_sequence)
);

-- Idea embeddings (for thematic search)
ALTER TABLE ideas
    ADD COLUMN embedding vector(1536);

-- Language asset embeddings
ALTER TABLE language_assets
    ADD COLUMN embedding vector(1536);

-- Curator note embeddings (search your own thinking)
ALTER TABLE curator_notes
    ADD COLUMN embedding vector(1536);

-- Vector indexes (IVFFlat for fast approximate nearest neighbor)
CREATE INDEX idx_dp_embedding ON data_points
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_source_chunks_embedding ON source_chunks
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_ideas_embedding ON ideas
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);

CREATE INDEX idx_la_embedding ON language_assets
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);

CREATE INDEX idx_curator_notes_embedding ON curator_notes
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);

-- Supporting indexes for chunk lookups
CREATE INDEX idx_source_chunks_source ON source_chunks(source_id);
CREATE INDEX idx_source_chunks_offset ON source_chunks(source_id, char_offset_start);
```

### How Search Works (Conceptual)

**Reader search: "What does the research say about trust in AI agents?"**

```sql
-- 1. Convert question to embedding (done in application layer)
-- 2. Find nearest data points
SELECT dp.dp_id, dp.claim_text, dp.anchor_quote,
       s.title as source_title, s.author_name, s.canonical_url,
       1 - (dp.embedding <=> $query_embedding) as similarity
FROM data_points dp
JOIN sources s ON dp.source_id = s.source_id
ORDER BY dp.embedding <=> $query_embedding
LIMIT 10;
```

**Curator search: "Find everything related to specification as a bottleneck"**

```sql
-- Search across DPs, ideas, source chunks, and curator notes simultaneously
WITH combined_results AS (
    -- Data points
    SELECT 'data_point' as result_type, dp_id::text as entity_id,
           claim_text as content, embedding
    FROM data_points
    UNION ALL
    -- Ideas
    SELECT 'idea', idea_id::text, current_position, embedding
    FROM ideas WHERE embedding IS NOT NULL
    UNION ALL
    -- Source chunks (curator-only)
    SELECT 'source_chunk', chunk_id::text, chunk_text, embedding
    FROM source_chunks
    UNION ALL
    -- Curator notes
    SELECT 'curator_note', note_id::text, note_text, embedding
    FROM curator_notes WHERE embedding IS NOT NULL
)
SELECT result_type, entity_id, content,
       1 - (embedding <=> $query_embedding) as similarity
FROM combined_results
WHERE embedding IS NOT NULL
ORDER BY embedding <=> $query_embedding
LIMIT 20;
```

### Embedding Generation Strategy

Embeddings aren't generated by the database. They're computed by an external model (OpenAI, Anthropic, or an open-source model) and stored as vectors. The workflow:

1. When a source is ingested: chunk the full text, generate embeddings for each chunk
2. When a data point is extracted: generate an embedding from `claim_text + anchor_quote`
3. When an idea is updated: regenerate the embedding from `current_position`
4. When a curator note is written: generate an embedding from `note_text`

This can be done as a background job after each CRIS workflow step.

### A Note on Embedding Dimensions

The schema uses `vector(1536)` which matches OpenAI's `text-embedding-ada-002`. If you use a different model, change the dimension:

- OpenAI ada-002: 1536
- OpenAI text-embedding-3-small: 1536
- Anthropic (if/when available): TBD
- Open source (e.g., nomic-embed): 768

Pick one model and stay consistent. Mixing dimensions across rows won't work.

---

## Amendment 7: Dual Audience Access Model

### Why

Readers and curators see different depth of the same data. This isn't a schema change -- it's an API and permission design that the schema needs to support.

### Access Levels

| Content | Reader Sees | Curator Sees |
|---------|-------------|--------------|
| Data points | Claim text, source attribution, tags | + anchor quote, location, curator notes |
| Sources | Title, author, publisher, canonical URL, description | + full text, file path, ingestion metadata |
| Source chunks | Not accessible | Full text with highlighting |
| Ideas | Full content (all sections) | + evolution log, curator notes |
| Talking points | Full content | + citation verification status |
| Curator notes | Not accessible | Full access |
| Vector search | Searches DPs and ideas only | Searches everything including source chunks and notes |

### Implementation Approach

This doesn't require separate tables. It's handled by the API layer:

```python
# Pseudocode for dual-audience API
def get_data_point(dp_id, access_level='reader'):
    dp = db.query("SELECT * FROM data_points WHERE dp_id = %s", dp_id)

    if access_level == 'reader':
        return {
            'claim': dp.claim_text,
            'source': get_source_card(dp.source_id),  # Title, author, URL only
            'tags': get_dp_tags(dp.dp_id),
            'evidence_type': dp.evidence_type,
        }

    elif access_level == 'curator':
        return {
            'claim': dp.claim_text,
            'anchor_quote': dp.anchor_quote,
            'curator_interpretation': dp.curator_interpretation,
            'source': get_full_source(dp.source_id),    # Everything including full text
            'location': {
                'display': dp.citation_display,
                'type': dp.location_type,
                'start': dp.location_start,
                'end': dp.location_end,
                'char_offset': dp.location_char_offset,
            },
            'tags': get_dp_tags(dp.dp_id),
            'curator_notes': get_notes('data_point', dp.dp_id),
            'citations_using_this_dp': get_citing_entities(dp.dp_id),
        }
```

---

## Complete Entity Relationship Summary (v2)

This is the full picture of how everything connects after all amendments:

```
SOURCES (the original content)
  │
  ├─── full_text (curator-only)
  ├─── public attribution fields (reader-facing)
  │
  ├── 1:N ──→ SOURCE_CHUNKS (for vector search, curator-only)
  │              └── embedding (vector)
  │
  ├── 1:N ──→ DATA_POINTS (the atomic unit of the system)
  │              ├── claim_text + anchor_quote (full fidelity)
  │              ├── structured location (for deep-linking)
  │              ├── embedding (vector, for search)
  │              │
  │              ├── N:N ──→ TAGS (via DATA_POINT_TAGS)
  │              │
  │              └── cited by ──→ CITATIONS (universal)
  │                                 └── links to ANY entity in the system
  │
  ├── 1:N ──→ LANGUAGE_ASSETS (frameworks, terms, analogies)
  │              ├── source traceability (same as DPs)
  │              ├── embedding (vector)
  │              └── N:N ──→ TAGS (via LANGUAGE_ASSET_TAGS)
  │
  └── annotated by ──→ CURATOR_NOTES (your perspective)
                          ├── upload_reaction (at capture time)
                          ├── synthesis_reflection (at synthesis time)
                          └── embedding (vector, searchable)

IDEAS (research positions)
  ├── N:N ──→ TAGS (via IDEA_TAGS)
  ├── 1:N ──→ IDEA_SUPPORTING_EVIDENCE ──→ references DPs via CITATIONS
  ├── 1:N ──→ IDEA_COUNTERARGUMENTS ──→ references DPs via CITATIONS
  ├── 1:N ──→ IDEA_EVOLUTION_LOG
  ├── N:N ──→ IDEAS (self-referential via IDEA_RELATED_IDEAS)
  ├── embedding (vector)
  └── annotated by ──→ CURATOR_NOTES

TALKING_POINTS (conversation-ready insights)
  ├── 1:N ──→ TP_AUDIENCES (who cares, with concern + hook)
  ├── 1:N ──→ TP_EVIDENCE_LINES ──→ references DPs via CITATIONS
  ├── 1:N ──→ TP_PIVOT_PHRASES ──→ can reference DPs via CITATIONS
  └── annotated by ──→ CURATOR_NOTES

WEEKLY_LEARNINGS (periodic synthesis)
  ├── N:N ──→ IDEAS (via WEEKLY_LEARNINGS_IDEAS)
  ├── 1:N ──→ WEEKLY_LEARNING_THEMES ──→ references DPs via CITATIONS
  └── annotated by ──→ CURATOR_NOTES

CURRENT_SYNTHESIS (big-picture snapshot)
  ├── 1:N ──→ SYNTHESIS_TAKEAWAYS ──→ references DPs via CITATIONS
  └── annotated by ──→ CURATOR_NOTES
```

### The Key Insight

The **CITATIONS** table is the connective tissue. Any entity can cite any data point. Data points always trace back to sources. Sources contain the full original text with structured location data. This means you can always follow the chain from any claim, anywhere in the system, back to the exact passage in the original document.

---

## What to Build First

Given that you're implementing this incrementally with AI assistance, here's a suggested order:

### Phase 1: Foundation (get data in)
1. `sources` table (with full_text storage)
2. `data_points` table (with structured locations)
3. `tags` and `data_point_tags` tables
4. Migration script to load existing extractions
5. Basic API: list sources, list DPs, get DP detail

### Phase 2: Synthesis Layer (connect the dots)
6. `ideas` table and related tables
7. `talking_points` table and related tables
8. `citations` table (universal)
9. Migration script to load existing ideas and TPs
10. API: get idea with evidence, get TP with citations

### Phase 3: Curator Tools (your workflow)
11. `curator_notes` table
12. `language_assets` table
13. Note capture UI in the upload/extraction workflow
14. Lineage API: trace from any claim to source

### Phase 4: Search (knowledge base queries)
15. Install pgvector extension
16. `source_chunks` table
17. Generate embeddings for all existing content
18. Search API: semantic search across knowledge base
19. Search UI in the frontend

### Phase 5: Public Site (reader experience)
20. Dual-audience API layer
21. Source card rendering
22. Reader-safe data point display
23. Public search (DPs and ideas only)

---

## Flexibility Reminder

The most important thing: **this schema is changeable.** You can add columns, add tables, rename things, and restructure relationships after the fact. The two things that are hard to change are:

1. **What counts as a record** -- you've decided: data points are atomic. That's right.
2. **What the primary keys are** -- UUIDs. That's a good default and won't need to change.

Everything else is adjustable as you learn what works.
