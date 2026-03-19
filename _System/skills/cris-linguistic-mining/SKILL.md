---
name: cris-linguistic-mining
description: Mine reusable linguistic elements (frameworks, analogies, terms, comparisons, provocations, anti-patterns, numerical rules) from weekly CRIS extractions. Organizes assets by source with multi-dimensional credibility scoring. Runs between Session 1 (cris-analyze) and Session 2 (cris-write-learnings). Use when conducting weekly synthesis or when user requests linguistic asset mining. Processes 40-60 sources in 45-60 minutes using parallel sub-agents. Generates weekly additions file (LA_YYYY-MM-DD.md) with Framing Notes and Session 3 update instructions for master library integration. ALWAYS use when user says "run linguistic mining" or "mine language assets" or during weekly synthesis workflow.
---

# CRIS Linguistic Mining Skill

## Overview

This skill mines memorable, transferable linguistic elements from weekly CRIS extractions and builds a Language Asset Library organized by source. Assets help you communicate insights effectively through frameworks, analogies, memorable terms, and data-backed numerical rules-of-thumb.

**What it does:**
- Mines 7 linguistic categories from weekly extractions
- Organizes by SOURCE (not category) for easy citation
- Applies 4-dimensional credibility scoring per source
- Deduplicates using 5 scenario logic
- Generates Framing Notes to help set conversational perspective
- Creates Session 3 integration instructions for master library

**When to run:**
- **Mid-week** (e.g., Wednesday): First pass on sources collected so far
- **End-of-week** (e.g., Friday/Saturday): Final pass with full week's sources
- **Retroactive**: Process previous weeks by specifying target week end date

**Performance target:** 40-60 sources in 45-60 minutes (parallel sub-agent processing)

**Output files:**
- `09_Deliverables/Language_Assets/_weekly_additions/LA_YYYY-MM-DD.md`
- `09_Deliverables/Language_Assets/_pending_updates/LA_YYYY-MM-DD_update_instructions.md`

---

## When to Use This Skill

**ALWAYS use this skill when:**
- User says "run linguistic mining"
- User says "mine language assets"
- User runs weekly synthesis workflow (between Session 1 and Session 2)
- User requests linguistic asset extraction
- User says "run cris-linguistic-mining"

**DO NOT use this skill when:**
- User is doing data point extraction (use cris-extract instead)
- User is writing Weekly Learnings (use cris-write-learnings instead)
- User is integrating synthesis (use cris-integrate instead)

---

##Workflow Overview

**STEP 1:** Detect week and load inputs (auto-detect or specify week end date)
**STEP 2:** Check for existing weekly file (handle mid-week + end-of-week runs)
**STEP 3:** Spawn parallel sub-agents (one per extraction, 40-60 in parallel)
**STEP 4:** Coordinator consolidates and deduplicates
**STEP 5:** Generate weekly additions file (LA_YYYY-MM-DD.md)
**STEP 6:** Generate Session 3 update instructions

---

## Detailed Category Definitions

### 1. FRAMEWORKS & MENTAL MODELS

**Definition:** Named conceptual structures that organize complexity or explain relationships

**Capture when:** Source introduces a named framework with 2+ components/dimensions

**Examples:**
- "Tool-Coworker Duality" (AI is neither pure tool nor pure worker)
- "Four Operational Tensions" (scalability/adaptability, supervision/autonomy, etc.)
- "Deploy-Reshape-Invent" (CX transformation sequencing)

**Include in extraction:**
- Structure (components, dimensions, relationships)
- Application (how to use it)
- Evidence backing (research, case studies)
- Why it works (explanatory power)
- Related concepts (connections to other frameworks)

**Exclude:**
- Generic frameworks everyone knows ("SWOT", "Porter's Five Forces" unless new application)
- Unnamed conceptual structures (must have memorable name)

---

### 2. ANALOGIES & METAPHORS

**Definition:** Comparisons that make abstract concepts concrete through familiar imagery

**Capture when:** Source uses comparison to clarify complex idea

**Examples:**
- "Coordination Tax" (cost agents pay when coordinating)
- "Use Case Desert" (85% lack value-driving use cases)
- "Agent as Teammate" (collaboration framing)

