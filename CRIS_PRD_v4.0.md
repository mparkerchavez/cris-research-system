# CRIS: Product Requirements Document

**Collaborative Research & Insight System**

**Version:** 4.0
**Last Updated:** February 17, 2026
**Status:** Active - Operating at Scale
**Previous Version:** v3.1 (February 5, 2026)

---

## 1. Executive Summary

**CRIS is a file-based research observatory for knowledge workers operating at scale.** It transforms fragmented research inputs into verifiable, conversation-ready insights through structured extraction, multi-layer synthesis, and evidence tracing.

### Current Operating Scale (February 2026)

- **117 sources** extracted and synthesized
- **40-60 sources** processed per week (sustained)
- **3-session synthesis workflow** with parallel sub-agent processing
- **Full-stack web application** (POC) for evidence tracing
- **7 Active Ideas** with complete source lineage

### Who CRIS Is For

Knowledge workers processing 20+ sources per week who need to:
- Synthesize ACROSS sources (not just within)
- Trace claims to evidence in seconds
- Communicate insights effectively in high-stakes conversations
- Maintain verifiable lineage for strategic positioning

### Key Differentiator

**CRIS doesn't just summarize sources—it synthesizes ACROSS them, extracts reusable communication frameworks, and maintains verifiable lineage from every claim back to original evidence with page-level precision.**

---

## 2. Problem Statement

### Research at Scale Becomes Unmanageable

You're processing **40-60 sources per week** across reports, transcripts, and articles. Insights pile up. Citations blur. When you need to speak confidently—in a meeting, interview, or client conversation—you can't quickly trace:

- **Why you believe what you believe**
- **Where the evidence came from**
- **How your thinking has evolved**
- **What language will land with your audience**

### Traditional Tools Fail at Scale

- **Note-taking apps** (Notion, Evernote): Create disconnected fragments, no cross-source synthesis
- **Bookmarks** (Pocket, Instapaper): Sources pile up, never revisited
- **Memory**: Fades after 100+ sources
- **Summarization tools**: Provide within-source summaries, not cross-source synthesis
- **Reference managers** (Zotero, Mendeley): Document-level metadata, no data-point-level lineage

### What You Actually Need

A research system that:

1. **Captures insights without friction** (automated extraction)
2. **Synthesizes across sources** (not just summarizes within)
3. **Traces any claim to source in seconds** (verifiable lineage)
4. **Surfaces conversation-ready language** (frameworks, analogies, provocations)

---

## 3. What CRIS Does

### 3.1 Structured Capture

- Drop sources (PDFs, transcripts, articles) into a folder
- Automated extraction creates **atomic data points** with verbatim anchors
- **117 sources** processed in 6 weeks (40-60/week sustained)
- Each data point includes:
  - Claim (your interpretation)
  - Verbatim anchor quote (5-15 words, enables Cmd+F in source)
  - Page citation
  - Tags for organization

### 3.2 Multi-Layer Synthesis

**3-Session Workflow Prevents Shallow Analysis:**

**Session 1: Deep Analysis (`cris-analyze`)**
- Parallel sub-agents analyze each source independently
- Creates DP Relevance Maps (one per source)
- Time: 45 min - 3 hours (for 40-60 sources)

**Session 2: Write Learnings (`cris-write-learnings`)**
- Synthesize ACROSS sources by topic/tag using Relevance Maps
- Apply Style Guide + Data Normalization + Citation Contract
- Time: 1-4 hours

**Session 3: Strategic Integration (`cris-integrate`)**
- Update Active Ideas with new evidence
- Archive old Current Synthesis, write new one
- Generate conversation-ready Talking Points
- Time: 1.5-4 hours

**Why session separation?** Single-pass synthesis systematically missed evidence when extraction mining and narrative writing competed for context window space. Session separation forces deep engagement before synthesis.

### 3.3 Linguistic Asset Mining (Optional)

**Session 1.5: `cris-linguistic-mining`** (runs between Session 1 and 2)

Extracts 7 categories of reusable communication elements:

1. **Frameworks & Mental Models** (named conceptual structures)
2. **Analogies & Metaphors** (concrete comparisons for abstract concepts)
3. **Terms & Catchphrases** (memorable coined terms)
4. **Comparison Structures** (A vs B distinctions)
5. **Provocations / Reframes** (inversions of conventional wisdom)
6. **Anti-Patterns / Warnings** (what NOT to do with evidence)
7. **Numerical Rules** (data-backed rules of thumb)

**Organization:** By SOURCE (not category) for easy citation
**Output:** Weekly additions file (`LA_YYYY-MM-DD.md`) + Session 3 integration instructions
**Time:** 45-60 minutes for 40-60 sources (parallel sub-agents)

### 3.4 Verifiable Lineage

- Every claim traces to: **extraction → data point → source (with page/timestamp)**
- Machine-parseable citation format enables **<10 second verification**
- Automated validation gates prevent citation breakage
- Web UI provides inline citation context and full lineage tracing

### 3.5 Research Observatory (Web Application)

**Four Primary Views:**

