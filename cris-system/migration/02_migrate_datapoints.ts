import { promises as fs } from "node:fs";
import path from "node:path";
import { createConvexClient, runConvexMutation } from "./lib/convexClient.ts";
import {
  getMigrationPaths,
  listExtractionFiles,
  listRawSourceFiles,
  toRepoRelativePath,
} from "./lib/fileDiscovery.ts";
import { assertOneTimeRun, parseScriptFlags } from "./lib/guards.ts";
import { normalizeForMatch, normalizeTagSlug, toPosixPath } from "./lib/normalize.ts";
import { parseExtraction } from "./lib/parseExtraction.ts";
import { parseRawSource } from "./lib/parseRawSource.ts";
import { parseTagsFile } from "./lib/parseTags.ts";
import { logStep, readJsonReport, writeJsonReport } from "./lib/reports.ts";
import { TAG_ALIAS_MAP } from "./lib/tagAliasMap.ts";

type ParsedExtractionImport = {
  relativePath: string;
  sourceReference?: string;
  sourceId: string;
  extractionDate: string;
  notes?: string;
  dataPoints: Array<{
    sourceId: string;
    dpSequenceNumber: number;
    claimText: string;
    anchorQuote?: string;
    citationDisplay?: string;
    locationType?: string;
    locationStart?: number;
    locationEnd?: number;
    extractionDate: string;
    processedDate: string;
    tagIds: string[];
  }>;
  rawTagsByKey: Record<string, string[]>;
};

function resolveSourceId(
  sourceIdMap: Record<string, string>,
  sourceReference: string | undefined,
): string | undefined {
  if (!sourceReference) {
    return undefined;
  }

  return (
    sourceIdMap[sourceReference] ??
    sourceIdMap[normalizeForMatch(toPosixPath(sourceReference))] ??
    sourceIdMap[normalizeForMatch(path.posix.basename(sourceReference))]
  );
}

async function buildDryRunSourceMap(
  paths: ReturnType<typeof getMigrationPaths>,
): Promise<Record<string, string>> {
  const sourceFiles = await listRawSourceFiles(paths);
  const sourceIdMap: Record<string, string> = {};

  for (let index = 0; index < sourceFiles.length; index += 1) {
    const filePath = sourceFiles[index];
    const relativePath = toRepoRelativePath(paths.workspaceRoot, filePath);
    const fileText = filePath.toLowerCase().endsWith(".md")
      ? await fs.readFile(filePath, "utf8")
      : null;

    parseRawSource(relativePath, fileText);
    const placeholderId = `dry-source:${index + 1}`;
    sourceIdMap[relativePath] = placeholderId;
    sourceIdMap[normalizeForMatch(toPosixPath(relativePath))] = placeholderId;
    sourceIdMap[normalizeForMatch(path.posix.basename(relativePath))] =
      placeholderId;
  }

  return sourceIdMap;
}

async function buildDryRunTagMap(
  paths: ReturnType<typeof getMigrationPaths>,
): Promise<Record<string, string>> {
  const text = await fs.readFile(paths.tagsFilePath, "utf8");
  const parsed = parseTagsFile(text);
  const tagIdMap: Record<string, string> = {};

  parsed.tags.forEach((tag, index) => {
    tagIdMap[tag.slug] = `dry-tag:${index + 1}`;
  });

  return tagIdMap;
}

