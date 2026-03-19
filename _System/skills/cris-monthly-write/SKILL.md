# CRIS Monthly Write Skill (Session 2: Monthly Synthesis + Monthly Talking Points)

**Purpose:** Use the Monthly Analysis Map from Session 1 to write the Monthly Synthesis document and Monthly Talking Points — two strategic deliverables that operate at a higher level than the weekly cycle.

**When to use:** After completing `cris-monthly-map` (Session 1). Do NOT run this session without the Monthly Analysis Map.

**Path convention:** `[CRIS_ROOT]` refers to the root of the CRIS Research System workspace. Resolve this to the actual mounted path at runtime.

---

## Workflow Overview

This skill implements the writing phase of the Monthly Synthesis:
- **Part A:** Write Monthly Synthesis document (MS_YYYY-MM.md)
- **Part B:** Write Monthly Talking Points (MT_YYYY-MM.md)
- **Part C:** Update system indexes and run quality gates

**Key Principle:** The Monthly Synthesis is NOT a compressed Weekly Learnings. It is a strategic narrative about how thinking evolved over the month. Cite Weekly Learnings files (not individual extraction DPs) as the evidentiary layer.

**Audience for Monthly Synthesis:** Future-self, strategic positioning, portfolio. Write at a higher altitude than weekly.

**Audience for Monthly Talking Points:** Conversations, interviews, consulting calls. Same voice as weekly Talking Points but drawing from the full month's evidence.

---

## Phase 1: Prerequisites Validation

### Step 1: Verify Session 1 Completed

```bash
# Check for Monthly Analysis Map
ls [CRIS_ROOT]/_System/working/monthly/MA_YYYY-MM.md

# Load the map
cat [CRIS_ROOT]/_System/working/monthly/MA_YYYY-MM.md
```

**Validation:**
- ✅ Monthly Analysis Map exists and contains all 7 sections
- ❌ If not found: ERROR — "Monthly Analysis Map not found. Run cris-monthly-map (Session 1) first."

### Step 2: Load Required Context

```bash
# Strategic framing reference (do not modify)
cat [CRIS_ROOT]/06_Current_Understanding/Current_Synthesis.md

# Practitioner lens (do not modify)
cat [CRIS_ROOT]/06_Current_Understanding/User_Observations.md

# Current idea status (do not modify)
cat [CRIS_ROOT]/06_Current_Understanding/Active_Ideas.md

# Quality standards
cat [CRIS_ROOT]/_System/Style_Guide.md
cat [CRIS_ROOT]/_System/Data_Point_Normalization.md
cat [CRIS_ROOT]/_System/Citation_Contract.md

# Previous monthly synthesis (for format reference, if one exists)
ls [CRIS_ROOT]/04_Monthly_Synthesis/
```

### Step 3: Confirm Dates and Outputs

**Ask user:**
```
Ready to write Monthly Synthesis for [MONTH YYYY].

Output files:
- 04_Monthly_Synthesis/YYYY/MS_YYYY-MM.md
- 09_Deliverables/Talking_Points/MT_YYYY-MM.md

The Monthly Talking Points will coexist alongside weekly TP files (not replace them).
Confirm, or adjust output paths?
```

---

## Part A: Write Monthly Synthesis Document

### Step 4: Open MS File and Write Header

**File:** `[CRIS_ROOT]/04_Monthly_Synthesis/YYYY/MS_YYYY-MM.md`

```markdown
# Monthly Synthesis: [Month YYYY]

**Produced:** [YYYY-MM-DD]
**Period:** [Start date] – [End date]
**Weekly Learnings Synthesized:** [X] files ([earliest WL date] – [latest WL date])
**Evidence Base:** [Y] sources, approximately [Z] data points
**Active Ideas:** [N] total ([breakdown: X Confirmed, Y Developing, Z New])
**Open Threads Carried Forward:** [M]

---
```

### Step 5: Write the Overview Section

**Guidance:** 3-4 paragraphs that answer "What characterized this month?" Synthesize from the Monthly Analysis Map's Synthesis Candidate Themes and net movement assessments.