1. **Pulse:** Current position with key takeaways, trends, open threads, and reflection
2. **Ideas:** Browse Active Ideas with evolution tracking
3. **Talking Points:** Conversation-ready deliverables
4. **Explore:** Full-corpus browser with:
   - Compression chain filter (single-select)
   - Tag stacking (multi-select)
   - Document preview with markdown rendering
   - Inline citation context (click citation → see DP + anchor)
   - Lineage tracing (claim → DP → extraction → raw source)

**Key Features:**
- Evidence Trace System (unified drawer UI for citation/provenance inspection)
- 6-step raw source resolution fallback (finds moved files)
- Exception-only status policy (show warnings only when action needed)
- Machine-parseable citations parsed for inline context

**Status:** Wave 1 complete, production-ready
**Access:** `http://127.0.0.1:5179/` when server running

---

## 4. Core Principles

CRIS operates on **nine core principles**—five original from v3.1, plus four new principles that emerged from operational reality.

### Original Principles (Unchanged)

#### 1. "When I Learned It" Organization

Documents are dated by when **YOU** processed them, not when published. A December 2025 report read in February 2026 belongs to February learnings.

#### 2. Compression Chain

Each layer summarizes the one below. You shouldn't need to re-read lower layers for typical tasks:

```
Raw Inputs → Extractions → Weekly → Monthly → Quarterly
  (source)    (evidence)   (synthesis) (narrative) (publishable)
```

#### 3. Verifiable Lineage

Every claim traces back to source:

```
Published Insight → Active Idea → Weekly Synthesis → Extraction DP# → Source (page/timestamp)
```

#### 4. Progressive Disclosure

Load lightweight index files first; drill into detail only when needed. **At scale (40-60 sources/week), this shifts from optimization to critical requirement.**

#### 5. Atomic Data Points

