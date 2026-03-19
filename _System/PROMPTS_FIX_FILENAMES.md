# Fix Extraction Filenames Prompt

**Use this prompt in another chat to correct incorrectly named extraction files and update all references.**

---

## Copy-Paste This Prompt

```
Fix incorrectly named CRIS extraction files and update all references.

**Instructions:**

**Phase 1: Scan for Invalid Filenames**

1. Find all extraction files:
   ```bash
   find 02_Extractions -name "*.md" -type f | sort
   ```

2. Validate each filename using the validation script:
   ```bash
   find 02_Extractions -name "*.md" -type f | while read file; do
       filename=$(basename "$file")
       bash _System/scripts/validate_filename.sh "$filename" || echo "INVALID: $file"
   done
   ```

3. List all invalid filenames with their issues.

**Phase 2: Propose Corrections**

For each invalid filename:

1. Apply PascalCase conversion rules:
   - "Financial Times" → FinancialTimes (NOT Financial_Times)
   - "AI News Daily" → AINewsDaily (NOT AI_News_Daily)
   - "Every" → Every (already one word)
   - "a16z" → A16z (capitalize first letter)

2. Show proposed correction:
   ```
   ❌ Invalid: Financial_Times_MustafaSuleymanAI_2026-02-13.md
   ✅ Corrected: FinancialTimes_MustafaSuleymanAI_2026-02-13.md
   Issue: 3 underscores (expected 2)
   Fix: Removed underscore from source name
   ```

3. Wait for my confirmation before renaming.

**Phase 3: Rename Files**

For each confirmed correction:

1. Rename the file:
   ```bash
   mv "02_Extractions/YYYY-MM/old_name.md" \
      "02_Extractions/YYYY-MM/new_name.md"
   ```

2. Verify rename succeeded:
   ```bash
   ls -lh "02_Extractions/YYYY-MM/new_name.md"
   bash _System/scripts/validate_filename.sh "new_name.md"
   ```

**Phase 4: Update All References**

For each renamed file, update references in:

1. **_Extraction_Index.md:**
   ```bash
   # Read current index
   cat 02_Extractions/_Extraction_Index.md

   # Replace old_name with new_name
   sed -i 's/old_name\.md/new_name.md/g' 02_Extractions/_Extraction_Index.md

   # Verify update
   grep "new_name" 02_Extractions/_Extraction_Index.md
   ```

2. **_extraction_tracker.json:**
   ```bash
   # Read current tracker
   cat _System/_extraction_tracker.json

   # Update the filename field for this entry
   # (Use jq or manual edit to change old_name to new_name)

   # Verify update
   grep "new_name" _System/_extraction_tracker.json
   ```

3. **Synthesis documents** (Weekly Learnings, Active Ideas, Current Synthesis, Talking Points):
   ```bash
   # Find all files that cite the old filename
   grep -r "\[old_name DP" 03_Weekly_Learnings/ 06_Current_Understanding/ 09_Deliverables/ \
       | cut -d':' -f1 | sort -u

   # For each file found, replace citations:
   # [old_name DP1] → [new_name DP1]
   # [old_name DP2] → [new_name DP2]
   # etc.

   grep -r "\[old_name DP" 03_Weekly_Learnings/ 06_Current_Understanding/ 09_Deliverables/ | \
       cut -d':' -f1 | sort -u | while read file; do
           sed -i 's/\[old_name DP/[new_name DP/g' "$file"
           echo "Updated: $file"
       done
   ```

4. **Extraction_Name_Mapping.md** (if exists):
   ```bash
   # Check if mapping file exists
   if [ -f "_System/Extraction_Name_Mapping.md" ]; then
       # Add entry documenting the rename
       echo "- old_name.md → new_name.md ($(date +%Y-%m-%d): Fixed naming convention)" >> _System/Extraction_Name_Mapping.md
   else
       # Create mapping file
       cat > _System/Extraction_Name_Mapping.md << 'EOF'
# Extraction Name Mapping

Record of renamed extraction files for reference integrity.

## Renames

- old_name.md → new_name.md ($(date +%Y-%m-%d): Fixed naming convention)
EOF
   fi
   ```

**Phase 5: Verify No Broken References**

1. Search for any remaining references to old filename:
   ```bash
   grep -r "old_name" 02_Extractions/ 03_Weekly_Learnings/ 06_Current_Understanding/ 09_Deliverables/ _System/
   ```

2. Should return NO results (except in Extraction_Name_Mapping.md)

3. If any references found, update those files manually

**Phase 6: Final Report**

For each renamed file, report:

```
✅ Renamed: old_name.md → new_name.md

**Updated references in:**
- ✅ _Extraction_Index.md
- ✅ _extraction_tracker.json
- ✅ WL_2026-02-07.md (3 citations updated)
- ✅ Active_Ideas.md (1 citation updated)
- ✅ Extraction_Name_Mapping.md (entry added)

**Verification:**
- ❌ No broken references to old_name found
- ✅ New filename passes validation
```

**Summary:**
- Files renamed: [X]
- Total references updated: [Y]
- No broken citations remaining

**All corrections complete!**
```

---

## Validation Pattern

Valid filename format:
```
SourceName_DescriptiveSlug_YYYY-MM-DD.md
```

Requirements:
- EXACTLY 2 underscores (both before date)
- PascalCase for Source and Slug (no internal underscores)
- Starts with capital letter
- Date format: YYYY-MM-DD
- Extension: .md

Regex pattern:
```
^[A-Z][a-zA-Z0-9]+_[A-Z][a-zA-Z0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$
```

---

## Common Source Name Conversions

| Display Name | Correct Format |
|--------------|----------------|
| Financial Times | FinancialTimes |
| AI News Daily | AINewsDaily |
| The Verge | TheVerge |
| Hacker News | HackerNews |
| a16z | A16z |
| Every | Every |
| TechCrunch | TechCrunch |
