# CRIS Research System: Database Schema Design and Migration Strategy

**Document Version:** 1.0
**Date:** 2026-02-22
**Target Platform:** PostgreSQL 14+
**Migration Status:** Design Phase

---

## Executive Summary

The CRIS Research System currently operates as a markdown-file-based architecture with Python HTTP indexing and vanilla JS frontend. This document provides a complete technical specification for migrating to a database-driven architecture while preserving all content relationships, citation integrity, and query patterns required by the Pulse, Ideas, Talking Points, and Explore views.

### Key Design Principles

1. **Atomic Data Points as Core Entity:** All content derives from granular data points (DPs) extracted from sources
2. **Citation Integrity:** Every claim must trace to a source with machine-parseable metadata
3. **Tag-Based Discoverability:** Many-to-many relationships between DPs, Ideas, Talking Points, and Tags
4. **Progressive Disclosure:** Efficient loading of summaries before drilling into detail
5. **Temporal Tracking:** Publication dates, processing dates, and evolution timestamps for all entities
6. **Evidence Tracing:** Supporting evidence and counterarguments maintain full audit trails

### Current State Snapshot

- **Raw Inputs:** ~140 source files (PDFs, transcripts, articles)
- **Extractions:** ~148 files with ~2,350+ atomic data points
- **Weekly Learnings:** 8 synthesis documents organized by tag themes
- **Active Ideas:** 18 research positions with supporting evidence tables
- **Talking Points:** 5 conversation-ready strategies with audiences and evidence lines
- **Tags:** 44 established tags + 25 emerging tags
- **Relationships:** Complex many-to-many linking via citation metadata comments

---

## Database Schema Design

### Core Philosophy

The schema follows a **data point-centric** model where data points are the source of truth. All higher-level entities (Ideas, Talking Points, Learnings) are synthesized views over collections of related data points. This design:

- Eliminates redundant citation storage
- Ensures referential integrity across relationships
- Enables fast full-text search across all content
- Supports efficient tag-based filtering and discovery
- Maintains complete evidence traceability

---

## Table Definitions

### 1. SOURCES (Raw Inputs)

Represents source materials (PDFs, transcripts, articles, research papers).

```sql
CREATE TABLE sources (
    source_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    published_date DATE,
    ingested_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source_type VARCHAR(50) NOT NULL, -- 'pdf', 'article', 'transcript', 'research', 'video'
    url TEXT,
    file_path VARCHAR(512), -- Original location in Raw_Inputs
    content_hash VARCHAR(64), -- SHA256 for deduplication
    word_count INTEGER,
    status VARCHAR(50) DEFAULT 'indexed', -- 'indexed', 'processing', 'archived'
    metadata JSONB, -- Flexible storage: source-specific fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT source_name_date_unique UNIQUE(name, published_date)
);

CREATE INDEX idx_sources_published_date ON sources(published_date DESC);
CREATE INDEX idx_sources_source_type ON sources(source_type);
CREATE INDEX idx_sources_status ON sources(status);
CREATE INDEX idx_sources_content_hash ON sources(content_hash);
```

### 2. DATA_POINTS (Core Atomic Units)

Represents individual extracted insights with complete citation metadata.

```sql
CREATE TABLE data_points (
    dp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(source_id) ON DELETE RESTRICT,
    extraction_file_id UUID, -- References extraction_files table
    dp_sequence_number INTEGER NOT NULL, -- DP1, DP2, etc within extraction
    claim_text TEXT NOT NULL, -- Main assertion
    anchor_quote TEXT, -- Direct quote from source
    citation_location VARCHAR(255), -- Page, timestamp, paragraph reference
    context_before TEXT, -- Surrounding context for understanding
    context_after TEXT,
    confidence_score NUMERIC(3,2), -- 0.00 to 1.00 for data quality
    evidence_type VARCHAR(50), -- 'empirical', 'anecdotal', 'framework', 'prediction'
    extraction_date DATE NOT NULL, -- When DP was extracted
    processed_date DATE, -- When DP was synthesized into ideas
    normalization_level INTEGER, -- 1, 2, or 3 (per Data_Point_Normalization.md)
    is_controversial BOOLEAN DEFAULT FALSE, -- Flag for contested claims
    metadata JSONB, -- Flexible DP-specific data
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT dp_uniqueness UNIQUE(source_id, dp_sequence_number)
);

CREATE INDEX idx_data_points_source_id ON data_points(source_id);
CREATE INDEX idx_data_points_extraction_file_id ON data_points(extraction_file_id);
CREATE INDEX idx_data_points_extraction_date ON data_points(extraction_date DESC);
CREATE INDEX idx_data_points_evidence_type ON data_points(evidence_type);
CREATE INDEX idx_data_points_normalization ON data_points(normalization_level);
CREATE INDEX idx_data_points_claim_text_tsvector ON data_points
    USING gin(to_tsvector('english', claim_text)); -- Full-text search
```

### 3. EXTRACTION_FILES (Extraction Metadata)

Represents individual extraction markdown files from 02_Extractions/.

```sql
CREATE TABLE extraction_files (
    extraction_file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(source_id) ON DELETE RESTRICT,
    filename VARCHAR(512) NOT NULL, -- e.g., "AIDaily_AICapex650B_2026-02-18.md"
    file_path VARCHAR(512) NOT NULL, -- Full path in filesystem
    processed_date DATE NOT NULL,
    processed_by VARCHAR(255), -- Claude agent/user that processed it
    total_dps INTEGER, -- Count of DPs in this extraction
    quality_score NUMERIC(3,2), -- Average quality across DPs
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'archived'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT extraction_filename_unique UNIQUE(filename)
);

CREATE INDEX idx_extraction_files_source_id ON extraction_files(source_id);
CREATE INDEX idx_extraction_files_processed_date ON extraction_files(processed_date DESC);
```

