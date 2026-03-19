---
name: cris-extract
description: Automatically extract and process new source files in the CRIS research system. Use this skill whenever the user mentions extracting files, processing pending extractions, or working with new CRIS sources. Triggers on phrases like "extract new files", "process extractions", "extract pending files", or any mention of extraction in the context of the CRIS research system. This skill handles filename validation, parallel processing, tracker updates, and reference correction to ensure data integrity across the entire CRIS workflow.
---

# CRIS Extract

Automated extraction workflow for the CRIS (Contextual Research Intelligence System) research system.

## Overview

This skill automates the extraction of source documents (PDFs, transcripts, articles) into atomic data point (DP) format for the CRIS research system. It handles:

- **Automatic discovery** of pending files via extraction tracker
- **Intelligent batching** by file size for optimal parallel processing
- **Strict filename validation** with automatic correction
- **Reference integrity** - updates all citations if files are renamed
- **Parallel sub-agent processing** for efficiency
- **Quality enforcement** using validation scripts

**When to use:** Any time the user wants to extract new CRIS source files or process pending extractions.

---

## Workflow

### Phase 0: Pre-Flight Checklist

Before touching any files, confirm two things. If the user's instruction already answers both, skip to Phase 1.

1. **Date convention:** Should the filename date reflect the **extraction date** (today's date) or the **publication date** (when the source was originally published)?
   - **Default: extraction date** — use today's date unless the user says otherwise.
   - This determines the filename suffix AND the folder under `02_Extractions/YYYY-MM/`. Getting this wrong causes files to land in the wrong month folder and requires a rename-and-move to fix.

2. **Known naming edge cases:** Are there sources with unusual names — multi-word publishers, titles that begin with numbers, non-English characters? Flag these now so agents don't produce invalid slugs.

---

### Phase 1: Discovery and Planning

1. **Read the extraction tracker:**
   ```bash
   cat _System/_extraction_tracker.json
   ```

2. **Identify pending files:**
   - Files with `status: "pending"`
   - Files in `01_Raw_Inputs/` not yet in tracker

3. **Check file sizes and batch strategy:**
   ```bash
   # For each pending file
   ls -lh 01_Raw_Inputs/[path]/[filename]
   ```

   Batch by size:
   - Small (<500 KB): 5-8 files per batch
   - Medium (500 KB-3 MB): 3-5 files per batch
   - Large (>3 MB): 2-3 files per batch
   - Mixed sizes: Create intelligent batches balancing load

   **Session batch cap:** Process no more than 12–15 files per session. If the pending count exceeds this, plan only the first 12–15 and tell the user a second session will be needed for the remainder. Attempting too many files in one session risks context-limit stalls mid-workflow that force the user to prompt "please continue" multiple times.

4. **Report to user:**
   - Total pending files found
   - Batch strategy (e.g., "2 batches: 5 small files, 3 medium files")
   - If over session cap: which files are in scope for this session and which are deferred
   - Proceed with extraction

---

### Phase 2: Parallel Extraction

For each batch, spawn parallel Task tool agents (one agent per file):

**Each agent receives:**
```
Extract [source filename] from CRIS raw inputs.

**CRITICAL — Content integrity:**
You MUST use the Read tool to open the actual source file before writing any data points. Do NOT generate content from memory or training knowledge — even if you recognize the source. Every anchor must be a verbatim quote that exists in the file and can be found with Cmd+F. If you cannot read the file, return an error message instead of fabricating content.

**Instructions:**
1. Read _System/Workflows/Extraction.md for atomic DP format
2. Read Tags.md for current tag vocabulary
3. **Use the Read tool** to read the source file at: 01_Raw_Inputs/[path]/[filename]
4. Extract data points using atomic DP format:
   - **DP#:** [Your interpretation — the atomic insight]
   - **Anchor:** "[Verbatim 5-15 word quote from source]"
   - **Citation:** (p. XX or timestamp)
   - **Evidence Type:** [empirical | anecdotal | framework | prediction | case_study | expert_opinion | data_metric]
   - **Tags:** #existing-tag1, #existing-tag2
5. Include required metadata:
   - **Source:** [Publisher/Channel name]
   - **Published:** [YYYY-MM-DD]
   - **Original Location:** 01_Raw_Inputs/[relative path]
6. Propose filename following STRICT naming convention:
   - Format: SourceName_DescriptiveSlug_YYYY-MM-DD.md
   - EXACTLY 2 underscores (both before date)
   - PascalCase for Source and Slug (NO internal underscores)
   - The date in the filename is the EXTRACTION DATE (today), not the publication date
   - Slug must start with a capital letter — if the descriptive title starts with a number,
     restructure to lead with a word (e.g., AICapex650B not 650BillionAICapex)
   - Examples:
     * FinancialTimes_MustafaSuleymanAI_2026-02-13.md ✅
     * Financial_Times_MustafaSuleymanAI_2026-02-13.md ❌ (3 underscores)
     * AIDaily_AICapex650B_2026-02-22.md ✅
     * AIDaily_650BillionAICapex_2026-02-22.md ❌ (slug starts with digit)
7. Return:
   - Proposed filename
   - DP count
   - New tag proposals
   - Full extraction content (markdown format)

**DO NOT save the file yet** - return content for validation first.
```

**Wait for all agents to complete** before proceeding to validation.

---

### Phase 3: Filename Validation (CRITICAL)

For each proposed extraction filename, validate using the validation script:

```bash
bash _System/scripts/validate_filename.sh "[proposed_filename]"
```

**Validation pattern:** `^[A-Z][a-zA-Z0-9]+_[A-Z][a-zA-Z0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$`

**If validation fails:**

1. **Diagnose the issue:**
   - Count underscores (should be exactly 2)
   - Check for internal underscores in Source/Slug
   - Verify PascalCase (starts with capital letter)
   - **Slug starts with a digit:** The regex requires `[A-Z]` as the first character of the slug segment. If the descriptive title begins with a number (e.g., "650 Billion AI Capex"), restructure the slug to lead with a word: `AICapex650B`, not `650BillionAICapex`.

2. **Propose correction:**
   - "Financial Times" → `FinancialTimes` (NOT `Financial_Times`)
   - "AI News Daily" → `AINewsDaily` (NOT `AI_News_Daily`)
   - "Every" → `Every` (already one word)
   - "a16z" → `A16z` (capitalize first letter)

3. **Show user the correction:**
   ```
   ❌ Invalid: Financial_Times_MustafaSuleymanAI_2026-02-13.md
   ✅ Corrected: FinancialTimes_MustafaSuleymanAI_2026-02-13.md

   Issue: 3 underscores found (expected 2)
   Fix: Removed underscore from source name
   ```

4. **Get confirmation or alternative** before saving

**Only proceed to saving after ALL filenames are validated.**

> **Natural break point:** If the session is showing signs of context strain (slow responses, the user has had to prompt "please continue"), stop here and report which files are validated and ready. The user can start a fresh session and pick up from Phase 4.

---

### Phase 4: Save Extractions

For each validated extraction:

1. **Save to correct location:**
   ```bash
   # Determine month folder
   date_part=$(echo "[filename]" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
   month_folder=$(echo "$date_part" | cut -d'-' -f1-2)

   # Create directory if needed
   mkdir -p 02_Extractions/$month_folder

   # Save file
   cat > 02_Extractions/$month_folder/[filename] << 'EOF'
   [extraction content]
   EOF
   ```

2. **Verify file was saved correctly:**
   ```bash
   ls -lh 02_Extractions/$month_folder/[filename]
   ```

---

### Phase 4.5: Persist to Convex via MCP

After saving each extraction file to disk, persist the source and data points to Convex using the CRIS MCP tools. This keeps the database in sync with new extractions and enables vector search (Phase 3), synthesis queries, and cross-referencing.

**For each validated and saved extraction:**

**Step 1: Register the source**

Call the `upload_source_file` MCP tool:

```
upload_source_file({
  filePath: "/absolute/path/to/02_Extractions/YYYY-MM/[filename].md",
  metadata: {
    title: "[SourceName]_[Slug]_[Date]",
    sourceType: "article" | "pdf" | "transcript" | "web",
    publisherName: "[Publisher]",
    publishedDate: "[YYYY-MM-DD]",
    authorName: "[Author if known]"
  }
})
```

Record the returned `sourceId`. If the tool returns `"Source already exists for this content hash"`, use the existing `sourceId`.

**Step 2: Save data points**

Call the `save_data_points` MCP tool with the structured DP data from the extraction:

```
save_data_points({
  sourceId: "[sourceId from Step 1]",
  dataPoints: [
    {
      claimText: "[DP interpretation — the insight]",
      anchorQuote: "[verbatim quote from source]",
      citationDisplay: "(p. 42)" or "(00:15:30)",
      locationType: "page" | "timestamp" | "paragraph" | "section",
      locationStart: 42,
      evidenceType: "empirical" | "anecdotal" | "framework" | "prediction" | "case_study" | "expert_opinion" | "data_metric",
      tags: ["tag-slug-1", "tag-slug-2"]
    },
    ...
  ]
})
```

**Mapping from markdown DP format to Convex format:**

| Markdown Field | Convex Field |
|----------------|-------------|
| `**DP#:** [text]` | `claimText` |
| `**Anchor:** "[quote]"` | `anchorQuote` |
| `**Citation:** (p. X)` | `citationDisplay` |
| `**Evidence Type:** empirical` | `evidenceType` |
| `**Tags:** #tag1, #tag2` | `tags: ["tag1", "tag2"]` (strip `#`) |

Note: `locationType` and `locationStart` can be inferred from `citationDisplay` (page citations → `"page"` + page number; timestamps → `"timestamp"`).

**Step 3: Confirm**

Record `sourceId` and DP count in the session summary. The extraction is now in both the local filesystem and Convex.

> **If MCP tools are unavailable:** Continue with file-only mode. Note `convex_synced: false` in the tracker entry. A separate sync operation can be run later using `upload_source_file` + `save_data_points`.

---

### Phase 5: Update Tracker and Index

1. **Update extraction tracker:**
   ```bash
   # Read current tracker
   cat _System/_extraction_tracker.json

   # For each extracted file, update its entry:
   # - Change status from "pending" to "extracted"
   # - Add dp_count
   # - Add extraction_date
   # - Add extraction_location

   # Save updated tracker
   ```

2. **Update extraction index:**
   ```bash
   # Read current index
   cat 02_Extractions/_Extraction_Index.md

   # Add new entries for each extraction:
   # | [Filename] | [Source] | [DP Count] | [Date] | [Tags] | [Citations] |

   # Save updated index
   ```

3. **Consolidate tag proposals:**
   - Collect all new tag proposals from agents
   - Check against current Tags.md
   - Present to user for confirmation

---

### Phase 6: Report Summary

Present final summary:

```
✅ Extraction complete!

**Files processed:** [X] files
**Data points captured:** [Y] DPs total
**Batch strategy:** [strategy description]

**Naming corrections made:**
- [old_name] → [new_name] (reason)

**New tags proposed:**
- #new-tag-1 (found in [X] files)
- #new-tag-2 (found in [Y] files)

**Updated:**
- ✅ _extraction_tracker.json (status updated)
- ✅ _Extraction_Index.md (new entries added)
- ✅ Convex (sources and data points persisted via MCP)

**Outputs:** 02_Extractions/[YYYY-MM]/
```

---

## Error Correction and Reference Updates

If filenames need to be corrected AFTER extraction (e.g., wrong naming was used):

### Renaming Workflow

1. **Identify files with incorrect naming:**
   ```bash
   # Scan extractions directory
   find 02_Extractions -name "*.md" -type f | while read file; do
       filename=$(basename "$file")
       bash _System/scripts/validate_filename.sh "$filename" || echo "Invalid: $file"
   done
   ```

2. **For each invalid filename:**
   - Propose corrected name
   - Show user: `old_name → new_name`
   - Get confirmation

3. **Rename file:**
   ```bash
   mv 02_Extractions/[YYYY-MM]/[old_name].md \
      02_Extractions/[YYYY-MM]/[new_name].md
   ```

4. **Update all references:**

   a) **Update _Extraction_Index.md:**
   ```bash
   # Replace old filename with new filename in index
   sed -i 's/old_name\.md/new_name.md/g' 02_Extractions/_Extraction_Index.md
   ```

   b) **Update _extraction_tracker.json:**
   ```bash
   # Update tracker entry for this file
   ```

   c) **Update synthesis documents** (if file is cited):
   ```bash
   # Search for citations in:
   # - 03_Weekly_Learnings/**/*.md
   # - 06_Current_Understanding/Active_Ideas.md
   # - 06_Current_Understanding/Current_Synthesis.md
   # - 09_Deliverables/Talking_Points/**/*.md

   # Replace [old_name DP#] with [new_name DP#]
   grep -r "\\[old_name DP" 03_Weekly_Learnings/ 06_Current_Understanding/ 09_Deliverables/ | \
       cut -d':' -f1 | sort -u | while read file; do
           sed -i 's/\\[old_name DP/[new_name DP/g' "$file"
       done
   ```

   d) **Update Extraction_Name_Mapping.md** (if exists):
   ```bash
   # Add entry to mapping file:
   # - old_name → new_name (date renamed, reason)
   ```

