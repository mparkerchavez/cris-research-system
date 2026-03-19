# Master Library Update Instructions - Template

**Use this template when generating LA_YYYY-MM-DD_update_instructions.md files**

---

```markdown
# LA_YYYY-MM-DD Master Library Update Instructions

**Generated:** [Date]
**Sources Processed:** [Count]
**New Assets:** [Count]
**Deduplication Actions:** [Count]
**Target Library:** `09_Deliverables/Language_Assets/Language_Asset_Library.md`

---

## PLACEMENT INSTRUCTIONS

### Add to Existing Source Sections

[For each source that already exists in master library:]

**[SourceName] (lines [start]-[end]):**

Add to "[Category Name]" section (after line [#]):

```markdown
**[#]. [Asset Title]**
- **[Field Name]:** [Content]
- **[Field Name]:** [Content]
- **Evidence:** [Citation]
<!-- cite:path=02_Extractions/YYYY-MM/Source_YYYY-MM-DD.md;dp=X -->
[Continue with all fields...]
```

[Repeat for each asset to add to this source]

---

### New Source Sections to Create

[For each source that doesn't exist in master library yet:]

**[SourceName]:**

Create full source section after "[Previous Source]" header (line [#]):

[Provide complete source section following the weekly additions template structure:]
- Source metadata
- Source credibility (4 dimensions)
- Best For / Strengths / Caution paragraph
- All 7 category sections with assets

---

## DEDUPLICATION ACTIONS

### 1. Merge Synonyms

[For each synonym pair identified:]

**"[Preferred Term]" + "[Synonym]":**
- **Action:** Keep "[Preferred Term]" (reason: stronger metaphor / premier source / more memorable)
- **Location:** [SourceName] section line [#], [Category] subsection
- **Update:** Add note: "Also called: [Synonym]"

---

### 2. Note Convergence

[For each convergence pattern identified:]

**"[Theme]" convergence:**
- **Sources:** [Source1], [Source2], [Source3]
- **Action:** Add convergence note to Framing Notes section (line [#])
- **Note text:** "[Convergence description - e.g., 'Multiple premier sources (BCG, McKinsey, Section) independently identify organizational design as primary adoption barrier']"

---

### 3. Variants (Keep Both, Note Relationship)

[If any variants identified:]

**"[Asset1]" and "[Asset2]":**
- **Action:** Keep both (serve different purposes)
- **Location 1:** [Source1] line [#]
- **Location 2:** [Source2] line [#]
- **Relationship note:** Add to each: "Related: [Other Asset Name] (emphasis on [difference])"

---

### 4. Evolution (Update Latest, Note Trajectory)

[If evolution pattern identified:]

**Term evolution: "[Old Term]" → "[New Term]":**
- **Action:** Update [Source] section line [#] to use "[New Term]"
- **Add note:** "Evolution from '[Old Term]' (20XX)"

---

### 5. Global Duplicates (Already in Master Library)

[If any assets duplicate existing library entries:]

**"[Asset Name]" - already in master library:**
- **Existing location:** [SourceName] line [#]
- **Action:** No addition needed
- **Note:** Cross-source validation confirms accuracy

---

## CATEGORY INDEX UPDATES

[For each category that received new assets:]

**Add to "All [Category Name]" (line [#]):**
- **[Asset Name]** ([SourceName])
- **[Asset Name]** ([SourceName])
[List all new assets for this category]

---

## METADATA UPDATES

[Specify exact line numbers and new values:]

**Line [#]: Update source coverage**
```markdown
**Source Coverage:** [New Count] extractions (was [Old Count])
```

**Line [#]: Update total assets**
```markdown
**Total Assets:** [New Count] linguistic elements across 7 categories (was [Old Count])
```

**Line [#]: Update generated date**
```markdown
**Generated:** [New Date] (was [Old Date])
```

**Line [#]: Update total asset count summary**
```markdown
- **TOTAL: [New Count] linguistic assets** (was [Old Count])
```

**Line [#]: Update asset counts by category** (if count summary section exists)
```markdown
- Frameworks & Mental Models: [count] (was [old count])
- Analogies & Metaphors: [count] (was [old count])
[etc...]
```

---

## DETAILED PLACEMENT EXAMPLE

[Provide at least one complete example showing exact placement:]

**Example: Adding "Vibe Coding" term to AIDaily section**

Find line [#] in master library (end of AIDaily "Terms & Catchphrases" section).
Insert after this line:

```markdown
**2. Vibe Coding**
- **Definition:** Non-engineers coding through feel/iteration with AI assistance (49.5% of non-technical professionals report coding work)
- **Usage Context:** Describing democratization of coding capability beyond traditional engineers
- **Adoption Level:** Widely recognized (mainstream media coverage)
- **Why It Works:** Playful term that captures the "intuitive" vs "formal" nature of AI-assisted coding
- **Caution:** May sound informal for executive audiences; use "AI-assisted development" if needed
- **Evidence:** [AIDaily_TimeSavingsEraOverVibeCoders DP2]
<!-- cite:path=02_Extractions/2026-02/AIDaily_TimeSavingsEraOverVibeCoders_2026-02-14.md;dp=2 -->
```

---

## VALIDATION CHECKLIST

After executing all updates, verify:

- [ ] All new assets placed in correct source sections
- [ ] All citations resolve to valid extraction files
- [ ] All DP numbers exist in referenced extractions
- [ ] No exact duplicate assets within same category
- [ ] All synonyms properly merged or noted as alternatives
- [ ] Category index counts match actual source sections
- [ ] Metadata totals are accurate (source count, asset count)
- [ ] Convergence themes documented in Framing Notes
- [ ] All line numbers referenced in instructions still accurate (verify after edits)

---

## EXECUTION NOTES FOR SESSION 3

1. **Read this file completely** before starting updates
2. **Execute in order:** Placement → Deduplication → Index → Metadata
3. **Validate after each section:** Check work before proceeding
4. **If line numbers shift:** Recalculate remaining line references
5. **Save frequently:** Don't lose progress on large updates
6. **Final validation:** Run complete checklist before declaring done
7. **Archive this file:** Move to `_pending_updates/archive/` after successful execution

---

## TROUBLESHOOTING

**If line numbers don't match:**
- Master library may have been edited since this was generated
- Search for section headers instead of relying on line numbers
- Place assets at end of appropriate section if exact location uncertain

**If citations don't resolve:**
- Verify extraction file exists at specified path
- Check DP number exists in extraction
- Update citation if extraction was renamed

**If duplicate detected during execution:**
- Check deduplication actions section—may be intentional convergence
- If true duplicate (same source, same category): keep one, note in execution log
- If cross-source convergence: keep both, add convergence note

---

## COMPLETION

After successful execution:
1. Run validation checklist
2. Commit changes to master library (if using version control)
3. Archive this update instructions file to `_pending_updates/archive/`
4. Update `_Weekly_Header.md` to reflect linguistic mining completion
```

---

## Template Usage Notes

1. **Line numbers:** Provide exact line numbers for all placements and updates
2. **Complete examples:** Include at least one full placement example with exact formatting
3. **Deduplication:** Be explicit about WHY choosing preferred term (metaphor strength, premier source, etc.)
4. **Validation:** Session 3 agent should check all items before declaring done
5. **Convergence:** Only note when 2+ independent sources, not when same author/research cited multiple places
