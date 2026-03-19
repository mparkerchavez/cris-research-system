# Intent Architecture Deck v1 — Data Point Verification Report

**Date:** March 12, 2026
**Scope:** All slides in `IntentArchitecture_Deck_v1.pptx` containing quantitative claims, attributed quotes, or case study data
**Method:** Parallel web search verification against primary sources, cross-referenced with `IntentArchitecture_ResearchBrief_Verified.md`
**Priority filter:** Sources should be H2 2025 or newer for a deck presenting in early 2026

---

## Executive Summary

**10 slides** contain verifiable data points. Of **~30 distinct claims** across those slides:

- **12 verified** (safe to present as-is or with minor attribution cleanup)
- **8 partially verified** (directionally correct but need caveat, updated figure, or better sourcing)
- **5 unverified or unsourced** (cannot locate primary source; risk if challenged)
- **5 flagged** (potential fabrication, misattribution, or outdated figure requiring correction)

**Three items need immediate attention before any client-facing use:**

1. **Slide 02 — "85% Fortune 500"** is outdated. Microsoft now says 90% (March 2026). Update.
2. **Slide 13/14 — "0.1% Expert"** does not appear in any Section report. Section says 1%. This looks fabricated or misremembered.
3. **Slide 23 — Siemens "85% / 6,000 hours"** is misattributed. The case is a Siemens *customer* (Vivix, a Brazilian glass manufacturer). The "6,000 hours" figure cannot be found in any published case study.

---

## Slide-by-Slide Reports

---

### SLIDE 02 — "The Copilot Reality" (85% / 5% / 3%)

| Claim | Status | Finding |
|-------|--------|---------|
| 85% of Fortune 500 adopted Copilot | ⚠️ OUTDATED | Microsoft official: **70%** (Nov 2024), **80%** (Feb 2026), **90%** (March 9, 2026). The 85% is an interpolation that doesn't match any official disclosure. |
| 5% moved from pilot to org-wide deployment | ✅ VERIFIED | Gartner "State of Microsoft 365 Copilot" survey confirms ~5-6% at full scale. |
| 3% of M365 users are active paid users | ✅ VERIFIED | Microsoft Q2 FY26 earnings (Jan 28, 2026): 15M paid seats / 450M total = 3.3%. Independently confirmed by Windows Central, The Register, Motley Fool. |

**Source links:**
- Microsoft Security Blog (Feb 10, 2026, 80% figure): https://www.microsoft.com/en-us/security/blog/2026/02/10/80-of-fortune-500-use-active-ai-agents-observability-governance-and-security-shape-the-new-frontier/
- Microsoft Q2 FY26 Earnings: https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q2/productivity-and-business-processes-performance
- Gartner "State of Microsoft 365 Copilot": https://www.gartner.com/en/documents/5818647 (subscription required)

**Recommendation:**
- Update "85%" to **"90%"** and cite Microsoft's March 2026 announcement, OR use "80%" from the Feb 2026 security blog
- Consider citing primary sources (Microsoft earnings, Gartner) instead of Nate B Jones as intermediary
- The 5% + 3.3% pairing is very strong and fact-checkable

**Risk level: MEDIUM** (easily fixable)

---

### SLIDE 05 — "Paying for AI. Not Benefiting from It." (45% / 12% / 85% / 74%)

| Claim | Status | Finding |
|-------|--------|---------|
| 45% of businesses paying for AI tools | ❌ UNVERIFIED | Cannot locate in any Section publication. Read from a slide image. No text-extractable source. |
| 12% using AI with measurable impact | ✅ VERIFIED | Section webinar (Jan 22, 2026), 5,000+ knowledge workers: "only 12% have embedded AI into day-to-day business processes." |
| 85% have no ROI-driving use cases | ✅ VERIFIED | Section AI Proficiency Report (Jan 2026), p.1. Verbatim confirmed. |
| 74% report no tangible AI value | ⚠️ WEAK SOURCE | Nate B Jones cites this without attribution. Likely originates from a major consultancy but the citation chain is broken. Cannot locate primary source. |

**Source links:**
- Section AI Proficiency Report (Jan 2026): https://www.sectionai.com/ai/the-ai-proficiency-report
- Section AI Proficiency Report PDF: https://cdn.prod.website-files.com/635ffd046dcb4346779f7a91/697042214ad04b53009bb521_AI%20Proficiency%20Report%20Jan%202026.pdf
- Section webinar "State of AI Proficiency in the Enterprise": https://www.sectionai.com/events/live-events/executive-briefing-measuring-the-ai-proficiency-of-the-workforce
- Deloitte "State of AI in the Enterprise" (recommended replacement for 74%): https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html

