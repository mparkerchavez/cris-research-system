# CRIS Rebuild Protocol: Bottom-Up Idea Discovery

**Purpose:** One-time rebuild of Active Ideas, Weekly Learnings, Current Synthesis, and Talking Points using a bottom-up approach across all 69 extractions.

**Why this exists:** The original Active Ideas were formed from ~16 of 69 extractions, creating framing bias. Subsequent synthesis sessions mapped new evidence into pre-existing ideas rather than letting the full evidence base shape what the ideas should be. This protocol resets the foundation using a bottom-up discovery process.

**Structure:** 5 chat sessions, each self-contained with clear inputs, outputs, and completion criteria. You can run these across different days if needed.

**Important:** Load the CRIS skill at the start of each chat session. Reference the Style Guide (`_System/Style_Guide.md`) and Citation Contract (`_System/Citation_Contract.md`) during any writing phases.

---

## Pre-Rebuild Checklist

Before starting Chat Session 1:

- [ ] Confirm all 69 extractions exist in `02_Extractions/2026-02/`
- [ ] Create working directory: `_System/rebuild/`
- [ ] Archive current outputs (Claude will do this in Chat Session 4, but note the current state):
  - Current Active Ideas: 8 ideas
  - Current Weekly Learnings: `WL_2026-02-07.md`
  - Current Synthesis baseline: 9.4% DP coverage (130 of 1,388 DPs cited)

---

## Extraction Clusters

All 69 extractions are pre-assigned to 9 thematic clusters. Each cluster groups sources by topic affinity so sub-agents can identify patterns within related material.

### Cluster A: Enterprise Adoption & Proficiency (9 sources, 233 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `Section_AIProficiencyReportJan2026_2026-02-04.md` | 24 |
| 2 | `Section_StateOfAIProficiency_2026-02-05.md` | 25 |
| 3 | `Udemy_GlobalLearningSkillsTrends2026_2026-02-04.md` | 25 |
| 4 | `McKinsey_AgentsRobotsSkillPartnerships_2026-02-04.md` | 25 |
| 5 | `Anthropic_EconomicIndexV4_2026-02-04.md` | 23 |
| 6 | `Insight_Partners_AIAdoptionPatterns2026_2026-02-05.md` | 20 |
| 7 | `Insight_Partners_AIInFinancialServices_2026-02-05.md` | 17 |
| 8 | `FTSG_HotTrendsArentStrategy_2026-02-05.md` | 15 |
| 9 | `FTSG_HowWeTalkAboutAI_2026-02-05.md` | 20 |

**Rationale:** Groups all sources focused on how organizations adopt AI, proficiency measurement, skill gaps, and strategic adoption barriers.

### Cluster B: KPMG Longitudinal Series (5 sources, 141 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `KPMG_AIPulseQ1_2025_2026-02-04.md` | 25 |
| 2 | `KPMG_AIPulseQ2_2025_2026-02-04.md` | 30 |
| 3 | `KPMG_AIPulseQ3_2025_2026-02-04.md` | 21 |
| 4 | `KPMG_AIPulseQ4_2025_2026-02-04.md` | 40 |
| 5 | `KPMG_GlobalTechReport2026_2026-02-06.md` | 25 |

**Rationale:** Dedicated cluster for your most valuable longitudinal dataset. Mining these together enables Q1-to-Q4 trend identification that sequential processing misses.

### Cluster C: BCG Enterprise & Agentic AI (4 sources, 105 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `BCG_EmergingAgenticEnterprise_2026-02-04.md` | 25 |
| 2 | `BCG_AIAgentsCustomerExperience_2026-02-06.md` | 30 |
| 3 | `BCG_ConsumersTrustAI_2026-02-06.md` | 25 |
| 4 | `BCG_GenAIRiskCompliance_2026-02-06.md` | 25 |

**Rationale:** BCG reports share frameworks and case studies. Mining together reveals how BCG's agentic enterprise vision connects across customer experience, risk, compliance, and trust dimensions.

