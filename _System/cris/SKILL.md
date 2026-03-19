---
name: cris
description: |
  Collaborative Research & Insight System (CRIS) for managing research extraction, synthesis, and idea development. Use this skill when:
  - Processing new source documents (PDFs, transcripts, articles) into extractions
  - Creating Weekly Learnings or Talking Points
  - Doing monthly or quarterly synthesis
  - Checking system status (/cris-status or "what's the status of my research system")
  - Working with Active Ideas or Current Understanding
  - Tracing lineage from ideas back to sources
  Triggers: CRIS, research system, extraction, weekly learnings, talking points, synthesis, active ideas, current understanding, /cris-status
---

# CRIS Skill (v3.0)

Orchestrates the Collaborative Research & Insight System workflow.

**Last Updated:** February 14, 2026

## Getting Started

**First time using CRIS?** Read `_System/SYSTEM_ARCHITECTURE_GUIDE.md` for complete overview.

**Looking for prompts?** Use `_System/ADVANCED_PROMPT_LIBRARY.md` for copy-paste templates.

## Progressive Disclosure Principle

**Load lightweight index files first; drill into detail only when needed.**

| Task | Load First (Headers) | Load When Needed (Detail) |
|------|---------------------|---------------------------|
| Extraction | `_Extraction_Index.md`, `Tags.md` | Extraction workflow, source files |
| Weekly Synthesis Phase 1-2 | `_Weekly_Header.md`, `Active_Ideas.md` (summary) | Extraction files (via sub-agents) |
| Weekly Synthesis Phase 3 | DP Relevance Maps, `_Extraction_Index.md` | Style Guide, Data Normalization, specific extractions |
| Weekly Synthesis Phase 4-5 | New Weekly Learnings, `Active_Ideas.md` | User Observations, templates |
| Monthly Synthesis | `_Weekly_Header.md`, `_Index.md` | Specific weekly files |
| Current Synthesis | `_Index.md`, `Active_Ideas.md` | Latest Weekly Learnings, User Observations |

## Quick Commands

| Command | Action |
|---------|--------|
| `/cris-status` | Show system status and suggested next action |
| `extract` | Process new sources into extractions |
| `extract new files` | **NEW (v3.0):** Automated discovery + batch extraction of pending files |
| `weekly` | Create Weekly Learnings + Talking Points (5-phase workflow) |
| `mid-week synthesis` | **NEW (v3.0):** Autonomous synthesis for Day 3-4 (produces all deliverables) |
| `end-of-week synthesis` | **NEW (v3.0):** Co-creative synthesis with user input (final comprehensive pass) |
| `monthly` | Create Monthly Synthesis |

## System Location

All CRIS files are in the user's selected folder at `/CRIS_Research_System/`.

## Status Check

When asked for status or `/cris-status`, run the status script:

```bash
python3 [skill_path]/scripts/status.py [cris_root_path]
```

---

## Extraction Tracker (NEW in v3.0)

CRIS now includes an automated file discovery system to eliminate manual file listing.

**Location:** `_System/_extraction_tracker.json`

**Purpose:**
- Tracks all raw input files and their extraction status
- Enables "extract new files" automation (no more manual listing!)
- Provides file metadata (size, page count, DP count)
- Records extraction dates and match confidence

**How it works:**
1. Tracker maps raw files (`01_Raw_Inputs/`) to extractions (`02_Extractions/`)
2. Shows which files are `extracted` vs. `pending`
3. Claude reads tracker → identifies pending files → extracts in parallel

**Usage:**
```markdown
"Extract new files"  → Claude reads tracker → finds pending → batch extracts
```

**Recommended workflow:**
Use the "Extract New Files (Automated Discovery)" prompt from `ADVANCED_PROMPT_LIBRARY.md` instead of manually listing files. This is now the PRIMARY extraction workflow.

