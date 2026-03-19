# Filename Correction Proposal
## February 15, 2026

**Total Invalid Files:** 55 out of 116 extractions (47%)

**Validation Rule:** `SourceName_DescriptiveSlug_YYYY-MM-DD.md`
- EXACTLY 2 underscores (both before date)
- PascalCase (no internal underscores or hyphens in source/slug)
- Starts with uppercase letter

---

## Issue Type 1: Multiple Underscores in Source Name (Multi-word sources)

### AI News Strategy Daily (12 files) - Currently 5 underscores → Should be 2

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `AI_News_Strategy_Daily_AIInferenceCostsSpike_2026-02-10.md` | `AINewsStrategyDaily_AIInferenceCostsSpike_2026-02-10.md` | Merged source name |
| `AI_News_Strategy_Daily_AISoftwareSaaSCrash_2026-02-10.md` | `AINewsStrategyDaily_AISoftwareSaaSCrash_2026-02-10.md` | Merged source name |
| `AI_News_Strategy_Daily_Amazon125BSecret_2026-02-04.md` | `AINewsStrategyDaily_Amazon125BSecret_2026-02-04.md` | Merged source name |
| `AI_News_Strategy_Daily_CEOBetPhilosophy_2026-02-06.md` | `AINewsStrategyDaily_CEOBetPhilosophy_2026-02-06.md` | Merged source name |
| `AI_News_Strategy_Daily_ClawdbotMoltbotBreakdown_2026-02-04.md` | `AINewsStrategyDaily_ClawdbotMoltbotBreakdown_2026-02-04.md` | Merged source name |
| `AI_News_Strategy_Daily_GoingSlowerFeelsSafer_2026-02-10.md` | `AINewsStrategyDaily_GoingSlowerFeelsSafer_2026-02-10.md` | Merged source name |
| `AI_News_Strategy_Daily_OpenAISlowingHiring_2026-02-04.md` | `AINewsStrategyDaily_OpenAISlowingHiring_2026-02-04.md` | Merged source name |
| `AI_News_Strategy_Daily_Opus46Codex_2026-02-06.md` | `AINewsStrategyDaily_Opus46Codex_2026-02-06.md` | Merged source name |
| `AI_News_Strategy_Daily_SmartestAIBet_2026-02-04.md` | `AINewsStrategyDaily_SmartestAIBet_2026-02-04.md` | Merged source name |
| `AI_News_Strategy_Daily_VibeCodingPlayfulness_2026-02-07.md` | `AINewsStrategyDaily_VibeCodingPlayfulness_2026-02-07.md` | Merged source name |

### The AI Daily Brief (5 files) - Currently 5 underscores → Should be 2

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `The_AI_Daily_Brief_IsSoftwareDead_2026-02-06.md` | `TheAIDailyBrief_IsSoftwareDead_2026-02-06.md` | Merged source name |
| `The_AI_Daily_Brief_AgentSwarmsKimiK25_2026-02-04.md` | `TheAIDailyBrief_AgentSwarmsKimiK25_2026-02-04.md` | Merged source name |
| `The_AI_Daily_Brief_WhyMoltbookMatters_2026-02-04.md` | `TheAIDailyBrief_WhyMoltbookMatters_2026-02-04.md` | Merged source name |
| `The_AI_Daily_Brief_AIAccelerationGap_2026-02-04.md` | `TheAIDailyBrief_AIAccelerationGap_2026-02-04.md` | Merged source name |

### No Mercy No Malice (1 file) - Currently 5 underscores → Should be 2

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `No_Mercy_No_Malice_2026Predictions_2026-02-05.md` | `NoMercyNoMalice_2026Predictions_2026-02-05.md` | Merged source name |

### Harvard Business Review (1 file) - Currently 4 underscores → Should be 2

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `Harvard_Business_Review_McKinseyAIReinvent_2026-02-10.md` | `HarvardBusinessReview_McKinseyAIReinvent_2026-02-10.md` | Merged source name |

### Towards Data Science (1 file) - Currently 4 underscores → Should be 2

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `Towards_Data_Science_WhatIAmDoingToStayRelevant_2026-02-10.md` | `TowardsDataScience_WhatIAmDoingToStayRelevant_2026-02-10.md` | Merged source name |

---

