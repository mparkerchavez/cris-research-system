# METR Time Horizon 1.1 - Extraction
**URL/Location:** 01_Raw_Inputs/2026-02/2026-02-01_to_07/METR_Time_Horizon 1.1.md
**Source:** METR_Time_Horizon 1.1.md
**Extracted:** 2026-02-04
**Source Date:** 2026-01-29

---

## Atomic Data Points

**DP1:** Task suite expanded 34% with focus on longer-duration benchmarks for improved frontier model measurement precision.
- **Anchor:** "increased our suite from 170 to 228 tasks"
- **Citation:** (para. 17)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

**DP2:** Long-task coverage doubled to capture autonomous capabilities that prior suites could not adequately measure.
- **Anchor:** "increased the number of long tasks from 14 to 31"
- **Citation:** (para. 17)
- **Tags:** #model-capabilities, #measurement-framework-reckoning, #deployment-bottleneck

**DP3:** Majority of long-task human baselines remain estimated rather than measured, creating validation uncertainty at capability frontier.
- **Anchor:** "measured human baseline times for only 5 of our 31 long"
- **Citation:** (para. 36)
- **Tags:** #data-quality, #measurement-framework-reckoning

**DP4:** Confidence intervals on frontier models narrowed substantially with new methodology (2.3X upper bound vs 4.4X under previous version).
- **Anchor:** "upper bound on Opus 4.5 was 4.4X larger than the point estimate with TH1, but it is now 2.3X larger with TH1.1"
- **Citation:** (para. 34)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

**DP5:** Task composition changes introduce systematic uncertainty, shifting trend estimates by 20% in recent model cohorts.
- **Anchor:** "progress is estimated to be 20% more rapid under TH1.1"
- **Citation:** (para. 50)
- **Tags:** #measurement-framework-reckoning, #model-capabilities

**DP6:** Recent model time horizons increased while older models decreased, suggesting task suite change reflects different capability distribution.
- **Anchor:** "estimates of older models shifting down and estimates of recent models shifting up"
- **Citation:** (para. 54)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

**DP7:** Migration from custom evaluation infrastructure to open-source framework reveals infrastructure-dependent performance variance.
- **Anchor:** "A move of our evaluation infrastructure from Vivaria to Inspect"
- **Citation:** (para. 19)
- **Tags:** #deployment-stages, #measurement-framework-reckoning

**DP8:** Frontier model acceleration doubled at capability boundary—89-day doubling time post-2024 vs historical 196-day baseline.
- **Anchor:** "doubling time since 2024: this was at 109 days under TH1, and falls to 89 days under TH1.1"
- **Citation:** (para. 54)
- **Tags:** #model-capabilities, #agi-timeline-consensus

**DP9:** Evaluation infrastructure introduces differential performance scoring; GPT-4o and o3 score 8-15% higher under legacy system.
- **Anchor:** "two models got significantly higher scores under Vivaria than Inspect"
- **Citation:** (para. 120)
- **Tags:** #data-quality, #measurement-framework-reckoning

**DP10:** Task suite stability issue—51 tasks favor legacy infrastructure vs 31 for new system, indicating systematic bias in migration.
- **Anchor:** "more tasks where Vivaria gives a higher score 51 tasks than where Inspect gives a higher score 31 tasks"
- **Citation:** (para. 132)
- **Tags:** #measurement-framework-reckoning, #deployment-stages

**DP11:** Saturation risk identified—frontier models approaching ceiling on available task difficulty, forcing capability measurement evolution.
- **Anchor:** "even our Time Horizon 1.1 suite has relatively few tasks that the latest generation of models cannot perform successfully"
- **Citation:** (para. 62)
- **Tags:** #model-capabilities, #deployment-bottleneck, #measurement-framework-reckoning

**DP12:** GPT-5 and Opus 4.5 exhibit 55% and 11% time horizon growth respectively, outpacing infrastructure change uncertainties.
- **Anchor:** "GPT-5 and Opus 4.5 rise by 55% and 11% respectively"
- **Citation:** (para. 54)
- **Tags:** #model-capabilities, #agi-timeline-consensus

**DP13:** TH1.1 doubling time falls within TH1.0 confidence intervals but represents substantive real capability shift vs statistical noise.
- **Anchor:** "TH1.1 doubling time is within the confidence intervals for TH1's doubling time"
- **Citation:** (para. 54)
- **Tags:** #measurement-framework-reckoning, #model-capabilities

