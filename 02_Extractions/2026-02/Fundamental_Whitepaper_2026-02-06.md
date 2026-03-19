# Fundamental: NEXUS Whitepaper

## Metadata
- **Source:** Fundamental
- **Published:** 2024
- **Processed:** 2026-02-06
- **Type:** PDF
- **Original Location:** 01_Raw_Inputs/2026-02/2026-02-01_to_07/Fundamental_Whitepaper.pdf

## Overview
"Developing Foundation Models for Real-World Tabular Data" by Marta Garnelo and Wojciech Marian Czarnecki is a foundational whitepaper that introduces the concept of the Fundamental Tabular Process (FTP) and explores how foundation models can effectively handle real-world tabular data through systematic decomposition of probability distributions.

---

## Data Points

**DP1:** General Purpose Methods as Foundation
- **Anchor:** "great power of general purpose methods, of methods that continue to scale"
- **Citation:** (p. 2)
- **Tags:** #model-capabilities, #deployment-stages
- **Insight:** The paper draws on Richard Sutton's "Bitter Lesson" to establish that scalable, learning-based systems outperform human-crafted solutions. This principle underpins the entire approach to developing universal predictors for tabular data.

**DP2:** The Bitter Lesson Redux in Tabular Domain
- **Anchor:** "the era of human-crafted solutions in machine learning is coming to an end"
- **Citation:** (p. 2)
- **Tags:** #agentic-workflows, #adoption-barriers
- **Insight:** Despite LLMs proving the Bitter Lesson principle in NLP, tabular data still heavily relies on handcrafted features and domain-specific approaches, suggesting an opportunity gap in applying foundation model principles to this domain.

**DP3:** Fundamental Tabular Process Definition
- **Anchor:** "Fundamental Tabular Process (FTP) - joint probability distribution that is Kolmogorov-consistent"
- **Citation:** (p. 4)
- **Tags:** #model-capabilities, #use-case-development
- **Insight:** FTP provides the mathematical framework for decomposing tabular prediction problems into three critical components, enabling more systematic development of foundation models for structured data.

**DP4:** The World Component (W)
- **Anchor:** "The Real World - a single, consistent reality that imposes certain rules"
- **Citation:** (p. 4)
- **Tags:** #model-capabilities, #trust-fairness
- **Insight:** The framework recognizes that foundation models must incorporate knowledge about the world's consistent structure, rules, and priors as a foundational layer distinct from task and user-specific knowledge.

**DP5:** Sample Complexity Reduction Through Decomposition
- **Anchor:** "significantly reduce the sample complexity compared to classical ML algorithms"
- **Citation:** (p. 6)
- **Tags:** #deployment-bottleneck, #skill-formation
- **Insight:** By explicitly modeling FTP components, foundation models can achieve dramatic sample efficiency improvements over classical algorithms, addressing a critical adoption barrier in tabular ML applications.

**DP6:** Pre-training Regime Strategy
- **Anchor:** "functions of practical interest occupy a meaningful part of the probability distribution"
- **Citation:** (p. 6)
- **Tags:** #data-quality, #deployment-stages
- **Insight:** Strategic pre-training setup is essential to ensure that relevant task functions have meaningful probability mass, rather than classical approaches that distribute uniformly across hypotheses.

**DP7:** Synthetic vs. Real Data Generation
- **Anchor:** "Training sets for pre-training tabular models are frequently synthetic"
- **Citation:** (p. 6)
- **Tags:** #data-quality, #roi-measurement
- **Insight:** The field relies heavily on synthetic data generation for pre-training, creating a research challenge around distributional alignment between synthetic training and real-world deployment.

**DP8:** Task-Context Specificity
- **Anchor:** "not every instance of a concept should be interpreted identically"
- **Citation:** (p. 9)
- **Tags:** #use-case-development, #trust-fairness, #equity-paradox
- **Insight:** The "Local Reality" principle acknowledges that identical categorical variables may have different meanings in different task contexts, preventing naive universalization and requiring context-aware modeling.

**DP9:** Core Crystallized Message
- **Anchor:** "drastic reduce sample complexity of novel tasks far beyond classical ML or LLMs"
- **Citation:** (p. 10)
- **Tags:** #model-capabilities, #competitive-disruption
- **Insight:** The paper's central value proposition: tabular foundation models that explicitly model FTP components can outperform both classical algorithms and current-day LLMs on structured data tasks through superior sample efficiency.

