# CRIS Research System

**What this is:** Personal research system for tracking AI trends, extracting insights from sources, and synthesizing into talking points for professional positioning.

**Owner:** Maicol Parker-Chavez
**Focus:** AI strategy, adoption, enterprise transformation, agentic workflows

---

## Core Principles

### File Naming Convention (CRITICAL)
- **Format:** `SourceName_DescriptiveSlug_YYYY-MM-DD.md`
- **EXACTLY 2 underscores** before date
- **PascalCase** within Source and Slug (NO internal underscores)
- ✅ CORRECT: `FinancialTimes_MustafaSuleymanAI_2026-02-13.md`
- ❌ WRONG: `Financial_Times_Mustafa_Suleyman_AI_2026-02-13.md`

### Progressive Disclosure
- Load index/header files FIRST
- Only drill into detail files when needed
- Don't read all extractions unless necessary

### Quality Standards
- **Style Guide:** No em dashes, Oxford comma, direct voice
- **Data Normalization:** Level 2 minimum (population + metric + source + timeframe)
- **Citations:** All bracket citations need metadata comments

---

## Key Files

### System Files (Read these first)
- `_System/ADVANCED_PROMPT_LIBRARY.md` - All operation prompts (extraction, synthesis, etc.)
- `_System/SYSTEM_ARCHITECTURE_GUIDE.md` - File purposes and structure
- `_System/Style_Guide.md` - Writing standards
- `_System/Data_Point_Normalization.md` - Metric presentation rules
- `_System/Citation_Contract.md` - Citation format

### Operational Files
- `_System/_extraction_tracker.json` - Tracks which files have been extracted
- `02_Extractions/_Extraction_Index.md` - All extraction metadata
- `03_Weekly_Learnings/_Weekly_Header.md` - Recent synthesis status
- `06_Current_Understanding/Active_Ideas.md` - Current research positions
- `Tags.md` - Tag vocabulary

---

## Common Operations

### Quick Start (95% of use cases):

**For Extraction:**
```
Read and follow: _System/skills/cris-extract/SKILL.md
```

**For Weekly Synthesis (Three-Session Architecture):**

**Session 1 - Deep Analysis:**
```
Read and follow: _System/skills/cris-analyze/SKILL.md
```

**Session 2 - Write Learnings:**
```
Read and follow: _System/skills/cris-write-learnings/SKILL.md
```

**Session 3 - Strategic Integration:**
```
Read and follow: _System/skills/cris-integrate/SKILL.md
```

**Check Status:**
```
What's the status of my CRIS research system?
```

### Before starting any operation:
- Check `_extraction_tracker.json` for pending files
- Check `_Weekly_Header.md` for synthesis status
- Load relevant system files based on operation type

---

## Workflow Notes

### Extraction
- **Default:** Use automated extraction (finds pending files, batches intelligently, spawns sub-agents)
- **Parallel processing:** Spawn Task tool agents (one per file) for batches
- **Naming validation:** Strict enforcement of 2-underscore convention

### Synthesis (Three-Session Architecture)
- **Session 1 (cris-analyze):** Spawn sub-agents for deep mining, create DP Relevance Maps
- **Linguistic Mining (optional, between S1 & S2):** Mine reusable linguistic elements (frameworks, analogies, terms, etc.) for Language Asset Library
- **Session 2 (cris-write-learnings):** Synthesize maps into Weekly Learnings document
- **Session 3 (cris-integrate):** Update Active Ideas, Current Synthesis, Talking Points (+ integrate linguistic assets if mining was run)
- **Critical:** Each session builds on previous; prevents shallow analysis
- **Flexibility:** Light week (1 session), Normal (2 sessions), Heavy (3 sessions), Full (3 sessions + linguistic mining)

### Quality Checks
- Run Style Guide self-check before finalizing synthesis
- Verify atomic DP format in extractions
- Check citation metadata comments

---

## Current State (as of Feb 2026)

**Active Ideas:** Check `06_Current_Understanding/Active_Ideas.md`
**Latest Synthesis:** Check `_Weekly_Header.md`
**Pending Extractions:** Check `_extraction_tracker.json`

---

## Important Reminders

- **Session context doesn't persist** - This file loads automatically but operation-specific context needs to be loaded per operation
- **Use the prompt library** - `_System/ADVANCED_PROMPT_LIBRARY.md` has production-ready prompts for all operations
- **Spawn sub-agents for parallel work** - Use Task tool for extraction and synthesis mining
- **Validate before finalizing** - Run quality checks on all synthesis outputs
- **Always cite sources** - Every bracket citation needs metadata comment per Citation Contract

---

## Architecture Overview

```
CRIS_Research_System/
├── 01_Raw_Inputs/          # Source materials (PDFs, transcripts, articles)
├── 02_Extractions/         # Atomic data points extracted from sources
├── 03_Weekly_Learnings/    # Weekly synthesis documents
├── 04_Monthly_Synthesis/   # Monthly summaries
├── 06_Current_Understanding/
│   ├── Active_Ideas.md     # Research positions with evidence
│   └── Current_Synthesis.md # Big-picture summary
├── 09_Deliverables/
│   ├── Talking_Points/     # Conversation-ready insights
│   └── Language_Assets/    # Reusable linguistic elements
│       ├── Language_Asset_Library.md  # Master library
│       ├── _weekly_additions/         # Weekly LA files (LA_YYYY-MM-DD.md)
│       └── _pending_updates/          # Session 3 integration instructions
├── _System/                # System files, workflows, templates
└── Tags.md                 # Tag vocabulary
```

---

## CRIS Skills (Executable Workflows)

The following skills are available for common CRIS operations:

### Extraction Skill
- **`cris-extract`** - Automated extraction workflow with parallel processing and filename validation
  - Location: `_System/skills/cris-extract/SKILL.md`

### Three-Session Synthesis Skills
- **`cris-analyze`** - Session 1: Deep mining producing DP Relevance Maps
  - Location: `_System/skills/cris-analyze/SKILL.md`

- **`cris-linguistic-mining`** - Between Session 1 & 2: Mine reusable linguistic elements (frameworks, analogies, terms, comparisons, provocations, anti-patterns, numerical rules) from weekly extractions
  - Location: `_System/skills/cris-linguistic-mining/SKILL.md`
  - Outputs: `LA_YYYY-MM-DD.md` (weekly additions) + update instructions for Session 3

- **`cris-write-learnings`** - Session 2: Synthesize into Weekly Learnings document
  - Location: `_System/skills/cris-write-learnings/SKILL.md`

- **`cris-integrate`** - Session 3: Update Active Ideas, Current Synthesis, Talking Points (+ integrate linguistic assets into master library)
  - Location: `_System/skills/cris-integrate/SKILL.md`

### Using Skills
To invoke a skill:
```
Read and follow: _System/skills/[skill-name]/SKILL.md
```

See `_System/skills/README.md` for detailed usage guide and workflow documentation.