### 4. TAGS (Controlled Vocabulary)

Tag vocabulary for categorizing data points and ideas.

```sql
CREATE TABLE tags (
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_name VARCHAR(100) NOT NULL UNIQUE, -- '#agentic-workflows'
    tag_slug VARCHAR(100) NOT NULL UNIQUE, -- 'agentic-workflows'
    definition TEXT,
    status VARCHAR(50) DEFAULT 'established', -- 'established', 'emerging', 'deprecated'
    source_count INTEGER DEFAULT 0, -- Number of sources using this tag
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_status ON tags(status);
CREATE INDEX idx_tags_slug ON tags(tag_slug);
```

### 5. DATA_POINT_TAGS (Many-to-Many)

Links data points to multiple tags.

```sql
CREATE TABLE data_point_tags (
    dp_tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dp_id UUID NOT NULL REFERENCES data_points(dp_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE RESTRICT,
    added_date DATE NOT NULL DEFAULT CURRENT_DATE,
    added_by VARCHAR(255), -- Claude agent/user
    CONSTRAINT unique_dp_tag UNIQUE(dp_id, tag_id)
);

CREATE INDEX idx_data_point_tags_dp_id ON data_point_tags(dp_id);
CREATE INDEX idx_data_point_tags_tag_id ON data_point_tags(tag_id);
CREATE INDEX idx_data_point_tags_both ON data_point_tags(dp_id, tag_id);
```

### 6. IDEAS (Research Positions)

Represents active ideas from 06_Current_Understanding/Active_Ideas.md.

```sql
CREATE TABLE ideas (
    idea_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_number INTEGER NOT NULL UNIQUE, -- 1, 2, 3... for Idea 1, Idea 2, etc
    title VARCHAR(512) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'developing', 'confirmed', 'active-tracker', 'archived'
    confidence_level VARCHAR(50) NOT NULL, -- 'high', 'very-high', 'medium', 'low'
    verdict TEXT, -- Summary judgment
    current_position TEXT NOT NULL, -- Full narrative explanation (may be 1000+ words)
    drivers TEXT, -- Key forces driving this idea
    drivers_json JSONB, -- Structured driver data
    open_questions TEXT, -- Unresolved questions
    related_ideas_json JSONB, -- IDs of related ideas
    last_updated DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_confidence ON ideas(confidence_level);
CREATE INDEX idx_ideas_last_updated ON ideas(last_updated DESC);
```

### 7. IDEA_TAGS (Many-to-Many)

Links ideas to multiple tags.

```sql
CREATE TABLE idea_tags (
    idea_tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE RESTRICT,
    CONSTRAINT unique_idea_tag UNIQUE(idea_id, tag_id)
);

CREATE INDEX idx_idea_tags_idea_id ON idea_tags(idea_id);
CREATE INDEX idx_idea_tags_tag_id ON idea_tags(tag_id);
```

### 8. IDEA_SUPPORTING_EVIDENCE (Evidence Table)

Represents rows in the Supporting Evidence table for each idea.

```sql
CREATE TABLE idea_supporting_evidence (
    evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    dp_id UUID NOT NULL REFERENCES data_points(dp_id) ON DELETE RESTRICT,
    evidence_description TEXT NOT NULL, -- What this DP supports
    primary_source VARCHAR(512), -- Display name: "[SourceName_Slug DP#]"
    display_order INTEGER NOT NULL, -- For maintaining table ordering
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_idea_dp_evidence UNIQUE(idea_id, dp_id)
);

CREATE INDEX idx_idea_supporting_evidence_idea_id ON idea_supporting_evidence(idea_id);
CREATE INDEX idx_idea_supporting_evidence_dp_id ON idea_supporting_evidence(dp_id);
```

### 9. IDEA_COUNTERARGUMENTS (Evidence Table)

Represents rows in the Counterarguments table for each idea.

```sql
CREATE TABLE idea_counterarguments (
    counterargument_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    dp_id UUID NOT NULL REFERENCES data_points(dp_id) ON DELETE RESTRICT,
    challenge_text TEXT NOT NULL, -- What is being challenged
    primary_source VARCHAR(512), -- Display name
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_idea_dp_counterarg UNIQUE(idea_id, dp_id)
);

CREATE INDEX idx_idea_counterarguments_idea_id ON idea_counterarguments(idea_id);
CREATE INDEX idx_idea_counterarguments_dp_id ON idea_counterarguments(dp_id);
```

### 10. IDEA_EVOLUTION_LOG (Audit Trail)

Tracks changes to ideas over time.

```sql
CREATE TABLE idea_evolution_log (
    evolution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    change_date DATE NOT NULL,
    change_summary TEXT NOT NULL, -- What changed
    evidence_added_json JSONB, -- Array of DP IDs added
    evidence_removed_json JSONB, -- Array of DP IDs removed
    position_delta TEXT, -- How the position changed
    changed_by VARCHAR(255), -- Claude agent/user
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_idea_evolution_log_idea_id ON idea_evolution_log(idea_id);
CREATE INDEX idx_idea_evolution_log_date ON idea_evolution_log(change_date DESC);
```

### 11. IDEA_RELATED_IDEAS (Self-Referential Many-to-Many)

Links ideas to other related ideas.

```sql
CREATE TABLE idea_related_ideas (
    relation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    related_idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    relationship_type VARCHAR(100), -- 'supports', 'challenges', 'complements', 'prerequisite'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_idea_relation UNIQUE(idea_id, related_idea_id),
    CONSTRAINT idea_self_reference_check CHECK(idea_id != related_idea_id)
);

CREATE INDEX idx_idea_related_ideas_idea_id ON idea_related_ideas(idea_id);
CREATE INDEX idx_idea_related_ideas_related_id ON idea_related_ideas(related_idea_id);
```