## Issue Type 2: Multiple Underscores in Person Names (3 underscores total)

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `Andrew_Pignanelli_AgentNativeEngineering_2026-02-06.md` | `AndrewPignanelli_AgentNativeEngineering_2026-02-06.md` | Merged person name |
| `Damian_Galarza_HowOpenClawWorks_2026-02-05.md` | `DamianGalarza_HowOpenClawWorks_2026-02-05.md` | Merged person name |
| `David_Shapiro_MoltbookFuture_2026-02-04.md` | `DavidShapiro_MoltbookFuture_2026-02-04.md` | Merged person name |
| `Greg_Brockman_SoftwareDevelopmentRenaissance_2026-02-06.md` | `GregBrockman_SoftwareDevelopmentRenaissance_2026-02-06.md` | Merged person name |
| `Wes_Roth_ClawdbotSingularity_2026-02-04.md` | `WesRoth_ClawdbotSingularity_2026-02-04.md` | Merged person name |

---

## Issue Type 3: Multiple Underscores in Multi-word Source (3 underscores total)

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `AI_Explained_TwoBestModels_2026-02-06.md` | `AIExplained_TwoBestModels_2026-02-06.md` | Merged source name |
| `AI_Jason_ClaudeCodeAgentTeams_2026-02-07.md` | `AIJason_ClaudeCodeAgentTeams_2026-02-07.md` | Merged source name |
| `Dive_Club_KarlKochDesignEngineers_2026-02-07.md` | `DiveClub_KarlKochDesignEngineers_2026-02-07.md` | Merged source name |
| `Google_DeepMind_ScienceOfScalingAgents_2026-02-04.md` | `GoogleDeepMind_ScienceOfScalingAgents_2026-02-04.md` | Merged source name |
| `IBM_Technology_SecuringAIAgents_2026-02-10.md` | `IBMTechnology_SecuringAIAgents_2026-02-10.md` | Merged source name |
| `Insight_Partners_AIAdoptionPatterns2026_2026-02-05.md` | `InsightPartners_AIAdoptionPatterns2026_2026-02-05.md` | Merged source name |
| `Insight_Partners_AIInFinancialServices_2026-02-05.md` | `InsightPartners_AIInFinancialServices_2026-02-05.md` | Merged source name |
| `Venture_Beat_FundamentalsNEXUS_2026-02-06.md` | `VentureBeat_FundamentalsNEXUS_2026-02-06.md` | Merged source name |

---

## Issue Type 4: Multiple Underscores in Slug with Underscores (3 underscores total)

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `AIDaily_TimeSavingsEraOver_VibeCoders_2026-02-14.md` | `AIDaily_TimeSavingsEraOverVibeCoders_2026-02-14.md` | Merged slug parts |
| `AINewsStrategyDaily_650BInfrastructure_InferenceWorkloads_2026-02-14.md` | `AINewsStrategyDaily_650BInfrastructureInferenceWorkloads_2026-02-14.md` | Merged slug parts |
| `HBR_StrategyVisualization_Metaphor_2026-02-14.md` | `HBR_StrategyVisualizationMetaphor_2026-02-14.md` | Merged slug parts |
| `LennysPodcast_SoftwareDevelopmentFuture_ShewinWu_2026-02-14.md` | `LennysPodcast_SoftwareDevelopmentFutureShewinWu_2026-02-14.md` | Merged slug parts |
| `KPMG_AIPulseQ1_2025_2026-02-04.md` | `KPMG_AIPulseQ12025_2026-02-04.md` | Merged slug parts |
| `KPMG_AIPulseQ2_2025_2026-02-04.md` | `KPMG_AIPulseQ22025_2026-02-04.md` | Merged slug parts |
| `KPMG_AIPulseQ3_2025_2026-02-04.md` | `KPMG_AIPulseQ32025_2026-02-04.md` | Merged slug parts |
| `KPMG_AIPulseQ4_2025_2026-02-04.md` | `KPMG_AIPulseQ42025_2026-02-04.md` | Merged slug parts |

---

## Issue Type 5: Underscores in Channel Names with Lowercase (3 underscores + lowercase)

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `Theo_t3gg_AIMakesDevsDumb_2026-02-04.md` | `Theot3gg_AIMakesDevsDumb_2026-02-04.md` | Merged channel name |
| `Theo_t3gg_Opus46CodingModel_2026-02-06.md` | `Theot3gg_Opus46CodingModel_2026-02-06.md` | Merged channel name |
| `Theo_t3gg_OpenAIWonAgain_2026-02-06.md` | `Theot3gg_OpenAIWonAgain_2026-02-06.md` | Merged channel name |
| `You_com_2026AIPredictions_2026-02-05.md` | `Youcom_2026AIPredictions_2026-02-05.md` | Merged source name |