### Cluster D: Agentic Architecture & Technical Implementation (8 sources, 128 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `Cursor_ScalingAutonomousCoding_2026-02-06.md` | 15 |
| 2 | `Anthropic_CCompilerParallelClaudes_2026-02-06.md` | 15 |
| 3 | `Anthropic_OrchestrateClaudeCodeTeams_2026-02-06.md` | 20 |
| 4 | `Vercel_AgentsMdOutperformsSkills_2026-02-06.md` | 14 |
| 5 | `LangChain_AgentObservabilityEvaluation_2026-02-06.md` | 19 |
| 6 | `github_ContinuousAIInPractice_2026-02-06.md` | 15 |
| 7 | `Andrew_Pignanelli_AgentNativeEngineering_2026-02-06.md` | 15 |
| 8 | `Greg_Brockman_SoftwareDevelopmentRenaissance_2026-02-06.md` | 15 |

**Rationale:** All focused on how agents are built, orchestrated, and scaled. Technical implementation patterns, coordination mechanisms, and development methodology.

### Cluster E: Market Disruption, SaaS Repricing & Investment Trends (10 sources, 200 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `McKinsey_TechServicesAgenticAI_2026-02-06.md` | 25 |
| 2 | `The_AI_Daily_Brief_IsSoftwareDead_2026-02-06.md` | 20 |
| 3 | `VentureBeat_OpenClawMomentEnterprises_2026-02-07.md` | 21 |
| 4 | `YCombinator_OpenClawCreator_2026-02-07.md` | 25 |
| 5 | `No_Mercy_No_Malice_2026Predictions_2026-02-05.md` | 17 |
| 6 | `AI_News_Strategy_Daily_Amazon125BSecret_2026-02-04.md` | 20 |
| 7 | `Damian_Galarza_HowOpenClawWorks_2026-02-05.md` | 15 |
| 8 | `a16z_BigIdeasPart1_2026-02-04.md` | 18 |
| 9 | `a16z_BigIdeasPart2_2026-02-04.md` | 21 |
| 10 | `a16z_BigIdeasPart3_2026-02-04.md` | 30 |

**Rationale:** Sources focused on market-level disruption: SaaS repricing, OpenClaw impact on enterprise, capital reallocation, business model destruction/creation, and investment thesis predictions (a16z Big Ideas trilogy covers infrastructure modernization, enterprise agents, agent economics, and distribution channel disruption).

### Cluster F: AI Models, Capabilities & Predictions (10 sources, 192 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `AI_Explained_TwoBestModels_2026-02-06.md` | 20 |
| 2 | `Theo_t3gg_Opus46CodingModel_2026-02-06.md` | 20 |
| 3 | `Theo_t3gg_OpenAIWonAgain_2026-02-06.md` | 19 |
| 4 | `AI_News_Strategy_Daily_CEOBetPhilosophy_2026-02-06.md` | 19 |
| 5 | `AI_News_Strategy_Daily_Opus46Codex_2026-02-06.md` | 19 |
| 6 | `Vals_AI_VibeCodeBenchBehindScenes_2026-02-06.md` | 15 |
| 7 | `Stanford_HAI_Predictions2026_2026-02-04.md` | 23 |
| 8 | `Sequoia_ThisIsAGI_2026-02-04.md` | 17 |
| 9 | `METR_TimeHorizon_2026-02-04.md` | 18 |
| 10 | `You_com_2026AIPredictions_2026-02-05.md` | 20 |

**Rationale:** Sources about model capabilities, benchmarking, frontier predictions, and capability trajectories. What AI can do now and where it's heading.

### Cluster G: Agent Security, Governance & Ethics (6 sources, 132 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `AI_News_Strategy_Daily_ClawdbotMoltbotBreakdown_2026-02-04.md` | 20 |
| 2 | `The_AI_Daily_Brief_WhyMoltbookMatters_2026-02-04.md` | 20 |
| 3 | `The_AI_Daily_Brief_AgentSwarmsKimiK25_2026-02-04.md` | 17 |
| 4 | `Wes_Roth_ClawdbotSingularity_2026-02-04.md` | 18 |
| 5 | `David_Shapiro_MoltbookFuture_2026-02-04.md` | 20 |
| 6 | `Anthropic_ClaudesConstitution_2026-02-04.md` | 19 |
| 7 | `Wiz_HackingMoltbook_2026-02-08.md` | 21 |

