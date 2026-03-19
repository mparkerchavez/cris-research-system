import path from "node:path";
import { createConvexClient, runConvexQuery } from "./lib/convexClient.ts";
import { getMigrationPaths } from "./lib/fileDiscovery.ts";
import { readJsonReport, logStep } from "./lib/reports.ts";

type SourceStats = {
  totalSources: number;
  markdownBackedSources: number;
  pdfBackedSources: number;
  extractedSources: number;
  indexedSources: number;
  duplicateCanonicalUrlCount: number;
};

type DataPointStats = {
  totalDataPoints: number;
  totalExtractions: number;
  averageDataPointsPerExtraction: number;
  missingSourceIdCount: number;
  missingClaimTextCount: number;
  paragraphLocationCount: number;
  pageLocationCount: number;
  totalDataPointTagLinks: number;
};

type WeeklyStats = {
  totalWeeklyLearnings: number;
  totalWeeklyThemes: number;
  themesWithZeroCitations: number;
};

type TagStats = {
  totalTags: number;
  establishedTags: number;
  emergingTags: number;
  retiredTags: number;
  totalDataPointTagLinks: number;
};

async function main(): Promise<void> {
  const paths = getMigrationPaths(import.meta.url);
  const client = await createConvexClient(paths.projectRoot);

  const sourceStats = await runConvexQuery<Record<string, never>, SourceStats>(
    client,
    "sources:migrationListSourceStats",
    {},
  );
  const dataPointStats = await runConvexQuery<Record<string, never>, DataPointStats>(
    client,
    "dataPoints:migrationListDataPointStats",
    {},
  );
  const weeklyStats = await runConvexQuery<Record<string, never>, WeeklyStats>(
    client,
    "synthesis:migrationListWeeklyStats",
    {},
  );
  const tagStats = await runConvexQuery<Record<string, never>, TagStats>(
    client,
    "tags:migrationListTagStats",
    {},
  );

  const sourceReport = await readJsonReport<{
    totals: { ambiguousAliases: number; unresolvedExtractionReferences: number };
  }>(path.join(paths.migrationDir, "source_parse_report.json"));
  const datapointReport = await readJsonReport<{
    totals: { blockingIssues: number; warnings: number };
  }>(path.join(paths.migrationDir, "datapoint_parse_report.json"));
  const weeklyReport = await readJsonReport<{
    totals: { unresolvedCitations: number };
  }>(path.join(paths.migrationDir, "weekly_learning_report.json"));

  logStep("Phase 1B validation summary");
  console.log("");
  console.log("Sources");
  console.log(`- Total sources: ${sourceStats.totalSources}`);
  console.log(`- Markdown-backed sources: ${sourceStats.markdownBackedSources}`);
  console.log(`- PDF-backed sources: ${sourceStats.pdfBackedSources}`);
  console.log(`- Extracted sources: ${sourceStats.extractedSources}`);
  console.log(`- Indexed-only sources: ${sourceStats.indexedSources}`);
  console.log(
    `- Duplicate canonical URLs: ${sourceStats.duplicateCanonicalUrlCount}`,
  );
  console.log(
    `- Ambiguous source aliases in report: ${sourceReport.totals.ambiguousAliases}`,
  );
  console.log("");
  console.log("Tags");
  console.log(`- Total tags: ${tagStats.totalTags}`);
  console.log(`- Established tags: ${tagStats.establishedTags}`);
  console.log(`- Emerging tags: ${tagStats.emergingTags}`);
  console.log(`- Retired tags: ${tagStats.retiredTags}`);
  console.log(`- Data point tag links: ${tagStats.totalDataPointTagLinks}`);
  console.log("");
  console.log("Data Points");
  console.log(`- Total data points: ${dataPointStats.totalDataPoints}`);
  console.log(`- Total extraction records: ${dataPointStats.totalExtractions}`);
  console.log(
    `- Average data points per extraction: ${dataPointStats.averageDataPointsPerExtraction}`,
  );
  console.log(`- Missing sourceId count: ${dataPointStats.missingSourceIdCount}`);
  console.log(
    `- Missing claimText count: ${dataPointStats.missingClaimTextCount}`,
  );
  console.log(
    `- Paragraph locations parsed: ${dataPointStats.paragraphLocationCount}`,
  );
  console.log(`- Page locations parsed: ${dataPointStats.pageLocationCount}`);
  console.log(
    `- Data point tag links inserted: ${dataPointStats.totalDataPointTagLinks}`,
  );
  console.log(
    `- Blocking datapoint parse issues: ${datapointReport.totals.blockingIssues}`,
  );
  console.log(`- Datapoint parse warnings: ${datapointReport.totals.warnings}`);
  console.log("");
  console.log("Weekly Learnings");
  console.log(`- Weekly learning records: ${weeklyStats.totalWeeklyLearnings}`);
  console.log(`- Weekly theme records: ${weeklyStats.totalWeeklyThemes}`);
  console.log(
    `- Themes with zero citations: ${weeklyStats.themesWithZeroCitations}`,
  );
  console.log(
    `- Unresolved weekly citations logged: ${weeklyReport.totals.unresolvedCitations}`,
  );
  console.log("");
  console.log("Plain-language status");
  console.log(
    `- Source lineage is ${dataPointStats.missingSourceIdCount === 0 ? "intact" : "broken"} for migrated data points.`,
  );
  console.log(
    `- Weekly learnings ${weeklyStats.totalWeeklyLearnings === 8 ? "match" : "do not match"} the expected count of 8.`,
  );
}

await main();
