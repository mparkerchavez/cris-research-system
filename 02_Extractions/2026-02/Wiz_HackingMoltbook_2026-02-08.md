# Wiz Research: Hacking Moltbook - The AI Social Network Any Human Can Control

## Metadata
- **Source:** Wiz Research (Gal Nagli)
- **Published:** 2026-02-02
- **Processed:** 2026-02-08
- **Type:** Security Research Article
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-01_to_07/Wiz_Hacking-Moltbook.md

---

## Data Points

**DP1:** Vibe-coded applications systematically expose API credentials in client-side code
- **Anchor:** "API keys and secrets frequently end up in frontend code, visible to anyone who inspects the page source"
- **Citation:** (Discovery of Exposed Supabase Credentials section)
- **Tags:** #cybersecurity, #data-privacy, #deployment-bottleneck

**DP2:** Supabase databases without Row Level Security grant full administrative access via public API keys
- **Anchor:** "without RLS policies, this key grants full database access to anyone who has it"
- **Citation:** (Discovery of Exposed Supabase Credentials section)
- **Tags:** #cybersecurity, #risk-governance, #agentic-security-tradeoff

**DP3:** Moltbook database exposure included 1.5 million API tokens, 35,000 emails, and 4,060 private messages
- **Anchor:** "1.5 million API authentication tokens, 35,000 email addresses, and private messages between agents"
- **Citation:** (Executive Summary)
- **Tags:** #data-privacy, #cybersecurity, #trust-fairness

**DP4:** Agent authenticity illusion: 88:1 agent-to-human ratio reveals bot farms, not autonomous AI
- **Anchor:** "only 17,000 human owners behind them - an 88:1 ratio"
- **Citation:** (Executive Summary)
- **Tags:** #trust-fairness, #agentic-workflows, #vendor-strategy

**DP5:** Platform lacked mechanisms to verify whether "agents" were AI or humans with scripts
- **Anchor:** "The platform had no mechanism to verify whether an 'agent' was actually AI or just a human with a script"
- **Citation:** (Executive Summary)
- **Tags:** #trust-fairness, #risk-governance, #agentic-workflows

**DP6:** Anyone could register millions of agents with simple loop and no rate limiting
- **Anchor:** "Anyone could register millions of agents with a simple loop and no rate limiting"
- **Citation:** (Executive Summary)
- **Tags:** #cybersecurity, #risk-governance, #agentic-workflows

**DP7:** Vibe coding practice explicitly disclaimed writing code: founder vision, AI implementation
- **Anchor:** "I didn't write a single line of code for @moltbook. I just had a vision for the technical architecture"
- **Citation:** (Executive Summary)
- **Tags:** #skill-formation, #deployment-bottleneck, #vendor-strategy

**DP8:** Complete account takeover possible via exposed authentication tokens for every registered agent
- **Anchor:** "api_key - Full authentication token allowing complete account takeover"
- **Citation:** (Sensitive Data Exposed section)
- **Tags:** #cybersecurity, #data-privacy, #agentic-security-tradeoff

**DP9:** Private agent-to-agent messages stored without encryption exposed third-party API credentials
- **Anchor:** "conversations were stored without any encryption or access controls -- some contained third-party API credentials, including plaintext OpenAI API keys"
- **Citation:** (Private Messages & Third-Party Credential Leaks section)
- **Tags:** #data-privacy, #cybersecurity, #agentic-security-tradeoff

**DP10:** Write access vulnerability enabled content manipulation consumed by thousands of AI agents
- **Anchor:** "any unauthenticated user could: Edit any post on the platform, Inject malicious content or prompt injection payloads"
- **Citation:** (Write Access section)
- **Tags:** #cybersecurity, #agentic-security-tradeoff, #trust-fairness

**DP11:** Privacy cascade: platform misconfiguration exposed credentials for entirely unrelated services
- **Anchor:** "A single platform misconfiguration was enough to expose credentials for entirely unrelated services"
- **Citation:** (Privacy Breakdowns Can Cascade section)
- **Tags:** #data-privacy, #cybersecurity, #risk-governance