**Rationale:** OpenClaw/Moltbot security incident analysis, agent governance frameworks, constitutional AI, and alignment challenges.

### Cluster H: Human Skills, Design & Work Transformation (10 sources, 214 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `TED_StopAIKillingCriticalThinking_2026-02-06.md` | 15 |
| 2 | `Every_WhatIsTaste_2026-02-06.md` | 15 |
| 3 | `McKinsey_SmartPeopleWrongCareers_2026-02-06.md` | 20 |
| 4 | `Dive_Club_KarlKochDesignEngineers_2026-02-07.md` | 24 |
| 5 | `AI_News_Strategy_Daily_VibeCodingPlayfulness_2026-02-07.md` | 23 |
| 6 | `AI_Jason_ClaudeCodeAgentTeams_2026-02-07.md` | 20 |
| 7 | `Theo_t3gg_AIMakesDevsDumb_2026-02-04.md` | 18 |
| 8 | `AI_News_Strategy_Daily_OpenAISlowingHiring_2026-02-04.md` | 19 |
| 9 | `Every_HowWeBuiltClaudie_2026-02-05.md` | 20 |
| 10 | `Every_NextChapterConsulting_2026-02-05.md` | 18 |

**Rationale:** How human skills, design thinking, developer practice, and consulting work are transforming. Includes both "what's at risk" and "what becomes more valuable."

### Cluster I: Data Infrastructure & Technical Foundations (5 sources, 108 DPs)

| # | File | DPs |
|---|------|-----|
| 1 | `Google_DeepMind_ScienceOfScalingAgents_2026-02-04.md` | 24 |
| 2 | `Fundamental_Whitepaper_2026-02-06.md` | 25 |
| 3 | `Venture_Beat_FundamentalsNEXUS_2026-02-06.md` | 15 |
| 4 | `The_AI_Daily_Brief_AIAccelerationGap_2026-02-04.md` | 18 |
| 5 | `AI_News_Strategy_Daily_SmartestAIBet_2026-02-04.md` | 18 |
| 6 | `AI_News_Strategy_Daily_InferenceCostSpike_2026-02-08.md` | 21 |

**Note:** This is a 9th cluster. If context is tight, it can be combined with Cluster D in Chat Session 2.

---

## Chat Session 1: Deep Extraction Mining (Clusters A-D)

### Prompt to Start This Session

```
Load the CRIS skill. I'm running the CRIS Rebuild Protocol, Chat Session 1.

Read the Rebuild Protocol at `_System/Workflows/Rebuild_Protocol.md` and execute the instructions for Chat Session 1: Deep Extraction Mining for Clusters A through D.
```

### What Claude Should Do

**Step 1: Create working directory**
```bash
mkdir -p _System/rebuild/cluster_mining
```

**Step 2: Spawn 4 parallel sub-agents** (one per cluster) using this prompt template for each:

---

**Sub-Agent Prompt Template (Theme Discovery):**

