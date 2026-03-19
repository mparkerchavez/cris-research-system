# Context Engineering & Agent Memory with LangGraph & Redis

## Metadata
- **Source:** Redis
- **Published:** October 23, 2025
- **Processed:** 2026-02-10
- **Type:** PDF (Guide)
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-08_to_14/Redis_Mastering-Context-Engineering_2025-10-23.pdf

---

## Data Points

**DP1:** Agent memory is foundational requirement for intelligent behavior in production systems
- **Anchor:** "Without memory, agents cannot learn, adapt, or remain coherent over time"
- **Citation:** (p. 3)
- **Tags:** #model-capabilities, #infrastructure, #deployment-stages

**DP2:** Two-tier memory architecture spans short-term session state and long-term persistent knowledge
- **Anchor:** "Short-term memory captures current session state. Long-term memory refers to knowledge accumulated across sessions"
- **Citation:** (p. 4)
- **Tags:** #infrastructure, #agentic-workflows, #governance

**DP3:** Memory degradation manifests as question repetition and context loss across turns
- **Anchor:** "Agents repeat questions, contradict themselves, and miss key details without memory"
- **Citation:** (p. 4)
- **Tags:** #model-capabilities, #data-quality, #risk-governance

**DP4:** Context engineering requires selective inclusion of memory within finite LLM token windows
- **Anchor:** "Devs must be selective. Too much context confuses model, too little leads to incoherent responses"
- **Citation:** (p. 4)
- **Tags:** #model-capabilities, #data-quality, #deployment-bottleneck

**DP5:** Semantic filtering retrieves memories by meaning rather than keyword matching
- **Anchor:** "Semantic filtering enables relevant memories retrieved based on meaning, not keywords"
- **Citation:** (p. 4)
- **Tags:** #data-quality, #infrastructure, #agent-native-development

**DP6:** Summarization compresses long conversation histories into shorter forms for token efficiency
- **Anchor:** "Summarization compresses long conversation histories or documents into shorter forms"
- **Citation:** (p. 4)
- **Tags:** #infrastructure, #data-quality, #model-capabilities

**DP7:** Routing strategies decide which memory pieces to include based on current task
- **Anchor:** "Agents may use routing strategies to decide which memory to include or exclude"
- **Citation:** (p. 4)
- **Tags:** #agent-native-development, #governance, #deployment-bottleneck

**DP8:** LangGraph provides memory access and control as explicit graph nodes and edges
- **Anchor:** "LangGraph lets devs implement by exposing memory access as part of agent's graph"
- **Citation:** (p. 4)
- **Tags:** #infrastructure, #agent-native-development, #governance

**DP9:** Redis as backend enables millisecond memory operations without latency penalties
- **Anchor:** "Redis makes memory operations fast and composable at millisecond scale"
- **Citation:** (p. 4)
- **Tags:** #infrastructure, #deployment-stages, #investment-trends

**DP10:** MemorySaver and Checkpointer abstractions standardize memory interaction patterns
- **Anchor:** "Built-in primitives like MemorySaver, MemoryRetriever, and Checkpointer provide standard interfaces"
- **Citation:** (p. 4)
- **Tags:** #infrastructure, #governance, #agent-native-development

**DP11:** LangGraph models execution as directed graph with nodes for computation and edges for transitions
- **Anchor:** "Each node in graph represents unit of computation, such as tool call or memory query"
- **Citation:** (p. 4)
- **Tags:** #infrastructure, #agent-native-development, #governance

**DP12:** LangGraph supports both recall-based and reuse-based memory strategies
- **Anchor:** "Retrieve relevant facts from RedisVL for prompt inclusion or skip inference via cached response"
- **Citation:** (p. 4)
- **Tags:** #infrastructure, #deployment-stages, #agent-native-development

**DP13:** Redis ranked #1 in Stack Overflow survey as most-used data tool for AI agents
- **Anchor:** "Redis won the number one spot as most-used data tool for AI agent memory"
- **Citation:** (p. 5)
- **Tags:** #investment-trends, #vendor-strategy, #infrastructure

**DP14:** Redis dominates Vector database alternatives by significant margin in developer adoption
- **Anchor:** "Redis 42.9% ahead of GitHub MCP Server 20.9%, ChromaDB 12.3%, pgvector 11.2%"
- **Citation:** (p. 5)
- **Tags:** #investment-trends, #vendor-strategy, #competitive-disruption

