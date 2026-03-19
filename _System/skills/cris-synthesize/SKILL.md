---
name: cris-synthesize
description: Run weekly synthesis for the CRIS research system. Use this skill whenever the user mentions running synthesis, creating weekly learnings, generating talking points, or wants to synthesize their research. Triggers on phrases like "run synthesis", "weekly synthesis", "create talking points", "synthesize this week", or any mention of synthesis in the context of CRIS. This skill handles both mid-week (fast) and end-of-week (with user perspective) synthesis workflows, spawns parallel mining agents, writes Weekly Learnings, updates Active Ideas and Current Synthesis, and generates Talking Points.
---

# CRIS Synthesize

Automated weekly synthesis workflow for the CRIS research system.

## Overview

This skill automates the weekly synthesis process, turning extracted data points into insights, updating research positions, and generating conversation-ready talking points. It handles:

- **Two workflow options:** Mid-week (speed) or End-of-week (depth with user input)
- **Parallel DP mining** via sub-agents for efficiency
- **Coverage sweep** to catch previously missed sources
- **Quality enforcement** using Style Guide, Data Normalization, Citation Contract
- **Full deliverables:** Weekly Learnings, Active Ideas updates, Current Synthesis, Talking Points
- **System updates:** Tracker, index, tags, header files

**When to use:** Any time the user wants to synthesize research from this week's extractions.

---

## Quick Start Decision

**Ask the user first:** "Mid-week or end-of-week synthesis?"

### Mid-Week Synthesis (Day 3-4)
- **Best for:** Getting talking points fast for calls/posts/reflection
- **Speed:** Autonomous, no user input needed
- **Output:** Usable immediately, marked as "Mid-week synthesis"
- **Can be superseded:** By end-of-week synthesis if you run it later

### End-of-Week Synthesis (Day 5-7)
- **Best for:** Incorporating your strategic perspective into final synthesis
- **Depth:** Pauses to ask for your input on themes and connections
- **Output:** Comprehensive final synthesis marked as "Final end-of-week synthesis"
- **Supersedes:** Any mid-week synthesis from this week

**Choose one and proceed to that workflow.**

---

## Mid-Week Synthesis Workflow

### Phase 1-2: Mining + Coverage Sweep

1. **Identify this week's extractions:**
   ```bash
   # Check extraction index for recent files
   cat 02_Extractions/_Extraction_Index.md

   # Find extractions from this week (adjust date range)
   find 02_Extractions/2026-02 -name "*.md" -type f -newermt "2026-02-08" | sort
   ```

2. **Load context files:**
   - `_System/Workflows/Weekly_Synthesis.md` (Phase 1-2 section)
   - `06_Current_Understanding/Active_Ideas.md` (get idea names, current positions)
   - `03_Weekly_Learnings/_Weekly_Header.md` (get open threads)

3. **Determine mining strategy:**
   - 1-2 extractions: Mine directly (no sub-agents needed)
   - 3+ extractions: Spawn parallel Task tool agents (one per source)

4. **For each extraction, spawn a mining agent:**

   ```
   Mine data points from [extraction filename] for CRIS weekly synthesis.

   **Context:**
   - Active Ideas: [list idea names]
   - Open Threads: [list from _Weekly_Header.md]

   **Your task:**
   1. Read the extraction file: 02_Extractions/[YYYY-MM]/[filename]
   2. For each DP, assess relevance:
      - Relevant to Active Ideas? → Which idea, why?
      - Relevant to Open Threads? → Which thread, why?
      - New theme not covered? → Describe theme
      - Not relevant? → Note why

   3. Produce DP Relevance Map with structure:
      ## [Source Name]

      ### DPs Relevant to Active Ideas
      - DP# → [Idea Name]: [Connection explanation]

      ### DPs Relevant to Open Threads
      - DP# → [Thread Name]: [Connection explanation]

      ### New Themes Not Covered
      - DP# → [Theme description]

      ### DPs Not Relevant
      - DP# → [Reason not relevant]

   4. Save to: _System/working/relevance_maps/[source_name]_relevance.md

   Return: Path to saved relevance map
   ```

5. **Wait for all mining agents to complete.**

6. **Run coverage sweep:**
   ```bash
   # Check for sources needing attention
   cat 03_Weekly_Learnings/_Weekly_Header.md | grep -A 20 "Sources Needing Attention"

   # For each listed source:
   # - Load extraction file
   # - Quick scan against current Active Ideas
   # - Note if high-value DPs were missed
   ```