### 12. TALKING_POINTS (Conversation-Ready Strategies)

Represents talking points from 09_Deliverables/Talking_Points/.

```sql
CREATE TABLE talking_points (
    tp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tp_number INTEGER NOT NULL UNIQUE, -- TP1, TP2, etc
    title VARCHAR(512) NOT NULL,
    the_point TEXT NOT NULL, -- Core argument (500-1000 words)
    why_it_matters_business TEXT, -- Business implications
    why_it_matters_strategic TEXT, -- Strategic implications
    your_angle TEXT, -- Personal narrative
    document_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'draft', 'active', 'archived'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_talking_points_status ON talking_points(status);
CREATE INDEX idx_talking_points_document_date ON talking_points(document_date DESC);
```

### 13. TP_AUDIENCES (One-to-Many)

Represents audience segments for each talking point.

```sql
CREATE TABLE tp_audiences (
    audience_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tp_id UUID NOT NULL REFERENCES talking_points(tp_id) ON DELETE CASCADE,
    audience_title VARCHAR(255) NOT NULL, -- e.g., "Engineering VPs"
    concern TEXT NOT NULL, -- Main concern of this audience
    conversation_hook TEXT NOT NULL, -- Engagement opening
    display_order INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tp_audiences_tp_id ON tp_audiences(tp_id);
```

### 14. TP_EVIDENCE_LINES (Many-to-Many)

Links talking points to supporting data points.

```sql
CREATE TABLE tp_evidence_lines (
    evidence_line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tp_id UUID NOT NULL REFERENCES talking_points(tp_id) ON DELETE CASCADE,
    dp_id UUID NOT NULL REFERENCES data_points(dp_id) ON DELETE RESTRICT,
    evidence_text TEXT NOT NULL, -- How this DP supports the TP
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tp_dp_evidence UNIQUE(tp_id, dp_id)
);

CREATE INDEX idx_tp_evidence_lines_tp_id ON tp_evidence_lines(tp_id);
CREATE INDEX idx_tp_evidence_lines_dp_id ON tp_evidence_lines(dp_id);
```

### 15. TP_PIVOT_PHRASES (One-to-Many)

Conversation starters and pivots for talking points.

```sql
CREATE TABLE tp_pivot_phrases (
    pivot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tp_id UUID NOT NULL REFERENCES talking_points(tp_id) ON DELETE CASCADE,
    phrase_text TEXT NOT NULL,
    phrase_type VARCHAR(50), -- 'pivot', 'hook', 'objection-handler'
    display_order INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tp_pivot_phrases_tp_id ON tp_pivot_phrases(tp_id);
```

### 16. WEEKLY_LEARNINGS (Synthesis Documents)

Represents weekly synthesis documents from 03_Weekly_Learnings/.

```sql
CREATE TABLE weekly_learnings (
    learning_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_ending_date DATE NOT NULL UNIQUE,
    filename VARCHAR(512) NOT NULL, -- e.g., "WL_2026-02-22.md"
    file_path VARCHAR(512),
    sources_processed_count INTEGER, -- Number of sources processed
    total_dps_analyzed INTEGER,
    average_relevance_score NUMERIC(5,2),
    high_impact_sources_count INTEGER, -- Sources with >80% relevance
    synthesis_narrative TEXT NOT NULL, -- Full synthesis text
    status VARCHAR(50) DEFAULT 'published', -- 'draft', 'published', 'archived'
    created_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weekly_learnings_week_ending ON weekly_learnings(week_ending_date DESC);
CREATE INDEX idx_weekly_learnings_status ON weekly_learnings(status);
```

### 17. WEEKLY_LEARNINGS_TAGS (Many-to-Many)

Links weekly learnings to tag-based synthesis sections.

```sql
CREATE TABLE weekly_learnings_tags (
    learning_tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_id UUID NOT NULL REFERENCES weekly_learnings(learning_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE RESTRICT,
    tag_section_content TEXT, -- Full synthesis for this tag
    shift_description TEXT, -- What shifted in this tag this week
    display_order INTEGER,
    CONSTRAINT unique_learning_tag UNIQUE(learning_id, tag_id)
);

CREATE INDEX idx_weekly_learnings_tags_learning_id ON weekly_learnings_tags(learning_id);
CREATE INDEX idx_weekly_learnings_tags_tag_id ON weekly_learnings_tags(tag_id);
```

### 18. WEEKLY_LEARNINGS_IDEAS (Many-to-Many)

Links weekly learnings to ideas they update.

```sql
CREATE TABLE weekly_learnings_ideas (
    learning_idea_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_id UUID NOT NULL REFERENCES weekly_learnings(learning_id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    impact_description TEXT, -- How this DP updates the idea
    CONSTRAINT unique_learning_idea UNIQUE(learning_id, idea_id)
);

CREATE INDEX idx_weekly_learnings_ideas_learning_id ON weekly_learnings_ideas(learning_id);
CREATE INDEX idx_weekly_learnings_ideas_idea_id ON weekly_learnings_ideas(idea_id);
```

### 19. DP_RELEVANCE_MAPS (Thematic Groupings)

Represents DP Relevance Maps that group DPs by theme.

```sql
CREATE TABLE dp_relevance_maps (
    map_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    extraction_file_id UUID NOT NULL REFERENCES extraction_files(extraction_file_id) ON DELETE CASCADE,
    theme_name VARCHAR(512) NOT NULL, -- Core pattern description
    core_pattern_description TEXT NOT NULL,
    created_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dp_relevance_maps_extraction_file_id ON dp_relevance_maps(extraction_file_id);
CREATE INDEX idx_dp_relevance_maps_created_date ON dp_relevance_maps(created_date DESC);
```

