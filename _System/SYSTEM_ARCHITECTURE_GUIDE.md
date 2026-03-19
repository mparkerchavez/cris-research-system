# CRIS System Architecture Guide

**Purpose:** Complete reference for understanding how the `_System` folder guides Claude during CRIS operations

**Last Updated:** February 13, 2026

---

## Executive Summary

The `_System` folder contains the "operating system" for your CRIS research practice. These files define:

1. **What to do** (workflows)
2. **How to write** (style standards)
3. **How to cite** (lineage preservation)
4. **What exists** (tags, extractions)
5. **How to navigate** (folder structure)

Every CRIS operation should begin by loading the relevant system files. This ensures consistency, quality, and machine-parseability of your research outputs.

---

## Core System Files

### 1. Overview.md

**Purpose:** High-level system introduction and navigation guide

**When Claude should read this:**
- First time working with CRIS
- Explaining the system to users
- Understanding the compression chain concept

**Key concepts:**
- "When I learned it" organizing principle (date by processing, not publication)
- Compression chain: Raw → Extractions → Weekly → Monthly → Quarterly
- Each layer must be self-sufficient (avoid reading lower layers during typical tasks)
- Two system-level guides apply to ALL outputs: Style_Guide.md + Data_Point_Normalization.md

**Critical table: "Context Loading Per Task"**
Shows exactly what Claude should load for each workflow type:
- Extraction: Raw inputs, Tags.md, template (NOT previous extractions)
- Weekly Phase 1-2: New extractions via sub-agents, Active Ideas summary
- Weekly Phase 3: DP Relevance Maps, Index files, Style Guide, Data Normalization
- Weekly Phase 4-5: New Weekly Learnings, Active Ideas, User Observations
- Monthly: 4-5 Weekly files, Index, Style Guide
- Lineage trace: Specific idea + linked extractions only

---

### 2. Folder_Structure.md

**Purpose:** File organization conventions and progressive disclosure strategy

**When Claude should read this:**
- Before any file creation or movement
- When updating index files
- When archiving documents

**Key concepts:**

**Progressive Disclosure Index Files:**
| Index File | Location | Purpose |
|------------|----------|---------|
| _Extraction_Index.md | 02_Extractions/ | Quick ref with DP counts, key topics |
| _Weekly_Header.md | 03_Weekly_Learnings/ | Recent weeks, open threads, active ideas |
| _Index.md | 06_Current_Understanding/ | Idea status, counts, last updated |

**Loading pattern:**
1. Always load relevant header/index first
2. Identify which detail files are needed
3. Load only those specific files

**File naming rules:**
- Weekly Learnings: `WL_YYYY-MM-DD.md` (date = when synthesis was written)
- Talking Points: `TP_YYYY-MM-DD.md` (date = production date)
- Extractions: `[Source_Name]_YYYY-MM-DD.md` (date = extraction date)
- Current Synthesis: `Current_Synthesis.md` (NO date in filename, one active version)
- Archives: `[Original_Name]_YYYY-MM-DD.md` (use Last Updated date from inside doc)

**No version suffixes** - Use archive folders instead of `_v2`, `_v3`

---

### 3. Citation_Contract.md

**Purpose:** Machine-parseable citation format for lineage tracing

**When Claude should read this:**
- Before writing ANY synthesis document (Weekly, Current Synthesis, Active Ideas, Talking Points)
- When creating new extractions (to understand naming constraints)
- When debugging citation parsing issues

**Critical rules:**

**Extraction file naming (hard requirements):**
```
Source_DescriptiveSlug_YYYY-MM-DD.md
```

**Constraints:**
- No hyphens in Source or Slug (use underscores and PascalCase)
- No periods in Source or Slug (use `Opus46` not `Opus4.6`)
- Underscores separate segments
- Two parts before date (Source + Slug, both required)

**Inline citation format (drops date):**
```markdown
[Source_DescriptiveSlug DP3, DP7]
```

**Required metadata comment pattern:**
```markdown
[BCG_EmergingAgenticEnterprise DP3, DP7]
<!-- cite:path=02_Extractions/YYYY-MM/BCG_EmergingAgenticEnterprise_2026-02-04.md;dp=3,7 -->
```