7. **Save coverage sweep findings:**
   - `_System/working/relevance_maps/Coverage_Sweep_YYYY-MM-DD.md`

---

### Phase 3: Write Weekly Learnings (Mid-Week)

1. **Load all DP Relevance Maps:**
   ```bash
   ls _System/working/relevance_maps/*_relevance.md
   cat _System/working/relevance_maps/*_relevance.md
   ```

2. **Load required standards:**
   - `_System/Style_Guide.md`
   - `_System/Data_Point_Normalization.md`
   - `_System/Citation_Contract.md`

3. **Load context files:**
   - `02_Extractions/_Extraction_Index.md` (source metadata)
   - `06_Current_Understanding/Active_Ideas.md` (summary level, not full details)
   - `03_Weekly_Learnings/_Weekly_Header.md` (recent context)

4. **Load template:**
   - `08_Templates/Weekly_Template.md`

5. **Write Weekly Learnings:**

   Use DP Relevance Maps as primary source (NOT raw extractions).
   Only load raw extraction files when you need:
   - Precise data (specific percentages, methodology)
   - Ambiguous DP context
   - Verbatim anchor for verification

   **Required sections:**
   - **Sources Processed:** Table with one-line contributions for NEW sources only
   - **Synthesis by Tag:** Insights organized by tag
   - **Updates Made to Current Understanding:** What changed in Active Ideas
   - **Open Threads:** Questions or patterns to continue tracking
   - **Tags Active This Week:** List with frequency
   - **Reflection:** (Optional) Meta-observations

   **Critical requirements:**
   - Follow Style Guide (no em dashes, Oxford comma, direct voice)
   - Apply Data Point Normalization (Level 2 minimum: population + metric + source + timeframe)
   - Every bracket citation includes metadata comment per Citation Contract
   - Mark what is NEW, what SHIFTED, what held STEADY

6. **Mark document status at top:**
   ```markdown
   **Status:** Mid-week synthesis (Day 3-4)
   ```

7. **Save Weekly Learnings:**
   - `03_Weekly_Learnings/2026-Q1/WL_YYYY-MM-DD.md`

8. **Run self-checks before finalizing:**
   - Style Guide Quick Self-Check (9 items)
   - Data Normalization Checklist (7 items)

---

### Phase 4-5: Update Deliverables (Mid-Week)

1. **Update Active Ideas:**
   ```bash
   # Load current Active Ideas
   cat 06_Current_Understanding/Active_Ideas.md
   ```

   For each idea:
   - Scan DP Relevance Maps for relevant evidence
   - Add to Supporting Evidence table if relevant
   - Update Current Position if evidence refines thesis
   - Add Evolution Log entry: "YYYY-MM-DD (Mid-week preliminary): [updates]"
   - Add to Open Questions if evidence creates tension

   Save updated: `06_Current_Understanding/Active_Ideas.md`

2. **Update Current Synthesis (if significant shifts):**
   - Archive current version: `06_Current_Understanding/archive/Current_Synthesis_[LastUpdatedDate].md`
   - Load context:
     - Updated Active Ideas
     - New Weekly Learnings
     - `06_Current_Understanding/User_Observations.md`
     - `08_Templates/Current_Synthesis_Template.md`
   - Rewrite Current Synthesis as cumulative position statement
   - Save: `06_Current_Understanding/Current_Synthesis.md`

3. **Generate Talking Points:**
   - Load: Current Synthesis, Active Ideas
   - Load: `08_Templates/Talking_Points_Template.md`, `_System/Style_Guide.md` (Talking Points section)
   - Create 3-5 Talking Points (shareable now for calls/posts/reflection)
   - Save: `09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md`

4. **Update _Weekly_Header.md:**
   - Add entry for this week's synthesis
   - Update open threads
   - Update "Sources Needing Attention" list

5. **Update Tags.md if new tags emerged:**
   - Add to Emerging section
   - Promote to Established if 3+ sources

---

### Phase 5B: Validate Citations and Run Prepublish Gate (MANDATORY BLOCKING)

**CRITICAL:** Before marking synthesis complete, validate all citations and run prepublish gate.

1. **Validate Weekly Learnings:**
```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
python3 poc/scripts/validate_citation_contract.py \
  --file 03_Weekly_Learnings/YYYY-QX/WL_YYYY-MM-DD.md
```