### 20. MAP_CONNECTED_DPS (Many-to-Many)

Lists connected DPs within a relevance map.

```sql
CREATE TABLE map_connected_dps (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES dp_relevance_maps(map_id) ON DELETE CASCADE,
    dp_id UUID NOT NULL REFERENCES data_points(dp_id) ON DELETE RESTRICT,
    connection_type VARCHAR(100), -- 'supporting', 'contradicting', 'parallel'
    display_order INTEGER,
    CONSTRAINT unique_map_dp UNIQUE(map_id, dp_id)
);

CREATE INDEX idx_map_connected_dps_map_id ON map_connected_dps(map_id);
CREATE INDEX idx_map_connected_dps_dp_id ON map_connected_dps(dp_id);
```

### 21. MAP_IDEA_CONNECTIONS (Many-to-Many)

Links relevance maps to related ideas.

```sql
CREATE TABLE map_idea_connections (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES dp_relevance_maps(map_id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES ideas(idea_id) ON DELETE CASCADE,
    relevance_description TEXT,
    CONSTRAINT unique_map_idea UNIQUE(map_id, idea_id)
);

CREATE INDEX idx_map_idea_connections_map_id ON map_idea_connections(map_id);
CREATE INDEX idx_map_idea_connections_idea_id ON map_idea_connections(idea_id);
```

### 22. LANGUAGE_ASSETS (Reusable Linguistic Elements)

Represents linguistic frameworks from Language_Assets/ directory.

```sql
CREATE TABLE language_assets (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type VARCHAR(100) NOT NULL, -- 'framework', 'analogy', 'term', 'comparison', 'provocation', 'anti-pattern', 'numerical-rule'
    name VARCHAR(512) NOT NULL,
    description TEXT NOT NULL,
    usage_context TEXT, -- When/where to use this
    source_ideas_json JSONB, -- IDs of ideas using this
    source_dps_json JSONB, -- IDs of DPs supporting this
    created_date DATE NOT NULL,
    frequency_used INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_asset_name UNIQUE(name)
);

CREATE INDEX idx_language_assets_asset_type ON language_assets(asset_type);
CREATE INDEX idx_language_assets_status ON language_assets(status);
CREATE INDEX idx_language_assets_created_date ON language_assets(created_date DESC);
```

### 23. CURRENT_SYNTHESIS (Master Summary Document)

Represents Current_Synthesis.md state.

```sql
CREATE TABLE current_synthesis (
    synthesis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_number VARCHAR(20) NOT NULL,
    publication_date DATE NOT NULL,
    headline TEXT NOT NULL,
    lede TEXT NOT NULL, -- Opening paragraph
    summary_content TEXT NOT NULL, -- Main narrative
    key_takeaways_json JSONB, -- Numbered list with citations
    active_ideas_snapshot JSONB, -- Summary of all active ideas
    open_threads TEXT,
    evidence_base_stats JSONB, -- Stats on DPs, sources, etc
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_current_synthesis_publication_date ON current_synthesis(publication_date DESC);
CREATE INDEX idx_current_synthesis_version ON current_synthesis(version_number);
```

### 24. CITATIONS (Explicit Citation Index)

For efficient citation lookup and validation.

```sql
CREATE TABLE citations (
    citation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    dp_id UUID NOT NULL REFERENCES data_points(dp_id) ON DELETE CASCADE,
    citation_format VARCHAR(512), -- "[SourceName_Slug DP#]"
    source_path VARCHAR(512), -- "02_Extractions/2026-02/SourceName_Slug_YYYY-MM-DD.md"
    dp_number INTEGER, -- For reconstructing "DP#"
    extraction_file_id UUID REFERENCES extraction_files(extraction_file_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_citation UNIQUE(source_id, dp_id)
);

CREATE INDEX idx_citations_source_id ON citations(source_id);
CREATE INDEX idx_citations_dp_id ON citations(dp_id);
CREATE INDEX idx_citations_format ON citations(citation_format);
```

---

## Entity-Relationship Diagram

```
SOURCES
  ├─ 1:N → DATA_POINTS (via source_id)
  └─ 1:N → EXTRACTION_FILES (via source_id)

DATA_POINTS
  ├─ N:N → TAGS (via DATA_POINT_TAGS)
  ├─ N:N → IDEA_SUPPORTING_EVIDENCE (as supporting evidence)
  ├─ N:N → IDEA_COUNTERARGUMENTS (as counterarguments)
  ├─ N:N → TP_EVIDENCE_LINES (as TP evidence)
  ├─ 1:N → CITATIONS (via citation index)
  └─ N:N → MAP_CONNECTED_DPS (as connected DPs)

TAGS
  ├─ N:N → DATA_POINT_TAGS
  ├─ N:N → IDEA_TAGS
  └─ N:N → WEEKLY_LEARNINGS_TAGS

IDEAS
  ├─ 1:N → IDEA_TAGS
  ├─ 1:N → IDEA_SUPPORTING_EVIDENCE
  ├─ 1:N → IDEA_COUNTERARGUMENTS
  ├─ 1:N → IDEA_EVOLUTION_LOG
  ├─ N:N → IDEA_RELATED_IDEAS (self-referential)
  └─ N:N → MAP_IDEA_CONNECTIONS

TALKING_POINTS
  ├─ 1:N → TP_AUDIENCES
  ├─ 1:N → TP_EVIDENCE_LINES
  ├─ 1:N → TP_PIVOT_PHRASES
  └─ N:N → DATA_POINTS (via TP_EVIDENCE_LINES)

WEEKLY_LEARNINGS
  ├─ 1:N → WEEKLY_LEARNINGS_TAGS
  └─ N:N → WEEKLY_LEARNINGS_IDEAS

EXTRACTION_FILES
  ├─ 1:N → DATA_POINTS
  └─ 1:N → DP_RELEVANCE_MAPS

DP_RELEVANCE_MAPS
  ├─ 1:N → MAP_CONNECTED_DPS
  └─ 1:N → MAP_IDEA_CONNECTIONS
```