**NOT a list of what happened. A narrative of how thinking shifted.**

```markdown
## Overview

[Paragraph 1: The dominant story of the month — what was the single most important shift or crystallization?]

[Paragraph 2: The secondary arc — what underlying dynamic drove multiple themes simultaneously?]

[Paragraph 3: The tension — what remained unresolved or grew more complex? What is the month's most important open question?]

[Paragraph 4 (optional): What this month means for the research program overall — framing for future months.]
```

**Citation format for Monthly Synthesis:** Reference WL files, not individual extraction DPs.
```markdown
This pattern first surfaced in early [Month] [WL_YYYY-MM-DD] and strengthened considerably by [WL_YYYY-MM-DD], when [description].
```
Do NOT use `[SourceName DP#]` citation format in Monthly Synthesis. The WL reference IS the citation.

**Quality check on Overview before continuing:**
- [ ] No em dashes (search and replace all)
- [ ] Every paragraph has a clear claim in the first sentence
- [ ] No hedging language ("may suggest," "it seems like")
- [ ] Oxford comma present in all lists

### Step 6: Write Major Themes Section

**Guidance:** 4-6 themes ordered by significance (NOT chronologically). Each theme gets a subsection. Draw directly from the Monthly Analysis Map's "Synthesis Candidate Themes" section.

```markdown
## Major Themes

### [Theme 1: Most Significant Theme Name]

[2-3 paragraphs synthesizing how this theme evolved across the month. Lead with the claim, follow with the evidence arc, close with the strategic implication.]

**Key evidence this month:** [The single strongest normalized data point]

**Evolution:** Appeared [WL date], [how it developed], reached [current state] by [WL date].

---

### [Theme 2 Name]

[Same structure]

---

[Continue for 4-6 themes total]
```

**Style standards:**
- Lead each theme section with the most important sentence (claim-first)
- Max 2 statistics per paragraph
- Every statistic needs population + metric + source WL file + approximate timeframe
- No cross-altitude data mixing in same sentence

### Step 7: Write Idea Evolution Section

**Guidance:** Monthly Synthesis should document which Active Ideas made meaningful moves this month. This is NOT a full copy of Active_Ideas.md — it is a narrative of the month's evolution. Pull from Monthly Analysis Map "Idea Evolution Summary."

```markdown
## Idea Evolution This Month

### Ideas That Made the Most Significant Moves

**[Idea Name] (#N)** — [Net assessment: Strengthened / Refined / Expanded]
[2-3 sentence description of how this idea evolved. What was added? What changed?]
First evidence: [WL date]. Current confidence: [High/Medium-High/etc.].

**[Idea Name] (#N)** — [Net assessment]
[Same structure]

[Cover 4-6 ideas that moved most significantly]

---

### New Ideas Introduced This Month

**[Idea Name] (#N)** — Introduced [WL date]
[1-2 sentence description of what catalyzed this new idea and its current confidence.]

[Cover all new ideas added during the month]

---

### Ideas That Held Steady

The following ideas received reinforcing evidence this month without significant position changes. This stability reflects strong evidentiary support rather than lack of development.

[Idea Name] (#N), [Idea Name] (#N), [Idea Name] (#N) [and others if applicable]

---

### Active Ideas Status Summary (End of Month)

| # | Idea | Status | Confidence | Net Movement |
|---|------|--------|------------|--------------|
| 1 | [Name] | [Status] | [Confidence] | [Strengthened/Refined/Unchanged/Challenged] |
[Continue for all active ideas]
```

### Step 8: Write Open Threads Section

**Guidance:** Draw from Monthly Analysis Map "Open Thread Trajectories." Classify threads clearly. Carry-forward threads need context so future-self understands why they matter.

