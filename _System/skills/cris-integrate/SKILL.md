# CRIS Integrate Skill (Session 3: Active Ideas + Current Synthesis + Talking Points)

**Purpose:** Integrate Weekly Learnings into Active Ideas, archive and rewrite Current Synthesis, generate conversation-ready Talking Points, and update User Observations with new evidence and practitioner insights.

**When to use:** After completing `cris-write-learnings` (Session 2). This skill completes the full synthesis cycle by updating all strategic documents.

---

## Workflow Overview

This skill implements Phase 4-5 of the CRIS Weekly Synthesis workflow:
- **Phase 4:** Update Active Ideas with new evidence, add Evolution Log entries
- **Phase 5:** Archive old Current Synthesis, write new one; generate new Talking Points; update User Observations

**Key Principle:** Weekly Learnings is the input. We're translating synthesis into strategic positioning documents. User Observations capture practitioner-derived insights that complement extraction-based evidence.

---

## Phase 1: Prerequisites Validation

### Step 1: Verify Session 2 Completed

**Check for Weekly Learnings:**

```bash
# Find most recent Weekly Learnings file
ls -t /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/2026-Q1/WL_*.md | head -1

# Verify it's the one we need
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/_Weekly_Header.md
```

**Validation:**
- ✅ Weekly Learnings exists for current week
- ❌ If not found: ERROR - "No Weekly Learnings found. Run cris-write-learnings (Session 2) first."

### Step 2: Confirm Date for Archives

**Ask user:**
```
I found Weekly Learnings: WL_YYYY-MM-DD.md
I'll use this date (YYYY-MM-DD) for archiving Current Synthesis and Talking Points.
Proceed?
```

---

## PART A: Update Active Ideas

### Step 3: Read Required Files

```bash
# Read latest Weekly Learnings
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/2026-Q1/WL_[DATE].md

# Read current Active Ideas
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/Active_Ideas.md
```

### Step 4: Extract Changes from Weekly Learnings

**Task:** Find the "Updates Made to Current Understanding" section in Weekly Learnings.

**Parse:**
- Which Active Ideas were modified?
- Which were strengthened vs. challenged vs. expanded?
- What new evidence was added?
- Any new Active Ideas proposed?

### Step 5: Update Each Active Idea

For each Active Idea that changed:

#### A. Update Current Position (if changed)

If the core thesis evolved, rewrite the "Current Position" section.

#### B. Add New Evidence to Supporting Evidence Table

**Add rows to the Supporting Evidence table:**

```markdown
| Evidence | Source(s) | Type | Quality |
|----------|-----------|------|---------|
| [New DP summary] | [SourceName DP#] `<!-- cite:path=... -->` | Empirical/Anecdotal | High |
```

**Important:** Include metadata comment in the Source(s) cell for each citation.

#### C. Add Evolution Log Entry

**Add entry at TOP of Evolution Log:**

```markdown
### Evolution Log

- **[YYYY-MM-DD]:** [Brief description of change]. Evidence from [SourceName, SourceName2]. [Strengthened/Expanded/Refined/Challenged]

- **[Previous date]:** ...
```

**Example:**
```markdown
- **2026-02-12:** Strengthened with Agent Teams productionization evidence. AI Jason's reverse-engineering confirms planner-worker hierarchy is now first-party SDK feature, not experimental pattern. Evidence from AI_Jason_ClaudeCodeAgentTeams, Anthropic_CCompilerParallelClaudes.
```

### Step 6: Handle New Active Ideas

If Weekly Learnings identified "New Themes" that should become Active Ideas:

**Prompt user:**
```
Weekly Learnings identified [X] new themes:
1. [Theme Name]: [Brief description]
2. [Theme Name]: [Brief description]

Should I add these as new Active Ideas? (y/n for each)
```