**Include in extraction:**
- Core comparison (what is being compared to what)
- Usage context (when to use this analogy)
- Effectiveness rating (how well it clarifies)
- Transfer risk (does it work across contexts)
- Quantification if available (specific numbers)

**Exclude:**
- Throwaway metaphors without explanatory power
- Clichés that don't clarify
- Analogies that require extensive setup

---

### 3. TERMS & CATCHPHRASES

**Definition:** Memorable coined terms or phrases that name specific phenomena

**Capture when:** Source introduces or popularizes a term that could become shorthand

**Examples:**
- "Capability Saturation" (multi-agent performance ceiling)
- "Vibe Coding" (non-engineers coding through feel)
- "Agentic Burden" (management complexity of autonomous agents)

**Include in extraction:**
- Definition (clear, concise explanation)
- Usage context (when to use this term)
- Adoption level (widely recognized, emerging, niche)
- Why it works (why this term is sticky)
- Competitor terms (alternatives, synonyms)

**Exclude:**
- Generic jargon everyone uses
- Terms that won't stick (forgettable)
- Obvious descriptions without conceptual power

---

### 4. COMPARISON STRUCTURES

**Definition:** "A vs B" distinctions that clarify boundaries or highlight tradeoffs

**Capture when:** Source makes meaningful distinction between two approaches/concepts

**Examples:**
- "Tool-Heavy vs Knowledge-Heavy Tasks" (coordination penalty variance)
- "Interactive vs Autonomous Performance" (optimization mismatch)
- "Scalability vs Adaptability" (tool vs worker properties)

**Include in extraction:**
- The distinction (clear articulation of A vs B)
- Strategic implication (why this matters)
- Data support (evidence for the distinction)
- When to use (contexts where this comparison clarifies)

**Exclude:**
- Trivial comparisons without insight
- Obvious distinctions everyone knows

---

### 5. PROVOCATIONS / REFRAMES

**Definition:** Statements that invert conventional wisdom or challenge mainstream narratives

**Capture when:** Source makes claim that contradicts common assumptions

**Examples:**
- "The challenge is organizational, not technological"
- "Success means mastering tensions, not resolving them"
- "More agents makes things worse after 45%"

**Include in extraction:**
- Core inversion (what conventional wisdom is being challenged)
- Why it provokes (what makes this counterintuitive)
- Usage context (when to deploy this reframe)
- Conversation hook (memorable way to state it)
- Source quote location (where in extraction)

**Exclude:**
- Mild disagreements without clear inversion
- Incremental refinements (must be genuine reframe)

---

### 6. ANTI-PATTERNS / WARNINGS

**Definition:** Specific "what NOT to do" guidance with evidence of failure

**Capture when:** Source identifies common mistake with actionable alternative

**Examples:**
- "Don't add agents after 45% threshold"
- "Don't force AI into tool OR worker categories"
- "Don't measure only time savings at scale"

**Include in extraction:**
- The mistake (specific error to avoid)
- Why it fails (evidence or explanation)
- What to do instead (actionable alternative)
- Evidence (research, operational proof)

**Exclude:**
- Generic warnings without specifics
- Obvious mistakes everyone knows
- Warnings without alternatives

---

### 7. NUMERICAL RULES-OF-THUMB

**Definition:** Memorable numbers that become verbal shorthand for concepts

**Capture when:** Source provides quantified threshold, ratio, or metric worth quoting

**Examples:**
- "The 45% Threshold" (multi-agent coordination ceiling)
- "The 85% Use Case Desert" (lack value-driving use cases)
- "The 77-to-20 Collapse" (time savings metric evolution)

**Include in extraction:**
- The number (exact figure or ratio)
- What it means (interpretation)
- When to quote (usage contexts)
- Precision notes (how exact should you be)
- Conversation hook (memorable way to state it)

**Exclude:**
- Generic statistics without reusability
- One-off data points (must be quotable as "rule")

---

## Organization Structure (Source-Primary)

**CRITICAL: Group all assets BY SOURCE, not by category.**