---

## Issue Type 6: Hyphens in Slug (should be PascalCase)

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `Every_The-Two-Slice-Team_2026-02-14.md` | `Every_TheTwoSliceTeam_2026-02-14.md` | Removed hyphens |
| `Heinrich_Obsidian-Claude-Code-101_2026-02-14.md` | `Heinrich_ObsidianClaudeCode101_2026-02-14.md` | Removed hyphens |
| `METR_Clarifying-Limitations-of-Time-Horizon_2026-02-14.md` | `METR_ClarifyingLimitationsOfTimeHorizon_2026-02-14.md` | Removed hyphens |
| `METR_Measuring-Time-Horizon-Using-Claude-Code-and-Codex_2026-02-14.md` | `METR_MeasuringTimeHorizonUsingClaudeCodeAndCodex_2026-02-14.md` | Removed hyphens |
| `PlannedObsolescence_Takeoff-Speeds-Rule-Everything_2026-02-14.md` | `PlannedObsolescence_TakeoffSpeedsRuleEverything_2026-02-14.md` | Removed hyphens |
| `VentureBeat_Anthropic-Claude-Cowork-Windows_2026-02-14.md` | `VentureBeat_AnthropicClaudeCoworkWindows_2026-02-14.md` | Removed hyphens |
| `VentureBeat_MIT-Fine-Tuning-Method-LLMs-Learn-Skills_2026-02-14.md` | `VentureBeat_MITFineTuningMethodLLMsLearnSkills_2026-02-14.md` | Removed hyphens |
| `Y-Combinator_The-New-Way-To-Build-A-Startup_2026-02-14.md` | `YCombinator_TheNewWayToBuildAStartup_2026-02-14.md` | Removed hyphens from both parts |

---

## Issue Type 7: Starts with Lowercase

| ❌ Current Name | ✅ Proposed Correction | Fix Applied |
|----------------|----------------------|-------------|
| `a16z_BigIdeasPart1_2026-02-04.md` | `A16z_BigIdeasPart1_2026-02-04.md` | Capitalized first letter |
| `a16z_BigIdeasPart2_2026-02-04.md` | `A16z_BigIdeasPart2_2026-02-04.md` | Capitalized first letter |
| `a16z_BigIdeasPart3_2026-02-04.md` | `A16z_BigIdeasPart3_2026-02-04.md` | Capitalized first letter |
| `github_ContinuousAIInPractice_2026-02-06.md` | `Github_ContinuousAIInPractice_2026-02-06.md` | Capitalized first letter |

---

## Issue Type 8: No Clear Issue (Passes Pattern?)

| ❌ Current Name | Issue | ✅ Proposed Correction |
|----------------|-------|----------------------|
| `GrahamStephan_5YearsToGetRich_2026-02-10.md` | False positive? | Keep as-is (validates correctly) |

---

## Summary by Issue Type

| Issue Type | Count | Fix Strategy |
|------------|-------|-------------|
| Multiple underscores in multi-word source names | 20 | Merge to PascalCase (e.g., AI_News_Strategy_Daily → AINewsStrategyDaily) |
| Multiple underscores in person names | 5 | Merge to PascalCase (e.g., Greg_Brockman → GregBrockman) |
| Multiple underscores in slug parts | 12 | Merge slug components (e.g., Q1_2025 → Q12025) |
| Hyphens in slug | 8 | Convert to PascalCase (e.g., The-Two-Slice → TheTwoSlice) |
| Starts with lowercase | 4 | Capitalize first letter (e.g., a16z → A16z) |
| **TOTAL** | **54** | — |

---

## Verification Commands

After corrections, these commands will verify no invalid filenames remain:

```bash
# Count files matching valid pattern
find 02_Extractions -name "*.md" -type f ! -name "_Extraction_Index.md" | \
    grep -E '^.*/[A-Z][a-zA-Z0-9]+_[A-Z][a-zA-Z0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$' | wc -l

# Expected result: 116 (all extraction files)
```

---

## Ready to Proceed?

Please confirm if you want me to:
1. ✅ Proceed with all 54 renames as proposed
2. ⚠️ Modify any specific corrections
3. ❌ Cancel operation

After your confirmation, I will:
- Rename all files
- Update `_extraction_tracker.json`
- Update `_Extraction_Index.md`
- Update all citations in Weekly Learnings, Active Ideas, Current Synthesis, and Talking Points
- Create `Extraction_Name_Mapping.md` for reference
- Verify no broken references remain
