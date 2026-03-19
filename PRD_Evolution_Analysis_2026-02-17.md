# CRIS PRD Evolution Analysis

**Date:** February 17, 2026
**Purpose:** Document how CRIS has evolved from PRD v3.1 (Feb 5, 2026) to current implementation, and recommend PRD updates

---

## Executive Summary

CRIS has evolved significantly beyond the PRD in three critical dimensions:

1. **Scale**: From theoretical multi-file processing to **40-60+ sources/week** and **117 total extractions** (10x original expectations)
2. **Workflow Architecture**: From simple 5-phase synthesis to **three-session synthesis + linguistic mining layer** with mandatory sub-agent processing
3. **Deliverables & Infrastructure**: Added **Language Asset Library**, built **full-stack web application (POC)**, and created **executable Skills system**

**Recommendation:** PRD needs substantial update to reflect operational reality and communicate value proposition for external audiences.

---

## Part 1: How We Defined CRIS in the PRD (Feb 5, 2026)

### Core Definition (PRD)
> "Research and learning are fragmented. CRIS solves this by creating:
> 1. A structured capture system for research inputs
> 2. A compression chain that synthesizes insights over time
> 3. A verifiable lineage from any claim back to source evidence"

### Key Characteristics (PRD)

**Compression Chain:**
```
Raw Inputs → Extractions → Weekly → Monthly → Quarterly
  (source)    (evidence)   (synthesis) (narrative) (publishable)
```

**Core Workflows:**
- Extraction (per source)
- Weekly Synthesis (end of week, flexible)
- Monthly Synthesis (end of month)
- Verification (before publishing)

**Key Outputs:**
- Extractions (atomic DPs with anchors)
- Weekly Learnings (1-2x/week)
- Talking Points (weekly)
- Current Synthesis (after each weekly synthesis)
- Active Ideas (living document)
- Monthly/Quarterly Synthesis (narrative rollups)

**Success Metrics (Month 1):**
- 10+ sources extracted
- 2+ Weekly Learnings completed
- 3+ Active Ideas with full lineage
- Trace 5 claims to source in <60 seconds

**Constraints Noted:**
- Context window limits
- No persistent memory
- Manual initiation
- Assumes 1-2x/week processing cadence

**Architecture:**
```
_System/              ← How it works
01_Raw_Inputs/        ← Source documents
02_Extractions/       ← Atomic data points
03_Weekly_Learnings/  ← Synthesis layer
04_Monthly_Synthesis/ ← Narrative layer
06_Current_Understanding/ ← Positions + Current Synthesis
08_Templates/         ← Document templates
09_Deliverables/      ← Talking points, briefs
```

---

## Part 2: How CRIS Has Actually Evolved

### 2.1 SCALE TRANSFORMATION (10x Growth)

**Reality vs. PRD Assumptions:**

| Metric | PRD Assumption | Current Reality | Multiplier |
|--------|----------------|-----------------|------------|
| **Sources/Week** | ~5-10 | 40-60+ | 6-8x |
| **Total Extractions (Month 1)** | 10+ (target) | 117 | 11.7x |
| **Weekly Synthesis Complexity** | 1 session, "flexible timing" | 3 mandatory sessions + optional linguistic mining | 3-4x |
| **Context Management** | "Progressive disclosure" | **Critical operational requirement** with strict loading protocols | Essential |

**Impact:**
- Sub-agent/parallel processing is **mandatory, not optional**
- Single-session synthesis is **impossible** at this volume
- Progressive disclosure shifted from "nice to have" to **"system won't work without it"**

---

### 2.2 WORKFLOW ARCHITECTURE EVOLUTION

#### A. Extraction Workflow: Now Automated with Skills

**PRD Version:**
- Manual workflow described in `_System/Workflows/Extraction.md`
- Sub-agents suggested for 3+ sources

**Current Implementation:**
- **`cris-extract` skill** with:
  - Automatic pending file detection via `_extraction_tracker.json`
  - Parallel sub-agent spawning (one per source)
  - Strict filename validation (2-underscore convention)
  - Automatic index updates
  - Built-in quality checks

**NEW:** Extraction tracker JSON became critical infrastructure (not mentioned in PRD)

---

#### B. Synthesis Workflow: Complete Architectural Redesign

**PRD Version (5 phases, assumed 1-2 sessions):**
1. Extraction Mining Pass
2. Coverage Sweep
3. Weekly Learnings
4. Active Ideas + Current Synthesis
5. Talking Points + System Updates

**Current Implementation (3-Session Architecture):**

**Session 1: `cris-analyze` (Deep Mining)**
- **Input:** Raw extraction files
- **Process:** Spawn parallel sub-agents (one per source)
- **Output:** DP Relevance Maps (one per source)
- **Time:** 45 min - 3 hours
- **Why mandatory:** Prevents coverage degradation when extraction mining and synthesis writing compete for context window