**Maintenance:**
- Tracker auto-updates after each extraction
- Manually edit if files are renamed or moved
- See `_System/File_Rename_Log_2026-02-14.md` for naming corrections history

---

## Workflow: Extraction

**RECOMMENDED: Use automated discovery workflow** (see `ADVANCED_PROMPT_LIBRARY.md` → "Extract New Files")

### Step 1 — Orient (load headers)

1. Read `_System/_extraction_tracker.json` — identify pending files (NEW in v3.0)
2. Read `02_Extractions/_Extraction_Index.md` — see what's already extracted
3. Read `Tags.md` — see existing tags

### Step 2 — Prepare (load workflow)

4. Read `_System/Workflows/Extraction.md` for atomic data point format
5. Assess file sizes (see workflow for thresholds)
6. Decide: single extraction OR batch with parallel sub-agents

### Step 3a — Single Extraction (1-2 files)

- Create extraction using atomic DP format
- Use verbatim anchors (5-15 words, Cmd+F searchable)
- Follow naming convention: `Source_DescriptiveSlug_YYYY-MM-DD.md`
- Include REQUIRED metadata with `**Original Location:**` field
- Propose tags for user confirmation

### Step 3b — Batch Extraction (3+ files with parallel sub-agents)

**Why parallel:** Isolated context per source = higher accuracy, prevents cross-contamination

**Batch strategy:**
| File Size | Files Per Batch | Parallel Sub-Agents |
|-----------|-----------------|---------------------|
| Small (<500 KB, <20 pages) | 5-8 | One per file |
| Medium (500 KB-3 MB, 20-50 pages) | 3-5 | One per file |
| Large (>3 MB, 50+ pages) | 2-3 | One per file |

**Sub-agent process:**
- Each sub-agent reads ONLY its assigned source file
- Creates extraction in isolated context
- Uses sub-agent prompt template from Extraction workflow
- Returns summary: filename, DP count, tag proposals
- Main agent consolidates results and updates index

See `_System/Workflows/Extraction.md` for detailed sub-agent prompt template.

### Step 4 — Update index

- Update `_Extraction_Index.md` with new extraction entries
- Review and confirm any new proposed tags

### Critical Requirements

**Metadata (REQUIRED for lineage):**
Every extraction MUST include `**Original Location:**` field (not "URL/Location"):
```markdown
- **Original Location:** 01_Raw_Inputs/YYYY-MM/YYYY-MM-DD_to_DD/filename.pdf
```

**File naming (enforced by citation parser):**
```
SourceName_DescriptiveSlug_YYYY-MM-DD.md
```
- **CRITICAL:** EXACTLY 2 underscores before date (segment separators only)
- Use PascalCase within Source and Slug (NO internal underscores)
- Only alphanumeric (NO hyphens, periods, or special characters except date hyphens)
- Date is extraction/processing date

**Examples:**
- ✅ CORRECT: `FinancialTimes_MustafaSuleymanAI_2026-02-13.md`
- ✅ CORRECT: `ProfGPod_EthanMollickAIWrong_2026-02-13.md`
- ❌ WRONG: `Financial_Times_Mustafa_Suleyman_2026-02-13.md` (too many underscores)
- ❌ WRONG: `Prof_G_Pod_Ethan_Mollick_2026-02-13.md` (internal underscores)

**Note:** 13 files were renamed in Feb 2026 to fix underscore violations (see `File_Rename_Log_2026-02-14.md`)

**Atomic DP format:**
```markdown
**DP#:** [Your interpretation]
- **Anchor:** "[Verbatim 5-15 word quote from source]"
- **Citation:** (p. XX)
- **Tags:** #tag1, #tag2
```

Anchor must be:
- Verbatim (exact quote from source)
- 5-15 words (searchable length)
- Distinctive (not generic phrases)
- Cmd+F searchable in source file

See `_System/Citation_Contract.md` for complete naming specifications.

---

## Workflow: Weekly Synthesis (5-Phase Approach)

