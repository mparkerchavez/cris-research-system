# Idea Lifecycle

How ideas move through the CRIS system.

## Lifecycle Flow

```
New Idea → Active (Developing)
              ↓
         Active (Ready to Share) → Publish
              ↓
         Stable (if mature and unchanging)
              ↓
         Dormant (if paused)
              ↓
         Retired (if invalidated)
```

## Status Definitions

| Status | Meaning | Location | Action |
|--------|---------|----------|--------|
| Developing | Actively accumulating evidence | Active_Ideas.md | Keep developing |
| Ready to Share | Confident enough to publish | Active_Ideas.md | Consider publishing |
| Needs Revisiting | New evidence challenged position | Active_Ideas.md | Prioritize in next cycle |
| Stable | Mature, not actively changing | Stable_Ideas.md | Move at month 3+ |
| Dormant | Paused but may return | Dormant_Ideas.md | Move at month 3+ |
| Retired | Invalidated or superseded | Archive with note | Remove from active files |

## File Thresholds

**Months 1-2:** Single file approach
- `_Index.md` — Master list with status
- `Active_Ideas.md` — All ideas

**Month 3+:** Split when Active_Ideas exceeds 10-12 ideas
- `Active_Ideas.md` — Currently developing (limit 8-10)
- `Stable_Ideas.md` — Mature, not changing
- `Dormant_Ideas.md` — Paused ideas

## Idea Entry Structure

**Required sections:**

```markdown
## [Idea Name]

**Status:** Developing | Ready to Share | Needs Revisiting
**Confidence:** Low | Medium | High
**Tags:** #tag1, #tag2

### Current Position
[Your thesis in 2-4 sentences]

### Drivers
- **Initial observation:** [What pattern first caught attention]
- **Key sources:** [Which sources crystallized it, with dates]
- **Evolution:** [Phase-by-phase development]
- **Trigger:** [What made pattern coalesce into thesis]

### Supporting Evidence
- [Claim] → Source: [[Extraction link]]
- [Claim] → Source: [[Extraction link]]

### Open Questions
- [What you're still exploring]

### Evolution Log
- YYYY-MM-DD: [Significant shift and why]
```

**Optional sections:**
- Implications
- Counterarguments
- Related Ideas

## The Drivers Section

Critical for lineage tracking. Captures not just *what* you believe but *how you came to believe it*.

**Purpose:**
- Trace your intellectual path
- Assess confidence based on journey quality
- Identify when to revisit (if key sources are challenged)
- Support lineage trace for publishing

## Evolution Log Format

Brief dated entries for significant shifts only:

```markdown
### Evolution Log
- 2026-04-15: Revised timeline based on Anthropic case studies
- 2026-03-01: Confidence raised to High after McKinsey corroboration
- 2026-02-22: Initial synthesis from McKinsey + Deloitte
```

Do NOT log:
- Adding evidence that doesn't change position
- Minor wording edits
- Adding open questions