**Session 1.5: `cris-linguistic-mining` (NEW - Not in PRD)**
- **Input:** Week's extraction files
- **Process:** Spawn parallel sub-agents to mine 7 linguistic categories
- **Output:**
  - `LA_YYYY-MM-DD.md` (weekly additions to Language Asset Library)
  - Session 3 integration instructions
- **Time:** 45-60 minutes for 40-60 sources
- **Why added:** Capture transferable communication elements beyond data points

**Session 2: `cris-write-learnings` (Synthesis Writing)**
- **Input:** DP Relevance Maps (NOT raw extractions)
- **Process:** Synthesize across sources by tag
- **Output:** `WL_YYYY-MM-DD.md`
- **Time:** 1-4 hours
- **Critical:** Only reads raw extractions for precision (specific percentages), relies on Relevance Maps for narrative

**Session 3: `cris-integrate` (Strategic Integration)**
- **Input:** New Weekly Learnings + Language Assets (if mined)
- **Process:** Update Active Ideas, archive/rewrite Current Synthesis, generate Talking Points
- **Output:** Updated Active Ideas, new Current Synthesis, new Talking Points, integrated Language Assets
- **Time:** 1.5-4 hours

**Why This Changed:**
- **Evidence from operations:** Single-pass synthesis systematically missed evidence at scale
- **Root cause:** Context window competition between mining and writing
- **Solution:** Separate sessions force deep engagement before synthesis

**NEW:** ADR-0009 documented this as "confirmed" decision based on operational evidence

---

### 2.3 NEW DELIVERABLE: Language Asset Library

**Status in PRD:** Does not exist

**Current Implementation:**
- **Location:** `09_Deliverables/Language_Assets/` (folder structure defined but not yet populated)
- **Purpose:** Mine and organize 7 categories of reusable linguistic elements from extractions
- **Categories:**
  1. Frameworks & Mental Models
  2. Analogies & Metaphors
  3. Terms & Catchphrases
  4. Comparison Structures
  5. Provocations / Reframes
  6. Anti-Patterns / Warnings
  7. Numerical Rules (data-backed rules of thumb)

**Organization Model:**
- **By SOURCE** (not by category) for easy citation
- **4-dimensional credibility scoring** per source
- **Weekly additions format:** `LA_YYYY-MM-DD.md`
- **Master library integration:** Happens in Session 3 (cris-integrate)

**Why Added:**
- **User need:** "I need conversation-ready ways to communicate these insights"
- **Gap identified:** Data points capture WHAT was learned, but not HOW to communicate it effectively
- **Value:** Frameworks, analogies, and provocations are transferable across contexts

**Status:** Skill and workflow fully built, awaiting first production run

---

### 2.4 INFRASTRUCTURE ADDITIONS

#### A. Skills System (Executable Workflows)

**Status in PRD:** Reference to `_System/cris/SKILL.md` exists, but not as comprehensive system

**Current Implementation:**
- **Location:** `_System/skills/`
- **Skills Built:**
  - `cris-extract` (automated extraction)
  - `cris-analyze` (Session 1: Deep Mining)
  - `cris-linguistic-mining` (Session 1.5: Language Asset mining)
  - `cris-write-learnings` (Session 2: Weekly Learnings)
  - `cris-integrate` (Session 3: Strategic Integration)