2. **Validate Talking Points:**
```bash
python3 poc/scripts/validate_citation_contract.py \
  --file 09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md
```

3. **Run Full Prepublish Gate:**
```bash
bash poc/scripts/prepublish_lineage_gate.sh
```

**If Validation or Gate Fails:**
- DO NOT mark synthesis complete
- Fix all citation violations using generate_citation_snippet.py
- Re-run validations until all pass
- Only proceed to report after PASS

---


### Phase 6: Report (Mid-Week)

```
✅ Mid-week synthesis complete!

**This week's data:**
- Sources processed: [X] new extractions
- Total DPs mined: [Y]
- Themes identified: [Z]

**Deliverables created:**
- ✅ WL_YYYY-MM-DD.md (marked "Mid-week synthesis")
- ✅ TP_YYYY-MM-DD.md (Talking Points - usable now)
- ✅ Active Ideas updated (preliminary evidence added)
- ✅ Current Synthesis updated (if significant shifts)

**System updates:**
- ✅ _Weekly_Header.md
- ✅ Tags.md (if new tags)

**Purpose:** Usable outputs immediately. Can be superseded by end-of-week synthesis.

**Outputs:** 03_Weekly_Learnings/2026-Q1/, 09_Deliverables/Talking_Points/
```

---

## End-of-Week Synthesis Workflow

### Phase 1-2: Mining + Coverage Sweep (ALL Week's Data)

**Same as mid-week Phase 1-2, but:**
- Process ALL extractions from this week (including files added since mid-week)
- More comprehensive coverage sweep

**After mining completes, PAUSE for user input.**

---

### User Input Phase (CRITICAL)

After Phase 1-2 completes, present themes summary and ask for user perspective:

```
**Review DP Relevance Maps Summary**

Based on the extraction mining, here are the key themes emerging this week:

- **[Theme 1]:** [Brief description with source count]
  - Sources: [list]
  - Key insights: [summary]

- **[Theme 2]:** [Brief description with source count]
  - Sources: [list]
  - Key insights: [summary]

- **[Theme 3]:** [Brief description with source count]
  - Sources: [list]
  - Key insights: [summary]

---

**Your Input Requested:**

Please share your perspective on this week's research:

1. **What feels most important to you this week?**
   - Which themes resonate most with your current focus?
   - Any themes that feel more/less relevant than the data suggests?

2. **Connections you're seeing:**
   - Any patterns connecting to Active Ideas that might not be obvious?
   - Cross-domain insights (e.g., enterprise AI trends + your Capital Group experience)?

3. **Your overall reflection:**
   - What's your strategic read on these sources?
   - Any concerns, opportunities, or questions this raises for you?

4. **Emphasis guidance:**
   - Anything you want emphasized in Weekly Learnings?
   - Anything to de-emphasize or flag as less relevant?

**Take your time. I'll incorporate your responses into Phase 3.**
```

**Wait for user response before proceeding.**

---

### Phase 3: Write Final Weekly Learnings (With User Perspective)

**Same as mid-week Phase 3, but:**

1. **Load user input from above** in addition to DP Relevance Maps

2. **Write Weekly Learnings that:**
   - Prioritizes themes user identified as most important
   - Integrates user's observations and connections
   - Reflects user's strategic framing
   - Uses user's language where appropriate

3. **Add "User Observations" section** if substantial reflection provided:
   ```markdown
   ## User Observations

   [User's strategic perspective on this week's themes]
   ```

4. **Mark document status:**
   ```markdown
   **Status:** Final end-of-week synthesis
   ```

5. **Mark user-identified patterns:**
   - Use notation like: "[User observation: ...]" or "[Strategic note: ...]"

6. **Save:** `03_Weekly_Learnings/2026-Q1/WL_YYYY-MM-DD.md`
   - This supersedes any mid-week version from this week

---

### Phase 4-5: Final Active Ideas + Deliverables

**Same as mid-week Phase 4-5, but:**

1. **Update Active Ideas with final comprehensive update:**
   - Evolution Log entry: "YYYY-MM-DD: Final comprehensive update with user perspective"
   - More thorough position refinement based on user input

2. **Current Synthesis rewrite:**
   - Archive previous
   - Rewrite incorporating user's strategic framing
   - Mark as "Final end-of-week" version

3. **Generate final Talking Points:**
   - Incorporate user's strategic framing
   - Emphasize what user flagged as important

4. **All outputs marked as "final" and supersede mid-week versions**

