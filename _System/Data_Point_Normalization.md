# CRIS Data Point Normalization Strategy

**Applies to:** All CRIS synthesis outputs (Weekly Learnings, Talking Points, Current Synthesis, Active Ideas)

**Last Updated:** February 7, 2026

---

## The Problem

CRIS aggregates research from dozens of sources. These sources measure similar phenomena using different methodologies, populations, timeframes, and units. When data points from different sources appear side by side in synthesis, the result can be confusing or misleading.

**Example of the problem in practice:**

> "26% of enterprises have deployed agents (KPMG), 75% are using AI tools (Section), and only 2.7% become practitioners (Section)."

These three numbers describe overlapping but distinct things. Without normalization, a reader might think adoption is simultaneously at 26%, 75%, and 2.7%. The confusion erodes credibility and obscures the actual insight.

---

## Core Principles

### Principle 1: Context Before Numbers

Every data point in a CRIS synthesis must answer three questions:

1. **Who was measured?** (population and sample description)
2. **What was measured?** (the specific metric, not the broad topic)
3. **When was it measured?** (date or time period of the data)

If you cannot answer all three, the data point needs a qualifier or should be excluded from synthesis.

### Principle 2: Data Points Serve the Narrative

Data points play two supporting roles in CRIS writing (see also `_System/Style_Guide.md`, Narrative Over Data):

1. **Credibility:** They give the reader reason to trust the narrative.
2. **Navigation:** They point toward sources that expand on the ideas and trends being communicated.

Data points are not the substance of the argument. Choose the single most important statistic for a claim. Use it. Move on. Additional data points belong in supporting evidence sections, not inline with the narrative.

### Principle 3: Citations Are Infrastructure

The `[Source_Name DPx]` citation format is not just a credibility marker. It is the navigable link that connects a claim back to its evidence through the compression chain. Citations must be consistent and predictable because the front-end app parses them directly from the markdown files. Any variation in format breaks the parser and breaks the lineage.

---

## Normalization Framework

### Level 1: Source Attribution (Minimum Standard)

Every data point must include its source. This is already enforced by the citation contract. No change needed here.

**Format:** "85% of knowledge workers lack value-driving AI use cases [Section DP3]"

### Level 2: Measurement Context (Required for Synthesis)

When a data point appears in synthesis (Weekly Learnings, Talking Points, Current Synthesis), it must include enough context for the reader to understand what was actually measured.

**Template:** [Metric] among [population], per [source] ([timeframe])

**Examples:**

| Raw (from extraction) | Normalized (for synthesis) |
|----------------------|---------------------------|
| 26% agent adoption | 26% of surveyed enterprises report deploying AI agents (KPMG, Q4 2025) |
| 75% using AI tools | 75% of knowledge workers report using AI tools at work (Section, January 2026) |
| 2.7% become practitioners | 2.7% of AI tool users progress to practitioner-level proficiency (Section, January 2026) |
| $2.9T opportunity | $2.9 trillion in projected economic value, contingent on workflow redesign (McKinsey, 2025) |

### Level 3: Comparability Framing (Required When Juxtaposing Sources)

When two or more data points from different sources appear in the same paragraph or section, explicitly state how they relate to each other.

**Three patterns for comparability framing:**

#### Pattern A: Same metric, different sources (convergence/divergence)

Use when multiple sources measure essentially the same thing.

> Multiple sources confirm the adoption gap. KPMG finds 26% of enterprises have deployed AI agents (Q4 2025), while Bain reports 28% in a separate enterprise survey (January 2026). The convergence around 25-28% provides confidence in this range.

**Key move:** State the convergence range or the divergence gap explicitly.

#### Pattern B: Different metrics, same phenomenon (layered view)

Use when sources measure different facets of the same broader trend.

> AI tool access is widespread but shallow. Seventy-five percent of knowledge workers report using AI tools (Section, January 2026), yet only 2.7% of those users progress to practitioner-level proficiency. Meanwhile, 26% of enterprises report deploying AI agents at the organizational level (KPMG, Q4 2025). These three figures describe different layers of the same reality: broad access, shallow adoption, and limited organizational deployment.

**Key move:** Name what each metric measures and explain how the layers connect.

#### Pattern C: Conflicting data (tension)

Use when sources genuinely disagree.

> The scale of the C-suite perception gap is contested. Section reports a 53 percentage point gap between executive and individual contributor confidence in AI strategy (81% vs. 28%), while McKinsey's earlier 2025 survey found a smaller but still significant 34 percentage point gap. The difference likely reflects timing (post-Opus 4.6 vs. pre-Opus 4.6) and population composition (Section surveyed tech-heavy industries, while McKinsey's sample was broader).

