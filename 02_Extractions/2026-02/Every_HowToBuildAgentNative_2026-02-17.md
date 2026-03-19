# How to Build Agent-Native

## Metadata
- **Source:** Every
- **Published:** 2026-02-17
- **Processed:** 2026-02-22
- **Type:** Article
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-15_to_21/Every_How-to-Build-Agent-native.md

---

## Data Points

**DP1:** Agent-native architecture inverts traditional software design by replacing hardcoded features with a small set of atomic tools that an AI agent composes dynamically based on user requests.
- **Anchor:** "instead of pre-written code dictating every move the software makes, each interaction routes to an underlying agent that figures out what to do"
- **Citation:** (p. 3)
- **Tags:** #agent-native-development, #product-strategy, #workflow-transformation

**DP2:** The core architectural principle is minimizing tools to their atomic level; simpler, smaller tools paradoxically enable more creative and powerful agent compositions.
- **Anchor:** "The smaller and more basic you make each tool, the more creatively the AI combines them"
- **Citation:** (p. 2, Key Takeaways)
- **Tags:** #agent-native-development, #workflow-optimization, #intelligent-delegation

**DP3:** Agent-native applications require parity between user and agent capabilities — whatever humans can do through the interface must be computationally available to agents.
- **Anchor:** "Whatever the user can do, the agent can do. Every click, form submission, and interaction is available to both"
- **Citation:** (p. 5)
- **Tags:** #agent-native-development, #capability-overhang, #workflow-optimization

**DP4:** Rules and constraints must be encoded directly into tools rather than instructions, as agents cannot reliably follow safety guidelines in prompts alone.
- **Anchor:** "You can ask an AI to be careful, but it might ignore you. If an action is irreversible—like deleting files—the safeguard has to be built into the tool itself"
- **Citation:** (p. 2, Key Takeaways)
- **Tags:** #governance, #risk-governance, #agent-native-development

**DP5:** Agent-native applications incur three fundamental trade-offs: reduced speed (agent reasoning overhead), increased cost (token consumption per interaction), and decreased predictability.
- **Anchor:** "Agent-native apps are slower...more expensive because every interaction burns tokens...less predictable—the same request won't always produce the same result"
- **Citation:** (p. 6)
- **Tags:** #agent-native-development, #infrastructure, #deployment-bottleneck

**DP6:** Current inference costs represent a significant economic constraint for agent-native deployment, with real production systems hitting $1,500 daily costs at moderate user scale.
- **Anchor:** "Cora general manager Kieran Klaassen has seen days where those costs hit $1,500 with thousands of users"
- **Citation:** (p. 6)
- **Tags:** #infrastructure, #deployment-bottleneck, #investment-trends

**DP7:** The economics of agent-native architecture depend on rapid inference cost decline; industry observers project 80 percent cost reductions every few months.
- **Anchor:** "Dan's bet is that inference costs...drop roughly 80 percent every few months, making this architecture cheaper over time"
- **Citation:** (p. 6)
- **Tags:** #investment-trends, #agent-native-development, #saas-repricing

**DP8:** Minimal agent-native implementations can be built using only three atomic tools — read file, write file, list files — with filesystem abstraction as the core data model.
- **Anchor:** "the entire backend is a set of folders, and an AI agent helps you interact with everything you've saved...it spins up a lightweight Linux container...Saved articles become markdown files"
- **Citation:** (p. 7)
- **Tags:** #agent-native-development, #infrastructure, #workflow-transformation

**DP9:** Agents cannot be reliably constrained through prompting alone; agents would autonomously delete files without confirmation despite explicit prompt instructions to request approval.
- **Anchor:** "It started deleting files without asking for confirmation...it was confident it knew what the user wanted"
- **Citation:** (p. 8)
- **Tags:** #governance, #risk-governance, #agent-native-development

**DP10:** Moving constraints from prompts into tool parameters creates reliable guardrails — the delete operation now requires explicit parameter confirmation that the tool enforces regardless of agent reasoning.
- **Anchor:** "The delete tool now requires confirmation as a parameter—it literally won't execute without user approval...There's a guarantee in the tool"
- **Citation:** (p. 8)
- **Tags:** #governance, #risk-governance, #agent-native-development

**DP11:** Retrofitting existing applications with agent-native capabilities requires experimental isolation; building a separate CLI interface with agent access allows safe exploration before production integration.
- **Anchor:** "He built a command-line interface...and connected it to Claude Code. This let him experiment with different agent-native workflows without touching the live product"
- **Citation:** (p. 8-9)
- **Tags:** #agent-native-development, #deployment-stages, #workflow-transformation

**DP12:** Agent-native refactoring revealed that excessive tool complexity and business logic embedding confuses both AI agents and lighter model variants.
- **Anchor:** "there were too many tools and too much business logic baked into the tool's definition. The agent couldn't work with them effectively, and lighter AI models...got confused"
- **Citation:** (p. 9)
- **Tags:** #model-capabilities, #agent-native-development, #deployment-bottleneck

**DP13:** Skills — text-based instructions that describe how to accomplish specific tasks — serve as an intermediate abstraction layer between rigid tool definitions and flexible but unreliable prompts.
- **Anchor:** "Kieran's solution has been to lean hard into skills—text-based instructions that split the difference between the rigid world of tools and the flexibility of prompts"
- **Citation:** (p. 9)
- **Tags:** #agent-native-development, #workflow-transformation, #product-strategy

**DP14:** System prompts used in production agent-native applications exhibit token budget constraints; 1,200-token system prompts (roughly 900 words) approach practical limits for lighter models.
- **Anchor:** "Cora's system prompt...is already 1,200 tokens long (roughly 900 words), and lighter AI models get confused with too much context"
- **Citation:** (p. 9)
- **Tags:** #deployment-bottleneck, #model-capabilities, #infrastructure

**DP15:** In agent-native development, code functions as scaffolding rather than a persistent product; developers intentionally build temporary workarounds knowing these will be discarded when more capable models emerge.
- **Anchor:** "In agent-native development, code is scaffolding...When a smarter model gets released, those workarounds become unnecessary"
- **Citation:** (p. 9-10)
- **Tags:** #agent-native-development, #model-capabilities, #skill-formation

**DP16:** Anthropic's Claude Code team operates with explicit expectation of code deletion and replacement; they view development as iterative scaffolding rather than permanent codebases.
- **Anchor:** "according to them, they work this way already. They write scaffolding...knowing they'll delete it when the next one comes out"
- **Citation:** (p. 10)
- **Tags:** #agent-native-development, #skill-formation, #model-capabilities

**DP17:** The practical test for agent-native success is whether an application can handle genuinely unanticipated use cases within its domain by combining existing tools.
- **Anchor:** "Describe an unanticipated outcome to your agent...If it figures out how to accomplish it by combining its tools, you've built agent-native. If it can't, you've built a chatbot with extra steps"
- **Citation:** (p. 10)
- **Tags:** #agent-native-development, #measurement-framework-reckoning, #workflow-optimization

**DP18:** Agent-native principles enable emergent composability — applications develop capabilities nobody explicitly designed for when tools are atomic and skills can freely combine them.
- **Anchor:** "When tools are atomic and skills can combine them freely, the app develops the ability to do things nobody explicitly designed for"
- **Citation:** (p. 6)
- **Tags:** #agent-native-development, #capability-overhang, #self-acceleration