**If yes:** Add new Active Idea entry with structure:
```markdown
## Idea [N]: [Idea Name]

**Status:** New
**Confidence:** Low (newly identified)

### Current Position

[Write 2-3 sentence thesis based on new theme from Weekly Learnings]

### Drivers

[Identify 2-3 key drivers]

### Supporting Evidence

| Evidence | Source(s) | Type | Quality |
|----------|-----------|------|---------|
| [Initial evidence from Weekly Learnings] | [cite] | ... | ... |

### Evolution Log

- **[YYYY-MM-DD]:** Identified as new Active Idea based on convergent evidence from [sources].
```

### Step 7: Save Updated Active Ideas

```bash
# Save in place (overwrite)
# File: /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/Active_Ideas.md
```

**Report to user:**
```
✅ Active Ideas Updated

Modified: [X] ideas
New: [Y] ideas
Evolution Log entries added: [Z]
```

---

## PART B: Archive and Rewrite Current Synthesis

### Step 8: Archive Old Current Synthesis

```bash
# Copy current synthesis to archive with date
cp /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/Current_Synthesis.md \
   /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/archive/Current_Synthesis_YYYY-MM-DD.md
```

**Verify archive created:**
```bash
ls -lh /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/archive/Current_Synthesis_*.md | tail -1
```

### Step 9: Load Context for New Current Synthesis

**Read ALL Weekly Learnings from current quarter:**

```bash
# Read all Q1 2026 Weekly Learnings
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/2026-Q1/WL_*.md
```

**Read updated Active Ideas:**

```bash
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/Active_Ideas.md
```

**Read previous Current Synthesis (archived)** for structure reference:

```bash
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/archive/Current_Synthesis_YYYY-MM-DD.md
```

### Step 10: Write New Current Synthesis

**Structure:**

```markdown
# Current Synthesis

**Last Updated:** [YYYY-MM-DD]

## Summary

[Write 3-4 paragraphs synthesizing the BIG PICTURE across all research]

Key elements:
- Current state of the field
- Major convergences across sources
- Primary tensions or unresolved questions
- Strategic implications

**Use citations:** Reference Weekly Learnings DPs with metadata comments.

## Key Takeaways

**[Number each takeaway, typically 10-12 total]**

### 1. [Takeaway Title]

[2-3 paragraph explanation with evidence]

[Citations with metadata comments]

### 2. [Takeaway Title]

[Continue for all major takeaways]

## Active Ideas

| Idea | Status | Core Thesis | Confidence | Key Evidence |
|------|--------|------------|------------|--------------|
| 1. [Name] | [Confirmed/Developing/etc.] | [One sentence] | [High/Medium/Low] | [Brief evidence summary] |
| 2. [Name] | ... | ... | ... | ... |

## Open Threads

1. **[Thread Name]** — [Description and why it matters]

2. **[Thread Name]** — [Description]

[Continue for all open threads]

## Evidence Base

- **[X] extractions** across [Y] thematic clusters
- **Approximately [Z] data points** from research sampling
- **[N] user observations** providing qualitative validation
- **[M] active ideas** ([breakdown by status])
- **[T] open threads** emerging from research landscape
- **Coverage:** [%] of available DPs cited
- **[Notable patterns or phase transitions]**

## What's Changed Since Last Synthesis

[Document major changes from previous synthesis:]

- New ideas added: [list]
- Ideas that changed status: [list]
- Evidence base growth: [metrics]
- Major reframes or insights: [list]
- Coverage improvements: [metrics]
```

**Quality Standards:**
- Follow Style Guide (no em dashes, Oxford comma, direct voice)
- Follow Data Normalization (Level 2+ metrics)
- All citations need metadata comments
- Write for strategic audience (executives, decision-makers)

### Step 11: Save New Current Synthesis

```bash
# Save in place
# File: /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/Current_Synthesis.md
```

---

### Step 11B: Sync Active Ideas to Convex via MCP

After saving the updated `Active_Ideas.md`, call `update_idea` for each Active Idea that changed this week. This creates or updates the structured Idea record in Convex with typed evidence citations.

**For each modified Active Idea:**

