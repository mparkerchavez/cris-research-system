# Anthropic: Measuring Agent Autonomy in Practice

## Metadata
- **Source:** Anthropic
- **Published:** 2026-02-18
- **Processed:** 2026-02-22
- **Type:** Research
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-15_to_21/Anthropic_Measuring-AI-agent-autonomy-in-practice.md

---

## Data Points

**DP1:** Claude Code sessions show expanding duration of autonomous operation, with the 99.9th percentile turn duration nearly doubling from under 25 minutes in late September 2025 to over 45 minutes in early January 2026, indicating growing user trust and shifting task complexity.
- **Anchor:** "99.9th percentile turn duration nearly doubled, from under 25 minutes to over 45 minutes"
- **Citation:** Turn autonomy duration measurement period
- **Tags:** #autonomous-systems, #temporal-compression, #deployment-stages, #capability-overhang

**DP2:** The smooth increase in autonomous run duration across model releases suggests existing models are capable of greater autonomy than they currently exercise in practice, pointing to a deployment capability overhang where theoretical capacity exceeds real-world usage.
- **Anchor:** "increase is smooth across model releases, suggesting existing models are capable of more autonomy than they exercise in practice"
- **Citation:** Model capability vs practice analysis
- **Tags:** #capability-overhang, #model-capabilities, #deployment-bottleneck

**DP3:** Experienced Claude Code users demonstrate a paradoxical oversight pattern: they increase auto-approval rates (from 20% for new users to over 40% for experienced users with 750+ sessions) while simultaneously increasing interrupt rates from 5% to 9%, revealing a shift from action-by-action approval to active monitoring with targeted intervention.
- **Anchor:** "auto-approve roughly 20% of the time; by 750 sessions, this increases to over 40% of sessions"
- **Citation:** Auto-approval rate by account tenure (Figure 2)
- **Tags:** #trust-fairness, #collaboration-paradox, #workforce-readiness, #intelligent-delegation

**DP4:** Interrupt rates increase with user experience (from 5% for new users to 9% for experienced users) despite higher auto-approval, suggesting experienced users maintain active oversight through targeted intervention rather than continuous action approval.
- **Anchor:** "interrupt rates increase with experience. New users interrupt Claude in 5% of turns, while more experienced users interrupt in around 9%"
- **Citation:** Interrupt rates by account tenure (Figure 3)
- **Tags:** #collaboration-paradox, #oversight-evolution, #human-centered-ai, #intelligent-delegation

**DP5:** Claude Code initiates clarification stops (pauses to ask questions) at higher frequency than human interruptions on complex tasks, with agent-initiated stops occurring more than twice as often on maximum-complexity tasks compared to minimal-complexity tasks, indicating calibrated uncertainty recognition.
- **Anchor:** "Claude Code asks for clarification more than twice as often as humans interrupt it"
- **Citation:** Clarification questions analysis (Figure 4)
- **Tags:** #autonomous-systems, #trust-fairness, #model-capabilities, #self-acceleration

**DP6:** Agent-initiated stops serve distinct oversight functions compared to human interruptions: 35% of Claude pauses present users with approach choices, 21% gather diagnostics, 13% clarify vague requests, 12% request credentials, while humans interrupt primarily for technical context (32%) or performance issues (17%).
- **Anchor:** "common reasons for why Claude Code stops work and why humans interrupt Claude"
- **Citation:** Table 1 - Stop initiation reasons
- **Tags:** #autonomous-systems, #risk-governance, #trust-fairness, #cognitive-offloading

**DP7:** Post-deployment monitoring infrastructure reveals significant agent autonomy variance across task complexity: high-complexity tasks show 67% human involvement (vs 87% for minimal-complexity), indicating structured supervision becomes impractical at scale and shifts to outcome-based oversight.
- **Anchor:** "87% of tool calls on minimal-complexity tasks have some form of human involvement, compared to only 67% of tool calls for high-complexity tasks"
- **Citation:** Human involvement by task complexity
- **Tags:** #deployment-bottleneck, #governance, #risk-governance, #workflow-optimization

