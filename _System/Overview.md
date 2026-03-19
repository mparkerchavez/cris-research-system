# CRIS Overview

**Collaborative Research & Insight System** — A personal learning journal with compounding synthesis and publishable intellectual lineage.

## What This Is
- A structured research practice you initiate and control
- A system for capturing, synthesizing, and evolving ideas over time
- A lineage-preserving architecture connecting published insights to source evidence

## Organizing Principle

**"When I learned it"** — Documents are dated by when you processed them, not when published. A December 2025 report read in February 2026 belongs to February learnings.

## Core Outputs

| Output | Cadence | Purpose |
|--------|---------|---------|
| Extractions | Per source | Data points, quotes, citations from individual documents |
| Weekly Learnings | Weekly-ish (1-2x/week) | Synthesis of recent extractions, connections to current thinking |
| Talking Points | Weekly | Conversation-ready insights for interviews, networking, client calls |
| Monthly Synthesis | End of month | Rolled-up narrative, snapshot of understanding |
| Quarterly Synthesis | End of quarter | Trend observation, publishable insights |
| Current Synthesis | After each weekly synthesis | Cumulative position statement — standalone snapshot of where all research stands |
| Current Understanding | Living document | Your positions on tracked ideas with full lineage |

## Compression Chain

The folder structure is a **context management strategy**:

```
Raw Inputs → Extractions → Relevance Maps → Weekly → Monthly → Quarterly
  (read once)   (evidence)   (mining output)  (synthesis)  (reference)  (publishable)
```

**Each layer must be self-sufficient.** Claude shouldn't need to read the layer below for typical tasks.

## Writing Standards

All CRIS outputs must follow two system-level guides:

- **`_System/Style_Guide.md`** — Tone of voice, punctuation rules (no em dashes, always Oxford comma), hedging policy, formatting standards, document-specific tone notes
- **`_System/Data_Point_Normalization.md`** — How to present and normalize metrics from multiple sources, the "altitude" model for organizing data points, comparability framing patterns

These guides should be loaded alongside workflow-specific instructions before writing any synthesis output.

## Frontend Decision Log

Frontend architecture/UI decisions for the PoC live in:

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/decisions/ADR_INDEX.md`
- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EVIDENCE_TRACE_SYSTEM.md`

Use these before changing drawer behavior, citation/provenance interactions, or frontend system conventions.

## Context Loading Per Task

The weekly synthesis workflow uses a **phased approach** to prevent context window limitations from degrading evidence coverage. See `_System/Workflows/Weekly_Synthesis.md` for full details.

| Task | Claude Loads | Does NOT Load |
|------|--------------|---------------|
| Extraction | Raw inputs, Tags.md, template | Previous extractions |
| Weekly Phase 1-2 (Mining + Sweep) | New extractions (via sub-agents), Active Ideas summary, _Weekly_Header.md | All extractions at once |
| Weekly Phase 3 (Weekly Learnings) | DP Relevance Maps, _Extraction_Index.md, Active Ideas summary, Style_Guide.md, Data_Point_Normalization.md | Raw extractions (unless precision needed) |
| Weekly Phase 4 (Ideas + Synthesis) | New Weekly Learnings, Active_Ideas.md, DP Relevance Maps, User_Observations.md, Style_Guide.md | All raw extractions |
| Weekly Phase 5 (Talking Points) | Current Synthesis, Active_Ideas.md, Style_Guide.md | Individual extractions |
| Monthly synthesis | 4-5 Weekly files, _Index.md, Style_Guide.md, Data_Point_Normalization.md | Individual extractions |
| Lineage trace | Specific idea, linked extractions only | Unrelated extractions |
