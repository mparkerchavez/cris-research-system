# CRIS: Product Requirements Document

**Collaborative Research & Insight System**

**Version:** 3.1
**Last Updated:** February 5, 2026
**Status:** Active

---

## Problem Statement

Research and learning are fragmented. You read reports, watch videos, consume articles—but insights scatter across notes, bookmarks, and memory. When it's time to speak confidently about a topic, you can't trace *why* you believe what you believe or *where* the evidence came from.

**CRIS solves this by creating:**
1. A structured capture system for research inputs
2. A compression chain that synthesizes insights over time
3. A verifiable lineage from any claim back to source evidence

---

## Goals

| Goal | Success Metric |
|------|----------------|
| **Capture without friction** | New sources processed within 24 hours of acquisition |
| **Synthesis compounds** | Weekly learnings build on previous weeks, not restart |
| **Claims are verifiable** | Any insight traces to source in <60 seconds |
| **Ideas evolve visibly** | Position changes are documented with reasoning |
| **Output is usable** | Talking points ready for conversations without prep |

---

## Non-Goals (Out of Scope)

- **Autonomous processing** — CRIS doesn't run in the background; you initiate every workflow
- **Real-time sync** — No live connection to news feeds or databases
- **Collaboration** — Single-user system; not designed for team knowledge management
- **Perfect recall** — Compression means some detail is intentionally lost at each layer

---

## Core Principles

### 1. "When I Learned It" Organization
Documents are dated by when *you* processed them, not when published. A December 2025 report read in February 2026 belongs to February learnings.

### 2. Compression Chain
Each layer summarizes the one below. You shouldn't need to re-read lower layers for typical tasks.

```
Raw Inputs → Extractions → Weekly → Monthly → Quarterly
  (source)    (evidence)   (synthesis) (narrative) (publishable)
```

### 3. Verifiable Lineage
Every claim traces back to source. The chain is:
```
Published Insight → Active Idea → Weekly Synthesis → Extraction DP# → Source (page/timestamp)
```

### 4. Progressive Disclosure
Load lightweight index files first; drill into detail only when needed. This keeps context windows focused and reduces hallucination risk.

### 5. Atomic Data Points
Each extracted finding has a unique ID (DP#) with a verbatim anchor quote. This enables verification without re-reading full sources.

---

## User Stories

### As a researcher, I want to...

| Story | So That |
|-------|---------|
| Drop PDFs/articles into a folder and have them extracted | I capture insights without manual note-taking |
| See what I learned this week in one place | I can build on recent thinking |
| Have conversation-ready talking points | I sound informed without last-minute prep |
| Trace any claim back to its source | I can verify accuracy and cite properly |
| See how my thinking has evolved | I understand my intellectual journey |

### As a knowledge worker, I want to...

| Story | So That |
|-------|---------|
| Quickly check system status | I know what needs attention |
| Process multiple files efficiently | Batch work doesn't become a bottleneck |
| Verify Claude's interpretations | I catch hallucinations before they propagate |

---

## Core Outputs

| Output | Cadence | Purpose |
|--------|---------|---------|
| **Extractions** | Per source | Atomic data points with verbatim anchors |
| **Weekly Learnings** | 1-2x/week | Synthesis across sources, connections to ideas |
| **Talking Points** | Weekly | Conversation-ready insights with evidence |
| **Monthly Synthesis** | End of month | Narrative rollup, idea status snapshot |
| **Quarterly Synthesis** | End of quarter | Publishable insights, trend reflection |
| **Current Synthesis** | After each weekly synthesis | Cumulative position statement — standalone snapshot of where all research stands |
| **Active Ideas** | Living document | Your positions with full lineage |

---

## Key Workflows

| Workflow | Trigger | Output |
|----------|---------|--------|
| **Extraction** | New files in Raw_Inputs | Atomic DPs with anchors in Extractions/ |
| **Weekly Synthesis** | End of week (flexible) | Weekly Learnings + Talking Points + Current Synthesis update |
| **Monthly Synthesis** | End of month | Monthly narrative + Index update |
| **Verification** | Before publishing/sharing | Confirmed lineage chain |

*Implementation details in `_System/Workflows/`*

---

## Constraints & Assumptions

### Constraints
- **Context window limits** — Claude can't hold entire knowledge base; compression chain manages this
- **No persistent memory** — Each session starts fresh; index files provide continuity
- **Manual initiation** — You start every workflow; nothing runs automatically

### Assumptions
- You'll process sources 1-2x per week
- You'll synthesize weekly (flexible timing)
- You'll verify claims before high-stakes use
- You'll maintain tag hygiene monthly

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **Workflow discipline decay** | Minimum viable cadence: 30-min check every 2 weeks |
| **Hallucinated data points** | Verbatim anchors enable rapid verification |
| **Context contamination** | Parallel sub-agents isolate each source during extraction |
| **Tag sprawl** | Two-step tagging: Claude proposes, you confirm |
| **Lineage breaks** | Every claim requires DP# citation |

---

## Architecture Overview

```
CRIS_Research_System/
├── _System/              ← How it works (workflows, guides)
├── 01_Raw_Inputs/        ← Source documents
├── 02_Extractions/       ← Atomic data points with anchors
├── 03_Weekly_Learnings/  ← Synthesis layer
├── 04_Monthly_Synthesis/ ← Narrative layer
├── 06_Current_Understanding/  ← Your positions + Current Synthesis
├── 08_Templates/         ← Document templates
└── 09_Deliverables/      ← Talking points, briefs
```

*Full structure in `_System/Folder_Structure.md`*

---

## Success Criteria (Month 1)

- [ ] 10+ sources extracted with atomic DP format
- [ ] 2+ Weekly Learnings completed
- [ ] 3+ Active Ideas with full lineage
- [ ] Verification test: trace 5 claims to source in <60 seconds each
- [ ] Talking Points used in at least one real conversation

---

## Future Considerations

*Not committed, but worth tracking:*

- YouTube transcript extraction workflow
- Web article capture before link rot
- Obsidian graph visualization
- Multi-user collaboration model
- API integration for source ingestion

---

## Reference

| Document | Location | Purpose |
|----------|----------|---------|
| Folder Structure | `_System/Folder_Structure.md` | Where things go |
| Extraction Workflow | `_System/Workflows/Extraction.md` | How to extract with DPs |
| Weekly Synthesis | `_System/Workflows/Weekly_Synthesis.md` | How to synthesize |
| Verification Guide | `_System/Verification_Guide.md` | How to verify claims |
| Idea Lifecycle | `_System/Idea_Lifecycle.md` | How ideas evolve |
| CRIS Skill | `_System/cris/SKILL.md` | Claude orchestration |