**Features:**
- Built-in prerequisite validation (won't run out of order)
- Automatic quality checks (Style Guide, Citation Contract, Data Normalization)
- Error handling and recovery workflows
- Progress reporting at each phase
- Time estimates for planning

**Why Added:**
- **Operational complexity:** 3-session workflow with dependencies needs orchestration
- **Quality consistency:** Built-in checks prevent quality drift
- **Onboarding:** New users need structured guidance

---

#### B. Citation Contract & Machine-Parseable Metadata

**PRD Version:** Mentioned as "Verifiable Lineage" principle

**Current Implementation:**
- **System file:** `_System/Citation_Contract.md` (comprehensive specification)
- **Extraction naming contract:** `SourceName_DescriptiveSlug_YYYY-MM-DD.md` (EXACTLY 2 underscores)
- **Inline citation format:** `[Source_Slug DP3, DP7]`
- **Required metadata comments:**
  ```markdown
  [BCG_EmergingAgenticEnterprise DP3, DP7]
  <!-- cite:path=02_Extractions/.../BCG_EmergingAgenticEnterprise_2026-02-04.md;dp=3,7 -->
  ```

**Why Critical:**
- **Front-end requirement:** POC app parses these comments to enable inline citation context
- **Parser stability:** Regex-based, breaks if format varies even slightly
- **Validation tools:** `validate_citation_contract.py`, `regression_citation_parser.py`, `prepublish_lineage_gate.sh`

**Impact:** What was a "principle" in PRD became **strict technical contract** with automated validation

---

#### C. ADR (Architecture Decision Record) System

**Status in PRD:** Does not exist

**Current Implementation:**
- **Location:** `poc/decisions/`
- **13 ADRs documented** (8 frontend, 5 cross-system)
- **Confidence levels:** "confirmed" (from explicit artifacts) vs "inferred" (reconstructed)
- **Key decisions captured:**
  - ADR-0009: Phased weekly synthesis with sub-agents
  - ADR-0010: Machine-parseable citation metadata
  - ADR-0011: Canonical extraction filename normalization
  - ADR-0013: Evidence-density and metadata minimums

**Why Added:**
- **Knowledge preservation:** Capture WHY decisions were made (not just WHAT was decided)
- **Onboarding:** New collaborators need decision context
- **Consistency:** Prevent reintroducing solved problems

---

### 2.5 FRONT-END POC (Not in PRD)

**Status in PRD:** Does not exist (CRIS described as file-based system)

**Current Implementation:**
- **Full-stack web application** (`poc/` folder)
- **Technology:** Python backend (Flask-like server), vanilla JS frontend
- **4 Primary Views:**
  1. **Pulse** (home): Current Synthesis with Key Takeaways, Trends, Open Threads, Reflection
  2. **Ideas**: Active Ideas browser
  3. **Talking Points**: Conversation-ready deliverables
  4. **Explore**: Full file browser with document preview, citation tracing, lineage drawers

**Key Capabilities:**
- **Evidence Trace System:** Unified drawer UI for citation/provenance inspection
- **Inline Citation Context:** Click citation → see DP details + anchor + source navigation
- **Compression Chain Filter:** Single-select filter (Current Understanding, Weekly Learnings, Monthly Synthesis, Extractions, Raw Inputs, Other)
- **Tag Stacking:** Multi-select tag filters
- **Lineage Tracing:** Full claim → DP → Extraction → Raw Source chain
- **Raw Source Resolution:** 6-step fallback resolver for finding moved files

**Architecture Decisions:**
- **ADR-0001:** Style contract with `cr-*` naming system
- **ADR-0002:** Explore as primary trace workspace (drawer-first)
- **ADR-0003:** Four-view navigation model
- **ADR-0004:** Unified evidence trace model
- **ADR-0005:** Exception-only lineage status (noise reduction)

**Quality Gates:**
- `style_audit.sh` (orphan class detection)
- `regression_citation_parser.py` (citation parsing validation)
- `prepublish_lineage_gate.sh` (blocking gate before publish)

**Why Built:**
- **Scale challenge:** 117 files impossible to navigate via filesystem alone
- **Verification bottleneck:** "<60 seconds to trace claim" goal required tooling
- **Communication need:** Showing CRIS value requires demonstration, not just explanation

**Status:** Wave 1 signoff complete, production-ready

---

### 2.6 UPDATED FOLDER STRUCTURE

**PRD Version:**
```
_System/
01_Raw_Inputs/
02_Extractions/
03_Weekly_Learnings/
04_Monthly_Synthesis/
06_Current_Understanding/
08_Templates/
09_Deliverables/
```

**Current Structure:**
```
_System/
  ├── skills/              [NEW]
  ├── working/             [NEW]
  └── (all existing files)
01_Raw_Inputs/
02_Extractions/
03_Weekly_Learnings/
04_Monthly_Synthesis/
05_Quarterly_Synthesis/  [NEW]
06_Current_Understanding/
  ├── Active_Ideas.md
  ├── Current_Synthesis.md
  ├── User_Observations.md
  ├── Perspective_CrossReference_2026-02-15.md [NEW]
  └── archive/
07_Archive/              [NEW]
08_Templates/
09_Deliverables/
  ├── Talking_Points/
  └── Language_Assets/    [NEW - structure defined, awaiting population]
      ├── Language_Asset_Library.md
      ├── _weekly_additions/
      └── _pending_updates/
poc/                      [NEW]
  ├── public/             (frontend assets)
  ├── scripts/            (validation tools)
  ├── decisions/          (ADR system)
  └── server.py           (backend API)
.cris_cache/             [NEW]
  ├── index.json          (file index)
  └── lineage.json        (citation graph)
```

**Key Changes:**
- **`_System/skills/`**: Executable workflow skills
- **`_System/working/`**: Intermediate files (DP Relevance Maps, Language Asset prototypes)
- **`05_Quarterly_Synthesis/`**: Added for completeness (PRD mentioned but folder missing)
- **`07_Archive/`**: Explicit top-level archive folder
- **`09_Deliverables/Language_Assets/`**: New deliverable category
- **`poc/`**: Entire web application with frontend, backend, validation tools
- **`.cris_cache/`**: Auto-generated index for frontend (gitignored)

---

## Part 3: Core Principles - Have They Changed?

### PRD Core Principles:

1. **"When I Learned It" Organization** → ✅ **UNCHANGED**
2. **Compression Chain** → ✅ **UNCHANGED** (but execution is now 3-session model)
3. **Verifiable Lineage** → ✅ **STRENGTHENED** (now machine-parseable with validation tools)
4. **Progressive Disclosure** → ✅ **ELEVATED** (from "nice to have" to "critical requirement")
5. **Atomic Data Points** → ✅ **UNCHANGED** (DP# with verbatim anchors)

### NEW Principles (Emerged from Operations):

6. **Session Separation Prevents Shallow Analysis**
   - Multi-session workflow is mandatory at scale
   - Sub-agent processing is critical infrastructure
   - DP Relevance Maps prevent coverage degradation

7. **Machine-Parseable Lineage is Infrastructure, Not Feature**
   - Citation Contract is strict technical specification
   - Automated validation gates prevent breakage
   - Frontend depends on exact format compliance

8. **Quality Standards Are Built-In, Not Optional**
   - Style Guide compliance is checked (not just suggested)
   - Data Normalization is enforced (Level 2 minimum)
   - Citation Contract is validated before publish

9. **Language Assets Amplify Data Point Value**
   - Frameworks, analogies, provocations are first-class deliverables
   - Organized by source (not category) for attribution
   - Integrated into synthesis workflow, not post-hoc

---

## Part 4: PRD Update Recommendations

### 4.1 CRITICAL UPDATES (Must Have)

#### A. Scale & Constraints Section
**Current PRD says:**
> "Assumptions: You'll process sources 1-2x per week"

**Should say:**
```markdown
### Scale Reality (February 2026)

**Current Operating Scale:**
- 40-60 sources per week (typical)
- 117 total extractions (after ~6 weeks)
- 3-session synthesis workflow (6-12 hours total)
- Mandatory parallel sub-agent processing

**Why Scale Matters:**
This volume fundamentally changes workflow requirements:
- Single-session synthesis is impossible (context window limits)
- Progressive disclosure shifts from "optimization" to "critical requirement"
- Sub-agent processing is mandatory, not optional
- Quality validation must be automated (manual checks insufficient)

**Constraints at Scale:**
- **Context window:** Sub-agents isolate sources to prevent cross-contamination
- **Session limits:** 3 separate sessions required for deep vs. shallow analysis
- **Parallel processing:** 40-60 sources require spawning 40-60 sub-agents
- **Quality gates:** Automated validation (citation contract, style checks) are blocking requirements
```

---

#### B. Workflows Section: Replace with 3-Session Model

**Current PRD shows:**
```markdown
| Workflow | Trigger | Output |
|----------|---------|--------|
| Extraction | New files in Raw_Inputs | Atomic DPs |
| Weekly Synthesis | End of week (flexible) | Weekly Learnings + Talking Points |
| Monthly Synthesis | End of month | Monthly narrative |
| Verification | Before publishing | Confirmed lineage |
```

**Should show:**
```markdown
### Core Workflows

#### 1. Extraction Workflow
**Trigger:** New files in `01_Raw_Inputs/`
**Tool:** `cris-extract` skill
**Process:**
- Auto-detect pending files via `_extraction_tracker.json`
- Spawn parallel sub-agents (one per source)
- Validate filename convention (strict 2-underscore format)
- Update index and tracker

**Output:** Extraction files in `02_Extractions/` with atomic DPs

**Time:** Varies by source count and complexity

---

#### 2. Weekly Synthesis Workflow (3-Session Architecture)

**Why 3 Sessions?**
Single-pass synthesis systematically missed evidence when extraction mining and narrative writing competed for limited context. Session separation forces deep engagement before synthesis.

##### **Session 1: Deep Analysis (`cris-analyze`)**
**Input:** Raw extraction files
**Process:** Spawn parallel sub-agents (one per source) to create DP Relevance Maps
**Output:** `_System/working/relevance_maps/[Source]_relevance.md`
**Time:** 45 min - 3 hours (40-60 sources)

##### **Session 1.5: Linguistic Mining (`cris-linguistic-mining`) [OPTIONAL]**
**Input:** Week's extraction files
**Process:** Mine 7 linguistic categories (frameworks, analogies, terms, comparisons, provocations, anti-patterns, numerical rules)
**Output:** `09_Deliverables/Language_Assets/_weekly_additions/LA_YYYY-MM-DD.md`
**Time:** 45-60 minutes
**When:** Mid-week or end-of-week (or retroactive)

##### **Session 2: Write Learnings (`cris-write-learnings`)**
**Input:** DP Relevance Maps (NOT raw extractions)
**Process:** Synthesize across sources by tag, apply Style Guide + Data Normalization + Citation Contract
**Output:** `03_Weekly_Learnings/YYYY-QX/WL_YYYY-MM-DD.md`
**Time:** 1-4 hours

##### **Session 3: Strategic Integration (`cris-integrate`)**
**Input:** New Weekly Learnings + Language Assets (if mined)
**Process:** Update Active Ideas, archive/rewrite Current Synthesis, generate Talking Points, integrate Language Assets
**Output:**
- Updated `Active_Ideas.md`
- New `Current_Synthesis.md` (old archived)
- New `TP_YYYY-MM-DD.md`
- Updated `Language_Asset_Library.md` (if linguistic mining ran)

**Time:** 1.5-4 hours

---

#### 3. Monthly Synthesis Workflow
**Trigger:** End of month
**Input:** 4-5 Weekly Learnings
**Output:** `04_Monthly_Synthesis/[Month]_Synthesis.md`
**Status:** Workflow defined, not yet operationalized

---

#### 4. Verification & Publishing
**Tool:** `prepublish_lineage_gate.sh`
**Process:**
- Validate citation contract compliance
- Check citation parser/resolver
- Verify latest Weekly Learnings, Current Synthesis, Talking Points

**Gate:** Blocks publish on any failure
```

---

#### C. Deliverables Section: Add Language Assets

**Current PRD lists:**
```markdown
| Output | Cadence | Purpose |
|--------|---------|---------|
| Extractions | Per source | Atomic data points |
| Weekly Learnings | 1-2x/week | Synthesis across sources |
| Talking Points | Weekly | Conversation-ready insights |
| Monthly Synthesis | End of month | Narrative rollup |
| Current Synthesis | After each weekly | Cumulative position |
| Active Ideas | Living document | Positions with lineage |
```

**Should add:**
```markdown
| Output | Cadence | Purpose |
|--------|---------|---------|
| **Extractions** | Per source | Atomic data points with anchors |
| **Weekly Learnings** | 1x/week (3 sessions) | Synthesis across sources by tag |
| **Language Assets** | Weekly (optional) | Reusable frameworks, analogies, provocations for communication |
| **Talking Points** | Weekly | Conversation-ready insights with evidence |
| **Current Synthesis** | After each weekly | Cumulative position snapshot |
| **Active Ideas** | Living document | Research positions with full lineage |
| **Monthly Synthesis** | End of month | Narrative rollup with trend analysis |
| **Quarterly Synthesis** | End of quarter | Publishable insights |

**NEW: Language Asset Library**
- **Location:** `09_Deliverables/Language_Assets/Language_Asset_Library.md`
- **Purpose:** Master library of reusable linguistic elements organized by source
- **Categories:** Frameworks, Analogies, Terms, Comparisons, Provocations, Anti-Patterns, Numerical Rules
- **Updates:** Weekly additions integrated via Session 3 (cris-integrate)
- **Value:** Provides conversation-ready communication structures beyond data points
```

---

#### D. Architecture Section: Add POC & Infrastructure

**Current PRD shows minimal architecture**

**Should add:**
```markdown
## System Architecture (February 2026)

### File-Based Research System
```
CRIS_Research_System/
├── _System/              ← System files, workflows, skills
│   ├── skills/           ← Executable workflow skills
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
│   └── User_Observations.md
├── 07_Archive/           ← Archived documents
├── 08_Templates/         ← Document templates
├── 09_Deliverables/
│   ├── Talking_Points/   ← Conversation-ready insights
│   └── Language_Assets/  ← Reusable linguistic elements
│       ├── Language_Asset_Library.md (master)
│       ├── _weekly_additions/
│       └── _pending_updates/
└── poc/                  ← Web application (frontend + backend)
```

### Web Application (POC)

**Purpose:** Navigate, verify, and interact with research at scale

**Technology:**
- Python backend (Flask-like server with citation parser)
- Vanilla JS frontend
- Local-first (no external dependencies)

**Views:**
1. **Pulse** (home): Current Synthesis with Key Takeaways, Trends, Open Threads
2. **Ideas**: Active Ideas browser
3. **Talking Points**: Deliverables browser
4. **Explore**: Full-corpus file browser with:
   - Compression Chain filter (single-select)
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
- Style audit script (orphan class detection)
- Citation parser regression tests
- Prepublish lineage gate (blocking)

**Status:** Wave 1 complete, production-ready
**Location:** `http://127.0.0.1:5179/` when server running

---

### Critical Infrastructure

#### 1. Skills System
**Location:** `_System/skills/`

Executable workflows with built-in validation:
- `cris-extract` (automated extraction)
- `cris-analyze` (Session 1)
- `cris-linguistic-mining` (Session 1.5)
- `cris-write-learnings` (Session 2)
- `cris-integrate` (Session 3)

**Features:**
- Prerequisite validation (won't run out of order)
- Quality checks (Style Guide, Citation Contract, Data Normalization)
- Error handling and recovery
- Progress reporting and time estimates

---

#### 2. Citation Contract (Machine-Parseable Lineage)
**Location:** `_System/Citation_Contract.md`

**Extraction Naming:**
```
SourceName_DescriptiveSlug_YYYY-MM-DD.md
(EXACTLY 2 underscores before date)
```

**Inline Citation:**
```markdown
[Source_Slug DP3, DP7]
<!-- cite:path=02_Extractions/.../Source_Slug_2026-02-04.md;dp=3,7 -->
```

**Why Critical:**
- Frontend parses metadata comments for inline citation context
- Regex-based parser breaks if format varies
- Automated validation gates prevent breakage

**Validation Tools:**
- `validate_citation_contract.py` (blocking before publish)
- `regression_citation_parser.py` (parser regression tests)
- `prepublish_lineage_gate.sh` (full gate)

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

**Used by:** `cris-extract` skill for auto-detection

---

#### 4. ADR System
**Location:** `poc/decisions/`

Architecture Decision Records capture:
- What was decided
- Why it was decided
- Consequences (positive/negative)
- Confidence level (confirmed vs inferred)

**13 ADRs documented** covering frontend architecture, workflow changes, and system-level decisions
```

---

#### E. Success Criteria: Update for Scale

**Current PRD (Month 1):**
```markdown
- [ ] 10+ sources extracted
- [ ] 2+ Weekly Learnings completed
- [ ] 3+ Active Ideas with full lineage
- [ ] Trace 5 claims to source in <60 seconds
- [ ] Talking Points used in conversation
```

**Should update:**
```markdown
### Success Criteria

#### Month 1 (Baseline)
- [x] 10+ sources extracted → **EXCEEDED (117 sources)**
- [x] 2+ Weekly Learnings completed → **EXCEEDED (4+ weekly cycles)**
- [x] 3+ Active Ideas with full lineage → **EXCEEDED (7+ Active Ideas)**
- [x] Trace 5 claims to source in <60 seconds → **ACHIEVED (POC enables <10 second tracing)**
- [x] Talking Points used in conversation → **ACHIEVED**

#### Operating Scale (Current, February 2026)
- [x] 100+ sources extracted (117 actual)
- [x] 3-session synthesis workflow operational
- [x] Skills system built and tested
- [x] POC web application production-ready
- [x] Citation Contract with automated validation
- [x] Language Asset Library workflow designed (awaiting first production run)

#### Next Milestones
- [ ] First Language Asset Library population (LA_YYYY-MM-DD.md)
- [ ] Monthly Synthesis workflow operationalized
- [ ] Quarterly Synthesis (first run)
- [ ] External user testing (share CRIS with 3-5 people)
- [ ] POC deployment guide (reproducible setup)
```

---

### 4.2 VALUE PROPOSITION UPDATES (For External Communication)

**Current PRD Problem Statement:**
> "Research and learning are fragmented. You read reports, watch videos, consume articles—but insights scatter across notes, bookmarks, and memory. When it's time to speak confidently about a topic, you can't trace why you believe what you believe or where the evidence came from."

**Recommended Update:**

```markdown
## The Problem

**Research at scale becomes unmanageable.** You're processing 40-60 sources per week across reports, transcripts, and articles. Insights pile up. Citations blur. When you need to speak confidently—in a meeting, interview, or client conversation—you can't quickly trace:
- **Why you believe what you believe**
- **Where the evidence came from**
- **How your thinking has evolved**
- **What language will land with your audience**

Traditional tools fail at this scale:
- **Note-taking apps** create disconnected fragments
- **Bookmarks** bury sources you'll never revisit
- **Memory** fades after 100+ sources

**You need a research system that:**
1. **Captures insights without friction** (automated extraction)
2. **Synthesizes across sources** (not just summarizes within)
3. **Traces any claim to source in seconds** (verifiable lineage)
4. **Surfaces conversation-ready language** (frameworks, analogies, provocations)

---

## What CRIS Does

**CRIS is a file-based research observatory for knowledge workers operating at scale.**

### Core Capabilities

#### 1. Structured Capture
- Drop sources (PDFs, transcripts, articles) into a folder
- Automated extraction creates atomic data points with verbatim anchors
- 117 sources processed in 6 weeks (40-60/week sustained)

#### 2. Multi-Layer Synthesis
- **3-session synthesis workflow** prevents shallow analysis
- Parallel sub-agents analyze each source independently
- Cross-source synthesis by topic/tag (not just chronology)
- Weekly Learnings → Active Ideas → Current Synthesis → Talking Points

#### 3. Linguistic Asset Mining
- Extract frameworks, analogies, provocations from sources
- Organize by source (not category) for easy citation
- 7 categories: frameworks, analogies, terms, comparisons, provocations, anti-patterns, numerical rules
- Conversation-ready language that communicates insights effectively

#### 4. Verifiable Lineage
- Every claim traces to extraction → data point → source (with page/timestamp)
- Machine-parseable citation format enables <10 second verification
- Web UI provides inline citation context and lineage tracing

#### 5. Research Observatory (Web UI)
- **Pulse View:** Current position with key takeaways and trends
- **Ideas View:** Browse Active Ideas with evolution tracking
- **Talking Points View:** Conversation-ready deliverables
- **Explore View:** Full-corpus browser with citation tracing

---

## Why CRIS Works at Scale

### Built for Volume
- **Parallel processing:** 40-60 sub-agents analyze sources simultaneously
- **Progressive disclosure:** Load only what's needed (index files → detail files)
- **Session separation:** Deep analysis (Session 1) → Synthesis (Session 2) → Integration (Session 3)

### Quality by Design
- **Style Guide enforcement:** No em dashes, Oxford comma, direct voice
- **Data Normalization:** Every metric has population, source, timeframe
- **Citation Contract:** Machine-parseable format with automated validation
- **Prepublish gates:** Block publication if citations or lineage broken

### Communication-Focused
- **Language Assets:** Not just data points, but how to talk about them
- **Talking Points:** Conversation-ready with evidence inline
- **Current Synthesis:** Standalone snapshot of research position
- **Frameworks & Analogies:** Transferable across contexts

---

## Who Should Care

### Knowledge Workers at Scale
- Processing 20+ sources per week
- Need to synthesize across (not just within) sources
- Must speak confidently without re-reading everything

### Strategic Roles
- **AI Strategy Leads:** Track enterprise AI trends, vendor claims, adoption patterns
- **Product Strategists:** Connect market research to product positioning
- **Consultants:** Build reusable IP from client work
- **Researchers:** Maintain verifiable lineage for publications

### Teams Facing Scale Challenges
- Citations breaking as volume grows
- Synthesis getting shallower as sources increase
- Hard to find "that stat from that report"
- Spending hours prepping for conversations

---

## What Makes CRIS Different

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

## Operational Reality (February 2026)

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
- Extraction: 2-4 hours (40-60 sources)
- Session 1 (Deep Analysis): 45 min - 3 hours
- Session 2 (Write Learnings): 1-4 hours
- Session 3 (Integration): 1.5-4 hours
- **Total: 6-15 hours per week** (for 40-60 sources)

**Value Delivered:**
- <10 second claim-to-source tracing (vs. manual file digging)
- Cross-source patterns emerge (invisible in single-source summaries)
- Conversation-ready language (not just data dumps)
- Verifiable lineage (defend claims with confidence)
```

---

### 4.3 CONSTRAINTS & ASSUMPTIONS: Reality Check

**Current PRD:**
```markdown
### Assumptions
- You'll process sources 1-2x per week
- You'll synthesize weekly (flexible timing)
- You'll verify claims before high-stakes use
- You'll maintain tag hygiene monthly
```

**Recommended:**
```markdown
### Operating Assumptions (Based on 6 Weeks of Reality)

**Volume:**
- 40-60 sources per week (typical operating load)
- 100+ total extractions (after ~6 weeks)
- 3-session synthesis workflow (NOT single-session)

**Time Commitment:**
- Extraction: 2-4 hours per week
- Synthesis (3 sessions): 4-11 hours total
- Linguistic mining (optional): 45-60 minutes
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

**System Constraints:**
- **Context window:** 200K tokens (Claude Sonnet 4.5), but progressive disclosure keeps typical loads under 50K
- **Session limits:** 3 sessions mandatory for synthesis (single-session produces shallow output)
- **Parallel processing:** Up to 60 sub-agents spawned simultaneously (requires adequate system resources)
- **No persistent memory:** Each session starts fresh; index files provide continuity
```

---

## Part 5: Recommended PRD Outline (Updated)

### Suggested PRD Structure v4.0

```markdown
# CRIS: Product Requirements Document

**Collaborative Research & Insight System**

**Version:** 4.0
**Last Updated:** [DATE]
**Status:** Active - Operating at Scale

---

## 1. Executive Summary
- What CRIS is (one paragraph)
- Who it's for
- Current operating scale (117 sources, 40-60/week)
- Key value: Research observatory for knowledge workers at scale

## 2. Problem Statement
[UPDATED: Address scale explicitly, add "conversation-ready language" gap]

## 3. What CRIS Does
- Structured Capture (extraction workflow)
- Multi-Layer Synthesis (3-session architecture)
- Linguistic Asset Mining [NEW]
- Verifiable Lineage (machine-parseable citations)
- Research Observatory (web UI) [NEW]

## 4. Core Principles
[EXISTING 5 + NEW 4 = 9 total principles]
1. "When I Learned It" Organization
2. Compression Chain
3. Verifiable Lineage
4. Progressive Disclosure
5. Atomic Data Points
6. Session Separation Prevents Shallow Analysis [NEW]
7. Machine-Parseable Lineage is Infrastructure [NEW]
8. Quality Standards Are Built-In [NEW]
9. Language Assets Amplify Data Point Value [NEW]

## 5. User Stories
[EXISTING + ADD]
- As a knowledge worker, I want to process 40-60 sources/week without losing insights
- As a strategist, I want conversation-ready frameworks and analogies, not just data points
- As a researcher, I want to trace any claim to source in <10 seconds via web UI

## 6. Core Workflows
[REPLACE 5-phase with 3-session model + linguistic mining]
- Extraction Workflow (cris-extract)
- 3-Session Synthesis:
  - Session 1: cris-analyze (DP Relevance Maps)
  - Session 1.5: cris-linguistic-mining (Language Assets) [OPTIONAL]
  - Session 2: cris-write-learnings (Weekly Learnings)
  - Session 3: cris-integrate (Active Ideas + Current Synthesis + Talking Points)
- Monthly Synthesis (planned)
- Verification & Publishing (automated gates)

## 7. Deliverables & Outputs
[ADD Language Assets, update descriptions]
- Extractions
- DP Relevance Maps (intermediate)
- Language Assets [NEW]
- Weekly Learnings
- Active Ideas
- Current Synthesis
- Talking Points
- Monthly/Quarterly Synthesis

## 8. System Architecture
- File-based research system (folder structure)
- Web application (POC) [NEW]
- Critical infrastructure:
  - Skills system [NEW]
  - Citation Contract (machine-parseable) [NEW]
  - Extraction Tracker [NEW]
  - ADR system [NEW]

## 9. Scale & Constraints
[MAJOR UPDATE]
- Current operating scale (117 sources, 40-60/week)
- Why scale matters (workflow implications)
- Context window management (critical at this volume)
- Session separation (mandatory, not optional)
- Time investment (6-15 hours/week realistic)

## 10. Success Criteria
[UPDATE with actual achievements + new milestones]
- Month 1 targets (all exceeded)
- Current operating scale (achieved)
- Next milestones (Language Assets, Monthly Synthesis, external users)

## 11. Quality Standards
[NEW SECTION]
- Style Guide enforcement
- Data Normalization (Level 2 minimum)
- Citation Contract compliance
- Automated validation gates
- Prepublish lineage gate (blocking)

## 12. Value Proposition (For External Communication)
[NEW SECTION]
- Who should care
- What makes CRIS different (comparison table)
- Operational reality (time, scale, deliverables)

## 13. Future Considerations
[EXISTING, potentially add]
- Multi-user collaboration model
- API integration for source ingestion
- Mobile access (read-only)
- Export formats (PDF, presentation)

## 14. Reference
[UPDATE with new system files]
- Skills system (`_System/skills/README.md`)
- Citation Contract (`_System/Citation_Contract.md`)
- System Architecture Guide (`_System/SYSTEM_ARCHITECTURE_GUIDE.md`)
- Advanced Prompt Library (`_System/ADVANCED_PROMPT_LIBRARY.md`)
- ADR Index (`poc/decisions/ADR_INDEX.md`)
- POC README (`poc/README.md`)
```

---

## Part 6: Quick Reference - Key Changes Summary

### What Stayed the Same
✅ Core compression chain concept
✅ Atomic data points with verbatim anchors
✅ "When I learned it" organization
✅ Verifiable lineage as goal
✅ File-based system (not cloud/collaborative)

### What Changed Significantly
🔄 **Workflow:** 5-phase → 3-session architecture
🔄 **Scale:** 10 sources/month → 40-60 sources/week
🔄 **Sub-agents:** Suggested → Mandatory
🔄 **Progressive disclosure:** Nice-to-have → Critical requirement
🔄 **Citation format:** Principle → Strict technical contract

### What's Completely New
✨ **Language Asset Library** (7 categories, source-organized)
✨ **Skills system** (5 executable workflows with validation)
✨ **Web application** (POC with 4 views, evidence tracing)
✨ **ADR system** (13 architecture decisions documented)
✨ **Automated validation gates** (citation, style, lineage)
✨ **DP Relevance Maps** (intermediate files prevent shallow synthesis)
✨ **Extraction tracker JSON** (critical infrastructure)

---

## Recommendations

### Immediate (This Week)
1. **Update PRD to v4.0** using recommended outline above
2. **Add "Quick Start for External Users"** section (5-minute CRIS overview)
3. **Create "Why CRIS?" one-pager** (value proposition for sharing)

### Short-Term (Next 2 Weeks)
4. **Test Language Asset Library** with first production run
5. **Create POC deployment guide** (reproducible setup for others)
6. **Document "Scale Journey"** (what we learned going from 10 → 117 sources)

### Medium-Term (Next Month)
7. **External user testing** (3-5 people trying CRIS)
8. **Monthly Synthesis workflow** (operationalize, not just plan)
9. **Quarterly Synthesis** (first run)

---

## Appendix: Files Referenced

**PRD:**
- `/CRIS_Research_System/CRIS_PRD.md` (v3.1, Feb 5, 2026)

**System Files:**
- `/CRIS_Research_System/_System/SYSTEM_ARCHITECTURE_GUIDE.md`
- `/CRIS_Research_System/_System/ADVANCED_PROMPT_LIBRARY.md`
- `/CRIS_Research_System/_System/Citation_Contract.md`
- `/CRIS_Research_System/_System/skills/README.md`
- `/CRIS_Research_System/_System/skills/cris-linguistic-mining/SKILL.md`

**POC:**
- `/CRIS_Research_System/poc/README.md`
- `/CRIS_Research_System/poc/EVIDENCE_TRACE_SYSTEM.md`
- `/CRIS_Research_System/poc/decisions/ADR_INDEX.md`
- `/CRIS_Research_System/poc/decisions/ADR-0009-phased-weekly-synthesis-with-subagents.md`

**Scale Evidence:**
- `/CRIS_Research_System/_System/_extraction_tracker.json` (117 sources)
- `/CRIS_Research_System/02_Extractions/` (117 .md files)

---

**END OF ANALYSIS**
