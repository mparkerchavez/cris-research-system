# CRIS Monthly Map Skill (Session 1: Monthly Analysis Mapping)

**Purpose:** Deep reading of all canonical Weekly Learnings from the target month, producing a Monthly Analysis Map that Session 2 uses for writing the Monthly Synthesis and Monthly Talking Points.

**When to use:** Start of the Monthly Synthesis workflow. Run this at the end of a calendar month after all weekly synthesis cycles are complete.

**Path convention:** `[CRIS_ROOT]` refers to the root of the CRIS Research System workspace. Resolve this to the actual mounted path at runtime (e.g., `/sessions/[session-name]/mnt/CRIS_Research_System`). Use `find` or `ls` to locate the workspace if the path is unknown.

**Prerequisite:** All weekly synthesis cycles for the month must be complete (all 3 sessions). Check `_Weekly_Header.md` before starting.

---

## Workflow Overview

This skill produces the Monthly Analysis Map — a structured intermediate document that prevents shallow synthesis coverage when Session 2 writes the final output.

**Why two sessions?** Monthly Synthesis draws from 4-6 Weekly Learnings documents, 18+ Active Ideas, 14+ Open Threads, and 13+ User Observations. Separating analysis from writing ensures Session 2 synthesizes from pre-digested evidence rather than racing through raw WL files under context pressure.

**Key Principle:** This session reads and maps. It does NOT write synthesis prose. Session 2 writes.

---

## Phase 1: Prerequisites Validation

### Step 1: Load Status Context

```bash
# Check synthesis completion status
cat [CRIS_ROOT]/03_Weekly_Learnings/_Weekly_Header.md

# Check Active Ideas count and status
cat [CRIS_ROOT]/06_Current_Understanding/_Index.md

# Check extraction index for evidence base stats
cat [CRIS_ROOT]/02_Extractions/_Extraction_Index.md
```

**Validation before proceeding:**
- ✅ All weekly synthesis cycles for target month show "SYNTHESIS COMPLETE (All 3 sessions)"
- ✅ _Weekly_Header.md is current (updated within last 7 days)
- ❌ If any weekly cycle incomplete: ERROR — "Monthly Synthesis requires all weekly cycles to be complete. Check _Weekly_Header.md and finish incomplete cycles first."

### Step 2: Confirm Month and Scope

**Ask user:**
```
Ready to run Monthly Mapping for [MONTH YYYY].

Canonical Weekly Learnings I'll map (non-archived):
- [List WL files from 03_Weekly_Learnings/YYYY-QN/ excluding archive/]

Total evidence base: approximately [X] sources across [Y] weeks.

Confirm this scope, or specify a different month?
```

**Canonical file rule:** Only use WL files in the active `YYYY-QN/` directory. Do NOT load files from `YYYY-QN/archive/` — these were superseded versions.

---

## Phase 2: Load Canonical Weekly Learnings

### Step 3: Identify and Load WL Files

```bash
# List all canonical (non-archived) WL files for the month
ls [CRIS_ROOT]/03_Weekly_Learnings/YYYY-Q*/WL_YYYY-MM-*.md

# Identify which belong to target month
# Load each one sequentially
cat [CRIS_ROOT]/03_Weekly_Learnings/YYYY-QN/WL_YYYY-MM-DD.md
```

**Load order:** Chronologically (earliest to latest). This preserves the narrative arc of how thinking evolved across the month.

**For each WL file, extract and stage:**
- Publication date and source count
- Tag-based sections used (which themes were synthesized)
- All "Updates Made to Current Understanding" entries
- All "Open Threads" listed
- All "Personal Perspective" / "User Observations Integrated" content
- Key data points (Level 2+ normalized statistics)
- Any new Active Ideas proposed or elevated

### Step 4: Load Supporting Context

```bash
# Load Active Ideas (current end-of-month state)
cat [CRIS_ROOT]/06_Current_Understanding/Active_Ideas.md

# Load User Observations (for practitioner lens)
cat [CRIS_ROOT]/06_Current_Understanding/User_Observations.md

# Load Tags for tag evolution analysis
cat [CRIS_ROOT]/Tags.md
```

---

## Phase 3: Build Monthly Analysis Map

### Step 5: Theme Trajectory Analysis

**Task:** For each major theme that appeared in 2+ WL files, document how it evolved week by week.

