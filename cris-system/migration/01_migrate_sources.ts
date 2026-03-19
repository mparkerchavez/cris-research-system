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
import {
  cleanFilenameToTitle,
  normalizeForMatch,
  toPosixPath,
} from "./lib/normalize.ts";
import { parseExtractionSourceReference } from "./lib/parseExtraction.ts";
import { parseRawSource } from "./lib/parseRawSource.ts";
import { logStep, writeJsonReport } from "./lib/reports.ts";

type SourceInsertResult = {
  id: string;
  originalFilePath: string;
  normalizedPath: string;
  normalizedBasename: string;
};

type ReportItem = {
  filePath: string;
  issue: string;
};

type PreparedSource = {
  originalFilePath: string;
  normalizedPath: string;
  normalizedBasename: string;
  doc: {
    title: string;
    authorName?: string;
    publisherName?: string;
    canonicalUrl?: string;
    publishedDate?: string;
    sourceType: string;
    fullText?: string;
    fullTextFormat?: "markdown";
    wordCount?: number;
    ingestedDate: string;
    originalFilePath: string;
    status: "indexed" | "extracted";
  };
};

function addAlias(
  aliasToId: Map<string, string>,
  ambiguousAliases: Set<string>,
  alias: string,
  id: string,
): void {
  if (!alias) {
    return;
  }

  const existing = aliasToId.get(alias);
  if (!existing) {
    aliasToId.set(alias, id);
    return;
  }

  if (existing !== id) {
    aliasToId.delete(alias);
    ambiguousAliases.add(alias);
  }
}

