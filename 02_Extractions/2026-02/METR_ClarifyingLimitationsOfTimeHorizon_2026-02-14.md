# Research Note: Clarifying Limitations of Time Horizon

## Metadata
- **Source:** Thomas Kwa, METR
- **Published:** 2026-01-22
- **Processed:** 2026-02-14
- **Type:** Research Note
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-08_to_14/METR_Clarifying-limitations-of-time-horizon.md

---

## Data Points

**DP1:** Time horizon measures amount of serial human labor replaceable with 50% success rate, not independent execution duration; AI models typically complete tasks much faster than humans even on same time horizons.
- **Anchor:** "it's the amount of serial human labor they can replace with a 50% success rate. When AIs solve tasks they're usually much faster"
- **Citation:** (limitations section, first bullet)
- **Tags:** #measurement-framework-reckoning, #model-capabilities

**DP2:** Time horizon estimates carry error margins of approximately 2x in each direction; precise comparisons between models 10-20% apart in capability are not meaningful given measurement uncertainty.
- **Anchor:** "Error bars have historically been a factor of ~2 in each direction... I really have no idea whether Claude's 'true' time horizon is 3.5h or 6.5h"
- **Citation:** (time horizon is not precise section)
- **Tags:** #measurement-framework-reckoning

**DP3:** Time horizon varies across domains by orders of magnitude; software/research tasks show ~4-6 hours whereas visual computer use tasks (poor perception) show 2-5 minute horizons, 40-100x lower.
- **Anchor:** "time horizons are fairly similar for math, but 40-100x lower for visual computer use tasks"
- **Citation:** (time horizon differs between domains section)
- **Tags:** #measurement-framework-reckoning, #model-capabilities

**DP4:** Claude Opus 4.5 real-world coffee-making time horizon is only approximately 2 minutes, indicating massive gap between software-task benchmarks and physical-world task performance.
- **Anchor:** "Claude 4.5 Sonnet's real-world coffee-making time horizon [is] only ~2 minutes"
- **Citation:** (time horizon differs between domains section)
- **Tags:** #measurement-framework-reckoning, #model-capabilities

**DP5:** Task monetary value (proxy for engineer-hours) on SWE-Lancer shows no correlation with model success rates, suggesting benchmark may not capture real-world task distribution properties affecting AI performance.
- **Anchor:** "a task's monetary value...doesn't correlate with a model's success rate"
- **Citation:** (time horizon does not apply to every task distribution section)
- **Tags:** #measurement-framework-reckoning

**DP6:** Benchmark design choices (realism vs diversity vs cost) create inherent selection bias favoring models on tasks solvable within 1-2 years, potentially systematically underestimating capabilities on longer-horizon tasks.
- **Anchor:** "we mostly make tasks that models can't do yet but may be capable of in 1-2 years"
- **Citation:** (benchmark vs real-world task distribution section)
- **Tags:** #measurement-framework-reckoning

**DP7:** Models extensively trained with reinforcement learning on automatically-gradable tasks may overestimate real-world performance on benchmarks that provide perfect feedback, creating distribution mismatch from RLVR training.
- **Anchor:** "anything automatically gradable can be an RL environment, and models are extensively trained using RLVR"
- **Citation:** (benchmark vs real-world task distribution section)
- **Tags:** #measurement-framework-reckoning

**DP8:** Human baseline conventions (baseliner skill level, failed baseline treatment, aggregation method) can adjust measured time horizons by >1.25x, introducing judgment-call uncertainty independent of model performance.
- **Anchor:** "Different conventions around human baseline times could affect time horizon by >1.25x"
- **Citation:** (different conventions section)
- **Tags:** #measurement-framework-reckoning

**DP9:** Converting time horizon estimates to actual work automation requires measuring human overhead (prompting, waiting, verification, manual workaround) using rich data (Cursor logs, screen recordings), not derivable from time horizon metrics alone.
- **Anchor:** "we need to measure how much time a human spends prompting AIs, waiting for generations, checking AI output"
- **Citation:** (50% time horizon section)
- **Tags:** #measurement-framework-reckoning, #adoption-barriers

**DP10:** Reliability-critical tasks (medical, financial, safety-critical) require 98%+ success probabilities regardless of time horizon improvements, limiting automation feasibility for entire task categories.
- **Anchor:** "Some (reliability-critical and poorly verifiable) tasks require 98%+ success probabilities to be worth automating"
- **Citation:** (50% time horizon section)
- **Tags:** #adoption-barriers, #trust-fairness

**DP11:** Time horizon measurements insufficient to extrapolate multi-month/year capabilities; task distribution assumptions produce radically different timelines for automated coder AI (2028-2050 range depending on "Doubling Difficulty Growth Factor").
- **Anchor:** "This parameter, 'Doubling Difficulty Growth Factor', can change the date of the first Automated Coder AI between 2028 and 2050"
- **Citation:** (speculating about effects section)
- **Tags:** #measurement-framework-reckoning, #model-capabilities

---

## Notable Quotes

1. "I still believe in the core results, I believe that many people to some extent both overstate the precision of our time horizon measurements and draw conclusions I don't think the evidence fully supports."

2. "The most important numbers to estimate were the slope of the long-run trend...not the exact time horizon of any particular model."

3. "Most months-long tasks humans do require collaboration...we have no tasks involving multi-turn interaction with a human so there is no right answer."

---

## Initial Observations

Kwa's meta-analysis of METR's own work provides critical epistemological clarity: time horizon provides relative capability comparison (one doubling every 6-7 months) rather than absolute automation feasibility assessment. Key limitations cluster into three categories: measurement uncertainty (2x error bars, domain variance, benchmark selection bias), task distribution mismatch (physical vs virtual, solo vs collaborative, clear vs subjective), and inference gap (time horizon to actual productivity requires human overhead measurement). The reliability requirement ceiling (98%+ for critical tasks) suggests entire categories cannot be automated regardless of time horizon improvements. Most significant finding: months-long real-world tasks require multi-turn human collaboration, while benchmarks measure solo autonomous performance, creating unbridgeable generalization gap. This suggests time horizon improvements beyond 1-month thresholds may have diminishing automation impact if human feedback loops remain essential for extended tasks.
