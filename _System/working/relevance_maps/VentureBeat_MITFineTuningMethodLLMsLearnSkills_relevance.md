# DP Relevance Map: MIT Fine-Tuning Method (SDFT)
**Source:** VentureBeat_MITFineTuningMethodLLMsLearnSkills_2026-02-14
**Created:** 2026-02-15
**Total DPs:** 10

---

## 1. Core Capability Endures (Idea #4)

**Relevance Strength:** DIRECT
**Key DPs:** DP1, DP3, DP6

**Analysis:**
SDFT directly addresses the endurance problem—models maintain general reasoning capability while accumulating new specialized skills. DP1 establishes the core promise (learning without forgetting). DP3 contrasts this with traditional fine-tuning collapse. DP6 demonstrates sequential accumulation across three separate skill domains without regression.

**Research Implication:**
Core capabilities are technically preservable with proper architecture. The question shifts from *whether* models can retain core abilities to *what structures enable* retention. This validates the Active Idea but adds architectural specificity: knowledge retention requires in-context learning from frozen teachers (inference-time model guidance).

**Evidence Strength:** Strong empirical validation (70.2% vs 66.2%, 98% knowledge accuracy)

---

## 2. Data Quality Bottleneck (Idea #11)

**Relevance Strength:** STRONG
**Key DPs:** DP4, DP5, DP10

**Analysis:**
DP4 reveals why on-policy learning (model-generated training data) becomes necessary: subjective enterprise tasks cannot be measured with explicit reward functions. DP5 shows that knowledge injection (structured training data design) matters more than scale—models trained on well-structured fictional scenarios achieve 98% accuracy. DP10 suggests the solution: inference-phase compute redirected toward continuous learning from real user interactions.

**Research Implication:**
Data quality bottleneck is not solved by SDFT—it's restructured. Instead of requiring curated supervised training datasets, the bottleneck shifts to designing inference-time feedback loops that capture meaningful signal from user interactions. The computational investment (2.5x cost, 4x training time) becomes justified if inference-phase data quality improves.

