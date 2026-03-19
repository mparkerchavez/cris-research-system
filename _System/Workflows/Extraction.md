# Workflow: Extraction

Process new source documents into structured extractions with verifiable data points.

## Before Starting

1. Read `Tags.md` for current tag list
2. Check `02_Extractions/YYYY-MM/` to identify already-extracted files
3. Assess file sizes before extracting

## Metadata Format (Required for Lineage)

**Every extraction MUST include properly formatted metadata with the Original Location field.**

```markdown
# [Source Title]

## Metadata
- **Source:** [Author/Organization]
- **Published:** [Original publication date]
- **Processed:** [Date you extracted this]
- **Type:** PDF | Transcript | Article
- **Original Location:** 01_Raw_Inputs/YYYY-MM/YYYY-MM-DD_to_DD/filename.pdf
```

| Field | Correct | Incorrect |
|-------|---------|-----------|
| Field name | `**Original Location:**` | `**URL/Location:**` or `**Source:**` |
| Path format | `01_Raw_Inputs/2026-02/...` | `/sessions/.../01_Raw_Inputs/...` |
| For URLs | Full URL: `https://example.com/doc` | Relative URL or short name |

**Why this matters:** The Original Location field enables lineage tracing from ideas → extractions → source files. Without it, verification tools and dashboards fail.

## File Size Strategy

| File Size | Strategy |
|-----------|----------|
| < 500 KB | Direct Read tool |
| 500 KB - 1 MB | Attempt direct; fall back to PDF skill if needed |
| 1-3 MB | Use PDF skill with 20-page chunks |
| 3-7 MB | PDF skill with chunks; verify completeness |
| 7+ MB | PDF skill; consider selective extraction |

## Multi-Pass Protocol (30+ pages)

Large documents require multiple passes:

**Pass 1 (pages 1-20):**
- Extract initial data points, quotes, themes
- Create extraction file with preliminary content

**Pass 2+ (remaining chunks):**
- Read each 20-page chunk sequentially
- Update extraction with additional data points (3-7 per chunk)
- Add quotes (3-5 per chunk)

**Verification:**
- Confirm data points span full page range
- Check quotes distributed across sections
- Ensure Initial Observations reflect complete document

## Extraction File Naming

**Required format:** `Source_DescriptiveSlug_YYYY-MM-DD.md`

**Critical rules (enforced by citation parser):**
1. **Two parts before date:** Source name + descriptive slug (both required)
2. **Only alphanumeric and underscores:** NO hyphens, spaces, or special characters
3. **Use underscores to separate words:** `AI_News_Strategy_Daily` not `AI-News-Strategy-Daily`
4. **Always include processing date:** Date you extracted it (YYYY-MM-DD format)

**Valid examples:**
- ✅ `McKinsey_AI_Report_2026-02-03.md`
- ✅ `AI_News_Strategy_Daily_Going_Slower_Feels_Safer_2026-02-10.md`
- ✅ `Harvard_Business_Review_McKinsey_AI_Reinvent_2026-02-10.md`
- ❌ `McKinsey-AI-Report_2026-02-03.md` (hyphens not allowed)
- ❌ `McKinsey_2026-02-03.md` (missing descriptive slug)
- ❌ `AI News Strategy Daily_2026-02-10.md` (spaces not allowed)

**Why this matters:** The citation parser uses this exact format to resolve references in Weekly Learnings, Active Ideas, and the POC app. Files that don't match this pattern will fail to link properly in the lineage graph.

## Atomic Data Point Format

**Each data point must include:**

```markdown
**DP1:** [Your interpretation of the finding]
- **Anchor:** "[Verbatim 5-15 word quote from source]"
- **Citation:** (p. XX)
- **Tags:** #tag1, #tag2
```

**The Anchor is critical for verification:**

| Anchor Rule | Why |
|-------------|-----|
| Must be **verbatim** | Enables Cmd+F search in source |
| Must be **5-15 words** | Long enough to be unique, short enough to search |
| Must be **distinctive** | Avoid generic phrases like "the report found" |
| Must be **from the source** | Not your paraphrase—the actual text |

**Good anchor examples:**
- ✅ "85% lack use cases that generate business value"
- ✅ "coordination yields negative returns once single-agent baseline exceeds"
- ❌ "the report found that most workers" (too generic)
- ❌ "AI adoption" (too short, not unique)

## Interpretation vs. Anchor

| Component | What It Is | Can Paraphrase? |
|-----------|------------|-----------------|
| **DP statement** | Your interpretation of the finding | Yes |
| **Anchor** | Verbatim quote from source | **No—must be exact** |

**Example:**
```markdown
**DP3:** Most workers lack value-driving AI use cases despite high tool usage
- **Anchor:** "85% lack use cases that generate business value"
- **Citation:** (p. 14)
```

Your interpretation (DP3 statement) synthesizes meaning. The anchor preserves the exact source text for verification.

## Combining Multiple Data Points

When a finding draws from multiple locations:

```markdown
**DP7:** Training moves workers from novice to experimenter but rarely to practitioner
- **Anchor 1:** "28% at novice level" (p. 8)
- **Anchor 2:** "70% reach experimenter" (p. 12)
- **Anchor 3:** "only 2.7% achieve practitioner" (p. 15)
- **Tags:** #skill-formation, #adoption-barriers
```

This makes it clear which parts of your interpretation come from where.

## Tagging Protocol

