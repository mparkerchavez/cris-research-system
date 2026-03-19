# Intent Architecture Deck — Continuation Prompt

Paste this into a new chat to continue iterating on the ExecSummary deck.

---

## Context

I'm Maicol Parker-Chavez, building the "Intent Architecture" consulting framework deck for Super by Design. I have two decks:

1. **IntentArchitecture_Deck_v2.pptx** — Full 28-slide deck (already updated and verified)
2. **IntentArchitecture_ExecSummary_v2.pptx** — 8-slide executive summary (just updated, needs further iteration)

Both are in: `intent-architecture/` folder in my workspace.

There is also a **Verification Report** at `intent-architecture/IntentArchitecture_Deck_VerificationReport.md` that documents the sourcing and verification status of every data point across the deck. This was created during the v1-to-v2 process and reflects the verification decisions, but has NOT been updated to reflect the final v2 changes.

---

## What Changed from v1 to v2 (Both Decks)

### Data Point Changes (verified and implemented)

| Slide (Full Deck) | ExecSummary Slide | Change | Source |
|---|---|---|---|
| Slide 2 | Slide 2 | 85% → 90% Fortune 500 use Copilot | Microsoft FY26 Q1 Earnings |
| Slide 2 | Slide 2 | Removed the 5% "pilot to deployment" card entirely | Decision: card was from Gartner but cluttered the layout |
| Slide 2 | Slide 2 | 3% card: "adopted" → "use"; repositioned to center | The Register/Microsoft FY26 Q2 |
| Slide 5 | Slide 2 (bottom row) | 74% description: "have yet to see tangible value" → "of leaders hope AI will deliver value, only 20% see results" | Coatue/Census/Macrobond/Apollo + Deloitte Q4 2024 |
| Slide 7 | N/A (different stats) | 2x/6x → 3x revenue growth / 2.1x cost reduction (McKinsey framing) | McKinsey "The State of AI in Early 2025" |
| Slide 17 | N/A | "GitHub Copilot Case" → "The METR Study"; 55% faster → 19% slower actual performance | METR 2025 study |
| Slide 18 | N/A | "90%" → "~90%" with "(practitioner observation)" qualifier | Dan Shapiro, practitioner estimate |
| Slide 22 | N/A | Citation updated to "[3] Section ROI Framework" | Minor citation cleanup |
| Slide 23 | N/A | "Siemens Customer Case" → "Siemens / Mendix Customer Case" | Hans de Visser (CPO, Mendix/Siemens), Section AI:ROI Conference |
| Slide 25 | N/A | Added "(Section AI:ROI Conference)" to Brice Challamel attribution | Section AI:ROI Conference |
| Slide 25 | N/A | Nate B Jones → "AI Strategist & Product Leader, fmr. PM at Amazon" | Expanded attribution |
| N/A | Slide 7 | "Siemens" → "Siemens / Mendix" in Phase 3 stat and citation | Consistent with main deck change |

### Known Issues NOT Yet Addressed

1. **ExecSummary Slide 4 still says "0.1% Expert"** — Verification report flagged this as likely fabricated. Section reports 1% Expert, not 0.1%. Needs correction.
2. **Full Deck Slide 4 references "85% of users"** in body text — should potentially be updated to match the new 90% on Slide 2 for consistency. Not yet discussed with user.
3. **ExecSummary Slide 2 still has the "45% of businesses paying for AI tools" stat** — Verification report flagged this as unverified/unsourced. Consider replacing.
4. **Full Deck Slide 17 (METR Study)** — QA flagged the replacement quote text wraps awkwardly across the orange accent line (longer text than original).
5. **Verification Report needs updating** to reflect all final v2 decisions.

---

## ExecSummary v2 — Current Slide Content (8 slides)

### Slide 1: Title
"THE INTENT ARCHITECTURE — AI Strategy Framework — Executive Summary"
Super by Design, Maicol Parker-Chavez, March 2026

### Slide 2: The Deployment Gap
- Top row: 90% Fortune 500 use Copilot | 3% of M365 users are active paid users (two cards, 3% centered after removing 5%)
- Bottom row: 45% paying for AI tools | 12% using AI with measurable impact | 74% hope AI will deliver value; only 20% see results
- Citations: [1] Microsoft FY26 Q1 Earnings; The Register/Microsoft FY26 Q2. [3] Section, AI Proficiency Report, Jan 2026. [4] Coatue/Census/Macrobond/Apollo; Deloitte Q4 2024.