5. **Verify all updates:**
   ```bash
   # Check that no references to old name remain
   grep -r "old_name" 02_Extractions/ 03_Weekly_Learnings/ 06_Current_Understanding/ 09_Deliverables/
   # Should return no results
   ```

6. **Report changes:**
   ```
   ✅ Renamed: old_name.md → new_name.md

   **Updated references in:**
   - ✅ _Extraction_Index.md
   - ✅ _extraction_tracker.json
   - ✅ WL_2026-02-07.md (3 citations)
   - ✅ Active_Ideas.md (1 citation)

   **No broken references remaining.**
   ```

---

## Source Name Conversion Reference

Common source name patterns:

| Source Display Name | Correct Filename Format | ❌ Wrong Format |
|---------------------|-------------------------|----------------|
| Financial Times | FinancialTimes | Financial_Times |
| AI News Daily | AINewsDaily | AI_News_Daily |
| Every | Every | (already correct) |
| TechCrunch | TechCrunch | Tech_Crunch |
| a16z | A16z | a16z (lowercase) |
| The Verge | TheVerge | The_Verge |
| Hacker News | HackerNews | Hacker_News |

**Rule:** Remove all spaces and special characters, capitalize each word, concatenate into PascalCase.

**Slug digit rule:** If the descriptive slug would naturally start with a number (e.g., a title like "650 Billion AI Capex" or "5 Levels of AI"), restructure so the slug leads with a meaningful word:

