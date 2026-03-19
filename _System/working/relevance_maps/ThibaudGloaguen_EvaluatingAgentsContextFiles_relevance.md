# DP Relevance Map: Evaluating AGENTS.md Context Files

**Source:** Thibaud Gloaguen et al., "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?" (2026-02-13)

**Analysis Date:** 2026-02-28

**Total DPs:** 14

---

## 1. Relevant to Active Ideas

| DP# | DP Summary | Relevant Idea(s) | How It Connects |
|-----|-----------|------------------|-----------------|
| DP1, DP4, DP9, DP11 | Context files increase computational cost (20%+) and reasoning tokens (14-22%) without improving success rates; increase exploration behavior without translating to outcomes | **Idea 2: Coordination Tax & Autonomy Paradox** | Demonstrates empirical cost-benefit inversion specific to context coordination. Context files represent "overhead without return" — agents explore more but achieve worse results. This is a manifestation of coordination tax: the mechanism is that agents engage more exploratory behavior (token-expensive) but this exploration doesn't improve task success. The 20%+ cost increase with marginal/negative performance gains is direct evidence of coordination inefficiency in agent scaffolding. |
| DP3, DP6, DP25 | Specification and scope matter more than existence; broad requirements make tasks harder; unnecessary specifications are counterproductive | **Idea 17: Specification Bottleneck** | Core validation of the bottleneck thesis: the problem is not WHETHER to provide context but HOW to specify it. Overbroad context files actively degrade performance by introducing unnecessary constraints. This directly addresses the bottleneck's mechanism: specification precision is the limiting factor, not capability. The finding that "minimal requirements" outperform comprehensive overviews indicates specification quality functions as a complexity gate. |
| DP5, DP13, DP14 | Agents reliably follow explicit instructions in context files; instruction-following for repository-specific patterns is strong but exploratory behavior instruction-following is weak | **Idea 7: Agent-Native Development** | Reveals the instruction-following ceiling: agents follow deterministic, tool-selection instructions (uv usage patterns) reliably but fail at probabilistic exploratory instructions (test-writing behavior). This bifurcates agent-native development requirements: declarative specifications (tools, patterns) work; prescriptive explorations (behaviors, heuristics) don't. Suggests agent-native workflows need to shift toward tool-native patterns rather than behavior-native specifications. |
| DP2, DP10, DP12 | Developer-written context files provide marginal gains; stronger models don't generate superior context files; prompt source has minimal impact on effectiveness | **Idea 8: Timeline Collision** | Evidence that context-file-as-capability-accelerator narrative is false. This is a timeline collision dimension: the industry assumes better models + better context files = better outcomes, but empirical evidence shows this assumption doesn't hold. Stronger models (GPT-5.2) don't generate better context files (DP10). This suggests capability improvements cannot be assumed to transfer to context specification quality — a foundational assumption of scaling may not hold. |
| DP7 | 95-100% of LLM-generated context files are flagged as ineffective overviews across models; systematic misuse pattern | **Idea 4: Core Capability Endures** | Demonstrates a core capability that endures despite agent evolution: manual specification. The finding that 95%+ of LLM-generated context files are systematically flawed while developer-written (minority) context files work suggests human judgment about repository structure is not automatable at current capability levels. This is a persistent human-capability boundary — context file generation resists automation even as agent capabilities scale. |
| DP11 | Agent behavior changes with context (more tool calls, file operations, code inspection) but outcomes don't improve correspondingly | **Idea 1: Tool-Coworker Duality** | Nuances the duality by showing agents respond to contextual cues but don't necessarily translate responses into improved coworker-like judgment. Context files trigger tool-use behavior patterns without improving task judgment — agents become more "tool-like" (following prescribed patterns) rather than "coworker-like" (achieving better outcomes). This reveals a failure mode in context file design: they train agents toward surface behavioral compliance rather than substantive capability improvement. |

---

## 2. Relevant to Open Threads

