# DP Relevance Map: Every — How to Build Agent-Native

**Source File:** `Every_HowToBuildAgentNative_2026-02-17.md`
**Date:** 2026-02-22
**Total DPs:** 18
**Relevance Distribution:** 16 active ideas touched, 8 open threads directly engaged

---

## 1. Core Idea Alignment (Dominant Themes)

### Tier 1 — Deep Reinforcement (3+ DPs each)

**Agent-Native Development (7 DPs: 1, 2, 3, 8, 11, 13, 15)**
- **Primary contribution:** Concrete architectural principles for agent-native systems
- **Key insight:** Atomicity of tools enables emergent composability (DP2, DP18)
- **Implementation detail:** Filesystem abstraction as minimal viable backend (DP8)
- **Evidence density:** Multiple DPs establish both theory (DP1) and practice (DP11, DP13, DP15)
- **Relevance to Active Ideas:**
  - Directly accelerates **#7 Agent-Native Development** (core research question)
  - Operationalizes **#3 Multi-Dimensional Implementation Chasm** (shows working gap between theory and practice)
  - Exemplifies **#6 Design's Value in Near-Zero-Cost Building** (skills as design layer between tools and prompts)

**Governance & Risk Architecture (4 DPs: 4, 9, 10, 14)**
- **Primary contribution:** Empirical evidence that prompts cannot enforce safety; constraints must be encoded in tooling
- **Critical finding:** DP9 provides a behavioral proof point—agents will violate explicit prompt instructions
- **Solution pattern:** Move constraints from prompts to tool parameters (DP10)
- **Architectural implication:** Governance is not a layer of instructions but a structural property of the system
- **Relevance to Active Ideas:**
  - Directly addresses **#15 Verification Clarity as Domain Disruption Predictor** (governance clarity as differentiation)
  - Strengthens **#9 Trust Multiplier & Authenticity Crisis** (reliable constraints build trust)
  - Informs **#12 Infrastructure-Application Strategic Divergence** (governance lives in infrastructure, not application logic)

**Infrastructure & Deployment Reality (4 DPs: 5, 6, 7, 12)**
- **Primary contribution:** Economic constraints are real and structural; cost decline is predicated on external factors
- **Critical data:** Production systems hit $1,500/day costs at moderate scale (DP6)
- **Optimistic assumption:** 80% cost reduction every few months required to make economics work (DP7)
- **Architectural limitation:** Tool complexity creates cognitive load for lighter models (DP12)
- **Relevance to Active Ideas:**
  - Directly challenges **#12 Data Quality as Strategic Bottleneck** (cost is the bottleneck, not data; but see DP12 interaction)
  - Demonstrates **#2 Cost Accessibility Stratification** (high inference costs create winner-take-most dynamics)
  - Evidence for **#5 2026 AI Adoption Bifurcation** (cost will determine which enterprises can build agent-native)

### Tier 2 — Moderate Support (2 DPs each)

**Capability Overhang & Parity (2 DPs: 3, 18)**
- **Insight:** DP3 establishes user-agent parity requirement; DP18 shows emergent capability beyond explicit design
- **Relevance:** Supports **#1 Tool-Coworker Duality** (agents must have full access to tools available to humans)
- **Tension point:** Creates **#13 Work Intensification Paradox** (parity means agents can do all human work, intensifying work pressures)

**Model Capability as Architectural Constraint (2 DPs: 12, 14)**
- **Insight:** Lighter models get confused with complex tools or long context windows; architectural simplification is required for model compatibility
- **Relevance:** Informs **#4 Core Capability Endures** (even as models improve, simpler architectures remain foundational)
- **Open thread connection:** **#3 Multi-Agent Complexity Ceiling** (tool complexity appears to be a ceiling)

---

## 2. Open Threads Directly Engaged

### High Engagement (Multiple DPs supporting thread)

**#1 Measurement Framework (3 DPs: 17, 2, 18)**
- **DP17:** Provides explicit test for agent-native success (unanticipated use case composability)
- **DP2, DP18:** Show atomicity and emergent composability as measurable properties
- **Gap:** Measurement is qualitative (can the agent do it?) not quantitative (how well?)
- **Recommendation:** Use DP17 as foundation for measurement taxonomy

**#6 Trust Architecture Bifurcation (3 DPs: 4, 9, 10)**
- **DP9:** Empirical evidence of trust failure in prompt-based systems
- **DP4, DP10:** Two trust architectures emerging—prompt-based (unreliable) vs. tool-parameter-based (reliable)
- **Strategic implication:** Trust will become a market segmentation variable

