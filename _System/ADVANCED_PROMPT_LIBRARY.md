# CRIS Operations Guide

**Purpose:** Centralized guide for all CRIS research operations - Skills (recommended) and Legacy Prompts (fallback)

**Last Updated:** February 24, 2026

---

## ⚡ Recommended: Use CRIS Skills

**Skills are the recommended way to run CRIS operations.** They provide structured workflows with built-in validation, quality checks, and error handling.

### **Extraction Skill**

```
Read and follow: _System/skills/cris-extract/SKILL.md
```

**What it does:** Automated extraction with parallel processing, filename validation, tracker updates. Now also registers each source in Convex via `upload_source_file` and persists all data points via `save_data_points`. Returns Convex IDs (sourceId, DP IDs) for downstream citation linking.

---

### **Snapshot Skill**

```
Read and follow: _System/skills/cris-snapshot/SKILL.md
```

**What it does:** Generates a single self-contained HTML file of the current CRIS state — Pulse, Ideas, and Talking Points views with fully working citations. Anyone can open it in a browser with no server or installation required.

**When to use:** Any time you want to share CRIS content with someone outside the system (via email, Slack, etc.)

**Time:** ~30 seconds

**Output:** `CRIS_Research_System/CRIS_Snapshot_YYYY-MM-DD.html` (~5 MB)

---

### **Three-Session Synthesis Workflow**

The synthesis workflow is split across three sessions to prevent shallow analysis:

#### **Session 1: Deep Analysis (cris-analyze)**

```
Read and follow: _System/skills/cris-analyze/SKILL.md
```

**What it does:** Spawns parallel sub-agents to create DP Relevance Maps (one per source). Now opens by pulling the week's DPs from Convex via `get_week_data_points`, and runs `search_knowledge_base` for each Active Idea to surface cross-week evidence. Sub-agent relevance maps include Convex DP IDs for downstream citation.

**Time:** 45 min - 3 hours depending on source count

---

#### **Optional: Linguistic Mining (cris-linguistic-mining)**

```
Read and follow: _System/skills/cris-linguistic-mining/SKILL.md
```

**What it does:** Mines 7 linguistic categories (frameworks, analogies, terms, comparisons, provocations, anti-patterns, numerical rules) from weekly extractions. Organizes by source with 4-dimensional credibility scoring. Generates weekly additions file (LA_YYYY-MM-DD.md) and Session 3 update instructions.

**When to run:** Between Session 1 and Session 2, or standalone for retroactive processing

**Time:** 45-60 minutes for 40-60 sources (parallel sub-agents)

**Outputs:**
- `09_Deliverables/Language_Assets/_weekly_additions/LA_YYYY-MM-DD.md`
- `09_Deliverables/Language_Assets/_pending_updates/LA_YYYY-MM-DD_update_instructions.md`

**Quick prompts:**
- Standard: `Run cris-linguistic-mining for this week`
- Mid-week: `Run cris-linguistic-mining mid-week check`
- Retroactive: `Run cris-linguistic-mining for week ending 2026-02-08`

---

#### **Session 2: Write Learnings (cris-write-learnings)**

```
Read and follow: _System/skills/cris-write-learnings/SKILL.md
```

**What it does:** Synthesizes DP Relevance Maps into Weekly Learnings with style/citation enforcement. Now also persists the finished Weekly Learning to Convex via `create_weekly_learning` (themes with cited DP IDs). Returns a `weeklyLearningId` recorded in the WL document header.

**Time:** 1 - 4 hours depending on synthesis depth

---

#### **Session 3: Strategic Integration (cris-integrate)**

```
Read and follow: _System/skills/cris-integrate/SKILL.md
```

**What it does:** Updates Active Ideas, archives/rewrites Current Synthesis, generates Talking Points. Now also persists each modified Active Idea via `update_idea` and each Talking Point via `update_talking_point`. Returns `ideaId` and `talkingPointId` values that get recorded in the markdown files for future updates.

**Time:** 1.5 - 4 hours depending on updates

---

---

### **Monthly Synthesis (Two-Session)**

Run at the end of each calendar month after all weekly cycles are complete.

#### **Session 1: Monthly Mapping (cris-monthly-map)**

```
Read and follow: _System/skills/cris-monthly-map/SKILL.md
```

**What it does:** Reads all canonical Weekly Learnings for the month, produces a Monthly Analysis Map with theme trajectories, idea evolution arcs, open thread assessments, evidence base statistics, and tag evolution.

**When to run:** After all weekly synthesis cycles for the month are marked complete in `_Weekly_Header.md`

**Time:** 45-90 minutes depending on month volume

**Output:** `_System/working/monthly/MA_YYYY-MM.md`

---

#### **Session 2: Write Monthly Synthesis (cris-monthly-write)**

```
Read and follow: _System/skills/cris-monthly-write/SKILL.md
```

**What it does:** Uses the Monthly Analysis Map to write the Monthly Synthesis narrative document and a set of Monthly Talking Points. Applies full quality stack (Style Guide, Data Normalization, Citation Contract). Updates Monthly Index.

**Time:** 1.5-4 hours depending on month depth

**Outputs:**
- `04_Monthly_Synthesis/YYYY/MS_YYYY-MM.md` — Strategic narrative, cites Weekly Learnings (not extraction DPs)
- `09_Deliverables/Talking_Points/MT_YYYY-MM.md` — Monthly Talking Points (coexists alongside weekly TPs)
- `04_Monthly_Synthesis/YYYY/_Index.md` — Updated