---

## Normalization and Design Decisions

### Why Not Normalize Certain Text Fields?

Several tables include large TEXT fields (e.g., `claim_text`, `current_position`) that could theoretically be separated:

**Decision:** Keep denormalized for these reasons:

1. **Query Patterns:** Views load full idea narratives; splitting adds JOIN overhead for 95% of queries
2. **Search Efficiency:** Full-text search indexes work on complete text; denormalization keeps lexical context
3. **Progressive Disclosure:** API returns summaries; the denormalized approach allows returning header + text efficiently
4. **Versioning Complexity:** Normalizing would require versioning frameworks; current approach lets UPDATED_AT track changes

**Applied to:**
- DATA_POINTS.claim_text, anchor_quote, context_before, context_after
- IDEAS.current_position, drivers, open_questions
- TALKING_POINTS.the_point, why_it_matters_business/strategic, your_angle
- WEEKLY_LEARNINGS.synthesis_narrative

### JSON Storage for Structured Data

JSONB columns store:
- `metadata` (flexible source/DP-specific fields)
- `drivers_json`, `related_ideas_json` (relational data within a narrative context)
- `evidence_added_json`, `evidence_removed_json` (audit trail references)
- `source_ideas_json`, `source_dps_json` (many-to-many collapsed for analytics)
- `key_takeaways_json` (numbered list with citations)

**Rationale:** These fields are accessed as units; JSONB provides:
- Flexible schema without ALTER TABLE operations
- Native operators for filtering/indexing
- Efficient querying without materialized views

### Constraint Strategy

**RESTRICT vs. CASCADE deletions:**

- RESTRICT on references to sources/data_points (never delete foundational data; use status='archived')
- CASCADE on references within synthesis (ideas can be archived; evidence tables cascade naturally)
- UNIQUE constraints on identifiable tuples (source+dp, filename, etc.)

**Check constraints:**
- Self-referential integrity (idea_self_reference_check in IDEA_RELATED_IDEAS)
- Status enums validated in application layer (PostgreSQL ENUMs could be added for additional safety)

---

## Indexing Strategy

### Full-Text Search Index

```sql
CREATE INDEX idx_data_points_claim_text_tsvector ON data_points
    USING gin(to_tsvector('english', claim_text));

CREATE INDEX idx_sources_name_tsvector ON sources
    USING gin(to_tsvector('english', name || ' ' || COALESCE(author, '')));
```

### Query Pattern Indexes

Based on the four main views (Pulse, Ideas, Talking Points, Explore):

**Pulse View** (Recent activity + key takeaways):
- `idx_weekly_learnings_week_ending` - Fetch latest week
- `idx_data_points_extraction_date` - Recent DPs
- `idx_ideas_last_updated` - Updated ideas

**Ideas View** (Full idea details with evidence):
- `idx_ideas_status` - Filter by status
- `idx_idea_tags_idea_id` - Load tags for idea
- `idx_idea_supporting_evidence_idea_id` - Load evidence tables
- `idx_data_points_source_id` - Resolve DP to source

**Talking Points View** (TP with audiences and evidence):
- `idx_talking_points_status` - Filter TPs
- `idx_tp_audiences_tp_id` - Load audience rows
- `idx_tp_evidence_lines_tp_id` - Load evidence
- `idx_data_points_source_id` - Resolve DP citations

**Explore View** (Search, filter, tag-based discovery):
- `idx_data_points_claim_text_tsvector` - Full-text search
- `idx_data_point_tags_tag_id` - Filter by tag
- `idx_sources_published_date` - Date range filtering
- `idx_data_points_evidence_type` - Filter by evidence type
- Composite: `idx_data_point_tags_both(dp_id, tag_id)` for efficient tag-based pagination

### Materialized Views for Analytics

```sql
-- Tag usage statistics
CREATE MATERIALIZED VIEW tag_usage_stats AS
SELECT
    t.tag_id,
    t.tag_name,
    COUNT(DISTINCT dpt.dp_id) as dp_count,
    COUNT(DISTINCT it.idea_id) as idea_count,
    COUNT(DISTINCT s.source_id) as source_count,
    MAX(dpt.added_date) as last_used
FROM tags t
LEFT JOIN data_point_tags dpt ON t.tag_id = dpt.tag_id
LEFT JOIN idea_tags it ON t.tag_id = it.tag_id
LEFT JOIN data_points dp ON dpt.dp_id = dp.dp_id
LEFT JOIN sources s ON dp.source_id = s.source_id
GROUP BY t.tag_id, t.tag_name;

CREATE INDEX idx_tag_usage_stats_tag_name ON tag_usage_stats(tag_name);

-- Weekly summary for Pulse view
CREATE MATERIALIZED VIEW weekly_pulse_summary AS
SELECT
    wl.week_ending_date,
    wl.sources_processed_count,
    COUNT(DISTINCT wli.idea_id) as ideas_updated,
    MAX(dp.extraction_date) as most_recent_dp,
    AVG(dp.confidence_score) as avg_confidence
FROM weekly_learnings wl
LEFT JOIN weekly_learnings_ideas wli ON wl.learning_id = wli.learning_id
LEFT JOIN data_points dp ON wl.week_ending_date >= dp.extraction_date
    AND wl.week_ending_date <= dp.extraction_date + INTERVAL '7 days'
GROUP BY wl.learning_id, wl.week_ending_date, wl.sources_processed_count;

CREATE INDEX idx_pulse_summary_date ON weekly_pulse_summary(week_ending_date DESC);
```

