# Extraction File Renaming - Complete

**Completed:** February 7, 2026
**Status:** ✅ All deliverables complete

---

## Summary

Successfully renamed all 62 extraction files in `02_Extractions/2026-02/` to follow consistent naming convention for regex-based parser compatibility.

**New naming format:** `Source_DescriptiveSlug_YYYY-MM-DD.md`
**Inline citation format:** `[Source_DescriptiveSlug DPx]` (drops date)

---

## What Was Completed

### ✅ Deliverable 1: Naming Mapping Table
- Created complete mapping of old → new filenames for all 62 files
- Verified no duplicate Source_Slug combinations
- Documented inline citation format for each file
- File: `_System/Extraction_Name_Mapping.md`

### ✅ Deliverable 2: File Renaming and Metadata Updates
- Renamed all 61 files requiring changes (1 file already correct)
- Updated `_Extraction_Index.md` with all new filenames
- Verified `EXTRACTION_SUMMARY_2026-02-04.md` already uses correct names
- Internal file metadata did not require updates (no self-referential filenames found)

### ✅ Deliverable 3: System File Updates
- Updated `_System/Citation_Contract.md` (v1.2 → v1.3)
  - Added extraction file naming convention section
  - Provided examples using new format
- Updated `_System/Data_Point_Normalization.md`
  - Removed "Known Dependency: Extraction Labeling" section (issue resolved)
  - Updated lineage examples to use new naming convention
  - Updated front-end app integration notes

### ✅ Deliverable 4: Old-to-New Mapping Reference
- Created `_System/Extraction_Name_Mapping.md` with complete mapping table
- This file will be used by next session when regenerating Weekly Learnings
- Also used when updating front-end parser

### ✅ Deliverable 5: Verification
- All 62 files match naming convention: `Source_DescriptiveSlug_YYYY-MM-DD.md`
- Zero files with hyphens in Source or Slug segments ✓
- Zero files with periods in Source or Slug segments ✓
- Zero duplicate Source_Slug combinations ✓
- Parser-ready format confirmed ✓

---

## Key Changes Made

### Source Name Standardization
All source names now use underscores (no hyphens):
- `AI-Explained` → `AI_Explained`
- `The-AI-Daily-Brief` → `The_AI_Daily_Brief`
- `Theo-t3gg` → `Theo_t3gg`
- And 10+ other sources

### Slug Improvements
- Removed all hyphens and periods
- PascalCase throughout
- Added distinguishing details where needed:
  - KPMG quarterly reports: `AIPulseQ1_2025`, `AIPulseQ2_2025`, etc.
  - a16z Big Ideas series: `BigIdeasPart1`, `BigIdeasPart2`, `BigIdeasPart3`
  - Converted version numbers: `Opus46` (not `Opus4.6`), `K25` (not `K2-5`)

### Date Handling
- Files with duplicate dates → single extraction date
- Files with publication + extraction dates → extraction date only

---

## Citation Examples (New Format)

**Single source:**
```markdown
[BCG_EmergingAgenticEnterprise DP3]
<!-- cite:path=02_Extractions/2026-02/BCG_EmergingAgenticEnterprise_2026-02-04.md;dp=3 -->
```

**Multiple data points:**
```markdown
[KPMG_AIPulseQ4_2025 DP8, DP12, DP15]
<!-- cite:path=02_Extractions/2026-02/KPMG_AIPulseQ4_2025_2026-02-04.md;dp=8,12,15 -->
```

**Multiple sources:**
```markdown
[Anthropic_ClaudesConstitution DP7; The_AI_Daily_Brief_IsSoftwareDead DP5]
<!-- cite:path=02_Extractions/2026-02/Anthropic_ClaudesConstitution_2026-02-04.md;dp=7 -->
<!-- cite:path=02_Extractions/2026-02/The_AI_Daily_Brief_IsSoftwareDead_2026-02-06.md;dp=5 -->
```

---

## Parser Integration Requirements

The regex-based parser (Python, `server.py`) can now reliably:
1. Split filename into Source, Slug, and Date segments using underscores
2. Match inline citations `[Source_Slug DPx]` to filenames
3. Parse file paths in HTML comment metadata

**Hard constraints satisfied:**
- No hyphens in Source or Slug (underscores only as segment separators)
- No periods in Source or Slug (except `.md` extension)
- Consistent PascalCase within segments
- Unique Source_Slug combinations across all files

---

## Next Steps

**For regenerating Weekly Learnings:**
- Use `_System/Extraction_Name_Mapping.md` to update all citations
- All old citation formats must be converted to new format

**For front-end parser updates:**
- Update regex patterns to match new format
- Test citation parsing with example files
- Verify linkage from citations → extraction files

**Downstream files NOT updated:**
- Weekly Learnings (will be regenerated in separate session)
- Current Synthesis (will be regenerated)
- Talking Points (will be regenerated)
- Active Ideas (will be regenerated)

These files still contain old citation formats and will be batch-updated when regenerated.

---

## Files Modified

**Extraction files:** 62 renamed (61 changes, 1 already correct)
**Index files:** 1 updated (`_Extraction_Index.md`)
**System files:** 2 updated (`Citation_Contract.md`, `Data_Point_Normalization.md`)
**New files:** 1 created (`_System/Extraction_Name_Mapping.md`)

---

## Verification Results

```
Total extraction files: 62
Valid files: 62
Invalid files: 0

✅ ALL CHECKS PASSED

Verification summary:
  ✓ All 62 files match naming convention
  ✓ No hyphens in Source or Slug segments
  ✓ No periods in Source or Slug segments
  ✓ No duplicate Source_Slug combinations

All extraction files are properly named and ready for parser integration.
```

---

**Task completed successfully. All 62 extraction files now follow consistent naming convention for reliable regex-based parsing.**
