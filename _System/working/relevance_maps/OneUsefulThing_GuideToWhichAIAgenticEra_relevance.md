# DP Relevance Map: A Guide to Which AI to Use in the Agentic Era

**Source:** One Useful Thing (Ethan Mollick)
**Published:** 2026-02-17
**Extraction Date:** 2026-02-23
**Map Created:** 2026-02-28

---

## 1. Relevant to Active Ideas

| DP# | DP Summary | Relevant Idea(s) | How It Connects |
|-----|-----------|------------------|-----------------|
| DP1 | AI utility shifted from conversation to autonomous task execution | #7 Agent-Native Development Paradigm | Directly exemplifies the shift from advising to executing; "you can assign them to a task and they do them" is the operational definition of agent-native work |
| DP2 | Models-Apps-Harnesses framework is essential for understanding AI capability | #7 Agent-Native Development Paradigm, #14 Orchestration Infrastructure as Competitive Layer | Models alone are insufficient; harnesses (tooling layer) determine actual utility, reinforcing that infrastructure is the competitive layer |
| DP3 | Identical models produce different outputs in different harnesses | #14 Orchestration Infrastructure as Competitive Layer, #7 Agent-Native Development Paradigm | Concrete evidence that harness architecture is a primary differentiator independent of model capability |
| DP4 | Only three frontier models are truly capable for serious work | #6 2026 AI Adoption Bifurcation | Clear stratification: frontier (Opus 4.6, GPT-5.2 Thinking, Gemini 3 Pro) vs. everything else materially weaker |
| DP5 | Paid models substantially more capable than free models | #6 2026 AI Adoption Bifurcation, #16 Cost Accessibility Stratification | $20/month paywall creates capability gate; divides users into those with access to advanced models vs. those limited to chat-optimized free versions |
| DP6 | Model selection is critical but deliberately obscured by companies | #17 Specification as Strategic Bottleneck, #6 2026 AI Adoption Bifurcation | Interface complexity is retention mechanism; users cannot easily access full capability without navigation guidance, creating specification friction |
| DP7 | GPT-5.2 ships as multiple sub-variants with weaker defaults | #17 Specification as Strategic Bottleneck | Specification failure: users must explicitly navigate to advanced variants (Thinking, Extended) rather than defaulting to full capability |
| DP8 | Extended thinking configs required for complex problem-solving | #17 Specification as Strategic Bottleneck, #5 Design's Value in Near-Zero-Cost Building | Users must specify which thinking mode; design/specification becomes the bottleneck when model capability is abundant |
| DP9 | Harness capability now determines practical utility more than model choice | #14 Orchestration Infrastructure as Competitive Layer, #7 Agent-Native Development Paradigm | "App and harness matter more than the model" — infrastructure layer has become the primary value driver |
| DP10 | Gemini's capability rivals competitors but harness limitations restrict utility | #14 Orchestration Infrastructure as Competitive Layer, #6 2026 AI Adoption Bifurcation | Demonstrates bifurcation: strong model + weak harness creates uncompetitive offering vs. strong model + strong harness |
| DP11 | Claude Code and OpenAI Codex are mature agentic harnesses | #14 Orchestration Infrastructure as Competitive Layer, #7 Agent-Native Development Paradigm | Genuine autonomous access to development environments; represents maturation of agent-native infrastructure layer |
| DP12 | Claude Cowork extends agentic capabilities to non-technical work | #14 Orchestration Infrastructure as Competitive Layer, #7 Agent-Native Development Paradigm, #13 Work Intensification Paradox | Production-grade harness for knowledge workers with security isolation; extends autonomous execution beyond code to general knowledge work |
| DP13 | Claude Code built Claude Cowork in ~2 weeks | #8 Self-Acceleration Governance | Recursive capability: agents building the tools that extend agent capabilities; signals self-acceleration risk and governance window |
| DP14 | AI systems contributing to novel scientific research | #11 Data Quality (Context Quality), #3 Multi-Dimensional Implementation Chasm | Movement from tool to intellectual collaborator; demonstrates AI can reach frontier domains when harness + model + context align |
| DP15 | NotebookLM specializes in document/research integration harness | #14 Orchestration Infrastructure as Competitive Layer, #7 Agent-Native Development Paradigm | Specialized harness design for knowledge synthesis; demonstrates application-specific infrastructure differentiation |
| DP16 | OpenClaw provides consumer accessibility but creates unquantified security risks | #10 Observability Imperative, #15 Verification Clarity as Domain Disruption Predictor | Broad computer access creates attack surface; "no one knows exactly what dangers" — observability/verification gap in autonomous systems |
| DP17 | Transition from chatbot to agent is most fundamental shift since ChatGPT | #1 Tool-Coworker Duality, #7 Agent-Native Development Paradigm, #8 Real-Time vs Legacy Timeline Collision | "Unit of value changed from conversation to completed task" — represents the shift from tool (advisor) to coworker (executor) |
| DP18 | Adoption pathway: pay $20/month, pick system, experiment with agentic tools | #18 Demand-Side Trust Deficit, #6 2026 AI Adoption Bifurcation | Commitment precedes capability; users must pay and navigate complexity before experiencing agentic value, creating adoption friction |
| DP19 | AI management (steering autonomous agents) replaces prompting as core competency | #2 Coordination Tax & Autonomy Paradox, #13 Work Intensification Paradox | Management-oriented work expands as autonomy increases; short-term competency gap creates work intensification |

