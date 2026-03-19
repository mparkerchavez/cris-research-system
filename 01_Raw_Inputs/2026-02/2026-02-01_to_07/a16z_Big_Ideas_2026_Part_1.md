# Big Ideas 2026: Part 1

## Metadata

* **Publication:** Andreessen Horowitz (a16z)
* **Published:** 2025-12-09
* **Type:** Whitepaper
* **URL:** https://a16z.com/newsletter/big-ideas-2026-part-1/
* **Captured:** 2026-02-07

---

The biggest problems builders will tackle in 2026, according to our partners

Posted December 9, 2025

Our job as investors is to immerse ourselves in the ins-and-outs of every corner of the tech industry in order to understand where things are moving next. So every December, we ask our investing teams to share one big idea they think tech builders will tackle in the year to come.

Today, we’re sharing ideas from our Infrastructure, Growth, Bio + Health, and Speedrun teams. Stay tuned for takes from our other teams tomorrow.

## Infrastructure

#### Startups tame the chaos of multimodal data

**Jennifer Li**

Unstructured, multimodal data has been enterprises’ biggest bottleneck and their biggest untapped treasure. Every company is drowning in PDFs, screenshots, videos, logs, emails, and semi-structured sludge. Models keep getting smarter but the inputs keep getting messier, which causes RAG systems to hallucinate, agents to break in subtle, expensive ways, and critical workflows to still heavily rely on human QA. The limiting factor for AI companies is now data entropy: the steady decay of freshness, structured, and truth inside the unstructured universe where 80% of corporate knowledge now lives.

