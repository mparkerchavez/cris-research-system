# What's New in CRIS PRD v4.0

**Date:** February 17, 2026
**Previous Version:** v3.1 (February 5, 2026)

---

## TL;DR

**CRIS has evolved from theoretical multi-file processor to production-ready research operating system at enterprise scale.**

- **Scale:** 10 sources/month → **40-60 sources/week** (117 total)
- **Workflow:** Simple 5-phase → **Mandatory 3-session + linguistic mining**
- **Infrastructure:** File system → **File system + web app + skills + validation gates**
- **Deliverables:** 6 outputs → **9 outputs** (added Language Assets, DP Relevance Maps, POC)

---

## Major Changes by Section

### 1. Executive Summary (NEW)

**v3.1:** No executive summary
**v4.0:** Added complete executive summary with:
- Current operating scale (117 sources, 40-60/week)
- Who CRIS is for
- Key differentiator statement

---

### 2. Problem Statement (EXPANDED)

**v3.1:** Generic "research is fragmented"
**v4.0:** Scale-specific problem:
- "40-60 sources per week" (concrete)
- Comparison table: Traditional tools vs. CRIS
- Four specific needs (capture, synthesize, trace, communicate)

**Why:** External audiences need to see themselves in the problem

---

### 3. What CRIS Does (NEW SECTION)

**v3.1:** Scattered across document
**v4.0:** Consolidated into 5 clear capabilities:
1. Structured Capture
2. Multi-Layer Synthesis (3-session workflow)
3. Linguistic Asset Mining (NEW)
4. Verifiable Lineage
5. Research Observatory (web app) (NEW)

**Why:** Clear value proposition for external sharing

---

### 4. Core Principles (EXPANDED: 5 → 9)

**v3.1:** 5 principles
**v4.0:** 9 principles (5 original + 4 new)

**New Principles:**
6. **Session Separation Prevents Shallow Analysis** (operational evidence)
7. **Machine-Parseable Lineage Is Infrastructure** (not just feature)
8. **Quality Standards Are Built-In** (not optional)
9. **Language Assets Amplify Data Point Value** (communication focus)

**Why:** Capture what we learned from 6 weeks of operations

---

### 5. User Stories (EXPANDED)

**v3.1:** Generic "as a researcher"
**v4.0:** Three specific personas:
- Knowledge Worker at Scale (40+ sources/week)
- Strategic Professional (frameworks, verification)
- Research-Driven Consultant (IP building)

**Why:** Clearer target audience identification

---

### 6. Core Workflows (MAJOR REWRITE)

**v3.1:** Simple 5-phase workflow, assumed 1-2 sessions

**v4.0:** Complete redesign:

**Extraction Workflow:**
- Now uses `cris-extract` skill
- Automatic pending file detection
- Parallel sub-agents (mandatory)
- Strict filename validation

**Weekly Synthesis:**
- **3-Session Architecture** (mandatory separation):
  - **Session 1:** Deep Analysis (DP Relevance Maps)
  - **Session 1.5:** Linguistic Mining (NEW, optional)
  - **Session 2:** Write Learnings
  - **Session 3:** Strategic Integration

**Why Changed:** Single-pass synthesis systematically missed evidence at scale

**Session Cadence Table:** (NEW)
- Light (1-5 sources): 1 session
- Normal (6-15 sources): 2 sessions
- Heavy (16+): 3 sessions

**Monthly Synthesis:** Defined but not yet operationalized

**Verification & Publishing:** Added automated gates

---

### 7. Deliverables & Outputs (EXPANDED: 6 → 9)

**v3.1:**
- Extractions
- Weekly Learnings
- Talking Points
- Monthly/Quarterly Synthesis
- Current Synthesis
- Active Ideas

**v4.0:** Added 3 new deliverables:

**NEW:**
1. **DP Relevance Maps** (intermediate files from Session 1)
2. **Language Assets** (7 categories: frameworks, analogies, terms, comparisons, provocations, anti-patterns, numerical rules)
3. **Web Application POC** (4 views: Pulse, Ideas, Talking Points, Explore)

**Added:** Deliverable Relationships diagram showing flow

---

### 8. System Architecture (MAJOR EXPANSION)

**v3.1:** Simple folder tree

**v4.0:** Three-part architecture:

**8.1 File-Based Research System**
- Updated folder structure (added `poc/`, `_System/skills/`, `09_Deliverables/Language_Assets/`)

**8.2 Web Application (POC)** (NEW)
- Full technology stack description
- 4 views with detailed capabilities
- Evidence Trace System
- Quality gates

**8.3 Critical Infrastructure** (NEW)
1. **Skills System** (5 executable workflows)
2. **Citation Contract** (strict technical specification)
3. **Extraction Tracker** (JSON infrastructure)
4. **ADR System** (13 architecture decisions)

**Why:** CRIS is no longer just files—it's a complete system

---

### 9. Scale & Constraints (MAJOR EXPANSION)

**v3.1:**
- Brief "Constraints" section
- "Assumptions: process sources 1-2x/week"

**v4.0:** Four-part scale analysis:

**9.1 Operating Scale Reality**
- 117 sources extracted
- 40-60 sources/week sustained
- Why scale matters (workflow implications)

**9.2 Constraints at Scale**
- Table: Context window, session limits, parallel processing, quality gates
- Specific mitigations for each

**9.3 Operating Assumptions**
- Time commitment: **6-15 hours/week** (realistic)
- Technical requirements (sub-agents mandatory)
- User discipline requirements

**9.4 What Doesn't Scale** (NEW)
- Table: What breaks + why + mitigation
- Single-pass synthesis, loading all extractions, manual checking, etc.

**Why:** Scale fundamentally changes requirements

---