async function main(): Promise<void> {
  const flags = parseScriptFlags(process.argv.slice(2));
  const paths = getMigrationPaths(import.meta.url);
  const sourceMapPath = path.join(paths.migrationDir, "source_id_map.json");
  const tagMapPath = path.join(paths.migrationDir, "artifacts", "tag_id_map.json");
  const dpMapPath = path.join(paths.migrationDir, "dp_id_map.json");
  const datapointReportPath = path.join(
    paths.migrationDir,
    "datapoint_parse_report.json",
  );
  const tagStagingPath = path.join(
    paths.migrationDir,
    "datapoint_tag_staging.json",
  );
  const missingTagsPath = path.join(
    paths.migrationDir,
    "reports",
    "missing_tags_after_aliasing.json",
  );

  await assertOneTimeRun(dpMapPath, flags.dryRun);

  let sourceIdMap: Record<string, string>;
  try {
    sourceIdMap = await readJsonReport<Record<string, string>>(sourceMapPath);
  } catch (error) {
    if (!flags.dryRun) {
      throw error;
    }
    logStep("No source_id_map.json found; building dry-run source aliases in memory");
    sourceIdMap = await buildDryRunSourceMap(paths);
  }
  let tagIdMap: Record<string, string>;
  try {
    tagIdMap = await readJsonReport<Record<string, string>>(tagMapPath);
  } catch (error) {
    if (!flags.dryRun) {
      throw error;
    }
    logStep("No tag_id_map.json found; building dry-run tag aliases in memory");
    tagIdMap = await buildDryRunTagMap(paths);
  }
  const extractionFiles = await listExtractionFiles(paths);
  const blockingIssues: Array<{ filePath: string; issue: string }> = [];
  const warnings: Array<{ filePath: string; issue: string }> = [];
  const missingAfterAlias: Array<{ filePath: string; slug: string; dpKey: string }> = [];
  const parsedImports: ParsedExtractionImport[] = [];

  logStep(`Discovered ${extractionFiles.length} extraction files`);

  for (const filePath of extractionFiles) {
    const relativePath = toRepoRelativePath(paths.workspaceRoot, filePath);
    const text = await fs.readFile(filePath, "utf8");
    const parsed = parseExtraction(relativePath, text);
    const sourceId = resolveSourceId(sourceIdMap, parsed.sourceReference);

    if (!sourceId) {
      blockingIssues.push({
        filePath: relativePath,
        issue: `Could not resolve source for reference: ${parsed.sourceReference ?? "missing"}`,
      });
      continue;
    }

    for (const warning of parsed.warnings) {
      warnings.push({ filePath: relativePath, issue: warning });
    }

    const rawTagsByKey: Record<string, string[]> = {};
    const dataPoints = parsed.dataPoints.map((dataPoint) => {
      const key = `${relativePath}:DP${dataPoint.dpSequenceNumber}`;
      rawTagsByKey[key] = dataPoint.rawTags;
      const tagIds = [...new Set(
        dataPoint.rawTags.flatMap((tag) => {
          const slug = normalizeTagSlug(tag);

          // 1. Exact match
          const exactId = tagIdMap[slug];
          if (exactId) return [exactId];

          // 2. Alias map — may resolve to one or more canonical slugs
          const canonicalSlugs = TAG_ALIAS_MAP[slug];
          if (canonicalSlugs) {
            const resolvedIds = canonicalSlugs
              .map((canonical) => tagIdMap[canonical])
              .filter((id): id is string => Boolean(id));
            if (resolvedIds.length > 0) return resolvedIds;
          }

          // 3. Still not found — log as non-blocking warning, skip
          missingAfterAlias.push({ filePath: relativePath, slug, dpKey: key });
          return [];
        }).filter((tagId): tagId is string => Boolean(tagId)),
      )];

      return {
        sourceId,
        dpSequenceNumber: dataPoint.dpSequenceNumber,
        claimText: dataPoint.claimText,
        anchorQuote: dataPoint.anchorQuote,
        citationDisplay: dataPoint.citationDisplay,
        locationType: dataPoint.locationType,
        locationStart: dataPoint.locationStart,
        locationEnd: dataPoint.locationEnd,
        extractionDate: parsed.extractionDate,
        processedDate: parsed.extractionDate,
        tagIds,
      };
    });

    parsedImports.push({
      relativePath,
      sourceReference: parsed.sourceReference,
      sourceId,
      extractionDate: parsed.extractionDate,
      notes: parsed.warnings.join(" | ") || undefined,
      dataPoints,
      rawTagsByKey,
    });
  }

  const report = {
    dryRun: flags.dryRun,
    totals: {
      extractionFiles: extractionFiles.length,
      parsedImports: parsedImports.length,
      blockingIssues: blockingIssues.length,
      warnings: warnings.length,
      missingAfterAlias: missingAfterAlias.length,
      totalDataPoints: parsedImports.reduce(
        (sum, item) => sum + item.dataPoints.length,
        0,
      ),
    },
    blockingIssues,
    warnings,
    missingAfterAlias,
  };

  if (blockingIssues.length > 0) {
    if (!flags.dryRun) {
      await writeJsonReport(datapointReportPath, report);
    }
    throw new Error(
      `Datapoint migration blocked by ${blockingIssues.length} source or tag issues.`,
    );
  }

  // Always write missing-after-alias report (even on dry run) so it's inspectable
  await writeJsonReport(missingTagsPath, {
    count: missingAfterAlias.length,
    slugs: [...new Set(missingAfterAlias.map((m) => m.slug))].sort(),
    details: missingAfterAlias,
  });

  if (flags.dryRun) {
    logStep(
      `Dry run succeeded: ${parsedImports.length} extractions parsed with ${report.totals.totalDataPoints} data points.`,
    );
    if (missingAfterAlias.length > 0) {
      logStep(
        `Note: ${missingAfterAlias.length} tag references could not be resolved even with alias map — see reports/missing_tags_after_aliasing.json`,
      );
    }
    return;
  }

  const client = await createConvexClient(paths.projectRoot);
  const dpIdMap: Record<string, string> = {};
  const tagStaging: Record<string, string[]> = {};

  for (const extraction of parsedImports) {
    logStep(`Importing extraction ${extraction.relativePath}`);
    const result = await runConvexMutation<
      {
        extraction: {
          sourceId: string;
          originalFilePath: string;
          extractionDate: string;
          notes?: string;
          dataPoints: ParsedExtractionImport["dataPoints"];
        };
      },
      {
        extractionTrackerId: string;
        dataPointIds: string[];
        dataPointTagLinkCount: number;
      }
    >(client, "dataPoints:migrationImportExtraction", {
      extraction: {
        sourceId: extraction.sourceId,
        originalFilePath: extraction.relativePath,
        extractionDate: extraction.extractionDate,
        notes: extraction.notes,
        dataPoints: extraction.dataPoints,
      },
    });

    extraction.dataPoints.forEach((dataPoint, index) => {
      const key = `${extraction.relativePath}:DP${dataPoint.dpSequenceNumber}`;
      dpIdMap[key] = result.dataPointIds[index];
      tagStaging[key] = extraction.rawTagsByKey[key] ?? [];
    });
  }

  await writeJsonReport(dpMapPath, dpIdMap);
  await writeJsonReport(datapointReportPath, report);
  await writeJsonReport(tagStagingPath, tagStaging);
  logStep(`Wrote ${dpMapPath}`);
  logStep(`Wrote ${datapointReportPath}`);
  logStep(`Wrote ${tagStagingPath}`);
}

await main();