---

## API Endpoint Mapping

### Current Markdown-Based Endpoints → New Database Endpoints

#### Pulse View

**Current:** Python indexer scans markdown files for recent weekly learnings and active ideas
**New:**
```
GET /api/pulse/latest
  Returns: latest weekly_learning + top 5 active ideas + key takeaways

GET /api/pulse/week/:date
  Returns: specific weekly_learning with all tag sections

GET /api/pulse/timeline
  Returns: paginated weekly learnings (20 per page)
```

#### Ideas View

**Current:** Load Active_Ideas.md, parse sections for each idea
**New:**
```
GET /api/ideas
  Returns: array of {id, number, title, status, confidence} (header)

GET /api/ideas/:id
  Returns: complete idea with:
    - current_position, drivers, open_questions
    - supporting_evidence array (with DP details)
    - counterarguments array (with DP details)
    - related_ideas array
    - evolution_log
    - tags

GET /api/ideas/by-tag/:tag
  Returns: ideas filtered by tag, paginated

GET /api/ideas/search
  Query params: q=text, status=, confidence=
  Returns: full-text search across idea titles/positions
```

#### Talking Points View

**Current:** Load TP_YYYY-MM-DD.md files, parse TP1-TP5
**New:**
```
GET /api/talking-points
  Returns: array of {id, number, title, status} (headers)

GET /api/talking-points/:id
  Returns: complete TP with:
    - the_point, why_it_matters_business/strategic
    - audiences array with concern + hook
    - evidence_lines array (with DP details + citations)
    - pivot_phrases array

GET /api/talking-points/:id/export
  Returns: formatted markdown ready for presentation
```

#### Explore View

**Current:** Iterate markdown files for full-text search, tag filtering, date ranges
**New:**
```
GET /api/explore/search
  Query params: q=, tags=[], dateFrom=, dateTo=, evidenceType=, normalization=
  Returns: paginated data points (20 per page) with:
    - claim_text, anchor, citation, source details
    - tags, confidence_score, extraction_date
    - linked ideas, linked talking points

GET /api/explore/sources
  Query params: sourceType=, dateFrom=, dateTo=, status=
  Returns: paginated sources with dp_count, tag_distribution

GET /api/explore/tags
  Returns: tag_usage_stats materialized view

GET /api/explore/context
  Query params: dpIds=[]
  Returns: narrative context around specific DPs for analysis
```

#### Admin/Synthesis Endpoints

**Current:** Manual editing of markdown files
**New:**
```
POST /api/admin/weekly-learning
  Create new weekly learning document

POST /api/admin/ideas/:id/update-position
  Update idea's current_position and evolution_log

POST /api/admin/ideas/:id/add-evidence
  Add supporting evidence DP to idea

POST /api/admin/talking-points
  Create new talking point

PATCH /api/admin/tags/:id
  Update tag status, definition, source_count
```

---

## Data Migration Strategy

### Phase 1: Infrastructure Setup (Week 1)

1. Provision PostgreSQL 14+ instance
2. Create schema (DDL from above)
3. Set up automated backups (daily snapshots)
4. Create read replicas for query workload

### Phase 2: Initial Data Load (Week 2)

#### Parsing Strategy

Create Python migration scripts that:

1. **Sources:** Scan 01_Raw_Inputs/ for all files
   - Extract metadata from filename and file headers
   - Generate content_hash for deduplication
   - Populate SOURCES table

2. **Extractions:** Parse 02_Extractions/ markdown files
   - Extract file metadata (processed_date, processed_by from comments)
   - Parse each DP block (DP1, DP2, etc.)
   - Normalize DP format: claim, anchor, citation, tags
   - Populate DATA_POINTS, DATA_POINT_TAGS, EXTRACTION_FILES

3. **Active Ideas:** Parse 06_Current_Understanding/Active_Ideas.md
   - Extract each idea section
   - Parse supporting evidence table (extract DP references)
   - Parse counterarguments table
   - Parse evolution log entries
   - Populate IDEAS, IDEA_TAGS, IDEA_SUPPORTING_EVIDENCE, IDEA_COUNTERARGUMENTS, IDEA_EVOLUTION_LOG

4. **Talking Points:** Parse 09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md
   - Extract each TP (TP1-TP5)
   - Parse audience rows (title, concern, hook)
   - Parse evidence lines (extract DP references)
   - Parse pivot phrases
   - Populate TALKING_POINTS, TP_AUDIENCES, TP_EVIDENCE_LINES, TP_PIVOT_PHRASES

5. **Weekly Learnings:** Parse 03_Weekly_Learnings/
   - Extract week_ending_date from filename
   - Parse tag-based synthesis sections
   - Extract DP references
   - Populate WEEKLY_LEARNINGS, WEEKLY_LEARNINGS_TAGS

6. **Tags:** Parse _System/Tags.md
   - Extract established and emerging tags
   - Populate TAGS table

7. **Citation Validation:** Build citation index
   - Parse citation metadata comments: `<!-- cite:path=...;dp=... -->`
   - Validate all citations resolve to valid DPs
   - Populate CITATIONS table

#### Validation & Reconciliation

```python
# Pseudocode for migration validation
validation_results = {
    'sources': {
        'expected': count_files(01_Raw_Inputs),
        'loaded': db.count('sources'),
        'missing': [],
        'duplicates': []
    },
    'data_points': {
        'expected': sum(dp_count_per_extraction),
        'loaded': db.count('data_points'),
        'orphaned': [],  # DPs without source
        'invalid_citations': []
    },
    'ideas': {
        'expected': 18,
        'loaded': db.count('ideas'),
        'missing_evidence': []
    },
    'talking_points': {
        'expected': 5,
        'loaded': db.count('talking_points'),
        'missing_evidence': []
    }
}

# All validation errors block Phase 3 advancement
```