**Open Thread Connection:** Data Quality Economics (Open Thread #5)—what's the ROI of 2.5x compute investment for models that improve continuously during inference?

**Evidence Strength:** Medium (theoretical framing more than empirical cost-benefit analysis)

---

## 3. Infrastructure-Application Divergence (Idea #12)

**Relevance Strength:** STRONG
**Key DPs:** DP2, DP7, DP8, DP9

**Analysis:**
SDFT creates distinct infrastructure implications: DP2 and DP9 show consolidation benefit (single model instead of model zoo, reduced hosting costs). DP7 and DP8 show infrastructure cost trade-offs (2.5x training compute, 4B parameter minimum). The application layer (enterprise multi-skill deployment) and infrastructure layer (training-cost vs hosting-cost optimization) are pulling in opposite directions.

**Research Implication:**
This is a clean case of divergence: applications want consolidated single models; infrastructure economics create pressure toward selective specialization. The 2.5x training cost might be acceptable only for high-value domains (legal, medical) where inference cost reduction justifies it. Low-value specialized skills might remain in separate smaller models. This suggests enterprises will end up with *hybrid* architectures: unified core models for business-critical domains + specialized lightweight models for peripheral tasks.

**Evidence Strength:** Strong (concrete cost metrics provided)

---

## 4. Measurement Framework Reckoning (Open Thread #1)

**Relevance Strength:** DIRECT
**Key DPs:** DP4, DP5, DP7

**Analysis:**
DP4 explicitly states the measurement problem: "defining a mathematical reward function is difficult or impossible" for subjective enterprise tasks. DP5 suggests measurement workaround (knowledge accuracy on reasoning questions as proxy). DP7 introduces new measurement challenge (how to value the 2.5x compute cost against inference savings?).

**Research Implication:**
SDFT forces enterprise measurement frameworks to evolve. Traditional ML metrics (accuracy, F1) are insufficient. Enterprises need to measure: (a) knowledge retention quality across skills, (b) inference-time feedback signal quality, (c) total cost-of-ownership trade-offs. This is not a technical problem but an *organizational* problem—enterprises lack measurement culture for continuous learning systems.

**Evidence Strength:** Strong (gap clearly articulated, workaround demonstrated)

---

## 5. Self-Acceleration Governance (Open Thread #8)

**Relevance Strength:** STRONG
**Key DPs:** DP10

**Analysis:**
DP10 presents the self-acceleration scenario: inference-phase compute (majority of global compute spend) is redirected toward model improvement. This creates a positive feedback loop: deployed models improve continuously, reducing retraining cycles, enabling faster skill accumulation.

**Research Implication:**
Self-acceleration is not hypothetical—SDFT makes it technically feasible. However, governance question becomes urgent: who controls what the model learns from inference-phase interactions? What prevents models from learning harmful patterns from adversarial user interactions? SDFT requires new operational frameworks for continuous learning oversight.

**Evidence Strength:** Medium (technical feasibility demonstrated, governance implications not addressed in source)

---

## 6. 2026 Bifurcation & Orchestration Infrastructure (Ideas #6, #14)

**Relevance Strength:** MODERATE
**Key DPs:** DP2, DP8, DP9

**Analysis:**
SDFT enables two divergent enterprise paths by 2026: (a) unified model approach (consolidate to single 4B+ parameter model), or (b) hybrid orchestration (maintain specialized models for low-compute domains, consolidate only for high-value domains). DP8's 4B parameter minimum creates a clear bifurcation line—organizations with compute budget for 4B+ models move toward consolidation; those without maintain multi-model infrastructure.

**Research Implication:**
2026 bifurcation is becoming concrete. The choice is no longer "centralized vs distributed models" but "consolidated core vs distributed specialists." This requires orchestration infrastructure that intelligently routes queries to either the unified model (for multi-skill queries) or specialized models (for single-domain, compute-constrained scenarios).

**Evidence Strength:** Medium (architectural capability demonstrated, market adoption unknowable)

---

## Cross-Cutting Patterns

| Pattern | Relevant DPs | Insight |
|---------|-------------|---------|
| **Compute Economics** | DP7, DP8, DP9 | Consolidation benefits (inference cost) offset training costs (2.5x compute) only for high-value domains |
| **Knowledge Representation** | DP5, DP6 | Structured data quality matters more than scale; models internalize reasoning patterns, not just facts |
| **Continuous Improvement** | DP10 | Inference-phase compute becomes primary improvement vector; training-phase optimization becomes secondary |
| **Architectural Constraints** | DP8 | 4B parameter minimum creates market segmentation: enterprise (can afford consolidation) vs SMB (remain distributed) |

---

## Synthesis Readiness

**High Confidence Updates:**
- **Core Capability Endures:** Validates with architectural specificity (in-context learning as mechanism)
- **Infrastructure-Application Divergence:** Concrete cost trade-offs enabling prediction of hybrid architectures

**Requires Further Research:**
- **Measurement Framework:** DP4-5 identify problem but not full solution; need case studies of enterprise measurement adoption
- **Self-Acceleration Governance:** Technical feasibility shown; governance framework required
- **Data Quality Bottleneck:** Problem restructured, not solved; need data on inference-phase feedback quality

**Open Questions for Synthesis:**
1. What is the actual market boundary for 4B parameter consolidation? (Cost per user? Domain complexity?)
2. How do enterprises currently measure knowledge retention across sequential skill training?
3. What organizational structures enable effective inference-phase feedback governance?

---

## Tags Summary
- `#model-capabilities` (DP1, DP2, DP3, DP5, DP6, DP8) - 6 DPs
- `#infrastructure` (DP2, DP3, DP7, DP8, DP9) - 5 DPs
- `#skill-formation` (DP1, DP4, DP5, DP6) - 4 DPs
- `#measurement-framework-reckoning` (DP4, DP7) - 2 DPs
- `#roi-measurement` (DP9) - 1 DP
- `#self-acceleration` (DP10) - 1 DP