**Why phased:** Prevents evidence coverage degradation. Separates mining (deep dive on sources) from synthesis (narrative writing).

### Session Planning

| Extraction Volume | Recommended Sessions |
|-------------------|----------------------|
| Light week (1-5 new extractions) | 1 session: all 5 phases |
| Normal week (6-15 new extractions) | 2 sessions: P1-2, then P3-5 |
| Heavy week (16+ new extractions) | 3 sessions: P1-2, P3, P4-5 |

### Phase 1: Extraction Mining Pass

**Purpose:** Go deep into new extractions to identify ALL relevant data points

**When to use sub-agents:**
- 1-2 sources: mine directly
- 3-8 sources: spawn parallel sub-agents (one per source)
- 9+ sources: batch into groups of 5-8

**Sub-agent task:**
Each sub-agent reads ONE extraction and produces DP Relevance Map:
- DPs relevant to Active Ideas (with connection explanation)
- DPs relevant to Open Threads
- New themes not covered by current ideas
- DPs not relevant (with reasoning)

**Output:** `_System/working/relevance_maps/[Source_Name]_relevance.md`

### Phase 2: Coverage Sweep

**Purpose:** Check older sources with low citation coverage

**Steps:**
1. Check "Sources Needing Attention" in `_Weekly_Header.md`
2. Spot-check 2-3 low-coverage sources from `_Extraction_Index.md`
3. Save findings to `_System/working/relevance_maps/Coverage_Sweep_YYYY-MM-DD.md`

### Phase 3: Weekly Learnings

**Purpose:** Write synthesis narrative using pre-digested evidence from DP Relevance Maps

**Load (in order):**
1. `_System/Style_Guide.md` (writing standards)
2. `_System/Data_Point_Normalization.md` (metric presentation)
3. `_System/Citation_Contract.md` (citation format)
4. All DP Relevance Maps from `_System/working/relevance_maps/`
5. `02_Extractions/_Extraction_Index.md` (source metadata)
6. `06_Current_Understanding/Active_Ideas.md` (summary level)
7. `03_Weekly_Learnings/_Weekly_Header.md` (recent context)

**Write Weekly Learnings using:**
- Template from `08_Templates/Weekly_Template.md`
- DP Relevance Maps for evidence (NOT raw extractions)
- Only load raw extractions when you need precise data or verbatim anchors

**Critical writing requirements:**
- Follow Style Guide (no em dashes, Oxford comma, direct voice, no contractions)
- Apply Data Point Normalization (Level 2 minimum, Level 3 when juxtaposing sources)
- Every bracket citation includes metadata comment per Citation Contract
- Mark what is NEW, what SHIFTED, what held STEADY

**Required sections:**
- Sources Processed (table with one-line contributions)
- Synthesis by Tag (insights organized by tag)
- Updates Made to Current Understanding
- Open Threads
- Tags Active This Week
- Reflection (optional)

**Before finalizing:**
- Run Style Guide Quick Self-Check (9 items)
- Run Data Normalization Checklist (7 items)

**Output:** `03_Weekly_Learnings/2026-QN/WL_YYYY-MM-DD.md`

### Phase 4: Active Ideas + Current Synthesis

**Update Active Ideas:**
1. Load new Weekly Learnings, current Active_Ideas.md, DP Relevance Maps
2. For each idea, determine:
   - New supporting evidence? → Add to Supporting Evidence table
   - Position refined? → Update Current Position + Evolution Log
   - Position challenged? → Add to Open Questions
   - New idea from "New Themes"? → Create new idea entry with Drivers
3. Save updated `Active_Ideas.md`

**Update Current Synthesis:**
1. Archive previous version to `06_Current_Understanding/archive/Current_Synthesis_[LastUpdatedDate].md`
2. Load: Updated Active Ideas, new Weekly Learnings, User_Observations.md, template
3. Rewrite Current Synthesis as cumulative position statement
4. Update `06_Current_Understanding/_Index.md`