| Title | ✅ Correct Slug | ❌ Wrong Slug |
|-------|----------------|--------------|
| 650 Billion AI Capex | AICapex650B | 650BillionAICapex |
| 5 Levels of AI | FiveLevelsAI | 5LevelsAI |
| 285B Parameter Model | ParamModel285B | 285BParamModel |

---

## Atomic DP Format Reference

Each data point must follow this exact structure:

```markdown
**DP1:** [Your interpretation of what this data point means - the insight]

**Anchor:** "[Verbatim 5-15 word quote from source - must be searchable with Cmd+F]"

**Citation:** (p. 42) or (00:15:30)

**Tags:** #existing-tag-1, #existing-tag-2
```

**Critical requirements:**
- Anchors must be verbatim quotes (not paraphrased)
- Anchors must be 5-15 words (searchable length)
- Citations must include page or timestamp
- Tags must use existing vocabulary from Tags.md
- Each DP captures ONE atomic insight

---

## Resources

### Validation Script

Location: `_System/scripts/validate_filename.sh`

Usage:
```bash
bash _System/scripts/validate_filename.sh "filename.md"
```

Returns:
- Exit 0 (valid) with ✅ message
- Exit 1 (invalid) with ❌ message and diagnosis

The script checks:
- Regex pattern match
- Underscore count (exactly 2)
- PascalCase format
- Date format (YYYY-MM-DD)