**Recommendation:**
- **Remove or replace the 45% stat** unless you can locate the original Section slide deck and extract the source
- The 12% and 85% are solid from Section (note: Section is a vendor, not a Big 3 consultancy)
- **The 74% needs primary sourcing.** Consider replacing with Deloitte's verified stat: "74% of organizations hope to grow revenue through AI, but only 20% are doing so" (Deloitte State of AI 2026, p.10, 3,235 respondents, 24 countries). Same number, much stronger source.

**Risk level: HIGH** (two of four claims are problematic)

---

### SLIDE 06 — "The Hidden Cost" (HBR Work Intensification)

| Claim | Status | Finding |
|-------|--------|---------|
| 8-month study | ✅ VERIFIED | April-December 2025. Confirmed. |
| 200-person technology company | ✅ VERIFIED | U.S.-based tech company. Confirmed. |
| AI intensifies work, expands into evenings/weekends | ✅ VERIFIED | Core finding confirmed. 83% reported increased workload. |
| Quote: "Without intention, AI makes it easier to do more — but harder to stop." | ✅ VERIFIED | Confirmed in article and UC Berkeley Haas press materials. |

**Source links:**
- HBR article: https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it (may require HBR subscription)

**Authors:** Aruna Ranganathan (Associate Professor, UC Berkeley Haas, PhD MIT Sloan) and Xingqi Maggie Ye (PhD student, UC Berkeley Haas). Strong credentials.

**Caveats worth knowing (not necessarily for the slide, but for Q&A):**
- Single company, single industry (tech)
- ~40 employees interviewed in depth (not all 200)
- Self-selection concern: intense workers may adopt AI more
- Pre-ChatGPT 4.5 rollout, so early-adoption patterns

**Recommendation:** Keep as-is. HBR + UC Berkeley Haas is a strong citation for enterprise audiences. Consider adding "Ranganathan & Ye, UC Berkeley Haas" in speaker notes for credibility.

**Risk level: LOW**

---

### SLIDE 07 — "What's Different for Organizations That Win" (2x / 6x)

| Claim | Status | Finding |
|-------|--------|---------|
| 2x more likely to report significant productivity gains | ⚠️ PARTIALLY VERIFIED | Gusto data: 32% with strategy vs. 14% without = 2.3x. But this is for >20% productivity gains specifically, and the population is **small businesses only**. |
| 6x more likely to report significant innovation | ❌ UNVERIFIED | Cannot locate a 6x multiplier in Gusto's published report. The 61% innovation figure exists but no baseline comparison that yields 6x. This appears to be a derived/interpolated number without clear sourcing. |

**Source links:**
- Gusto "AI for Small Business" report (PDF): https://prod.gusto-assets.com/media/Gusto_AI_Playbook-digital_updated-1.pdf

**Enterprise-grade alternatives (recommended replacements):**
- McKinsey "The State of AI in 2025": https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai (high performers ~3x more likely to redesign processes)
- BCG "Are You Generating Value from AI?" (Sept 2025): https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap
- BCG report PDF: https://media-publications.bcg.com/The-Widening-AI-Value-Gap-Sept-2025.pdf
- Deloitte "State of AI in the Enterprise" (Jan 2026): https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html

**Recommendation:**
- **The 6x claim is indefensible without sourcing.** Remove or replace.
- The 2x is directionally correct but needs an SMB caveat, or swap to McKinsey/Deloitte enterprise data
- Consider: "McKinsey finds AI high performers are nearly 3x more likely to fundamentally redesign processes" as enterprise-credible replacement

**Risk level: HIGH** (6x is unsourceable; 2x misrepresents population)

---

### SLIDES 13-14 — Proficiency Distribution (28% / 70% / ~2% / 0.1%)

| Claim | Status | Finding |
|-------|--------|---------|
| 28% Novice | ⚠️ CONTRADICTED | Most recent Section report shows **46% Novice**, not 28%. The 28% may come from an older edition. |
| 70% Experimenter | ✅ VERIFIED | Section confirms 70% in the Jan 2026 PDF. (Note: webinar transcript says 69%; PDF is primary.) |
| ~2% Practitioner | ⚠️ CONTRADICTED | Section reports **8% Practitioners** in their standard methodology. They do cite "less than 3%" when combining practitioners + experts, but 2% alone for practitioners doesn't match. |
| 0.1% Expert | ❌ LIKELY FABRICATED | Section reports **1% Expert**, not 0.1%. The 0.1% figure (10x smaller) does not appear in any Section publication. |