**Rationale:**
- Helps anchor communication on one source
- Shows what linguistic toolkit each source provides
- Serves similar purpose to data points (can see what assets available when source plays supporting role)
- Easier to cite ("BCG's framework" vs hunting through categories)

**Output Structure:**

```markdown
## Source: SourceName_DescriptiveSlug

**File:** `SourceName_DescriptiveSlug_YYYY-MM-DD.md`
**Type:** [Research Report / Industry Commentary / Practitioner Guide / etc.]
**Linguistic Density:** [X assets]

**Source Credibility:**
- **Research Rigor:** [Very High / High / Medium / Low]
- **Brand Authority:** [Very High / High / Medium / Low]
- **Evidence Type:** [Primary Research / Operational Proof / Case Studies / Synthesis]
- **Best Audience Fit:** [which audiences trust this source]

**Best For:** [contexts where this source excels]
**Strengths:** [what makes it credible]
**Caution:** [when to use carefully]

---

### Frameworks & Mental Models

[All frameworks from this source]

### Analogies & Metaphors

[All analogies from this source]

[...etc for all 7 categories]
```

**Then provide Category Cross-Reference at end:**

```markdown
# CATEGORY INDEX (Cross-Reference)

## All Frameworks & Mental Models (count)
1. Framework Name (Source)
2. Framework Name (Source)

## All Analogies & Metaphors (count)
[etc]
```

---

## Multi-Dimensional Source Credibility Scoring

Score each source across **4 dimensions** (NOT single tier):

### 1. RESEARCH RIGOR (Methodology Quality)

- **Very High:** Peer-reviewed, large-N surveys (2000+), cross-validated models, formal experiments
- **High:** Empirical research, case studies, validated methodologies
- **Medium:** Operational proof, smaller samples, practitioner surveys
- **Low:** Commentary, aggregation, anecdotal evidence

### 2. BRAND AUTHORITY (Name Recognition)

- **Very High:** Instant C-suite recognition (McKinsey, BCG, Google DeepMind, Anthropic)
- **High:** Recognized in industry/technical communities
- **Medium:** Known in specific domains (Section in L&D, Every in practitioner circles)
- **Low:** Niche audiences, growing recognition

### 3. EVIDENCE TYPE (What Kind of Proof)

- **Primary Research:** Original surveys, experiments, empirical studies
- **Operational Proof:** Real production systems, live deployments
- **Case Studies:** Detailed analysis of specific implementations
- **Synthesis:** Aggregation and analysis of other sources

### 4. BEST AUDIENCE FIT (Who Trusts This Source)

Use this to match source to conversation context.

**Examples:**
- "C-suite executives, board members, organizational strategy discussions" (BCG, McKinsey)
- "Technical leaders, CTOs, AI researchers, capability discussions" (DeepMind, Anthropic)
- "Product managers, practitioners, implementation discussions" (Every)
- "HR leaders, L&D, workforce readiness" (Section)

**Include paragraph synthesis:**

```markdown
**Best For:** [contexts where this source excels]
**Strengths:** [what makes it credible]
**Caution:** [when to use carefully]
```

**Why multi-dimensional vs single tier:**
- BCG: "Very High Brand + High Rigor" → great for C-suite with empirical backing
- DeepMind: "Very High Rigor + Very High Brand for technical" → technical credibility
- Every: "Medium Rigor + Medium Brand, but High for practitioners" → operational proof
- Allows choosing right citation for right context

---

## Quality Filters (Apply to All Categories)

### INCLUDE if asset is:

✅ **Memorable:** Sticks after one exposure, quotable
✅ **Transferable:** Works across contexts, not domain-locked
✅ **Clarifying:** Simplifies complexity, makes concept concrete
✅ **Distinctive:** Not generic jargon, has unique angle
✅ **Evidence-backed:** Supported by data, research, or operational proof

### EXCLUDE if asset is:

❌ **Generic:** "Best practices", "synergy", obvious platitudes
❌ **Overly complex:** Requires 3 paragraphs to explain
❌ **Domain-locked:** Only makes sense in narrow context
❌ **Redundant:** Already have better version of same concept
❌ **Forgettable:** Won't remember 24 hours later