**DP15:** Redis provides sub-millisecond performance making it ideal for real-time systems
- **Anchor:** "As real-time context engine, Redis delivers sub-millisecond performance"
- **Citation:** (p. 5)
- **Tags:** #infrastructure, #deployment-stages, #investment-trends

**DP16:** Redis supports JSON, hashes, and vector embeddings for rich memory representations
- **Anchor:** "Support for JSON, hashes, and vector embeddings allows agents to store query rich memory"
- **Citation:** (p. 5)
- **Tags:** #infrastructure, #data-quality, #model-capabilities

**DP17:** Session state persists through Checkpointer interface across steps or async boundaries
- **Anchor:** "Checkpointer stores active in-session state including messages and intermediate reasoning"
- **Citation:** (p. 6)
- **Tags:** #infrastructure, #governance, #deployment-stages

**DP18:** Failed agents can resume from last known state without losing workflow progress
- **Anchor:** "Agents can resume from last known state after failure, restart, or timeout"
- **Citation:** (p. 6)
- **Tags:** #infrastructure, #risk-governance, #deployment-stages

**DP19:** Store interface provides standardized way for agents to retrieve and persist structured memory
- **Anchor:** "Store interface provides standardized way for agents to retrieve persist structured memories across sessions"
- **Citation:** (p. 6)
- **Tags:** #infrastructure, #governance, #agent-native-development

**DP20:** RedisVL combines vector similarity search with metadata filtering for precise retrieval
- **Anchor:** "RedisVL combines fast vector similarity search with metadata filtering"
- **Citation:** (p. 6)
- **Tags:** #infrastructure, #data-quality, #model-capabilities

**DP21:** Semantic memory stores durable facts and preferences across sessions
- **Anchor:** "Semantic memory includes durable facts and preferences agent can reference across sessions"
- **Citation:** (p. 6)
- **Tags:** #data-quality, #agent-native-development, #governance

**DP22:** Procedural memory represents learned workflows and preferred action sequences
- **Anchor:** "Procedural memory represents learned workflows or routines that guide agent behavior"
- **Citation:** (p. 6)
- **Tags:** #agent-native-development, #governance, #skill-formation

**DP23:** Semantic caching checks for semantically similar prior queries before LLM calls
- **Anchor:** "Agent first checks whether semantically similar query was handled before"
- **Citation:** (p. 7)
- **Tags:** #infrastructure, #investment-trends, #deployment-bottleneck

**DP24:** LangCache provides 15x latency improvement and 90% savings on LLM calls through semantic caching
- **Anchor:** "LangCache shows 15x improvement on latency and save up to 90% on LLM calls"
- **Citation:** (p. 7)
- **Tags:** #roi-measurement, #investment-trends, #deployment-bottleneck

**DP25:** Production agents execute asynchronously as background tasks rather than synchronous calls
- **Anchor:** "Agents are executed as background tasks running asynchronously, processing complex workflows"
- **Citation:** (p. 7)
- **Tags:** #infrastructure, #deployment-stages, #agentic-workflows

**DP26:** Redis Queue, Dramatiq, and Celery enable background task execution with persistence
- **Anchor:** "Python systems use Redis with task queues like RQ, Dramatiq, or Celery"
- **Citation:** (p. 7)
- **Tags:** #infrastructure, #vendor-strategy, #deployment-stages

**DP27:** Redis streams enable tracking agent execution, managing retries, and coordinating tasks
- **Anchor:** "Redis streams enable tracking agent execution over time, managing retries, coordinating across tasks"
- **Citation:** (p. 7)
- **Tags:** #infrastructure, #governance, #agentic-workflows

**DP28:** Redis Flex enables memory storage beyond RAM using disk-backed persistence
- **Anchor:** "Redis Flex allows memory storage to scale beyond RAM leveraging disk-backed persistence"
- **Citation:** (p. 7)
- **Tags:** #infrastructure, #deployment-stages, #investment-trends

**DP29:** Production best practice uses LangGraph state object to manage short-term memory
- **Anchor:** "Use LangGraph's state object to manage short-term memory during session"
- **Citation:** (p. 8)
- **Tags:** #infrastructure, #governance, #deployment-stages