1. Check `Tags.md` before proposing tags
2. List proposed tags for user confirmation
3. Use existing tags when possible
4. New tags go to "Emerging" section until 3+ sources use them

## Citation Formats

| Source Type | Format |
|-------------|--------|
| PDF | (p. 12) or (Section 3, p. 12) |
| YouTube | (14:32) or (14:32, Speaker: [Name]) |
| Web Article | (para. 5) + archived URL if available |

## Citation Metadata Contract (Required for Synthesis Outputs)

When DPs are reused in Weekly Learnings, Current Synthesis, or Active Ideas prose citations, each bracket citation must carry machine metadata using the format defined in:

`_System/Citation_Contract.md`

Required synthesis citation pattern:

```markdown
[Source_Name DP3, DP7]
<!-- cite:path=02_Extractions/YYYY-MM/Source_Name_YYYY-MM-DD.md;dp=3,7 -->
```

For unresolved references (do not guess paths):

```markdown
[User observation (Capital Group)]
<!-- cite:source=User observation (Capital Group);status=unresolved -->
```

## Final Verification Checklist

Before completing extraction:

- [ ] **Original Location** field is present and correctly named (not "URL/Location")
- [ ] Original Location uses relative path from CRIS root (not `/sessions/...`)
- [ ] All anchors are verbatim quotes (not paraphrased)
- [ ] All anchors are searchable (5-15 words, distinctive)
- [ ] All citations include page/timestamp
- [ ] Data points span full document (not just first pages)
- [ ] Multi-source interpretations show all anchors separately
- [ ] Source stem is stable and reusable in synthesis citations
- [ ] DP numbering is consistent and parseable (`DP1`, `DP2`, ...)

---

## Batch Extraction with Parallel Sub-Agents

**When to use:** Processing 3+ files at once. Parallel extraction keeps each source isolated in its own context window, improving accuracy and preventing cross-contamination between sources.

### Why Parallel Extraction?

| Approach | Context Window | Accuracy Risk |
|----------|----------------|---------------|
| Sequential (one agent, many files) | Fills with multiple sources | Higher—sources blend together |
| Parallel (sub-agent per file) | Each agent sees only one source | Lower—isolated analysis |

### Batch Extraction Pattern

**Step 1 — Orchestrator prepares batch:**
```
Main agent reads:
- _Extraction_Index.md (what's already extracted)
- Tags.md (current tag list)
- List of files to extract

Main agent creates extraction plan:
- Groups files by size/complexity
- Assigns to parallel batches (3-5 files per batch)
```

**Step 2 — Spawn parallel sub-agents:**
```
For each file in batch, spawn sub-agent with:
- Single source file path
- Tags.md content (embedded in prompt)
- Extraction template
- Atomic DP format instructions
```

**Step 3 — Sub-agent extracts (isolated context):**
```
Each sub-agent:
- Reads ONLY its assigned source
- Creates extraction with atomic DPs
- Proposes tags
- Writes extraction file
- Returns summary: filename, DP count, proposed new tags
```

**Step 4 — Orchestrator consolidates:**
```
Main agent:
- Collects results from all sub-agents
- Updates _Extraction_Index.md with new entries
- Reviews proposed new tags
- Presents tag confirmations to user
```

### Sub-Agent Prompt Template

When spawning extraction sub-agents, use this pattern:

```
You are extracting a single source document for the CRIS research system.

**Your source:** [filename]
**Raw input location:** [relative path from CRIS root, e.g., 01_Raw_Inputs/2026-02/2026-02-01_to_07/filename.pdf]
**Output location:** 02_Extractions/YYYY-MM/[Source_Name]_YYYY-MM-DD.md

**Current tags (use these when applicable):**
[paste Tags.md content]

**Your task:**
1. Read the source document completely
2. Create extraction with this EXACT metadata format:

# [Source Title]

## Metadata
- **Source:** [Author/Organization]
- **Published:** [Original publication date]
- **Processed:** YYYY-MM-DD
- **Type:** PDF | Transcript | Article
- **Original Location:** [COPY THE RAW INPUT LOCATION EXACTLY - use relative path]

3. Extract 10-20 atomic data points using this format:

**DP1:** [Your interpretation]
- **Anchor:** "[Verbatim 5-15 word quote]"
- **Citation:** (p. XX)
- **Tags:** #tag1, #tag2

4. Include 3-5 notable quotes
5. Write Initial Observations
6. Verify all anchors are verbatim and searchable

**Critical rules:**
- The **Original Location** field is REQUIRED - do not rename to "URL/Location"
- Use relative paths (01_Raw_Inputs/...), NOT absolute paths (/sessions/...)
- Anchors must be EXACT quotes from the source (not paraphrased)
- Anchors should be 5-15 words, distinctive enough to Cmd+F
- Data points should span the full document, not just early pages
- Use existing tags when possible; propose new tags sparingly

**When complete:** Return a summary with:
- Filename created
- Total DP count
- Any new tags proposed
```

### Batch Size Guidelines

| File Complexity | Files Per Batch | Rationale |
|-----------------|-----------------|-----------|
| Small (<500 KB, <20 pages) | 5-8 files | Fast extraction, low risk |
| Medium (500 KB-3 MB, 20-50 pages) | 3-5 files | Moderate complexity |
| Large (>3 MB, 50+ pages) | 2-3 files | Needs more sub-agent attention |

### When NOT to Parallelize

- **Single file:** Just extract directly
- **Files that reference each other:** Extract sequentially to catch connections
- **First-time setup:** Do a few manually first to establish patterns
