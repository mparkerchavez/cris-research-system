# DP Relevance Map: Measuring Time Horizon Using Claude Code and Codex

**Source File:** METR_MeasuringTimeHorizonUsingClaudeCodeAndCodex_2026-02-14.md
**Map Created:** 2026-02-15
**Total DPs:** 8

---

## Section 1: Measurement Framework Reckoning

**Open Thread #1:** Measurement Framework

### Connected DPs
- **DP1:** Claude Code and Codex scaffolds do not demonstrate superior time horizon performance despite specialized optimization
- **DP2:** Opus 4.5 with Claude Code shows 50.7% bootstrap superiority (minimal difference from ReAct baseline)
- **DP3:** GPT-5 with Codex shows only 14.5% bootstrap superiority (worse than Triframe baseline)
- **DP8:** Specialized scaffolds require extensive domain-specific prompting yet do not proportionally improve autonomous task performance

### Evidence Pattern
The research directly challenges conventional measurement wisdom: specialized, heavily-optimized scaffolds (Claude Code, Codex) tuned for their respective model families produce statistically indistinguishable results from generic scaffolds (ReAct, Triframe) in autonomous time horizon tasks. This undermines the assumption that more sophisticated prompting improves real-world autonomous capability. The finding suggests measurement methodologies must account for context-specificity: interactive vs. autonomous execution produces fundamentally different performance profiles.

### Active Ideas Connected
- **#2 Coordination Tax:** Specialized scaffolds incur overhead (optimization, domain expertise, maintenance) without corresponding performance gains in autonomous contexts
- **#6 2026 Bifurcation:** Clear divergence between interactive workflow optimization (current state) and autonomous execution requirements

---

## Section 2: Autonomous Systems Capability Ceiling

**Open Thread #3:** Multi-Agent Complexity
**Open Thread #4:** Enterprise Timeline Compression

### Connected DPs
- **DP4:** GPT-5 with Codex exhibits poor situational awareness, continuing to address non-existent users post-task completion
- **DP5:** Opus 4.5 with Claude Code demonstrates plan rigidity, failing to replan when encountering suboptimal intermediate solutions
- **DP6:** Opus 4.5 with Claude Code exhibits inefficient resource utilization, exhausting function-call budgets on incomplete workflows

### Evidence Pattern
Qualitative failure modes cluster around three capability deficits: (1) context tracking and task boundary recognition, (2) adaptive planning and course correction, (3) resource optimization and prioritization. These are orthogonal to prompting sophistication and scaffold design. They suggest foundational model limitations in autonomous multi-step reasoning that scaffolds cannot overcome through optimization alone. The failures intensify as autonomy extends: models trained for interactive human feedback (checkpoints, corrections) lack native autonomous judgment.

### Active Ideas Connected
- **#5 Design's Value:** Design choices in scaffolds are improving interactive user experience but not autonomous task execution—different optimizations needed
- **#7 Agent-Native Development:** Current scaffolds were designed for human-in-the-loop workflows; autonomous agentic work requires different architectural assumptions
- **#13 Work Intensification Paradox:** Autonomy requires exhaustive task specification to compensate for poor situational awareness, increasing human upfront planning burden

---

## Section 3: Interactive vs. Autonomous Context Divergence

**Open Thread #2:** Skill Portability

### Connected DPs
- **DP1, DP8:** Specialized scaffolds optimized for model families don't translate to autonomous superiority
- **DP4, DP5, DP6:** Qualitative failures indicate models trained on interactive patterns (human course corrections) perform poorly when fully autonomous

### Evidence Pattern
The research surfaces a critical architectural mismatch: Claude Code and Codex were developed within interactive development workflows where human users actively monitor and redirect agent behavior. Transposing these scaffolds into fully autonomous execution exposes their implicit assumptions about human feedback loops. The continued addressing of non-existent users (DP4), rigid adherence to suboptimal plans (DP5), and poor resource allocation (DP6) all suggest models optimized for "human checkpoint-responsive" behavior rather than "autonomous-complete" behavior.

### Active Ideas Connected
- **#12 Infrastructure-Application Divergence:** Scaffolds (infrastructure) designed for one use case (interactive) don't port to another (autonomous) despite both using same model
- **#1 Tool-Coworker Duality:** Interactive scaffolds embed coworker assumptions (human availability, real-time feedback); autonomous execution requires tool assumptions (complete self-direction)

---

## Section 4: Measurement Methodology Constraints

