# Citation Contract (Wave 1.3)

Purpose: keep citations human-readable while making them reliably machine-parseable for inline DP context in the app.

## Extraction File Naming Convention

All extraction files follow the format: `Source_DescriptiveSlug_YYYY-MM-DD.md`

Where:
- **Source** = Publishing organization or author in PascalCase (e.g., `BCG`, `McKinsey`, `Anthropic`, `FinancialTimes`, `ProfGPod`)
- **DescriptiveSlug** = 2-4 PascalCase words from the source title for recognizability
- **Date** = Extraction date (when the file was created in CRIS) in YYYY-MM-DD format

**CRITICAL: Exactly 2 underscores before the date**
- Underscores are ONLY used as segment separators between Source, Slug, and Date
- Within Source and Slug, use PascalCase with NO underscores
- Format: `SourceName_DescriptiveSlug_YYYY-MM-DD.md`

**Naming constraints (hard requirements for parser):**
- No hyphens anywhere in filename (except in date portion)
- No periods in Source or Slug (use concatenated form, e.g., `Opus46` not `Opus4.6`)
- No spaces (use PascalCase instead)
- No underscores within Source or Slug segments (use PascalCase: `FinancialTimes` not `Financial_Times`)
- Exactly 2 underscores before date (segment separators only)

**Inline citation format drops the date:**
- Filename: `AINewsStrategyDaily_Opus46Codex_2026-02-06.md`
- Citation: `[AINewsStrategyDaily_Opus46Codex DP1]`

**✅ CORRECT Examples:**
```markdown
FinancialTimes_MustafaSuleymanAISuperintelligence_2026-02-13.md
ProfGPod_EthanMollickAIWrong_2026-02-13.md
DwarkeshPatel_EndOfExponential_2026-02-13.md
AINewsStrategyDaily_OpenClawAgentsAnalysis_2026-02-13.md
Every_ClaudeCodeTransformingFinance_2026-02-13.md
BCG_EmergingAgenticEnterprise_2026-02-04.md
Anthropic_ClaudesConstitution_2026-02-04.md
HBR_AIDoesntReduceWork_2026-02-11.md
```

**❌ WRONG Examples:**
```markdown
Financial_Times_Mustafa_Suleyman_2026-02-13.md          ← Too many underscores
Prof_G_Pod_Ethan_Mollick_AI_Wrong_2026-02-13.md        ← Underscores in Source and Slug
Dwarkesh_Patel_End_of_Exponential_2026-02-13.md        ← Underscores within segments
AI_News_Strategy_Daily_OpenClaw_2026-02-13.md          ← Too many underscores
Every_How_Claude_Code_Is_Transforming_2026-02-13.md    ← Too many underscores
Financial-Times_Article_2026-02-13.md                  ← Hyphens in Source
BCG.Report_Enterprise_2026-02-04.md                    ← Period in Source
```

**Example citations in synthesis documents:**
```markdown
[BCG_EmergingAgenticEnterprise DP3, DP7]
[Anthropic_ClaudesConstitution DP12; KPMG_AIPulseQ4_2025 DP8]
[FinancialTimes_MustafaSuleymanAISuperintelligence DP5]
```

## Required Pattern

Every synthesis-style bracket citation must include:

1. Human-readable bracket citation (for readers)
2. One metadata comment per cited source (for the parser)

Format:

```markdown
[Source_Name DP3, DP7; Other_Source DP2]
<!-- cite:path=02_Extractions/YYYY-MM/Source_Name_YYYY-MM-DD.md;dp=3,7 -->
<!-- cite:path=02_Extractions/YYYY-MM/Other_Source_YYYY-MM-DD.md;dp=2 -->
```

## Metadata Fields

- `path` (preferred): exact CRIS-relative extraction path
- `source_id` (optional, recommended): canonical extraction source key (filename stem without date)
- `dp`: comma-separated DP ids (`dp=3,7`)
- `source` (fallback): source label if path is unknown
- `status` (optional): use `status=unresolved` when exact linkage is not possible yet

Canonical `source_id` example:

- extraction filename: `AINewsStrategyDaily_OpenClawAgentsAnalysis_2026-02-13.md`
- `source_id`: `AINewsStrategyDaily_OpenClawAgentsAnalysis` (optional helper field for strict resolvers)

## Multi-Source Rule

When a bracket contains multiple semicolon-separated sources, add one `<!-- cite:... -->` block for each source in the same order.

## Fallback Rule (Current Legacy Content)

If exact extraction path is unknown, keep readable citation and mark unresolved explicitly:

```markdown
[User observation (Capital Group)]
<!-- cite:source=User observation (Capital Group);status=unresolved -->
```

## Authoring Checklist

- Bracket citation and metadata sources align 1:1.
- `path` is exact and starts with `02_Extractions/`.
- If present, `source_id` exactly matches the extraction filename stem without date.
- DP ids in `dp=` match actual extraction DP ids.
- If uncertain, prefer explicit unresolved metadata over a guessed path.

## Why This Matters

- Enables inline citation context in drawers and claim surfaces.
- Supports direct open-to-source and DP trace flows.
- Reduces ambiguous lineage and improves verification confidence over time.

## Frontend System Reference

For shared drawer behavior and UI-level provenance semantics, see:

- `/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System/poc/EVIDENCE_TRACE_SYSTEM.md`

That document defines:

- statement-first evidence bundle interaction model
- standardized action labels (`View source`, `View original`)
- exception-only status policy for lineage noise reduction
- raw-source path fallback behavior used by the frontend resolver
