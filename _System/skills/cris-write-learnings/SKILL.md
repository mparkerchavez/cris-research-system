# CRIS Write Learnings Skill (Session 2: Weekly Learnings Document)

**Purpose:** Synthesize DP Relevance Maps from Session 1 into a comprehensive Weekly Learnings document following CRIS style standards.

**When to use:** After completing `cris-analyze` (Session 1). This skill reads DP Relevance Maps (NOT raw extractions) and synthesizes them into the Weekly Learnings document.

---

## Workflow Overview

This skill implements Phase 3 of the CRIS Weekly Synthesis workflow:
- Read all DP Relevance Maps from Session 1
- Synthesize ACROSS sources by tag
- Write Weekly Learnings with strict style/citation standards
- Document how Active Ideas evolved

**Key Principle:** DP Relevance Maps are the PRIMARY source. We synthesize across them, not across raw extractions. This prevents shallow coverage.

---

## Phase 1: Prerequisites Validation

### Step 1: Verify Session 1 Completed

**Check for DP Relevance Maps:**

```bash
# Count relevance maps in working folder
ls /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/working/relevance_maps/*.md | wc -l

# List all maps
ls -lh /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/working/relevance_maps/
```

**Validation:**
- ✅ At least 1 DP Relevance Map exists
- ❌ If ZERO maps: ERROR - "No DP Relevance Maps found. Run cris-analyze (Session 1) first."

### Step 2: Identify Week and Date

**Determine week boundary:**
- Check `_Weekly_Header.md` for current week
- OR ask user: "What date range does this synthesis cover?"
- Format: YYYY-MM-DD (use Friday or end-of-week date)

---

## Phase 2: Load Context

### Step 3: Read All Required Files

```bash
# Read ALL DP Relevance Maps
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/working/relevance_maps/*.md

# Read Active Ideas (current state)
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/Active_Ideas.md

# Read previous Weekly Learnings (for pattern consistency)
ls -t /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/2026-Q1/*.md | head -2

# Read Style Guide
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Style_Guide.md

# Read Data Normalization standards
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Data_Point_Normalization.md

# Read Citation Contract
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/_System/Citation_Contract.md
```

**Note:** Reading previous Weekly Learnings helps maintain consistent voice and structure.

---

## Phase 3: Build Weekly Learnings Structure

### Step 4: Create Sources Processed Table

**Task:** Extract one-line contributions from each DP Relevance Map.

**Table format:**
```markdown
| Source | Type | One-Line Contribution |
|--------|------|----------------------|
| [SourceName]_[Slug] | [PDF/Article/Transcript] | [One-sentence summary of key contribution] |
```

**How to write one-line contributions:**
- Focus on WHAT IT CONTRIBUTED, not what it was about
- Examples:
  - "Tool-coworker duality framework: 76% view agents as coworkers, four operational tensions"
  - "Near-perfect education-AI correlation (r>0.92), task success rates, augmentation patterns"
  - "Multi-repo coordination with visibility enables team-scale automation"

**Count sources:**
```markdown
**Total sources this week:** [X] ([Y] from prior synthesis + [Z] new from [Date])
```

### Step 5: Synthesize by Tag

**Critical:** This is the MAIN CONTENT of Weekly Learnings.

For each major tag (identified in DP Relevance Maps):

#### A. Tag Section Header

```markdown
### #tag-name
```

#### B. Write Synthesis Narrative

**Rules:**
- Write in PROSE (paragraphs), NOT bullet points
- Synthesize ACROSS sources - show how DPs converge or diverge
- Include bracket citations: `[SourceName DP#; SourceName2 DP#]`
- Add metadata comments after citations: `<!-- cite:path=02_Extractions/YYYY-MM/SourceName_Slug_YYYY-MM-DD.md;dp=# -->`
- Follow Style Guide:
  - NO em dashes (use commas, periods, or colons)
  - Oxford comma always
  - Direct voice (avoid passive)
- Follow Data Normalization:
  - Level 2+ minimum: population + metric + source + timeframe
  - Example: "76% of executives view agents as coworkers [BCG, February 2026]"

**Structure each tag section:**

1. **Opening:** What's the core finding for this tag this week?
2. **Evidence:** What DPs support this? (with citations)
3. **What shifted:** How did understanding change this week?
4. **Connection to Current Understanding:** Which Active Ideas does this reinforce/challenge?