### Phase 5: Talking Points + System Updates

1. Create Talking Points from Current Synthesis + Active Ideas
2. Update `_Weekly_Header.md` (new week entry, open threads, sources needing attention)
3. Update `Tags.md` if new tags emerged (Emerging → Established if 3+ sources)
4. Optional: Clean up old relevance maps in `_System/working/relevance_maps/`

**Output:** `09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md`

### Key Efficiency Gain

**Traditional approach:** Load all extractions → context window fills → miss evidence

**Phased approach:** Sub-agents mine each source → produce DP Relevance Maps → write from maps → only load raw extractions for precision

This prevents coverage degradation and ensures comprehensive evidence gathering.

---

## Two-Stage Weekly Synthesis (NEW in v3.0)

**Why two stages:** AI moves fast (days, not weeks). You need actionable Talking Points mid-week for calls, posts, and reflection before the week ends.

### Mid-Week Synthesis (First Pass)

**Timing:** Day 3-4 of the week
**Mode:** Fully autonomous (optional user input if early observations available)
**Outputs:** ALL deliverables (not a preview!)
- `WL_YYYY-MM-DD.md` — Full Weekly Learnings (marked as "Mid-week synthesis")
- `TP_YYYY-MM-DD.md` — Talking Points (shareable immediately!)
- Active Ideas updated (preliminary evidence added)
- Current Synthesis updated (if warranted)

**Process:**
1. Run all 5 phases of Weekly Synthesis workflow
2. Mark deliverables with "(Mid-week synthesis)" status
3. User can optionally provide early observations

**Use prompt:** `ADVANCED_PROMPT_LIBRARY.md` → "Mid-Week Synthesis (First Pass)"

### End-of-Week Co-Creation (Final Pass)

**Timing:** Day 5-7 of the week
**Mode:** User input REQUIRED between Session 1 and Session 2
**Why:** This is where your deep thinking and perspective gets integrated

**Session 1: Phases 1-2 (Mining + Coverage Sweep)**
- Process ALL week's extractions with parallel sub-agents
- Generate DP Relevance Maps for comprehensive evidence
- PAUSE for user input at end of session

**User Input (after Session 1):**
Claude asks:
1. What feels most important to you this week?
2. What connections are you seeing?
3. What's your overall reflection?
4. Any emphasis or framing guidance?

**Session 2: Phase 3-5 (Final Synthesis)**
- Claude loads your input from Session 1
- Writes final comprehensive synthesis with your perspective integrated
- Updates all deliverables with "(Final)" status marker
- Creates final Talking Points incorporating your angle

**Use prompts:**
- `ADVANCED_PROMPT_LIBRARY.md` → "End-of-Week Co-Creation (Final Pass): Session 1"
- `ADVANCED_PROMPT_LIBRARY.md` → "End-of-Week Co-Creation (Final Pass): Session 2"

### When to Use Which Workflow

| Scenario | Use This Workflow |
|----------|-------------------|
| Need Talking Points by Thursday | Mid-Week Synthesis (autonomous) |
| Light week, no deep thinking needed | Mid-Week Synthesis (autonomous) |
| Heavy week, want to integrate your perspective | End-of-Week Co-Creation (required user input) |
| Want comprehensive final synthesis | End-of-Week Co-Creation (required user input) |
| Both mid-week TP + final synthesis | Run BOTH workflows (Mid-Week then End-of-Week) |

**Note:** The app parses all `WL_*.md` files, so you can have multiple per week (e.g., mid-week + final).

---

## Workflow: User Observations

User observations capture personal insights from lived professional experience. They complement extraction-based evidence.

### When to add a User Observation

- You notice a pattern not captured in published sources
- Your professional experience adds nuance to academic/consulting findings
- Rapid developments outpace published research
- A mental model developed through practice offers actionable framing

### Steps

