# Workflow: Versioning & File Management

How CRIS files are named, versioned, archived, and moved. Follow these rules to maintain clean lineage.

## Core Principle

**Date by production, not by coverage period.** Every CRIS output file is dated by *when it was produced*, not the time period it covers. The coverage period lives inside the document header, not in the filename.

---

## Naming Conventions

### Weekly Learnings

**Active file:** `WL_YYYY-MM-DD.md` (date = when the synthesis was written)

**Location:** `03_Weekly_Learnings/YYYY-QN/`

**Archive:** `03_Weekly_Learnings/YYYY-QN/archive/`

**Example timeline:**
- Feb 4: First synthesis of the week → `WL_2026-02-04.md`
- Feb 7: Updated synthesis with new sources → `WL_2026-02-07.md`
- The Feb 4 version moves to `archive/WL_2026-02-04.md`

**Inside the document**, the header always states the coverage period:
```
# Weekly Learnings: February 1-7, 2026
```

### Talking Points

**Active file:** `TP_YYYY-MM-DD.md` (date = when produced)

**Location:** `09_Deliverables/Talking_Points/`

**Archive:** `09_Deliverables/Talking_Points/archive/`

**Rule:** Only one "active" Talking Points file exists at a time. Previous versions are archived with their original production date.

### Current Synthesis

**Active file:** `Current_Synthesis.md` (no date in filename — always one active version)

**Location:** `06_Current_Understanding/`

**Archive:** `06_Current_Understanding/archive/Current_Synthesis_YYYY-MM-DD.md`

**Archive naming rule:** Use the `Last Updated` date from *inside the document being archived*, not today's date. This preserves when that version was actually current.

**Example:**
- Current Synthesis says "Last Updated: 2026-02-05"
- Before overwriting, archive it as `archive/Current_Synthesis_2026-02-05.md`
- Write new version, which says "Last Updated: 2026-02-07"

### Active Ideas

**Active file:** `Active_Ideas.md` (no date in filename — always one active version)

**Location:** `06_Current_Understanding/`

**Archive:** `06_Current_Understanding/archive/Active_Ideas_YYYY-MM-DD.md`

**Archive naming rule:** Same as Current Synthesis — use the `Last Updated` date from the document header.

### User Observations

**Active file:** `User_Observations.md` (no date in filename)

**Location:** `06_Current_Understanding/`

**Archive:** Not typically archived unless a major restructure occurs. Observations accumulate; they don't get replaced.

### Extractions

**Active file:** `[Source_Name]_YYYY-MM-DD.md` (date = when extracted)

**Location:** `02_Extractions/YYYY-MM/`

**Archive:** Extractions are permanent and don't get archived or moved. If re-extracted, the old version moves to `02_Extractions/YYYY-MM/archive/` and the new one takes the same filename with today's extraction date.

### Index/Header Files

**Files:** `_Extraction_Index.md`, `_Weekly_Header.md`, `_Index.md`

**Archive:** These are never archived. They are always overwritten to reflect current state.

---

## The Update Workflow (Step by Step)

When creating a new Weekly Synthesis cycle:

### Step 1: Archive Previous Versions

Before writing any new content, move superseded files:

| File | Action | Archive Location |
|------|--------|-----------------|
| Current Weekly Learnings | Move to archive | `03_Weekly_Learnings/YYYY-QN/archive/WL_YYYY-MM-DD.md` |
| Current Talking Points | Move to archive | `09_Deliverables/Talking_Points/archive/TP_YYYY-MM-DD.md` |
| Current Synthesis | Copy to archive | `06_Current_Understanding/archive/Current_Synthesis_YYYY-MM-DD.md` |
| Active Ideas | Copy to archive (if major changes) | `06_Current_Understanding/archive/Active_Ideas_YYYY-MM-DD.md` |

**Archive naming uses the `Last Updated` date from inside the document being archived.**

### Step 2: Write New Files

Create the new deliverables with today's production date:

- `WL_YYYY-MM-DD.md` (today's date)
- `TP_YYYY-MM-DD.md` (today's date)
- Overwrite `Current_Synthesis.md` (update `Last Updated` inside)
- Overwrite `Active_Ideas.md` (update `Last Updated` inside)

### Step 3: Update Header/Index Files

Always update these to reflect new state:

- `_Weekly_Header.md` — new week entry, updated counts
- `_Index.md` — updated idea counts, observation counts, dates
- `_Extraction_Index.md` — only if new extractions were processed

### Step 4: Verify Consistency

Cross-check these counts across all header files:

| Check | Files That Must Agree |
|-------|----------------------|
| Active Ideas count | `Active_Ideas.md`, `_Index.md`, `_Weekly_Header.md`, `Current_Synthesis.md` |
| User Observations count | `User_Observations.md`, `_Index.md`, `Current_Synthesis.md` |
| Latest synthesis date | `_Weekly_Header.md`, `_Index.md` |
| Total extractions count | `_Extraction_Index.md`, latest Weekly Learnings |

---

## Archive Folder Structure

**Weekly Learnings archives live inside each quarter folder**, not at the root `03_Weekly_Learnings/` level. This keeps each quarter self-contained — you can browse `2026-Q1/` and see both current learnings and their full evolution history without digging through a shared archive mixing files from multiple quarters.

```
03_Weekly_Learnings/
  _Weekly_Header.md            ← Always current (no archive)
  2026-Q1/
    WL_2026-02-07.md           ← Current (most recent)
    archive/
      WL_2026-02-04.md         ← Previous version
  2026-Q2/                     ← Future quarter
    archive/                   ← Its own archive

06_Current_Understanding/
  Current_Synthesis.md         ← Always current
  Active_Ideas.md              ← Always current
  User_Observations.md         ← Accumulates (no archive)
  _Index.md                    ← Always current
  archive/
    Current_Synthesis_2026-02-05.md
    Active_Ideas_2026-02-04.md

09_Deliverables/
  Talking_Points/
    TP_2026-02-07.md           ← Current (most recent)
    archive/
      TP_2026-02-04.md         ← Previous version
```

---

## Rules Summary

1. **Production date in filename, coverage period in header** — never the reverse
2. **Archive before overwriting** — always preserve the previous version
3. **Archive date = document's Last Updated date** — not today's date
4. **One active version** — no `v2`, `v3` suffixes; archive superseded files instead
5. **Header/index files are always overwritten** — they reflect current state, never archived
6. **Verify count consistency** — after every update, cross-check ideas/observations/extractions counts across all header files
7. **No orphan files** — every active file should be referenced in its corresponding header/index
