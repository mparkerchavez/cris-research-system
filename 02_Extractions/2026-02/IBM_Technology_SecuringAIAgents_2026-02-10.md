# Securing AI Agents with Zero Trust

## Metadata
- **Source:** IBM Technology
- **Published:** 2026-02-10
- **Processed:** 2026-02-10
- **Type:** Video Transcript
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-08_to_14/IBM-Technology_Securing-AI-Agents-Zero-Trust_2026-02-10.md

---

## Data Points

**DP1:** Agentic AI systems introduce exponentially expanded attack surfaces through API interactions, tool integrations, and autonomous sub-agent creation.
- **Anchor:** "Agents can talk to APIs, call tools, buy things, move data, create sub-agents"
- **Citation:** (para. 15)
- **Tags:** #cybersecurity, #risk-governance, #agentic-workflows

**DP2:** Zero Trust principles are foundational to agentic AI security rather than vendor marketing terminology.
- **Anchor:** "Solid, even game-changing security principles worth holding on to"
- **Citation:** (para. 17)
- **Tags:** #cybersecurity, #risk-governance, #trust-fairness

**DP3:** Core Zero Trust principle: verification precedes trust, requiring authentication before access grant.
- **Anchor:** "Verify then you trust, trust follows verification"
- **Citation:** (para. 19)
- **Tags:** #cybersecurity, #risk-governance, #trust-fairness

**DP4:** "Just in time" access provisioning replaces "just in case" preparation to enforce least privilege principles.
- **Anchor:** "Give access rights needed only when needed and not longer than needed"
- **Citation:** (para. 19)
- **Tags:** #cybersecurity, #risk-governance, #governance

**DP5:** Pervasive security controls throughout systems replace perimeter-based (hard outside/soft inside) models.
- **Anchor:** "Move from perimeter controls to pervasive set of security controls"
- **Citation:** (para. 21)
- **Tags:** #cybersecurity, #risk-governance, #infrastructure

**DP6:** "Assumption of breach" mindset requires designing security as if adversaries have existing elevated access.
- **Anchor:** "Assume bad guy already in system, database, has elevated privileges"
- **Citation:** (para. 21)
- **Tags:** #cybersecurity, #risk-governance, #threat-modeling

**DP7:** Non-Human Identities (NHIs) for agents require same control and visibility levels as human users, potentially with additional oversight.
- **Anchor:** "AI agent using non-human identity, proliferation of these things growing"
- **Citation:** (para. 29)
- **Tags:** #cybersecurity, #agentic-workflows, #governance

**DP8:** Agent training data, augmentation data, and preference information all require security verification against tampering.
- **Anchor:** "Data may be basis for AI agent, need to make sure all secured, not tampered"
- **Citation:** (para. 31)
- **Tags:** #cybersecurity, #data-quality, #risk-governance

**DP9:** Agent intention verification must ensure autonomous actions align with original user intent.
- **Anchor:** "Look at intentions of agent, make sure intentions match user's intentions"
- **Citation:** (para. 31)
- **Tags:** #cybersecurity, #trust-fairness, #agentic-workflows

**DP10:** Direct prompt injection represents primary threat vector for agentic systems.
- **Anchor:** "Send prompt in to break context, have it do things not supposed to do"
- **Citation:** (para. 35)
- **Tags:** #cybersecurity, #data-privacy, #agentic-workflows

**DP11:** Model poisoning and preference data manipulation represent secondary attack vectors.
- **Anchor:** "Manipulate policy, preference information, poison data or poison training model"
- **Citation:** (para. 35)
- **Tags:** #cybersecurity, #data-quality, #risk-governance

**DP12:** Interface compromise (including MCP calls) enables direct attacker insertion into agent action flows.
- **Anchor:** "Insert myself at any of these interfaces, place where could do damage"
- **Citation:** (para. 35)
- **Tags:** #cybersecurity, #agentic-workflows, #risk-governance

**DP13:** Credential compromise and privilege escalation through stolen credentials represent critical attack paths.
- **Anchor:** "Copy credentials, log into system, create new accounts, increase privilege"
- **Citation:** (para. 37)
- **Tags:** #cybersecurity, #risk-governance, #governance