### Linguistic Density Expectations

- **High-density sources** (>0.8 assets/source): BCG reports, McKinsey thought leadership, DeepMind narrative papers
- **Medium-density** (0.3-0.8): Practitioner essays, industry analysis
- **Low-density** (<0.3): News articles, data reports
- **Overall weekly target:** 0.5-0.8 assets/source (30-50 assets from 40-60 sources)

---

## Deduplication Rules

Handle 5 scenarios:

### 1. EXACT DUPLICATES (same asset + same source)

**Action:** Keep one, note appears multiple times in source

### 2. SYNONYMS (different names, same concept)

**Choose preferred term based on:**
- (a) Stronger metaphor
- (b) Premier source
- (c) Memorability

**Action:** Note alternatives in definition: "Also called: [terms]"

**Example:** "Coordination Tax" vs "Collaboration Penalty" → prefer "Tax" (stronger metaphor)

### 3. VARIANTS (similar but distinct emphasis)

**Action:** Keep both if they serve different purposes, note relationship

**Example:** "Tool-Coworker Duality" vs "Agent as Teammate" → both (duality = paradox, teammate = collaboration)

### 4. EVOLUTION (same concept, different framing over time)

**Action:** Keep latest, note evolution

**Example:** "AI assistants" (2023) → "AI agents" (2024) → "Agentic AI" (2025-26)

### 5. CROSS-SOURCE DUPLICATES (same concept, multiple sources)

**Action:** Keep both if different evidence bases or applications, note convergence

**Example:** BCG and McKinsey both emphasize organizational barriers → KEEP BOTH, note convergence in Framing Notes

**Why keep both:** Multiple sources = high confidence signal

---

## Citation Format (CRITICAL for Frontend Parsing)

**Use exact same format as Weekly Learnings and Active Ideas:**

```markdown
### **1. Vibe Coding**
- **Definition:** Non-engineers coding through feel/iteration with AI assistance
- **Evidence:** 49.5% of non-technical professionals report coding work [AIDaily_TimeSavingsEraOverVibeCoders DP2]
<!-- cite:path=02_Extractions/2026-02/AIDaily_TimeSavingsEraOverVibeCoders_2026-02-14.md;dp=2 -->
```

**Citation Rules:**
- Human-readable bracket: `[Source_DescriptiveSlug DP#]`
- Metadata comment immediately after: `<!-- cite:path=... -->`
- Path format: `02_Extractions/YYYY-MM/Source_DescriptiveSlug_YYYY-MM-DD.md`
- Multi-DP: `[Source DP3, DP7]` with `dp=3,7`
- Multi-source: separate `<!-- cite:... -->` per source

**Source naming follows CRIS convention:**
- Format: `Source_DescriptiveSlug_YYYY-MM-DD.md`
- **Exactly 2 underscores** before date
- PascalCase within Source and Slug (NO internal underscores)

See `_System/Citation_Contract.md` for complete citation specifications.

---

## Detailed Workflow

### STEP 1: Detect Week and Load Inputs

**Auto-detect current week:**
```python
from datetime import datetime
week_end_date = datetime.now().strftime('%Y-%m-%d')  # e.g., "2026-02-15"
```

**Or accept optional parameter for retroactive processing:**
```
target_week_end_date = "2026-02-08"
```

**Load inputs:**
1. Read `_System/_extraction_tracker.json`
2. Filter extractions by `extracted_date` matching target week
3. Identify extraction files to process (typically 40-60)
4. Load `09_Deliverables/Language_Assets/Language_Asset_Library.md` for deduplication check

**Week determination logic:**
- If no target specified: use current date as week end date
- Filter tracker for all extractions where `extracted_date` falls within 7 days before week end date
- Example: Week ending 2026-02-15 includes extractions from 2026-02-09 through 2026-02-15

### STEP 2: Check for Existing Weekly File (Handle Mid-Week + End-of-Week)

**Check if file already exists:**
```
09_Deliverables/Language_Assets/_weekly_additions/LA_2026-02-15.md
```