**Example:**
```markdown
### #agentic-workflows

The architectural consensus that emerged in the prior synthesis held steady this week and deepened with new implementation evidence. Five independent teams (Cursor, Anthropic, GitHub, Every, and now AI Jason's reverse-engineering of Agent Teams internals) converge on hierarchical task decomposition with specialized roles. This pattern is no longer experimental. It is operational.
[Cursor_ScalingAutonomousCoding DP4; Anthropic_CCompilerParallelClaudes DP5; github_ContinuousAIInPractice DP4, DP5; AI_Jason_ClaudeCodeAgentTeams DP1, DP3]
<!-- cite:path=02_Extractions/2026-02/Cursor_ScalingAutonomousCoding_2026-02-06.md;dp=4 -->
<!-- cite:path=02_Extractions/2026-02/Anthropic_CCompilerParallelClaudes_2026-02-06.md;dp=5 -->
<!-- cite:path=02_Extractions/2026-02/github_ContinuousAIInPractice_2026-02-06.md;dp=4,5 -->
<!-- cite:path=02_Extractions/2026-02/AI_Jason_ClaudeCodeAgentTeams_2026-02-07.md;dp=1,3 -->

**What shifted:** The Agent Teams reverse-engineering moved the architectural pattern from "industry consensus" to "productionized SDK." The planner-worker hierarchy is now a first-party feature, not an experimental pattern.

**Connection to Current Understanding:**
- Reinforces Idea 7 (Agent-Native Development Paradigm): productionized tooling confirms the paradigm is operational, not aspirational
- Reinforces Idea 2 (Coordination Tax): Agent Teams architecture confirms coordination overhead is managed through bounded autonomy with human oversight
```

#### C. Repeat for All Major Tags

Process all tags that had significant activity this week (typically 5-10 major tags).

---

## Phase 4: Updates Made to Current Understanding

### Step 6: Document Active Idea Evolution

**For each Active Idea**, write how this week's evidence changed it:

```markdown
### Ideas Modified

- **Idea 1 (Name):** [How it changed]. Evidence: [cite DPs]. [Reinforced/Expanded/Challenged/Held steady]

- **Idea 2 (Name):** ...
```

**Structure:**
- **Modified:** Ideas that changed in some way (strengthened, expanded, refined)
- **New Ideas Added:** If new themes from DP Relevance Maps suggest new Active Ideas
- **No Changes:** Note which ideas received no relevant evidence this week

---

## Phase 5: Open Threads and Tags

### Step 7: Update Open Threads

**Task:** List threads that emerged or were reinforced this week.

```markdown
## Open Threads

1. **[Thread Name]** — [Description]. Evidence: [DPs and sources]

2. **[Thread Name]** — [Description]. Evidence: [DPs and sources]
```

**Numbered list** with clear descriptions and evidence citations.

### Step 8: Tags Active This Week

**Create summary table:**

```markdown
## Tags Active This Week

| Tag | Data Points | Status |
|-----|-------------|--------|
| #agentic-workflows | 80+ | Established |
| #adoption-barriers | 68+ | Established |
| #saas-repricing | 12+ | Emerging (growing fast) |
```

**Status categories:**
- **Established:** 30+ DPs, stable pattern
- **Emerging:** <30 DPs, but growing
- **New:** First appearance

---

## Phase 6: Reflection and Personal Observations

### Step 9: Write Reflection Section

**Task:** Meta-commentary on the week's synthesis.

**Questions to address:**
- What was most striking about this week?
- What patterns emerged unexpectedly?
- What surprised you?
- What's the signal vs. noise ratio?

**Example:**
```markdown
## Reflection

Five new sources in a single day is unusual for a system processing 62 prior extractions. The fact that all five reinforced existing ideas rather than opening new territory is itself a signal: the thematic framework built over the past week appears to have reached initial saturation on these topics.

The most striking addition is not a data point but a cultural observation. Vibe coding reframes software development from professional obligation to creative play...
```

### Step 10: Integrate Personal Observations (if any)

If there are user observations in `User_Observations.md` that are relevant to this week, note them:

```markdown
## Personal Observations Integrated

Observations 1-6 from User_Observations.md remain active and were reinforced by this week's sources. Key reinforcements:

- **Observation 1 (OpenClaw):** VentureBeat's enterprise analysis confirms...
- **Observation 4 (Layoff Timing):** Vibe coding movement reinforces...
```

---

## Phase 7: Quality Checks

### Step 11: Apply Style Guide Validation

**Run these checks:**

1. **No em dashes:** Search document for `—` (should be zero)
2. **Oxford comma:** Check lists for proper comma usage
3. **Direct voice:** Check for passive voice (should be minimal)
4. **Citation format:** Every bracket citation MUST have metadata comment
5. **Data normalization:** Check metrics have population + metric + source + timeframe

**Fix any violations before proceeding.**

### Step 12: Persist Weekly Learning to Convex via MCP

After completing the narrative synthesis, call `create_weekly_learning` to persist the structured Weekly Learning to Convex. This replaces the legacy Python citation validation scripts — Convex validates citation integrity natively via typed IDs.

**Build the themes list:** Each major tag section in the WL markdown maps to one theme entry:

```
create_weekly_learning({
  weekStartDate: "[YYYY-MM-DD]",   // Monday of the week
  weekEndDate: "[YYYY-MM-DD]",     // Sunday of the week
  title: "[Optional week title]",
  overview: "[2-3 sentence executive summary of this week's synthesis]",
  themes: [
    {
      themeTitle: "#agentic-workflows",
      themeContent: "[Full narrative paragraph(s) from the #agentic-workflows section]",
      citedDataPointIds: ["convexId1", "convexId2", ...]
    },
    {
      themeTitle: "#adoption-barriers",
      themeContent: "[narrative]",
      citedDataPointIds: [...]
    }
    // ... one entry per major tag section
  ]
})
```