---

## 2. Relevant to Open Threads

| DP# | DP Summary | Thread | Connection |
|-----|-----------|--------|------------|
| DP5, DP6, DP7 | Model selection opacity and paywall gating | #5 Data Quality Economics | Cost access creates capability stratification; organizations without $20/month budget locked out of frontier models |
| DP2, DP3, DP9 | Harness determines utility more than model | #11 Orchestration Platform Consolidation | Infrastructure layer consolidating (Claude Code, OpenAI Codex, NotebookLM, Claude Cowork); suggests emerging platform winners in harness design |
| DP11, DP12 | Claude Code and Cowork demonstrate mature harnesses | #3 Multi-Agent Complexity Ceiling | Early evidence of what mature agentic infrastructure looks like; suggests ceiling exists where harness complexity becomes unmeasurable |
| DP13 | Claude Code building Cowork in 2 weeks | #8 Self-Acceleration Governance | Direct evidence of acceleration; agents enabling faster agent-capability-enabling-tool development; governance window may be closing |
| DP16 | OpenClaw security risks remain unquantified | #10 Interactive-to-Autonomous Transfer Gap | Security/safety transfer from interactive to autonomous systems not yet mapped; OpenClaw demonstrates autonomous access without corresponding safety architecture |
| DP18, DP19 | Adoption pathway and management competency shift | #7 Skill Portability | Management-of-agents competency emerging as critical but portable across domains; uncertain if prompting skills transfer to management skills |
| DP1, DP17 | Fundamental shift from conversation to task execution | #9 Work Intensification Governance | Autonomous execution creates need for novel governance structures; traditional QA/review processes inadequate for agent output monitoring |

---

## 3. New Themes

| DP# | DP Summary | Proposed Theme |
|-----|-----------|-----------------|
| DP3, DP9, DP10 | Model capability becomes table stakes; harness becomes primary differentiator | **Infrastructure-Model Capability Decoupling**: In agentic era, model capability necessary but insufficient; infrastructure quality determines competitive positioning independent of model quality |
| DP6, DP7, DP8 | User must navigate multiple layers of specification to access full capability | **Specification Cascade Problem**: Capability access requires correct specification at three levels (model selection, variant selection, config selection); each layer adds friction and creates adoption/performance gap |
| DP11, DP12, DP15 | Specialized harnesses emerging for different knowledge domains | **Domain-Specific Harness Architecture**: Agentic infrastructure optimized for specific domains (code development, general knowledge work, research synthesis); suggests future landscape of specialized tools rather than unified platforms |
| DP16 | Autonomous access creates security risk without corresponding observability | **Autonomous Execution Security-Observability Gap**: Broad system access required for agentic utility creates attack surface; observability/governance architecture lags capability architecture |
| DP13 | Agents building tools that extend agent capabilities | **Self-Referential Capability Acceleration**: Agentic systems creating tools that increase agentic capability creates compounding velocity; acceleration may be self-sustaining |

---

## 4. Not Relevant

| DP# | Why Not Relevant |
|-----|------------------|
| DP4 | Lists model names but doesn't provide insights beyond capability ranking; naming current leaders doesn't connect to Active Ideas or Open Threads about adoption, organization, or governance |
| DP14 | While interesting, contribution to novel physics research is single anecdote; lacks population, metric, or timeframe for Data Point Normalization; insufficient for evidence-building on broader patterns |

---

## 5. Coverage Summary