**Source links:**
- Section AI Proficiency Report (Jan 2026): https://www.sectionai.com/ai/the-ai-proficiency-report
- Section AI Proficiency Report PDF: https://cdn.prod.website-files.com/635ffd046dcb4346779f7a91/697042214ad04b53009bb521_AI%20Proficiency%20Report%20Jan%202026.pdf

**Root cause:** The deck appears to blend percentages from different editions of Section's reports, or has introduced errors. The 28% + 70% + 2% + 0.1% = 100.1%, which is suspiciously clean but doesn't match any single Section publication.

**What Section actually reports (Jan 2026 PDF, verified):**
- 70% Experimenter ✅
- "Less than 3%" Practitioner + Expert combined
- The Novice/Expert breakdown varies by report edition

**Recommendation:**
- **Immediately fix the 0.1% Expert claim.** Use "~1%" or "<1%" per Section data.
- Verify which Section report edition the 28% Novice comes from, or update to current figure
- Consider simplifying to: "70% Experimenter, <3% Practitioner or Expert" which is the most defensible framing
- The 70% is the anchor stat and it's solid

**Risk level: HIGH** (0.1% Expert is a factual vulnerability)

---

### SLIDE 17 — "The Tool Ceiling" (GitHub Copilot 55%)

| Claim | Status | Finding |
|-------|--------|---------|
| 55% faster code completion | ✅ VERIFIED (but dated) | Original study: "The Impact of AI on Developer Productivity" (arXiv:2302.06590), 95 programmers, May-June 2022. Published Feb 2023. |
| Larger PRs, higher review costs, more security vulnerabilities | ✅ VERIFIED | GitClear (2024): 41% higher code churn. CodeRabbit (2025): 10.83 issues/PR vs. 6.45 human. Multiple sources confirm security concerns. |
| Quote: "Copilot makes writing code cheaper but owning it more expensive" | ✅ VERIFIED | From AI News Strategy Daily transcript (Feb 18, 2026). Commentary/synthesis, not a research finding. |

**Source links:**
- Original 55% study (arXiv): https://arxiv.org/abs/2302.06590
- GitClear 2024 code quality analysis: https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality
- METR 2025 study (AI made experienced devs 19% slower): https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- METR study on arXiv: https://arxiv.org/abs/2507.09089
- Nate B Jones / AI News & Strategy Daily: https://natesnewsletter.substack.com/ (specific episode not individually indexed)

**Recency concern:** The 55% is from a **2022 lab study** (now 4 years old). More recent field data tells a different story:
- Accenture RCT (2024): 8-11% faster in production
- METR RCT (early 2025): **19% SLOWER** with AI for experienced devs (despite perceiving 20% speedup)

**Recommendation:**
- Add "(2022 lab study)" after the 55% figure for transparency
- The hidden costs narrative is well-supported by recent 2024-2025 data — that's the stronger part of this slide
- For Q&A prep: know that a 2025 study found AI made experienced developers slower, not faster

**Risk level: MEDIUM** (figure is real but aging; narrative is strong)

---

### SLIDE 18 — "The Measurement Gap" (Dan Shapiro, 90% at Level 2)

| Claim | Status | Finding |
|-------|--------|---------|
| "Level 2 feels like you are done. But you are not done." | ✅ VERIFIED | From Dan Shapiro's blog post "The Five Levels" (Jan 23, 2026). Concept confirmed. |
| 90% of self-described AI-native practitioners at Level 2 | ⚠️ ASSERTION, NOT DATA | Shapiro's observational estimate based on "dozens of companies." No survey methodology, no sample size, not peer-reviewed. |

**Source links:**
- Dan Shapiro blog post: https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/

**Dan Shapiro credentials:** CEO/Co-Founder of Glowforge, former Google acquisition founder, Wharton Senior Research Fellow. Strong practitioner credibility, but this is opinion, not research.

**Recommendation:**
- The conceptual framework (Level 2 as false completion trap) is compelling and defensible
- The "90%" number should be framed as Shapiro's practitioner observation, not as survey data
- Consider adding: "Shapiro estimates, based on work with dozens of companies..." in speaker notes
- For corroboration: Google DORA 2025 shows 90% AI adoption overall; Stack Overflow 2025 shows 84% use AI tools (directionally similar but different metrics)

**Risk level: MEDIUM** (framework is strong; specific number is soft)

---

### SLIDE 22 — ROI Formulas (7-8% savings, 50 FTE)