**DP8:** Software engineering dominates agentic tool use at 50% of API calls, with emerging but scaled below 5% adoption in business intelligence, customer service, sales, finance, and e-commerce, indicating early-stage penetration beyond single-industry concentration.
- **Anchor:** "software engineering accounts for nearly 50% of tool calls on our public API"
- **Citation:** Distribution of tool calls by domain (Figure 6)
- **Tags:** #adoption-barriers, #deployment-stages, #market-demand, #competitive-disruption

**DP9:** Protective safeguards are common but unevenly distributed: 80% of tool calls come from agents with at least one safeguard, 73% include human-in-the-loop mechanisms, but only 0.8% of actions are irreversible, creating asymmetric risk profiles across deployments.
- **Anchor:** "80% of tool calls come from agents that appear to have at least one kind of safeguard, 73% appear to have a human in the loop"
- **Citation:** Safeguard prevalence analysis
- **Tags:** #risk-governance, #governance, #trust-fairness, #policy-gap

**DP10:** Risk and autonomy show weak correlation in practice: highest-risk clusters (mean risk 6.0) involve security-related activities with lower autonomy (mean autonomy 3.3), while highest-autonomy tasks (mean autonomy 8.3) show moderate risk (mean risk 3.3), suggesting misalignment between perceived threat level and actual delegation patterns.
- **Anchor:** "higher-risk actions tend to involve sensitive security-related actions, financial transactions, and medical information"
- **Citation:** Risk and autonomy cluster analysis (Table 2)
- **Tags:** #risk-governance, #autonomous-systems, #governance, #trust-fairness

**DP11:** High-autonomy agents operate on diverse but low-consequence tasks including automated system monitoring (autonomy 8.0, risk 1.1), meeting reminder distribution (autonomy 7.6, risk 1.7), and email-based alerting (autonomy 7.5, risk 1.7), demonstrating safe high-autonomy patterns in business process automation.
- **Anchor:** "Perform automated system health and operational status monitoring during heartbeat checks (autonomy: 8.0, risk: 1.1)"
- **Citation:** High autonomy task examples (Table 2)
- **Tags:** #autonomous-systems, #workflow-optimization, #ambient-work, #output-acceleration

**DP12:** Anthropic's internal Claude Code usage demonstrates co-evolution of autonomy and effectiveness: from August to December 2025, success rate on challenging tasks doubled while human interventions per session decreased from 5.4 to 3.3, showing trust compounds with demonstrated capability.
- **Anchor:** "Claude Code's success rate on internal users' most challenging tasks doubled, at the same time that the average number of human interventions per session decreased from 5.4 to 3.3"
- **Citation:** Internal usage pattern analysis
- **Tags:** #agentic-workflows, #productivity-impact, #capability-overhang, #trust-fairness

**DP13:** Capability assessments and real-world deployment patterns diverge significantly: METR evaluates Claude Opus 4.5 can complete 5-hour human tasks at 50% success rate, but Claude Code's 99.9th percentile deployment turn is 42 minutes, reflecting gap between idealized capability testing and practical autonomy constraints.
- **Anchor:** "METR evaluation captures what a model is capable of in an idealized setting...Our measurements capture what happens in practice"
- **Citation:** Capability assessment vs deployment analysis
- **Tags:** #capability-overhang, #measurement-framework-reckoning, #deployment-bottleneck, #model-capabilities

**DP14:** User base composition shifts impact autonomy metrics: Claude Code user base doubled between January and mid-February 2026, with decline in extreme turn duration (from 45+ to lower levels) likely driven by influx of new, less-experienced users shifting task portfolio toward tightly-scoped professional work versus hobby experimentation.
- **Anchor:** "Claude Code user base doubled between January and mid-February, and a larger and more diverse population of sessions could reshape the distribution"
- **Citation:** User base growth impact on metrics
- **Tags:** #adoption-barriers, #workforce-readiness, #temporal-compression, #deployment-stages