---

### Phase 5B: Validate Citations and Run Prepublish Gate (MANDATORY BLOCKING - End-of-Week)

**CRITICAL:** Before marking synthesis complete, validate all citations and run prepublish gate.

1. **Validate Weekly Learnings:**
```bash
cd /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System
python3 poc/scripts/validate_citation_contract.py \
  --file 03_Weekly_Learnings/YYYY-QX/WL_YYYY-MM-DD.md
```

2. **Validate Talking Points:**
```bash
python3 poc/scripts/validate_citation_contract.py \
  --file 09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md
```

3. **Run Full Prepublish Gate:**
```bash
bash poc/scripts/prepublish_lineage_gate.sh
```

**If Validation or Gate Fails:**
- DO NOT mark synthesis complete
- Fix all citation violations using generate_citation_snippet.py
- Re-run validations until all pass
- Only proceed to report after PASS

---


### Phase 6: Report (End-of-Week)

```
✅ End-of-week synthesis complete!

**This week's comprehensive data:**
- Sources processed: [X] total extractions (entire week)
- Total DPs mined: [Y]
- Themes identified: [Z]
- User perspective: Integrated

**Final deliverables:**
- ✅ WL_YYYY-MM-DD.md (final, supersedes mid-week)
- ✅ TP_YYYY-MM-DD.md (final, supersedes mid-week)
- ✅ Active Ideas updated (comprehensive with user perspective)
- ✅ Current Synthesis updated (your strategic framing integrated)

**System updates:**
- ✅ _Weekly_Header.md
- ✅ Tags.md
- ✅ Working files cleaned up

**Purpose:** Comprehensive weekly synthesis with your strategic thinking integrated.

**Outputs:** 03_Weekly_Learnings/2026-Q1/, 09_Deliverables/Talking_Points/
```

---

## DP Relevance Maps Structure

Each mining agent produces a relevance map following this structure:

```markdown
# [Source Name]

**Extraction:** [filename]
**Date:** [YYYY-MM-DD]
**DP Count:** [X]

---

## DPs Relevant to Active Ideas

### [Idea Name 1]
- **DP3:** [Connection explanation] → [Brief quote from anchor]
- **DP7:** [Connection explanation] → [Brief quote from anchor]

### [Idea Name 2]
- **DP12:** [Connection explanation] → [Brief quote from anchor]

---

## DPs Relevant to Open Threads

### [Thread Name 1]
- **DP5:** [Connection explanation]

---

## New Themes Not Covered by Current Ideas

### [Theme Description 1]
- **DP2:** [Why this represents a new theme]
- **DP9:** [Supporting evidence for theme]

**Recommendation:** Consider creating new Active Idea for this theme if pattern strengthens.

---

## DPs Not Relevant

- **DP1:** [Reason not relevant - e.g., "Too specific to source context, not generalizable"]
- **DP4:** [Reason not relevant - e.g., "Background information, no strategic insight"]

---

## Mining Notes

[Any observations about this source's contribution, quality, or relevance to current research focus]
```

---

## Quality Standards Reference

### Style Guide Requirements (9-Item Checklist)

Before finalizing Weekly Learnings, verify:

1. ✅ No em dashes (use regular dashes or rewrite)
2. ✅ Oxford comma used consistently
3. ✅ Direct voice (no passive constructions)
4. ✅ Concise sentences (avoid excessive clauses)
5. ✅ Clear attribution (who said what, when)
6. ✅ No jargon without definition
7. ✅ Consistent terminology
8. ✅ Paragraph length varies (avoid walls of text)
9. ✅ Headings are descriptive

### Data Normalization Requirements (7-Item Checklist)

For every quantitative claim, include:

1. ✅ **Population:** Who/what does this apply to?
2. ✅ **Metric:** What specifically was measured?
3. ✅ **Source:** Who collected/reported this data?
4. ✅ **Timeframe:** When was this measured?
5. ✅ **Level 2 minimum:** All 4 above elements present
6. ✅ **Level 3 when juxtaposing:** Add methodology if comparing across sources
7. ✅ **Avoid naked percentages:** Never "70% of companies" without context

**Example of proper normalization:**
- ❌ Bad: "70% of companies are adopting AI"
- ✅ Good: "70% of Fortune 500 companies reported AI adoption in 2024 (McKinsey Global Survey, n=850)"

### Citation Contract Requirements

Every bracket citation must include metadata comment:

