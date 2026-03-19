# Workflow: Monthly Synthesis

Create Monthly Synthesis from weekly learnings.

## Before Starting

1. Review weekly learnings from current month in `03_Weekly_Learnings/YYYY-QN/`
2. Check `06_Current_Understanding/_Index.md` for idea status
3. Note any ideas that reached "Ready to Share" status

## Output

**Monthly Synthesis** → `04_Monthly_Synthesis/YYYY/Month_YYYY-MM.md`

## Monthly Synthesis Structure

Use template from `08_Templates/Monthly_Template.md`:

**Required sections:**
- Executive Summary (3-5 key insights from the month)
- Sources Overview (count and breakdown by type)
- Major Themes (narrative synthesis by theme, not just tag)
- Current Understanding Snapshot (state of each active idea end-of-month)
- Lineage Summary (which sources fed which ideas)
- Looking Ahead (open questions, next month priorities)

## Context Loading

For monthly synthesis, Claude loads:
- This month's Weekly Learnings files (typically 2-4)
- `06_Current_Understanding/_Index.md`

Claude does NOT load:
- Individual extractions
- Previous months' synthesis

## Updating _Index.md

At month end, update `_Index.md` with:

1. Current idea count and status breakdown
2. Any status changes (Developing → Ready to Share, etc.)
3. New ideas added this month
4. Ideas archived or retired

## Archive Triggers

**DO archive when:**
- Position reversal (believed X, now believe not-X)
- Material confidence change (Low → High or High → Low)
- Idea moves between files (Active → Stable, Active → Dormant)

**DO NOT archive for:**
- Adding supporting evidence
- Minor wording refinements
- Adding open questions

## Quarterly Rollup Prep

If this is month 3, 6, 9, or 12:
- Flag ideas at "Ready to Share" status for quarterly synthesis
- Note cross-month patterns for quarterly reflection
- Identify potential publishable insights