```
update_idea({
  ideaId: "[existing Convex ideaId if updating, omit if creating new]",
  title: "[Idea title]",
  currentPosition: "[Updated 2-3 sentence thesis from Active_Ideas.md]",
  status: "active" | "confirmed" | "challenged" | "emerging",
  tags: ["tag-slug-1", "tag-slug-2"],
  evidence: [
    {
      evidenceDescription: "[One sentence describing this evidence]",
      citedDataPointIds: ["convexId1", "convexId2"]
    },
    ...
  ],
  counterarguments: [
    {
      argument: "[Counter position text]",
      citedDataPointIds: ["convexId3"]
    }
  ]
})
```

**Record returned `ideaId`** for each idea and note it in `Active_Ideas.md`:
```markdown
**Convex ID:** [ideaId]
```

**How to get `citedDataPointIds`:** Use the Convex IDs from the relevance maps (Session 1 output) or call `search_knowledge_base` to find DPs that match the evidence description.

**Fallback — if Convex IDs are unavailable:** Skip the `citedDataPointIds` for now, pass `[]`, and use `add_curator_note` to flag for later re-linking:
```
add_curator_note({
  entityType: "idea",
  entityId: "[ideaId]",
  noteText: "Evidence citations need re-linking from WL_[DATE].md",
  noteType: "todo"
})
```

The legacy `poc/scripts/validate_citation_contract.py` is no longer required. Convex validates citation integrity at write time via typed ID validation.

## PART C: Generate Talking Points

### Step 12: Read Context for Talking Points

```bash
# Read new Current Synthesis
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/Current_Synthesis.md

# Read latest Weekly Learnings
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/2026-Q1/WL_[DATE].md

# Read previous Talking Points for format consistency
ls -t /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/09_Deliverables/Talking_Points/*.md | head -1
```

### Step 13: Identify 3-5 Strategic Insights

**Task:** Extract the most conversation-ready insights from Current Synthesis + Weekly Learnings.

**Criteria for good Talking Points:**
- Counterintuitive or surprising (not obvious)
- Actionable for specific audiences
- Backed by strong evidence
- Relevant to current professional context (job search, consulting)
- Maicol can speak to from experience

**Examples:**
- "The 85% use case desert isn't a capability problem - it's a five-dimensional gap"
- "Four timelines are colliding, not two"
- "Agents are coworkers, not tools - that changes everything"

### Step 14: Write Each Talking Point

**Structure for each Talking Point:**

```markdown
## Talking Point [N]: [Title]

### The Point

[2-3 sentences: What's the core insight?]

### Why It Matters

[Bullet points: Why should anyone care?]
- [Impact 1]
- [Impact 2]
- [Impact 3]

### Who Cares

| Audience | Their Angle |
|----------|------------|
| [Audience 1] | [Why they care] |
| [Audience 2] | [Why they care] |
| [Audience 3] | [Why they care] |

### Evidence

- **Key stat:** [Most compelling data point]
- **Source credibility:** [Where this comes from]
- **Supporting data:** [Additional evidence with citations]

### Your Angle

[Maicol's personal perspective - how does his experience validate/illuminate this?]

Examples:
- "I've spent 24 years doing this work..."
- "I watched this unfold at Capital Group firsthand..."
- "This is my current lived experience..."

### Pivot Phrases

[Conversation starters for this talking point]
- "[Opening phrase that invites dialogue]"
- "[Follow-up that deepens the topic]"
- "[Reframe that challenges assumptions]"
```

### Step 15: Complete Talking Points Document

**Full structure:**

```markdown
# Talking Points: [Title/Theme]
**Date:** [YYYY-MM-DD]
**Speaker:** Maicol Parker-Chavez, Product + Innovation Strategist
**Synthesis Base:** [X] sources, [Date range]

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

[Full Talking Point 1]

---

[Full Talking Point 2]

---

[Continue for all talking points]

---

## Conversation Starters

1. **"[Question that opens dialogue]"**
   [Brief context on why this works]

2. **"[Question that opens dialogue]"**
   [Brief context]

[Continue for 5-8 conversation starters]

---

## This Week's Sources

| Source | Type | Date | Key Contribution | DP Refs |
|--------|------|------|------------------|---------|
| [Source] | [Type] | [Date] | [Contribution] | [DPs] |

---

## Notes for Next Week

### Themes to Deepen
[List themes that need more development]

### Talking Points Ready for Delivery
[Status update on readiness]

### Audience Calibration
[Notes on who these are for]

### Next Deliverable
[Recommendations for future work]
```