| DP# | DP Summary | Thread | Connection |
|-----|-----------|--------|-----------|
| DP1, DP4, DP9 | Context files increase cost by 20%+ and reasoning tokens by 14-22% without ROI improvement | **Measurement Framework** | Establishes empirical baseline for agent efficiency costs. The measurement reveals context-file investment doesn't translate to outcome improvement — a critical framework distinction. This quantifies the "exploration tax" as distinct from "coordination tax." |
| DP3, DP6, DP14 | Specification and scope precision matter more than context existence; developer recommendations conflict with empirical evidence | **Specification Bottleneck** | Directly addresses the bottleneck's governance dimension. The 40% marginal improvement for developer-written files versus 20%+ cost for LLM-generated files shows the governance problem: HOW context is specified is the bottleneck, not WHETHER it exists. The developer community's strong recommendation for context files contradicts empirical performance data, revealing a governance window where industry practice hasn't caught up to evidence. |
| DP12 | Prompt source minimally impacts context file effectiveness; sensitivity to different prompts is small | **Skill Portability** | Suggests that context-file effectiveness is largely orthogonal to prompt engineering — the traditional scaling lever. If tweaking prompts doesn't materially improve context file quality, then this dimension of skill isn't portable across prompt variations. This indicates context files may represent a structural (not prompt-engineering-solvable) problem. |
| DP13 | Agents follow deterministic tool instructions reliably but don't self-direct exploratory behaviors from context | **Interactive-to-Autonomous Transfer Gap** | Demonstrates the gap empirically for the context-file domain. Agents succeed with explicit tool specifications (interactive mode — follow this tool) but fail at autonomous exploration instructions. Context files optimize for interactive scenarios (tell me what tools exist) but don't improve autonomous performance (go figure out how to solve this without explicit guidance). |

---

## 3. New Themes (Not Covered by Current Ideas)

| DP# | DP Summary | Proposed Theme |
|-----|-----------|-----------------|
| DP1 | Context files reduce success rates while increasing cost — achieving NEGATIVE ROI | **Context-File Paradox: Capability Drag** — When human-provided structure intended to help agents actually constrains performance, we're observing a new category of agent failure mode. Not coordination tax (multi-agent overhead), not specification bottleneck (unclear specs), but structure-induced drag where the presence of architectural guidance actively degrades agent autonomy. This may generalize: explicit scaffolding for agents may carry inherent drag costs. |
| DP4, DP11 | Context files trigger increased exploration (testing, file reading, reasoning) without outcome improvement; agents explore more but achieve less | **Exploration Decoupling** — Agent exploration behavior decouples from outcome improvement. Traditional software engineering assumes more thorough exploration (more tests, more file reads) correlates with better outcomes. Agents break this assumption: they can be prompted into high-exploration, high-cost behaviors that produce no outcome gains. This suggests agent exploration is not self-correcting like human exploration; agents can waste effort systematically. |
| DP7 | 95-100% of LLM-generated context files across major open-source repositories are systematically flawed | **LLM Context Generation Ceiling** — LLMs cannot generate effective software context documents. This is not a "better prompting" problem; it's a fundamental capability ceiling. Across three different LLM architectures (SONNET-4.5, QWEN-3 30B-CODER, GPT-5.2), the failure rate approaches 100%. This suggests that software context document generation requires human domain knowledge that doesn't transfer via LLM scaling. |
| DP2 | Developer-written context files provide marginal (not transformative) improvements; the gains are 6-12 percentage points, not 30%+ | **Marginal-Utility Ceiling for Context Files** — Even optimal context files (developer-written) provide modest performance gains. If human specialists crafting context files can only unlock 6-12% improvement, this suggests the context-file approach has exhausted its utility frontier. The ROI of context engineering plateaus at modest levels regardless of quality. |

---

## 4. Not Relevant (with reasoning)

| DP# | Why Not Relevant |
|-----|-----------------|
| DP8 | AGENTBENCH benchmark description (methodology detail) — informative for reproducibility but not directly connected to active research dimensions. Used for validation, not theory development. |

---

## 5. Coverage Summary

- **Total DPs in source:** 14
- **Relevant to ideas:** 11 DPs (79%)
- **Relevant to threads:** 4 DPs (29%, allows overlap)
- **New themes:** 4
- **Not relevant:** 1 DP (7%)

**Coverage Assessment:** HIGH (79% direct relevance, plus strong new-theme contributions)

---

## 6. Critical Patterns and Strategic Implications

### A. The Context-File Failure Mode

This source documents a critical failure mode in agent scaffolding: context files represent well-intentioned structure that systematically degrades agent performance. This is NOT a "poor implementation" problem (DP12 shows prompt source doesn't matter; DP10 shows model strength doesn't help). It is structural: the presence of context files triggers expensive exploration behaviors without compensating outcome improvement.