```
You are performing bottom-up theme discovery for the CRIS research system rebuild.

**Your task:** Read ALL extraction files in your assigned cluster and identify the strongest themes, patterns, and insights across them. You are NOT mapping evidence to pre-existing ideas. You are discovering what themes emerge naturally from the evidence.

**Your cluster: [Cluster Letter] — [Cluster Name]**

**Files to read (read ALL of them completely):**
[List all files with full paths: /CRIS_Research_System/02_Extractions/2026-02/filename.md]

**For each file:**
1. Read all data points (DPs) thoroughly
2. Note the DP numbers that contain the strongest, most distinctive findings

**After reading all files, produce this output:**

## Cluster [Letter]: [Name] — Theme Discovery

### Themes Identified

For each theme (identify 5-7):

#### Theme: [Descriptive Name]
- **Summary:** [2-3 sentences describing the pattern you see]
- **Strength:** Strong / Moderate / Emerging
- **Supporting DPs:**
  - [Source_Name] DP[#]: [One-line summary of what this DP contributes]
  - [Source_Name] DP[#]: [One-line summary]
  - [Continue for all relevant DPs — be comprehensive, list every DP that relates]
- **Cross-Source Connections:** [How do multiple sources reinforce or complicate this theme?]

### Cross-Cutting Observations
- [Patterns that span multiple themes within this cluster]
- [Tensions or contradictions between sources]
- [Signals that might connect to other clusters you can't see]

### Strongest Individual DPs (Top 10)
List the 10 most distinctive, insight-rich data points across all files:
| Source | DP# | Why It Stands Out |
|--------|-----|-------------------|
| [Source] | DP[#] | [One sentence] |

### Coverage Statistics
| Source File | Total DPs | DPs Referenced in Themes | Unreferenced DPs |
|-------------|-----------|--------------------------|-------------------|
| [filename] | [#] | [#] | [list DP numbers not referenced] |

Save your output to: _System/rebuild/cluster_mining/Cluster_[Letter]_[Name].md
```

---

**Step 3:** After all 4 sub-agents complete, verify outputs exist:
- `_System/rebuild/cluster_mining/Cluster_A_Enterprise_Adoption.md`
- `_System/rebuild/cluster_mining/Cluster_B_KPMG_Longitudinal.md`
- `_System/rebuild/cluster_mining/Cluster_C_BCG_Enterprise.md`
- `_System/rebuild/cluster_mining/Cluster_D_Agentic_Architecture.md`

### Done When
- [ ] All 4 cluster mining files exist with themes, DPs, and coverage statistics
- [ ] Each cluster file identifies 5-7 themes
- [ ] Coverage statistics show which DPs within each cluster were NOT referenced (these become targets for Chat Session 3)

---

## Chat Session 2: Deep Extraction Mining (Clusters E-I)

### Prompt to Start This Session

```
Load the CRIS skill. I'm running the CRIS Rebuild Protocol, Chat Session 2.

Read the Rebuild Protocol at `_System/Workflows/Rebuild_Protocol.md` and execute the instructions for Chat Session 2: Deep Extraction Mining for Clusters E through I.
```

### What Claude Should Do

**Step 1:** Verify `_System/rebuild/cluster_mining/` directory exists and contains Cluster A-D outputs from Session 1.

**Step 2: Spawn 5 parallel sub-agents** (one per cluster E through I) using the same Sub-Agent Prompt Template from Chat Session 1. Adjust cluster letter, name, and file lists accordingly.

**Step 3:** After all 5 sub-agents complete, verify outputs exist:
- `_System/rebuild/cluster_mining/Cluster_E_Market_Disruption.md`
- `_System/rebuild/cluster_mining/Cluster_F_AI_Models_Capabilities.md`
- `_System/rebuild/cluster_mining/Cluster_G_Security_Governance.md`
- `_System/rebuild/cluster_mining/Cluster_H_Human_Skills_Design.md`
- `_System/rebuild/cluster_mining/Cluster_I_Data_Infrastructure.md`

### Done When
- [ ] All 5 cluster mining files exist with themes, DPs, and coverage statistics
- [ ] All 9 cluster mining files now complete (A through I)
- [ ] Total themes identified across all clusters: should be 45-63 (5-7 per cluster x 9 clusters)

---

## Chat Session 3: Cross-Cluster Pattern Synthesis + Idea Reconciliation

### Prompt to Start This Session

```
Load the CRIS skill. I'm running the CRIS Rebuild Protocol, Chat Session 3.

Read the Rebuild Protocol at `_System/Workflows/Rebuild_Protocol.md` and execute the instructions for Chat Session 3: Cross-Cluster Pattern Synthesis and Idea Reconciliation.
```

### What Claude Should Do

**Step 1: Load all cluster mining outputs**
Read all 9 files from `_System/rebuild/cluster_mining/`.