### Step 16: Archive Old Talking Points and Save New

```bash
# Archive old Talking Points
mv /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/09_Deliverables/Talking_Points/TP_[OLD_DATE].md \
   /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/09_Deliverables/Talking_Points/archive/

# Save new Talking Points
# File: /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md
```

### Step 16A: Sync Talking Points to Convex via MCP

After saving the markdown Talking Points file, call `update_talking_point` for each talking point. This persists the structured version to Convex with typed evidence citations and audience data.

**For each talking point (3-5 per synthesis):**

```
update_talking_point({
  talkingPointId: "[existing Convex ID if updating, omit if creating new]",
  title: "[Talking Point title]",
  coreMessage: "[2-3 sentence core insight from 'The Point' section]",
  audiences: [
    {
      audienceName: "[e.g. 'Enterprise AI Leaders']",
      audienceConcern: "[Their angle / what they care about]",
      hook: "[The opening hook for this audience]"
    },
    ...
  ],
  evidence: [
    {
      evidenceText: "[Key stat or evidence description]",
      citedDataPointIds: ["convexId1", "convexId2"]
    },
    ...
  ],
  pivotPhrases: [
    {
      phrase: "[Opening phrase from 'Pivot Phrases' section]",
      context: "[When to use this phrase]"
    },
    ...
  ]
})
```

**Record returned `talkingPointId`** for each talking point and add to the markdown file:
```markdown
**Convex ID:** [talkingPointId]
```

**How to get `citedDataPointIds`:** Pull from the relevance maps (Session 1) or call `search_knowledge_base` with the key stat text to find matching DPs.

---

## PART D: Update User Observations

### Step 16B: Read Context for User Observations

```bash
# Read current User Observations
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/06_Current_Understanding/User_Observations.md

# Re-read Weekly Learnings (focus on three sections)
# 1. "Personal Perspective" section — primary source for new observations
# 2. "Personal Observations Integrated" section — which existing observations were reinforced
# 3. "Reflection" section — may contain practitioner-derived insights
cat /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/03_Weekly_Learnings/2026-Q1/WL_[DATE].md
```

### Step 16C: Identify New Observations

**Task:** Check the Weekly Learnings "Personal Perspective" and "Reflection" sections for practitioner-derived insights that qualify as User Observations.

**Criteria for new User Observations:**
- Derived from lived professional experience or practitioner synthesis (not just quoting sources)
- Represents a framework, mental model, or pattern recognition that published sources do not capture
- Has supporting evidence from extractions but the insight itself comes from practice
- Actionable for professional positioning (job search, consulting, portfolio)

**If new observations found, prompt user:**
```
I identified [X] candidate(s) for new User Observations:
1. [Observation title]: [Brief description]

Should I add these? (y/n for each)
```

**If yes, add new observation with standard structure:**
```markdown
### Observation [N]: [Title]

**Date Added:** [YYYY-MM-DD]
**Status:** Hypothesis
**Context:** [Source context]
**Integrated Into:** [Related Active Ideas]

**The Observation:**
[2-3 paragraph description]

**Key Insights:**
1. [Insight]
2. [Insight]
3. [Insight]

**Supporting Evidence from Extractions:**
- [Citations with DP references]

**Open Questions:**
- [Question]
```

### Step 16D: Update Existing Observations with New Evidence

**Task:** For each existing observation, check whether this period's Weekly Learnings contains reinforcing or challenging evidence.

**Sources of reinforcement:**
1. The WL "Personal Observations Integrated" section explicitly lists reinforced observations
2. Each tag synthesis "Connection to Current Understanding" block may contain evidence relevant to existing observations
3. The "Updates Made to Current Understanding" section shows which ideas evolved, and observations linked to those ideas likely have new evidence

