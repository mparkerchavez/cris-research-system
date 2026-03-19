# Vercel: AGENTS.md Outperforms Skills in Agent Evals

## Metadata
- **Source:** Vercel
- **Published:** January 27, 2026
- **Processed:** 2026-02-06
- **Type:** Article
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-01_to_07/Vercel_AGENTS.md-outperforms-skills-in-our-agent-evals.md

---

## Data Points

**DP1:** Passive context embedding achieves superior performance over active retrieval tools
- **Anchor:** "compressed 8KB docs index embedded directly in AGENTS.md achieved a 100% pass rate"
- **Citation:** (para. 2)
- **Tags:** #agentic-workflows, #product-strategy, #capability-overhang

**DP2:** Active skill-based approaches suffer from unreliable invocation despite availability
- **Anchor:** "In 56% of eval cases, the skill was never invoked. The agent had access"
- **Citation:** (para. 7)
- **Tags:** #agentic-complexity-barriers, #model-capabilities, #deployment-bottleneck

**DP3:** Explicit instruction wording produces fragile and unpredictable behavioral variation
- **Anchor:** "Different wordings produced dramatically different results"
- **Citation:** (para. 12)
- **Tags:** #agentic-complexity-barriers, #measurement-framework-reckoning, #model-capabilities

**DP4:** Knowledge freshness gap drives adoption of documentation-based approaches
- **Anchor:** "Next.js 16 introduces APIs like 'use cache', connection(), and forbidden() that aren't in current model training data"
- **Citation:** (para. 4)
- **Tags:** #model-capabilities, #capability-overhang, #use-case-development

**DP5:** Context window efficiency enables comprehensive documentation within practical constraints
- **Anchor:** "compressed it down to 8KB (an 80% reduction) while maintaining the 100% pass rate"
- **Citation:** (para. 18)
- **Tags:** #product-strategy, #agentic-workflows, #deployment-bottleneck

**DP6:** Removal of agent decision-making improves reliability and consistency
- **Anchor:** "No decision point. With AGENTS.md, there's no moment where the agent must decide"
- **Citation:** (para. 21)
- **Tags:** #agentic-complexity-barriers, #cognitive-offloading, #model-capabilities

**DP7:** System prompt integration provides consistent availability superior to asynchronous tool loading
- **Anchor:** "AGENTS.md content is in the system prompt for every turn"
- **Citation:** (para. 22)
- **Tags:** #agentic-workflows, #product-strategy, #model-capabilities

**DP8:** Retrieval-led reasoning instruction overrides pre-training-based pattern generation
- **Anchor:** "Prefer retrieval-led reasoning over pre-training-led reasoning for any Next.js tasks"
- **Citation:** (para. 16)
- **Tags:** #model-capabilities, #cognitive-offloading, #capability-overhang

**DP9:** Evaluation methodology significantly impacts conclusions about agent capability effectiveness
- **Anchor:** "removed test leakage, resolving contradictions, and shifting to behavior-based assertions"
- **Citation:** (para. 14)
- **Tags:** #measurement-framework-reckoning, #roi-measurement, #use-case-development

**DP10:** Skills and passive documentation serve complementary rather than competitive roles
- **Anchor:** "Skills work better for vertical, action-specific workflows that users explicitly trigger"
- **Citation:** (para. 28)
- **Tags:** #product-strategy, #use-case-development, #agentic-workflows

**DP11:** Agent tool invocation remains a fundamental limitation in current model architectures
- **Anchor:** "Agents not reliably using available tools is a known limitation of current models"
- **Citation:** (para. 8)
- **Tags:** #model-capabilities, #agentic-complexity-barriers, #deployment-bottleneck

**DP12:** Ordering and sequencing decisions in tool-based approaches introduce unexpected behavioral fragility
- **Anchor:** "Skills create sequencing decisions (read docs first vs. explore project first)"
- **Citation:** (para. 23)
- **Tags:** #agentic-complexity-barriers, #cognitive-offloading, #measurement-framework-reckoning

**DP13:** Framework authors should prioritize documentation provisioning over waiting for tool improvements
- **Anchor:** "Don't wait for skills to improve. The gap may close as models get better"
- **Citation:** (para. 31)
- **Tags:** #vendor-strategy, #adoption-barriers, #product-strategy

**DP14:** Distributed retrieval patterns enable scalable documentation integration without context bloat
- **Anchor:** "The agent knows where to find docs without having full content in context"
- **Citation:** (para. 19)
- **Tags:** #agentic-workflows, #product-strategy, #deployment-bottleneck

---

## Notable Quotes

> "A compressed 8KB docs index embedded directly in AGENTS.md achieved a 100% pass rate, while skills maxed out at 79% even with explicit instructions telling the agent to use them." (para. 2)

> "This fragility concerned us. If small wording tweaks produce large behavioral swings, the approach feels brittle for production use." (para. 13)

> "The 'dumb' approach (a static markdown file) outperformed the more sophisticated skill-based retrieval, even when we fine-tuned the skill triggers." (para. 24)

> "The goal is to shift agents from pre-training-led reasoning to retrieval-led reasoning. AGENTS.md turns out to be the most reliable way to make that happen." (para. 36)

---

## Initial Observations

This case study from Vercel presents a counterintuitive finding that challenges prevailing assumptions about intelligent tool design in agentic systems. The research demonstrates that passive information embedding significantly outperforms active retrieval mechanisms—a 100% pass rate versus 79% with explicit instructions and 53% with default tool behavior. This suggests that current LLMs still struggle fundamentally with the metacognitive task of deciding when and how to use available tools, contradicting the often-optimistic trajectory expected for agentic capabilities. The fragility of the instruction-wording experiment (where subtle changes in phrasing produced dramatically different agent behaviors) points to a deeper issue: agent behavior remains sensitive to minute variations in prompt engineering, indicating that agentic reliability may require more structural solutions than incremental model improvements.

The compression strategy—reducing documentation from 40KB to 8KB while maintaining 100% performance—reveals important architectural insights about context efficiency and retrieval-led design. Rather than embedding full documentation, the compressed index creates a directory structure that agents can reference, shifting the burden from context optimization to structured information architecture. This approach aligns with cognitive offloading patterns where agents defer to external resources rather than relying on training data, addressing the fundamental mismatch between model knowledge cutoffs and rapidly evolving frameworks like Next.js 16.

The complementary positioning of skills and AGENTS.md suggests maturation in how framework authors should think about agent integration: passive documentation serves horizontal knowledge needs, while skills address vertical workflows. This layered approach may indicate a broader pattern in agent adoption—that passive, always-available context becomes foundational infrastructure while active tools serve specialized use cases. The clear recommendation not to wait for skills to improve implies acknowledgment that the gap between current model capabilities and desired tool invocation behavior may persist longer than initially expected, supporting a pragmatic focus on what demonstrably works now.

