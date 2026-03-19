import { promises as fs } from "node:fs";
import path from "node:path";
import { createConvexClient, runConvexMutation } from "./lib/convexClient.ts";
import {
  getMigrationPaths,
  listExtractionFiles,
  listWeeklyLearningFiles,
  toRepoRelativePath,
} from "./lib/fileDiscovery.ts";
import { assertOneTimeRun, parseScriptFlags } from "./lib/guards.ts";
import { normalizeForMatch } from "./lib/normalize.ts";
import { parseExtraction } from "./lib/parseExtraction.ts";
import { parseWeeklyLearning } from "./lib/parseWeeklyLearning.ts";
import { logStep, readJsonReport, writeJsonReport } from "./lib/reports.ts";

type UnresolvedCitation = {
  weeklyFile: string;
  themeTitle: string;
  rawCitation: string;
  extractionPath: string;
  requestedDpNumbers: number[];
  reason: string;
};

type PlaceholderCitation = {
  weeklyFile: string;
  themeTitle: string;
  rawCitation: string;
  extractionPath: string;
  note: string;
};

type WeeklyWarning = {
  weeklyFile: string;
  themeTitle: string;
  rawCitation: string;
  extractionPath: string;
  note: string;
};

type DpResolutionIndex = {
  exact: Record<string, string>;
  basename: Map<string, string>;
  normalizedBasename: Map<string, string>;
  ambiguousBasenameKeys: Set<string>;
  ambiguousNormalizedBasenameKeys: Set<string>;
};

const LEGACY_CITATION_BASENAME_ALIASES: Record<string, string> = {
  "AI-News-Strategy-Daily_AI-Inference-Costs-Spike_2026-02-10.md":
    "AI_News_Strategy_Daily_AIInferenceCostsSpike_2026-02-10.md",
  "AI-News-Strategy-Daily_AI-Software-SaaS-Crash_2026-02-10.md":
    "AI_News_Strategy_Daily_AISoftwareSaaSCrash_2026-02-10.md",
  "EO_WhatYouMustKnowBeforeAGIArrives_2026-02-11.md":
    "EO_WhatYouMustKnowBeforeAGI_2026-02-11.md",
  "Every_Compound-Engineering-The-Definitive-Guide_2026-02-10.md":
    "Every_CompoundEngineering_2026-02-10.md",
  "GrahamStephan_2026-02-10.md":
    "GrahamStephan_5YearsToGetRich_2026-02-10.md",
  "Gusto_2026-02-10.md":
    "Gusto_AIforSmallBusiness_2026-02-10.md",
  "Gusto_AI-for-Small-Business_2026-02-10.md":
    "Gusto_AIforSmallBusiness_2026-02-10.md",
  "HBR_AIDoesntReduceWorkItIntensifiesIt_2026-02-11.md":
    "HBR_AIDoesntReduceWork_2026-02-11.md",
  "Harvard-Business-Review_McKinsey-AI-Reinvent_2026-02-10.md":
    "Harvard_Business_Review_McKinseyAIReinvent_2026-02-10.md",
  "IBM-Technology_2026-02-10.md":
    "IBM_Technology_SecuringAIAgents_2026-02-10.md",
  "IndyDevDan_Claude-Code-Multi-Agent-Orchestration_2026-02-10.md":
    "IndyDevDan_ClaudeCodeMultiAgentOrchestration_2026-02-10.md",
  "LangChain_Agent-Observability-Powers-Eval_2026-02-10.md":
    "LangChain_AgentObservabilityPowersEval_2026-02-10.md",
  "Redis_Mastering-Context-Engineering_2026-02-10.md":
    "Redis_MasteringContextEngineering_2026-02-10.md",
  "Snowflake_AI-data-predictions-2026_2026-02-10.md":
    "Snowflake_AIdataPredictions2026_2026-02-10.md",
};

async function buildDryRunDpMap(
  paths: ReturnType<typeof getMigrationPaths>,
): Promise<Record<string, string>> {
  const extractionFiles = await listExtractionFiles(paths);
  const dpIdMap: Record<string, string> = {};
  let counter = 1;

  for (const extractionFile of extractionFiles) {
    const relativePath = toRepoRelativePath(paths.workspaceRoot, extractionFile);
    const text = await fs.readFile(extractionFile, "utf8");
    const parsed = parseExtraction(relativePath, text);

    for (const dataPoint of parsed.dataPoints) {
      dpIdMap[`${relativePath}:DP${dataPoint.dpSequenceNumber}`] =
        `dry-dp:${counter}`;
      counter += 1;
    }
  }

  return dpIdMap;
}