**Key distinction from weekly:** Monthly Synthesis operates at the compression chain layer above weekly. It cites WL files, not individual extraction data points.

---

### **Why Use Skills?**

✅ Built-in prerequisite validation (won't run out of order)
✅ Automatic quality checks (Style Guide, Citation Contract, Data Normalization)
✅ Error handling and recovery workflows
✅ Progress reporting at each phase
✅ Time estimates for planning
✅ Prevents shallow analysis through session separation

**See:** `_System/skills/README.md` for complete usage guide and workflow diagrams

---

## 🔍 Convex Knowledge Base

**What it is:** A live cloud database (Convex) that backs the entire CRIS system. As of March 2026 it holds 3,517+ data points with full vector embeddings, all ingested sources, and synthesized artifacts (Weekly Learnings, Active Ideas, Talking Points). All four Skills write to Convex automatically. You can also query it directly at any time.

**Why it matters:** You can semantically search your entire knowledge base across all weeks and all sources with a plain-English question. Results surface relevant DPs even when your query words do not exactly match the original text.

---

### Semantic Search

**When to use:** Any time you want to find relevant evidence before a call, interview, or writing session without knowing which sources or weeks to look in.

**Standard search:**

```
Search my knowledge base for: [your topic or question]
```

**Examples:**

```
Search my knowledge base for: enterprise AI adoption barriers at Fortune 500s
```

```
Search my knowledge base for: agentic workflows replacing knowledge worker tasks
```

```
Search my knowledge base for: evidence that AI reduces meeting time or coordination costs
```

**With evidence type filter:**

```
Search my knowledge base for evidence that AI adoption is slowing. Filter to: empirical evidence only.
```

**With tag filter:**

```
Search my knowledge base for agentic workflow examples. Filter to tags: #agentic-workflows, #enterprise-readiness
```

**What you get back:** Up to 10 semantically matched data points, each with claimText, anchorQuote, source info, evidenceType, and tags. Results rank by vector similarity.

**Evidence types available for filtering:**

- `empirical` — measured data, studies, surveys
- `data_metric` — specific numbers, percentages, statistics
- `case_study` — documented real-world examples
- `framework` — conceptual models and mental frameworks
- `prediction` — forward-looking claims
- `expert_opinion` — practitioner perspectives
- `anecdotal` — informal observations

---

### MCP Tools Reference

The 15 MCP tools are organized into four categories. Skills invoke these automatically, but you can call them directly for ad-hoc operations.

**Intake tools** (add sources to Convex):

| Tool | When to Use |
|------|-------------|
| `add_source_from_url` | Ingest a web article directly from a URL (fetches and parses automatically) |
| `add_source_from_text` | Add a source from pasted text with manually provided metadata |
| `upload_source_file` | Register a local file (PDF or markdown) and store its full text in Convex |

**Extraction tools** (extract and persist DPs):

| Tool | When to Use |
|------|-------------|
| `extract_data_points` | Returns source text and extraction prompt for a registered source |
| `save_data_points` | Saves extracted DPs to Convex with all fields, returns DP IDs |

**Query tools** (read and search):

| Tool | When to Use |
|------|-------------|
| `search_knowledge_base` | Semantic vector search across all 3,517+ DPs |
| `get_week_data_points` | Pull all DPs from a specific week by date range |
| `get_source` | Get full source metadata and all its DPs |
| `get_data_point` | Get a single DP with source context and tags |
| `get_data_point_usage` | See which Weekly Learnings, Ideas, and Talking Points cite a DP |
| `get_source_usage` | See how a source is referenced across all synthesis artifacts |

**Synthesis tools** (persist synthesis artifacts):

| Tool | When to Use |
|------|-------------|
| `create_weekly_learning` | Save a Weekly Learning with themes and cited DP IDs |
| `update_idea` | Create or update an Active Idea with evidence and counterarguments |
| `update_talking_point` | Create or update a Talking Point with audiences and pivot phrases |
| `add_curator_note` | Add a permanent annotation to any CRIS entity |

---

### Direct MCP Operations (Ad Hoc)

Use these prompts for one-off lookups outside the Skills workflow.

**Trace where a specific DP is cited downstream:**

```
Use get_data_point_usage for data point ID: [convexId]
```

**Look up a source and all its extracted DPs:**

```
Use get_source for source ID: [convexId]
```

**Annotate something you noticed about an entity:**

```
Add a curator note to [entity type] [ID]: "[Your observation]". Note type: observation
```

Note types: `observation`, `correction`, `connection`, `question`

**Pull a week's DPs for a quick review:**

```
Use get_week_data_points for the week of [YYYY-MM-DD] to [YYYY-MM-DD]
```

---

## 📝 Legacy: Prompt-Based Operations

**Use these prompts if:** Skills aren't working, you need more manual control, or you want to run custom variations.

**Note:** Prompts don't include validation checks or quality enforcement that Skills provide.

---

### 1️⃣ Initialize Session (Every New Chat)

```
Load CRIS system context for this session:

1. Read _System/cris/SKILL.md (system overview, workflows, and principles)
2. Read _System/SYSTEM_ARCHITECTURE_GUIDE.md (file purposes and architecture)

Confirm you understand these key CRIS principles:
- **Progressive disclosure:** Load index/header files first, drill into detail only when needed
- **Naming convention:** SourceName_DescriptiveSlug_YYYY-MM-DD.md (EXACTLY 2 underscores before date)
- **Writing standards:** Follow Style Guide + Data Normalization + Citation Contract for all synthesis
- **Primary reference:** Use _System/ADVANCED_PROMPT_LIBRARY.md for all operation prompts

After confirming, I'm ready for CRIS operations.
```

**Why:** Loads CRIS context into Claude's working memory. Required for each new chat session.

---

### 2️⃣ Extract New Files (Any Number, Any Size) ✅ DEFAULT

```
Extract all new files that haven't been processed yet.

**Instructions:**
1. Read _System/_extraction_tracker.json to identify pending files
2. If no pending files, scan 01_Raw_Inputs/ for untracked files and add them
3. Check file sizes and automatically group into optimal batches:
   - Small (<500 KB): batch 5-8 together
   - Medium (500 KB-3 MB): batch 3-5 together
   - Large (>3 MB): batch 2-3 together
   - Mixed sizes: create intelligent batches balancing load
4. For each batch, spawn parallel Task tool agents (one agent per file):
   - Each agent reads _System/Workflows/Extraction.md for atomic DP format
   - Each agent reads Tags.md for current tag vocabulary
   - Each agent extracts ONE assigned file
   - Each agent uses STRICT naming validation (see step 5 below)
   - Each agent returns: filename, DP count, new tag proposals

5. **FILENAME VALIDATION (CRITICAL - DO THIS BEFORE SAVING):**
   For each extraction file, validate the filename format:

   a) **Pattern check:**
      - Regex: ^[A-Z][a-zA-Z0-9]+_[A-Z][a-zA-Z0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$
      - Format: SourceName_DescriptiveSlug_YYYY-MM-DD.md
      - EXACTLY 2 underscores (both before the date)

   b) **Source name conversion (PascalCase, NO underscores):**
      - "Financial Times" → FinancialTimes (NOT Financial_Times)
      - "AI News Daily" → AINewsDaily (NOT AI_News_Daily)
      - "Every" → Every (already one word)
      - "TechCrunch" → TechCrunch (already PascalCase)
      - "a16z" → A16z (capitalize first letter)

   c) **Validation command:**
      echo "[filename]" | grep -E '^[A-Z][a-zA-Z0-9]+_[A-Z][a-zA-Z0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$'
      If this fails → STOP and show me the proposed filename for correction

   d) **Examples:**
      ✅ FinancialTimes_MustafaSuleymanAI_2026-02-13.md
      ✅ Every_ClaudeCodeFinance_2026-02-12.md
      ✅ A16z_AIAgentEconomy_2026-02-10.md
      ❌ Financial_Times_MustafaSuleymanAI_2026-02-13.md (3 underscores)
      ❌ FinancialTimes_Mustafa_Suleyman_AI_2026-02-13.md (5 underscores)
      ❌ financial-times_MustafaSuleymanAI_2026-02-13.md (lowercase, hyphen)

6. After all agents complete and ALL filenames validated:
   - Update _System/_extraction_tracker.json (status: "extracted", add dp_count)
   - Update 02_Extractions/_Extraction_Index.md
   - Consolidate tag proposals for confirmation
   - Report summary: files extracted, DPs captured, batch strategy used, any naming corrections made

**Atomic DP format requirements:**
- **DP#:** [Your interpretation]
- **Anchor:** "[Verbatim 5-15 word quote - must be Cmd+F searchable]"
- **Citation:** (p. XX)
- **Tags:** #existing-tag1, #existing-tag2

**Required metadata:**
- **Original Location:** 01_Raw_Inputs/... (relative path)

**Output location:** 02_Extractions/YYYY-MM/
```

**Why use this:** Fully automated - finds pending files, batches intelligently, spawns parallel agents, updates all tracking. No manual file listing needed.

---

### 3️⃣ Weekly Synthesis - LEGACY (Single-Session Approach)

**⚠️ RECOMMENDATION:** Use the three-session Skills workflow (above) instead. These prompts run everything in one session and may produce shallow analysis.

**Use these ONLY if:** You need a quick one-off synthesis or Skills aren't available.

**Two timing options based on your workflow:**

#### Option A: Mid-Week Synthesis (Day 3-4) ✅ RECOMMENDED FOR SPEED

**Best for:** Getting talking points fast for calls/posts/reflection

```
Run mid-week synthesis (Day 3-4) - first pass with full deliverables.

**Instructions:**

**Phase 1-2: Mining + Coverage Sweep**
1. Read _System/Workflows/Weekly_Synthesis.md (Phase 1-2)
2. Identify all extractions from this week so far
3. Spawn parallel Task tool agents for mining (one per source if 3+ files)
4. Each agent produces DP Relevance Map showing:
   - DPs relevant to Active Ideas (with connection explanation)
   - DPs relevant to Open Threads
   - New themes not covered by current ideas
   - DPs not relevant (with reasoning)
5. Save relevance maps to: _System/working/relevance_maps/[Source_Name]_relevance.md
6. Run coverage sweep on "Sources Needing Attention" from _Weekly_Header.md

**Phase 3: Write Weekly Learnings**
7. Load all DP Relevance Maps
8. Load required standards:
   - _System/Style_Guide.md
   - _System/Data_Point_Normalization.md
   - _System/Citation_Contract.md
9. Load context:
   - 02_Extractions/_Extraction_Index.md
   - 06_Current_Understanding/Active_Ideas.md (summary)
   - 03_Weekly_Learnings/_Weekly_Header.md
10. Write Weekly Learnings using 08_Templates/Weekly_Template.md
11. Mark document status at top: "Status: Mid-week synthesis (Day 3-4)"
12. Apply Style Guide + Data Normalization standards
13. Run self-checks before finalizing

**Phase 4-5: Update Deliverables**
14. Update Active Ideas:
    - Add Evolution Log entry: "YYYY-MM-DD (Mid-week preliminary): [updates]"
    - Add to Supporting Evidence table
15. Update Current Synthesis if significant shifts
16. Generate Talking Points (usable now for calls/posts/reflection)
17. Update _Weekly_Header.md

**Outputs:**
- WL_YYYY-MM-DD.md (marked "Mid-week synthesis")
- TP_YYYY-MM-DD.md (Talking Points - shareable immediately)
- Active Ideas updated (preliminary)
- Current Synthesis updated (if warranted)

**Purpose:** Generate usable outputs quickly. Will be superseded by end-of-week synthesis.
```

#### Option B: End-of-Week Co-Creation (Day 5-7) ✅ RECOMMENDED FOR DEPTH

**Best for:** Incorporating your strategic perspective into final synthesis

```
Run end-of-week synthesis (Day 5-7) with user perspective integration.

**Instructions:**

**Phase 1-2: Mining + Coverage Sweep (ALL week's extractions)**
1. Read _System/Workflows/Weekly_Synthesis.md (Phase 1-2)
2. Identify ALL extractions from this week (including files added since mid-week)
3. Spawn parallel Task tool agents for mining
4. Produce DP Relevance Maps for entire week
5. Run coverage sweep

**PAUSE FOR USER INPUT**
6. Present themes summary and ask:
   - What feels most important this week?
   - Connections you're seeing?
   - Your overall reflection?
   - Emphasis guidance for synthesis?

**Phase 3: Write Final Weekly Learnings (with your perspective)**
7. Load DP Relevance Maps AND user input
8. Write Weekly Learnings that:
   - Prioritizes themes user identified as most important
   - Integrates user's observations and connections
   - Reflects user's strategic framing
   - Uses user's language where appropriate
9. Add "User Observations" section if substantial reflection provided
10. Mark document status: "Status: Final end-of-week synthesis"
11. Apply Style Guide + Data Normalization standards

**Phase 4-5: Final Active Ideas + Deliverables**
12. Update Active Ideas:
    - Add Evolution Log: "YYYY-MM-DD: Final comprehensive update with user perspective"
    - Update Current Position if refined
13. Archive previous Current Synthesis
14. Rewrite Current Synthesis from updated Active Ideas + final WL
15. Generate final Talking Points incorporating your strategic framing
16. Update _Weekly_Header.md and Tags.md
17. Clean up working files

**Outputs:**
- WL_YYYY-MM-DD.md (final, supersedes mid-week)
- TP_YYYY-MM-DD.md (final, supersedes mid-week)
- Active Ideas updated (comprehensive)
- Current Synthesis updated (your perspective integrated)

**Purpose:** Comprehensive weekly synthesis with your strategic thinking integrated.
```

**Which to choose:**
- **Both!** Run mid-week for quick talking points, then end-of-week for depth
- **Mid-week only:** If you need speed and won't add strategic input
- **End-of-week only:** If you're doing one synthesis per week with your perspective

---

### 4️⃣ Check System Status

```
What's the status of my CRIS research system?

Show me:
1. Total extractions and recent additions
2. Most recent weekly synthesis date
3. Active ideas count and status
4. Sources that need synthesis attention
5. Any workflow issues or gaps
```

**Why:** Quick health check to know what needs work.

---

## 📚 Common Operations (Use As Needed)

<details>
<summary><b>Generate Talking Points</b> (from current synthesis)</summary>

```
Generate Talking Points from current synthesis.

**Context:** [Upcoming interview/meeting/networking OR general conversation prep]

**Instructions:**
1. Load:
   - 06_Current_Understanding/Current_Synthesis.md
   - 06_Current_Understanding/Active_Ideas.md
   - 08_Templates/Talking_Points_Template.md
   - _System/Style_Guide.md (Talking Points section)
2. Create 3-5 Talking Points, each with:
   - The Point (your position, 2-3 sentences)
   - Why It Matters (business/strategic implication)
   - Who Cares (which audiences, why)
   - Evidence (key stat with normalized presentation, source credibility)
   - Your Angle (what makes your view distinct)
   - Pivot Phrases (how to bring it up naturally)
3. Talking Points tone:
   - Conversational authority (not academic)
   - Punchier sentences than Weekly Learnings
   - Contractions OK
   - Higher energy
4. Save to: 09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md

**Focus areas (if specified):** [e.g., enterprise adoption, agentic workflows, skill formation]
```

</details>

<details>
<summary><b>Update Active Ideas</b> (with new evidence)</summary>

```
Update Active Ideas with evidence from recent extractions.

**Focus:** [Specific idea name OR "all ideas with new evidence"]

**Recent extractions to integrate:**
- [List specific extraction files OR say "all from latest Weekly Learnings"]

**Instructions:**
1. Load 06_Current_Understanding/Active_Ideas.md
2. Load specified extraction files
3. For each idea:
   - Scan extractions for relevant DPs
   - Add to Supporting Evidence table if relevant
   - Update Current Position if evidence refines thesis
   - Add Evolution Log entry if position shifted
   - Add to Open Questions if evidence creates tension
4. Save updated Active_Ideas.md
5. Note which ideas changed vs. unchanged
```

</details>

<details>
<summary><b>Update Current Synthesis</b> (big-picture summary)</summary>

```
Update Current Synthesis with latest insights.

**Trigger:** [New Weekly Learnings OR significant idea shifts OR user request]

**Instructions:**
1. Archive current version:
   - Read Last Updated date from Current_Synthesis.md
   - Copy to 06_Current_Understanding/archive/Current_Synthesis_[date].md
2. Load context:
   - 06_Current_Understanding/Active_Ideas.md (updated)
   - Latest Weekly Learnings
   - 06_Current_Understanding/User_Observations.md
   - 08_Templates/Current_Synthesis_Template.md
3. Rewrite Current Synthesis as cumulative position statement:
   - Summary (2-3 paragraph narrative)
   - Key Takeaways (6-10 insights with DP citations)
   - Active Ideas table
   - Open Threads
   - Evidence Base stats
   - What's Changed Since Last Synthesis
4. Apply Style Guide + Data Normalization standards
5. Update 06_Current_Understanding/_Index.md (dates, counts)

**Output:** Updated Current_Synthesis.md with today's date
```

</details>

<details>
<summary><b>Create New Active Idea</b> (emerging pattern)</summary>

```
Create new Active Idea based on emerging pattern: [brief description]

**Trigger:** [New theme from synthesis OR user observation OR cross-source pattern]

**Instructions:**
1. Load 06_Current_Understanding/Active_Ideas.md (see existing ideas)
2. Load relevant extractions that support this pattern
3. Create new idea entry with full structure:

## [Idea Name]

**Status:** Developing
**Confidence:** [Low/Medium - new ideas start here]
**Tags:** #tag1, #tag2

### Current Position
[Your thesis in 2-4 sentences]

### Drivers
- **Initial observation:** [What pattern first caught attention]
- **Key sources:** [Which sources crystallized it, with dates]
- **Evolution:** [How pattern developed across sources]
- **Trigger:** [What made pattern coalesce into thesis]

### Supporting Evidence
- [Claim] → [Source DP citation with metadata comment]
- [Claim] → [Source DP citation with metadata comment]

### Open Questions
- [What you're still exploring]

### Evolution Log
- YYYY-MM-DD: Initial synthesis from [sources]

4. Add to Active_Ideas.md
5. Update 06_Current_Understanding/_Index.md
6. Note in next Weekly Learnings "Updates to Current Understanding"
```

</details>

<details>
<summary><b>Search Knowledge Base</b> (semantic, cross-week)</summary>

```
Search my knowledge base for: [plain-English question or topic]

Optional filters:
- Evidence type: empirical | data_metric | case_study | framework | prediction | expert_opinion | anecdotal
- Tags: #tag-slug-1, #tag-slug-2

Return the top 10 results. For each result, show: claimText, anchorQuote, source title, evidenceType, and tags.
```

**Why use this instead of grepping files:** The knowledge base search uses vector embeddings — it returns semantically related DPs even when your query words don't appear verbatim in the source. Useful before an interview, a LinkedIn post, a client call, or any synthesis session where you want to quickly surface relevant evidence across all 3,500+ DPs.

</details>

<details>
<summary><b>Trace Idea Lineage</b> (evidence chain)</summary>

```
Trace the lineage of [Idea Name] from current position back to source evidence.

**Instructions:**
1. Load 06_Current_Understanding/Active_Ideas.md
2. Find [Idea Name] entry
3. Extract all citations from:
   - Current Position
   - Supporting Evidence table
   - Drivers section
4. For each cited extraction:
   - Load extraction file
   - Show cited DP(s) with full context
   - Show Original Location (source file path)
5. Map the evidence chain:
   - Idea position → Weekly Learnings citation → Extraction DP → Source file
6. Identify:
   - Strongest evidence (most cited sources)
   - Evidence gaps (areas lacking support)
   - Confidence assessment based on source diversity

**Output:**
- Lineage map showing full evidence chain
- Confidence assessment
- Recommendations for strengthening position
```

</details>

---

## 🛠️ Maintenance Operations

<details>
<summary><b>Prepare Raw Input Files</b> (add metadata to manual captures)</summary>

### For Articles, Blog Posts, Written Content

```markdown
## Metadata
* **Publisher:** [Publication/Website Name - e.g., "Financial Times", "Every", "TechCrunch"]
* **Author:** [Author name(s) or "Editorial Team"]
* **Published:** [YYYY-MM-DD]
* **Type:** [Article | Blog Post | White Paper | Newsletter | Report]
* **URL:** [Full URL]
* **Captured:** [YYYY-MM-DD - when you scraped/saved this]

---

[Paste your scraped/copied content here]
```

### For Video Transcripts (Non-YouTube)

```markdown
## Metadata
* **Channel:** [Channel/Creator Name]
* **Published:** [YYYY-MM-DD]
* **Duration:** [HH:MM or MM:SS]
* **URL:** [Full URL]
* **Transcript Extracted:** [Month DD, YYYY - when you extracted it]

---

[Paste your transcript here]
```

**File naming:** `YYYY-MM-DD_SourceName_ShortSlug.md`
**Save to:** `01_Raw_Inputs/YYYY-MM/YYYY-MM-DD_to_DD/`

**Note:** YouTube transcripts from your Gemini Gem already have metadata - this is only for Firecrawl scrapes, copy-paste, etc.

</details>

<details>
<summary><b>Review and Promote Tags</b></summary>

```
Review Emerging tags and promote to Established if warranted.

**Instructions:**
1. Load Tags.md
2. For each Emerging tag:
   - Count sources using this tag (check _Extraction_Index.md)
   - If 3+ sources: promote to Established table
   - If < 3 sources but clear pattern: keep in Emerging
   - If used once and unclear meaning: consider retiring
3. Check for tag consolidation opportunities:
   - Do any Emerging tags overlap with Established?
   - Should any be merged?
4. Update Tags.md:
   - Move promoted tags to Established
   - Add promotion note to Tag Hygiene Log
5. Report:
   - Tags promoted (with source count)
   - Tags kept in Emerging (with reasoning)
   - Tags recommended for consolidation
```

</details>

<details>
<summary><b>Clean Up Working Files</b></summary>

```
Clean up intermediate working files in _System/working/.

**Instructions:**
1. Check _System/working/relevance_maps/
   - Keep most recent synthesis cycle's DP Relevance Maps
   - Delete older relevance maps (they're intermediate, not archival)
2. Check other _System/working/ subdirectories
   - Archive or delete completed batch processing files
   - Keep any files marked "reference"
3. Report:
   - Files deleted (with dates)
   - Files kept (with reasoning)
   - Disk space freed
```

</details>

<details>
<summary><b>Verify Extraction Quality</b></summary>

```
Verify extraction quality for recent extractions.

**Check:** [Specific extraction file OR "all extractions from YYYY-MM-DD to YYYY-MM-DD"]

**Verification checklist:**
1. Metadata format:
   - [ ] **Original Location** field present (not "URL/Location")
   - [ ] Relative path used (not absolute /sessions/... path)
   - [ ] All required metadata fields present
2. Atomic DP format:
   - [ ] DPs numbered consistently (DP1, DP2, ...)
   - [ ] Anchors are verbatim quotes (not paraphrased)
   - [ ] Anchors are 5-15 words (searchable length)
   - [ ] Anchors are distinctive (not generic phrases)
   - [ ] Citations include page/timestamp
   - [ ] Tags use existing vocabulary from Tags.md
3. Coverage:
   - [ ] DPs span full document (not just early pages)
   - [ ] Multi-source interpretations show all anchors
4. Naming:
   - [ ] Filename follows convention: Source_DescriptiveSlug_YYYY-MM-DD.md
   - [ ] EXACTLY 2 underscores before date
   - [ ] PascalCase (no internal underscores)

**Report:**
- Issues found (with severity: critical/minor)
- Extractions needing re-work
- Overall quality score
```

</details>

---

## 🚨 Troubleshooting

<details>
<summary><b>Fix Broken Citations</b></summary>

```
Find and fix broken citations in synthesis documents.

**Scope:** [Specific document OR "all documents in 03_Weekly_Learnings/2026-Q1/"]

**Instructions:**
1. Load _System/Citation_Contract.md (current format spec)
2. Load _System/Extraction_Name_Mapping.md (if files were renamed)
3. Scan documents for citation issues:
   - Bracket citations missing metadata comments
   - Citations using old extraction names
   - Malformed citation format (hyphens instead of underscores, etc.)
   - Citations to non-existent extraction files
4. Fix each issue:
   - Add missing metadata comments
   - Update to new extraction names
   - Correct format errors
   - Flag citations that can't be resolved
5. Report:
   - Citations fixed (count by issue type)
   - Unresolvable citations (needs user input)
```

</details>

<details>
<summary><b>Diagnose Coverage Gaps</b></summary>

```
Diagnose why certain sources have low citation coverage.

**Instructions:**
1. Load 02_Extractions/_Extraction_Index.md
2. Identify sources with:
   - 15+ DPs but < 3 citations across all synthesis
   - Created 2+ weeks ago
3. For each low-coverage source:
   - Read extraction file
   - Compare DPs to current Active Ideas
   - Assess relevance:
     - Are DPs not relevant to current ideas? (OK, note for future)
     - Are DPs relevant but missed in synthesis? (Gap, needs attention)
     - Are tags misaligned? (Tagging issue)
4. Categorize sources:
   - "Not relevant to current research focus" → OK to leave
   - "Relevant but missed" → Add to Sources Needing Attention
   - "Tagging issues" → Propose re-tagging
5. Update _Weekly_Header.md "Sources Needing Attention" list

**Output:**
- Coverage gap analysis
- Sources needing attention (with reasoning)
- Recommendations for next synthesis cycle
```

</details>

---

## 📖 Advanced Workflows (Rarely Needed)

<details>
<summary><b>Manual Single Extraction</b> (1-2 files, want control)</summary>

**Use when:** You want to manually specify exactly which files to extract (not automatic discovery)

```
I need to extract data points from specific source documents for my CRIS research system.

**Files to extract:**
- 01_Raw_Inputs/2026-02/2026-02-08_to_14/[filename1.pdf]
- 01_Raw_Inputs/2026-02/2026-02-08_to_14/[filename2.pdf]

**Instructions:**
1. Read _System/Workflows/Extraction.md for atomic DP format requirements
2. Read Tags.md for current tag vocabulary
3. Extract using atomic DP format:
   - **DP#:** [Interpretation]
   - **Anchor:** "[Verbatim 5-15 word quote from source]"
   - **Citation:** (p. XX)
   - **Tags:** #tag1, #tag2
4. Ensure REQUIRED metadata field is present:
   - **Original Location:** 01_Raw_Inputs/... (relative path)
5. Follow naming convention with STRICT validation:
   - Format: SourceName_DescriptiveSlug_YYYY-MM-DD.md
   - EXACTLY 2 underscores before date
   - Use PascalCase within Source and Slug (NO underscores)
   - ✅ CORRECT: FinancialTimes_MustafaSuleymanAI_2026-02-13.md
   - ❌ WRONG: Financial_Times_Mustafa_Suleyman_AI_2026-02-13.md
6. Update 02_Extractions/_Extraction_Index.md
7. Present new tag proposals for confirmation

**Output location:** 02_Extractions/2026-02/
```

</details>

<details>
<summary><b>Re-extraction</b> (fix quality issues)</summary>

**Use when:** An extraction has weak anchors, missing DPs, or doesn't follow atomic format

```
Re-extract [Source_Name_YYYY-MM-DD.md] with improved quality:

**Issues to fix:**
- Anchors aren't verbatim quotes / not searchable
- Missing data points from full document
- Tags don't match current vocabulary
- Missing Original Location metadata field

**Instructions:**
1. Read the existing extraction
2. Read the source file at [Original Location path]
3. Create new extraction following current standards:
   - Atomic DP format with verbatim anchors (5-15 words, Cmd+F searchable)
   - Comprehensive coverage (span full document, not just early pages)
   - Current tag vocabulary from Tags.md
   - REQUIRED metadata with Original Location
4. Replace old extraction file
5. Update _Extraction_Index.md if DP count changed
6. Note improvements made
```

</details>

<details>
<summary><b>Light Week Synthesis</b> (1-5 extractions, one session)</summary>

**Use when:** You have 1-5 new extractions and can process in one session (no mid-week/end-of-week split needed)

```
Create Weekly Learnings and Talking Points for this week.

**New extractions:** [1-5 filenames OR "all new since last synthesis"]

**Streamlined approach (light week):**
1. Mine new extractions directly (no sub-agents needed for <6 sources)
2. Write Weekly Learnings using Style Guide + Data Normalization
3. Update Active Ideas with new evidence
4. Update Current Synthesis
5. Generate Talking Points
6. Update _Weekly_Header.md and Tags.md

**Load:**
- _System/Style_Guide.md
- _System/Data_Point_Normalization.md
- _System/Citation_Contract.md
- All new extraction files
- 06_Current_Understanding/Active_Ideas.md
- 03_Weekly_Learnings/_Weekly_Header.md

**Critical requirements:**
- No em dashes, Oxford comma, direct voice
- Level 2 normalization minimum (population + metric + source + timeframe)
- Citation metadata comments for all bracket citations
- Mark what's new/shifted/steady

**Outputs:**
- 03_Weekly_Learnings/2026-Q1/WL_YYYY-MM-DD.md
- 06_Current_Understanding/Active_Ideas.md (updated)
- 06_Current_Understanding/Current_Synthesis.md (updated, archive previous)
- 09_Deliverables/Talking_Points/TP_YYYY-MM-DD.md
- Updated _Weekly_Header.md and Tags.md
```

</details>

<details>
<summary><b>Monthly Synthesis</b> ⚠️ DEPRECATED — Use Skills Instead</summary>

**⚠️ This prompt has been superseded by the two-session Monthly Synthesis Skills workflow.**

**Use instead:**
```
Session 1: Read and follow: _System/skills/cris-monthly-map/SKILL.md
Session 2: Read and follow: _System/skills/cris-monthly-write/SKILL.md
```

The Skills workflow adds: proper prerequisite validation, User Observations integration, tag evolution documentation, the prepublish quality gate, Monthly Talking Points (MT_YYYY-MM.md) as a separate deliverable, and canonical WL file handling (excludes superseded archived files).

**This legacy prompt is retained for reference only. Do not use for production monthly synthesis.**

```
[LEGACY — DO NOT USE]
Create Monthly Synthesis for [Month YYYY].

**Instructions:**
1. Load:
   - All Weekly Learnings from month: 03_Weekly_Learnings/YYYY-QN/WL_*.md
   - 04_Monthly_Synthesis/_Index.md (if exists)
   - _System/Style_Guide.md
   - _System/Data_Point_Normalization.md
2. Synthesize monthly narrative:
   - What themes emerged this month?
   - What ideas developed from Developing → Ready to Share?
   - What thinking shifted significantly?
   - What evidence accumulated?
3. Structure:
   - Overview (what characterized this month)
   - Major themes (organized by significance, not chronology)
   - Idea evolution (which ideas matured)
   - Open threads carried forward
   - Evidence base snapshot
4. Cite Weekly Learnings (not individual extractions)
   - "This pattern emerged in early February (WL_2026-02-07) and strengthened mid-month (WL_2026-02-14)"
5. Apply Style Guide + Data Normalization

**Output:** 04_Monthly_Synthesis/2026/MS_2026-02.md
```

</details>

<details>
<summary><b>Batch Regeneration After System Updates</b></summary>

**Use when:** System files updated (Style Guide, Citation Contract, etc.) and existing outputs need regeneration

```
Regenerate CRIS synthesis outputs using updated system standards.

**Context:** [What changed - e.g., "Citation Contract updated, extraction files renamed"]

**Scope:** [Which outputs to regenerate - e.g., "Latest Weekly Learnings + Current Synthesis"]

**Instructions:**
1. Load ALL updated system files:
   - _System/Style_Guide.md
   - _System/Data_Point_Normalization.md
   - _System/Citation_Contract.md
   - _System/Extraction_Name_Mapping.md (if renaming occurred)
2. For each document to regenerate:
   - Archive current version with current date
   - Load same source materials as original
   - Rewrite following updated standards
   - Update all citations to new format/names
   - Run quality checks
3. Update index files to point to regenerated versions

**Documents to regenerate:**
- [ ] Latest Weekly Learnings
- [ ] Current Synthesis
- [ ] Latest Talking Points
- [ ] Active Ideas (citation updates only)
- [ ] User Observations (citation updates only)

**Report:**
- Documents regenerated (with before/after comparison)
- Citations updated (count)
- Standard violations fixed
```

</details>

---

## 💡 Usage Tips

### Skills vs Prompts: When to Use Which

**Use Skills (Recommended):**
- ✅ Regular weekly synthesis operations
- ✅ Batch extraction of multiple files
- ✅ When you want validation and quality checks built in
- ✅ When you need error handling and recovery
- ✅ For three-session synthesis to prevent shallow analysis

**Use Prompts (Legacy):**
- When you need one-off custom operations
- When Skills aren't working or need debugging
- For operations not yet covered by Skills (monthly synthesis, etc.)
- When you want more manual control over the process

### Be Specific About Scope
✅ Good: "Extract data points from the 3 new PDFs in 2026-02/2026-02-08_to_14/"
❌ Vague: "Extract everything"

### Let Automation Handle Batching
Don't manually segregate files by size - the automated extraction prompt handles this.

### Reference System Files When Needed
If quality issues arise, explicitly cite standards:
- "Follow _System/Style_Guide.md standards"
- "Apply _System/Data_Point_Normalization.md Level 2"

### Three-Session Synthesis Prevents Shallow Analysis
The Skills-based approach splits synthesis into three sessions:
- **Session 1:** Deep mining (forces engagement with each source)
- **Session 2:** Cross-source synthesis (identifies convergence/tension)
- **Session 3:** Strategic integration (updates positioning documents)

This separation prevents the shallow coverage that happens when everything runs in one session.

---

## 📋 Quick Reference Table

| Your Goal | Recommended Approach | Legacy Alternative |
|-----------|---------------------|-------------------|
| **Process new files** | **Skill:** `cris-extract` (syncs to Convex automatically) | Prompt: Extract New Files |
| **Weekly synthesis** | **Skills:** `cris-analyze` → `cris-write-learnings` → `cris-integrate` (3 sessions, all sync to Convex) | Prompts: Mid-Week or End-of-Week Synthesis (1 session) |
| **Search all DPs semantically** | **Convex:** `Search my knowledge base for: [topic]` | Grep extraction files manually |
| Check system health | Prompt: System Status Check | - |
| Prep for conversation | **Convex search** first, then **Output from:** `cris-integrate` Session 3 | Prompt: Generate Talking Points |
| Track new idea | Prompt: Create New Active Idea (then `update_idea` to persist) | - |
| Update big-picture view | **Output from:** `cris-integrate` Session 3 | Prompt: Update Current Synthesis |
| Trace where a DP is cited | **Convex:** `get_data_point_usage` with DP's Convex ID | Prompt: Trace Idea Lineage |
| Annotate an entity | **Convex:** `add_curator_note` with entityType + ID + note | - |
| Monthly wrap-up | **Skills:** `cris-monthly-map` → `cris-monthly-write` (2 sessions) | Legacy prompt: Monthly Synthesis (deprecated) |
| Fix quality issues | See: Troubleshooting section | - |

**Key:**
- **Skill:** = Structured workflow with validation (recommended)
- **Prompt:** = Manual operation (legacy or one-off use)

---

## Version History

- **v3.2** (2026-03-04): **Convex/MCP integration documented throughout**
  - Added "🔍 Convex Knowledge Base" section with semantic search guide, full MCP tool reference (15 tools across 4 categories), and ad-hoc direct-access prompts
  - Updated all four skill descriptions (cris-extract, cris-analyze, cris-write-learnings, cris-integrate) to document their Convex sync behavior and returned IDs
  - Added "Search Knowledge Base" to Common Operations
  - Updated Quick Reference Table with Convex-native operations
  - Background: 3,517 data points embedded with text-embedding-3-small; vector search live via Convex action; all Skills now write artifacts to Convex

- **v3.1** (2026-03-01): Added two-session Monthly Synthesis Skills (`cris-monthly-map`, `cris-monthly-write`). Deprecated legacy Monthly Synthesis prompt. Updated Quick Reference Table. Monthly Synthesis now produces two deliverables (MS + MT) and incorporates User Observations, tag evolution, and prepublish quality gate.
- **v3.0** (2026-02-15): **MAJOR UPDATE** - Skills-based workflow now primary approach
  - Added Skills section with cris-extract, cris-analyze, cris-write-learnings, cris-integrate
  - Three-session synthesis architecture to prevent shallow analysis
  - Legacy prompts retained as fallback options
  - Updated Quick Reference Table with Skills vs Prompts guidance
  - Renamed to "CRIS Operations Guide" (was "CRIS Prompt Library")
- **v2.0** (2026-02-15): Major restructure for usability - Quick Start section, consolidated extraction (removes file size segregation), clear default paths, collapsed advanced options
- **v1.2** (2026-02-14): Updated session initialization to load CRIS context files
- **v1.1** (2026-02-14): Added Raw Input Metadata Template
- **v1.0** (2026-02-13): Initial comprehensive prompt library