### System Files to Reference

Load these as needed during extraction:

- `_System/Workflows/Extraction.md` - Full atomic DP format specification
- `_System/Style_Guide.md` - Writing standards
- `_System/Data_Point_Normalization.md` - Metric presentation rules
- `Tags.md` - Current tag vocabulary
- `02_Extractions/_Extraction_Index.md` - Existing extractions
- `_System/_extraction_tracker.json` - Pending/extracted file status

---

## Quality Checks Before Finalizing

Before reporting completion:

1. **✅ All filenames validated** - No invalid naming patterns
2. **✅ Tracker updated** - All files marked "extracted" with DP counts
3. **✅ Index updated** - New entries added for all extractions
4. **✅ Files saved correctly** - Verify files exist in 02_Extractions/YYYY-MM/
5. **✅ No broken references** - If files renamed, all citations updated
6. **✅ Tags proposed** - New tags flagged for user confirmation
7. **✅ Convex persisted** - All sources and DPs saved via MCP tools (sourceIds recorded)

Run validation check:
```bash
# Verify all saved files pass validation
find 02_Extractions -name "*.md" -type f | while read file; do
    filename=$(basename "$file")
    bash _System/scripts/validate_filename.sh "$filename"
done
```

All files should show ✅ VALID.

---

## Common Issues and Troubleshooting