**DP10:** Model Landscape Characterization
- **Anchor:** "Characterisation of tabular prediction model landscape - Traditional to Task-specific models"
- **Citation:** (p. 12)
- **Tags:** #deployment-stages, #vendor-strategy
- **Insight:** Models are systematized across dimensions: pre-training vs. task-specific training phases, and whether they explicitly model p(c), p(f), or p(w) - enabling comparative analysis across the research landscape.

**DP11:** Zero-Shot Model Classification
- **Anchor:** "Zero-shot models - TabPFN, TabICL - capability without task-specific training"
- **Citation:** (p. 12)
- **Tags:** #model-capabilities, #workforce-transformation
- **Insight:** Emerging zero-shot models represent a shift toward capability without explicit task-specific fine-tuning, reducing deployment friction and enabling faster model adaptation.

**DP12:** Fine-Tuned Model Approaches
- **Anchor:** "Fine-tuned models including CARTE, TabStar, XTab - explicit modelling of p(f)"
- **Citation:** (p. 12)
- **Tags:** #deployment-stages, #adoption-barriers
- **Insight:** This model class explicitly incorporates user-specific knowledge (p(f)), acknowledging that one-size-fits-all models may be suboptimal and requiring adaptation mechanics.

**DP13:** Theoretical Foundations
- **Anchor:** "goal is not to provide narrow, overly formalised specification"
- **Citation:** (p. 10)
- **Tags:** #model-capabilities, #research-orientation
- **Insight:** The paper prioritizes intuitive and mathematical motivation over rigid formalization, providing conceptual grounding for diverse research approaches within the FTP framework.

**DP14:** Scaling and Engineering Challenges
- **Anchor:** "tough engineering ones such as how does one scale to billions of in-context points"
- **Citation:** (p. 15)
- **Tags:** #agentic-complexity-barriers, #deployment-bottleneck
- **Insight:** Critical engineering challenges remain around scaling in-context learning capabilities to massive data volumes, representing a key frontier for tabular foundation models.

**DP15:** Training Regime Questions
- **Anchor:** "what are the best training regimes to model each components?"
- **Citation:** (p. 15)
- **Tags:** #data-quality, #risk-governance
- **Insight:** Despite theoretical clarity on FTP decomposition, optimal training approaches for each component remain open research questions without established best practices.

**DP16:** Avoiding Bitter Lesson Repetition
- **Anchor:** "How do we avoid the risks of repeating 'The Bitter Lesson'"
- **Citation:** (p. 15)
- **Tags:** #adoption-barriers, #executive-awareness-gap
- **Insight:** The field must consciously resist reverting to hand-crafted solutions and human-engineering-heavy approaches, requiring cultural and methodological discipline in research direction.

**DP17:** Field Maturity Assessment
- **Anchor:** "number of positive results and maturity of related areas proves challenge is ripe"
- **Citation:** (p. 15)
- **Tags:** #model-capabilities, #investment-trends
- **Insight:** The convergence of positive empirical results and theoretical maturity in adjacent areas positions tabular foundation models as a high-probability research frontier.

**DP18:** Opportunity Characteristics
- **Anchor:** "rare opportunity to be at forefront of nascent field nearly guaranteed to work"
- **Citation:** (p. 15)
- **Tags:** #competitive-disruption, #investment-trends
- **Insight:** Tabular foundation models represent an unusually high-confidence research area given the combination of theoretical grounding, empirical validation, and large untapped market opportunity.

**DP19:** Open Questions Spanning Theory and Practice
- **Anchor:** "open questions spanning theoretical, engineering, and scientific endeavours"
- **Citation:** (p. 15)
- **Tags:** #agentic-complexity-barriers, #measurement-framework-reckoning
- **Insight:** The field faces multi-dimensional research challenges from formal theory (invariances/equivariances) through engineering (scaling) to empirical science (optimal training regimes).

**DP20:** Foundation Model Universalism Boundary
- **Anchor:** "foundation models - universal predictor contains knowledge about the world"
- **Citation:** (p. 4)
- **Tags:** #model-capabilities, #capability-overhang
- **Insight:** Foundation models for tabular data require explicit modeling of world knowledge as a universal layer, distinct from the LLM approach where world knowledge is primarily emergent from language.

**DP21:** Categorical Variable Complexity
- **Anchor:** "table with 10 categorical columns with 35 distinct categories each"
- **Citation:** (p. 8)
- **Tags:** #deployment-bottleneck, #data-quality
- **Insight:** Even moderately-sized tabular problems present combinatorial complexity challenges (10^35 potential combinations) that demand principled modeling approaches rather than brute-force methods.

