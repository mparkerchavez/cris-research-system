# DP Relevance Map
**Source:** METR - Clarifying Limitations of Time Horizon
**Analysis Date:** 2026-02-15
**Processed File:** METR_ClarifyingLimitationsOfTimeHorizon_2026-02-14.md

---

## 1. Direct Active Idea Alignment

### Idea 4: Core Capability Endures
- **DP1:** Time horizon measures replacement labor capability, not execution speed; relative ranking remains stable even with domain variance
- **DP11:** Long-term trajectory (slope/doubling rate) is more predictive than absolute horizon snapshots
- **Relevance:** Validates that underlying capability growth rate persists as fundamental metric, even as specific measurements vary

### Idea 10: Observability Imperative
- **DP2:** 2x error margins in each direction require humility in model comparisons; false precision undermines decision-making
- **DP8:** Human baseline conventions introduce >1.25x uncertainty independent of model capability
- **DP9:** Time horizon alone insufficient—requires logging human overhead (prompting, verification, rework) via Cursor logs, screen recordings
- **Relevance:** Direct mandate for richer observability beyond benchmark scores; measurement uncertainty demands operational transparency

### Idea 11: Data Quality Bottleneck
- **DP5:** Monetary value (engineering-hours proxy) shows zero correlation with success rates on SWE-Lancer; benchmark may not capture real-world distribution
- **DP7:** RLVR training on automatically-gradable tasks creates distribution mismatch vs real-world feedback loops
- **Relevance:** Core data quality issue—benchmarks optimized for trainability, not real-world task properties

### Idea 3: Multi-Dimensional Implementation Chasm
- **DP3:** Domain variance spans 40-100x (software/research ~4-6h vs visual computer use ~2-5min)
- **DP4:** Coffee-making 2-minute horizon vs software benchmarks reveals physical-world capability gap
- **Relevance:** Quantifies dimensionality gaps; time horizon alone misses orders-of-magnitude variance across task categories

### Idea 1: Tool-Coworker Duality
- **DP10:** Reliability-critical tasks require 98%+ success, untouchable by time horizon improvements
- **DP3 + DP9:** Multi-turn collaboration on months-long tasks not captured in solo autonomous benchmarks
- **Relevance:** Highlights tasks where AI remains tool (requires oversight) vs potential coworker (autonomous); time horizon cannot bridge this distinction

---

## 2. Open Thread Connections

### Open Thread 1: Measurement Framework (High Priority)
**DPs:** 2, 6, 7, 8, 9
- Error margins, benchmark selection bias, RLVR distribution mismatch, human baseline variance all distort measurement reliability
- DP9 explicitly prescribes solution path: rich logging of human overhead
- **Action:** Framework must account for measurement uncertainty *and* human operational costs

### Open Thread 5: Data Quality Economics
**DPs:** 5, 7, 9
- DP5: Correlation breakdown between monetary value and success suggests metrics don't scale to real distribution
- DP7: Automatically-gradable training creates selection bias
- DP9: Rich data (logs) required, but collection cost/feasibility unclear
- **Action:** Explore trade-off between measurement precision and collection economics

### Open Thread 6: Trust Architecture
**DPs:** 10, 9
- DP10: Hard reliability ceiling (98%+) for entire task categories independent of time horizon
- DP9: Trust requires verification overhead measurement
- **Action:** Decompose tasks by trust requirements; map time horizon gains against trust barriers

### Open Thread 9: Work Intensification Governance
**DPs:** 3, 9, 10
- DP3: Domain-specific capability variance requires domain-specific governance
- DP9: Overhead logging reveals hidden human effort (prompting, verification, rework)
- DP10: Reliability constraints create "untouchable" task categories
- **Action:** Governance frameworks must account for capability heterogeneity and hidden labor

---

## 3. Emergent Tensions

### Tension A: Relative vs Absolute Framing
- **DP1 + DP11:** Time horizon excels at *relative capability comparison* (doubling every 6-7 months) but fails as *absolute automation feasibility* metric
- **Implication:** Cannot directly use time horizon estimates for timeline forecasting without task distribution assumptions (DP11 shows 2028-2050 range for automated coder AI depending on difficulty growth model)