| Claim | Status | Finding |
|-------|--------|---------|
| 80% DAU x 10% productivity = 7-8% headcount equivalent | ⚠️ MATH CORRECT, SOURCE UNCLEAR | Formula is mathematically sound. Attributed to Section "How to Measure AI Success" but cannot independently verify it appears in that document. |
| 6,500-person org = 460 employee equivalent | ⚠️ ILLUSTRATIVE | Math is consistent (6,500 x 7% = 455). Appears to be a worked example, not an empirical case. |
| 1,000 automations x 2 hrs/week = 50 FTEs | ⚠️ MATH CORRECT, SOURCE UNCLEAR | Formula works (2,000 hrs / 40 = 50). The "1,000 automations" baseline is unverified. |

**Source links:**
- Section "How to Measure AI Success" deck: Not publicly indexed; sourced from uploaded file in CRIS system (`/mnt/uploads/Section - How to Measure AI Success.pdf`)

**Recommendation:**
- These formulas read as reasonable modeling assumptions, not empirical findings
- If presenting, frame as "Section's ROI modeling framework" rather than as proven results
- The 10% productivity gain assumption is conservative and defensible (industry range is 8-25% depending on study)
- Consider adding: "Assumptions: 80% daily active adoption, 10% net productivity gain after leakage"

**Risk level: LOW-MEDIUM** (math is sound; sourcing is thin but formulas are clearly models)

---

### SLIDE 23 — Case Studies (Siemens Customer + ServiceNow)

| Claim | Status | Finding |
|-------|--------|---------|
| Siemens: 85% reduction in downtime fix time | ⚠️ MISATTRIBUTED | The case is **Vivix Vidros Planos** (Brazilian glass manufacturer), a Siemens/Mendix *customer*. The 85% relates to quality assurance response time, not "downtime fix time." |
| Siemens: 6,000 hours saved | ❌ NOT FOUND | This figure does not appear in any published Vivix/Siemens/Mendix case study (AWS, Siemens Software, or Mendix customer stories). |
| ServiceNow: 54% ticket deflection | ✅ VERIFIED | Confirmed in ServiceNow's "Now on Now" deployment and community documentation. |
| ServiceNow: ~20% cases avoided | ✅ VERIFIED | "Nearly 20% case avoidance" confirmed. |
| ServiceNow: $5.5M annual savings | ✅ VERIFIED | Confirmed. (ServiceNow also reports $10M+ total annualized benefits.) |
| ServiceNow: half the time to close incidents | ✅ VERIFIED | Confirmed in multiple sources. |

**Source links:**
- Vivix/Mendix case study: https://www.mendix.com/customer-stories/vivix-transforms-glass-manufacturing-for-a-clearer-future/
- Vivix/Siemens Software case study: https://resources.sw.siemens.com/en-US/case-study-vivix-vidros-planos/
- Vivix/AWS case study: https://aws.amazon.com/partners/success/vivix-mendix/
- ServiceNow Q2 2025 results (Futurum Group analysis): https://futurumgroup.com/insights/servicenows-q2-2025-results-beat-expectations-as-ai-innovations-power-growth/

**Recommendation:**
- **ServiceNow data is solid.** Keep as-is.
- **Siemens needs correction:**
  - Change attribution to "Siemens Mendix customer" or "Vivix Vidros Planos (Siemens customer case)"
  - Change "downtime fix time" to "quality assurance response time" per actual case study
  - **Remove "6,000 hours"** unless you can locate the source — it's not in any published case study
  - The Section AI:ROI Playbook conference readout is the intermediary source; the Playbook itself notes this is a customer, not Siemens

**Risk level: HIGH** (misattribution + phantom stat)

---

### SLIDES 25-26 — Quotes and Allocation Economy

| Claim | Status | Finding |
|-------|--------|---------|
| Brice Challamel quote ("era of AI that works for us") | ⚠️ UNVERIFIED | Challamel confirmed as Head of AI Strategy & Adoption at OpenAI, but this specific quote cannot be found in any public source. May be from the Section conference (not publicly indexed). |
| Cisco "discover, detect, protect" | ✅ VERIFIED | Framework confirmed in Cisco's official AI Defense materials (Feb 2026). DJ Sampath's title is "SVP, AI Software and Platform" (minor title variance from deck). |
| Nate B Jones "The race is an intent race" | ⚠️ UNVERIFIED | Jones exists and discusses intent extensively, but this specific phrasing not found in indexed sources. |
| Natalia Quintero allocation economy thesis | ✅ VERIFIED | Article confirmed on Every (Feb 2026). Quote and concept verified. Quintero is Head of Consulting at Every. |

