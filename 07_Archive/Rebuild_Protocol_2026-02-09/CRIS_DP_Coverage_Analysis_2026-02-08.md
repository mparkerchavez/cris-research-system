# CRIS Data Point Coverage Analysis

Are We Mining Our Extractions Deep Enough?

February 8, 2026

# EXECUTIVE SUMMARY

Your instinct is correct, but the story is more nuanced than a simple "we're not digging deep enough." The quantitative analysis reveals that across 67 extraction files containing 1,388 total data points, only approximately 130 unique DPs (~9.4%) are formally cited in the three primary output documents. However, this headline number masks two distinct problems that require different solutions.

# SECTION 1: THE NUMBERS

## Overall Statistics

Metric

Value

Total extraction files

67

Total data points available

1,388

Unique DPs cited across all outputs

~130

Overall citation coverage

Sources with 0% citation coverage

34 (50% of all sources)

Maximum coverage achieved by any source

41.7% (Dive Club)

No source exceeds 50% coverage

Confirmed

## Coverage Distribution

Coverage Range

Number of Sources

0% coverage

34 sources (627 DPs completely untouched)

1-10% coverage

14 sources

10-25% coverage

9 sources

25-50% coverage

3 sources (Cursor 26.7%, VentureBeat 28.6%, YCombinator 36.0%, Vibe Coding 39.1%, Dive Club 41.7%)

50%+ coverage

0 sources

# SECTION 2: THE TWO DISTINCT PROBLEMS

## Problem 1: Completely Ignored Sources (34 sources, 627 DPs)

These sources were extracted but never cited in ANY output document. This is the more concerning finding. Notable examples include:

High-value sources with zero citations:

- KPMG AI Pulse Q1-Q3 2025 (76 DPs combined) - These contain longitudinal enterprise adoption data across three quarters that should be feeding Idea 6 (2026 Adoption Inflection Points) heavily
- a16z Big Ideas Parts 2 and 3 (51 DPs combined) - VC predictions on physical automation, enterprise agents, crypto-AI convergence
- Both Insight Partners reports (37 DPs) - Enterprise AI adoption patterns and financial services AI spending
- AI Explained Two Best Models (20 DPs) - Opus 4.6 vs GPT-5.3 comparison, productivity paradox, moral patient status
- Anthropic Orchestrate Claude Code Teams (20 DPs) - This is directly relevant to Idea 7 (Agent-Native Development) yet has zero citations in the Weekly Learnings or Current Synthesis
- BCG Consumers Trust AI (25 DPs) and BCG GenAI Risk Compliance (25 DPs) - Both highly relevant to Ideas 1, 3, and 6
- Section State of AI Proficiency (25 DPs) - A companion to the proficiency report that IS cited, yet completely ignored
- McKinsey Smart People Wrong Careers (20 DPs) - Relevant to Idea 4 (Skills Endure)
- TED Stop AI Killing Critical Thinking (15 DPs) - Relevant to Idea 4
## Problem 2: Shallow Mining of Cited Sources (33 sources, ~761 DPs uncited)

Even among sources that ARE cited, coverage rarely exceeds 25%. Notable gaps:

- KPMG AI Pulse Q4 2025: 3 of 40 DPs cited (7.5%) - This is the most data-rich extraction in the system and only 3 DPs made it into outputs
- BCG AI Agents Customer Experience: 2 of 30 DPs cited (6.7%) - Contains Klarna case study data extensively referenced in Active Ideas tables but NOT in Weekly Learnings cite metadata
- McKinsey Agents Robots Skills: 4 of 25 DPs cited (16%) - Core source for multiple ideas but 21 DPs unused
- BCG Emerging Agentic Enterprise: 5 of 25 DPs cited (20%) - Foundational source for Idea 1 but 20 DPs unused
- Google DeepMind Science of Scaling: 6 of 24 DPs cited (25%) - Core source for Idea 2 but 18 DPs unused
# SECTION 3: ROOT CAUSE ANALYSIS

Why is this happening? Three structural factors:

- Context Window Compression During Synthesis - The Weekly Synthesis workflow instructs: "Load only the specific extractions needed for this synthesis." When synthesizing 67 sources, the practical reality is that Claude cannot hold all extraction files in context simultaneously. The system loads headers and indexes first, then selectively loads specific extractions. This creates a recency and salience bias: sources mentioned in the current synthesis focus get loaded; others don't.
- Idea-Centric Gravity - The Active Ideas framework creates gravitational pull toward data points that directly support existing ideas. DPs that are interesting but don't map cleanly to one of the 8 active ideas tend to be overlooked. This is by design (synthesis should serve your intellectual agenda) but it means valuable cross-cutting insights may be systematically missed.
- The "One-Line Contribution" Bottleneck - The Sources Processed table in Weekly Learnings assigns each source a single "One-Line Contribution." This framing encourages identifying each source's single strongest signal rather than mining it comprehensively. A source with 25 DPs gets the same one-line slot as a source with 15 DPs.
# SECTION 4: IS THIS ACTUALLY A PROBLEM?

Partially yes, partially no.

## What's working correctly:

- The CRIS system is designed as a compression chain (Raw Inputs to Extractions to Weekly to Monthly to Quarterly). Each layer compresses. A 9.4% citation rate from extractions to synthesis outputs is not inherently wrong; it reflects editorial judgment about what matters most.
- The highest-value DPs from the most relevant sources ARE making it into the synthesis. The quality of the Weekly Learnings narrative is strong: it connects ideas, tracks evolution, and maintains lineage.
- Active Ideas contains significantly more DP references (~194 unique source-DP pairs) than the Weekly Learnings or Current Synthesis, suggesting the ideas are being fed more comprehensively than the headline numbers suggest.
## What needs attention:

- 34 sources with ZERO citations is too many. These represent 627 DPs that were extracted (significant work) but never contributed to any synthesis output. This is wasted extraction effort or, more likely, missed insights.
- The KPMG longitudinal data (Q1-Q4, 141 DPs total, only 8 cited anywhere) represents a particularly significant gap. This is your best longitudinal enterprise adoption dataset and it's barely being used.
- Several BCG reports (Consumers Trust AI, GenAI Risk Compliance) contain evidence directly relevant to active ideas but are completely absent from outputs.
# SECTION 5: RECOMMENDATIONS

## Recommendation 1: Add a "Coverage Sweep" Step to Weekly Synthesis

After completing the tag-based synthesis, add a systematic check: scan the Extraction Index for sources with zero or very low citations. For each, ask: "Does this source contain DPs relevant to any active idea or open thread that I haven't captured?" This doesn't need to be exhaustive; even a 5-minute scan per synthesis could catch the most egregious gaps.

## Recommendation 2: Create a "Sources Needing Attention" Section in the Weekly Header

Add a running list of sources with zero citations that have been in the system for 2+ weeks. This creates visibility pressure to either integrate them or explicitly mark them as "reviewed, nothing relevant" (which is a valid outcome).

## Recommendation 3: Thematic Deep-Dives for High-DP Sources

For sources with 25+ DPs and low coverage (KPMG Q4 at 40 DPs, BCG reports at 25-30 DPs each), schedule dedicated "deep dive" passes where the sole focus is mining one source comprehensively against all active ideas. This could be done as a focused extraction review rather than during synthesis.

## Recommendation 4: Strengthen the Longitudinal Tracking

The KPMG Q1-Q4 series is your most valuable longitudinal asset. Consider creating a dedicated "KPMG Longitudinal Tracker" document that maps Q1-to-Q4 trends, which can then feed into Idea 6 (Adoption Inflection Points) more systematically.

## Recommendation 5: Audit the Zero-Citation Sources

Prioritize reviewing the 34 zero-citation sources in order of DP count. Many may contain insights that are currently being missed. The top priorities are:

- KPMG Q1-Q3 (76 DPs)
- a16z Parts 2-3 (51 DPs)
- Insight Partners (37 DPs)
- BCG ConsumersTrust + RiskCompliance (50 DPs)
- Section State of AI Proficiency (25 DPs)
# CONCLUSION

Your assumption is validated: the system is not mining deep enough into extracted sources. The 9.4% overall citation coverage and 34 sources with zero citations confirm that significant extracted evidence is not reaching the synthesis layer. The root causes are structural (context window limits, idea-centric gravity, and the one-line contribution bottleneck) rather than quality issues with the synthesis itself. The recommendations above address the gap without fundamentally changing the CRIS workflow; they add coverage visibility and systematic review steps to catch what the current process misses.

Report generated February 8, 2026