**If exists (end-of-week run after mid-week):**
1. Archive old version:
   - Add timestamp to filename: `LA_2026-02-15_2026-02-12.md` (original creation date)
   - Move to `_weekly_additions/archive/`
2. Same for update instructions file
3. Note in new file: "Incremental update: mid-week captured X assets, end-of-week adds Y new assets"

**If doesn't exist (first run this week):**
- Proceed normally

### STEP 3: Spawn Parallel Sub-Agents (One Per Extraction)

**For each extraction file, spawn sub-agent using Task tool with prompt:**

```
You are mining linguistic assets from a CRIS extraction.

**Extraction file:** 02_Extractions/2026-02/BCG_EmergingAgenticEnterprise_2026-02-04.md

**Your task:**
1. Read the extraction file completely
2. Mine 7 linguistic categories per detailed definitions below
3. Apply quality filters rigorously (memorable, transferable, clarifying, distinctive, evidence-backed)
4. Score source credibility across 4 dimensions
5. Use exact citation format with metadata comments
6. Return structured findings

**CATEGORY DEFINITIONS:**
[Paste complete category definitions from above]

**QUALITY FILTERS:**
[Paste quality filters from above]

**CREDIBILITY SCORING:**
[Paste 4-dimensional scoring system from above]

**CITATION FORMAT:**
[Paste citation rules from above]

**OUTPUT FORMAT:**
Provide findings in this structure:
- Source credibility (4 dimensions + synthesis paragraph)
- Assets organized by category (7 categories)
- Each asset must include all required fields
- Every evidence claim must have citation with metadata comment
```

**Performance:**
- Spawn 40-60 sub-agents in parallel (one per extraction)
- Target: 45-60 minutes total processing time
- Each sub-agent processes 1 extraction independently

**Sub-agent deliverable:**
- Structured findings for one source
- Ready to be integrated into weekly additions file

### STEP 4: Coordinator Consolidates and Deduplicates

**Coordinator receives all sub-agent outputs and:**

1. **Organize by source** (alphabetically, not by category)

2. **Apply deduplication logic:**
   - **Exact duplicates:** Merge, note frequency
   - **Synonyms:** Choose preferred term (metaphor strength, premier source, memorability)
   - **Variants:** Keep both if distinct purpose, note relationship
   - **Evolution:** Keep latest, note trajectory
   - **Cross-source:** Keep both, note convergence in Framing Notes

3. **Check against master library** for global deduplication:
   - Read `09_Deliverables/Language_Assets/Language_Asset_Library.md`
   - Identify any assets that duplicate existing library entries
   - Note in update instructions: "Already in master library, no action needed"

4. **Generate Framing Notes** (200-400 words):
   - Synthesize themes across this week's assets
   - Suggest asset combinations that work well together
   - Identify convergence patterns (multiple sources, same insight)
   - Provide perspective-setting guidance for using assets in conversations

5. **Generate Category Cross-Reference:**
   - List all assets by category (quick lookup)
   - Format: "Asset Name (Source)"
   - Counts for each category

### STEP 5: Generate Weekly Additions File

**File:** `09_Deliverables/Language_Assets/_weekly_additions/LA_YYYY-MM-DD.md`

**Structure - see `references/weekly_additions_template.md` for complete template**

Key sections:
1. Header (metadata: week, sources processed, assets captured, linguistic density)
2. Framing Notes (how to use these assets)
3. Sources (alphabetical, organized by source with 7 categories each)
4. Category Index (cross-reference for quick lookup)
5. Metadata summary

### STEP 6: Generate Session 3 Update Instructions

**File:** `09_Deliverables/Language_Assets/_pending_updates/LA_YYYY-MM-DD_update_instructions.md`

**Structure - see `references/update_instructions_template.md` for complete template**

Key sections:
1. **Placement Instructions**
   - Add to existing source sections (exact line numbers)
   - New source sections to create (full template)
2. **Deduplication Actions**
   - Synonyms to merge
   - Convergence to note
3. **Category Index Updates**
   - Assets to add to cross-reference
4. **Metadata Updates**
   - Source count, asset count, generated date