**Key move:** State the disagreement, then offer the most likely explanation for the difference.

---

## Handling Specific Metric Types

### Percentages and Percentage Points

- **When comparing two percentages:** Always express the difference as "X percentage points" and include both original values.
  - Wrong: "a 53-point gap in strategy clarity"
  - Right: "a 53 percentage point gap in strategy clarity (81% vs. 28%)"
- **When a percentage is relative:** State the base clearly.
  - Wrong: "70% skills transfer rate"
  - Right: "70% of current skills transfer across automation boundaries (based on O*NET task analysis)"

### Dollar Figures

- **Always specify the denominator and timeframe.**
  - Wrong: "$4K per month for Opus"
  - Right: "$4,000 per month per engineer-equivalent for Opus 4.6 API access (at typical enterprise usage rates, 2026)"
- **When mixing scales:** Use the same order of magnitude within a paragraph, or explicitly bridge between them.
  - Acceptable: "Individual tool costs ($4,000/month per engineer) aggregate rapidly at enterprise scale, contributing to the $2.9 trillion in economic value that McKinsey projects is contingent on workflow redesign."
  - Avoid: mixing "$4K/month" and "$2.9T" in the same sentence without connecting them.

### Ratios and Multipliers

- **Always state the baseline.**
  - Wrong: "17.2x error amplification"
  - Right: "17.2x error amplification in independent multi-agent systems compared to single-agent baselines (MoltBook, 2026)"
- **Prefer concrete numbers over ratios when both are available.**
  - Acceptable: "Independent agent systems produced 17.2x more errors than single-agent baselines, while centralized coordination reduced this to 4.4x."
  - Better: "Independent agent systems produced errors at 17.2x the single-agent rate. Centralized coordination cut this to 4.4x, a 75% reduction in error amplification."

### Timelines and Projections

- **Anchor to calendar dates, not relative time.**
  - Wrong: "within 6-12 months"
  - Right: "by Q3-Q4 2026 (6-12 months from February 2026)"
- **Distinguish forecasts from observations.**
  - Observation: "As of January 2026, 26% of enterprises have deployed agents."
  - Forecast: "Gartner projects that 40% of enterprises will have deployed agents by Q4 2026."
- **When timeframes conflict,** state the source and basis for each.

### Adoption and Proficiency Scales

Different sources use different scales (percentage adoption, maturity levels, proficiency tiers). When synthesizing across scales:

- **Do not convert between scales** unless the methodology is transparent and defensible.
- **Instead, present each on its own terms** and describe what level of the phenomenon each measures.

**Example:**

> Adoption metrics vary by what they measure. At the broadest level, 75% of knowledge workers report AI tool usage (Section). At the organizational level, 26% of enterprises report agent deployment (KPMG). At the individual proficiency level, only 2.7% reach practitioner status (Section). Each metric captures a different altitude of the same adoption landscape: tool exposure, organizational commitment, and individual mastery.

---

## The "Altitude" Model for Data Point Organization

When presenting multiple data points about the same broad topic, organize them by altitude (from macro to micro):

1. **Market level:** Total addressable value, industry-wide percentages, macro forecasts
2. **Enterprise level:** Organizational adoption rates, deployment percentages, budget allocations
3. **Team level:** Coordination metrics, productivity changes, workflow adoption
4. **Individual level:** Proficiency rates, skill transfer, use case identification

This creates a natural zoom from big picture to ground truth and prevents confusion from mixing altitudes in the same sentence.

**Example application:**

> The AI adoption landscape operates at distinct altitudes. At market level, McKinsey projects $2.9 trillion in economic value contingent on workflow redesign. At enterprise level, roughly one in four organizations has deployed AI agents (KPMG, 26%; Bain, 28%). At team level, multi-agent coordination shows diminishing returns beyond three to four agents per workflow (MoltBook). At individual level, only 2.7% of AI tool users reach practitioner proficiency (Section), suggesting that the bottleneck is not access but depth.

---

## Temporal Lineage: Tracing Data Points Through the Compression Chain

### The Principle

CRIS documents ladder over time. An idea that starts as a data point in an extraction may become a claim in Weekly Learnings, a key takeaway in Current Synthesis, and a trend in Quarterly Synthesis. At every stage, the reader should be able to trace backward to see where the claim came from and how its evidence base evolved.

The lineage model is: **start at the latest synthesis, trace backward.** Current Synthesis is the entry point. Everything else supports it.

### How Lineage Works at Each Layer