### Issue: Anchors in an extraction look paraphrased or can't be found with Cmd+F

**Cause:** The extraction agent generated content from memory rather than reading the source file. This produces plausible-sounding but fabricated quotes — a data integrity failure.

**Fix:** Re-extract the file. Spawn a fresh agent with the content integrity mandate in Phase 2 and verify the agent explicitly reports using the Read tool. If the source file is a PDF that can't be read programmatically, note this in the extraction and use the closest paraphrase with a clear flag: `[paraphrase — PDF could not be parsed]`.

### Issue: Agent returns filename with too many underscores

**Cause:** Agent interpreted source name with spaces as multiple words separated by underscores.

**Fix:** Apply PascalCase conversion rule - remove all underscores from source/slug portions.

### Issue: Files saved but tracker not updated

**Cause:** Tracker update step was skipped or failed.

**Fix:** Re-run Phase 5 to update tracker. Check for JSON syntax errors.

### Issue: Citations broken after renaming

**Cause:** Synthesis documents reference old filename.

**Fix:** Run reference update workflow (Phase "Error Correction" above). Use grep to find all references and sed to update them.

### Issue: Validation script returns permission denied

**Cause:** Script not executable.

**Fix:**
```bash
chmod +x _System/scripts/validate_filename.sh
```

---

## Performance Tips

**Optimize for speed:**
- Spawn maximum allowed sub-agents in parallel (don't process sequentially)
- For large batches (10+ files), split into multiple batches of 5-8 agents each
- Run validation in parallel for multiple files

**Optimize for quality:**
- Always validate filenames BEFORE saving (prevents rework)
- Check for duplicate extractions (compare against _Extraction_Index.md)
- Review proposed filenames with user if any look suspicious

**Balance both:**
- Process small/medium files in parallel (fast)
- Process large files separately (quality, avoid timeout)
- Report progress per batch so user can monitor