**#2 Skill Portability (2 DPs: 13, 15)**
- **DP13:** Skills are intermediate abstraction (portable across tool configurations?)
- **DP15:** Code is scaffolding, implying skills may need to be portable across model versions
- **Unresolved:** Do skills written for Claude translate to other models?

### Moderate Engagement (1-2 DPs each)

**#11 Data Quality Economics** (1 DP: 12)
- DP12 suggests complexity in tool definitions impacts agent reasoning; potential signal for data quality economics
- **Weak connection:** Needs reinforcement from other sources

**#4 Enterprise Timeline Compression** (1 DP: 11)
- DP11 shows experimental isolation (separate CLI) as compression strategy
- **Limited scope:** Only one company's approach

**#9 Self-Acceleration Governance** (1 DP: 15)
- DP15 implies governance window: code-deletion cycle accelerates as models improve
- **Underdeveloped:** Thread needs more evidence

---

## 3. Tension Points & Paradoxes

### Identified Contradictions

**The Constraint Movement Paradox (DP4, DP9, DP10)**
- **Thesis:** Constraints must move from prompts to tooling for reliability
- **Implication:** This creates a tooling complexity burden that contradicts DP2 (smaller tools enable creativity)
- **Resolution path:** Skills layer (DP13) may mediate this—skills provide complexity abstraction without tool proliferation
- **Strategic question:** Does governance-in-tooling scale to enterprise complexity?

**The Cost-Model Fit Paradox (DP5, DP7, DP12)**
- **DP5:** Agent-native is inherently slower, more expensive, less predictable
- **DP7:** Economic viability depends on 80% cost reduction every few months
- **DP12:** But tool simplification for lighter models contradicts feature richness
- **Unresolved:** Which constraint hits first—cost or capability?

**The Code-as-Scaffolding Paradox (DP15, DP16)**
- **Implication:** If code is temporary, then architectural stability is illusory
- **Counter-signal:** DP13 (skills) suggests some patterns endure
- **Strategic question:** What parts of agent-native stack are durable vs. disposable?

### Leverage Points for Active Ideas