### Phase 3: Parallel Running (Week 3-4)

1. Keep markdown filesystem intact
2. Run both systems simultaneously
3. Validate database API responses match current frontend data
4. Build out new API endpoints incrementally
5. Load test new endpoints at scale

### Phase 4: Frontend Migration (Week 5-6)

1. Update app.js to call new API endpoints instead of file indexing
2. Maintain UI compatibility (no visible changes to users)
3. Add new query capabilities (better search, filtering)
4. Gradual rollout: 50% traffic to new, 50% to old for 1 week

### Phase 5: Cutover & Decommission (Week 7)

1. Full traffic to new database API
2. Archive markdown files (don't delete; keep as backup)
3. Decommission old Python indexer
4. Run post-cutover validation for 2 weeks

---

## Performance Optimization Considerations

### Query Patterns & Optimization

**Pulse View (Most Frequent Query)**

Current: Load latest WL_YYYY-MM-DD.md file + recent ideas
New: Single query + 2 JOIN queries

```sql
-- Optimized Pulse retrieval
SELECT
    wl.learning_id,
    wl.week_ending_date,
    wl.sources_processed_count,
    wl.high_impact_sources_count,
    ARRAY_AGG(DISTINCT i.idea_id) as updated_ideas,
    JSON_BUILD_OBJECT(
        'headline', cs.headline,
        'lede', cs.lede
    ) as current_synthesis_snapshot
FROM weekly_learnings wl
LEFT JOIN weekly_learnings_ideas wli ON wl.learning_id = wli.learning_id
LEFT JOIN ideas i ON wli.idea_id = i.idea_id
LEFT JOIN current_synthesis cs ON cs.publication_date >= wl.week_ending_date
    AND cs.publication_date <= wl.week_ending_date + INTERVAL '14 days'
WHERE wl.status = 'published'
ORDER BY wl.week_ending_date DESC
LIMIT 1;
```

**Ideas View (Secondary Frequent Query)**

Current: Load Active_Ideas.md + parse evidence tables (slow with large files)
New: Three queries (idea header, supporting evidence, counterarguments)

```sql
-- Optimized Idea detail retrieval
SELECT
    i.idea_id,
    i.idea_number,
    i.title,
    i.status,
    i.confidence_level,
    i.current_position,
    JSON_AGG(DISTINCT it.tag_id) as tag_ids,
    (SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
            'dp_id', dp.dp_id,
            'evidence_description', ise.evidence_description,
            'claim', dp.claim_text,
            'source_name', s.name
        )
    ) FROM idea_supporting_evidence ise
    JOIN data_points dp ON ise.dp_id = dp.dp_id
    JOIN sources s ON dp.source_id = s.source_id
    WHERE ise.idea_id = i.idea_id
    ORDER BY ise.display_order) as supporting_evidence
FROM ideas i
LEFT JOIN idea_tags it ON i.idea_id = it.idea_id
WHERE i.idea_id = $1
GROUP BY i.idea_id;
```

### Caching Strategy

**Redis Cache Layers:**

1. **Static Content Cache (24h TTL)**
   - `ideas:list` - All idea headers
   - `talking_points:list` - All TP headers
   - `tags:all` - Full tag vocabulary
   - `current_synthesis:latest` - Latest synthesis doc

2. **View-Level Cache (4h TTL)**
   - `pulse:latest` - Latest week data
   - `ideas:{id}` - Full idea details
   - `tp:{id}` - Full talking point details

3. **Search Results Cache (1h TTL)**
   - `search:{query_hash}:{page}` - Search results
   - `explore:tag:{tag_id}:{page}` - Tag-filtered results

**Cache Invalidation Strategy:**
- Explicit invalidation on admin writes
- Timestamp-based validation on cache miss
- Weekly cache clear on schedule

### Connection Pooling

```python
# Using psycopg2 with connection pool
from psycopg2 import pool

db_pool = pool.SimpleConnectionPool(
    5,  # min connections
    20,  # max connections
    host='postgres.prod',
    database='cris_prod',
    user='cris_app',
    password=os.getenv('DB_PASSWORD')
)

# For async workloads, use asyncpg
import asyncpg
db_pool_async = await asyncpg.create_pool(
    'postgresql://cris_app:password@postgres.prod/cris_prod',
    min_size=10,
    max_size=20
)
```

---

## Backward Compatibility & Fallback Strategy

### Dual-Write Period (Phase 3-4)

During parallel running, maintain backward compatibility:

1. **Write to Both Systems:**
   - Any admin action writes to both markdown files AND database
   - Database becomes source of truth; files updated from DB

2. **Read Fallback:**
   - If database query fails, fall back to markdown parsing
   - Log fallback events for monitoring

3. **Reconciliation Script:**
   ```python
   # Run hourly during parallel period
   python scripts/reconcile_markdown_and_db.py
   # Detects divergence, flags for review
   ```

### Archive Strategy for Markdown Files

After cutover:

```bash
# Keep markdown files in archive
tar -czf /archive/cris_markdown_backup_2026-03-15.tar.gz \
    01_Raw_Inputs \
    02_Extractions \
    03_Weekly_Learnings \
    06_Current_Understanding \
    09_Deliverables

# Exclude from active application
# Add to .gitignore or move to separate repo branch
```

---

## Considerations for Frontend

### New Capabilities Enabled by Database

1. **Advanced Filtering**
   - Multi-tag filtering (not possible with filesystem)
   - Evidence type filtering (empirical vs. anecdotal)
   - Confidence score thresholds
   - Normalization level filtering

2. **Better Search**
   - Full-text search across all content
   - Phrase search with positional operators
   - Faceted search (tag + date + confidence)
   - Search suggestions via tsvector ranking

3. **Dynamic Loading**
   - Infinite scroll in Explore view
   - Lazy-load evidence tables (load summary, expand on demand)
   - Progressive disclosure of idea evolution logs

4. **Analytics & Insights**
   - Trend visualization (idea updates over time)
   - Evidence heatmaps (which sources drive which ideas)
   - Tag correlation analysis
   - Source impact scoring

### UI/UX Improvements

**Progressive Disclosure Pattern:**
```javascript
// Current (all in one load):
GET /api/ideas/1
  // Returns: full idea + all evidence + all counterarguments

// New (progressive):
GET /api/ideas/1/header        // 2KB - Fast
GET /api/ideas/1/evidence      // On demand
GET /api/ideas/1/evolution     // On demand
```

**Search-First Interface:**
- Default Explore view shows search box
- Full-text search with instant preview
- Tag autocomplete
- Saved searches

**Responsive Design:**
- Mobile-optimized for quick pulse checks
- Desktop-optimized for deep analysis
- Export to PDF (talking points, idea summaries)

---

## Monitoring & Operations

### Key Metrics to Track

```sql
-- Query performance
CREATE TABLE query_performance_log (
    query_id UUID PRIMARY KEY,
    query_name VARCHAR(255),
    execution_time_ms INTEGER,
    rows_returned INTEGER,
    query_timestamp TIMESTAMP,
    user_agent VARCHAR(512)
);

-- Data freshness
CREATE TABLE data_freshness_metrics (
    metric_id UUID PRIMARY KEY,
    most_recent_extraction DATE,
    most_recent_idea_update DATE,
    most_recent_synthesis DATE,
    pending_synthesis_dps_count INTEGER,
    check_timestamp TIMESTAMP
);
```

### Alerts & Thresholds

- Citation validation: < 1% validation failures
- Query performance: 95th percentile < 500ms
- Data freshness: synthesis within 7 days of latest extraction
- Index health: index bloat < 10%

### Operational Queries

```sql
-- Find orphaned data points (references to non-existent sources)
SELECT dp.dp_id, dp.claim_text
FROM data_points dp
LEFT JOIN sources s ON dp.source_id = s.source_id
WHERE s.source_id IS NULL
  AND dp.created_at > CURRENT_DATE - INTERVAL '7 days';

-- Ideas missing supporting evidence
SELECT i.idea_id, i.title, COUNT(ise.evidence_id) as evidence_count
FROM ideas i
LEFT JOIN idea_supporting_evidence ise ON i.idea_id = ise.idea_id
WHERE i.status != 'archived'
GROUP BY i.idea_id, i.title
HAVING COUNT(ise.evidence_id) < 5;

-- Tag usage imbalance (emerging tags with no DPs)
SELECT t.tag_name, COUNT(dpt.dp_id) as dp_count
FROM tags t
LEFT JOIN data_point_tags dpt ON t.tag_id = dpt.tag_id
WHERE t.status = 'emerging'
GROUP BY t.tag_id, t.tag_name
HAVING COUNT(dpt.dp_id) = 0;
```

---

## Implementation Roadmap

### Timeline: 7 weeks

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | Infrastructure | PostgreSQL instance, schema, backups |
| 2 | Data Migration | Initial load, validation, reconciliation |
| 3 | API Development | 50% of endpoints, testing, load testing |
| 4 | API Completion | 100% of endpoints, caching, optimization |
| 5 | Frontend Migration | app.js refactor, UI testing, parallel running |
| 6 | Cutover Preparation | Performance validation, monitoring setup |
| 7 | Cutover & Stabilization | Full traffic migration, post-cutover validation |

### Resource Requirements

- **DBA:** 1 FTE for infrastructure, optimization, maintenance
- **Backend Engineer:** 1.5 FTE for API development, migration scripts
- **Frontend Engineer:** 0.5 FTE for app.js refactor
- **QA:** 0.5 FTE for validation scripting, testing

---

## Risk Mitigation

### Key Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Migration data loss | Low | High | Comprehensive validation suite, dry runs, archive backups |
| Query performance degradation | Medium | High | Index strategy, materialized views, load testing at 2x current volume |
| Citation integrity issues | Medium | Medium | Citation validation script, automated reconciliation |
| Unforeseen schema issues | Low | Medium | Phase 3 parallel running, easy rollback plan |
| Frontend incompatibility | Low | Medium | Comprehensive API contract testing, feature parity validation |

### Rollback Plan

If critical issues arise:

1. **Week 1-3 Rollback:** Trivial - just keep old system running, discard DB
2. **Week 4-5 Rollback:** Stop writing to markdown, revert app.js to old system
3. **Week 6-7 Rollback:** Restore from pre-cutover backup, recover from archive

Rollback time: < 2 hours

---

## Success Criteria

- All 2,350+ data points migrated with 100% citation validation
- API endpoints respond in < 500ms at 95th percentile
- Full-text search functional across all DP claim text
- Pulse view loads in < 1 second
- Ideas view with full evidence tables loads in < 2 seconds
- Zero data loss during cutover
- Backup/restore tested and < 1 hour recovery time
- All queries covered by monitoring and alerts
- Documentation complete for operations team

---

## Conclusion

This migration transforms CRIS from a file-based system to a relational database, enabling:

1. **Faster queries:** From file scanning to indexed database lookups
2. **Better discoverability:** Full-text search, faceted filtering, tag-based navigation
3. **Easier synthesis:** Structured evidence tables, validated citations, audit trails
4. **Operational reliability:** Backup/recovery, monitoring, audit logging
5. **Scalability:** Handles growth in DPs, ideas, and sources without performance degradation

The schema design preserves all existing functionality while enabling new capabilities. The phased migration strategy minimizes risk and allows for validation at each stage.