**Open Thread #1:** Measurement Framework
**Open Thread #5:** Data Quality Economics

### Connected DPs
- **DP7:** Time horizon measurement methodology introduces token budget constraints that may disadvantage more verbose scaffolds; Opus 4.5 with Claude Code showed no plateau at 32M tokens
- **DP2, DP3:** Statistical measurements show near-zero difference at tested scale

### Evidence Pattern
The 32M token budget constraint may artificially compress performance differences by ceiling-ing more efficient approaches while disadvantaging verbose scaffolds. However, absence of plateau in Opus 4.5 with Claude Code suggests the model continues to struggle with task efficiency even when budget is abundant, pointing to fundamental capability limitations rather than measurement artifact. This creates a measurement dilemma: how to distinguish "scaffold inefficiency" from "model limitation" when both depress autonomous performance?

### Active Ideas Connected
- **#2 Coordination Tax:** Token budget constraints introduce false positives (scaffold disadvantage) and false negatives (model capability ceiling misidentification)
- **#11 Data Quality Bottleneck:** Measurement methodology lacks granularity to isolate failure sources (inefficient scaffolds vs. poor model judgment)

---

## Section 5: Model-Scaffold Optimization Mismatch

**Open Thread #1:** Measurement Framework
**Open Thread #10:** Orchestration Consolidation

### Connected DPs
- **DP1, DP8:** Claude Code and Codex explicitly optimized for their respective model families yet produce no performance gains
- **DP3:** GPT-5 with Codex shows 14.5% bootstrap superiority (dramatically underperforms Triframe baseline)

### Evidence Pattern
The inversion in GPT-5 results (Codex worse than generic Triframe) reveals that model-scaffold matching is not monotonic. Codex was presumably optimized for GPT-5, yet produces substantially worse results. This suggests either: (a) GPT-5 is fundamentally misaligned with Codex's design assumptions, (b) optimization occurred in contexts (interactive, specific use cases) that don't generalize to time horizon autonomous execution, or (c) model capability shifts between versions created mismatch with aging scaffold optimization. The finding undermines the "specialized optimization always improves performance" assumption.

### Active Ideas Connected
- **#8 Timeline Collision:** Scaffolds optimized for GPT-4/Codex era assumptions may be actively harmful for GPT-5 deployment due to timing misalignment
- **#6 2026 Bifurcation:** This generation shows clear split: some scaffolds (Claude Code) remain competitive, others (Codex) regress—suggesting architecture-specific viability windows

---

## Section 6: Trust and Observability Implications

**Active Ideas:** #9 Trust Multiplier, #10 Observability Imperative
**Open Thread #9:** Work Intensification Governance

### Connected DPs
- **DP4, DP5, DP6:** Three distinct failure mode categories indicate need for runtime observability
- **DP7:** Token budget constraints limit visibility into failure progression

### Evidence Pattern
The qualitative failure modes (poor situational awareness, plan rigidity, resource mismanagement) are all detectable with appropriate observability: (1) context-tracking telemetry would surface DP4 immediately, (2) intermediate solution quality checkpoints would catch DP5 regressions, (3) function-call accounting would flag DP6 budget exhaustion before task completion. However, the METR study focuses on outcome metrics, not process observability. This gap means autonomous failures happen silently until task completion, creating trust erosion. Enterprises deploying autonomous agents cannot rely on outcome-only metrics; they need runtime visibility into model reasoning quality.

### Active Ideas Connected
- **#10 Observability Imperative:** Autonomous execution requires real-time observability into reasoning quality, plan adaptation, resource utilization—outcome metrics insufficient
- **#9 Trust Multiplier:** Trust in autonomous systems scales with observability of failure modes; without runtime visibility, failures compound silently

---

## Synthesis Notes

This research provides concrete evidence for the **Measurement Framework Reckoning** and **Infrastructure-Application Divergence** threads. The key finding—specialized scaffolds don't outperform generic ones in autonomous execution—challenges the assumption that "more optimization = better performance" and reveals an implicit context dependency (interactive vs. autonomous) that current measurement approaches don't surface. The qualitative failure modes cluster around three foundational autonomous capability gaps that scaffolds cannot overcome through design alone: context tracking, adaptive planning, and resource optimization.

The most actionable implication is that 2026 agent deployment will require fundamentally different evaluation and observability frameworks for autonomous vs. interactive workflows. Current scaffolds conflate both contexts, leading to misaligned optimization efforts.
