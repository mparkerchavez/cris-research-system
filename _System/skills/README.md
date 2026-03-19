# CRIS Skills Guide

This folder contains executable skills for the CRIS Research System. Skills are invoked by referencing their path.

---

## Three-Session Synthesis Workflow

The CRIS synthesis workflow is split across **three separate sessions** to prevent shallow analysis. Each session builds on the previous one.

### **Session 1: cris-analyze** (Deep Mining + DP Relevance Maps)

**Purpose:** Spawn parallel sub-agents to analyze each extraction source, producing DP Relevance Maps

**When to use:** Start of weekly synthesis when you have new extractions

**Command:**
```
Read and follow: _System/skills/cris-analyze/SKILL.md
```

**What it does:**
1. Identifies unsynthesized extractions
2. Spawns parallel sub-agents (one per source)
3. Each agent creates a DP Relevance Map
4. Saves maps to `_System/working/relevance_maps/`

**Output:** DP Relevance Maps ready for Session 2

**Time:** 45min - 3 hours depending on source count

---

### **Session 2: cris-write-learnings** (Weekly Learnings Document)

**Purpose:** Synthesize DP Relevance Maps into Weekly Learnings following CRIS style standards

**When to use:** After Session 1 completes (DP Relevance Maps exist)

**Command:**
```
Read and follow: _System/skills/cris-write-learnings/SKILL.md
```

**What it does:**
1. Validates DP Relevance Maps exist
2. Synthesizes ACROSS sources by tag
3. Documents Active Idea evolution
4. Applies Style Guide + Citation Contract
5. Saves Weekly Learnings document

**Output:** `03_Weekly_Learnings/YYYY-QX/WL_YYYY-MM-DD.md`

**Time:** 1 - 4 hours depending on synthesis depth

---

### **Session 3: cris-integrate** (Active Ideas + Current Synthesis + Talking Points)

**Purpose:** Integrate Weekly Learnings into strategic documents

**When to use:** After Session 2 completes (Weekly Learnings exists)

**Command:**
```
Read and follow: _System/skills/cris-integrate/SKILL.md
```

**What it does:**
1. Updates Active Ideas with new evidence
2. Archives old Current Synthesis, writes new one
3. Generates new Talking Points
4. Updates system files

**Outputs:**
- Active Ideas (updated)
- Current Synthesis (refreshed)
- Talking Points (new)

**Time:** 1.5 - 4 hours depending on updates

---

## Alternative: Extraction Skill

### **cris-extract** (Automated Extraction)

**Purpose:** Extract data points from raw input files (PDFs, transcripts, articles)

**When to use:** When you have new source files in `01_Raw_Inputs/`

**Command:**
```
Read and follow: _System/skills/cris-extract/SKILL.md
```

**What it does:**
1. Discovers pending files in extraction tracker
2. Spawns parallel extraction sub-agents
3. Validates filenames (CRITICAL: enforces 2-underscore convention)
4. Saves extractions to `02_Extractions/`
5. Updates tracker and index

**Output:** Extraction files ready for analysis

**Time:** Varies by file count and size

---

## Typical Weekly Flow

```
┌─────────────────────────────────────────┐
│ Monday: New sources arrive              │
│ ├─> Run: cris-extract                   │
│ └─> Output: Extractions in 02_Extractions/ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Tuesday/Wednesday: Deep Analysis        │
│ ├─> Run: cris-analyze (Session 1)       │
│ └─> Output: DP Relevance Maps           │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Thursday: Write Synthesis               │
│ ├─> Run: cris-write-learnings (Session 2)│
│ └─> Output: Weekly Learnings            │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Friday: Strategic Integration           │
│ ├─> Run: cris-integrate (Session 3)     │
│ └─> Output: Active Ideas, Synthesis, TPs│
└─────────────────────────────────────────┘
```

**Light Week:** Can collapse Session 1+2 into one session if only 3-5 sources
**Heavy Week:** Keep all three sessions separate for depth

---

## Invoking Skills

Skills are NOT slash commands. They're markdown documents with instructions.

**To use a skill:**
```
Read and follow: _System/skills/[skill-name]/SKILL.md
```

Claude will read the skill file and execute the workflow.

---

## Key Principles