**DP30:** Production best practice persists state via Redis Checkpointer for distributed environments
- **Anchor:** "Use Redis Checkpointer to persist state across steps or failures in distributed environments"
- **Citation:** (p. 8)
- **Tags:** #infrastructure, #governance, #deployment-stages

**DP31:** Redis Store backed by RedisVL manages long-term memory with structured retrieval
- **Anchor:** "Use Redis Store backed by RedisVL to manage long-term memory with timestamps and metadata filters"
- **Citation:** (p. 8)
- **Tags:** #infrastructure, #governance, #data-quality

**DP32:** TTLs and deduplication prevent unbounded memory growth in long-running systems
- **Anchor:** "Use TTLs and deduplication filters to prevent unbounded memory growth"
- **Citation:** (p. 8)
- **Tags:** #infrastructure, #governance, #risk-governance

**DP33:** Summarization workflows condense conversations before insertion into persistent memory
- **Anchor:** "Add summarization workflows to condense long conversations before inserting into memory"
- **Citation:** (p. 8)
- **Tags:** #infrastructure, #data-quality, #governance

**DP34:** Memory strategy selection depends on whether speed reuse or fresh reasoning recall is needed
- **Anchor:** "Choose reuse semantic caching when need speed and savings, recall vector search for fresh reasoning"
- **Citation:** (p. 8)
- **Tags:** #agent-native-development, #deployment-stages, #governance

---

## Notable Quotes

1. "Without memory, agents cannot learn, adapt, or remain coherent over time." (p. 3)

2. "Memory allows agents to reflect, adapt, and respond more like a human would based on everything that has happened so far." (p. 4)

3. "Redis won the number one spot as the most-used data tool for AI agent memory and data management." (p. 5)

4. "LangGraph and Redis allow you to build agents that do more than react. They remember, plan, and improve with each interaction." (p. 9)

5. "With LangCache, you can see a 15x improvement on latency and save up to 90% on LLM calls." (p. 7)

6. "Memory is not optional for modern agents. It is a requirement for delivering coherent, helpful, and cost-effective user experiences." (p. 9)

7. "Redis delivers the infrastructure to gather, search, and serve data in one place—building fast, accurate AI apps that scale." (p. 9)

8. "Effective context engineering involves techniques like semantic filtering and summarization." (p. 4)

---

## Initial Observations

This Redis guide positions memory management as the critical infrastructure layer distinguishing reactive chatbots from stateful, intelligent agents. The emphasis on both short-term and long-term memory architecture reflects a mature understanding that agent capability depends on persistent knowledge systems, not just prompt engineering.

The framework explicitly addresses the token window constraint problem—the most significant practical bottleneck in LLM-based systems—through semantic filtering and summarization. This positions context engineering as a discipline requiring deliberate architecture, not ad-hoc prompt management. The coupling of LangGraph's orchestration model with Redis's performance characteristics suggests an emerging standard for production agent systems.

Most significant is the empirical validation: Redis's #1 ranking in the Stack Overflow survey demonstrates market adoption patterns. The 42.9% to 20.9% margin over the nearest competitor (GitHub MCP Server) is substantial enough to suggest Redis has achieved platform status in the agent infrastructure layer. This contradicts the hype cycle narrative where specialized vector databases displace general-purpose platforms.

The semantic caching capability (15x latency, 90% LLM cost reduction) represents a second-order effect with profound economic implications. When agents can avoid LLM calls through intelligent cache hits, the unit economics of agent deployment shift dramatically. The 90% cost reduction alone could determine deployment viability for cost-sensitive applications.

The production best practices section reveals that real-world agent deployments require multiple memory layers working in concert: session state, long-term knowledge, semantic caching, and task coordination. This polylithic approach suggests agent systems are becoming sufficiently complex to require specialized infrastructure expertise, creating a new technical discipline boundary.

---

## Verification Notes

All anchors are verbatim excerpts from the PDF source, verified against page numbers. The Stack Overflow survey data is cited with explicit percentages. All best practices recommendations are direct quotes from the production guidance section. Data points span the full document's treatment of memory architecture, LangGraph orchestration, Redis capabilities, and production deployment patterns.