function splitDpMapKey(key: string): { extractionPath: string; dpSuffix: string } | null {
  const match = key.match(/^(.*):(DP\d+)$/);
  if (!match) {
    return null;
  }

  return {
    extractionPath: match[1],
    dpSuffix: match[2],
  };
}

function addResolutionAlias(
  map: Map<string, string>,
  ambiguousKeys: Set<string>,
  aliasKey: string,
  id: string,
): void {
  const existing = map.get(aliasKey);
  if (!existing) {
    map.set(aliasKey, id);
    return;
  }

  if (existing !== id) {
    map.delete(aliasKey);
    ambiguousKeys.add(aliasKey);
  }
}

function buildDpResolutionIndex(dpIdMap: Record<string, string>): DpResolutionIndex {
  const basename = new Map<string, string>();
  const normalizedBasename = new Map<string, string>();
  const ambiguousBasenameKeys = new Set<string>();
  const ambiguousNormalizedBasenameKeys = new Set<string>();

  for (const [key, id] of Object.entries(dpIdMap)) {
    const parsed = splitDpMapKey(key);
    if (!parsed) {
      continue;
    }

    const fileName = path.posix.basename(parsed.extractionPath);
    addResolutionAlias(
      basename,
      ambiguousBasenameKeys,
      `${fileName}:${parsed.dpSuffix}`,
      id,
    );
    addResolutionAlias(
      normalizedBasename,
      ambiguousNormalizedBasenameKeys,
      `${normalizeForMatch(fileName)}:${parsed.dpSuffix}`,
      id,
    );
  }

  return {
    exact: dpIdMap,
    basename,
    normalizedBasename,
    ambiguousBasenameKeys,
    ambiguousNormalizedBasenameKeys,
  };
}

function resolveCitationDpId(
  index: DpResolutionIndex,
  citationPath: string,
  dpNumber: number,
): { id?: string; reason?: string } {
  const dpSuffix = `DP${dpNumber}`;
  const exactKey = `${citationPath}:${dpSuffix}`;
  if (index.exact[exactKey]) {
    return { id: index.exact[exactKey] };
  }

  const fileName = path.posix.basename(citationPath);
  const basenameKey = `${fileName}:${dpSuffix}`;
  if (index.basename.has(basenameKey)) {
    return { id: index.basename.get(basenameKey) };
  }
  if (index.ambiguousBasenameKeys.has(basenameKey)) {
    return { reason: `Ambiguous basename match for ${basenameKey}` };
  }

  const normalizedBasenameKey = `${normalizeForMatch(fileName)}:${dpSuffix}`;
  if (index.normalizedBasename.has(normalizedBasenameKey)) {
    return { id: index.normalizedBasename.get(normalizedBasenameKey) };
  }
  if (index.ambiguousNormalizedBasenameKeys.has(normalizedBasenameKey)) {
    return { reason: `Ambiguous normalized basename match for ${normalizedBasenameKey}` };
  }

  const aliasedFileName = LEGACY_CITATION_BASENAME_ALIASES[fileName];
  if (aliasedFileName) {
    const aliasedBasenameKey = `${aliasedFileName}:${dpSuffix}`;
    if (index.basename.has(aliasedBasenameKey)) {
      return { id: index.basename.get(aliasedBasenameKey) };
    }
  }

  return { reason: `Could not resolve ${citationPath}:${dpSuffix}` };
}