1. **Session Separation Prevents Shallow Analysis**
   - Session 1 forces deep engagement with each source
   - Session 2 synthesizes across sources by tag
   - Session 3 integrates into strategic documents

2. **DP Relevance Maps Are Critical**
   - They're the intermediate file that prevents coverage degradation
   - Session 2 reads Relevance Maps, NOT raw extractions
   - After Session 3, maps can be archived/deleted

3. **Dependencies Are Enforced**
   - Session 2 validates Session 1 outputs exist
   - Session 3 validates Session 2 outputs exist
   - Skills will ERROR if prerequisites missing

4. **Quality Standards Are Built In**
   - Style Guide compliance checked
   - Citation Contract enforced
   - Data Normalization validated
   - Filename validation strict

---

## Troubleshooting

**"No DP Relevance Maps found"**
- You need to run Session 1 (cris-analyze) first

**"No Weekly Learnings found"**
- You need to run Session 2 (cris-write-learnings) first

**"Filename validation failed"**
- Check extraction filename: Must be `SourceName_Slug_YYYY-MM-DD.md`
- EXACTLY 2 underscores before date
- Use PascalCase (no underscores within Source or Slug)

**"Coverage percentages very low (<40%)"**
- May indicate sources outside research focus
- Consider whether Active Ideas need expansion

**"Synthesis feels shallow"**
- Make sure you're using DP Relevance Maps, not raw extractions
- Look for convergence ACROSS sources
- Check that Session 1 sub-agents went deep (not just summarizing)

---

## Skill Locations

```
_System/skills/
├── cris-extract/SKILL.md          # Extraction from raw inputs
├── cris-analyze/SKILL.md          # Session 1: Deep mining
├── cris-write-learnings/SKILL.md  # Session 2: Weekly Learnings
├── cris-integrate/SKILL.md        # Session 3: Strategic docs
├── cris-monthly-map/SKILL.md      # Monthly Session 1: Analysis Mapping
├── cris-monthly-write/SKILL.md    # Monthly Session 2: Synthesis + Talking Points
├── cris-snapshot/SKILL.md         # HTML snapshot for sharing
└── README.md                       # This file
```

---

---

## Monthly Synthesis Workflow (End of Month)

Run after all weekly synthesis cycles for the month are complete.

```
┌─────────────────────────────────────────────┐
│ End of Month: All weekly cycles complete    │
│ ├─> Run: cris-monthly-map (Session 1)       │
│ └─> Output: Monthly Analysis Map           │
└─────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Write Monthly Deliverables (Session 2)      │
│ ├─> Run: cris-monthly-write                 │
│ └─> Output: MS_YYYY-MM.md + MT_YYYY-MM.md  │
└─────────────────────────────────────────────┘
```

**Session 1 (cris-monthly-map):**
- Reads all canonical Weekly Learnings for the month
- Produces Monthly Analysis Map with theme trajectories, idea evolution, open thread assessment, evidence stats, and tag evolution
- Saves to `_System/working/monthly/MA_YYYY-MM.md`

**Session 2 (cris-monthly-write):**
- Uses Monthly Analysis Map as primary input
- Writes Monthly Synthesis (MS_YYYY-MM.md) — strategic narrative, higher altitude than weekly
- Writes Monthly Talking Points (MT_YYYY-MM.md) — coexists alongside weekly TPs
- Updates `04_Monthly_Synthesis/YYYY/_Index.md`

**Key distinction from weekly:** Monthly Synthesis cites Weekly Learnings files (not extraction DPs). It operates at the compression chain layer above weekly.

---

## Next Steps

If you're starting a new synthesis cycle:
1. Check for pending extractions: `cat _extraction_tracker.json`
2. If pending files exist: Run `cris-extract`
3. Start Session 1: Run `cris-analyze`
4. Continue through Session 2 and 3

If you're at the end of a month:
1. Confirm all weekly cycles are complete (check `_Weekly_Header.md`)
2. Run `cris-monthly-map` (Session 1)
3. Run `cris-monthly-write` (Session 2)

If you have questions about the workflow, refer to:
- `_System/Workflows/Weekly_Synthesis.md` - Full workflow documentation
- `CLAUDE.md` - System overview and quick start guide