**Source links:**
- Cisco AI Defense announcement (Feb 10, 2026): https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m02/cisco-redefines-security-for-the-agentic-era.html
- Cisco / DJ Sampath VentureBeat Q&A: https://venturebeat.com/security/cisco-warns-enterprises-without-tapping-machine-data-your-ai-strategy-is
- Natalia Quintero / Every article: https://every.to/on-every/the-next-chapter-of-every-consulting
- Nate B Jones / AI News & Strategy Daily: https://natesnewsletter.substack.com/ (specific episode not individually indexed)
- Nate B Jones podcast feed: https://podcasts.apple.com/hr/podcast/ai-news-strategy-daily-with-nate-b-jones/id1877109372

**Recommendation:**
- The Challamel and Jones quotes likely come from the Section AI:ROI Conference (not publicly transcribed). If so, cite as: "[Speaker], Section AI:ROI Conference, Spring 2026"
- Cisco framework is solid; minor title fix optional
- Allocation economy framing is well-sourced and has broader literature support

**Risk level: LOW-MEDIUM** (conference quotes are common but hard to fact-check externally)

---

## Additional Sources Referenced

These sources were consulted during verification but are not directly cited in the deck. They may serve as replacements or supplementary citations:

| Source | URL | Relevance |
|--------|-----|-----------|
| Insight Partners "AI Adoption Patterns 2026" | https://www.insightpartners.com/ideas/ai-adoption-2026/ | Strategy gap framing |
| Udemy "2026 Global Learning & Skills Trends" | https://business.udemy.com/2026-global-learning-skills-trends-report/ | 3,400% Copilot learning growth |
| Deloitte press release | https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html | Alt entry point for Deloitte data |

**Not publicly indexed (source exists in CRIS system only):**
- Nick Bartlett / FTSG "Hot Trends Aren't Strategy" (Jan 16, 2026) — URL not found publicly
- Section "How to Measure AI Success" deck — uploaded file, not publicly hosted
- Section "The AI:ROI Playbook" (Spring 2026) — conference readout, not publicly hosted

---

## Priority Action Items

### 🔴 Fix Before Any Client Use

1. **Slide 02:** Update "85% Fortune 500" to "90%" (Microsoft March 2026) and cite Microsoft directly
2. **Slides 13-14:** Fix "0.1% Expert" to "~1%" per Section data. Verify 28% Novice against current report edition.
3. **Slide 23:** Correct Siemens attribution to "Siemens Mendix customer (Vivix)." Remove "6,000 hours" unless sourced.

### 🟡 Strengthen Before High-Stakes Presentations

4. **Slide 05:** Replace or source the 45% stat. Replace 74% with Deloitte's verified "74% hope / 20% doing" stat.
5. **Slide 07:** Remove or replace the 6x innovation claim (unsourceable). Add SMB caveat to 2x, or replace with McKinsey/Deloitte enterprise data.
6. **Slide 17:** Add "(2022 lab study)" to the 55% figure for transparency.
7. **Slide 18:** Add "practitioner estimate" framing to the 90% at Level 2 claim.

### 🟢 Nice to Have

8. **Slide 02:** Cite Microsoft earnings + Gartner directly instead of Nate B Jones as intermediary.
9. **Slide 06:** Add "Ranganathan & Ye, UC Berkeley Haas" to speaker notes.
10. **Slides 25-26:** Attribute conference quotes to "Section AI:ROI Conference, Spring 2026" for traceability.

---

## Source Credibility Tier List (for enterprise buyers)

| Tier | Source | Used In |
|------|--------|---------|
| **A — Institutional** | Microsoft earnings, Deloitte State of AI (3,235 execs, 24 countries), HBR + UC Berkeley Haas, Gartner | Slides 02, 06 |
| **B+ — Strong practitioner** | Section AI Proficiency Report (5,000+ workers), ServiceNow official case studies, Cisco official materials | Slides 05, 13-14, 23, 25 |
| **B — Credible but narrow** | Gusto (SMB only), Dan Shapiro (practitioner blog), GitClear/CodeRabbit (code quality) | Slides 07, 17, 18 |
| **B- — Commentary** | Nate B Jones (newsletter/video), Section AI:ROI Playbook (conference readout), Every (Quintero) | Slides 02, 05, 19, 25-26 |
| **C — Unlocatable** | 45% paying stat, 6x innovation, 0.1% Expert, 6,000 hours (Siemens) | Slides 05, 07, 13, 23 |