async function main(): Promise<void> {
  const flags = parseScriptFlags(process.argv.slice(2));
  const paths = getMigrationPaths(import.meta.url);
  const dpMapPath = path.join(paths.migrationDir, "dp_id_map.json");
  const weeklyReportPath = path.join(
    paths.migrationDir,
    "weekly_learning_report.json",
  );
  const unresolvedPath = path.join(
    paths.migrationDir,
    "reports",
    "unresolved_citations.json",
  );
  const placeholderPath = path.join(
    paths.migrationDir,
    "reports",
    "placeholder_citations.json",
  );

  await assertOneTimeRun(weeklyReportPath, flags.dryRun);

  let dpIdMap: Record<string, string>;
  try {
    dpIdMap = await readJsonReport<Record<string, string>>(dpMapPath);
  } catch (error) {
    if (!flags.dryRun) {
      throw error;
    }
    logStep("No dp_id_map.json found; building dry-run datapoint aliases in memory");
    dpIdMap = await buildDryRunDpMap(paths);
  }
  const resolutionIndex = buildDpResolutionIndex(dpIdMap);
  const weeklyFiles = await listWeeklyLearningFiles(paths);
  const unresolvedCitations: UnresolvedCitation[] = [];
  const placeholderCitations: PlaceholderCitation[] = [];
  const warnings: WeeklyWarning[] = [];
  const weeklySummaries: Array<{
    filePath: string;
    themeCount: number;
    unresolvedCitationCount: number;
    placeholderCitationCount: number;
  }> = [];

  logStep(`Discovered ${weeklyFiles.length} weekly learning files`);

  const parsedWeeks = [];
  for (const weeklyPath of weeklyFiles) {
    const relativePath = toRepoRelativePath(paths.workspaceRoot, weeklyPath);
    const text = await fs.readFile(weeklyPath, "utf8");
    const parsed = parseWeeklyLearning(relativePath, text);

    const themes = parsed.themes.map((theme) => {
      const citedDataPoints: string[] = [];
      for (const citation of theme.citationComments) {
        if (citation.invalidTokens.includes("pending;status=unresolved")) {
          placeholderCitations.push({
            weeklyFile: relativePath,
            themeTitle: theme.themeTitle,
            rawCitation: citation.raw,
            extractionPath: citation.path,
            note: "Placeholder citation from legacy system; excluded from migration.",
          });
          continue;
        }

        for (const dpNumber of citation.dpNumbers) {
          const resolution = resolveCitationDpId(
            resolutionIndex,
            citation.path,
            dpNumber,
          );
          const resolvedId = resolution.id;
          if (resolvedId) {
            if (!citedDataPoints.includes(resolvedId)) {
              citedDataPoints.push(resolvedId);
            }
            continue;
          }

          unresolvedCitations.push({
            weeklyFile: relativePath,
            themeTitle: theme.themeTitle,
            rawCitation: citation.raw,
            extractionPath: citation.path,
            requestedDpNumbers: citation.dpNumbers,
            reason: resolution.reason ?? `Could not resolve ${citation.path}:DP${dpNumber}`,
          });
        }

        for (const invalidToken of citation.invalidTokens) {
          warnings.push({
            weeklyFile: relativePath,
            themeTitle: theme.themeTitle,
            rawCitation: citation.raw,
            extractionPath: citation.path,
            note: `Ignored non-DP token after resolving valid citations: ${invalidToken}`,
          });
        }
      }

      return {
        themeTitle: theme.themeTitle,
        themeContent: theme.themeContent,
        citedDataPoints,
        orderIndex: theme.orderIndex,
      };
    });

    weeklySummaries.push({
      filePath: relativePath,
      themeCount: themes.length,
      unresolvedCitationCount: unresolvedCitations.filter(
        (item) => item.weeklyFile === relativePath,
      ).length,
      placeholderCitationCount: placeholderCitations.filter(
        (item) => item.weeklyFile === relativePath,
      ).length,
    });

    parsedWeeks.push({
      relativePath,
      weekStartDate: parsed.weekStartDate,
      weekEndDate: parsed.weekEndDate,
      title: parsed.title,
      overview: parsed.overview || undefined,
      themes,
    });
  }

  const weeklyReport = {
    dryRun: flags.dryRun,
    totals: {
      weeklyFiles: parsedWeeks.length,
      totalThemes: parsedWeeks.reduce((sum, week) => sum + week.themes.length, 0),
      unresolvedCitations: unresolvedCitations.length,
      placeholderCitations: placeholderCitations.length,
      warnings: warnings.length,
    },
    files: weeklySummaries,
    warnings,
  };

  if (flags.dryRun) {
    await writeJsonReport(weeklyReportPath, weeklyReport);
    await writeJsonReport(unresolvedPath, unresolvedCitations);
    await writeJsonReport(placeholderPath, placeholderCitations);
    logStep(`Wrote ${weeklyReportPath}`);
    logStep(`Wrote ${unresolvedPath}`);
    logStep(`Wrote ${placeholderPath}`);
    logStep(
      `Dry run succeeded: ${parsedWeeks.length} weekly files parsed, ${unresolvedCitations.length} unresolved citations and ${placeholderCitations.length} placeholders recorded for review.`,
    );
    return;
  }

  const client = await createConvexClient(paths.projectRoot);
  for (const week of parsedWeeks) {
    logStep(`Importing weekly learning ${week.relativePath}`);
    await runConvexMutation<
      { weeklyLearning: typeof week },
      { weeklyLearningId: string; weeklyThemeIds: string[] }
    >(client, "synthesis:migrationImportWeeklyLearning", {
      weeklyLearning: week,
    });
  }

  await writeJsonReport(weeklyReportPath, weeklyReport);
  await writeJsonReport(unresolvedPath, unresolvedCitations);
  await writeJsonReport(placeholderPath, placeholderCitations);
  logStep(`Wrote ${weeklyReportPath}`);
  logStep(`Wrote ${unresolvedPath}`);
  logStep(`Wrote ${placeholderPath}`);
}

await main();
