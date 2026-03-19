# CRIS Analyze Skill (Session 1: Deep Mining + DP Relevance Maps)

**Purpose:** Execute deep analysis of extraction sources using parallel sub-agents, producing DP Relevance Maps as intermediate outputs that prevent shallow synthesis coverage.

**When to use:** Start of weekly synthesis cycle (Session 1). Use this skill when you have new extractions that need deep analysis before writing Weekly Learnings.

**Path convention:** `[CRIS_ROOT]` refers to the root of the CRIS Research System workspace. Resolve this to the actual mounted path at runtime (e.g., `/sessions/[session-name]/mnt/CRIS_Research_System`). Use `find` or `ls` to locate the workspace if the path is unknown.

---

## Workflow Overview

This skill implements Phase 1-2 of the CRIS Weekly Synthesis workflow:
- **Phase 1:** Extraction Mining Pass (spawn sub-agents for each source)
- **Phase 2:** Coverage Sweep (optional, for checking older sources)

**Key Principle:** Each extraction gets dedicated sub-agent analysis producing a DP Relevance Map. These maps are the PRIMARY input for Session 2 (writing Weekly Learnings), NOT the raw extractions.

---

## Phase 1: Discovery and Planning

### Step 1: Load Context Files

Read these files to understand current state, then supplement with MCP queries:

```bash
# Read synthesis status
cat [CRIS_ROOT]/03_Weekly_Learnings/_Weekly_Header.md

# Read extraction index to identify unsynthesized sources
cat [CRIS_ROOT]/02_Extractions/_Extraction_Index.md

# Read Active Ideas for relevance mapping
cat [CRIS_ROOT]/06_Current_Understanding/Active_Ideas.md

# Read Tags for alignment
cat [CRIS_ROOT]/Tags.md
```

**Step 1.5: Pull week's data points from Convex**

After loading the header, call `get_week_data_points` to get the structured DP set for this analysis period:

```
get_week_data_points({
  weekStartDate: "[YYYY-MM-DD]",  // Monday of analysis week
  weekEndDate: "[YYYY-MM-DD]"    // Sunday of analysis week
})
```

This returns all data points extracted in the period with their Convex IDs, tag slugs, evidence types, and source references. Record these for passing to sub-agents — they need the Convex DP IDs to write relevance maps that enable later MCP persistence.

Also use `search_knowledge_base` to find existing DPs relevant to active research themes (useful for cross-week pattern detection):

```
search_knowledge_base({
  query: "[active idea title or theme]",
  limit: 20
})
```

Run one query per major Active Idea (or the top 3-5 most active). These results give sub-agents historical context for convergence detection.

### Step 2: Identify Sources for Analysis

**Task:** Cross-reference `_Extraction_Index.md` with `_Weekly_Header.md` to find:
- Extractions created since last synthesis
- Extractions marked as "not yet synthesized"
- Date range for current weekly batch

**Output to user:**
```
Found [X] extractions ready for analysis:
- [SourceName1]_[Slug1]_YYYY-MM-DD.md
- [SourceName2]_[Slug2]_YYYY-MM-DD.md
...

Recommended batch strategy: [Light/Normal/Heavy] week
Estimated time: [Y] hours for Session 1
```

### Step 3: Get User Confirmation

**Prompt user:**
```
Ready to analyze [X] sources using parallel sub-agents.
Each source will get dedicated deep analysis producing a DP Relevance Map.

Proceed with full batch? Or would you like to:
- Process a subset (specify which sources)
- Add coverage sweep for older sources
- Adjust batch strategy
```

---

## Phase 2: Parallel Sub-Agent Mining

### Step 4: Load Mining Prompt Template

Read the sub-agent mining prompt from the workflow documentation:

```bash
cat [CRIS_ROOT]/_System/Workflows/Weekly_Synthesis.md
```

Extract the **"Sub-Agent Mining Prompt Template"** section (Phase 1 instructions).

### Step 5: Spawn Sub-Agents (One Per Source)

For each extraction file to analyze:

**Use Task tool with these parameters:**
- `subagent_type: "general-purpose"`
- `description: "Analyze [SourceName] for DP relevance"`
- `prompt:` (construct from template below)

**Sub-Agent Prompt Construction:**