5. **Validation Checklist**
   - All citations resolve
   - No duplicates
   - Counts accurate

---

## Output Files

### Primary Output
**File:** `09_Deliverables/Language_Assets/_weekly_additions/LA_YYYY-MM-DD.md`
**Format:** Date-based (matches TP_2026-02-15.md and WL_2026-02-15.md pattern)
**Location:** Front-end always reads latest file in `_weekly_additions/` folder

### Secondary Output
**File:** `09_Deliverables/Language_Assets/_pending_updates/LA_YYYY-MM-DD_update_instructions.md`
**Purpose:** Detailed instructions for Session 3 (cris-integrate) to update master library

### Archive Pattern
When running end-of-week after mid-week:
```
_weekly_additions/
├── LA_2026-02-15.md                          ← Latest (frontend reads)
└── archive/
    └── LA_2026-02-15_2026-02-12.md          ← Mid-week version (archived)
```

---

## Session 3 Integration

**When:** During Session 3 (cris-integrate) workflow

**What Session 3 does:**
1. Read `LA_YYYY-MM-DD_update_instructions.md`
2. Execute placement instructions (add assets to source sections)
3. Perform deduplication actions (merge synonyms, note convergence)
4. Update category index (add new assets)
5. Update metadata (counts, dates)
6. Validate all citations resolve
7. Archive update instructions after execution

**Result:** Master `Language_Asset_Library.md` stays current with weekly additions

---

## Example Usage

### Standard Weekly Run (Auto-Detect)

```
Run cris-linguistic-mining for this week
```

### Retroactive Processing (Specific Week)

```
Run cris-linguistic-mining for week ending 2026-02-08
```

### Mid-Week Check

```
Run cris-linguistic-mining mid-week check
```

---

## Quality Standards

**Minimum thresholds:**
- Linguistic density: 0.5-0.8 assets/source
- Evidence backing: Every asset must cite source DP
- Citation format: 100% compliance with metadata comments
- Deduplication: Zero exact duplicates in final output

**Expected output:**
- 30-50 assets from 40-60 sources
- 4-dimensional credibility for every source
- Framing Notes (200-400 words)
- Category cross-reference (complete)
- Session 3 update instructions (detailed, executable)

---

## Tips for Best Results

1. **Read full extraction files** - Don't skim, linguistic assets often appear in context
2. **Apply quality filters rigorously** - Better to have 30 excellent assets than 60 mediocre ones
3. **Check master library** - Avoid global duplicates across weeks
4. **Write clear Framing Notes** - Help user understand how to use assets together
5. **Be specific in update instructions** - Session 3 agent needs exact line numbers and actions
6. **Use parallel sub-agents** - Spawn all extraction agents in same turn for performance
7. **Validate citations** - Every citation must resolve to valid extraction file and DP

---

## Troubleshooting

**If linguistic density is too low (<0.3):**
- Check if sources are data-heavy vs narrative-rich
- Review quality filters—may be too strict
- Look for implicit frameworks without explicit names

**If too many duplicates:**
- Strengthen deduplication in Step 4
- Check master library more carefully
- Note convergence instead of treating as redundant

**If citations don't resolve:**
- Verify extraction file names match tracker
- Check path format: `02_Extractions/YYYY-MM/Source_Slug_YYYY-MM-DD.md`
- Ensure DP numbers exist in extraction

**If sub-agents are too slow:**
- Verify parallel spawning (all agents in same turn)
- Check if sub-agents are waiting for each other (should be independent)
- Consider using haiku model for sub-agents if speed critical

---

## References

Within this skill:
- `references/weekly_additions_template.md` - Complete template for LA file
- `references/update_instructions_template.md` - Complete template for update instructions
- `references/category_examples.md` - Detailed examples for each category

In CRIS system:
- `_System/working/Language_Asset_Library_PROTOTYPE_v2.md` - Structure example
- `_System/working/Language_Asset_Library_USAGE_DEMO.md` - Intended use cases
- `_System/Citation_Contract.md` - Citation format requirements
- `_System/_extraction_tracker.json` - Source of truth for extraction status