### 10. Success Criteria (UPDATED)

**v3.1:**
- Month 1 targets only

**v4.0:** Three-part success tracking:

**10.1 Month 1 Targets**
- All EXCEEDED (checkboxes showing achievement)

**10.2 Current Operating Scale**
- Actual achievements (117 sources, 3-session workflow, POC ready)

**10.3 Next Milestones**
- Table with targets and success metrics
- Language Assets, Monthly Synthesis, external users, 200 sources

**Why:** Show actual achievement vs. original goals, set future targets

---

### 11. Quality Standards (NEW SECTION)

**v3.1:** References to Style Guide, implied quality

**v4.0:** Explicit quality enforcement:

**11.1 Style Guide**
- Hard rules (no em dashes, Oxford comma, etc.)
- Data presentation standards
- Manual self-check enforcement

**11.2 Data Normalization**
- Level 2 minimum requirement
- Template with example
- Level 3 for juxtaposing sources

**11.3 Citation Contract**
- Strict format requirements
- Why strict (frontend parser dependency)

**11.4 Automated Validation Gates**
- Citation contract validation
- Citation parser regression
- Full prepublish gate (blocking)
- Style audit

**Why:** Quality at scale requires automation

---

### 12. Value Proposition (NEW SECTION)

**v3.1:** Scattered throughout

**v4.0:** Consolidated external communication section:

**12.1 Who Should Care**
- Knowledge workers at scale
- Strategic roles (specific titles)
- Teams facing scale challenges

**12.2 What Makes CRIS Different**
- **Comparison table:** Note-taking apps vs. CRIS, Read-It-Later vs. CRIS, Summarization tools vs. CRIS, Reference managers vs. CRIS

**12.3 Operational Reality**
- Scale, infrastructure, time investment, value delivered
- <10 second tracing, cross-source patterns, conversation-ready language

**Why:** Shareable value proposition for external audiences

---

### 13. Non-Goals (CLARIFIED)

**v3.1:** Simple list

**v4.0:** "What CRIS Is NOT" framing
- Autonomous processing
- Real-time sync
- Collaboration
- Perfect recall
- AI-generated insights
- Cloud-based

**Why:** Prevent misunderstandings about scope

---

### 14. Future Considerations (ORGANIZED)

**v3.1:** Flat list

**v4.0:** Three time horizons:
- Near-term exploration
- Medium-term possibilities
- Long-term research

---

### 15. Reference (EXPANDED)

**v3.1:** Simple table

**v4.0:** Four-part reference:
- System Documentation (7 key files)
- Skills (5 executable workflows)
- Web Application (4 key docs)
- Quick Start (command examples)

---

### 16. Appendices (NEW)

**Added:**
- **Appendix A:** Version History table
- **Appendix B:** Glossary (12 key terms)

---

## Key Metrics: v3.1 → v4.0

| Dimension | v3.1 | v4.0 | Change |
|-----------|------|------|--------|
| **Word Count** | ~2,500 | ~9,500 | 3.8x |
| **Sections** | 14 | 16 | +2 |
| **Core Principles** | 5 | 9 | +4 |
| **Deliverables** | 6 | 9 | +3 |
| **Workflows** | 4 (simple) | 6 (detailed) | +2 |
| **Tables** | 3 | 15 | 5x |
| **Infrastructure Docs** | 0 | 4 sections | NEW |
| **Comparison Tables** | 0 | 2 | NEW |

---

## What This Means

### For Internal Operations
- **Clear operational model:** 3-session workflow is now standard
- **Quality enforcement:** Automated gates prevent drift
- **Scale acknowledgment:** 40-60 sources/week is the new normal

### For External Communication
- **Value proposition:** Clear comparison tables and "who should care"
- **Proof of scale:** 117 sources, 40-60/week sustained
- **Production-ready:** POC web app, validation gates, skills system

### For Future Development
- **Next milestones:** Language Assets, Monthly Synthesis, external users
- **Architectural decisions:** 13 ADRs documented
- **System maturity:** From prototype to operating system

---

## How to Use v4.0

**For sharing with prospects:**
- Use Section 12 (Value Proposition)
- Show comparison tables (Note-taking vs. CRIS)
- Reference Section 12.3 (Operational Reality)

**For onboarding collaborators:**
- Start with Section 1 (Executive Summary)
- Review Section 6 (Core Workflows)
- Reference Section 15 (Reference + Quick Start)

**For strategic planning:**
- Review Section 10 (Success Criteria)
- Check Section 14 (Future Considerations)
- Use Section 9 (Scale & Constraints) for resourcing

**For quality assurance:**
- Enforce Section 11 (Quality Standards)
- Use automated gates from Section 11.4
- Reference Section 8.3 (Critical Infrastructure)

---

## Migration from v3.1

**If you're referencing v3.1:**
- Section numbers have shifted (+2)
- Workflows are now in Section 6 (was scattered)
- Architecture is now Section 8 (was simpler)

**Key concept changes:**
- "5-phase synthesis" → **"3-session synthesis"**
- "Sub-agents suggested" → **"Sub-agents mandatory"**
- "Progressive disclosure" → **"Critical requirement" (not optional)**
- "Citation format" → **"Citation Contract" (strict spec)**

**New vocabulary:**
- **DP Relevance Maps** (intermediate files)
- **Language Assets** (communication elements)
- **Session Separation** (workflow principle)
- **Evidence Trace System** (web UI capability)

---

## Questions?

**For detailed analysis:** See `PRD_Evolution_Analysis_2026-02-17.md`
**For system reference:** See `_System/SYSTEM_ARCHITECTURE_GUIDE.md`
**For quick start:** See `CLAUDE.md` or `_System/skills/README.md`

---

**END OF SUMMARY**