**DP12:** Write access introduces narrative control and prompt injection risks beyond data exposure
- **Anchor:** "the ability to modify content and inject prompts into an AI ecosystem introduces deeper integrity risks"
- **Citation:** (Write Access Introduces Far Greater Risk section)
- **Tags:** #agentic-security-tradeoff, #cybersecurity, #trust-fairness

**DP13:** Security maturity required multiple remediation rounds surfacing progressively exposed surfaces
- **Anchor:** "We worked with the team through multiple rounds of remediation, with each iteration surfacing additional exposed surfaces"
- **Citation:** (Security Maturity is an Iterative Process section)
- **Tags:** #risk-governance, #deployment-bottleneck, #cybersecurity

**DP14:** Participation metrics inflated without guardrails like rate limits or identity verification
- **Anchor:** "While Moltbook reported 1.5 million agents, these were associated with roughly 17,000 human accounts, an average of about 88 agents per person"
- **Citation:** (Participation Metrics Need Verification section)
- **Tags:** #trust-fairness, #vendor-strategy, #agentic-workflows

**DP15:** AI tools don't yet reason about security posture on developer's behalf
- **Anchor:** "today's AI tools don't yet reason about security posture or access controls on a developer's behalf"
- **Citation:** (Speed Without Secure Defaults section)
- **Tags:** #skill-formation, #deployment-bottleneck, #cybersecurity

**DP16:** Configuration issues traced to single Supabase setting demonstrating how small details matter at scale
- **Anchor:** "the issue ultimately traced back to a single Supabase configuration setting"
- **Citation:** (Speed Without Secure Defaults section)
- **Tags:** #risk-governance, #cybersecurity, #deployment-bottleneck

**DP17:** Users shared credentials in direct messages under privacy assumption that was not technically enforced
- **Anchor:** "Users shared OpenAI API keys and other credentials in direct messages under the assumption of privacy"
- **Citation:** (Privacy Breakdowns Can Cascade section)
- **Tags:** #data-privacy, #trust-fairness, #cybersecurity

**DP18:** Agent internet category still early: identity, participation, and authenticity mechanisms still evolving
- **Anchor:** "builders are actively exploring what agent identity, participation, and authenticity should look like, and the supporting mechanisms are still evolving"
- **Citation:** (Participation Metrics Need Verification section)
- **Tags:** #agentic-workflows, #trust-fairness, #vendor-strategy

**DP19:** Security needs to become first-class built-in part of AI-powered development
- **Anchor:** "Security needs to become a first class, built-in part of AI powered development"
- **Citation:** (Closing Thoughts section)
- **Tags:** #cybersecurity, #risk-governance, #deployment-bottleneck

**DP20:** AI assistants can enable secure defaults: RLS by default, credential scanning, unsafe configuration detection
- **Anchor:** "AI assistants that generate Supabase backends can enable RLS by default. Deployment platforms can proactively scan for exposed credentials"
- **Citation:** (Closing Thoughts section)
- **Tags:** #cybersecurity, #risk-governance, #vendor-strategy

**DP21:** Barrier to building has dropped dramatically but barrier to building securely has not caught up
- **Anchor:** "while the barrier to building has dropped dramatically, the barrier to building securely has not yet caught up"
- **Citation:** (Closing Thoughts section)
- **Tags:** #skill-formation, #deployment-bottleneck, #cybersecurity

---

## Notable Quotes

1. **On vibe coding's security blind spots:**
   > "This practice, while revolutionary, can lead to dangerous security oversights - similar to previous vulnerabilities we have identified, including the DeepSeek data leak and Base44 Authentication Bypass."

2. **On agent authenticity illusion:**
   > "The revolutionary AI social network was largely humans operating fleets of bots."

3. **On privacy cascade effects:**
   > "A single platform misconfiguration was enough to expose credentials for entirely unrelated services - underscoring how interconnected modern AI systems have become."

4. **On the vibe coding opportunity:**
   > "The opportunity is not to slow down vibe coding but to elevate it. Security needs to become a first class, built-in part of AI powered development."

5. **On disclosure timeline:**
   > "We worked with the team through multiple rounds of remediation, with each iteration surfacing additional exposed surfaces: from sensitive tables, to write access, to GraphQL-discovered resources."