**Multi-source citations:**
```markdown
[Source1 DP3; Source2 DP5, DP8]
<!-- cite:path=02_Extractions/.../Source1_....md;dp=3 -->
<!-- cite:path=02_Extractions/.../Source2_....md;dp=5,8 -->
```

**Why this matters:**
- Enables inline citation context in app drawers
- Supports direct open-to-source flows
- Breaks if format varies even slightly
- Parser uses regex on exact format

---

### 4. Data_Point_Normalization.md

**Purpose:** How to present metrics from multiple sources without confusing readers

**When Claude should read this:**
- Before writing ANY synthesis output (Weekly, Talking Points, Current Synthesis)
- When editing documents with statistics
- When juxtaposing data from different sources

**Core principles:**

**Principle 1: Context Before Numbers**
Every data point must answer:
1. Who was measured? (population)
2. What was measured? (specific metric)
3. When was it measured? (timeframe)

**Principle 2: Data Points Serve the Narrative**
- Choose the single most important statistic
- Use it
- Move on
- Additional data belongs in supporting evidence sections

**Principle 3: Citations Are Infrastructure**
The `[Source_Name DPx]` format is not just credibility—it's the navigable link connecting claims to evidence. Format consistency is mandatory.

**Three normalization levels:**

**Level 1: Source Attribution (minimum)**
```
85% of knowledge workers lack value-driving use cases [Section DP3]
```

**Level 2: Measurement Context (required for synthesis)**
Template: `[Metric] among [population], per [source] ([timeframe])`
```
85% of knowledge workers lack value-driving use cases (Section, January 2026)
```

**Level 3: Comparability Framing (required when juxtaposing sources)**
Three patterns:
- **Pattern A: Convergence/Divergence** - Multiple sources measure same thing
- **Pattern B: Layered View** - Different metrics, same phenomenon
- **Pattern C: Tension** - Sources genuinely disagree

**The "Altitude" Model:**
Organize multi-source data by altitude:
1. Market level (TAM, industry percentages)
2. Enterprise level (adoption rates, deployment)
3. Team level (coordination, productivity)
4. Individual level (proficiency, skills)

**Critical checklist before finalizing:**
1. Every data point has population, metric, source, timeframe
2. No two different-source data points in same sentence without comparability frame
3. Percentage point differences labeled correctly (not just "points")
4. Dollar figures include denominators
5. Ratios include baselines
6. Timelines anchored to calendar dates
7. No cross-altitude mixing within sentences

---

### 5. Style_Guide.md

**Purpose:** Tone of voice, punctuation, and writing standards for all CRIS outputs

**When Claude should read this:**
- Before writing ANY CRIS document
- When editing existing documents
- When quality-checking outputs

**Two modes:**

| Mode | Documents | Purpose |
|------|-----------|---------|
| Processing | Weekly Learnings, User Observations, Active Ideas | Internal sense-making, connecting dots |
| Communication | Current Synthesis, Talking Points, Monthly/Quarterly | Client-facing credibility |

**Core voice:** Practitioner-strategist. Clear. Grounded. Actionable.

**Most important principle: NARRATIVE OVER DATA**

Data points serve the narrative, not the other way around.
- One claim, one data point, one sentence
- Max two statistics per paragraph
- The narrative is the substance

**Avoid these patterns:**
- Compound claims (two ideas in one sentence) → Split
- Concept-stacking (introduce + apply + conclude in one sentence) → Use three sentences
- Numeric density (3-4 statistics rapid-fire) → Choose the most important one

**Punctuation rules (hard constraints):**

| Rule | Standard | Wrong | Right |
|------|----------|-------|-------|
| Em dashes | **NEVER** use | The gap is not a problem—it's the terrain | The gap is not a problem. It is the terrain. |
| Oxford comma | **ALWAYS** use | Technology, People and Process | Technology, People, and Process |
| Contractions | Avoid in formal docs | don't, isn't | do not, is not |
| Contractions | OK in Talking Points & User Observations | (conversational) | |

**Sentence standards:**
- Lead with claim, follow with evidence
- Active voice by default
- One idea per sentence
- Vary length deliberately (short sentences for emphasis)

**Hedging language - minimize:**
| Hedged (avoid) | Direct (prefer) |
|----------------|-----------------|
| This may suggest... | The evidence indicates... |
| It seems like... | The data shows... |
| It's possible that... | X is happening |

