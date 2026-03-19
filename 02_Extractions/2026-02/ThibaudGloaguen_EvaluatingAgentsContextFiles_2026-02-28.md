# Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?

## Metadata
- **Source:** Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev, Martin Vechev
- **Published:** 2026-02-13
- **Processed:** 2026-02-28
- **Type:** PDF / Research Paper
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-22_to_28/Thibaud-Gloaguen_Evaluating-Agents-md.pdf

---

## Data Points

**DP1:** LLM-generated context files reduce coding agent success rates and increase computational cost simultaneously, contrary to common practice.
- **Anchor:** "context files tend to reduce task success rates compared to providing no repository context, while also increasing inference cost by over 20%"
- **Citation:** (p. 2)
- **Tags:** #agentic-workflows, #measurement-framework-reckoning, #context-file-effectiveness

**DP2:** Developer-written context files provide only marginal performance gains despite being widely recommended in the coding agent community.
- **Anchor:** "developer-provided context files outperform the LLM generated ones for all four agents, despite not being agent-specific, and improve the performance compared to no context files"
- **Citation:** (p. 6)
- **Tags:** #agentic-workflows, #context-file-effectiveness, #specification-bottleneck

**DP3:** The specification and scope of context files matter more than their existence; unnecessarily broad requirements make tasks harder.
- **Anchor:** "we conclude that unnecessary requirements from context files make tasks harder, and human-written context files should describe only minimal requirements"
- **Citation:** (p. 2)
- **Tags:** #specification-bottleneck, #context-file-effectiveness, #agentic-workflows

**DP4:** Context files increase exploration behavior (testing, file reading, reasoning) but this exploration does not translate to task success.
- **Anchor:** "context files lead to increased exploration, testing, and reasoning by coding agents, and as a result, increase costs by over 20%"
- **Citation:** (p. 2)
- **Tags:** #agentic-workflows, #measurement-framework-reckoning, #context-file-effectiveness

**DP5:** Instructions explicitly mentioned in context files are reliably followed by agents across different models and prompts.
- **Anchor:** "we find that agents generally follow instructions present in the context files"
- **Citation:** (p. 7)
- **Tags:** #agentic-workflows, #model-capabilities

**DP6:** Context files are ineffective at providing meaningful repository overviews; agents do not reduce exploration meaningfully when context is available.
- **Anchor:** "context files do not provide effective overviews. One recommendation for context files is to include a codebase overview"
- **Citation:** (p. 6)
- **Tags:** #context-file-effectiveness, #specification-bottleneck

**DP7:** Over 95% of LLM-generated context files across popular repositories are flagged as context file overviews, indicating systematic misuse.
- **Anchor:** "100% of SONNET-4.5-generated context files are flagged for overviews, and 95% and 99% for QWEN-3 30B-CODER and GPT-5.2 respectively"
- **Citation:** (p. 6)
- **Tags:** #context-file-effectiveness, #agentic-testing-infrastructure

**DP8:** The AGENTBENCH benchmark consists of 138 real-world task instances from 12 open-source GitHub repositories containing developer-written context files.
- **Anchor:** "AGENTBENCH instances are sourced from a total of 504 PRs from 12 repositories that meet our criteria, using GPT-5.2 with CODEX"
- **Citation:** (p. 4)
- **Tags:** #agentic-testing-infrastructure, #measurement-framework-reckoning

**DP9:** Context files increase reasoning tokens required by coding agents by 14-22% for LLM-generated and 2-20% for developer-written files.
- **Anchor:** "LLM-generated context files indeed increase the average number of reasoning tokens by 22% for GPT-5.2 and 14% for GPT-5.1 MINI on SWE-BENCH LITE"
- **Citation:** (p. 7)
- **Tags:** #agentic-workflows, #token-economics-competency, #measurement-framework-reckoning

**DP10:** Stronger frontier models do not generate superior context files; this effect is model-invariant.
- **Anchor:** "stronger models do not necessarily generate superior context files. We compare context files generated with GPT-5.2 + CODEX to those created by our standard agents"
- **Citation:** (p. 7)
- **Tags:** #model-capabilities, #context-file-effectiveness

**DP11:** Agent behavior changes with context file presence—more tool calls for file operations and code inspection—but this does not improve success outcomes.
- **Anchor:** "we find that agents run more tests. They also tend to exhaust the repository more (e.g., more thorough testing and file traversal)"
- **Citation:** (p. 7)
- **Tags:** #agentic-workflows, #context-file-effectiveness, #measurement-framework-reckoning

**DP12:** Prompt source has minimal impact on context file effectiveness; sensitivity to different well-designed prompts is generally small.
- **Anchor:** "neither the prompt matching the underlying model and agent, nor a specific prompt performs consistently best, indicating that sensitivity to different (good) prompts is generally small"
- **Citation:** (p. 7-8)
- **Tags:** #specification-bottleneck, #model-capabilities

**DP13:** Coding agents follow repository-specific tool usage patterns documented in context files but lack instruction-following for exploratory behaviors like test-writing.
- **Anchor:** "uv is used almost exclusively if they are mentioned in the context file. This means that instructions in the context files are followed, and that a lack of instruction-following"
- **Citation:** (p. 11)
- **Tags:** #agentic-workflows, #context-file-effectiveness

**DP14:** There is a core tension between developer recommendations for context files and empirical evidence of their limited or counterproductive effects on agent performance.
- **Anchor:** "despite this practice being strongly encouraged by agent developers, there is currently no rigorous investigation of whether such context files are actually effective"
- **Citation:** (p. 1)
- **Tags:** #specification-bottleneck, #context-file-effectiveness, #agentic-testing-infrastructure