```markdown
This pattern emerged across multiple sources [FinancialTimes_MustafaSuleymanAI_2026-02-13 DP5]
<!-- Source: Financial Times, "Mustafa Suleyman on AI", Feb 13 2026 -->
```

**Format:**
```
[ExtractionFilename DP#]
<!-- Source: [Publisher], "[Article Title]", [Date] -->
```

---

## Resources to Load During Synthesis

### Always Load:
- `_System/Style_Guide.md`
- `_System/Data_Point_Normalization.md`
- `_System/Citation_Contract.md`
- `08_Templates/Weekly_Template.md`

### Load for Context:
- `02_Extractions/_Extraction_Index.md` (source metadata)
- `06_Current_Understanding/Active_Ideas.md` (summary)
- `03_Weekly_Learnings/_Weekly_Header.md` (recent context)

### Load on Demand:
- Raw extraction files (only when need precise data or ambiguous context)
- `06_Current_Understanding/User_Observations.md` (if relevant this week)
- `_System/Workflows/Weekly_Synthesis.md` (full phase details)

---

## Coverage Sweep Protocol

**Purpose:** Catch high-value DPs from older sources that may have been missed in previous synthesis.

**When to run:** Every synthesis (Phase 2)

**Process:**

1. **Check "Sources Needing Attention" list:**
   ```bash
   cat 03_Weekly_Learnings/_Weekly_Header.md | grep -A 10 "Sources Needing Attention"
   ```

2. **For each listed source:**
   - Load extraction file
   - Quick scan DPs against current Active Ideas (not full mining)
   - Flag if high-value DPs found that weren't previously synthesized

3. **Check low-coverage sources:**
   ```bash
   # From _Extraction_Index.md, identify sources with:
   # - 15+ DPs
   # - < 3 citations across all synthesis
   # - Created 2+ weeks ago
   ```

4. **Spot-check 2-3 low-coverage sources:**
   - Compare DPs to current Active Ideas
   - Assess: relevant but missed, or genuinely not relevant?

5. **Document findings:**
   - Save to: `_System/working/relevance_maps/Coverage_Sweep_YYYY-MM-DD.md`
   - Update "Sources Needing Attention" in _Weekly_Header.md

---

## Common Issues and Troubleshooting

### Issue: Mining agent returns generic relevance assessments

**Cause:** Agent doesn't understand Active Ideas context deeply.

**Fix:** In agent prompt, include brief summary of each Active Idea's current position, not just the name.

### Issue: Weekly Learnings too generic, lacks specific insights

**Cause:** Not loading raw extractions when needed for precise data.

**Fix:** When DP Relevance Map notes specific percentages or methodologies, load the raw extraction to get exact details.

### Issue: Citations missing metadata comments

**Cause:** Forgot Citation Contract requirement.

**Fix:** Run find/replace pass before finalizing:
```bash
# Find all bracket citations without metadata comments
grep -n '\[[A-Z].*DP[0-9]' WL_YYYY-MM-DD.md | grep -v "<!--"
```

### Issue: User perspective not integrated in end-of-week synthesis

**Cause:** Rushed Phase 3 without incorporating user input.

**Fix:** Re-read user input before writing each section. Mark sections that incorporate user framing.

---

## Performance Tips

**Optimize for speed:**
- Spawn maximum mining agents in parallel (don't process sequentially)
- Use DP Relevance Maps as primary source (minimize raw extraction loading)
- Mid-week synthesis is faster (no user input wait)

**Optimize for depth:**
- End-of-week synthesis with user perspective creates richer insights
- Take time in user input phase to reflect on themes
- Coverage sweep catches missed connections

**Optimize for quality:**
- Always run Style Guide + Data Normalization self-checks
- Load Citation Contract when writing citations
- Review DP Relevance Maps before asking user for input (better themes summary)

---

## Workflow Selection Guide

**Choose Mid-Week when:**
- You need talking points quickly for an upcoming event
- You want to see trends before week ends
- You're short on time and autonomous synthesis is sufficient
- You plan to run end-of-week synthesis later anyway

**Choose End-of-Week when:**
- You want to integrate your strategic thinking
- You've had time to reflect on the week's themes
- This is your primary synthesis for the week (not preliminary)
- You value depth over speed

**Do Both when:**
- Mid-week: Get quick talking points (Day 3-4)
- End-of-week: Comprehensive final synthesis (Day 5-7)
- Best of both: Speed + depth, preliminary + final
