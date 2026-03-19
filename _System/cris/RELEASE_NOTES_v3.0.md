# CRIS Skill v3.0 Release Notes

**Release Date:** February 14, 2026
**Release Type:** Major Update (Automation & Co-Creation)

---

## What's New in v3.0

### 🤖 Automated File Discovery

**Extraction Tracker** (`_System/_extraction_tracker.json`)
- Eliminates manual file listing — just say "extract new files"
- Tracks all raw inputs → extraction mappings
- Shows pending vs. extracted status with metadata
- Provides file size, page count, DP count, match confidence
- Auto-updates after each extraction

**New workflow:** "Extract New Files (Automated Discovery)" in ADVANCED_PROMPT_LIBRARY.md

### 🤝 Two-Stage Weekly Synthesis

**Mid-Week Synthesis (First Pass)**
- **Timing:** Day 3-4 of the week
- **Mode:** Fully autonomous (optional user input)
- **Outputs:** ALL deliverables — WL, TP, Active Ideas, Current Synthesis
- **Why:** Get actionable Talking Points mid-week for calls, posts, reflection

**End-of-Week Co-Creation (Final Pass)**
- **Timing:** Day 5-7 of the week
- **Mode:** User input REQUIRED between sessions
- **Session 1:** Mining + Coverage Sweep → PAUSE for user perspective
- **User Input:** What matters most? Connections? Reflection? Emphasis?
- **Session 2:** Final comprehensive synthesis with your perspective integrated

**Benefits:**
- Mid-week: Fast iteration, autonomous, shareable immediately
- End-of-week: Deep thinking integration, comprehensive final position
- Flexible: Use one or both depending on week's needs

### 🔒 Stricter Naming Enforcement

**EXACTLY 2 underscores before date** (no more, no less!)
- Format: `SourceName_DescriptiveSlug_YYYY-MM-DD.md`
- Use PascalCase within segments (NO internal underscores)
- ✅ CORRECT: `FinancialTimes_MustafaSuleymanAI_2026-02-13.md`
- ❌ WRONG: `Financial_Times_Mustafa_Suleyman_2026-02-13.md`

**What was fixed:**
- 13 files renamed in February 2026 (see File_Rename_Log_2026-02-14.md)
- Updated Citation_Contract.md with explicit examples
- Updated ADVANCED_PROMPT_LIBRARY extraction prompts with validation

---

## Package Contents

### Core Skill File
- **SKILL.md** (v3.0) — Orchestration instructions for Claude
  - Updated Quick Commands table
  - New Extraction Tracker section
  - New Two-Stage Weekly Synthesis section
  - Enhanced naming requirements
  - Updated version history

### Scripts
- **scripts/status.py** — `/cris-status` command (compatible with v3.0)

### Assets
- **assets/** — Icons and visual resources

---

## Installation

The CRIS skill is located at:
```
/CRIS_Research_System/_System/cris/
```

No installation required if using CRIS in Cowork mode. The skill is automatically loaded.

---

## System Requirements

- CRIS Research System folder structure (see SYSTEM_ARCHITECTURE_GUIDE.md)
- ADVANCED_PROMPT_LIBRARY.md (v3.0+) for production-ready prompts
- Extraction tracker manifest (_extraction_tracker.json)

---

## Breaking Changes

### Naming Convention (High Priority)
**Action required:** Review all extraction files created before Feb 14, 2026

If you have files with naming violations (extra underscores in source names):
1. Read `_System/File_Rename_Log_2026-02-14.md` for examples
2. Rename files to follow: `SourceName_DescriptiveSlug_YYYY-MM-DD.md`
3. Update `_Extraction_Index.md` references
4. Update citations in Weekly Learnings files
5. Update extraction tracker

**Why this matters:** Citation parser depends on exact naming format.

### Weekly Synthesis Workflow (Low Priority)
**No action required** — backwards compatible

The original 5-phase workflow still works. New two-stage workflow is additive:
- Old way: Run all 5 phases in one or more sessions (still supported)
- New way: Choose mid-week (autonomous) OR end-of-week (co-creative) OR both

---

## Migration Guide

### From v2.0 to v3.0

**Step 1: Build Extraction Tracker**
```bash
python3 /path/to/build_tracker.py
```
Or manually create `_System/_extraction_tracker.json` using the format in ADVANCED_PROMPT_LIBRARY.md

**Step 2: Verify File Naming**
```bash
cd /path/to/CRIS_Research_System/02_Extractions/
find . -name "*.md" | grep -E "_.*_.*_.*_" | grep -v "_[0-9]{4}-[0-9]{2}-[0-9]{2}.md$"
```
If output is non-empty, you have naming violations. See File_Rename_Log_2026-02-14.md for fix examples.

**Step 3: Update Workflows**
- Start using "Extract New Files (Automated Discovery)" from ADVANCED_PROMPT_LIBRARY.md
- Try Mid-Week Synthesis for fast iteration
- Use End-of-Week Co-Creation when you want to integrate your perspective

**Step 4: Update Documentation References**
- SKILL.md now references ADVANCED_PROMPT_LIBRARY as primary prompt source
- Status script output unchanged (no retraining needed)

---

## Known Issues

**None currently identified.**

Report issues by documenting in `_System/` folder or user feedback channels.

---

## Roadmap (Potential v4.0 Features)

- Quarterly synthesis automation
- Tag evolution tracking
- Idea maturity scoring
- Cross-idea dependency mapping
- Export to external formats (Notion, Obsidian, etc.)

---

## Contributors

- Maicol Parker-Chavez (System Designer)
- Claude Sonnet 4.5 (Implementation Partner)

---

## License

CRIS is a personal research system. No formal license.

---

## Support

For questions or issues:
1. Read SYSTEM_ARCHITECTURE_GUIDE.md for system overview
2. Check ADVANCED_PROMPT_LIBRARY.md for workflow prompts
3. Run `/cris-status` to check system state
4. Document issues in `_System/` folder for tracking

---

**Thank you for using CRIS v3.0!**
