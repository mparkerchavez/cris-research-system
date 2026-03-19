# Workflow: Weekly Synthesis (Phased)

Create Weekly Learnings, Talking Points, Active Ideas updates, and Current Synthesis from recent extractions using a phased approach that ensures comprehensive evidence coverage.

**Why phased:** A single-pass synthesis that tries to load all extractions, write all outputs, and update all ideas in one context window systematically misses evidence. The phased approach separates mining (where sub-agents go deep on individual sources) from synthesis (where narrative writing happens with pre-digested evidence). This prevents the coverage degradation that occurs when extraction mining and synthesis writing compete for the same context window.

---

## Before Starting

1. Review new extractions from current period in `02_Extractions/YYYY-MM/`
2. Read `02_Extractions/_Extraction_Index.md` to identify what's new
3. Read `03_Weekly_Learnings/_Weekly_Header.md` for recent context and open threads
4. Read `06_Current_Understanding/_Index.md` for idea status
5. Note the "Sources Needing Attention" list in `_Weekly_Header.md`

## Outputs

This workflow produces five deliverables across five phases:

1. **DP Relevance Maps** → `_System/working/relevance_maps/` (intermediate, not published)
2. **Weekly Learnings** → `03_Weekly_Learnings/YYYY-QN/WL_YYYY-MM-DD.md`
3. **Active Ideas updates** → `06_Current_Understanding/Active_Ideas.md`
4. **Current Synthesis update** → `06_Current_Understanding/Current_Synthesis.md`
5. **Talking Points** → `09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md`

## Chat Session Guidance

The five phases can be run in 1-3 chat sessions depending on extraction volume:

| Extraction Volume | Recommended Sessions |
|-------------------|----------------------|
| Light week (1-5 new extractions) | 1 session: all 5 phases |
| Normal week (6-15 new extractions) | 2 sessions: Phases 1-2, then Phases 3-5 |
| Heavy week (16+ new extractions) | 3 sessions: Phases 1-2, Phase 3, Phases 4-5 |

If splitting across sessions, use these prompts:

**Session 1 prompt:**
```
Load the CRIS skill. I'm running the Weekly Synthesis workflow, Phases 1-2 (Extraction Mining + Coverage Sweep).

New extractions to process: [list filenames or say "all new since last synthesis"]
```

**Session 2 prompt:**
```
Load the CRIS skill. I'm running the Weekly Synthesis workflow, Phase 3 (Weekly Learnings).

Read the DP Relevance Maps in `_System/working/relevance_maps/` and continue from where Phase 2 left off.
```

**Session 3 prompt:**
```
Load the CRIS skill. I'm running the Weekly Synthesis workflow, Phases 4-5 (Active Ideas + Current Synthesis + Talking Points).

Read the new Weekly Learnings at `03_Weekly_Learnings/2026-Q1/WL_[date].md` and continue.
```

---

## Phase 1: Extraction Mining Pass

**Purpose:** Go deep into new extractions to identify ALL relevant data points before synthesis begins. Sub-agents read each source in isolation, preventing cross-source contamination and ensuring comprehensive coverage.

**When to use sub-agents vs. direct mining:**

| New Extractions | Approach |
|-----------------|----------|
| 1-2 sources | Mine directly (no sub-agents needed) |
| 3-8 sources | Spawn parallel sub-agents (one per source) |
| 9+ sources | Batch into groups of 5-8, spawn sub-agents per batch |

### Sub-Agent Mining Prompt

For each new extraction, spawn a sub-agent with:

```
You are mining a source extraction for the CRIS weekly synthesis.

**Source file:** [full path to extraction file]

**Current Active Ideas (mine against these):**
[Paste the idea names and one-line positions from Active_Ideas.md — just names and positions, not full evidence tables]

**Current Open Threads:**
[Paste open threads from _Weekly_Header.md]

**Your task:**
1. Read the extraction file completely — every DP
2. For EACH data point, assess: is this relevant to any active idea or open thread?
3. Produce a DP Relevance Map

**Output format:**

## DP Relevance Map: [Source_Name]

### Relevant to Active Ideas

| DP# | DP Summary | Relevant Idea(s) | How It Connects |
|-----|-----------|-------------------|-----------------|
| DP[#] | [One sentence] | [Idea name(s)] | [Why this DP matters for this idea] |

### Relevant to Open Threads

| DP# | DP Summary | Thread | Connection |
|-----|-----------|--------|------------|
| DP[#] | [One sentence] | [Thread name] | [How] |

### New Themes (Not Covered by Current Ideas)

| DP# | DP Summary | Proposed Theme |
|-----|-----------|----------------|
| DP[#] | [One sentence] | [What pattern this might represent] |

### Not Relevant (with reasoning)

| DP# | Why Not Relevant |
|-----|------------------|
| DP[#] | [Brief: too narrow, already captured, tangential, etc.] |

### Coverage Summary
- Total DPs in source: [#]
- Relevant to ideas: [#]
- Relevant to threads: [#]
- New themes: [#]
- Not relevant: [#]

Save to: _System/working/relevance_maps/[Source_Name]_relevance.md
```