**That’s why untangling unstructured data becomes a generational opportunity.** Enterprises need a continuous way to clean, structure, validate and govern their multimodal data so downstream AI workloads actually work. The use cases are everywhere: contract analysis, onboarding flows, claims handling, compliance, support, procurement, engineering search, sales enablement, analytics pipelines, and every agent workflow that depends on reliable context. Startups that build the platform that extracts structure from documents, images, and videos; reconciles conflicts; repairs pipelines; or keeps data fresh and retrievable hold the key to the kingdom of enterprise knowledge and process.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Jennifer-Li-1-150x150.png)](https://a16z.com/author/jennifer-li/)

[Jennifer Li](https://a16z.com/author/jennifer-li/)
is a general partner at Andreessen Horowitz, where she leads infrastructure investments with an eye on data systems, developer tools and AI.

- Follow
- [X](https://twitter.com/jenniferhli)
- [Linkedin](https://www.linkedin.com/in/jenniferhli/)

#### AI revives cybersecurity hiring

**Joel de la Garza**

For the better part of the last decade, the biggest challenge CISOs faced was hiring. From 2013 to 2021, the number of unfilled cybersecurity jobs grew from under 1M to 3M. That’s because security teams hire highly skilled technicians to spend their days doing soul-crushing level 1 security work like reviewing logs, and no one wants to do this work. The problem is that cybersecurity teams _create_ that drudgery by buying products that detect everything, which means that their teams need to review everything—which, in turn, creates false labor scarcity. It’s a vicious cycle.

In 2026, AI will break this cycle and close this hiring gap by automating much of this repetitive and redundant work for cybersecurity teams. Anyone who has ever spent time working on a large security team knows that half the work is easily solved with automation, but it’s impossible to figure out what to automate when you’re drowning in work. AI-native tools that figure this out for security teams will finally free them up to do what they want to do: chase down bad guys, build new systems, and fix vulnerabilities.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Joel-de-la-Garza-1-150x150.png)](https://a16z.com/author/joel-de-la-garza/)

[Joel de la Garza](https://a16z.com/author/joel-de-la-garza/)
is a partner focused on information security related investments and other chaos adjacent businesses.

- Follow
- [Linkedin](https://www.linkedin.com/in/3448827723723234/)

#### Agent-native infrastructure becomes table stakes

**Malika Aubakirova**

In 2026, the biggest infrastructure shock won’t come from outside companies, but from within. We’re shifting from human-speed traffic that’s predictable and low concurrency to “agent-speed” workloads that’re recursive, bursty, and massive.

The enterprise backend of today was built for a 1:1 ratio of human action-to-system response. It’s not architected for a single agentic “goal” to trigger a recursive fan-out of 5,000 sub-tasks, database queries, and internal API calls in under milliseconds. When an agent attempts to refactor a codebase or remediate a security log, it doesn’t look like a user. To a legacy database or rate-limiter, it looks like a DDoS attack.

Building for agents in 2026 means re-architecting the control plane. We’ll see the rise of “agent-native” infrastructure. The next generation must treat “thundering herd” patterns as the default state. Cold starts must shrink, latency variance must collapse, and concurrency limits must jump by orders of magnitude. The bottleneck becomes coordination: routing, locking, state management, and policy enforcement across massive parallel execution. The winning platforms will be the only ones capable of surviving the deluge of tool execution that follows.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2024/09/Malika-Aubakirova-1-150x150.png)](https://a16z.com/author/malika-aubakirova/)

[Malika Aubakirova](https://a16z.com/author/malika-aubakirova/)
is a partner on the AI Infrastructure team at Andreessen Horowitz.

- Follow
- [X](https://twitter.com/https://x.com/MaikaThoughts)
- [Linkedin](https://www.linkedin.com/in/malika-aubakirova-54759984/)

#### Creative tools go multimodal

**Justine Moore**

We now have the building blocks to tell stories with AI: generative voices, music, images, and video. But for anything beyond a one-off clip, it’s often time-consuming and frustrating—if not impossible—to get the outputs you want, especially if you want anywhere near the level of control that a traditional director would have.

Why can’t we feed a model a 30 second video and ask it to continue the scene with a new character created from a reference image and voice? Or reshoot a clip so we can see a scene from a different angle, or make the motion match a reference video?

2026 is the year AI goes multimodal. Give a model whatever form of reference content you have and work with it to make something new or edit an existing scene. We’ve started to see some early products here, like Kling O1 and Runway Aleph. But there’s a lot more to be done—and we need innovation at both the model and application layers.

Content creation is one of the killer use cases of AI, and I expect we’ll see multiple successful products across use cases and types of customers from meme makers to Hollywood directors.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Justine-Moore-3-150x150.png)](https://a16z.com/author/justine-moore/)

[Justine Moore](https://a16z.com/author/justine-moore/)
is a partner on the investing team at Andreessen Horowitz, where she focuses on AI — both foundation models and applications.

- Follow
- [X](https://twitter.com/venturetwins)
- [Linkedin](https://www.linkedin.com/in/justinemoore94/)

#### The AI-native data stack continues to evolve

**Jason Cui**

We’ve seen a lot of consolidation in the “modern data stack” in the past year as data companies have moved from specialization across ingestion (ETL), transformation, and compute towards bundling and unified platforms. See: the Fivetran/dbt merger and continued rise of unified platforms like Databricks.

While the ecosystem feels notably more mature, we’re still in the early days of a truly AI-native data architecture. We’re excited by ways AI can continue to transform multiple parts of the data stack, and we’re beginning to see how data and AI infrastructure are becoming inextricably linked.

A few ideas we’re excited by:

- How data will continue to flow into performant vector databases alongside traditional structured data
- How AI agents navigate “the context problem”: continuously accessing the right data context and semantic layers in order to build robust applications, like chatting with your data, that always have the correct business definitions across multiple systems of record
- How traditional BI tools and spreadsheets will change as data workflows become more agentic and automated

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2025/09/Jason-Cui-150x150.png)](https://a16z.com/author/jason-cui/)

[Jason Cui](https://a16z.com/author/jason-cui/)
is a partner at Andreessen Horowitz, where he invests in infrastructure and AI.

- Follow
- [X](https://twitter.com/JasonSCui)
- [Linkedin](https://www.linkedin.com/in/jasonscui/)

#### The year we step inside video

**Yoko Li**

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2025/12/unnamed.jpg)](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2025/12/unnamed.jpg)

**In 2026, video stops behaving like something we passively watch and starts feeling like a place we can actually step into.** Video models can finally understand time, remember what they’ve already shown us, react when we do something, and hold together with the kind of quiet consistency we expect from the physical world. Instead of producing a few seconds of disconnected imagery, these systems sustain characters, objects, and physics long enough for actions to matter and for consequences to unfold. This shift turns video into a medium we can build on: a space where robots can practice, games can evolve, designers can prototype, and agents can learn by doing. What emerges is less like a clip and more like a living environment, one that starts to close the gap between perception and action. For the first time, it feels like we can _inhabit_ the videos we generate.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Yoko-Li-2-150x150.png)](https://a16z.com/author/yoko-li/)

[Yoko Li](https://a16z.com/author/yoko-li/)
is a partner at Andreessen Horowitz, where she focuses on developer tools, infrastructure, AI, and creative tools.

- Follow
- [X](https://twitter.com/stuffyokodraws)
- [Linkedin](https://www.linkedin.com/in/yokoli/)

## Growth

#### Systems of record lose ground

**Sarah Wang**

In 2026, the real disruption in enterprise software is that _the system of record will finally start to lose primacy_. AI is collapsing the distance between intent and execution: models can now read, write, and reason directly across operational data, turning ITSM and CRM systems from passive databases into autonomous workflow engines. And as recent advances in reasoning models and agentic workflows compound, these systems gain the ability not just to respond, but to anticipate, coordinate, and execute end-to-end processes. The interface becomes a dynamic agent layer, while the traditional system of record slips into the background as a commodity persistence tier—its strategic leverage ceded to whoever controls the intelligent execution environment employees actually use.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Sarah-Wang-v2-150x150.png)](https://a16z.com/author/sarah-wang/)

[Sarah Wang](https://a16z.com/author/sarah-wang/)
is a general partner on the Growth team at Andreessen Horowitz, where she leads growth-stage investments across AI, enterprise applications, and infrastructure.

- Follow
- [X](https://twitter.com/SarahDingWang)
- [Linkedin](https://www.linkedin.com/in/sarah-wang-59b96a7/)

#### Vertical AI evolves from information retrieval and reasoning to multiplayer

**Alex Immerman**

AI has driven vertical software to unprecedented growth. Healthcare, legal, and housing companies reached $100M+ ARR within a few years; finance and accounting are close behind. The evolution was first information retrieval: finding, extracting, and summarizing the right information. 2025 brought reasoning: Hebbia analyzing financial statements and building models, Basis reconciling trial balances across systems, EliseAI diagnoses maintenance issues and dispatches the right vendors.

2026 unlocks multiplayer mode. Vertical software benefits from domain-specific interfaces, data, and integrations. But vertical work is inherently multi-party. If agents are going to represent labor, they need to collaborate. From buyers and sellers, to tenants, advisors and vendors, each party has distinct permissions, workflows and compliance requirements that only vertical software understands.

Today, each party uses AI in isolation, which creates handoffs without authority. The AI analyzing purchase agreements doesn’t talk to the CFO for its model adjustments. The maintenance AI does not know what the onsite staff promised the tenant. Multiplayer changes by coordinating across stakeholders: routing to functional specialists, maintaining context, syncing changes. Counterparty AIs negotiate within parameters and flag asymmetries for human review. The senior partner’s markup trains the system for the entire firm. Tasks performed by AI will be completed with higher success rates.

And when value increases from multi-human and multi-agent collaboration, switching costs rise. Here we’ll see the network effects that have eluded AI applications: the collaboration layer becomes the moat.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Alex-Immerman-150x150.png)](https://a16z.com/author/alex-immerman/)

[Alex Immerman](https://a16z.com/author/alex-immerman/)
is a general partner on the Growth team at Andreessen Horowitz, where he focuses on fintech, consumer, enterprise, and crypto/web3 companies.

- Follow
- [X](https://twitter.com/aleximm)
- [Linkedin](https://www.linkedin.com/in/immerman/)

#### Creating for agents, not humans

**Stephenie Zhang**

In 2026, people will start interfacing with the web through their agents. And what mattered for human consumption won’t matter the same way for agent consumption.

For years, we’ve optimized for predictable human behavior: rank high on Google, appear among the first few items on Amazon, lead with a TL;DR. When I took a journalism class in high school, we were taught the 5Ws + H for news, and to start with a hook for features. Maybe a human would miss the deeply relevant, insightful statement buried on page five, but the agent won’t.

This shift is about software, too. Apps were designed for human eyes and clicks, and optimization meant good UI and intuitive flows. As agents take over retrieval and interpretation, visual design becomes less central to comprehension. Instead of engineers staring at Grafana dashboards, AI SREs can interpret telemetry and post insights in Slack. Instead of sales teams combing through CRMs, agents can surface patterns and summaries automatically.

We’re no longer designing for humans, but for agents. The new optimization isn’t for visual hierarchy, but for machine legibility—and that will change the way we create and the tools we use to do it.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Stephenie-Zhang-1-150x150.png)](https://a16z.com/author/stephenie-zhang/)

[Stephenie Zhang](https://a16z.com/author/stephenie-zhang/)
is a partner on the Growth investing team, focused on enterprise technology companies.

- Follow
- [X](https://twitter.com/steph_zhang)

#### The end of the screen time KPI in AI applications

**Santiago Rodriguez**

For the last 15 years, screen time has been the best indicator of value delivery in both consumer and business applications. We’ve been living in a paradigm focused on hours of Netflix streaming, mouse clicks in a healthcare EHR UX (to demonstrate meaningful use), or even time spent on chatGPT as the key performance indicator. As we move to a future based on outcome-based pricing that perfectly aligns incentives between vendors and users, we’ll first move away from screen time reporting.

We’re already seeing this in practice. When I run DeepResearch queries on ChatGPT, I capture an enormous amount of value despite almost no screen time. When Abridge magically captures the patient-provider conversation and automates downstream activities, the doctor barely looks at the screen. When Cursor develops entire applications end-to-end, the engineer is planning the next feature development cycle. And when Hebbia drafts a pitch deck from hundreds of public filings, the investment banker is getting well deserved sleep.

This presents a unique challenge: how much an application can charge per user requires a more complex method of measuring ROI. Doctor satisfaction, developer productivity, financial analyst wellbeing and consumer happiness all increase with AI applications. The companies that tell the simplest sales pitch on ROI will continue to outpace their competitors.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Santiago-Rodriguez-1-150x150.png)](https://a16z.com/author/santiago-rodriguez-lebrija/)

[Santiago Rodriguez](https://a16z.com/author/santiago-rodriguez-lebrija/)
is a partner on the Growth investing team, focused on fintech, consumer, and crypto technology companies.

- Follow
- [X](https://twitter.com/santiago__rdz)

## Bio + Health

#### Healthy MAUs

**Julie Yoo**

In 2026, a new healthcare customer segment will take center stage: the “healthy MAUs.”

The traditional healthcare system has primarily served three main user segments: (a) “sick MAUs”: people with spiky, high-cost needs; (b) “sick DAUs\*”: like those in intensive, long-term care; and (c) “healthy YAUs\*”: relatively healthy individuals who rarely see a doctor. Healthy YAUs are at risk of becoming Sick MAUs/DAUs, and preventive care could slow that shift. But our reaction-pilled healthcare reimbursement system rewards treatment over prevention, so access to proactive check-ins and monitoring services are not prioritized, and insurance rarely covers them anyway.

Enter Healthy MAUs: consumers who aren’t actively sick but want to monitor and understand their health on a recurring basis—and also represent the potentially largest portion of the consumer population. We expect a wave of companies—both AI-native upstarts, and repackaged versions of incumbents—to start offering recurring services to serve this user base.

With AI’s potential to reduce the cost structure of care delivery, the advent of novel health insurance products focused on prevention, and consumers more comfortable paying for subscription-based models out of pocket, “healthy MAUs” represent the next high-potential customer segment for healthtech: continuously engaged, data-informed, and prevention oriented.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Julie-Yoo-1-150x150.png)](https://a16z.com/author/julie-yoo/)

[Julie Yoo](https://a16z.com/author/julie-yoo/)
is a general partner on the Bio + Health team, where she leads investments into companies that are transforming how we access, pay for, and experience healthcare.

- Follow
- [X](https://twitter.com/julesyoo)
- [Linkedin](https://www.linkedin.com/in/juliekyoo/)

## Speedrun

#### World models take the spotlight in storytelling

**Jonathan Lai**

In 2026, AI-powered world models will revolutionize storytelling through interactive virtual worlds and digital economies. Technologies like Marble (World Labs) and Genie 3 (DeepMind) already generate full 3D environments from text prompts, allowing users to explore them as if in a game. As creators adopt these tools, entirely new storytelling formats will emerge, potentially culminating in a “generative Minecraft,” where players co-create vast, evolving universes. These worlds could blend game mechanics with natural language programming, such as commanding, “create a paintbrush that changes the color of anything I touch to pink.”

Such models will blur the boundary between player and creator, transforming users into co-authors of dynamic shared realities. This evolution could spawn interconnected generative multiverses, where diverse genres like fantasy, horror, adventure can exist side by side. Within them, digital economies will flourish as creators earn income crafting assets, guiding newcomers, or developing new interactive tools. Beyond entertainment, these generative worlds will serve as rich simulation environments for training AI agents, robots, and perhaps even AGI. The rise of world models thus signals not just a new genre of play, but an entirely new creative medium and economic frontier.

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Jon-Lai-1-150x150.png)](https://a16z.com/author/jonathan-lai/)

[Jonathan Lai](https://a16z.com/author/jonathan-lai/)
is a general partner at Andreessen Horowitz, focused on a16z speedrun. He invests in early-stage teams building tomorrow’s AI x creative landscape—from developer tools to 3D simulations, vertical agents, and novel storytelling formats across video, games, audio, and more.

- Follow
- [X](https://twitter.com/Tocelot)
- [Linkedin](https://www.linkedin.com/in/jlai84/)

#### “The year of me”

**Joshua Lu**

2026 will become “the year of me”: the moment when products stop being mass-produced and start being _made for you._

We’re seeing it everywhere already.

In education, startups like Alphaschool are building AI tutors that adapt to each student’s pace and curiosity, giving every kid an education that matches their pace and preferred method of learning. This level of attention previously would not be possible without tens of thousands of tutoring dollars spent per student.

In health, AI is designing daily supplement stacks, workout plans, and meal routines tailored to your biology. No need for a trainer or a lab.

Even in media, AI lets creators remix news, shows, and stories into personalized feeds that match your exact interests and tone.

The biggest companies of the last century won by finding _the average consumer._ The biggest companies of the next century will win by finding _the individual inside the average._

2026 is the year the world stops optimizing for everyone and starts optimizing for _you._

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2023/04/Josh-Lu-1-150x150.png)](https://a16z.com/author/joshua-lu/)

[Joshua Lu](https://a16z.com/author/joshua-lu/)
is an Investment Partner at Andreessen Horowitz for a16z speedrun.

- Follow
- [X](https://twitter.com/JoshLu)
- [Linkedin](https://www.linkedin.com/in/joshualu/)

#### The first AI-native university

**Emily Bennett**

In 2026, I expect we’ll see the birth of the first AI-native university, an institution built from the ground up around intelligent systems.

Over the past several years, universities have dabbled in AI-enabled grading, tutoring, and scheduling. But what’s emerging now is deeper, an adaptive academic organism that learns and optimizes itself in real time.

Picture an institution where courses, advising, research collaboration, and even building operations continuously adapt based on data feedback loops. Schedules optimize themselves. Reading lists evolve nightly and rewrite themselves as new research appears. Learning paths shift in real time to meet each student’s pace and context.

We’re already seeing precursors. ASU’s campus-wide partnership with OpenAI produced hundreds of AI-driven projects across teaching and administration. SUNY now embeds AI literacy into its general education requirements. These are the building blocks for more foundational deployment.

In the AI-native university, professors become **architects of learning**, curating data, tuning models, and teaching students how to interrogate machine reasoning

Assessment shifts, too. Detection tools and plagiarism bans give way to AI-aware evaluation, grading students on _how_ they use AI, not whether they used it. Transparency and tactful application replaces prohibition.

And as every industry struggles to hire people who can design, govern, and collaborate with AI systems, this new university becomes the training ground, producing graduates fluent in orchestration who help augment a rapidly shifting workforce.

This AI-native university will become the talent engine for a new economy.

_Stay tuned for part 2 tomorrow._

[![](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2025/09/Emily-Bennett-150x150.png)](https://a16z.com/author/emily-bennett/)

[Emily Bennett](https://a16z.com/author/emily-bennett/)
is an investing partner for a16z speedrun.