**For each reinforced observation, add a dated reinforcement block:**

```markdown
**[Month Day] Reinforcement:** [2-4 sentences describing what new evidence adds]. [Citations with DP references]
```

**Place the reinforcement block** immediately before the "Open Questions" section of the relevant observation.

**Optionally add new open questions** if the new evidence raises them.

### Step 16E: Update Metadata

**Update User Observations header:**
```markdown
**Last Updated:** [YYYY-MM-DD] (v[N] — [X] Active Observations)
```

**Update _Index.md User Observations table:**
- Add any new observations to the table
- Update "Integrated Into" column for observations with new idea connections
- Update "Status" if evidence warrants (e.g., Hypothesis → Active)
- Update Total Active Observations count

**Update _Index.md Quick Stats:**
- Update "Total User Observations" count

**Update _Index.md Recent Activity:**
- Add row for User Observations update

**Report to user:**
```
✅ User Observations Updated

New observations: [X]
Existing observations reinforced: [Y]
New open questions added: [Z]
```

---

## Phase 8: Final Report and Cleanup

### Step 17: Update System Files

**Update _Weekly_Header.md:**

```markdown
**Current Week:** Week ending [YYYY-MM-DD]
**Status:** ✅ SYNTHESIS COMPLETE (All 3 sessions)
**Last Updated:** [YYYY-MM-DD]

---

## Session 1: Analysis ✅
- Sources analyzed: [X]
- DP Relevance Maps: [Y]

## Session 2: Weekly Learnings ✅
- File: WL_YYYY-MM-DD.md
- Tags processed: [Z]

## Session 3: Integration ✅
- Active Ideas updated: [N]
- Current Synthesis: Refreshed
- Talking Points: Generated

---

**Next Synthesis:** Week ending [NEXT_DATE]
```

### Step 18: Automatic Cleanup of DP Relevance Maps

**Purpose:** DP Relevance Maps are intermediate work product from Session 1. After synthesis completes, they're no longer needed and should be removed to keep the system clean.

**Task:** Automatically delete all DP Relevance Map files from the current month's extractions:

```bash
# Find and delete all DP Relevance Map files
find /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/02_Extractions/2026-02/ \
  \( -name "*_DP_MAP.md" -o -name "*_DP_RELEVANCE_MAP.md" \) \
  -type f -delete

# Count deleted files (optional verification)
DELETED_COUNT=$(find /Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/02_Extractions/2026-02/ \
  \( -name "*_DP_MAP.md" -o -name "*_DP_RELEVANCE_MAP.md" \) | wc -l)

# Report to user
if [ $DELETED_COUNT -eq 0 ]; then
  echo "✅ Cleanup complete: No orphaned DP Relevance Maps found"
else
  echo "⚠️ Cleanup: Found and deleted $DELETED_COUNT DP Relevance Map files"
fi
```

**Why this happens automatically:**
- Maps serve only the synthesis workflow (Session 1→2→3)
- They're never referenced in final outputs (Active Ideas, Current Synthesis, Talking Points)
- They're not archived from previous weeks (no historical value)
- Leaving them behind creates confusion and wastes filesystem space
- Automatic cleanup prevents the 32k context-limit issue from leaving orphaned files

### Step 18B: Verify Convex Sync Checklist

Before marking synthesis complete, confirm all MCP calls succeeded:

- ✅ **Weekly Learning:** `weeklyLearningId` recorded in WL markdown header
- ✅ **Active Ideas:** `ideaId` recorded for each updated idea in Active_Ideas.md
- ✅ **Talking Points:** `talkingPointId` recorded for each TP in TP_YYYY-MM-DD.md
- ✅ **Curator Notes:** Any `convex_synced: false` flags have been noted for follow-up

If any item is missing due to unavailable Convex IDs, use `add_curator_note` to flag the entity for re-linking rather than blocking completion.