**DP22:** Implicit vs. Explicit Probability Modeling
- **Anchor:** "signals probability being modelled explicitly while stands for implicit modelling"
- **Citation:** (p. 12)
- **Tags:** #model-capabilities, #interpretability-transparency
- **Insight:** Models vary in whether they explicitly represent probability components or learn them implicitly, with trade-offs between transparency and empirical performance.

**DP23:** Transfer Learning Advantage
- **Anchor:** "learn a new task on top much faster than if had to learn from scratch"
- **Citation:** (p. 7)
- **Tags:** #roi-measurement, #workforce-transformation
- **Insight:** Foundation model pre-training enables dramatic acceleration in task-specific learning for novel tabular problems, providing measurable ROI through reduced data and compute requirements.

**DP24:** Multi-Stage Training Architecture
- **Anchor:** "PT and TST stand for pre-training and task-specific training respectively"
- **Citation:** (p. 12)
- **Tags:** #deployment-stages, #skill-formation
- **Insight:** The two-stage training paradigm (pre-training then task-specific) represents a systematic approach to progressive specialization, enabling both generalist capabilities and task optimization.

**DP25:** Context and Observations Role
- **Anchor:** "Given data context as well as collection of facts and observations about world"
- **Citation:** (p. 4)
- **Tags:** #use-case-development, #risk-governance
- **Insight:** FTP explicitly incorporates both contextual variables and observational facts, recognizing that tabular prediction requires grounding in both structured information and empirical evidence.

---

## Notable Quotes

**Quote 1:** "One thing that should be learned from the bitter lesson is the great power of general purpose methods, of methods that continue to scale with increased computation even as the available computation becomes very great." — Richard Sutton (cited p. 2)

**Quote 2:** "By modelling each of the components of the Fundamental Tabular Process, one can hope to drastically reduce the sample complexity of novel supervised learning tasks, far beyond what any classical ML algorithm, or a current-day LLM, can achieve." (p. 10)

**Quote 3:** "It is an extremely rare opportunity in the world of machine learning to be at the forefront of a nascent field which is nearly guaranteed to work. Tabular Foundation Models, as of today, satisfy this requirement." (p. 15)

**Quote 4:** "The main goal of our reasoning so far is not to provide a narrow, overly formalised specification, but rather to motivate on an intuitive and a mathematical level, the decomposition of a universal predictor." (p. 10)

**Quote 5:** "not every instance of a concept should be interpreted identically" — Local Reality Principle (p. 9)

---

## Initial Observations

This whitepaper represents a significant theoretical and practical contribution to the emerging field of tabular foundation models. The authors introduce the Fundamental Tabular Process (FTP) as a principled decomposition framework that separates universal world knowledge from task-specific and user-specific knowledge components. This decomposition directly addresses a critical gap in the application of foundation model principles to structured data, where existing approaches remain heavily dependent on hand-crafted features and domain expertise.

The paper's strength lies in bridging theoretical rigor with practical motivation. Rather than providing overly formal specifications, the authors ground their framework in the "Bitter Lesson" principle from Richard Sutton, establishing that scalable, learning-based approaches will ultimately outperform human-engineered solutions. However, they acknowledge that tabular ML has resisted this shift more strongly than NLP, creating a genuine opportunity for foundation models that properly decompose the problem space. The FTP framework appears to be a natural and necessary decomposition for achieving this goal.

The technical contributions are substantial, including systematic characterization of the existing model landscape across dimensions of training phases and probability component modeling. The paper identifies critical open questions spanning theory (invariances/equivariances), engineering (scaling to billions of in-context points), and empirical science (optimal training regimes for each component). The characterization of tabular foundation models as a "nearly guaranteed to work" research frontier, combined with the clear articulation of remaining challenges, positions this as essential reading for researchers and practitioners working at the intersection of foundation models and structured data.

---

## Tag Analysis

**Established Tags Applied:** #agentic-workflows, #adoption-barriers, #investment-trends, #roi-measurement, #data-quality, #deployment-stages, #trust-fairness, #model-capabilities, #competitive-disruption, #vendor-strategy, #workforce-transformation, #risk-governance, #use-case-development, #equity-paradox, #deployment-bottleneck, #skill-formation

**New/Emerging Tags Proposed:**
- #interpretability-transparency: Explicit vs. implicit probability modeling choices
- #research-orientation: Academic/theoretical focus of the whitepaper

---

## Document Coverage
- **Pages Covered:** 1-18 (100%)
- **Data Points:** 25
- **Page Range for Key Content:** Pages 2-15 (core theoretical and applied contributions)