**Extractions** cite raw sources. This is the ground truth layer. The `[Source_Name DPx]` format anchors every data point to its origin.

**Weekly Learnings** cite extractions. When a narrative claim is supported by data, the citation points to the specific extraction and data point(s). This is where temporal context first appears: the Weekly Learnings file is dated, so the citation carries an implicit "as of this week" marker.

**Current Synthesis** cites Weekly Learnings *and* extraction DPs. Each claim should reference the Weekly Learnings entry where the evidence was first synthesized, alongside the underlying DP citations. This creates a two-level trace: the reader can see both *when* the evidence entered your thinking (via the WL date) and *where* it came from (via the DP citation).

**Format for Current Synthesis citations:**

> Organizations consistently underinvest in the people and process dimensions of AI adoption [WL_2026-02-07; Section_AIProficiencyReportJan2026 DP3, KPMG_AIPulseQ4_2025 DP12].

The WL reference tells the reader when this evidence was synthesized. The DP references tell them where to find the raw data.

**Monthly Synthesis** cites Weekly Learnings. If a narrative shifted over the course of the month, the Monthly can note which weeks marked the shift:

> "The coordination cost narrative shifted during February. Early in the month, the evidence pointed primarily to technical overhead (WL_2026-02-07). By mid-February, new sources reframed the issue as organizational design (WL_2026-02-14, WL_2026-02-21)."

This is where the "tracking how your thinking changed" goal gets served structurally.

**Quarterly Synthesis** cites Monthly Syntheses and, where needed, the most significant Weekly Learnings that marked turning points.

### Lineage and the Front-End App

The front-end app parses citations directly from the markdown files to build the slide-out drawer and lineage view. This means:

- **Citation format must be consistent and predictable.** Any variation (e.g., `[Section, DP3]` vs. `[Section DP3]` vs. `[Section_DP3]`) will break the parser.
- **Source names must uniquely identify extraction files.** As of February 2026, all extraction files follow the `Source_DescriptiveSlug_YYYY-MM-DD.md` naming convention, which ensures unique identification. The inline citation drops the date: `[Source_DescriptiveSlug DPx]`. For example, the file `Section_AIProficiencyReportJan2026_2026-02-04.md` is cited as `[Section_AIProficiencyReportJan2026 DP3]`.
- **The citation format is a contract.** Changes to the format require coordination with the app's parsing logic. See `_System/Citation_Contract.md` for the full specification.

---

## Normalization Checklist

Before finalizing any synthesis document, verify:

1. **Every data point includes population, metric, source, and timeframe.** Search for naked percentages (numbers without context) and add the missing frame.

2. **No two data points from different sources appear in the same sentence without a comparability frame.** If they do, either separate them into distinct sentences or add an explicit connecting statement.

3. **Percentage point differences are labeled as such.** Search for "X-point gap" and replace with "X percentage point gap (Y% vs. Z%)."

4. **Dollar figures include denominators.** Search for "$" and verify each instance includes per-what, per-when.

5. **Ratios include baselines.** Search for "x" (as in "17.2x") and verify the comparison point is stated.

6. **Timelines are anchored to dates.** Search for "months" and "years" and replace relative timeframes with calendar anchors where possible.

7. **No cross-altitude mixing within sentences.** If a sentence mentions both a market-level and individual-level metric, split it or add an explicit altitude transition.

8. **Lineage citations are present (Current Synthesis and above).** Verify each claim includes both a WL reference and DP citations. Verify the citation format matches the standard.

---

## Integration with Other CRIS Processes

### During Extraction

Extractors should capture enough metadata for normalization:

- Population description (who was surveyed/studied)
- Sample size (if available)
- Measurement methodology (if described)
- Date of data collection (not just publication date)

This metadata lives in the extraction's data points and enables proper normalization during synthesis.

### During Weekly Synthesis

Apply Level 2 normalization to all data points that appear in the synthesis. Apply Level 3 when juxtaposing sources. Use the altitude model to organize multi-source sections. Mark what is new, what shifted, and what held steady (see `_System/Style_Guide.md`, Writing for Your Future Self).

### During Talking Points Creation

Talking Points prioritize memorability. For each Evidence section:

- Choose the single most defensible data point as the "Key stat."
- Include source and timeframe in the stat itself (it should be quotable as-is).
- In the "Supporting data" field, provide the comparability frame.

### During Current Synthesis Updates

Current Synthesis is the most reader-facing document. Every data point in Current Synthesis must meet Level 2 normalization at minimum. Any claim supported by multiple sources must use Level 3 comparability framing. Every claim must include lineage citations (WL reference + DP citations) so the front-end app can build the trace.