**Only hedge when:**
- Evidence is thin (< 2 sources)
- Making future predictions

**Writing for Future Self:**
Mark what changed each week:
- What is **new** this week
- What **shifted** from prior thinking
- What **held steady**

**Quick self-check (run before finalizing):**
1. Search for em dashes (—, –) → replace all
2. Search for missing Oxford commas
3. Search for hedging ("may," "might," "seems") → replace with direct statements
4. Read each sentence for compound claims → split
5. Check paragraphs for numeric density (max 2 stats)
6. Verify every statistic has population, source, timeframe
7. Check for undefined jargon on first use
8. Expand contractions (formal docs only)
9. Verify temporal markers (what's new/shifted/steady)

---

### 6. Tags.md

**Purpose:** Master vocabulary for organizing insights across sources

**When Claude should read this:**
- Before every extraction (to use existing tags)
- Before proposing new tags
- When writing synthesis (to organize by tag)

**Tag lifecycle:**

**Emerging** (< 3 sources):
- Listed in "Emerging Tags" table
- May consolidate or expand
- Watch for patterns

**Established** (3+ sources):
- Listed in "Established Tags" table
- Used consistently across synthesis
- Clear, stable meaning

**Promotion threshold:** 3+ sources using the same tag

**Tag hygiene:**
- Check existing tags before proposing new ones
- Prefer existing tags when possible
- New tags go to Emerging until proven
- Tag Hygiene Log tracks all changes

**Tags with special relationships:**
- `#adoption-barriers` often appears with `#enterprise-readiness`
- `#model-capabilities` sometimes contradicts `#vendor-claims`
- `#agentic-workflows` distinct from `#copilot-patterns`

---

### 7. Extraction_Name_Mapping.md

**Purpose:** Old-to-new filename mapping after standardization

**When Claude should read this:**
- When updating citations in older documents
- When regenerating synthesis outputs
- When debugging broken citation links

**What it contains:**
Complete mapping table with:
- Current filename
- New filename
- Inline citation format

**Key changes documented:**
- Source name normalization (hyphens → underscores)
- Slug improvements (PascalCase, recognizability)
- Date handling (single extraction date)

---

## Workflow Files (_System/Workflows/)

### 1. Extraction.md

**Purpose:** Process new sources into structured extractions with atomic data points

**When Claude should read this:**
- Before EVERY extraction
- When quality-checking extractions
- When setting up parallel sub-agents

**Critical concepts:**

**Metadata format (REQUIRED):**
```markdown
## Metadata
- **Source:** [Author/Organization]
- **Published:** [Publication date]
- **Processed:** [Extraction date]
- **Type:** PDF | Transcript | Article
- **Original Location:** 01_Raw_Inputs/YYYY-MM/YYYY-MM-DD_to_DD/filename.pdf
```

**The Original Location field:**
- MUST be present (not "URL/Location")
- Uses relative path from CRIS root
- Enables lineage tracing
- Verification tools fail without it

**Atomic Data Point format:**
```markdown
**DP1:** [Your interpretation of the finding]
- **Anchor:** "[Verbatim 5-15 word quote from source]"
- **Citation:** (p. XX)
- **Tags:** #tag1, #tag2
```

**The Anchor is critical:**
- Must be **verbatim** (enables Cmd+F search in source)
- Must be **5-15 words** (unique enough to find)
- Must be **distinctive** (avoid generic phrases)
- Must be **from the source** (not paraphrased)

**Good anchors:**
✅ "85% lack use cases that generate business value"
✅ "coordination yields negative returns once single-agent baseline exceeds"

**Bad anchors:**
❌ "the report found that most workers" (too generic)
❌ "AI adoption" (too short, not unique)

**File naming (enforced by parser):**
```
Source_DescriptiveSlug_YYYY-MM-DD.md
```

Rules:
- Two parts before date (Source + Slug)
- Only alphanumeric and underscores
- No hyphens, spaces, special characters
- Always include processing date

**Batch extraction with parallel sub-agents:**

**When to use:**
| New Extractions | Approach |
|-----------------|----------|
| 1-2 sources | Mine directly (no sub-agents) |
| 3-8 sources | Spawn parallel sub-agents (one per source) |
| 9+ sources | Batch into groups of 5-8, spawn per batch |

**Why parallel:**
- Isolated context per source = higher accuracy
- Prevents sources blending together
- Each sub-agent sees only one source

**Batch size by complexity:**
| File Type | Files Per Batch | Rationale |
|-----------|-----------------|-----------|
| Small (<500 KB, <20 pages) | 5-8 files | Fast extraction |
| Medium (500 KB-3 MB, 20-50 pages) | 3-5 files | Moderate complexity |
| Large (>3 MB, 50+ pages) | 2-3 files | Needs attention |

**Sub-agent prompt template included in workflow**

---

### 2. Weekly_Synthesis.md

**Purpose:** Create Weekly Learnings, Talking Points, Active Ideas updates, and Current Synthesis using phased approach

**When Claude should read this:**
- Before EVERY weekly synthesis
- When planning synthesis strategy
- When debugging evidence coverage issues

**Why phased:**
Single-pass synthesis systematically misses evidence. Phased approach separates:
- **Mining** (sub-agents go deep on individual sources)
- **Synthesis** (narrative writing with pre-digested evidence)

This prevents coverage degradation when extraction mining and synthesis writing compete for same context window.

**Five phases:**

**Phase 1: Extraction Mining Pass**
- Spawn sub-agents (one per new extraction)
- Each sub-agent produces DP Relevance Map
- Maps show which DPs relate to which ideas/threads
- Output: `_System/working/relevance_maps/[Source]_relevance.md`

**Phase 2: Coverage Sweep**
- Check "Sources Needing Attention" list
- Spot-check low-coverage sources
- Catch evidence previous sessions missed
- Output: `Coverage_Sweep_YYYY-MM-DD.md`

**Phase 3: Weekly Learnings**
- Write from pre-digested DP Relevance Maps
- Only load raw extractions for precision (specific percentages, etc.)
- Apply Style Guide + Data Normalization
- Output: `WL_YYYY-MM-DD.md`

**Phase 4: Active Ideas + Current Synthesis**
- Update Active Ideas with new evidence
- Archive previous Current Synthesis
- Rewrite Current Synthesis from updated ideas
- Output: Updated `Active_Ideas.md`, new `Current_Synthesis.md`

**Phase 5: Talking Points + System Updates**
- Create conversation-ready deliverables
- Update _Weekly_Header.md
- Update Tags.md if new tags emerged
- Clean up working files
- Output: `TP_YYYY-MM-DD.md`, updated indexes

**Chat session guidance:**
| Extraction Volume | Sessions |
|-------------------|----------|
| Light (1-5) | 1 session: all 5 phases |
| Normal (6-15) | 2 sessions: P1-2, then P3-5 |
| Heavy (16+) | 3 sessions: P1-2, P3, P4-5 |

**Key loading strategy:**
Load DP Relevance Maps, not all raw extractions. Only go to raw files when you need:
- Precise data (specific percentages)
- Ambiguous DP context
- Verbatim anchor for verification

---

### 3. Monthly_Synthesis.md

(Not yet created, but would follow similar pattern)

**Purpose:** Roll up Weekly Learnings into monthly narrative

---

### 4. Versioning_and_File_Management.md

**Purpose:** How to archive, version, and manage file updates

**When Claude should read this:**
- Before archiving any document
- Before updating Current Synthesis or Active Ideas
- When managing file versions

---

## Prompt Files (_System/Prompts/)

### 1. Extraction_Renaming_Prompt.md

**Purpose:** Batch rename extractions to follow citation contract

**Use case:** Standardizing inconsistent extraction filenames

**Deliverables:**
1. Naming mapping table (for review)
2. Rename files + update internal metadata
3. Update system files
4. Produce mapping reference
5. Verification pass

---

### 2. Weekly_Learnings_Generation_Prompt.md

**Purpose:** Generate new Weekly Learnings with full style guide compliance

**Use case:** Post-standardization synthesis regeneration

**Key requirements:**
- Load 9 system files before starting
- Apply all style rules (no em dashes, Oxford comma, etc.)
- Apply data normalization (Level 2 minimum, Level 3 when juxtaposing)
- Use new extraction names from mapping file
- Run self-checks before finalizing

---

### 3. Codex_Parser_Update_Prompt.md

(Likely for PoC frontend development)

---

## Supporting Files

### Verification_Guide.md

**Purpose:** Quality checks for extractions and synthesis

### Starter_Prompts.md

**Purpose:** Copy-paste templates for common operations

**When users should read this:**
- First time using CRIS
- Looking for efficient prompt patterns
- Setting up batch operations

**Key sections:**
- System status checks
- Simple extraction (1-2 files)
- Batch extraction (3+ files with parallel)
- Weekly synthesis
- Monthly/quarterly synthesis
- Working with ideas
- Tag management
- Search & discovery

---

## Working Files (_System/working/)

### relevance_maps/

**Purpose:** Intermediate output from Phase 1 (Extraction Mining)

**Contents:**
- One file per extracted source
- DP Relevance Map showing which DPs relate to which ideas
- Coverage Sweep files

**Lifecycle:**
- Created fresh each synthesis cycle
- Used during synthesis writing
- Can be overwritten next cycle (not archival)

**Why they exist:**
- Enable deep mining without loading all extractions in synthesis context
- Prevent cross-source contamination
- Support comprehensive evidence coverage

---

## How Claude Should Use These Files

### Decision Tree: Which Files to Load?

**Starting ANY new CRIS chat session:**
```
ALWAYS invoke CRIS skill: /cris
```

**Before extraction:**
```
Read:
1. _System/Workflows/Extraction.md (format, sub-agents)
2. Tags.md (existing tags)
3. 02_Extractions/_Extraction_Index.md (what's already extracted)
```

**Before weekly synthesis:**
```
Read (in order):
1. _System/Workflows/Weekly_Synthesis.md (phased approach)
2. _System/Style_Guide.md (writing standards)
3. _System/Data_Point_Normalization.md (metric presentation)
4. _System/Citation_Contract.md (citation format)
5. 03_Weekly_Learnings/_Weekly_Header.md (recent context)
6. 06_Current_Understanding/_Index.md (idea status)
7. Tags.md (current tags)
```

**Before writing any synthesis output:**
```
Load:
- Style_Guide.md (ALWAYS)
- Data_Point_Normalization.md (ALWAYS)
- Citation_Contract.md (ALWAYS)
```

**Before updating Current Synthesis:**
```
Load:
- New Weekly Learnings (just written)
- Updated Active_Ideas.md
- User_Observations.md
- 08_Templates/Current_Synthesis_Template.md
```

**Before creating Talking Points:**
```
Load:
- Current_Synthesis.md (just updated)
- Active_Ideas.md (just updated)
- 08_Templates/Talking_Points_Template.md
```

---

## File Interaction Map

```
Tags.md
    ↓
Extraction.md → [New Extraction] → _Extraction_Index.md
                                         ↓
                                   Weekly_Synthesis.md
                                         ↓
                        DP Relevance Maps (working/)
                                         ↓
                    Style_Guide.md + Data_Point_Normalization.md
                                         ↓
                                 Weekly_Learnings
                                         ↓
                                   Active_Ideas
                                         ↓
                                Current_Synthesis
                                         ↓
                                 Talking_Points
```

---

## Common Failure Modes (and how system files prevent them)

### Problem: Citations break in app
**Root cause:** Inconsistent extraction naming
**Prevention:** Citation_Contract.md enforces exact format
**Detection:** Extraction file naming validation

### Problem: Evidence gets missed in synthesis
**Root cause:** Too many extractions loaded at once, context window fills
**Prevention:** Weekly_Synthesis.md phased approach with DP Relevance Maps
**Solution:** Sub-agents mine each source in isolation

### Problem: Data points confuse readers
**Root cause:** Missing context, conflicting sources presented together
**Prevention:** Data_Point_Normalization.md Level 2 & 3 requirements
**Solution:** Population + metric + source + timeframe for every stat

### Problem: Writing style inconsistent
**Root cause:** Different synthesis sessions use different patterns
**Prevention:** Style_Guide.md with hard punctuation rules
**Solution:** Quick self-check before finalizing

### Problem: Lineage untraceable
**Root cause:** Missing Original Location field in extractions
**Prevention:** Extraction.md metadata requirements
**Solution:** Verification tools check for field presence

### Problem: Tags proliferate without meaning
**Root cause:** New tags added without checking existing
**Prevention:** Tags.md hygiene protocol (check before proposing)
**Solution:** Promotion threshold (3+ sources before Established)

---

## Version History

- **v1.0** (2026-02-13): Initial comprehensive guide created