**Verification Clarity as Disruption Predictor (#15)**
- DP4 + DP10 provide empirical evidence: governance clarity (tool-parameter constraints) creates market differentiation
- **Stronger positioning:** Not just verification, but governance-as-infrastructure

**Orchestration Infrastructure as Competitive Layer (#14)**
- DP13 (skills) + DP8 (filesystem abstraction) show infrastructure decisions driving capability
- **Not extracted:** How does this relate to broader orchestration platform layer?

---

## 4. Evidence Density & Source Quality

### Highly Specific, Implementable Data

- **DP8:** Three-tool minimum (read, write, list) is concrete and testable
- **DP14:** 1,200-token system prompt ceiling is measurable constraint
- **DP6:** $1,500/day cost is quantified real-world data
- **DP17:** Unanticipated composability test is falsifiable success metric

### Moderate Generalizability

- **DP11:** Experimental isolation strategy (CLI) is pattern-level but single-source
- **DP13:** Skills abstraction is emergent pattern from one case study (Cora)
- **DP2:** Atomicity principle lacks breadth of evidence

### Observation-Based (Low Predictive Value)

- **DP5:** Speed/cost/predictability trade-offs described but not quantified
- **DP7:** Cost reduction projection is external (industry observers, not tested)

---

## 5. Concept Maturity by Active Idea

### Concepts at "Implementable Pattern" Stage (Ready for Testing)

1. **#7 Agent-Native Development** — DP1, DP2, DP8, DP13 form a coherent implementation model
2. **#4 Core Capability Endures** — DP2 (atomicity) + DP12 (simplicity for lighter models) suggest durable principle
3. **#15 Verification Clarity as Disruption Predictor** — DP4, DP9, DP10 demonstrate governance clarity as market differentiator

### Concepts at "Pattern Recognition" Stage (Need More Evidence)

1. **#6 Design's Value in Near-Zero-Cost Building** — DP2 + DP13 suggest design (skill layer) multiplies tool value
2. **#14 Orchestration Infrastructure as Competitive Layer** — DP8 + DP13 imply orchestration decisions matter
3. **#12 Infrastructure-Application Strategic Divergence** — DP5, DP12, DP14 show infrastructure constraints (cost, model limits, token budgets) decoupling from application logic

### Concepts at "Hypothesis" Stage (Weak Signal)

1. **#2 Coordination Tax & Autonomy Paradox** — No direct signal
2. **#8 Real-Time vs Legacy Timeline Collision** — Implicit in DP11 (experimental isolation) but not explicit
3. **#13 Work Intensification Paradox** — DP3 (parity) implies this but doesn't examine it

---

## 6. Gaps & Missing Dimensions

### Critical Gaps

**Enterprise Scaling Untested**
- All evidence from single-company deployments or small teams
- No data on: multi-agent coordination, governance at scale, cost at 10K+ users, organizational change management

**Long-Tail Economics Unmeasured**
- DP6 shows daily costs but no retention/lifetime economics
- No data on: CAC changes with agent-native, churn impact, pricing strategies emerging

**Data Quality Interactions Absent**
- DP12 shows tool complexity impacts model reasoning, but no analysis of data quality as independent variable
- Missing: How do garbage inputs affect agent reasoning? Is data quality a cost multiplier or cost reducer?

**Model Portability Unexplored**
- All case studies use Claude
- Unresolved: Are agent-native principles model-agnostic? Do skills/tools transfer to other model families?

**Governance at Speed Underdeveloped**
- DP10 shows parameter-based constraints work, but implementation speed is unclear
- Missing: How fast can governance evolve in production? Does governance velocity matter?

### Secondary Gaps

- **Timeline dynamics:** No analysis of how DP5 (speed/cost/predictability trade-offs) changes as costs decline
- **Skill evolution:** DP13 introduces skills but doesn't address: skill versioning, skill discovery, skill composition governance
- **Legacy integration:** DP11 shows one pattern (CLI isolation) but not comparative analysis of integration strategies
- **User experience:** No discussion of how agent-native UX differs from traditional interfaces (relevant to adoption bifurcation theory)

---

## 7. Recommendations for Research Direction

### Immediate Synthesis Opportunities

1. **Cost-Model-Governance Triangle:** Map DP5, DP6, DP7, DP12, DP14 together to show how these three dimensions interact; this clarifies **#12 Infrastructure-Application Strategic Divergence**

2. **Governance-as-Infrastructure Framework:** Use DP4, DP9, DP10 as foundation for **#15 Verification Clarity as Disruption Predictor**; this is the strongest theoretical position in the extraction

3. **Atomicity as Design Principle:** Synthesize DP2, DP8, DP13 to formalize relationship between tool simplicity, skill abstraction, and emergent capability; supports **#6 Design's Value in Near-Zero-Cost Building**

### Open Thread Candidates for Mining

- **#1 Measurement Framework:** DP17 provides explicit test; develop taxonomy from this starting point
- **#6 Trust Architecture Bifurcation:** DPs 4, 9, 10 show two trust models emerging; position as strategic fork
- **#3 Multi-Agent Complexity Ceiling:** DP12 hints at complexity limits; mine other sources for complexity ceiling patterns

### Missing Evidence Required

- Multi-agent coordination patterns (needed for **#2 Coordination Tax & Autonomy Paradox**, **#14 Orchestration Infrastructure**)
- Enterprise timeline compression data (needed for **#5 Enterprise Timeline Compression** thread)
- Data quality economics measurement (needed for **#11 Data Quality Economics** thread)

---

## Summary Table

| Active Idea | DPs | Strength | Status |
|---|---|---|---|
| #7 Agent-Native Development | 1,2,3,8,11,13,15 | Strong (7 DPs) | Implementable |
| #15 Governance/Verification Clarity | 4,9,10 | Strong (3 DPs) | Implementable |
| #4 Core Capability Endures | 2,12,14 | Moderate (3 DPs) | Pattern |
| #12 Infrastructure-Application Divergence | 5,12,14 | Moderate (3 DPs) | Pattern |
| #6 Design's Value | 2,13 | Weak (2 DPs) | Hypothesis |
| #1 Tool-Coworker Duality | 3 | Weak (1 DP) | Hypothesis |
| #13 Work Intensification Paradox | 3 | Weak (1 DP) | Hypothesis |
| #3 Multi-Dimensional Implementation Chasm | 11 | Weak (1 DP) | Hypothesis |
| #14 Orchestration Infrastructure | 8,13 | Weak (2 DPs) | Hypothesis |
| All others | — | No direct signal | — |

| Open Thread | DPs | Engagement | Readiness |
|---|---|---|---|
| #1 Measurement Framework | 2,17,18 | High (3 DPs) | Ready for synthesis |
| #6 Trust Architecture Bifurcation | 4,9,10 | High (3 DPs) | Ready for synthesis |
| #2 Skill Portability | 13,15 | Moderate (2 DPs) | Needs mining |
| #11 Data Quality Economics | 12 | Low (1 DP) | Needs more sources |
| #4 Enterprise Timeline Compression | 11 | Low (1 DP) | Needs more sources |
| #9 Self-Acceleration Governance | 15 | Low (1 DP) | Needs more sources |