### Slide 3: Quote Slide
"Activity is not impact. Organizations generating AI activity without defined organizational intent are paying for tools that produce adoption metrics but not business outcomes."
HBR quote: "Without intention, AI makes it easier to do more — but harder to stop."

### Slide 4: The Proficiency Reality — "The 70% Problem"
- 28% Novice | 70% Experimenter | ~2% Practitioner | 0.1% Expert
- Key message: The gap between Experimenter and Practitioner is the gap between individual productivity and organizational results.
- **NOTE: 0.1% Expert is flagged as incorrect. Should be ~1% per Section data.**
- **NOTE: 28% Novice may also be outdated. Section Jan 2026 report shows 46% Novice.**

### Slide 5: The Framework — Five Modules
01 Define Your Intent | 02 Audit the Reality | 03 Name the Gap | 04 Design the Path | 05 Build for What's Coming

### Slide 6: Three Gaps, Three Prescriptions
- Tool Ceiling → Move from augmentation to workflow automation
- Measurement Gap → Build three-pillar KPI system
- Intent Gap → Go back to Module 1, define intent first

### Slide 7: The Path — Three Phases
- Phase 1 OPTIMIZE: 7-8% headcount equivalent savings
- Phase 2 ACCELERATE: 50 FTE equivalent per 1K employees
- Phase 3 REINVENT: 85% reduction in downtime (Siemens / Mendix)
- Citations: [3] Section, AI Proficiency Report & Measure AI Success, 2026. [9] Section, AI:ROI Conference (Siemens/Mendix, Zapier segments).

### Slide 8: CTA — "The First Step Is a Conversation"
- Week 0: 90-minute intent session
- Weeks 1-3: Three-layer audit
- Week 4: Gap diagnosis
- Weeks 5-6: Path design workshop
- Contact: mparkerchavez@gmail.com, superbydesign.com

---

## Critical Context: NZTE Meeting Translation

I'm meeting with NZTE (New Zealand Trade and Enterprise) today. They currently measure AI success using Phase 1 activity metrics:
- **Adoption Rate:** % of BDMs actively using each tool weekly (target: 60%)
- **User Rating:** Average satisfaction score (target: ≥4 out of 5)
- **Repeat Usage:** Proportion returning multiple times per week (target: 50%)
- **Time Saving (Proxy):** Self-reported time reduction (target: 30% reduction)

Key insight for NZTE: Their metrics tell them people are using the tools, not whether the tools are creating business value. This maps directly to the Intent Architecture framework:
- Their current metrics = Phase 1 "Optimize" territory (adoption/activity)
- Phase 2 metrics would be: workflow-level (proposals generated E2E, meeting prep time from system logs, conversion rates AI-assisted vs. manual)
- Phase 3 metrics would be: business outcomes (revenue per BDM, client acquisition cost, deal velocity)
- The METR study is especially relevant: their "30% self-reported time savings" could be perception, not reality (METR found devs believed 20% faster but were actually 19% slower)

---

## How the Phase Stats Translate for Any Organization

- **7-8% headcount equivalent savings** (Phase 1): Broad, modest return. AI copilots on daily work give back ~7-8% of collective time. For 1,000 employees = 70-80 FTE equivalent.
- **50 FTE per 1,000 employees** (Phase 2): Higher yield from automating entire workflow steps (not just speeding up individuals). Requires 1-3 agentic applications per division.
- **85% reduction in downtime** (Phase 3): Narrow but deep. Purpose-built vertical AI agent in a specific domain (Siemens/Mendix virtual engineer). Dramatic results in one critical process, not across the board.

The mistake most companies make: expecting Phase 3 results from Phase 1 effort. You have to sequence intentionally.

---

## What I Want to Do Next

I want to iterate on the ExecSummary deck to get the right level of detail on each slide. Specifically:

1. **Fix the known data issues** (0.1% Expert → ~1%, potentially update 28% Novice, address the unverified 45% stat)
2. **Refine the narrative flow** so each slide builds clearly toward the CTA
3. **Ensure the Phase 1/2/3 stats on Slide 7 are clearly explained** and translate for any audience (not just people who already understand AI metrics)
4. **Review whether the ExecSummary has the right density** — is it too compressed? Too sparse? Does each slide earn its place?
5. **Update the Verification Report** to reflect all v2 decisions

Please start by reading the ExecSummary v2 deck and the Verification Report, then let's discuss what changes would make the biggest impact.
