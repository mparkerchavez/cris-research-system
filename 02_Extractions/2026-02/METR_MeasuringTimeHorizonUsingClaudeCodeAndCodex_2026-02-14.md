# Research Note: Measuring Time Horizon Using Claude Code and Codex

## Metadata
- **Source:** Nikola Jurkovic, METR
- **Published:** 2026-02-13
- **Processed:** 2026-02-14
- **Type:** Research Note
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-08_to_14/METR_Measuring-Time-Horizon-using-Claude-Code-and-Codex.md

---

## Data Points

**DP1:** Claude Code and Codex scaffolds do not demonstrate superior time horizon performance compared to baseline measurement systems despite specialized optimization for their respective model families.
- **Anchor:** "neither Claude Code nor Codex outperform the default scaffolds METR uses"
- **Citation:** (Summary section)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

**DP2:** Bootstrap statistical sampling shows Opus 4.5 with Claude Code outperforms ReAct baseline in 50.7% of test iterations, suggesting minimal practical difference between scaffold approaches.
- **Anchor:** "Claude Code beats ReAct in 50.7% of bootstrap samples"
- **Citation:** (Results section)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

**DP3:** GPT-5 with Codex demonstrates substantially worse performance than Triframe baseline, with only 14.5% bootstrap sample superiority, indicating potential model-scaffold mismatch.
- **Anchor:** "Codex beats Triframe in 14.5% of bootstrap samples"
- **Citation:** (Results section)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

**DP4:** GPT-5 with Codex exhibits poor situational awareness by continuing to address non-existent users at task completion, indicating distribution shift from interactive to autonomous deployment.
- **Anchor:** "GPT-5 with Codex writes a short report about its work, saying things like 'If you want, I can also commit these changes to git'"
- **Citation:** (Qualitative impressions section)
- **Tags:** #model-capabilities, #autonomous-systems

**DP5:** Opus 4.5 with Claude Code demonstrates over-commitment to initial plans without adaptive replanning when encountering sub-optimal intermediate solutions.
- **Anchor:** "It only realized that its solution wasn't very good at step 4. It submitted its suboptimal solution instead of going back"
- **Citation:** (Qualitative impressions section)
- **Tags:** #model-capabilities, #autonomous-systems

**DP6:** Opus 4.5 with Claude Code exhibits inefficient resource utilization by exhausting limited function-call budgets with incomplete data collection and reporting workflows.
- **Anchor:** "Opus 4.5 with Claude Code wasted most of its attempt using an automated script and forgot to print out the results"
- **Citation:** (Qualitative impressions section)
- **Tags:** #model-capabilities, #autonomous-systems

**DP7:** Time horizon measurement methodology introduces token budget constraints that may disadvantage more verbose scaffolds; Opus 4.5 with Claude Code showed no plateau even at 32M token budget.
- **Anchor:** "I was somewhat worried about the relative lack of a plateau for Opus 4.5 with Claude Code"
- **Citation:** (Limitations section)
- **Tags:** #measurement-framework-reckoning, #infrastructure

**DP8:** Specialized scaffolds like Claude Code and Codex require extensive domain-specific prompting and optimization that generic scaffolds do not, yet do not proportionally improve autonomous task performance.
- **Anchor:** "Codex and Claude Code have been explicitly optimized for their respective model families, while ReAct and Triframe are general scaffolds"
- **Citation:** (Main differences section)
- **Tags:** #model-capabilities, #measurement-framework-reckoning

---

## Notable Quotes

1. "Those scaffolds are mostly used in an interactive setting, where a human user often checks in on the agent's work. In contrast, agents perform our time horizon tasks autonomously."

2. "Neither the GPT-5 time horizon difference, nor the Opus 4.5 time horizon difference, are statistically significant."

3. "Our wrappers of the Codex and Claude Code scaffolds are still rough around the edges."

---

## Initial Observations

METR's measurement methodology reveals important gap between specialized scaffolds optimized for interactive coding workflows and autonomous task execution contexts. The research demonstrates that prompting sophistication and model-specific optimization do not necessarily translate to improved time horizon metrics in fully autonomous settings. Both qualitative failure modes (poor situational awareness, plan rigidity, resource mismanagement) and statistical results suggest specialized scaffolds may be optimized for human-in-the-loop interactive patterns rather than extended autonomous operation. This finding has implications for understanding the actual autonomous capability ceiling of current models versus their performance in interactive settings where users provide mid-task course corrections.