1. Read `08_Templates/User_Observation_Template.md` for format
2. Add observation to `06_Current_Understanding/User_Observations.md`
3. Update relevant Active Ideas with `[User observation]` citation
4. Add "Personal Observations Integrated" section to Weekly Learnings if relevant
5. Update "Your Angle" in Talking Points if relevant
6. Update `06_Current_Understanding/_Index.md`

### Citation Format

- `[User observation]` — General observations
- `[User observation (Context)]` — When context matters (e.g., "Capital Group")

---

## Workflow: Monthly Synthesis

### Step 1 — Orient (load headers)

1. Read `03_Weekly_Learnings/_Weekly_Header.md`
2. Read `06_Current_Understanding/_Index.md`

### Step 2 — Prepare

3. Read `_System/Workflows/Monthly_Synthesis.md`
4. Load specific weekly files for this month
5. Load `_System/Style_Guide.md` and `_System/Data_Point_Normalization.md`

### Step 3 — Execute

6. Create Monthly Synthesis using template
7. Cite Weekly Learnings (not individual extractions)
8. Apply Style Guide + Data Normalization standards
9. Update `_Index.md` with month-end snapshot

---

## Writing Standards (ALWAYS Apply)

### The Three Essential Guides

EVERY synthesis output (Weekly Learnings, Talking Points, Current Synthesis, Active Ideas) MUST follow:

1. **Style_Guide.md** - Tone, punctuation, sentence construction
   - No em dashes (use periods, colons, commas, parentheses)
   - Always Oxford comma
   - No contractions in formal docs (Weekly, Current Synthesis, Active Ideas)
   - Narrative over data (one claim, one data point, one sentence)
   - Mark what's new/shifted/steady

2. **Data_Point_Normalization.md** - Metric presentation
   - Level 2: Every data point has population + metric + source + timeframe
   - Level 3: Comparability framing when juxtaposing different sources
   - Altitude model: Organize by market → enterprise → team → individual
   - No cross-altitude mixing within sentences

3. **Citation_Contract.md** - Machine-parseable citations
   - Format: `[Source_DescriptiveSlug DP#, DP#]`
   - Required metadata comment: `<!-- cite:path=...; dp=... -->`
   - One comment per source (even in multi-source citations)

### Quick Self-Checks

**Before finalizing ANY synthesis document:**