```markdown
## Open Threads

### Threads That Deepened This Month

**[Thread Name]** — [2-3 sentences describing how this thread evolved. What new complexity emerged? Why is it still open?]

**[Thread Name]** — [Same structure]

---

### Threads Carried Forward (Unchanged)

These threads remain open with limited new movement this month. Each continues to be worth watching.

- **[Thread Name]:** [One sentence on current state and why it matters going forward]
- **[Thread Name]:** [Same]

---

### Threads Resolved or Absorbed

**[Thread Name]** — Resolved: [How it was answered or absorbed into an Active Idea]

---

### New Threads Identified This Month

**[Thread Name]** (NEW) — [2-3 sentences on what triggered this thread and what would resolve it]
```

### Step 9: Write User Observations Section

**Guidance:** Draw from Monthly Analysis Map "User Observations Contribution." Keep this section practitioner-voice — it is about your pattern recognition, not just citations. 2-4 paragraphs maximum.

```markdown
## Practitioner Perspective This Month

[1-2 paragraphs: Which User Observations (by name/number) shaped how you interpreted this month's evidence? How did your practitioner lens reveal something the data alone would not have shown?]

[1 paragraph: What new pattern recognition emerged from this month's synthesis that may become a future User Observation?]

**Observations most active this month:** Obs [N] ([Title]), Obs [N] ([Title]), Obs [N] ([Title])
```

### Step 10: Write Evidence Base Snapshot

**Guidance:** Pull directly from Monthly Analysis Map "Evidence Base Statistics." Keep it clean and factual — this is a record, not narrative.

```markdown
## Evidence Base Snapshot

| Metric | This Month | Notes |
|--------|-----------|-------|
| Weekly Learnings produced | [X] | [Date range] |
| Total sources synthesized | [Y] | Across all WL files |
| Estimated DPs in evidence | ~[Z] | From WL header counts |
| Active Ideas (total) | [N] | [Confirmed / Developing / New breakdown] |
| Open Threads (carried forward) | [M] | From latest synthesis cycle |
| User Observations (total) | [T] | [X new, Y reinforced this month] |
| Established Tags | [E] | [X promoted this month] |
| Emerging Tags | [R] | [X new this month] |

### Tag Evolution This Month

[Brief prose (3-5 sentences) on tag vocabulary changes: which tags were promoted, which emerged, and what the high-activity tags reveal about research focus.]
```

### Step 11: Write What Changed Section

**Guidance:** For the first Monthly Synthesis, this section documents what the month established as foundational. For subsequent months, it compares to prior monthly synthesis.

```markdown
## What This Month Established

*[For inaugural Monthly Synthesis: Replace this header with "What February Established" and write the section as founding context for the research program. For subsequent months: compare to prior MS and document meaningful changes.]*

**Ideas added:** [List with brief context]
**Ideas that elevated in confidence:** [List]
**Major reframes:** [List any significant position changes]
**Evidence base growth:** From [start count] to [end count] sources across the month
**Research focus shift:** [Did the month pull focus toward or away from any area?]
```

---

## Part B: Write Monthly Talking Points

### Step 12: Identify 4-6 Strategic Insights for MT

