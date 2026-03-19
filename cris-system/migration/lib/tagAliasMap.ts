/**
 * Tag Alias Map
 *
 * Maps legacy, variant, and one-off tag slugs used in extraction files
 * to canonical tag slugs present in Tags.md.
 *
 * Resolution order in migration:
 * 1. Exact match in tag_id_map.json → use it
 * 2. Match in TAG_ALIAS_MAP → look up each canonical slug in tag_id_map.json → use all found
 * 3. Still not found → log to missing_tags_after_aliasing.json, skip (do not block)
 *
 * Values are arrays to support many-to-one merges (e.g. retired tags that split into two).
 */
export const TAG_ALIAS_MAP: Record<string, string[]> = {
  // ─── Clear aliases of existing tags ──────────────────────────────────────

  "productivity-gains": ["productivity-impact"],
  "leadership-readiness": ["ai-leadership-readiness"],
  "collaborative-paradox": ["collaboration-paradox"],
  "ai-native-development": ["agent-native-development"],
  "workflow-efficiency": ["workflow-optimization"],
  "human-oversight": ["human-in-the-loop-governance"],
  "efficiency-gains": ["productivity-impact"],
  "learning-transformation": ["enterprise-learning-transformation"],
  "geographic-disparity": ["geographic-concentration"],
  "technology-infrastructure": ["infrastructure"],
  "organizational-change": ["organizational-transformation"],
  "organizational-impact": ["organizational-transformation"],
  "organizational-structure": ["organizational-transformation"],
  "organizational-strategy": ["organizational-transformation"],

  // ─── Retired tags (from Tags.md Retired section) ─────────────────────────

  "ai-angst": ["adoption-barriers", "employment-disruption-sentiment"],
  "ai-anxiety": ["adoption-barriers"],
  "compliance-architecture": ["governance", "risk-governance"],
  "industry-risk-asymmetry": ["adoption-barriers"],
  "affective-displacement": ["cognitive-offloading"],
  "efficiency-benchmark-reset": ["productivity-impact"],
  "stateful-agent-architecture": ["agentic-workflows"],
  "cloud-vendor-specialization": ["vendor-strategy"],
  "ecosystem-integration-strategy": ["vendor-strategy"],
  "grassroots-political-mobilization": ["policy-gap"],
  "local-environmental-justice": ["infrastructure", "policy-gap"],

  // ─── Automation ───────────────────────────────────────────────────────────

  "automation": ["automation-vs-augmentation"],

  // ─── Finance / economics one-offs ────────────────────────────────────────

  "market-sentiment": ["investment-trends"],
  "market-volatility": ["investment-trends"],
  "market-adoption": ["adoption-barriers"],
  "market-dynamics": ["competitive-disruption"],
  "market-reaction": ["competitive-disruption"],
  "market-readiness": ["adoption-barriers"],
  "market-opportunity": ["use-case-development"],
  "market-inefficiency": ["competitive-disruption"],
  "market-capabilities": ["model-capabilities"],
  "market-structure-change": ["competitive-disruption"],
  "market-structure-opacity": ["competitive-disruption"],
  "market-psychology": ["investment-trends"],
  "investor-sentiment": ["investment-trends"],
  "investor-psychology": ["investment-trends"],
  "investor-behavior": ["investment-trends"],
  "investment-illusion": ["roi-measurement"],
  "financial-risk": ["risk-governance"],
  "consumer-adoption": ["adoption-barriers"],
  "debt-market-vulnerability": ["risk-governance"],
  "recession-risk": ["risk-governance"],
  "private-credit-crisis": ["risk-governance"],
  "retail-institutional-mismatch": ["competitive-disruption"],
  "liquidity-crisis": ["risk-governance"],
  "valuation-uncertainty": ["investment-trends"],
  "valuation-disruption": ["saas-repricing"],
  "revenue-metrics": ["roi-measurement"],
  "sentiment-driven-pricing": ["investment-trends"],
  "latent-demand": ["market-demand"],
  "demand-explosion": ["investment-trends"],
  "economic-uncertainty": ["risk-governance"],
  "economic-contraction": ["risk-governance"],
  "economic-assessment": ["roi-measurement"],
  "behavioral-economics": ["adoption-barriers"],
  "industry-variation": ["adoption-barriers"],

  // ─── Productivity variants ────────────────────────────────────────────────

  "productivity": ["productivity-impact"],
  "productivity-optimization": ["productivity-impact"],
  "productivity-automation": ["productivity-impact"],
  "productivity-acceleration": ["productivity-impact"],
  "productivity-paradox": ["productivity-impact"],
  "operational-efficiency": ["productivity-impact"],
  "cost-efficiency": ["productivity-impact"],
  "cost-optimization": ["roi-measurement"],
  "decision-quality": ["measurement-framework-reckoning"],

  // ─── Employment / labor one-offs ─────────────────────────────────────────

  "employment-disruption": ["workforce-transformation"],
  "employment-creation": ["workforce-transformation"],
  "employment-measurement-challenges": ["measurement-framework-reckoning"],
  "employment-data-quality": ["data-quality"],
  "employee-satisfaction": ["workforce-transformation"],
  "workforce-expansion": ["workforce-transformation"],
  "youth-employment": ["hiring-transformation"],
  "labor-market-disruption": ["workforce-transformation"],
  "labor-market-weakness": ["workforce-transformation"],
  "labor-reallocation": ["workforce-transformation"],
  "demographic-driven-hiring": ["hiring-transformation"],
  "role-evolution": ["workforce-transformation"],

  // ─── Org / leadership one-offs ───────────────────────────────────────────

  "strategic-alignment": ["governance"],
  "corporate-capability": ["ai-leadership-readiness"],
  "integration-gap": ["deployment-bottleneck"],
  "execution-risk": ["risk-governance"],
  "risk-management": ["risk-governance"],
  "oversight-evolution": ["risk-governance"],
  "human-agent-collaboration": ["workforce-transformation"],
  "comprehensive-transformation": ["organizational-transformation"],
  "business-model-evolution": ["competitive-disruption"],
  "business-model-impact": ["competitive-disruption"],
  "business-value": ["roi-measurement"],
  "priorities": ["governance"],

  // ─── Technical one-offs ───────────────────────────────────────────────────

  "system-architecture": ["infrastructure"],
  "technology-disruption-pattern": ["competitive-disruption"],
  "tech-debt": ["deployment-bottleneck"],
  "security-architecture": ["cybersecurity"],
  "legacy-systems": ["infrastructure"],
  "prompt-engineering": ["specification-bottleneck"],
  "specification-failure": ["specification-bottleneck"],
  "logical-reasoning": ["model-capabilities"],
  "information-processing": ["model-capabilities"],
  "information-presentation": ["use-case-development"],
  "context-confusion": ["context-engineering"],
  "context-clash": ["context-engineering"],
  "deployment-acceleration": ["deployment-stages"],
  "methodology": ["measurement-framework-reckoning"],
  "narrative-formation": ["competitive-disruption"],
  "cultural-narrative": ["competitive-disruption"],
  "convergence": ["competitive-disruption"],
  "shadow-ai": ["adoption-barriers"],

  // ─── Customer / experience one-offs ──────────────────────────────────────

  "customer-experience": ["use-case-development"],
  "customer-experience-transformation": ["use-case-development"],
  "customer-satisfaction": ["roi-measurement"],
  "user-experience": ["use-case-development"],
  "user-behavior": ["adoption-barriers"],
  "service-quality-gaps": ["deployment-bottleneck"],
  "engagement-metrics": ["roi-measurement"],
  "interaction-coherence-dup": ["interaction-coherence"], // safety alias in case of typo

  // ─── Misc one-offs ────────────────────────────────────────────────────────

  "design-thinking": ["use-case-development"],
  "entrepreneurship": ["competitive-disruption"],
  "expertise-preservation": ["skill-formation"],
  "knowledge-work": ["workforce-transformation"],
  "non-technical-use-cases": ["use-case-development"],
  "historical-context": ["model-capabilities"],
  "healthcare-sector-concerns": ["adoption-barriers"],
  "ai-exposure": ["adoption-barriers"],
  "ai-induced-disruption": ["ai-driven-restructuring", "competitive-disruption"],
  "ai-disruption-risk": ["risk-governance"],
  "ethical-alignment": ["trust-fairness"],
  "creative-decision-making": ["decision-making-automation"],
  "marketing": ["product-strategy"],
  "research-orientation": ["measurement-framework-reckoning"],
};