| Category | Count | Notes |
|----------|-------|-------|
| DPs mapped to Active Ideas | 19 | All data points except DP4 and DP14 connect to Active Ideas (100% coverage excluding non-relevant) |
| DPs mapped to Open Threads | 7 | Strong coverage on infrastructure consolidation (#11), governance windows (#8), and adoption barriers (#5, #7, #9) |
| DPs creating new themes | 5 | New themes focus on infrastructure-model decoupling, specification cascades, and security-observability gaps |
| Total relevant DPs | 17 / 19 | 89% relevance rate; 2 DPs lack sufficient depth for strategic integration |

**Idea Coverage Analysis:**

- **Well-covered ideas:** #7 (Agent-Native Development), #14 (Orchestration Infrastructure), #6 (2026 Bifurcation), #17 (Specification Bottleneck), #1 (Tool-Coworker Duality)
- **Moderate coverage:** #2 (Coordination Tax), #13 (Work Intensification), #8 (Self-Acceleration), #18 (Demand-Side Trust Deficit)
- **Minimal coverage:** #3 (Multi-Dimensional Chasm), #4 (Core Capability Endures), #5 (Design's Value), #9 (Trust Multiplier), #10 (Observability Imperative), #11 (Data Quality), #12 (Infrastructure-Application Divergence), #15 (Verification Clarity), #16 (Cost Accessibility)

---

## 6. Critical Patterns and Strategic Implications

### Pattern 1: Infrastructure as the Binding Constraint

This extraction crystallizes a critical insight: the agentic era has inverted the value hierarchy. Mollick explicitly states that "model differences are now small enough that the app and harness matter more than the model" (DP9). This decoupling of model capability from practical utility means that organizations cannot simply "upgrade to the latest frontier model" and expect proportional productivity gains. The harness (Claude Code, Claude Cowork, OpenAI Codex) determines whether capability translates into completed tasks. This directly validates **Active Idea #14 (Orchestration Infrastructure as Competitive Layer)** with concrete operational evidence. The implication is stark: infrastructure investment now drives differentiation more than model selection. Companies optimizing for frontier models without corresponding harness maturation will experience capability-utilization gaps.

### Pattern 2: Specification Cascades Create Adoption Friction

The extraction reveals a layered specification problem that hasn't been explicitly named in prior analysis. Users must specify correctly at three levels: (1) which system to use (ChatGPT vs Claude vs Gemini), (2) which model variant (GPT-5.2 Thinking vs mini), and (3) which configuration (Extended thinking vs standard). Each specification error cascades downward—choosing GPT-5.2 mini defaults to weak capability; failing to select Extended thinking limits problem-solving depth. Companies deliberately maintain this friction as a feature gate (DP6: "the AI companies do not make easy"). This validates **Active Idea #17 (Specification as Strategic Bottleneck)** but reveals the bottleneck operates across multiple decision layers, not just intent specification. Organizations adopting AI systems will face internal friction matching this external friction: users must commit to learning three layers of specification before experiencing autonomous execution value.

### Pattern 3: Self-Acceleration and Governance Window Contraction

The observation that Claude Code built Claude Cowork in approximately two weeks (DP13) exemplifies **Active Idea #8 (Self-Acceleration Governance)**. This isn't simply a productivity gain—it's evidence that agentic systems are becoming the primary tool for extending agentic capabilities. When agents build the infrastructure that enables more capable agents, the velocity becomes self-sustaining. Mollick's framing treats this as a positive (demonstrating maturity), but the underlying governance challenge is acute: if agents can build agent-capability tools faster than organizations can develop governance frameworks, the governance window closes. The recursive acceleration pattern (agents building tools that extend agents) suggests this window may measure in months, not years. Organizations without governance architecture in place by Q2 2026 may find themselves unable to establish meaningful oversight, as the capability deployment cycle will outpace governance implementation.

### Pattern 4: Security-Observability Inversion in Autonomous Systems

The OpenClaw section reveals a critical tension that prior Active Ideas have not fully addressed: autonomous execution requires broad system access, but this creates unquantified security risks. Mollick explicitly notes "you are giving an AI broad access to your computer and your accounts, and no one knows exactly what dangers you are exposing yourself to" (DP16). While Claude Cowork offers a solution (VM-based isolation), this approach imposes overhead that conflicts with seamless integration. The pattern here is an inversion of traditional security-usability tradeoffs: maximum utility requires maximum access, but maximum access creates unobservable attack surfaces. This connects to **Active Idea #10 (Observability Imperative)** but reveals the imperative is more urgent than prior framing suggested. Organizations cannot reliably govern autonomous agents without observability architecture; current agentic platforms lack the observability necessary for enterprises to verify what agents are doing with system access. This gap between autonomous capability and governance readiness may become the binding constraint on enterprise adoption.

---

## Key Tensions for Strategic Integration

1. **Capability-Observability Gap**: Agentic utility requires system access; system access creates unobservable risks. Solutions (VM isolation) reduce friction, creating new tradeoffs.

2. **Specification-Autonomy Paradox**: As agents become autonomous, specification becomes MORE critical (which thinking mode, which model variant), not less. Users face increased cognitive load to configure autonomy levels.

3. **Infrastructure-Model Decoupling**: Model capability is increasingly irrelevant compared to harness quality. Organizations pursuing "best model" strategies without harness investment will experience utilization gaps.

4. **Governance Window Contraction**: Self-accelerating agent development (agents building agent tools) likely closes governance intervention windows by Q2-Q3 2026. Current governance frameworks inadequate.