async function main(): Promise<void> {
  const flags = parseScriptFlags(process.argv.slice(2));
  const paths = getMigrationPaths(import.meta.url);
  const sourceMapPath = path.join(paths.migrationDir, "source_id_map.json");
  const sourceReportPath = path.join(paths.migrationDir, "source_parse_report.json");

  await assertOneTimeRun(sourceMapPath, flags.dryRun);

  const rawSourceFiles = await listRawSourceFiles(paths);
  const extractionFiles = await listExtractionFiles(paths);

  logStep(`Discovered ${rawSourceFiles.length} raw source files`);

  const aliasToId = new Map<string, string>();
  const ambiguousAliases = new Set<string>();
  const reportItems: ReportItem[] = [];
  const insertedSources: SourceInsertResult[] = [];
  const preparedSources: PreparedSource[] = [];

  const extractionReferences = [];
  for (const extractionFile of extractionFiles) {
    const text = await fs.readFile(extractionFile, "utf8");
    const sourceReference = parseExtractionSourceReference(text);
    if (sourceReference) {
      extractionReferences.push(sourceReference);
    }
  }
  const exactExtractionReferences = new Set(extractionReferences);
  const normalizedExtractionReferences = new Set(
    extractionReferences.map((reference) => normalizeForMatch(toPosixPath(reference))),
  );
  const normalizedExtractionBasenames = new Set(
    extractionReferences.map((reference) =>
      normalizeForMatch(path.posix.basename(reference)),
    ),
  );

  for (const filePath of rawSourceFiles) {
    const relativePath = toRepoRelativePath(paths.workspaceRoot, filePath);
    const fileText = filePath.toLowerCase().endsWith(".md")
      ? await fs.readFile(filePath, "utf8")
      : null;

    const parsed = parseRawSource(relativePath, fileText);
    for (const warning of parsed.warnings) {
      reportItems.push({ filePath: relativePath, issue: warning });
    }

    const normalizedPath = normalizeForMatch(relativePath);
    const normalizedBasename = normalizeForMatch(path.posix.basename(relativePath));
    const sourceDoc: PreparedSource["doc"] = {
      title: parsed.title || cleanFilenameToTitle(relativePath),
      authorName: parsed.authorName,
      publisherName: parsed.publisherName,
      canonicalUrl: parsed.canonicalUrl,
      publishedDate: parsed.publishedDate,
      sourceType: parsed.sourceType,
      fullText: parsed.fullText,
      fullTextFormat: parsed.fullTextFormat,
      wordCount: parsed.wordCount,
      ingestedDate: new Date().toISOString().slice(0, 10),
      originalFilePath: parsed.originalFilePath,
      status:
        exactExtractionReferences.has(relativePath) ||
        normalizedExtractionReferences.has(normalizedPath) ||
        normalizedExtractionBasenames.has(normalizedBasename)
          ? "extracted"
          : "indexed",
    };

    preparedSources.push({
      originalFilePath: relativePath,
      normalizedPath,
      normalizedBasename,
      doc: sourceDoc,
    });

    const placeholderId = `prepared:${preparedSources.length}`;
    addAlias(aliasToId, ambiguousAliases, relativePath, placeholderId);
    addAlias(aliasToId, ambiguousAliases, normalizedPath, placeholderId);
    addAlias(aliasToId, ambiguousAliases, normalizedBasename, placeholderId);
  }

  logStep("Validating extraction-to-source coverage");
  const unresolvedExtractions: ReportItem[] = [];
  for (const extractionPath of extractionFiles) {
    const relativePath = toRepoRelativePath(paths.workspaceRoot, extractionPath);
    const text = await fs.readFile(extractionPath, "utf8");
    const sourceReference = parseExtractionSourceReference(text);
    if (!sourceReference) {
      unresolvedExtractions.push({
        filePath: relativePath,
        issue: "Missing Original Location / URL/Location",
      });
      continue;
    }

    const normalizedReference = normalizeForMatch(toPosixPath(sourceReference));
    const exactMatch = aliasToId.get(sourceReference);
    const normalizedMatch = aliasToId.get(normalizedReference);
    const basenameMatch = aliasToId.get(
      normalizeForMatch(path.posix.basename(sourceReference)),
    );

    const resolvedMatches = new Set(
      [exactMatch, normalizedMatch, basenameMatch].filter(Boolean),
    );

    if (resolvedMatches.size === 1) {
      continue;
    }

    if (
      ambiguousAliases.has(normalizedReference) ||
      ambiguousAliases.has(normalizeForMatch(path.posix.basename(sourceReference)))
    ) {
      unresolvedExtractions.push({
        filePath: relativePath,
        issue: `Ambiguous source alias for reference: ${sourceReference}`,
      });
    } else {
      unresolvedExtractions.push({
        filePath: relativePath,
        issue: `Unresolved source reference: ${sourceReference}`,
      });
    }
  }

  reportItems.push(...unresolvedExtractions);

  const report = {
    dryRun: flags.dryRun,
    totals: {
      rawSources: rawSourceFiles.length,
      ambiguousAliases: ambiguousAliases.size,
      extractionFilesChecked: extractionFiles.length,
      unresolvedExtractionReferences: unresolvedExtractions.length,
    },
    ambiguousAliases: [...ambiguousAliases].sort(),
    items: reportItems,
  };

  if (unresolvedExtractions.length > 0) {
    if (!flags.dryRun) {
      await writeJsonReport(sourceReportPath, report);
    }
    throw new Error(
      `Source migration validation failed with ${unresolvedExtractions.length} unresolved extraction references.`,
    );
  }

  if (flags.dryRun) {
    logStep(
      `Dry run succeeded: ${rawSourceFiles.length} sources parsed and ${extractionFiles.length} extraction references validated.`,
    );
    return;
  }

  const client = await createConvexClient(paths.projectRoot);
  for (const preparedSource of preparedSources) {
    const id = await runConvexMutation(
      client,
      "sources:migrationInsertSource",
      { doc: preparedSource.doc },
    );

    insertedSources.push({
      id,
      originalFilePath: preparedSource.originalFilePath,
      normalizedPath: preparedSource.normalizedPath,
      normalizedBasename: preparedSource.normalizedBasename,
    });
  }

  const sourceIdMap: Record<string, string> = {};
  for (const source of insertedSources) {
    sourceIdMap[source.originalFilePath] = source.id;
    sourceIdMap[source.normalizedPath] = source.id;
    if (!ambiguousAliases.has(source.normalizedBasename)) {
      sourceIdMap[source.normalizedBasename] = source.id;
    }
  }

  await writeJsonReport(sourceMapPath, sourceIdMap);
  await writeJsonReport(sourceReportPath, report);
  logStep(`Wrote ${sourceMapPath}`);
  logStep(`Wrote ${sourceReportPath}`);
}

await main();