**Criteria (same as weekly, but applied to full month's evidence):**
- Counterintuitive or surprising (not obvious to practitioners)
- Well-evidenced (multiple sources converged this month)
- Actionable for specific audiences Maicol talks to
- Connected to themes that STRENGTHENED or CRYSTALLIZED this month
- Maicol can speak to from experience or research authority

**Pull from:** Monthly Analysis Map Synthesis Candidate Themes + Idea Evolution section

**Distinguish from weekly TPs:** Monthly Talking Points should feature insights that only became clear across the full arc of the month — not single-week findings.

### Step 13: Write Monthly Talking Points Document

**File:** `[CRIS_ROOT]/09_Deliverables/Talking_Points/MT_YYYY-MM.md`

```markdown
# Monthly Talking Points: [Month YYYY]

**Date:** [YYYY-MM-DD]
**Speaker:** Maicol Parker-Chavez, Product + Innovation Strategist
**Evidence Base:** [X] sources, [Month] [YYYY]
**Context:** Monthly synthesis — insights that crystallized across [X] weekly synthesis cycles

---

## Quick Reference Card

| # | Topic | One-Liner |
|---|-------|-----------|
| 1 | [Topic] | [One sentence summary] |
| 2 | [Topic] | [One sentence summary] |
| 3 | [Topic] | [One sentence summary] |
| 4 | [Topic] | [One sentence summary] |
| 5 | [Topic] | [One sentence summary] |

---

## Talking Point 1: [Title]

### The Point

[2-3 sentences: What is the core insight? State it directly. No hedging.]

### Why It Matters

- [Impact 1 — business/strategic implication]
- [Impact 2]
- [Impact 3]

### Who Cares

| Audience | Their Angle |
|----------|------------|
| [e.g., Enterprise AI leaders] | [Why they care] |
| [e.g., Hiring managers] | [Why they care] |
| [e.g., Consulting clients] | [Why they care] |

### Evidence

- **Key stat:** [Most compelling normalized data point — population + metric + source + timeframe]
- **Why this month's evidence is stronger:** [What changed between start and end of month that makes this more credible now]
- **Supporting data:** [1-2 additional citations — reference WL files, not individual DPs]

### Your Angle

[Maicol's personal perspective. How does his 24 years in product design, or his Capital Group experience, or his current lived experience validate or illuminate this? Write in first-person voice — this is his voice, not a report.]

### Pivot Phrases

- "[Opening phrase that invites dialogue — conversational, not academic]"
- "[Follow-up that deepens the topic]"
- "[Reframe that challenges a common assumption]"

---

[Repeat structure for Talking Points 2-5 or 2-6]

---

## Conversation Starters

1. **"[Question that opens dialogue]"**
   [1-2 sentences on why this question lands well and with which audiences]

2. **"[Question]"**
   [Same]

[5-8 conversation starters total]

---

## Monthly vs. Weekly: What's Different

*[Brief note on how these monthly TPs differ from the latest weekly TP — what additional credibility or depth does the month-long evidence arc provide?]*

---

## Notes for Next Month

### Themes to Develop
[What needs more evidence or refinement going into next month]

### Talking Points Ready for Delivery
[Which of these feel sharpest and most rehearsal-ready]

### Research Gaps
[What this month's synthesis revealed as missing from the evidence base]
```

---

## Part C: Quality Gates and System Updates

### Step 14: Self-Check Before Finalization

**Run on BOTH documents before saving:**

**Style Guide checks:**
- [ ] Search for em dashes (—, –) → replace all
- [ ] Confirm Oxford comma present in all lists
- [ ] Search for hedging language ("may suggest," "it seems like," "it's possible") → replace with direct statements
- [ ] Verify every sentence leads with claim, not context
- [ ] Check paragraphs for numeric density (max 2 stats per paragraph)
- [ ] Contractions: avoid in MS, OK in MT Talking Points

**Data Normalization checks:**
- [ ] Every statistic has population + metric + source WL file + timeframe
- [ ] No two different-source statistics in same sentence without comparability framing
- [ ] Dollar figures include denominators
- [ ] Percentages have denominator clarity

**Citation checks (Monthly Synthesis):**
- [ ] Citations reference WL files, NOT individual extraction DP format
- [ ] WL references use full filename (WL_2026-02-28.md), not shorthand
- [ ] Monthly Talking Points may reference WL files the same way

### Step 15: Save Both Documents

```bash
# Save Monthly Synthesis
# File: [CRIS_ROOT]/04_Monthly_Synthesis/YYYY/MS_YYYY-MM.md

# Save Monthly Talking Points
# File: [CRIS_ROOT]/09_Deliverables/Talking_Points/MT_YYYY-MM.md
```

**Note on Talking Points coexistence:** MT_YYYY-MM.md lives alongside existing TP_YYYY-MM-DD.md files. It is a separate artifact with broader evidence scope — do NOT archive or move the weekly TP files.

### Step 16: Run Prepublish Quality Gate

**If the CRIS system has a prepublish script, run it on the Monthly Synthesis:**

```bash
cd [CRIS_ROOT]
bash poc/scripts/prepublish_lineage_gate.sh
```

**Note:** Monthly Synthesis cites WL files (not extraction DPs), so standard citation contract validation may flag these as different-format citations. This is expected — monthly citations reference a different layer of the compression chain. If the script cannot validate WL-level citations, perform manual quality check instead.

**Manual quality check fallback:**
- [ ] All WL file references use full filename (verifiable with `ls`)
- [ ] No extraction-level citations (`[Source DP#]` format) appear in Monthly Synthesis
- [ ] All WL files referenced actually exist in the file system

### Step 17: Update Monthly Synthesis Index

**Create or update:** `[CRIS_ROOT]/04_Monthly_Synthesis/YYYY/_Index.md`

```markdown
# Monthly Synthesis Index: [YYYY]

**Last Updated:** [YYYY-MM-DD]

| Month | File | Produced | WLs Synthesized | Sources | Active Ideas | Open Threads |
|-------|------|----------|-----------------|---------|--------------|--------------|
| [Month YYYY] | MS_YYYY-MM.md | [date] | [X] WL files | ~[Y] | [N] | [M] |

## Monthly Talking Points

| Month | File | Produced | Talking Points |
|-------|------|----------|----------------|
| [Month YYYY] | MT_YYYY-MM.md | [date] | [X] TPs |
```

---

## Phase 4: Completion Report

### Step 18: Report to User

```
✅✅ MONTHLY SYNTHESIS COMPLETE ✅✅

Month: [MONTH YYYY]

DELIVERABLES:
📄 Monthly Synthesis: 04_Monthly_Synthesis/YYYY/MS_YYYY-MM.md
📄 Monthly Talking Points: 09_Deliverables/Talking_Points/MT_YYYY-MM.md

MONTHLY SYNTHESIS STATS:
- Themes covered: [X] major themes
- Ideas assessed: [Y] (highlights: [names of most-moved ideas])
- Open threads: [Z] carried forward, [N] resolved
- Evidence base: ~[M] sources synthesized across [WL count] weekly cycles

MONTHLY TALKING POINTS:
- [X] talking points ready for use
- Strongest evidence: [Brief note on the best-evidenced TP]

NEXT STEPS:
1. Review MT_YYYY-MM.md for upcoming conversations
2. Start next month's research cycle with cris-extract for new raw inputs
3. Consider running cris-snapshot to share this month's synthesis externally
```

---

## Validation Checks

**Before marking complete:**
- ✅ MS document covers all 7 sections (Overview, Themes, Ideas, Threads, Practitioner Perspective, Evidence Base, What Changed)
- ✅ Monthly Talking Points include 4-6 TPs with full structure
- ✅ All WL references use full filenames
- ✅ No extraction-level citations in Monthly Synthesis
- ✅ Style Guide compliant (no em dashes, Oxford comma, direct voice)
- ✅ Monthly Index updated
- ✅ Both files saved to correct paths

---

## Time Estimates

- Light month (3-4 WL files, few idea changes): 1.5-2 hours
- Normal month (4-6 WL files, significant evolution): 2-3 hours
- Heavy month (6+ WL files, major idea evolution, many new ideas): 3-4 hours

---

## Common Issues and Solutions

**Issue:** Monthly Synthesis reads like a compressed Weekly Learnings
- **Solution:** Rewrite at higher altitude. Monthly is about arc and meaning, not weekly findings. If you're citing specific DPs, you're too low. Cite WL files and let the WL handle the evidence detail.

**Issue:** Monthly Talking Points are indistinguishable from last week's TP
- **Solution:** The "Monthly vs. Weekly: What's Different" section should call out the specific insight that only the month-long arc made visible. If that insight isn't there, find it in the Monthly Analysis Map's "Net Movement" assessments.

**Issue:** Prepublish gate flags all Monthly Synthesis citations as violations
- **Solution:** Monthly Synthesis uses WL-file-level citations, not extraction-DP format. Use the manual quality check fallback (Step 16). This is by design.

**Issue:** User Observations section feels thin
- **Solution:** Re-read the WL files' "Personal Perspective" sections. The practitioner lens should be evident in at least 2-3 WL files. If User Observations weren't invoked much this month, note that honestly and describe what you're watching for next month.