**DP14:** Unique, dynamic credentials per agent prevent static embedding and enable just-in-time provisioning.
- **Anchor:** "Unique credentials for every agent, every user, and agents those agents create"
- **Citation:** (para. 39)
- **Tags:** #cybersecurity, #governance, #risk-governance

**DP15:** Embedded credentials in code represent critical security violation requiring centralized, dynamic credential vaults.
- **Anchor:** "Password, API key embedded directly in code is absolute no-no"
- **Citation:** (para. 40)
- **Tags:** #cybersecurity, #data-privacy, #governance

**DP16:** Tool registry verification ensures only security-vetted APIs, databases, and tools are available to agents.
- **Anchor:** "Tool registry where verified secure APIs, databases, tools we can trust"
- **Citation:** (para. 42)
- **Tags:** #cybersecurity, #governance, #risk-governance

**DP17:** AI firewall/gateway enforcement layer inspects agent inputs and outputs for prompt injection and data exfiltration.
- **Anchor:** "AI firewall or AI gateway look over it all, see if improper inputs"
- **Citation:** (para. 44)
- **Tags:** #cybersecurity, #agentic-workflows, #governance

**DP18:** Immutable logging enables post-incident forensics and prevents attacker log tampering.
- **Anchor:** "Logging immutable logs, can't be changed by bad guy"
- **Citation:** (para. 46)
- **Tags:** #cybersecurity, #risk-governance, #governance

**DP19:** Comprehensive vulnerability scanning across networks, endpoints, and AI models identifies latent security weaknesses.
- **Anchor:** "Tools now scan AI models, look for vulnerabilities hiding inside"
- **Citation:** (para. 46)
- **Tags:** #cybersecurity, #governance, #risk-governance

**DP20:** Human-in-the-loop controls including kill switches, throttling, and canary deployments prevent autonomous runaway scenarios.
- **Anchor:** "Kill switch if running out of control, throttles, canary deployments"
- **Citation:** (para. 48)
- **Tags:** #cybersecurity, #risk-governance, #governance

---

## Notable Quotes

1. "Every new capability adds a new attack surface" — Exponential security complexity growth with agent capabilities
2. "Design your security assuming you've been breached already" — Assumption of breach paradigm
3. "Agentic AI multiplies power and risk" — Dual amplification thesis
4. "Every agent must prove who it is, justify what it wants, earn trust continuously" — Continuous verification requirement

---

## Initial Observations

This transcript addresses a critical and under-recognized gap in agentic AI deployment: security architecture for autonomous systems with extended capabilities. Key themes include:

1. **Attack Surface Explosion**: Unlike traditional systems with discrete entry points, agentic systems create multiplicative attack surfaces through API integrations, tool availability, and autonomous sub-agent spawning. Each capability expansion directly increases exploit vectors.

2. **Zero Trust Repositioning**: The speaker reframes Zero Trust as a mature security framework (not marketing hype) specifically designed for exactly this problem—systems with complex, autonomous components and distributed access requirements.

3. **Identity Proliferation Problem**: Non-Human Identities (NHIs) create management complexity that traditional identity systems weren't designed for. Agents may require hundreds of ephemeral credentials with varying privilege levels.

4. **Data Integrity Dependencies**: Agent security depends on training data, augmentation data, and preference information integrity—expanding the security perimeter to include ML governance and data provenance verification.

5. **Prompt Injection as Primary Threat**: Unlike traditional software injection attacks, prompt injection is uniquely enabled by LLM architectures and represents the most direct attack vector on agent behavior.

6. **Intention Verification Gap**: The critical unsolved problem is verifying that autonomous agent actions align with intended user outcomes. Current tooling lacks robust intention-action alignment verification beyond logging post-hoc.

7. **Credential Management Transformation**: The speaker emphasizes that static credentials (developer anti-pattern) are unacceptable in agentic systems, requiring shift to dynamic, auditable credential vaults with automatic revocation.

8. **Human Control Requirements**: Despite autonomy, human kill switches, throttling, and canary deployments remain essential—acknowledging that autonomous behavior oversight remains operationally necessary.

This represents a critical infrastructure/governance gap in current agentic AI deployment—most organizations lack the credential management, tool verification, and intention-verification frameworks described as necessary.