```markdown
## CRITICAL: Save Location and Return Format

**SAVE your completed DP Relevance Map to this EXACT path:**
`_System/working/relevance_maps/[SourceName]_[Slug]_relevance.md`

Full path: `[CRIS_ROOT]/_System/working/relevance_maps/[SourceName]_[Slug]_relevance.md`

- The filename drops the date from the extraction filename (e.g., `CitriniResearch_The2028GlobalIntelligenceCrisis_2026-02-23.md` becomes `CitriniResearch_The2028GlobalIntelligenceCrisis_relevance.md`)
- Do NOT save to the extraction directory (`02_Extractions/`)
- Do NOT create subdirectories
- Do NOT save to any other location

**RETURN only a brief summary** (not the full map). Your summary should include:
- Source name and DP count
- Coverage percentage (relevant to ideas / total DPs)
- Top 3-5 Active Idea connections (idea number and one sentence)
- Count of new themes identified
- The exact filepath you saved to
- List of Convex DP IDs that are "Relevant to Active Ideas" (from the data provided below)

Do NOT return the full relevance map content. The saved file is the deliverable.

---

You are analyzing extraction file: [path_to_extraction]

Your task: Read the extraction file, then create a DP Relevance Map that maps each data point (DP) to the CRIS research system. Save the map to the path specified above.

## Context Files You Need:

**Active Ideas (condensed):**
[paste condensed Active Ideas: idea number, title, and 1-2 sentence summary each]

**Open Threads:**
[paste Open Threads list: thread number and title]

**Tags:**
[paste tag list or key tags only]

**Convex Data Points for this week (from get_week_data_points):**
[paste the structured DP list from the MCP call — each entry includes: convexId, claimText, anchorQuote, tags, evidenceType, sourceName]

Use the `convexId` values when listing relevant DPs in your relevance map. The parent agent needs these IDs to persist synthesis to Convex.

## Your Deliverable: DP Relevance Map

Create a markdown document with these sections:

### 1. Relevant to Active Ideas

Table format:
| DP# | Convex ID | DP Summary | Relevant Idea(s) | How It Connects |

For each DP in the extraction:
- If it supports/challenges/extends an Active Idea, add a row
- Include the Convex ID from the data provided (e.g., `k570abc123...`)
- Explain HOW it connects (don't just restate the DP)
- Be specific about which aspect of the Idea it addresses

### 2. Relevant to Open Threads

Table format:
| DP# | DP Summary | Thread | Connection |

For each DP that addresses an open research question or thread.

### 3. New Themes (Not Covered by Current Ideas)

Table format:
| DP# | DP Summary | Proposed Theme |

Identify DPs that represent new territory not covered by existing Active Ideas.
These might become new Active Ideas.

### 4. Not Relevant (with reasoning)

Table format:
| DP# | Why Not Relevant |

DPs that don't map to current research focus. Brief explanation of why.

### 5. Coverage Summary

- **Total DPs in source:** [X]
- **Relevant to ideas:** [Y] DPs ([Z]%)
- **Relevant to threads:** [Y2] DPs (allows overlap)
- **New themes:** [N]
- **Not relevant:** [X-Y] DPs

### 6. Critical Patterns and Strategic Implications

Write 2-4 paragraphs analyzing:
- What patterns emerge across the DPs?
- What strategic insights does this source contribute?
- How does this source change or strengthen existing understanding?
- What convergences with other sources do you see?

## Quality Standards:

- Be specific in "How It Connects" - explain the mechanism, don't just restate
- Look for CONVERGENCE (multiple DPs supporting same idea) - that's high signal
- Look for TENSION (DPs that challenge existing ideas) - that's valuable
- Identify GAPS (what the source doesn't cover that you'd expect)

## Final Step:

Save the complete DP Relevance Map to the EXACT path specified at the top of this prompt. Then return ONLY the brief summary described above.
```

**Important:** Spawn ALL sub-agents in PARALLEL using a single message with multiple Task tool calls. This enables concurrent analysis and dramatically speeds up the process.

### Step 6: Collect Sub-Agent Outputs

As each sub-agent completes:
1. Validate the DP Relevance Map structure (all required sections present)
2. Check coverage percentages (aim for >70% relevance)
3. Note any issues or incomplete sections

---

## Phase 3: Save DP Relevance Maps

### Step 7: Save Each Relevance Map

For each completed DP Relevance Map:

**Filename format:** `[SourceName]_[Slug]_relevance.md`

**Location:** `[CRIS_ROOT]/_System/working/relevance_maps/`

**Example:**
```bash
# Source: FinancialTimes_MustafaSuleymanAI_2026-02-13.md
# Relevance Map: FinancialTimes_MustafaSuleymanAI_relevance.md
```

**Validation before saving:**
- ✅ All 6 required sections present
- ✅ Coverage Summary calculated
- ✅ Critical Patterns section has substantive analysis (not just summary)
- ✅ Filename matches source (drop date from relevance map filename)