**Step 2: Load comparison documents**
- Read current `06_Current_Understanding/Active_Ideas.md` (for comparison, NOT as starting point)
- Read `06_Current_Understanding/User_Observations.md` (these are preserved — Maicol's own insights that MUST be integrated into the new idea set)

**Step 3: Identify convergent themes**

Create a cross-cluster convergence map:

```markdown
## Cross-Cluster Convergence Map

### Convergent Theme: [Name]
- **Appears in clusters:** [list cluster letters]
- **Combined evidence strength:** [Strong/Moderate]
- **Key DPs across clusters:**
  - Cluster [X]: [Source] DP[#], [Source] DP[#]
  - Cluster [Y]: [Source] DP[#]
- **Synthesis:** [2-3 sentences: what does this pattern mean when you see it from multiple angles?]
```

**Step 4: Reconcile against current ideas**

For each of the current 8 Active Ideas, determine:

| Current Idea | Verdict | Rationale |
|-------------|---------|-----------|
| [Idea name] | Confirmed / Reframed / Merged / Retired / Expanded | [Why, based on what the full evidence base shows] |

For each convergent theme NOT represented by current ideas:
- Propose as a new idea with initial position statement

**Step 5: Draft the new idea set**

For each idea (new or confirmed/reframed), write:
- Idea name
- Status: Developing
- Confidence: Low / Medium / High
- Current Position: 2-4 sentences
- Drivers section: Initial observation, key sources, evolution, trigger
- Tags

Do NOT write full Supporting Evidence tables yet (that's Chat Session 4).

**Step 6: Integrate User Observations**
Map each of the 6 User Observations to the new idea set. Every observation must connect to at least one idea. If an observation doesn't fit any idea, that's a signal a new idea may be needed.

**Step 7: Save outputs**
- `_System/rebuild/Cross_Cluster_Convergence.md`
- `_System/rebuild/Idea_Reconciliation.md`
- `_System/rebuild/New_Active_Ideas_Draft.md`

### Done When
- [ ] Cross-cluster convergence map identifies all major themes
- [ ] Each current idea has a clear verdict (confirmed, reframed, merged, retired, expanded)
- [ ] New idea set drafted with positions and drivers (but NOT full evidence tables)
- [ ] All 6 User Observations mapped to new ideas
- [ ] All outputs saved to `_System/rebuild/`

---

## Chat Session 4: Weekly Learnings + Active Ideas (Full Evidence)

### Prompt to Start This Session

```
Load the CRIS skill. I'm running the CRIS Rebuild Protocol, Chat Session 4.

Read the Rebuild Protocol at `_System/Workflows/Rebuild_Protocol.md` and execute the instructions for Chat Session 4: Weekly Learnings and Active Ideas with full evidence.
```

### What Claude Should Do

**Step 1: Archive current outputs**

```bash
# Archive current Active Ideas
cp 06_Current_Understanding/Active_Ideas.md 07_Archive/Active_Ideas_pre_rebuild_2026-02-08.md

# Archive current Weekly Learnings (if not already archived)
cp 03_Weekly_Learnings/2026-Q1/WL_2026-02-07.md 03_Weekly_Learnings/2026-Q1/archive/WL_2026-02-07.md

# Archive current synthesis
cp 06_Current_Understanding/Current_Synthesis.md 06_Current_Understanding/archive/Current_Synthesis_2026-02-08_pre_rebuild.md
```

**Step 2: Load rebuild context**
- Read `_System/rebuild/New_Active_Ideas_Draft.md` (the new idea set from Session 3)
- Read `_System/rebuild/Cross_Cluster_Convergence.md`
- Read `06_Current_Understanding/User_Observations.md`
- Read `_System/Style_Guide.md`
- Read `_System/Citation_Contract.md`
- Read `_System/Data_Point_Normalization.md`

**Step 3: Build full Active Ideas with evidence (sub-agents)**

For each idea in the new set, spawn a sub-agent to gather comprehensive evidence:

**Sub-Agent Prompt (Evidence Gathering):**

```
You are gathering comprehensive evidence for one Active Idea in the CRIS research system rebuild.

**Idea:** [Idea Name]
**Current Position:** [From draft]
**Relevant Tags:** [From draft]

**Your task:** Read the extraction files listed below and identify ALL data points that support, challenge, or add nuance to this idea. Be comprehensive — the goal is to capture every relevant DP, not just the strongest ones.

**Files to read:**
[List the specific extraction files most likely relevant to this idea, based on the cluster mining outputs. Include 10-20 files per idea.]

**Output format:**

### Supporting Evidence for: [Idea Name]

#### Supporting Evidence Table
| Evidence | Source | DPs |
|----------|--------|-----|
| [Claim with specific data] | [Source_Name] | DP[#], DP[#] |

#### Counterarguments / Tensions
| Challenge | Source | DPs |
|-----------|--------|-----|
| [Counterpoint] | [Source_Name] | DP[#] |

#### Open Questions (evidence-informed)
- [Question raised by the evidence]

#### DPs Referenced
[Complete list of all (Source, DP#) pairs referenced, for coverage tracking]
```

**Step 4: Assemble final Active Ideas**

Combine the idea drafts from Session 3 with the evidence from sub-agents. Write the complete Active Ideas document using the structure from `_System/Idea_Lifecycle.md`:
- Current Position
- Drivers (Initial observation, Key sources, Evolution, Trigger)
- Supporting Evidence (full table)
- Counterarguments
- Open Questions
- Evolution Log (start fresh: "2026-02-08: Rebuilt from bottom-up analysis of 69 extractions")
- Related Ideas

Save to: `06_Current_Understanding/Active_Ideas.md`

**Step 5: Write rebuilt Weekly Learnings**

Using the Weekly Template (`08_Templates/Weekly_Template.md`), write a comprehensive Weekly Learnings document that synthesizes ALL 69 extractions. This is the "rebuild edition" — it covers the full extraction base, not just one week's additions.

**Critical synthesis requirements:**

1. **Evidence Density:**
   - Each tag section MUST cite 3-5+ sources minimum
   - Each major insight MUST have multiple supporting citations
   - Format: [Source1 DP#, DP#; Source2 DP#; Source3 DP#]
   - Avoid single-source claims; show convergence across sources

2. **Required Metadata per Tag Section:**
   - **Key Developments:** What's most significant in this synthesis (replaces "What Shifted" for comprehensive syntheses)
   - **Connection to Active Ideas:** Explicit links to Active Ideas with evidence
     ```markdown
     **Connection to Active Ideas:**
     - Idea 7 (Agent-Native Development): [How this tag's evidence supports/challenges this idea]
     - Idea 2 (Coordination Tax): [How this tag's evidence relates to this idea]
     ```

3. **Structure per Tag Section:**
   ```markdown
   ### #tag-name

   [Comprehensive synthesis paragraph 1 with citations]
   [Source1 DP#, DP#; Source2 DP#; Source3 DP#]

   [Comprehensive synthesis paragraph 2 with citations]
   [Source4 DP#; Source5 DP#, DP#]

   **Key Developments:**
   - [Most significant finding from this synthesis]

   **Connection to Active Ideas:**
   - Idea X (Name): [How evidence supports/challenges/expands this idea]
   - Idea Y (Name): [How evidence relates to this idea]
   ```

4. **Citation Quality:**
   - Follow Citation Contract strictly (bracket citations + metadata comments)
   - Every claim needs evidence; every paragraph needs sources
   - Read `_System/Style_Guide.md` for citation density standards

Key differences from normal weekly synthesis:
- Sources Processed table: ALL 69 sources
- Synthesis by Tag: comprehensive across all extractions, not just new ones
- Updates to Current Understanding: reference the new idea set
- Tag sections include Key Developments and Connection to Active Ideas metadata

Save to: `03_Weekly_Learnings/2026-Q1/WL_2026-02-08.md`

**Note:** The Weekly Learnings for a rebuild will be longer than normal. This is expected. Future weekly synthesis documents will cover incremental additions only.

### Done When
- [ ] Previous Active Ideas, Weekly Learnings, and Current Synthesis archived
- [ ] New Active Ideas written with full Supporting Evidence tables for every idea
- [ ] Every idea has comprehensive DP citations (not just top 3-5)
- [ ] Rebuilt Weekly Learnings covers all 69 sources
- [ ] Each tag section has 3-5+ source citations minimum
- [ ] Each tag section includes "Key Developments" subsection
- [ ] Each tag section includes "Connection to Active Ideas" subsection
- [ ] All citations follow the Citation Contract (bracket citations + metadata comments)
- [ ] Evidence density feels comprehensive, not shallow

---

## Chat Session 5: Current Synthesis + Talking Points + System Updates

### Prompt to Start This Session

```
Load the CRIS skill. I'm running the CRIS Rebuild Protocol, Chat Session 5.

Read the Rebuild Protocol at `_System/Workflows/Rebuild_Protocol.md` and execute the instructions for Chat Session 5: Current Synthesis, Talking Points, and System Updates.
```

### What Claude Should Do

**Step 1: Load context**
- Read new `06_Current_Understanding/Active_Ideas.md` (rebuilt in Session 4)
- Read new `03_Weekly_Learnings/2026-Q1/WL_2026-02-08.md` (rebuilt in Session 4)
- Read `06_Current_Understanding/User_Observations.md`
- Read `08_Templates/Current_Synthesis_Template.md`
- Read `08_Templates/Talking_Points_Template.md`
- Read `_System/Style_Guide.md`

**Step 2: Write Current Synthesis**

Using the Current Synthesis Template, write a comprehensive position statement based on the rebuilt Active Ideas and Weekly Learnings.

**Critical requirements:**

1. **Summary Structure (2-3 paragraphs):**
   - First paragraph: Set the strategic context and state the primary insight
   - Second paragraph: Preview the key takeaways narratively (don't just list them — show how they connect)
   - Third paragraph: Identify the most important open questions or tensions
   - Summary should flow naturally INTO the Key Takeaways section
   - Think: "If someone only reads the Summary, they should understand the core narrative"

2. **Key Takeaways (8-12 takeaways with RICH evidence density):**
   - **MINIMUM REQUIREMENT:** Each takeaway MUST cite 3-5+ sources
   - **TARGET:** 5-7 citations per takeaway for major claims
   - **Structure per takeaway:**
     - Bold title stating the core thesis
     - 2-4 sentences of elaboration with citations embedded throughout
     - Show the evidence chain, not just the conclusion

   **Example of proper evidence density:**
   ```markdown
   **1. Agentic AI Breaks Employment Taxonomy; Duality Creates Operational Leverage**

   Agentic AI exhibits simultaneously tool-like and worker-like properties, forcing
   organizations to resolve four distinct operational tensions [BCG_EmergingAgenticEnterprise
   DP2, DP5, DP22]. Seventy-six percent of users experience systems as collaborative
   coworkers [BCG DP2], with ninety-five percent job satisfaction when embracing this
   duality [BCG DP22; McKinsey_AgentsRobotsSkillPartnerships DP14]. Traditional management
   structures assume binary classification [McKinsey DP7; Anthropic_ClaudesConstitution DP11],
   but agentic systems force organizations to manage ambiguity across responsibility
   allocation, capability attribution, outcome ownership, and error liability
   [BCG DP5; Google_DeepMind_ScienceOfScalingAgents DP14].
   ```

3. **Active Ideas Table:**
   - Include: Idea, Status, Core Thesis, Key Evidence columns
   - Keep concise (this is a summary table, not full evidence)

4. **Open Threads:**
   - Pull from rebuilt Weekly Learnings
   - Include category taxonomy if present (Time-Bounded, Ongoing, Strategic, etc.)
   - Keep focused on the most important open questions

5. **Evidence Base:**
   - Update system stats (extractions, DPs, ideas, observations)
   - Note coverage percentage vs. pre-rebuild baseline

6. **What's Changed:**
   - Describe the rebuild scope (bottom-up analysis of all 69 extractions)
   - List new ideas vs. confirmed/reframed ideas
   - Note coverage improvement from pre-rebuild baseline
   - Explain what this rebuild reveals about prior synthesis limitations

**Quality checks before saving:**
- [ ] Every Key Takeaway has minimum 3 citations (target 5-7)
- [ ] Summary narratively connects to and previews the takeaways
- [ ] No single-source claims in Key Takeaways
- [ ] Evidence density feels comprehensive, shows convergence across sources
- [ ] Citations follow Citation Contract (brackets + metadata comments)

Save to: `06_Current_Understanding/Current_Synthesis.md`

**Step 3: Write Talking Points**

Using the Talking Points Template, create conversation-ready points based on the rebuilt synthesis. 3-5 talking points, each with:
- The Point, Why It Matters, Who Cares, Evidence, Your Angle, Pivot Phrases

Save to: `09_Deliverables/Talking_Points/TP_2026-02-08.md`

**Step 4: Update structural files**

1. **`03_Weekly_Learnings/_Weekly_Header.md`:**
   - Add entry for WL_2026-02-08 (Rebuild Edition)
   - Add new "Sources Needing Attention" section (should be empty after rebuild)
   - Update open threads

2. **`06_Current_Understanding/_Index.md`:**
   - Update idea count, status counts
   - Update Last Synthesis date
   - Update observation count

3. **`Tags.md`:**
   - Add any new tags that emerged from the rebuild
   - Promote any "Emerging" tags that now have 3+ sources

4. **`02_Extractions/_Extraction_Index.md`:**
   - No structural changes needed, but verify accuracy

**Step 5: Run coverage verification**

Write and run a Python script that:
1. Counts all unique (Source, DP#) citations across the new Active Ideas, Weekly Learnings, and Current Synthesis
2. Compares against the extraction index totals
3. Reports the new coverage percentage
4. Compares against the 9.4% baseline

Save verification output to: `_System/rebuild/Coverage_Verification.md`

**Step 6: Clean up rebuild working directory**

The `_System/rebuild/` directory contains intermediate files. These are valuable for lineage but not needed for ongoing operation. Keep them as an archive of the rebuild process.

### Done When
- [ ] Current Synthesis written and saved
- [ ] Summary narratively previews the Key Takeaways
- [ ] Each Key Takeaway has 3-5+ citations minimum (targeting 5-7 for major claims)
- [ ] No single-source claims in Key Takeaways
- [ ] Evidence density shows convergence across multiple sources
- [ ] Talking Points written and saved
- [ ] Weekly Header updated with rebuild entry and Sources Needing Attention section
- [ ] _Index.md updated
- [ ] Tags.md updated if needed
- [ ] Coverage verification shows improvement over 9.4% baseline
- [ ] Target: 25-40% coverage (achieving 100% is not the goal — editorial judgment still matters)

---

## Post-Rebuild: Transition to Revised Workflow

After completing all 5 chat sessions, the CRIS system will be operating on:
- A new Active Ideas set discovered bottom-up from all 69 extractions
- A rebuilt Weekly Learnings covering the full evidence base
- A new Current Synthesis reflecting the rebuilt position
- Updated Talking Points

Going forward, use the **Revised Weekly Synthesis Workflow** (`_System/Workflows/Weekly_Synthesis.md`) which includes the phased approach with extraction mining, coverage sweeps, and sequential document production. This workflow prevents the coverage problem from recurring as new extractions are added.

---

## Troubleshooting

**"I ran out of usage mid-session"**
Each session is self-contained. When you return, start a new chat with the session prompt. Claude will read the Protocol and pick up from the correct session based on what files exist in `_System/rebuild/`.

**"A sub-agent failed or produced incomplete output"**
Re-run just that sub-agent. The cluster mining files are independent — one failure doesn't invalidate others.

**"The new idea set feels wrong"**
Session 3 produces a draft. You can manually edit `_System/rebuild/New_Active_Ideas_Draft.md` between Sessions 3 and 4 to adjust ideas before the full evidence gathering happens.

**"Coverage didn't improve enough"**
If coverage is below 20% after the rebuild, the likely cause is that Session 4 sub-agents didn't load enough extraction files per idea. Re-run Session 4 with broader file assignments.