### Tension B: Benchmark-Reality Divergence
- **DP5 + DP7 + DP9:** Benchmarks are internally consistent but systematically misaligned with real-world task properties:
  - DP5: Real-world value doesn't predict success
  - DP7: RLVR training exploits automatically-gradable properties not present in real work
  - DP9: Real-world overhead unmeasured in benchmarks
- **Implication:** Narrow focus on time horizon improvements may miss that actual productivity gains require solving *human overhead* problem

### Tension C: Scaling Across Domains
- **DP3 + DP4 + DP10:** Capabilities don't scale uniformly across domains:
  - DP3: Software/research 40-100x better than visual computer use
  - DP4: Coffee-making at 2 minutes shows sharp drop in physical tasks
  - DP10: Entire categories (reliability-critical) stay locked regardless of time horizon
- **Implication:** Automation strategy must be domain-aware; time-horizon improvements insufficient for domains with hard reliability requirements or poor perception

---

## 4. Evidence Tier Mapping

### Tier 1 - Direct Quantification
- **DP2:** 2x error margins (empirical)
- **DP3:** 40-100x domain variance (empirical)
- **DP4:** 2-minute coffee-making horizon (empirical)
- **DP8:** >1.25x human baseline variance (empirical)

### Tier 2 - Mechanism/Logic
- **DP1:** Time horizon definition as labor replacement capacity
- **DP6:** Benchmark design selection bias (logical structure)
- **DP7:** RLVR training distribution mismatch (mechanism)
- **DP10:** Reliability ceiling for critical tasks (logic)

### Tier 3 - Inference/Extrapolation
- **DP5:** Monetary value correlation absence (absence of expected signal)
- **DP9:** Operational overhead measurement requirements (prescriptive inference)
- **DP11:** Timeline projection range (assumption-dependent)

---

## 5. Conflict Resolution & Hierarchy

**Highest Priority:** DP1 (definition clarity) supersedes all interpretation debates
**Second Priority:** DP2 + DP8 (measurement uncertainty) condition all forecasting claims
**Third Priority:** DP10 (reliability ceiling) establishes task categories where time horizon is irrelevant
**Synthesis:** Time horizon is valid relative metric for improving solvable tasks; becomes irrelevant below ~98% success threshold or across 40-100x domain gaps

---

## 6. Integration Path for Weekly Learnings

### Key Learning to Extract
1. **Epistemological Reframe:** Time horizon measures *capability slope* better than *absolute automation feasibility*—this distinction resolves many precision debates
2. **Measurement Humility:** 2x error margins + domain variance + benchmark selection bias create >5x total uncertainty band; false precision undermines strategy
3. **Hidden Bottleneck:** Actual work automation depends on human overhead (DP9), not time horizon alone—Cursor logs/screen recordings become critical observability
4. **Task Stratification:** Hard ceiling at 98% reliability + 40-100x domain variance means time horizon improvements apply only to specific task subsets; requires decomposition
5. **Benchmark-Reality Mismatch:** Solo autonomous solo performance doesn't predict months-long collaborative work; gap is generalization issue, not measurement issue

### Connections to Current Ideas
- Reinforces **Observability Imperative (10)** with specific measurement prescriptions
- Grounds **Data Quality Bottleneck (11)** in benchmark distribution properties
- Operationalizes **Multi-Dimensional Implementation Chasm (3)** with 40-100x quantification
- Strengthens **Core Capability Endures (4)** by distinguishing relative vs absolute metrics

---

## Extracted from Analysis
- **Total DPs:** 11
- **DPs with quantified evidence:** 5 (DP2, DP3, DP4, DP8, DP11)
- **Open threads directly addressed:** 5/10 (Measurement Framework, Data Quality Economics, Trust Architecture, Work Intensification Governance, Orchestration N/A)
- **New tensions identified:** 3 (Relative vs Absolute, Benchmark Divergence, Domain Scaling)
- **Capability to immediately synthesize:** High—sufficient evidence to revise timeline assumptions and measurement frameworks