Each extracted finding has a unique ID (DP#) with a verbatim anchor quote. This enables verification without re-reading full sources.

### New Principles (Emerged from Operations)

#### 6. Session Separation Prevents Shallow Analysis

- Multi-session workflow is **mandatory** at scale
- Sub-agent processing is **critical infrastructure**
- DP Relevance Maps prevent coverage degradation

**Evidence:** ADR-0009 documents this as confirmed decision based on operational evidence

#### 7. Machine-Parseable Lineage Is Infrastructure, Not Feature

- Citation Contract is **strict technical specification**
- Automated validation gates prevent breakage
- Frontend depends on **exact format compliance**

#### 8. Quality Standards Are Built-In, Not Optional

- Style Guide compliance is **checked** (not just suggested)
- Data Normalization is **enforced** (Level 2 minimum)
- Citation Contract is **validated** before publish

#### 9. Language Assets Amplify Data Point Value

- Frameworks, analogies, provocations are **first-class deliverables**
- Organized by source (not category) for **attribution**
- Integrated into synthesis workflow, **not post-hoc**

---

## 5. User Stories

### As a Knowledge Worker at Scale, I Want To...

| Story | So That |
|-------|---------|
| Process 40-60 sources per week without losing insights | I maintain deep understanding despite volume |
| Synthesize ACROSS sources (not just within) | I identify cross-cutting patterns invisible in single sources |
| Trace any claim to source in <10 seconds | I verify accuracy and cite properly in high-stakes situations |
| See how my thinking has evolved | I understand my intellectual journey and position changes |

### As a Strategic Professional, I Want To...

| Story | So That |
|-------|---------|
| Have conversation-ready frameworks and analogies | I communicate insights effectively (not just data dumps) |
| Verify any claim before sharing | I defend positions with confidence and evidence |
| Navigate 100+ sources efficiently | I find relevant evidence without re-reading everything |
| Build reusable intellectual property | I capture communication patterns that transfer across contexts |

### As a Research-Driven Consultant, I Want To...

| Story | So That |
|-------|---------|
| Extract transferable insights from client work | I build methodological IP beyond project deliverables |
| Maintain verifiable lineage for publications | I meet academic standards while working at consulting pace |
| Organize by "when I learned it" | My research reflects my intellectual journey, not arbitrary publication dates |

---

## 6. Core Workflows

### 6.1 Extraction Workflow

**Trigger:** New files in `01_Raw_Inputs/`
**Tool:** `cris-extract` skill
**Time:** Varies by source count and complexity

**Process:**
1. Auto-detect pending files via `_extraction_tracker.json`
2. Spawn parallel sub-agents (one per source)
3. Each agent:
   - Reads source file
   - Identifies key claims
   - Extracts atomic data points with:
     - DP# (unique ID)
     - Claim (interpretation)
     - Anchor (verbatim 5-15 word quote)
     - Citation (page/timestamp)
     - Tags
   - Validates filename convention (strict 2-underscore format)
4. Update extraction index and tracker

**Output:** Extraction files in `02_Extractions/YYYY-MM/[SourceName]_[Slug]_YYYY-MM-DD.md`

**Batch Processing:**
- 1-2 sources: Mine directly (no sub-agents)
- 3-8 sources: Spawn parallel sub-agents (one per source)
- 9+ sources: Batch into groups of 5-8, spawn per batch

---

### 6.2 Weekly Synthesis Workflow (3-Session Architecture)

**Why 3 Sessions?**

Single-pass synthesis systematically missed evidence when extraction mining and narrative writing competed for limited context. Session separation forces deep engagement before synthesis.

#### **Session 1: Deep Analysis (`cris-analyze`)**

**Input:** Raw extraction files
**Time:** 45 min - 3 hours (40-60 sources)

**Process:**
1. Identify unsynthesized extractions
2. Spawn parallel sub-agents (one per source)
3. Each agent:
   - Deep-reads one extraction
   - Maps DPs to Active Ideas / themes / tags
   - Identifies convergence / divergence patterns
   - Creates DP Relevance Map
4. Saves maps to `_System/working/relevance_maps/`

**Output:** DP Relevance Maps (one per source)

**Critical:** Only load raw extractions in Session 2 for precision (specific percentages). Rely on Relevance Maps for narrative.

---

#### **Session 1.5: Linguistic Mining (`cris-linguistic-mining`) [OPTIONAL]**

**Input:** Week's extraction files
**Time:** 45-60 minutes for 40-60 sources

**Process:**
1. Spawn parallel sub-agents (one per extraction)
2. Each agent mines 7 categories:
   - Frameworks & Mental Models
   - Analogies & Metaphors
   - Terms & Catchphrases
   - Comparison Structures
   - Provocations / Reframes
   - Anti-Patterns / Warnings
   - Numerical Rules
3. Coordinator consolidates and deduplicates
4. Applies 4-dimensional credibility scoring per source
5. Generates Framing Notes (how to set conversational perspective)

**Output:**
- `09_Deliverables/Language_Assets/_weekly_additions/LA_YYYY-MM-DD.md`
- `09_Deliverables/Language_Assets/_pending_updates/LA_YYYY-MM-DD_update_instructions.md`

**When to Run:**
- **Mid-week:** First pass on sources collected so far
- **End-of-week:** Final pass with full week's sources
- **Retroactive:** Process previous weeks by specifying target week end date

---

#### **Session 2: Write Learnings (`cris-write-learnings`)**

**Input:** DP Relevance Maps (NOT raw extractions)
**Time:** 1-4 hours

**Process:**
1. Validate DP Relevance Maps exist
2. Synthesize ACROSS sources by tag/theme
3. Document Active Idea evolution
4. Apply quality standards:
   - Style Guide (no em dashes, Oxford comma, direct voice)
   - Data Normalization (Level 2 minimum: population + metric + source + timeframe)
   - Citation Contract (machine-parseable format)
5. Run self-checks before finalizing

**Output:** `03_Weekly_Learnings/YYYY-QX/WL_YYYY-MM-DD.md`

**Key Loading Strategy:** Load DP Relevance Maps, not all raw extractions. Only go to raw files when you need precise data (specific percentages), ambiguous DP context, or verbatim anchor for verification.

---

#### **Session 3: Strategic Integration (`cris-integrate`)**

**Input:** New Weekly Learnings + Language Assets (if mined)
**Time:** 1.5-4 hours

**Process:**

**Part A: Update Active Ideas**
1. Read latest Weekly Learnings
2. Read current Active Ideas
3. Extract changes from "Updates Made to Current Understanding" section
4. For each Active Idea that changed:
   - Update Current Position (if thesis evolved)
   - Add new evidence to Supporting Evidence table
   - Write Evolution Log entry
5. Add new Active Ideas (if proposed in Weekly Learnings)

**Part B: Archive and Rewrite Current Synthesis**
1. Read updated Active Ideas
2. Read User Observations
3. Archive old Current Synthesis to `06_Current_Understanding/archive/Current_Synthesis_YYYY-MM-DD.md`
4. Write new Current Synthesis from scratch:
   - Standalone snapshot (readable without other files)
   - Reflects updated Active Ideas
   - Incorporates User Observations
   - Applies Style Guide + Data Normalization

**Part C: Generate Talking Points**
1. Read new Current Synthesis
2. Read updated Active Ideas
3. Create conversation-ready deliverables:
   - 3-5 talking points with evidence inline
   - Conversational tone (contractions OK)
   - Clear "what matters and why"
   - Ready for meetings/interviews without prep
4. Save as `09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md`

**Part D: Integrate Language Assets (if Session 1.5 ran)**
1. Read Session 1.5 update instructions
2. Integrate weekly additions into master library
3. Deduplicate and consolidate

**Part E: Update System Files**
- Update `_Weekly_Header.md` (recent context)
- Update `Tags.md` (if new tags emerged)
- Clean up working files

**Output:**
- Updated `Active_Ideas.md`
- New `Current_Synthesis.md` (old archived)
- New `TP_YYYY-MM-DD.md`
- Updated `Language_Asset_Library.md` (if linguistic mining ran)

---

### 6.3 Session Cadence by Extraction Volume

| Extraction Volume | Sessions | Approach |
|-------------------|----------|----------|
| **Light (1-5)** | 1 session | All 3 sessions in one chat |
| **Normal (6-15)** | 2 sessions | Session 1-2 (with optional 1.5), then Session 3 |
| **Heavy (16+)** | 3 sessions | Session 1, Session 2, Session 3 (keep separate for depth) |

**Add Linguistic Mining:** Can run mid-week, end-of-week, or retroactively (doesn't disrupt synthesis flow)

---

### 6.4 Monthly Synthesis Workflow

**Trigger:** End of month
**Input:** 4-5 Weekly Learnings
**Time:** 2-5 hours

**Process:**
1. Read Weekly Learnings from the month
2. Identify:
   - Converging themes
   - Idea evolution trajectories
   - Emerging vs. resolved questions
   - Cross-week patterns
3. Write monthly narrative:
   - Month-level synthesis (not just concatenation)
   - Idea status snapshot
   - Trend reflection
   - Apply Style Guide + Data Normalization

**Output:** `04_Monthly_Synthesis/YYYY-QX/[Month]_Synthesis.md`

**Status:** Workflow defined, not yet operationalized

---

### 6.5 Verification & Publishing

**Tool:** `prepublish_lineage_gate.sh`
**When:** Before sharing CRIS deliverables externally

**Process:**
1. Validate citation contract compliance
2. Check citation parser/resolver (regression tests)
3. Verify latest Weekly Learnings, Current Synthesis, Talking Points

**Gate:** Blocks publish on any failure

**Additional Validation Tools:**
- `validate_citation_contract.py` (single file or all synthesis)
- `regression_citation_parser.py` (parser regression tests)
- `style_audit.sh` (orphan CSS class detection for POC)

---

## 7. Deliverables & Outputs

| Output | Cadence | Purpose | Format |
|--------|---------|---------|--------|
| **Extractions** | Per source | Atomic data points with anchors | Markdown with DP# structure |
| **DP Relevance Maps** | Session 1 | Intermediate files (which DPs relate to which ideas) | Markdown (working files) |
| **Language Assets** | Weekly (optional) | Reusable frameworks, analogies, provocations | Markdown organized by source |
| **Weekly Learnings** | 1x/week (3 sessions) | Synthesis across sources by tag | Markdown with citations |
| **Active Ideas** | Living document | Research positions with full lineage | Markdown with evidence tables |
| **Current Synthesis** | After each weekly | Cumulative position snapshot | Markdown (standalone) |
| **Talking Points** | Weekly | Conversation-ready insights | Markdown (conversational) |
| **Monthly Synthesis** | End of month | Narrative rollup with trend analysis | Markdown |
| **Quarterly Synthesis** | End of quarter | Publishable insights | Markdown |

### Deliverable Relationships

```
Raw Inputs (PDFs, transcripts, articles)
    ↓
Extractions (atomic DPs with anchors)
    ↓
DP Relevance Maps (intermediate) + Language Assets (optional)
    ↓
Weekly Learnings (cross-source synthesis)
    ↓
Active Ideas (research positions) ← feeds → Current Synthesis (cumulative snapshot)
    ↓
Talking Points (conversation-ready)
    ↓
Monthly Synthesis → Quarterly Synthesis
```

### NEW: Language Asset Library

**Location:** `09_Deliverables/Language_Assets/Language_Asset_Library.md`

**Purpose:** Master library of reusable linguistic elements organized by source

**Categories:** Frameworks, Analogies, Terms, Comparisons, Provocations, Anti-Patterns, Numerical Rules

**Updates:** Weekly additions integrated via Session 3 (cris-integrate)

**Organization Model:**
- By SOURCE (not category) for attribution
- 4-dimensional credibility scoring per source
- Weekly additions format: `LA_YYYY-MM-DD.md`

**Value:** Provides conversation-ready communication structures beyond data points

**Status:** Skill and workflow fully built, awaiting first production run

---

## 8. System Architecture

### 8.1 File-Based Research System

```
CRIS_Research_System/
├── _System/              ← System files, workflows, skills
│   ├── skills/           ← Executable workflow skills
│   │   ├── cris-extract/
│   │   ├── cris-analyze/
│   │   ├── cris-linguistic-mining/
│   │   ├── cris-write-learnings/
│   │   └── cris-integrate/
│   ├── working/          ← Intermediate files (relevance maps)
│   └── (guides, standards, prompts)
├── 01_Raw_Inputs/        ← Source documents
├── 02_Extractions/       ← Atomic data points with anchors
├── 03_Weekly_Learnings/  ← Weekly synthesis documents
├── 04_Monthly_Synthesis/ ← Monthly narratives
├── 05_Quarterly_Synthesis/ ← Quarterly insights
├── 06_Current_Understanding/
│   ├── Active_Ideas.md   ← Research positions
│   ├── Current_Synthesis.md ← Cumulative snapshot
│   ├── User_Observations.md
│   └── archive/
├── 07_Archive/           ← Archived documents
├── 08_Templates/         ← Document templates
├── 09_Deliverables/
│   ├── Talking_Points/   ← Conversation-ready insights
│   └── Language_Assets/  ← Reusable linguistic elements
│       ├── Language_Asset_Library.md (master)
│       ├── _weekly_additions/
│       └── _pending_updates/
├── poc/                  ← Web application (frontend + backend)
│   ├── public/           ← Frontend assets
│   ├── scripts/          ← Validation tools
│   ├── decisions/        ← ADR system
│   └── server.py         ← Backend API
└── .cris_cache/          ← Auto-generated index (gitignored)
    ├── index.json        ← File index
    └── lineage.json      ← Citation graph
```

---

### 8.2 Web Application (POC)

**Purpose:** Navigate, verify, and interact with research at scale

**Technology:**
- Python backend (Flask-like server with citation parser)
- Vanilla JS frontend
- Local-first (no external dependencies)

**Views:**

1. **Pulse (Home):** Current Synthesis with Key Takeaways, Trends, Open Threads, Reflection
2. **Ideas:** Active Ideas browser
3. **Talking Points:** Deliverables browser
4. **Explore:** Full-corpus file browser with:
   - Compression Chain filter (single-select: Current Understanding, Weekly Learnings, Monthly Synthesis, Extractions, Raw Inputs, Other)
   - Tag stacking (multi-select)
   - Document preview with markdown rendering
   - Inline citation context (click citation → see DP + anchor)
   - Lineage tracing (claim → DP → extraction → raw source)

**Key Features:**
- **Evidence Trace System:** Unified drawer UI for citation/provenance inspection
- **Raw Source Resolution:** 6-step fallback algorithm for finding moved files
- **Exception-Only Status:** Show warnings only when action needed (noise reduction)
- **Machine-Parseable Citations:** Parses metadata comments for inline context

**Quality Gates:**
- `style_audit.sh` (orphan class detection)
- `regression_citation_parser.py` (citation parsing validation)
- `prepublish_lineage_gate.sh` (blocking gate before publish)

**Status:** Wave 1 complete, production-ready
**Location:** `http://127.0.0.1:5179/` when server running
**Startup:** `python3 poc/server.py` from CRIS root

---

### 8.3 Critical Infrastructure

#### 1. Skills System

**Location:** `_System/skills/`

Executable workflows with built-in validation:
- `cris-extract` (automated extraction)
- `cris-analyze` (Session 1: Deep mining)
- `cris-linguistic-mining` (Session 1.5: Language assets)
- `cris-write-learnings` (Session 2: Weekly Learnings)
- `cris-integrate` (Session 3: Strategic integration)

**Features:**
- Prerequisite validation (won't run out of order)
- Quality checks (Style Guide, Citation Contract, Data Normalization)
- Error handling and recovery
- Progress reporting and time estimates

**Invocation:**
```
Read and follow: _System/skills/[skill-name]/SKILL.md
```

---

#### 2. Citation Contract (Machine-Parseable Lineage)

**Location:** `_System/Citation_Contract.md`

**Extraction Naming Convention:**
```
SourceName_DescriptiveSlug_YYYY-MM-DD.md
(EXACTLY 2 underscores before date)
```

**Rules:**
- No hyphens in Source or Slug (use underscores and PascalCase)
- No periods in Source or Slug (use `Opus46` not `Opus4.6`)
- Two parts before date (Source + Slug, both required)

**Inline Citation Format:**
```markdown
[Source_Slug DP3, DP7]
<!-- cite:path=02_Extractions/.../Source_Slug_2026-02-04.md;dp=3,7 -->
```

**Multi-Source Citations:**
```markdown
[Source1 DP3; Source2 DP5, DP8]
<!-- cite:path=02_Extractions/.../Source1_....md;dp=3 -->
<!-- cite:path=02_Extractions/.../Source2_....md;dp=5,8 -->
```

**Why Critical:**
- Frontend parses metadata comments for inline citation context
- Regex-based parser breaks if format varies
- Automated validation gates prevent breakage

**Validation Tools:**
- `validate_citation_contract.py --file [file]` (single file)
- `validate_citation_contract.py --all-synthesis` (all synthesis layers)
- `prepublish_lineage_gate.sh` (full blocking gate)

---

#### 3. Extraction Tracker

**Location:** `_System/_extraction_tracker.json`

Tracks extraction status for all files:

```json
{
  "files": [
    {
      "filename": "Source_Name.pdf",
      "status": "extracted" | "pending" | "skipped",
      "extraction_filename": "SourceName_Slug_2026-02-15.md",
      "processed_date": "2026-02-15"
    }
  ]
}
```

**Used by:** `cris-extract` skill for auto-detection of pending files

---

#### 4. ADR System

**Location:** `poc/decisions/`

**Architecture Decision Records** capture:
- What was decided
- Why it was decided
- Consequences (positive/negative)
- Confidence level (confirmed vs inferred)

**13 ADRs documented** covering:
- Frontend architecture (style contract, navigation model, evidence trace system)
- Workflow changes (phased synthesis, sub-agent processing)
- System-level decisions (citation format, extraction naming, progressive disclosure)

**Key ADRs:**
- ADR-0009: Phased weekly synthesis with sub-agents (confirmed)
- ADR-0010: Machine-parseable citation metadata (confirmed)
- ADR-0011: Canonical extraction filename normalization (confirmed)
- ADR-0013: Evidence-density and metadata minimums (inferred)

**Process:** `decisions/README.md` documents decision-making process and confidence policy

---

## 9. Scale & Constraints

### 9.1 Operating Scale Reality (February 2026)

**Current Scale:**
- **117 sources extracted** (after ~6 weeks)
- **40-60 sources per week** (typical operating load)
- **3-session synthesis workflow** (6-12 hours total)
- **Mandatory parallel sub-agent processing**

**Why Scale Matters:**

This volume fundamentally changes workflow requirements:
- Single-session synthesis is **impossible** (context window limits)
- Progressive disclosure shifts from "optimization" to **"critical requirement"**
- Sub-agent processing is **mandatory, not optional**
- Quality validation must be **automated** (manual checks insufficient)

---

### 9.2 Constraints at Scale

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| **Context Window** | 200K tokens (Claude Sonnet 4.5), but typical loads under 50K | Progressive disclosure (load index files first, drill into detail only when needed) |
| **Session Limits** | Single-session synthesis misses evidence | 3-session architecture with DP Relevance Maps |
| **Parallel Processing** | 40-60 sources require spawning 40-60 sub-agents | Task tool with batch strategies |
| **Quality Gates** | Manual checks fail at this volume | Automated validation (citation contract, style checks) |
| **No Persistent Memory** | Each session starts fresh | Index files provide continuity |

---

### 9.3 Operating Assumptions

**Volume:**
- 40-60 sources per week (typical operating load)
- 100+ total extractions (after ~6 weeks)
- 3-session synthesis workflow (NOT single-session)

**Time Commitment:**
- **Extraction:** 2-4 hours per week
- **Synthesis (3 sessions):** 4-11 hours total
  - Session 1: 45 min - 3 hours
  - Session 2: 1-4 hours
  - Session 3: 1.5-4 hours
- **Linguistic mining (optional):** 45-60 minutes
- **Total: 6-15 hours per week**

**Technical Requirements:**
- **Sub-agent processing is mandatory** (not optional optimization)
- **Progressive disclosure is critical** (context window limits at this scale)
- **Automated validation gates required** (manual checks insufficient)
- **Skills system recommended** (manual workflows error-prone)

**User Discipline:**
- Weekly synthesis cycle (cannot skip without compounding backlog)
- Citation Contract compliance (frontend breaks without it)
- Style Guide self-checks (quality drift without)
- Tag hygiene (monthly review to prevent sprawl)

---

### 9.4 What Doesn't Scale (and Mitigations)

| What Breaks at Scale | Why | Mitigation |
|---------------------|-----|------------|
| **Single-pass synthesis** | Context window fills with extraction mining, leaving no room for synthesis writing | 3-session architecture with DP Relevance Maps |
| **Loading all extractions** | 117 files exceed context window | Progressive disclosure: load Relevance Maps, not raw files |
| **Manual citation checking** | 100+ sources = hundreds of citations to verify | Automated validation gates + machine-parseable format |
| **Sequential extraction** | 40-60 sources processed one-by-one takes days | Parallel sub-agents (spawn 40-60 simultaneously) |
| **Filesystem navigation** | Finding "that stat from that report" takes minutes | Web UI with search, filters, inline citation context |

---

## 10. Success Criteria

### 10.1 Month 1 Targets (Original PRD v3.1)

- [x] **10+ sources extracted** → EXCEEDED (117 sources)
- [x] **2+ Weekly Learnings completed** → EXCEEDED (4+ weekly cycles)
- [x] **3+ Active Ideas with full lineage** → EXCEEDED (7+ Active Ideas)
- [x] **Trace 5 claims to source in <60 seconds** → EXCEEDED (<10 second tracing via POC)
- [x] **Talking Points used in conversation** → ACHIEVED

---

### 10.2 Current Operating Scale (February 2026)

- [x] **100+ sources extracted** (117 actual)
- [x] **3-session synthesis workflow operational**
- [x] **Skills system built and tested**
- [x] **POC web application production-ready**
- [x] **Citation Contract with automated validation**
- [x] **Language Asset Library workflow designed** (awaiting first production run)

---

### 10.3 Next Milestones

| Milestone | Target | Success Metric |
|-----------|--------|----------------|
| **First Language Asset Library population** | Q1 2026 | `LA_YYYY-MM-DD.md` created with 7 categories populated |
| **Monthly Synthesis operationalized** | Q1 2026 | First Monthly Synthesis document generated |
| **Quarterly Synthesis (first run)** | Q1 2026 | First Quarterly Synthesis document generated |
| **External user testing** | Q1 2026 | 3-5 people use CRIS, provide feedback |
| **POC deployment guide** | Q1 2026 | Reproducible setup documentation for new users |
| **200 sources extracted** | Q2 2026 | Sustained 40-60/week pace |

---

## 11. Quality Standards

CRIS enforces quality through **built-in standards and automated validation gates**.

### 11.1 Style Guide

**Location:** `_System/Style_Guide.md`

**Hard Rules:**
- **No em dashes** (use periods or split sentences)
- **Always use Oxford comma** (x, y, and z)
- **Avoid contractions in formal docs** (use in Talking Points / User Observations)
- **Lead with claim, follow with evidence**
- **Active voice by default**
- **One idea per sentence**

**Data Presentation:**
- **Narrative over data** (max 2 statistics per paragraph)
- **One claim, one data point, one sentence** (no compound claims)

**Enforcement:** Manual self-check before finalizing (checklist in Style Guide)

---

### 11.2 Data Normalization

**Location:** `_System/Data_Point_Normalization.md`

**Level 2 Minimum (required for synthesis):**

Template: `[Metric] among [population], per [source] ([timeframe])`

Example:
```
85% of knowledge workers lack value-driving use cases (Section, January 2026)
```

Every data point must answer:
1. **Who was measured?** (population)
2. **What was measured?** (specific metric)
3. **When was it measured?** (timeframe)

**Level 3 (required when juxtaposing sources):**

Three patterns:
- **Convergence/Divergence:** Multiple sources measure same thing
- **Layered View:** Different metrics, same phenomenon
- **Tension:** Sources genuinely disagree

**Enforcement:** Manual self-check + peer review for external deliverables

---

### 11.3 Citation Contract

**Location:** `_System/Citation_Contract.md`

**Strict Format Requirements:**

1. **Extraction filename:** `SourceName_DescriptiveSlug_YYYY-MM-DD.md` (EXACTLY 2 underscores before date)
2. **Inline citation:** `[Source_Slug DP3, DP7]` (drops date, uses underscores)
3. **Metadata comment:**
   ```markdown
   [Source_Slug DP3, DP7]
   <!-- cite:path=02_Extractions/.../Source_Slug_2026-02-04.md;dp=3,7 -->
   ```

**Why Strict:**
- Frontend parser is regex-based (breaks if format varies)
- Enables inline citation context in web UI
- Supports direct open-to-source flows

**Enforcement:** Automated validation gates

---

### 11.4 Automated Validation Gates

**Citation Contract Validation:**
```bash
# Single file
python3 poc/scripts/validate_citation_contract.py --file [file]

# All synthesis layers
python3 poc/scripts/validate_citation_contract.py --all-synthesis
```

**Citation Parser Regression:**
```bash
python3 poc/scripts/regression_citation_parser.py
```

**Full Prepublish Gate (Blocking):**
```bash
./poc/scripts/prepublish_lineage_gate.sh
```

Blocks publish on:
- Latest Weekly Learnings citation contract violations
- Current Synthesis citation contract violations
- Latest Talking Points citation contract violations
- Citation parser/resolver regressions

**Style Audit (POC):**
```bash
./poc/scripts/style_audit.sh
```

Checks:
- Orphan CSS classes
- Missing CSS definitions
- JS IDs referenced but missing in HTML
- Orphan tokens
- Duplicate selectors (informational)

---

## 12. Value Proposition (For External Communication)

### 12.1 Who Should Care

**Knowledge Workers at Scale:**
- Processing 20+ sources per week
- Need to synthesize across (not just within) sources
- Must speak confidently without re-reading everything

**Strategic Roles:**
- **AI Strategy Leads:** Track enterprise AI trends, vendor claims, adoption patterns
- **Product Strategists:** Connect market research to product positioning
- **Consultants:** Build reusable IP from client work
- **Researchers:** Maintain verifiable lineage for publications

**Teams Facing Scale Challenges:**
- Citations breaking as volume grows
- Synthesis getting shallower as sources increase
- Hard to find "that stat from that report"
- Spending hours prepping for conversations

---

### 12.2 What Makes CRIS Different

| Traditional Approach | CRIS |
|---------------------|------|
| **Note-taking apps** (Notion, Evernote) | **Research observatory** |
| Disconnected notes per source | Cross-source synthesis by topic |
| Manual citation management | Automated lineage tracing |
| Memory-based recall | Verifiable evidence chains |
| | |
| **Read-It-Later** (Pocket, Instapaper) | **Structured extraction** |
| Bookmarks pile up | Atomic data points with anchors |
| Never revisited | Synthesized weekly |
| Unstructured highlights | Machine-parseable citations |
| | |
| **Summarization tools** (AI summarizers) | **Multi-session synthesis** |
| Single-pass summaries | 3-session deep analysis |
| Within-source only | Across-source by tag |
| No lineage | Full claim → source trace |
| | |
| **Reference managers** (Zotero, Mendeley) | **Research operating system** |
| Bibliography management | Compression chain (extraction → synthesis → deliverables) |
| Academic citation format | Conversation-ready outputs |
| Document-level metadata | Data-point-level lineage |

---

### 12.3 Operational Reality (February 2026)

**Scale:**
- 117 sources extracted
- 40-60 sources per week (sustained)
- 7 Active Ideas with full lineage
- 4+ Weekly Learnings completed
- 1 Current Synthesis (refreshed weekly)
- 4+ Talking Points generated

**Infrastructure:**
- 5 executable skills (workflows)
- Web application (4 views, production-ready)
- Citation parser with 6-step resolution fallback
- Automated validation gates
- 13 Architecture Decision Records

**Time Investment:**
- **Extraction:** 2-4 hours (40-60 sources)
- **Session 1 (Deep Analysis):** 45 min - 3 hours
- **Session 2 (Write Learnings):** 1-4 hours
- **Session 3 (Integration):** 1.5-4 hours
- **Total: 6-15 hours per week** (for 40-60 sources)

**Value Delivered:**
- **<10 second claim-to-source tracing** (vs. manual file digging)
- **Cross-source patterns emerge** (invisible in single-source summaries)
- **Conversation-ready language** (not just data dumps)
- **Verifiable lineage** (defend claims with confidence)

---

## 13. Non-Goals (Out of Scope)

**What CRIS Is NOT:**

- **Autonomous processing:** CRIS doesn't run in the background; you initiate every workflow
- **Real-time sync:** No live connection to news feeds or databases
- **Collaboration:** Single-user system; not designed for team knowledge management
- **Perfect recall:** Compression means some detail is intentionally lost at each layer
- **AI-generated insights:** CRIS organizes YOUR research, doesn't generate new claims
- **Cloud-based:** Local-first file system (no external dependencies)

---

## 14. Future Considerations

*Not committed, but worth tracking:*

### Near-Term Exploration
- **YouTube transcript extraction workflow** (API or manual ingestion)
- **Web article capture before link rot** (automated archiving)
- **Mobile access (read-only)** (browse Current Synthesis / Talking Points on phone)

### Medium-Term Possibilities
- **Multi-user collaboration model** (shared extractions, independent synthesis)
- **API integration for source ingestion** (automated RSS/feed processing)
- **Export formats** (PDF, presentation slides)
- **Obsidian graph visualization** (network view of idea relationships)

### Long-Term Research
- **Real-time synthesis assistant** (proactive synthesis suggestions)
- **Cross-CRIS comparison** (compare research positions across users)
- **Publication pipeline** (CRIS → academic paper / blog post)

---

## 15. Reference

### System Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **System Architecture Guide** | `_System/SYSTEM_ARCHITECTURE_GUIDE.md` | Complete file purpose reference |
| **Advanced Prompt Library** | `_System/ADVANCED_PROMPT_LIBRARY.md` | All operation prompts (extraction, synthesis) |
| **Citation Contract** | `_System/Citation_Contract.md` | Machine-parseable citation format |
| **Style Guide** | `_System/Style_Guide.md` | Writing standards and punctuation rules |
| **Data Normalization** | `_System/Data_Point_Normalization.md` | Metric presentation standards |
| **Skills System Guide** | `_System/skills/README.md` | Complete workflow documentation |
| **Folder Structure** | `_System/Folder_Structure.md` | File organization conventions |

### Skills (Executable Workflows)

| Skill | Location | Purpose |
|-------|----------|---------|
| **cris-extract** | `_System/skills/cris-extract/SKILL.md` | Automated extraction workflow |
| **cris-analyze** | `_System/skills/cris-analyze/SKILL.md` | Session 1: Deep mining + DP Relevance Maps |
| **cris-linguistic-mining** | `_System/skills/cris-linguistic-mining/SKILL.md` | Session 1.5: Language Asset extraction |
| **cris-write-learnings** | `_System/skills/cris-write-learnings/SKILL.md` | Session 2: Weekly Learnings synthesis |
| **cris-integrate** | `_System/skills/cris-integrate/SKILL.md` | Session 3: Strategic integration |

### Web Application

| Document | Location | Purpose |
|----------|----------|---------|
| **POC README** | `poc/README.md` | Setup, validation, quality gates |
| **Evidence Trace System** | `poc/EVIDENCE_TRACE_SYSTEM.md` | Citation/provenance interaction model |
| **ADR Index** | `poc/decisions/ADR_INDEX.md` | All architecture decisions |
| **Style Contract** | `poc/STYLE_CONTRACT.md` | Frontend style system |

### Quick Start

**Check system status:**
```bash
cat _System/_extraction_tracker.json  # Pending extractions
cat 03_Weekly_Learnings/_Weekly_Header.md  # Synthesis status
```

**Run extraction:**
```
Read and follow: _System/skills/cris-extract/SKILL.md
```

**Run synthesis (3 sessions):**
```
Read and follow: _System/skills/cris-analyze/SKILL.md
Read and follow: _System/skills/cris-write-learnings/SKILL.md
Read and follow: _System/skills/cris-integrate/SKILL.md
```

**Start web application:**
```bash
python3 poc/server.py
# Open: http://127.0.0.1:5179/
```

---

## Appendix A: Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| **4.0** | Feb 17, 2026 | Scale update (40-60 sources/week), 3-session workflow, linguistic mining, POC web app, 9 core principles, value proposition |
| **3.1** | Feb 5, 2026 | Current Synthesis added as deliverable, 5-phase synthesis workflow |
| **3.0** | (Earlier) | Compression chain model, atomic data points, verifiable lineage |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Atomic Data Point (DP)** | Single extracted finding with unique ID, claim, verbatim anchor quote, page citation, and tags |
| **Anchor** | Verbatim 5-15 word quote from source enabling Cmd+F verification |
| **Citation Contract** | Strict technical specification for machine-parseable citations |
| **Compression Chain** | Raw → Extractions → Weekly → Monthly → Quarterly synthesis layers |
| **DP Relevance Map** | Intermediate file mapping which data points relate to which ideas/themes |
| **Language Asset** | Reusable communication element (framework, analogy, provocation, etc.) |
| **Progressive Disclosure** | Load index files first, drill into detail only when needed |
| **Session Separation** | 3-session synthesis workflow preventing shallow analysis |
| **Sub-agent** | Parallel AI agent analyzing one source in isolation |
| **Verifiable Lineage** | Full trace from claim → data point → extraction → source (with page) |

---

**END OF DOCUMENT**

*For questions or feedback, refer to `_System/Overview.md` or `poc/README.md`*