### After Sub-Agents Complete

1. Verify all relevance maps exist
2. Quick scan: are there any "New Themes" entries that suggest an Active Idea may need to be created?
3. Flag any sources where >50% of DPs were marked "Not Relevant" (this may indicate the idea set is too narrow)

---

## Phase 2: Coverage Sweep

**Purpose:** Check for older sources that still have low or zero citation coverage. This phase catches evidence that previous synthesis sessions missed.

### Step 1: Check Sources Needing Attention

Read `_Weekly_Header.md` for the "Sources Needing Attention" list. For each source listed:

1. Load the extraction file
2. Scan DPs against current Active Ideas
3. If relevant DPs found: add to a supplementary relevance map
4. If no relevant DPs: mark as "Reviewed, nothing relevant" in the Sources Needing Attention list

### Step 2: Spot-Check Low-Coverage Sources

Read `_Extraction_Index.md`. Identify sources with 20+ DPs that have not been the focus of recent synthesis. If time permits, load 2-3 of these and do a quick relevance scan.

### Output

Save any additional relevance findings to:
`_System/working/relevance_maps/Coverage_Sweep_YYYY-MM-DD.md`

---

## Phase 3: Weekly Learnings

**Purpose:** Write the tag-based synthesis narrative using evidence from the DP Relevance Maps. The key difference from the previous workflow: you're writing from pre-digested evidence, not from raw extractions loaded into context.

### What to Load

1. All DP Relevance Maps from `_System/working/relevance_maps/`
2. `02_Extractions/_Extraction_Index.md` (for source metadata)
3. `06_Current_Understanding/Active_Ideas.md` (current positions and evidence, summary level)
4. `03_Weekly_Learnings/_Weekly_Header.md` (recent context, open threads)
5. `06_Current_Understanding/User_Observations.md` (if relevant observations this week)
6. `_System/Style_Guide.md`
7. `_System/Data_Point_Normalization.md`
8. `_System/Citation_Contract.md`

### When to Load Raw Extractions

Only load the actual extraction files when:
- Writing a claim that needs precise data (specific percentages, company names, methodology details)
- A DP Relevance Map entry is ambiguous and you need the full DP context
- You need the verbatim anchor for verification

This selective loading is the key efficiency gain. The Relevance Maps give you the DP-to-idea mapping; you only go to the raw file for precision.

### Writing the Weekly Learnings

Use template from `08_Templates/Weekly_Template.md`.

**Required sections:**
- Sources Processed (table with one-line contributions for NEW sources this period)
- Synthesis by Tag (insights organized by tag, connections to Current Understanding)
- Updates Made to Current Understanding (ideas modified, added, unchanged)
- Open Threads (questions to carry forward)
- Tags Active This Week
- Reflection (optional personal note)

**Key principle:** Synthesis, not summary. Each insight should be your interpretation connecting data points, not just restating what sources said.

**Writing standards:** Follow `_System/Style_Guide.md` (no em dashes, Oxford comma, direct voice). Normalize all data points per `_System/Data_Point_Normalization.md`.

**Citation compliance:** Every bracket citation must include metadata comments per `_System/Citation_Contract.md`:

```markdown
[Section DP3, DP6; McKinsey DP11]
<!-- cite:path=02_Extractions/YYYY-MM/Section_...md;dp=3,6 -->
<!-- cite:path=02_Extractions/YYYY-MM/McKinsey_...md;dp=11 -->
```

### Output

Save to: `03_Weekly_Learnings/YYYY-QN/WL_YYYY-MM-DD.md`

---

## Phase 4: Active Ideas + Current Synthesis

**Purpose:** Update Active Ideas with new evidence, then rewrite Current Synthesis. These are done together because Current Synthesis depends on the updated ideas.

### Step 1: Update Active Ideas

Load:
- New Weekly Learnings (just written in Phase 3)
- Current `Active_Ideas.md`
- DP Relevance Maps (for comprehensive evidence)

For each idea, determine:

| Situation | Action |
|-----------|--------|
| New supporting evidence from this week | Add to Supporting Evidence table |
| Position refined by new evidence | Update Current Position, add Evolution Log entry |
| Position challenged by new evidence | Add to Open Questions or Counterarguments |
| New idea emerged from "New Themes" in relevance maps | Create new idea entry with full Drivers section |
| No relevant new evidence | Note in "No Changes" section of Weekly Learnings |

**For ideas with new evidence:** Use sub-agents if you need to load specific extraction files to get precise data for the Supporting Evidence table. Each sub-agent loads 3-5 extraction files and returns the specific DP details needed.

Save updated: `06_Current_Understanding/Active_Ideas.md`

### Step 2: Update Current Synthesis

1. **Archive previous version:** Copy `Current_Synthesis.md` to `06_Current_Understanding/archive/Current_Synthesis_YYYY-MM-DD.md`

2. **Load context:**
   - Updated Active Ideas
   - New Weekly Learnings
   - `User_Observations.md`
   - `08_Templates/Current_Synthesis_Template.md`

3. **Rewrite Current Synthesis** as a cumulative position statement:
   - Summary: 2-3 paragraph narrative
   - Key Takeaways: 6-10 insight-organized findings with DP citations
   - Active Ideas table
   - Open Threads
   - Evidence Base stats
   - What's Changed Since Last Synthesis

4. **Update `_Index.md`** with new Last Synthesis date and updated idea counts

**Key principle:** Current Synthesis captures position (where we've landed). Weekly Learnings tracks movement (what changed). They serve different purposes.

---

## Phase 5: Talking Points + System Updates

**Purpose:** Create conversation-ready deliverables and update system tracking files.

### Step 1: Write Talking Points

Load:
- Current Synthesis (just updated)
- Active Ideas (just updated)
- `08_Templates/Talking_Points_Template.md`

Write 3-5 Talking Points, each with:
- The Point (your position in 2-3 sentences)
- Why It Matters (business/strategic implication)
- Who Cares (which audiences, why)
- Evidence (key stat, source credibility)
- Your Angle (what makes your view distinct)
- Pivot Phrases (how to bring it up naturally)

Save to: `09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md`

### Step 2: Update Weekly Header

Update `03_Weekly_Learnings/_Weekly_Header.md`:
- Add entry for this week's synthesis
- Update open threads
- Update "Sources Needing Attention" list:
  - Remove sources that were addressed in the coverage sweep
  - Add any new sources with zero citations that have been in the system 2+ weeks

### Step 3: Update Tags

If new tags emerged during synthesis:
- Add to `Tags.md`
- Promote "Emerging" tags to "Established" if 3+ sources now use them

### Step 4: Clean Up Working Files

The DP Relevance Maps in `_System/working/relevance_maps/` can be:
- Kept for reference (they show the mining work done this cycle)
- Overwritten next cycle (they're intermediate, not archival)

Recommended: Keep the most recent cycle's maps. Delete older ones.

---

## Integrating User Observations

User Observations (`06_Current_Understanding/User_Observations.md`) capture personal insights from lived professional experience. They can be added at any point during the workflow.

**When to add a User Observation:**
- You notice a pattern not captured in published sources
- Your professional experience adds nuance to academic/consulting findings
- Rapid developments outpace published research
- A mental model developed through practice offers actionable framing

**Integration pattern:**
1. Add observation to `User_Observations.md` using `08_Templates/User_Observation_Template.md`
2. Update relevant Active Ideas with `[User observation]` citation
3. Add "Personal Observations Integrated" section to Weekly Learnings if relevant
4. Update "Your Angle" in Talking Points if relevant

**Citation format:**
- `[User observation]` — General observations
- `[User observation (Context)]` — When context matters (e.g., "Capital Group")

---

## Cadence Notes

- Weekly Learnings: Flexible timing (1-2x per week based on extraction volume)
- Talking Points: Created alongside Weekly Learnings
- Current Synthesis: Updated after each Weekly Learnings; only one active version exists (previous versions archived with date)
- If light extraction week: Combine with previous week or defer synthesis
- DP Relevance Maps: Created fresh each cycle; previous cycle's maps overwritten

---

## Quality Checks

After completing all 5 phases, verify:

- [ ] All new extractions are represented in the Sources Processed table
- [ ] All bracket citations include metadata comments per Citation Contract
- [ ] Style Guide compliance: no em dashes, Oxford comma, direct voice, no hedging
- [ ] Data Point Normalization: population, metric, source, timeframe for every statistic
- [ ] Current Synthesis reads as standalone (someone who hasn't read the weekly should understand it)
- [ ] Sources Needing Attention list is current
- [ ] _Index.md reflects updated counts and dates