**Style Guide checks (9 items):**
1. Search for em dashes (— or –) → replace all
2. Search for missing Oxford commas
3. Search for hedging ("may," "might," "seems") → replace with direct statements
4. Read each sentence for compound claims → split
5. Check paragraphs for numeric density (max 2 stats)
6. Verify every statistic has population, source, timeframe
7. Check for undefined jargon on first use
8. Expand contractions (formal docs only)
9. Verify temporal markers (what's new/shifted/steady)

**Data Normalization checks (7 items):**
1. Every data point has population, metric, source, timeframe
2. No two different-source data points in same sentence without comparability frame
3. Percentage point differences labeled correctly (not just "points")
4. Dollar figures include denominators
5. Ratios include baselines
6. Timelines anchored to calendar dates
7. No cross-altitude mixing within sentences

---

## Index Files (Progressive Disclosure Headers)

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `02_Extractions/_Extraction_Index.md` | Quick ref to all extractions, DP counts, topics | After each extraction |
| `03_Weekly_Learnings/_Weekly_Header.md` | Recent weeks, open threads, active ideas summary, sources needing attention | After each weekly synthesis |
| `06_Current_Understanding/_Index.md` | Idea status, counts, last updated | After idea changes |

---

## Reference Files (Load When Needed)

| File | When to Read |
|------|--------------|
| `_System/_extraction_tracker.json` | Finding pending files, automated extraction discovery (v3.0+) |
| `_System/SYSTEM_ARCHITECTURE_GUIDE.md` | Understanding how system works, file purposes |
| `_System/ADVANCED_PROMPT_LIBRARY.md` | Copy-paste prompts for all operations (RECOMMENDED PRIMARY REFERENCE) |
| `_System/Overview.md` | First session, orientation |
| `_System/Folder_Structure.md` | When organizing files, archiving |
| `_System/Style_Guide.md` | BEFORE writing any synthesis output |
| `_System/Data_Point_Normalization.md` | BEFORE writing any synthesis output |
| `_System/Citation_Contract.md` | BEFORE writing any synthesis output |
| `_System/Workflows/Extraction.md` | Processing new sources |
| `_System/Workflows/Weekly_Synthesis.md` | Creating weekly outputs (5 phases) |
| `_System/Workflows/Monthly_Synthesis.md` | Monthly rollup |
| `_System/Idea_Lifecycle.md` | Managing ideas |
| `_System/Verification_Guide.md` | Verifying claims against sources |
| `_System/Extraction_Name_Mapping.md` | Old-to-new filename mapping (post-standardization) |
| `_System/File_Rename_Log_2026-02-14.md` | History of naming corrections (13 files fixed in Feb 2026) |

---

## Templates Location

All templates in `08_Templates/`:
- `Extraction_Template.md`
- `Weekly_Template.md`
- `Talking_Points_Template.md`
- `Current_Synthesis_Template.md`
- `Monthly_Template.md`
- `Quarterly_Template.md`
- `User_Observation_Template.md`

---

## Folder Convention

Raw inputs use date-range subfolders within months:
- `01_Raw_Inputs/2026-02/2026-02-01_to_07/` (days 1-7)
- `01_Raw_Inputs/2026-02/2026-02-08_to_14/` (days 8-14)
- `01_Raw_Inputs/2026-02/2026-02-15_to_21/` (days 15-21)
- etc.

**Extraction file naming:** `Source_DescriptiveSlug_YYYY-MM-DD.md`

---

## Common Failure Modes & Prevention

### Problem: Citations break in app
**Prevention:** Follow Citation_Contract.md exactly (no hyphens, correct format)

### Problem: Evidence gets missed in synthesis
**Prevention:** Use phased Weekly Synthesis with DP Relevance Maps

### Problem: Data points confuse readers
**Prevention:** Apply Data_Point_Normalization.md (Level 2 minimum)

### Problem: Writing style inconsistent
**Prevention:** Run Style_Guide.md self-checks before finalizing

### Problem: Lineage untraceable
**Prevention:** Include Original Location field in ALL extractions

---

## Version History

- **v3.0** (2026-02-14): Automation & Co-Creation Update
  - **NEW: Extraction Tracker** (`_extraction_tracker.json`) — Automated file discovery eliminates manual listing
  - **NEW: Two-Stage Weekly Synthesis** — Mid-Week (autonomous) + End-of-Week (co-creative with user input)
  - **Enhanced naming enforcement:** EXACTLY 2 underscores rule with PascalCase (fixed 13 files in Feb 2026)
  - Added "Extract New Files (Automated Discovery)" workflow to ADVANCED_PROMPT_LIBRARY
  - Added Mid-Week and End-of-Week Co-Creation prompts to ADVANCED_PROMPT_LIBRARY
  - Added File_Rename_Log_2026-02-14.md documenting naming corrections
  - Strengthened Citation_Contract.md with explicit correct/wrong examples
  - Marked ADVANCED_PROMPT_LIBRARY as recommended primary reference
  - Archived legacy Prompts/ folder and cleanup files

- **v2.0** (2026-02-13): Major update
  - Added 5-phase Weekly Synthesis workflow with DP Relevance Maps
  - Added references to Style Guide, Data Normalization, Citation Contract
  - Added parallel sub-agent extraction guidance
  - Added writing standards self-checks
  - Added common failure modes section
  - Added references to new SYSTEM_ARCHITECTURE_GUIDE and ADVANCED_PROMPT_LIBRARY

- **v1.0** (2026-02-04): Initial skill creation