**Output format per theme:**
```
### Theme: [Theme Name] (#tag)

| Week | WL File | Status | Key Development |
|------|---------|--------|-----------------|
| Feb 9  | WL_2026-02-09.md | Introduced | [How it first appeared] |
| Feb 12 | WL_2026-02-12.md | Deepened | [What was added] |
| Feb 22 | WL_2026-02-22.md | Pivoted | [How thinking shifted] |
| Feb 28 | WL_2026-02-28.md | Crystallized | [Final state this month] |

**Net Movement:** [Growing / Peaking / Stabilizing / Fading]
**Key Evidence:** [The single strongest data point for this theme, with citation]
**Synthesis Candidate Headline:** [Draft headline for monthly narrative]
```

**Identify:**
- Themes that grew in importance (appeared more, cited more)
- Themes that crystallized (moved from "emerging" to "established" in the discourse)
- Themes that faded or were subsumed into larger ideas
- Themes that created new tensions with existing ideas

### Step 6: Idea Evolution Summary

**Task:** For each Active Idea, document the monthly arc using Evolution Log entries from Active_Ideas.md.

**Output format per idea:**
```
### Idea [N]: [Idea Name]

**Start-of-month status:** [Status from earliest WL reference]
**End-of-month status:** [Status from Active_Ideas.md]
**Confidence movement:** [e.g., Medium → High, or unchanged]
**Evolution this month:**
- [YYYY-MM-DD]: [Evolution Log entry summary]
- [YYYY-MM-DD]: [Evolution Log entry summary]
**Net assessment:** [Strengthened / Refined / Expanded / Challenged / Unchanged]
**Notable evidence added:** [1-2 key DPs that most advanced this idea]
```

**Identify for Session 2 narrative:**
- Ideas that made the most significant moves this month
- Ideas that were newly added this month
- Ideas that held steady (strong confirmation)
- Ideas that experienced notable tension or challenge

### Step 7: Open Thread Trajectories

**Task:** For each Open Thread from the latest _Weekly_Header.md, assess how it developed across the month.

**Output format per thread:**
```
### Thread: [Thread Name]

**First appeared:** WL_YYYY-MM-DD.md
**Status at month end:** [Deepened / Resolved / Stalled / Elevated to Active Idea / Carried Forward]
**Week-by-week:** [Brief trajectory]
**Carry forward to next month?** [Yes / No / Resolved]
```

**Classify threads into:**
- Resolved (answered or absorbed into Active Ideas)
- Deepened (grew in complexity and evidence)
- Stalled (little movement, still open)
- New threads that emerged this month

### Step 8: Evidence Base Statistics

**Task:** Compile the month's evidence base snapshot.

```
## Monthly Evidence Base

| Metric | Value | Notes |
|--------|-------|-------|
| Weekly Learnings produced | [X] | [Date range] |
| Total sources synthesized | [Y] | Across all WL files |
| Estimated DPs in evidence base | [Z] | Approximate from WL headers |
| Active Ideas at month end | [N] | By status breakdown |
| Open Threads carried forward | [M] | From latest _Weekly_Header.md |
| User Observations (total) | [T] | From User_Observations.md count |
| User Observations invoked in WLs | [U] | Count reinforced/added this month |
| Established Tags | [E] | From Tags.md |
| Emerging Tags | [R] | From Tags.md |
```

### Step 9: Tag Evolution Documentation

**Task:** Identify what changed in the tag vocabulary this month.

**Review Tags.md for:**
- Tags promoted from Emerging to Established during the month
- New tags that emerged during the month (check WL "Updates to Tags" sections)
- Tags that saw unusually high activity (from _Weekly_Header.md tag activity tables)

**Output format:**
```
## Tag Evolution This Month

**Promoted to Established:**
- #[tag-name]: Promoted [date], [reason]

**Newly Emerged:**
- #[tag-name]: First appeared [WL file], [context]

**Highest Activity (Top 5):**
1. #[tag] — [DP count range] DPs across month
2. ...
```

### Step 10: User Observations Contribution

**Task:** Document which User Observations shaped this month's synthesis, without re-reading User_Observations.md in full.

**Pull from WL files:** Locate "Personal Perspective" and "Personal Observations Integrated" sections in each WL file.

**Output format:**
```
## User Observations Contribution This Month

**New observations added:** [X] (Obs [N]: [Title], Obs [N]: [Title])
**Existing observations reinforced:** [Y]
**Most-referenced observations:** [Obs numbers and titles that appeared most]
**Practitioner themes that shaped synthesis:** [2-3 sentence narrative on how Maicol's perspective influenced the month's framing]
```

---

## Phase 4: Synthesis Candidate Themes

### Step 11: Identify Monthly Narrative Threads

**Task:** Based on the full mapping above, identify 4-6 overarching themes that should organize the Monthly Synthesis narrative in Session 2.