**How to get `citedDataPointIds`:** These are the Convex IDs from the relevance maps (Session 1). Each relevance map table has a "Convex ID" column. Collect the IDs for DPs cited in each tag section.

**Validation:** The tool validates all IDs before saving. If any ID is invalid, it returns an error listing the missing IDs — remove or correct them and retry.

**Record the returned `weeklyLearningId`** in the WL markdown file header:
```markdown
**Convex ID:** [weeklyLearningId]
```

**Fallback — if Convex IDs are unavailable** (cris-analyze Session 1 was run without MCP queries): Write the markdown-only output and note `convex_synced: false` in the header. Re-sync later using `get_week_data_points` to retrieve IDs.

---

## Phase 8: Save and Report

### Step 13: Save Weekly Learnings

**Filename:** `WL_YYYY-MM-DD.md` (use Friday or end-of-week date)

**Location:** `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/YYYY-QX/`

**Example:**
```bash
# For week ending February 12, 2026
/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/2026-Q1/WL_2026-02-12.md
```

### Step 14: Update Weekly Header

Update `_Weekly_Header.md`:

```markdown
**Current Week:** Week ending [YYYY-MM-DD]
**Status:** Session 2 Complete ✅
**Sources Processed:** [X]
**Weekly Learnings:** WL_YYYY-MM-DD.md
**Next:** Session 3 (cris-integrate)
```

### Step 15: Verify Convex Persistence

Confirm the weekly learning was saved to Convex successfully (Step 12 succeeded and returned a `weeklyLearningId`). If Step 12 was skipped or failed, note `convex_synced: false` — this does not block completion but should be resolved before Session 3 synthesis integration.

The legacy `poc/scripts/prepublish_lineage_gate.sh` is no longer required. Citation integrity is enforced by Convex at write time via typed ID validation.

### Step 16: Generate Completion Report

**Report to user:**

```
✅ CRIS Weekly Learnings Complete (Session 2)
✅ Convex Persisted: weeklyLearningId = [id]

File: 03_Weekly_Learnings/2026-QX/WL_YYYY-MM-DD.md

Statistics:
- Sources processed: [X]
- Total DPs synthesized: [Y]
- Tags with activity: [Z]
- Active Ideas updated: [N]
- New threads identified: [T]

Quality Checks:
✅ All citations have metadata comments
✅ Style Guide compliance verified
✅ Data normalization Level 2+ achieved

Top Insights:
- [Insight 1]
- [Insight 2]
- [Insight 3]

✅ Ready for Session 3: cris-integrate
```

---

## Validation Checks

**Prerequisites:**
- ✅ DP Relevance Maps exist and were loaded
- ✅ Active Ideas loaded
- ✅ Style standards loaded

**Output Quality:**
- ✅ Weekly Learning persisted to Convex with themes and cited DP IDs (weeklyLearningId recorded)
- ✅ No em dashes (Style Guide)
- ✅ Metrics normalized to Level 2+ (Data Normalization)
- ✅ Synthesis organized by tag, not by source
- ✅ File saved in correct quarterly folder

**Content Completeness:**
- ✅ Sources Processed table complete
- ✅ All major tags addressed
- ✅ Active Idea updates documented
- ✅ Open Threads updated
- ✅ Reflection section written

---

## Common Issues and Solutions

**Issue:** Synthesis feels shallow, just summarizing sources
- **Solution:** Focus on CONVERGENCE across sources and TENSION between sources. What patterns emerge when you look across all maps?

**Issue:** Too many tags to process (15+)
- **Solution:** Focus on tags with highest DP counts. Minor tags can be noted but don't need full synthesis sections.

**Issue:** Can't determine which Active Ideas changed
- **Solution:** Re-read Active Ideas, then scan DP Relevance Maps "Relevant to Active Ideas" tables. Look for convergent evidence.

**Issue:** Metadata comments not matching citations
- **Solution:** Use a systematic approach - write citation, immediately add metadata comment below. Don't batch them.

---

## Time Estimates

- Light week (3-5 sources): 1-1.5 hours
- Normal week (6-10 sources): 2-3 hours
- Heavy week (11-15 sources): 3-4 hours

**Key Efficiency:** The hard thinking was done in Session 1 (DP Relevance Maps). Session 2 is about synthesizing across those maps.

---

## Notes for User

**Primary Source:** DP Relevance Maps, NOT raw extractions. This is critical for quality.

**Synthesis Across Sources:** The power of Weekly Learnings comes from showing how MULTIPLE sources converge on the same findings. Look for that convergence.

**Style Matters:** The Style Guide and Data Normalization standards create professional-grade synthesis. Don't skip quality checks.

**Next Step:** Run `cris-integrate` (Session 3) to update Active Ideas, Current Synthesis, and generate Talking Points.
