# DP Relevance Map: IBM Technology - Securing AI Agents with Zero Trust

## Relevant to Active Ideas

| DP# | DP Summary | Relevant Idea(s) | How It Connects |
|-----|-----------|-------------------|-----------------|
| DP1 | Agents expand attack surfaces through APIs, tools, sub-agents | #2 Coordination Tax and Autonomy Paradox | Coordination overhead (sub-agent creation, tool integration) creates security tax that reduces net autonomy benefits |
| DP2 | Zero Trust as game-changing security principle | #9 Trust Multiplier and Authenticity Crisis | Trust requires verification infrastructure; proprietary/open-source divergence likely at Zero Trust implementation level |
| DP3 | Verify then trust (continuous verification model) | #9 Trust Multiplier and Authenticity Crisis | Trust becomes renewable through continuous verification, not one-time authentication |
| DP4 | Just-in-time access replaces just-in-case provisioning | #2 Coordination Tax and Autonomy Paradox | Privilege management overhead compounds coordination complexity; autonomy vs security tradeoff |
| DP5 | Pervasive controls replace perimeter models | #10 Observability Imperative | Observability becomes architectural requirement, not optional; all agent actions visible |
| DP6 | Assumption of breach (defensive posture) | #10 Observability Imperative | Required observability: system design must assume observation/logging at every interface |
| DP7 | Non-Human Identities (NHIs) require same control as humans | #10 Observability Imperative | NHI proliferation creates observability scaling challenge; identity explosion without governance |
| DP8 | Agent training data, augmentation, preference info must be verified | #11 Data Quality as Strategic Bottleneck | Data integrity as security dependency elevates data quality from operational to security-critical concern |
| DP9 | Intention verification ensures agent actions match user intent | #10 Observability Imperative | Intention-action alignment requires observability infrastructure for forensic verification |
| DP14 | Dynamic credentials per agent enable just-in-time provisioning | #10 Observability Imperative | Credential management requires observable audit trail; every credential generation/revocation logged |
| DP16 | Tool registry verification (security-vetted APIs/databases) | #10 Observability Imperative | Curated tool ecosystem requires ongoing verification observability |
| DP17 | AI firewall/gateway enforcement for prompt injection + data exfiltration | #10 Observability Imperative | Gateway layer enforces observable boundary; all agent inputs/outputs subject to inspection |
| DP18 | Immutable logging for forensics + breach prevention | #10 Observability Imperative | Immutability requirement makes observability an immutable safety requirement |
| DP20 | Human-in-the-loop controls (kill switch, throttling, canary) | #2 Coordination Tax and Autonomy Paradox | Human oversight overhead directly reduces claimed autonomy benefits; governance tax on agent autonomy |

## Relevant to Open Threads

| DP# | DP Summary | Thread | Connection |
|-----|-----------|--------|------------|
| DP1 | API interactions, tool integrations create multiplicative surfaces | Thread 3: Multi-Agent Complexity Ceiling | Attack surface explosion mirrors coordination complexity; multi-agent security scales non-linearly |
| DP7 | NHI proliferation problem | Thread 3: Multi-Agent Complexity Ceiling | Identity management becomes bottleneck; dozens/hundreds of ephemeral agent credentials create governance scaling wall |
| DP15 | Embedded credentials as anti-pattern | Thread 5: Data Quality Economics | Credential security requires centralized vaults; organizational practice change needed across enterprises |

## New Themes (Not Covered by Current Ideas)

| DP# | DP Summary | Proposed Theme |
|-----|-----------|----------------|
| DP10 | Direct prompt injection as primary threat vector | **Prompt Injection as Existential Agent Threat** — LLM-specific vulnerability unique to agentic systems; requires new defensive frameworks distinct from traditional software security |
| DP11 | Model poisoning + preference data manipulation | **AI Model Supply Chain Security** — Training data and preference manipulation represent supply chain vulnerabilities distinct from traditional code supply chain attacks |
| DP12 | Interface compromise enabling direct attacker insertion | **Agent Orchestration Layer as Attack Surface** — Coordination mechanisms between agents become attack targets; multi-agent architectures create new vulnerability classes |
| DP13 | Credential compromise through stolen credentials | **Dynamic Ephemeral Credential Management** — Static credential anti-pattern requires shift to dynamic, short-lived, agent-specific credentials; significant operational overhead |
| DP19 | Comprehensive vulnerability scanning including AI models | **AI Model Vulnerability Scanning** — Scanners now detect vulnerabilities inside trained models themselves; new testing domain alongside traditional code scanning |

## Not Relevant (with reasoning)

| DP# | Why Not Relevant |
|-----|------------------|
| DP2 | Zero Trust as marketing rebranding assertion | General framing statement; doesn't address specific agent security mechanisms or architectural requirements |

## Coverage Summary
- **Total DPs in source:** 20
- **Relevant to ideas:** 14
- **Relevant to threads:** 3
- **New themes:** 5
- **Not relevant:** 1

## Key Patterns

### Observability as Foundational Architecture
Every DP mapping to "Observability Imperative" reveals that agent security is observability architecture by other name. Zero Trust requires:
- All identity flows visible (NHI tracking)
- All action attempts inspected (gateway enforcement)
- All outcomes auditable (immutable logging)
- All credentials traceable (dynamic management)

This validates observability as prerequisite for governance, not optional instrumentation.

### Coordination Tax Materialized as Security Tax
The coordination overhead (sub-agent creation, API integration) directly increases attack surface. Just-in-time provisioning and human kill switches represent operational tax on autonomy—confirming autonomy paradox thesis with security justification.

### New Vulnerability Classes Require New Frameworks
Prompt injection, model poisoning, and supply chain manipulation represent LLM-specific threats distinct from traditional software security. Organizations cannot adopt agentic systems without building new security competencies (intent verification, model scanning, preference data verification).

### Intention-Action Gap as Security-Critical Problem
The emphasis on intention verification reveals fundamental gap: organizations lack frameworks to verify that autonomous agent actions align with intended user outcomes. This is both a governance problem (observability) and a trust problem (authenticity).

### Identity Management at Scale
NHI proliferation (potential hundreds of ephemeral agent credentials) creates governance scaling wall. Traditional IAM systems designed for human-scale identity (thousands) cannot manage agent-scale identity (millions) without architectural redesign.

## Critical Gaps

The report identifies security requirements but acknowledges incomplete solutions for:
1. **Intention verification** — How to verify agent actions match user intent beyond post-hoc logging
2. **Model poisoning detection** — How to verify training data hasn't been compromised
3. **Prompt injection prevention** — How to prevent or reliably detect prompt injection attacks

These gaps suggest 2026 will see significant investment in agent security infrastructure, creating temporary competitive advantage for early movers.

---

## Source Quality Assessment
- **Coverage:** 20 data points spanning threat vectors, defensive architectures, and control mechanisms
- **Format:** Technical architecture guidance from security expert (IBM Technology)
- **Relevance:** High relevance to observability thesis and autonomy paradox; identifies security as gating constraint on agent deployment
- **Tone:** Pragmatic security architecture guidance; acknowledges immaturity of some solutions
- **Gaps:** Limited discussion of cost-benefit tradeoffs between security overhead and autonomy gains; no quantified security tax calculations