**Criteria for monthly narrative themes:**
- Appeared in 3+ Weekly Learnings (persistence)
- Showed meaningful evolution over the month (not static)
- Have strong evidence (multiple sources, normalized data)
- Have strategic relevance for Maicol's professional positioning

**Output format:**
```
## Synthesis Candidate Themes for Session 2

Ranked by significance (for narrative ordering):

1. **[Theme Name]** — [1-2 sentence description of why this dominates the monthly narrative]
   - Appeared in: WL_02-09, WL_02-12, WL_02-22, WL_02-28
   - Evidence strength: High (X sources, key stat: [normalized stat])
   - Suggested monthly headline: "[Draft headline]"

2. **[Theme Name]** — [Description]
   ...
```

---

## Phase 5: Save Monthly Analysis Map

### Step 12: Compile and Save Map

**Save the complete Monthly Analysis Map:**

```bash
# Save to working directory
# File: [CRIS_ROOT]/_System/working/monthly/MA_YYYY-MM.md
```

**Map structure:**
```markdown
# Monthly Analysis Map: [Month YYYY]
**Produced:** [YYYY-MM-DD]
**Target Monthly Synthesis:** MS_YYYY-MM.md
**Canonical WL Files Mapped:** [List]

---

## 1. Theme Trajectory Analysis
[Step 5 output]

---

## 2. Idea Evolution Summary
[Step 6 output]

---

## 3. Open Thread Trajectories
[Step 7 output]

---

## 4. Evidence Base Statistics
[Step 8 output]

---

## 5. Tag Evolution
[Step 9 output]

---

## 6. User Observations Contribution
[Step 10 output]

---

## 7. Synthesis Candidate Themes
[Step 11 output — this is the primary input for Session 2 narrative ordering]

---

## 8. Session 2 Recommended Inputs
- Load: _System/working/monthly/MA_YYYY-MM.md (this file)
- Load: 06_Current_Understanding/Current_Synthesis.md (framing reference)
- Load: 06_Current_Understanding/User_Observations.md (practitioner lens)
- Load: 06_Current_Understanding/Active_Ideas.md (current status)
- Load: _System/Style_Guide.md
- Load: _System/Data_Point_Normalization.md
- Load: _System/Citation_Contract.md
```

---

## Phase 6: Completion Report

### Step 13: Report to User

```
✅ MONTHLY ANALYSIS MAP COMPLETE

Month: [MONTH YYYY]
Saved: _System/working/monthly/MA_YYYY-MM.md

WHAT WAS MAPPED:
- Weekly Learnings: [X] files ([date range])
- Active Ideas: [Y] ideas tracked across month
- Open Threads: [Z] threads assessed
- Evidence base: ~[N] sources, ~[M] DPs
- Synthesis candidate themes: [T] identified

TOP THEMES FOR MONTHLY NARRATIVE:
1. [Theme 1 name] — [One-liner]
2. [Theme 2 name] — [One-liner]
3. [Theme 3 name] — [One-liner]
...

NEXT STEP:
Run Session 2 to write the Monthly Synthesis and Monthly Talking Points:
  Read and follow: _System/skills/cris-monthly-write/SKILL.md
```

---

## Validation Checks

**Before saving map:**
- ✅ All canonical WL files for the month loaded and mapped
- ✅ All Active Ideas assessed (not just the "top" ones)
- ✅ All Open Threads from _Weekly_Header.md accounted for
- ✅ Evidence base statistics are consistent with WL headers
- ✅ At least 4 Synthesis Candidate Themes identified with evidence support
- ✅ Monthly Analysis Map saved to _System/working/monthly/

---

## Time Estimates

- Light month (3-4 WL files, 10-14 ideas): 45-60 minutes
- Normal month (4-6 WL files, 14-18 ideas): 60-90 minutes
- Heavy month (6+ WL files, 18+ ideas, significant evolution): 90-120 minutes

---

## Troubleshooting

**"Multiple WL files on same date"**
- Check for mid-week vs. end-of-week files; use the end-of-week (final) version
- If unclear, check inside each file for "Status:" marker

**"Active Ideas don't match Weekly Learnings count"**
- WL files may reference ideas by working names; cross-reference with Active_Ideas.md numbering
- Use Evolution Log dates to confirm which WL cycle updated each idea

**"Open threads are inconsistent across WL files"**
- Use the LATEST _Weekly_Header.md as the authoritative thread list
- WL files may show earlier versions; the header file is the canonical source

**"Theme appears in only one WL file"**
- Note it as an "emerging theme" in the map but do not elevate to Synthesis Candidate
- Flag for Session 2 to include as a brief mention, not a major section