The legacy `poc/scripts/prepublish_lineage_gate.sh` is no longer required. Convex enforces citation integrity natively at write time via typed ID validation — if `save_data_points`, `update_idea`, or `update_talking_point` succeeded without errors, citations are valid.

### Step 19: Generate Completion Report

**Report to user:**

```
✅✅✅ CRIS SYNTHESIS COMPLETE (All 3 Sessions) ✅✅✅

Week Ending: [YYYY-MM-DD]

SESSION 1 (cris-analyze):
- Sources analyzed: [X]
- DP Relevance Maps created: [Y]

SESSION 2 (cris-write-learnings):
- Weekly Learnings: WL_YYYY-MM-DD.md
- Tags processed: [Z]
- DPs synthesized: [N]

SESSION 3 (cris-integrate):
- Active Ideas: [M] updated (Convex IDs recorded)
- Current Synthesis: Refreshed and archived
- Talking Points: [T] strategic insights (Convex IDs recorded)
- User Observations: [U] new, [V] reinforced
- DP Relevance Maps: Cleaned up automatically
- Archives created: [list]
- Convex synced: Weekly Learning + [M] ideas + [T] talking points

KEY DELIVERABLES:
📄 Active Ideas (updated)
📄 Current Synthesis (new)
📄 Talking Points (ready for use)
📄 User Observations (updated)
📄 Weekly Learnings (archived)

NEXT STEPS:
1. Review Talking Points for upcoming conversations
2. Identify sources for next synthesis cycle
3. Run cris-extract for any pending raw inputs

System is ready for next weekly cycle.
```

---

## Validation Checks

**Prerequisites:**
- ✅ Weekly Learnings exists and was loaded
- ✅ Active Ideas loaded
- ✅ Previous archives exist

**Output Quality:**
- ✅ All Active Ideas Evolution Logs have dated entries
- ✅ Active Ideas synced to Convex via `update_idea` (ideaIds recorded)
- ✅ Talking Points synced to Convex via `update_talking_point` (talkingPointIds recorded)
- ✅ Old files properly archived with dates
- ✅ _Weekly_Header.md updated

**Completeness:**
- ✅ All four deliverables created (Active Ideas, Current Synthesis, Talking Points, User Observations)
- ✅ Archive copies created with correct dates
- ✅ System files updated
- ✅ User Observations reinforced with new evidence and any new observations added
- ✅ Convex sync checklist passed (weeklyLearningId + ideaIds + talkingPointIds all recorded)

---

## Common Issues and Solutions

**Issue:** Can't determine which Active Ideas to update
- **Solution:** Re-read Weekly Learnings "Updates Made to Current Understanding" section. It should explicitly list which ideas changed.

**Issue:** Current Synthesis feels repetitive with Weekly Learnings
- **Solution:** Current Synthesis should be HIGHER LEVEL and more strategic. Weekly Learnings has detail; Current Synthesis has big picture.

**Issue:** Talking Points sound too academic
- **Solution:** Read previous Talking Points for voice. They should sound like conversation prep, not research papers. Use "Your Angle" to add personal perspective.

**Issue:** Archives overwriting each other
- **Solution:** Always use YYYY-MM-DD format for archive filenames. Verify date before saving.

---

## Time Estimates

- Light week (few updates): 1.5-2 hours
- Normal week (moderate updates): 2-3 hours
- Heavy week (major reframes): 3-4 hours

**Key Efficiency:** Parts A, B, C can be done in sequence. Most time goes to rewriting Current Synthesis (it's the most strategic document).

---

## Notes for User

**Strategic Documents:** This session produces the documents you actually USE:
- Active Ideas: Your research positions with evidence
- Current Synthesis: Big-picture understanding
- Talking Points: Conversation-ready insights
- User Observations: Practitioner-derived frameworks that complement extraction evidence

**Archives Matter:** Always archive old versions. They preserve history and show evolution.

**Talking Points Are Deliverables:** These are what you use in conversations, interviews, consulting calls. They translate research into positioning.

**Cycle Complete:** After this session, the weekly synthesis cycle is complete. Start fresh next week with cris-analyze (Session 1).