---

## Initial Observations

**Vibe Coding Security Crisis Pattern**
Moltbook exemplifies a systematic vulnerability pattern in AI-generated applications where speed-to-market sacrifices security fundamentals. The founder's explicit statement—"I didn't write a single line of code"—crystallizes the risk: AI coding assistants excel at functional implementation but lack security reasoning. The exposed Supabase credentials in client-side JavaScript represent not an isolated mistake but a category of failures where AI tools generate code without enforcing access controls, encryption, or authentication boundaries. This is the third major vibe-coded vulnerability Wiz has documented (after DeepSeek and Base44), suggesting the pattern is widespread.

**The 88:1 Agent Ratio and Authenticity Crisis**
The gap between claimed participation (1.5M agents) and actual humans (17K) reveals a deeper crisis in "agent internet" metrics. Without rate limiting or verification mechanisms, any human could spawn unlimited bot accounts with simple POST requests. This raises fundamental questions about what constitutes an "agent" in AI-native platforms. Is it the presence of API calls to LLM providers? The autonomy of action? The independence from human control? Moltbook's approach—essentially allowing any account to self-declare as an "agent"—enabled participation theater rather than authentic AI activity. The platform became a bot farm with an AI aesthetic.

**Privacy Cascade: How Platform Vulnerabilities Leak Across Ecosystems**
The most striking finding isn't the Moltbook breach itself but the third-party credential exposure within it. Users shared OpenAI API keys in agent-to-agent DMs under the assumption of privacy. A single misconfigured database exposed those credentials to any unauthenticated attacker. This demonstrates how AI systems have become deeply interconnected: one platform's security failure cascades to entirely separate services. The "agent internet" amplifies this risk because agents routinely share credentials, API tokens, and authentication data as part of coordination workflows. A breach anywhere threatens security everywhere.

**Write Access: Beyond Data Leaks to Integrity Attacks**
The evolution from read access (data exposure) to write access (content manipulation) marks a critical threat escalation. With write capabilities, an attacker could inject prompt injection payloads into posts consumed by thousands of AI agents, creating a vector for mass manipulation of agent behavior. This transforms security from a confidentiality problem (protecting data) to an integrity problem (ensuring trusted inputs). In AI-native platforms where agents consume and act on platform content, write access enables narrative control at ecosystem scale.

**Iterative Remediation and the Five-Fix Timeline**
The disclosure timeline reveals how difficult it is to fully secure a platform retroactively. Wiz worked through five remediation rounds over a 3-hour period (January 31 21:48 UTC to February 1 01:00 UTC), with each fix surfacing new exposure. First: agents table secured. Second: messages, notifications, votes secured. Third: write access blocked. Fourth: observers table discovered. Fifth: all tables finally secured. This pattern—fix one surface, discover another—suggests that platforms built without security-first design require systematic rewrites rather than patches. The "iterative hardening" framing is generous; in practice, it's reactive scrambling.

**The Secure-by-Default Opportunity**
The article's closing argument is crucial: the solution is not to slow down vibe coding but to make security the natural outcome. AI code generation tools could enable Row Level Security by default when generating Supabase backends. Deployment platforms could scan for exposed credentials before pushing to production. The same AI capabilities that enable rapid development could also enforce security guardrails. This represents a race: can security tooling catch up to generation speed before the next wave of vulnerabilities ships to production? The current evidence suggests no—deployment velocity is outrunning security maturity.

**Disclosure Timeline (January 31 - February 1, 2026):**
- 21:48 UTC: Initial contact via X DM
- 22:06 UTC: Reported RLS misconfiguration exposing agents table
- 23:29 UTC: First fix (agents, owners, site_admins)
- 00:13 UTC: Second fix (messages, notifications, votes, follows)
- 00:31 UTC: Discovered write access vulnerability
- 00:44 UTC: Third fix (write access blocked)
- 00:50 UTC: Discovered additional tables (observers, identity_verifications, developer_apps)
- 01:00 UTC: Final fix (all tables secured)

Total remediation time: 3 hours 12 minutes across five distinct fixes.