The strategic implication is that the current agent development community's strong recommendation for context files (documented as "despite this practice being strongly encouraged by agent developers") is **empirically indefensible**. This represents a governance gap where industry best practice contradicts measured evidence. This is precisely where Specification Bottleneck (Idea 17) manifests: the development community cannot articulate WHAT makes context files work because, fundamentally, in their current form, they don't.

### B. Convergence with Coordination Tax

This source provides a micro-scale validation of the Coordination Tax thesis (Idea 2). Where Google DeepMind showed multi-agent coordination yields negative returns above 45% baseline, Gloaguen et al. show context-file scaffolding yields negative returns in terms of cost-to-outcome ratio. Both represent cases where organizational structure intended to improve performance actually increases costs without corresponding benefit. The mechanism differs (multi-agent overhead vs. exploration drag), but the pattern is identical: structure-induced inefficiency.

This convergence suggests a broader principle: **agents resist top-down structural coordination**. Whether it's multi-agent teams or context files, imposed structure creates overhead without proportional outcome improvement. The implication: agent-native architectures may require LESS structure, not more.

### C. The LLM Context Generation Ceiling

The finding that 95-100% of LLM-generated context files are ineffective across three different model families (including frontier models) is significant because it reveals a capability ceiling that doesn't improve with model scaling. This directly challenges the scaling narrative underlying Timeline Collision (Idea 8): better models should generate better context files, but they don't. This is evidence of a task that resists LLM scaling—a boundary where human domain knowledge doesn't transfer.

The strategic implication: some dimensions of software development (context specification, architectural documentation) may remain stubbornly human-dependent despite general capability improvements in language models. This validates Core Capability Endures (Idea 4) in the specific domain of repository context specification.

### D. The Agent-Native Development Bifurcation

DP5 and DP13 reveal a bifurcation in agent instruction-following: agents reliably follow deterministic tool specifications (which tool to use) but fail at prescriptive exploratory behaviors (how to explore). This suggests Agent-Native Development (Idea 7) requires a fundamental architectural shift: move FROM behavior specification (describe how agents should explore) TO tool specification (declare what tools agents have access to).

The implication: agent-native development is not "old development with better AI." It requires reimagining how we specify agent behavior. Instead of behavioral specifications (exploratory heuristics, search strategies), we need tool-native specifications (available tools, tool signatures, tool dependencies). This is a paradigm shift for software engineering practice.

### E. The Exploration Decoupling Problem

A new strategic insight emerges: agent exploration behavior can decouple from outcome improvement. Agents can be prompted into expensive exploration (more tests, more file reads) that produces no outcome gains. This is fundamentally different from human behavior: humans exploring more generally improve outcomes. With agents, this assumption breaks.

The implication: measurement frameworks must distinguish between agent activity (exploration, reasoning) and agent outcomes (task completion). Traditional metrics conflate these (more thorough exploration assumed to correlate with success). For agents, this correlation may be arbitrary or even inverted. This is a critical adjustment to Measurement Framework (open thread): we need outcome-focused metrics that don't credit activity.

### F. Tension with Coworker Duality

There's a strategic tension here with Tool-Coworker Duality (Idea 1). Agents that reliably follow tool-specific instructions (DP5, DP13) are acting more "tool-like" (deterministic, pattern-following). Agents that fail at exploratory behavior instructions are failing to act "coworker-like" (adaptive, self-directed). Context files amplify the tool-like dimension without unlocking coworker-like capabilities. This suggests the duality may have a directional asymmetry: agents can be forced toward tool-like behavior more easily than toward coworker-like autonomy.

---

## Strategic Recommendation for Integration

**High Priority:** This source should directly inform Specification Bottleneck (Idea 17) evolution. The finding that developer-written context files work marginally better despite being no-agent-specific suggests the bottleneck is not "more data" but "clearer constraints." The next research question: can we reverse-engineer what makes developer-written context files (marginally) effective and codify it?

**Secondary Integration:** This source strengthens Coordination Tax (Idea 2) by providing evidence that structure-induced inefficiency is not limited to multi-agent domains. It's a broader principle of agent architecture.

**Tension to Monitor:** The strong industry recommendation for context files despite empirical evidence of their ineffectiveness creates a genuine governance blind spot (Idea 3 dimension). This is where adoption bifurcation (Idea 6) may manifest: frontier organizations abandon context files after evidence; lagging organizations continue because of accumulated best-practice momentum.

