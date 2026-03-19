import { promises as fs } from "node:fs";
import path from "node:path";
import { createConvexClient, runConvexMutation } from "./lib/convexClient.ts";
import { getMigrationPaths, toRepoRelativePath } from "./lib/fileDiscovery.ts";
import { assertOneTimeRun, parseScriptFlags } from "./lib/guards.ts";
import { parseTagsFile } from "./lib/parseTags.ts";
import { logStep, writeJsonReport } from "./lib/reports.ts";

async function main(): Promise<void> {
  const flags = parseScriptFlags(process.argv.slice(2));
  const paths = getMigrationPaths(import.meta.url);
  const tagMapPath = path.join(paths.migrationDir, "artifacts", "tag_id_map.json");

  await assertOneTimeRun(tagMapPath, flags.dryRun);

  const text = await fs.readFile(paths.tagsFilePath, "utf8");
  const parsed = parseTagsFile(text);
  const relativeTagsPath = toRepoRelativePath(paths.workspaceRoot, paths.tagsFilePath);

  logStep(`Parsed ${parsed.tags.length} unique tags from ${relativeTagsPath}`);
  if (parsed.warnings.length > 0) {
    logStep(`Ignored ${parsed.warnings.length} duplicate or invalid tag rows`);
  }

  if (flags.dryRun) {
    logStep(
      `Dry run succeeded: ${parsed.tags.length} tags ready (${parsed.tags.filter((tag) => tag.category === "established").length} established, ${parsed.tags.filter((tag) => tag.category === "emerging").length} emerging, ${parsed.tags.filter((tag) => tag.category === "retired").length} retired).`,
    );
    return;
  }

  const client = await createConvexClient(paths.projectRoot);
  const tagIdMap: Record<string, string> = {};

  for (const tag of parsed.tags) {
    const id = await runConvexMutation<
      { doc: { name: string; slug: string; category?: string; description?: string } },
      string
    >(client, "tags:migrationInsertTag", {
      doc: {
        name: tag.name,
        slug: tag.slug,
        category: tag.category,
        description: tag.description,
      },
    });
    tagIdMap[tag.slug] = id;
  }

  await writeJsonReport(tagMapPath, tagIdMap);
  logStep(`Wrote ${tagMapPath}`);
}

await main();