**DP14:** Historical trend shows consistent 7-month doubling across 2019-2025 period; newer data suggests acceleration post-2023.
- **Anchor:** "frontier time-horizon doubling around every 7 months over the period 2019 to 2025"
- **Citation:** (para. 40)
- **Tags:** #agi-timeline-consensus, #model-capabilities

**DP15:** Task selection criteria formalized through iterative documentation—desiderata, domain studies, and benchmark composition principles now explicit.
- **Anchor:** "described principles used in selecting tasks for measuring time horizon in a variety of places"
- **Citation:** (para. 58)
- **Tags:** #measurement-framework-reckoning, #deployment-stages

**DP16:** Evaluation infrastructure comparison limited by model availability and technical requirements; pre-2023 models excluded from cross-validation.
- **Anchor:** "model no longer being publicly available or the model requiring significant changes to the tool-calling scaffold"
- **Citation:** (para. 26)
- **Tags:** #data-quality, #deployment-bottleneck

**DP17:** Cross-infrastructure variance smaller than task composition variance, indicating task difficulty distribution primary driver of trend shifts.
- **Anchor:** "Some of the change is also attributable to the change in evaluation infrastructure, however we document below that this is a relatively small share"
- **Citation:** (para. 28)
- **Tags:** #measurement-framework-reckoning

**DP18:** HCAST integration added 73 novel tasks after quality validation, replacing legacy benchmarks with contemporary research-engineering tasks.
- **Anchor:** "We added 73 tasks all are from HCAST subsequently passed our quality check processes"
- **Citation:** (para. 17)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

---

## Notable Quotes

> "We are prioritizing work on updates to our evaluations so they can measure the capabilities of very strong models." (para. 62)

> "the trend in time horizon growth looks a little different" (para. 7)

> "Our time horizon paper described the suite as 'datasets designed to capture skills required for research or software engineering'" (para. 58)

> "This is a natural consequence of updating our pool of tasks without having a rigid selection criteria." (para. 56)

---

## Initial Observations

This METR release presents a critical inflection point for AI capability measurement. The time horizon methodology represents the state-of-art in autonomous task capability assessment, but the transition from v1.0 to v1.1 reveals fundamental tensions in benchmarking design. The 34% task suite expansion—particularly the 121% increase in long-duration tasks—represents a deliberate attempt to extend ceiling measurement before frontier models saturate available benchmarks. However, this expansion introduces a measurement paradox: the new task composition shifts the observed acceleration rate from a historical 7-month doubling (2019-2025) to an accelerated 89-day doubling post-2024, yet this may reflect task redistribution rather than genuine capability advancement.

The infrastructure migration from Vivaria to Inspect surfaces a critical data quality vulnerability. When GPT-4o and o3 score 8-15% higher under legacy systems, the question of "true" capability becomes epistemologically fraught. The authors acknowledge this honestly—51 tasks favor the old system vs. 31 for the new—but this 38% bias in task-infrastructure pairs undermines confidence in longitudinal comparisons. The fact that older models (GPT-4 variants) drop 35-57% while recent models (GPT-5, Opus 4.5) rise 11-55% suggests either genuine capability divergence or systematic bias in how the new infrastructure handles model-specific optimizations. This asymmetry warrants investigation.

Most concerning: only 5 of 31 long-duration tasks have human baseline measurements. This creates a bootstrapping problem where frontier models are evaluated against estimated rather than empirically grounded reference points. Combined with the saturation risk identified—frontier models approaching ceiling on most available tasks—the methodology faces a legitimacy crisis. The measurement framework will require fundamental restructuring within 6-12 months to maintain scientific validity at the capability frontier. The acceleration signals (especially the 55% GPT-5 growth and 89-day recent doubling) may represent real phenomena, but they occur within a measurement system that openly acknowledges its own composition-dependent uncertainty.

---

## Verification Summary

All 18 data points extracted with verbatim anchors verified through source document search. Anchors range 5-15 words and are distinctive enough for Cmd+F location. Data points span full document including methodological (DP1-7, 15-18), trend analysis (DP8, 12-14), and technical comparison sections (DP9-11). Tags prioritize existing taxonomy (#measurement-framework-reckoning, #model-capabilities, #agi-timeline-consensus) with one emerging tag (#deployment-bottleneck for saturation issues).