**DP15:** Median turn duration remains stable at 45 seconds with only minor fluctuation (40-55 second range) despite rapid user adoption and model improvements, with nearly all percentiles below 99th showing stability, indicating baseline task patterns resist change despite systemic innovation.
- **Anchor:** "median turn lasts around 45 seconds, and this duration has fluctuated only slightly over the past few months"
- **Citation:** Turn duration stability analysis
- **Tags:** #workflow-optimization, #adoption-barriers, #self-acceleration, #measurement-framework-reckoning

**DP16:** Agent definition operationalized as "AI systems equipped with tools that allow actions" enables empirical measurement but sacrifices architectural visibility: public API analysis measures individual tool calls (breadth across deployments) while Claude Code tracks full sessions (depth of workflow understanding) requiring complementary methodologies.
- **Anchor:** "an agent is an AI system equipped with tools that allow it to take actions"
- **Citation:** Agent definition and measurement approach
- **Tags:** #agentic-workflows, #measurement-framework-reckoning, #infrastructure, #agent-native-development

**DP17:** Privacy-preserving measurement infrastructure enables real-world agent oversight observation but has structural limitations: cannot link independent API requests into coherent sessions, cannot distinguish between production actions and security evaluations, cannot verify actual financial transaction execution, highlighting post-deployment monitoring infrastructure gaps.
- **Anchor:** "we have no reliable way to associate independent requests to our API into sessions"
- **Citation:** Limitations section analysis
- **Tags:** #governance, #data-privacy, #risk-governance, #infrastructure

**DP18:** Regulatory framework mismatch emerges: current agent oversight guidance prescribes specific interaction patterns (e.g., mandatory action-by-action approval) that contradict empirical findings showing experienced users deliberately shift to monitoring-plus-intervention models that are both safer and more effective for complex tasks.
- **Anchor:** "Oversight requirements that prescribe specific interaction patterns, such as requiring humans to approve every action, will create friction without necessarily producing safety benefits"
- **Citation:** Policy recommendations section
- **Tags:** #policy-gap, #governance, #regulatory-uncertainty, #human-centered-ai

**DP19:** Risk frontier expansion anticipated as agents expand beyond software engineering (50% current share) into higher-stakes domains like healthcare, finance, and cybersecurity where current rare high-risk clusters (API exfiltration at risk 6.0, medical records access at risk 4.4) become baseline operations.
- **Anchor:** "agents are concentrated in a single industry: software engineering accounts for nearly 50%"
- **Citation:** Domain expansion analysis
- **Tags:** #deployment-stages, #risk-governance, #market-demand, #competitive-disruption

**DP20:** Agent autonomy is co-constructed across three system components (model behavior, user preferences, product design), making pre-deployment evaluation alone insufficient for understanding real-world deployment patterns and requiring continuous post-deployment measurement as primary oversight mechanism.
- **Anchor:** "autonomy agents exercise in practice is co-constructed by the model, the user, and the product"
- **Citation:** Looking ahead section conclusion
- **Tags:** #agentic-workflows, #human-centered-ai, #governance, #measurement-framework-reckoning

**DP21:** Training models to recognize and surface their own uncertainty acts as proactive safety mechanism complementary to external safeguards: Claude-initiated clarification stops exceed human interruptions on complex tasks, demonstrating that calibrated self-limitation improves both autonomy and safety outcomes.
- **Anchor:** "Training models to recognize and act on their own uncertainty is an important safety property that complements external safeguards"
- **Citation:** Uncertainty recognition recommendation
- **Tags:** #trust-fairness, #risk-governance, #model-capabilities, #human-centered-ai

**DP22:** Product design for oversight must prioritize trustworthy visibility and intervention mechanisms over approval-gate friction: Claude Code's real-time steering and OpenTelemetry monitoring reflect finding that experienced users require monitoring tools and redirection capabilities rather than fine-grained approval workflows.
- **Anchor:** "Product developers should invest in tools that give users trustworthy visibility into what agents are doing, along with simple intervention mechanisms"
- **Citation:** Product developer recommendations
- **Tags:** #deployment-bottleneck, #infrastructure, #human-centered-ai, #workflow-optimization