### Step 8: Verify All Files Saved

```bash
# List all newly created relevance maps
ls -lh [CRIS_ROOT]/_System/working/relevance_maps/

# Verify count matches number of sources analyzed
```

---

## Phase 4: Report Summary

### Step 9: Generate Analysis Summary

**Report to user:**

```
✅ CRIS Analysis Complete (Session 1)

Sources Analyzed: [X]
DP Relevance Maps Created: [Y]

Coverage Statistics:
- Average relevance: [Z]%
- Total DPs processed: [N]
- DPs relevant to ideas: [N1]
- DPs relevant to threads: [N2]
- New themes identified: [N3]

High-Impact Sources (>80% relevance):
- [Source1]: [%]
- [Source2]: [%]

New Themes Identified:
- [Theme 1]: from [Source]
- [Theme 2]: from [Source]

Location: _System/working/relevance_maps/

✅ Ready for Session 2: cris-write-learnings
```

### Step 10: Update Weekly Header (Optional)

If `_Weekly_Header.md` exists, you may update it with:
```markdown
**Session 1 Status:** ✅ Complete
**Sources Analyzed:** [X]
**Relevance Maps Created:** [Y]
**Date Completed:** [YYYY-MM-DD]
```

---

## Validation Checks

Before completing, verify:

**Prerequisites Met:**
- ✅ Active Ideas file exists and was loaded
- ✅ Tags file exists and was loaded
- ✅ Extraction Index identified sources correctly

**Outputs Valid:**
- ✅ All DP Relevance Maps saved to correct location
- ✅ Each map has all 6 required sections
- ✅ Coverage percentages calculated
- ✅ Critical Patterns sections have substantive analysis

**Quality Indicators:**
- ✅ Average coverage >60% (if lower, may indicate mismatch between sources and research focus)
- ✅ New themes identified (indicates sources expanding research territory)
- ✅ Multiple sources converging on same ideas (validates ideas)

---

## Common Issues and Solutions

**Issue:** Sub-agent saves relevance map to wrong location (e.g., extraction directory)
- **Root cause:** Save instructions buried at bottom of prompt lose salience when sub-agents process large extractions. The sub-agent reads from the extraction directory and defaults to saving nearby.
- **Solution:** The prompt template now places save instructions FIRST with explicit negative constraints ("Do NOT save to 02_Extractions/"). Always verify file locations after all sub-agents complete.

**Issue:** Context compaction / loss of sub-agent results
- **Root cause:** 28 sub-agents each returning full relevance maps (10-30KB) floods the parent conversation context (~400-500KB total), triggering compaction. Inline results are lost.
- **Solution:** The prompt template now instructs sub-agents to return ONLY a brief summary (source name, coverage %, top connections, filepath). The full map is persisted to disk by the sub-agent. This reduces return payload from ~400KB to ~14KB for 28 agents.
- **Verification:** After all sub-agents complete, always run a file count check on `_System/working/relevance_maps/` to confirm all maps were saved before proceeding to Phase 3.

**Issue:** Sub-agent produces incomplete Relevance Map
- **Solution:** Check if context was too large. Provide condensed Active Ideas (title + 1-2 sentence summary each) instead of full content with evidence tables.

**Issue:** Coverage percentages very low (<40%)
- **Solution:** May indicate sources outside current research focus. Consider whether Active Ideas need expansion or sources are off-topic.

**Issue:** Sub-agents taking very long (>5 min each)
- **Solution:** Reduce context size in prompt. Focus on just Active Idea titles and 1-2 sentence summaries.

**Issue:** "Not Relevant" section very large
- **Solution:** Normal for some sources. Document why DPs aren't relevant - this is valuable negative information.

**Issue:** Hardcoded session paths break across sessions
- **Solution:** All paths in this skill use `[CRIS_ROOT]` as a variable. Resolve to actual mounted path at runtime.

---

## Notes for User

**Time Estimates:**
- Light week (3-5 sources): 30-45 min
- Normal week (6-15 sources): 45-90 min
- Heavy week (16-30 sources): 90 min-2 hours

**Parallelization:** The key efficiency gain comes from spawning all sub-agents at once. Don't wait for one to finish before starting the next.

**Output Location:** DP Relevance Maps are intermediate files. After Session 3 completes, you can archive or delete them - they're not part of the permanent research system.

**Next Step:** Run `cris-write-learnings` (Session 2) to synthesize these DP Relevance Maps into Weekly Learnings.
