import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type MigrationPaths = {
  projectRoot: string;
  workspaceRoot: string;
  migrationDir: string;
  tagsFilePath: string;
  rawInputsDir: string;
  extractionsDir: string;
  weeklyLearningsDir: string;
};

async function walkFiles(
  dir: string,
  includeExtensions: Set<string>,
  results: string[],
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const sorted = entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of sorted) {
    if (entry.name === ".DS_Store") {
      continue;
    }

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(entryPath, includeExtensions, results);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (includeExtensions.has(extension)) {
      results.push(entryPath);
    }
  }
}

export function getMigrationPaths(scriptUrl: string): MigrationPaths {
  const migrationDir = path.dirname(fileURLToPath(scriptUrl));
  const projectRoot = path.resolve(migrationDir, "..");
  const workspaceRoot = path.resolve(projectRoot, "..");

  return {
    projectRoot,
    workspaceRoot,
    migrationDir,
    tagsFilePath: path.join(workspaceRoot, "_System", "Tags.md"),
    rawInputsDir: path.join(workspaceRoot, "01_Raw_Inputs"),
    extractionsDir: path.join(workspaceRoot, "02_Extractions"),
    weeklyLearningsDir: path.join(workspaceRoot, "03_Weekly_Learnings"),
  };
}

export function toRepoRelativePath(root: string, targetPath: string): string {
  return path.relative(root, targetPath).split(path.sep).join("/");
}

export async function listRawSourceFiles(paths: MigrationPaths): Promise<string[]> {
  const results: string[] = [];
  await walkFiles(paths.rawInputsDir, new Set([".md", ".pdf"]), results);
  return results;
}

export async function listExtractionFiles(
  paths: MigrationPaths,
): Promise<string[]> {
  const results: string[] = [];
  await walkFiles(paths.extractionsDir, new Set([".md"]), results);

  return results.filter((filePath) => !filePath.endsWith("_Extraction_Index.md"));
}

export async function listWeeklyLearningFiles(
  paths: MigrationPaths,
): Promise<string[]> {
  const results: string[] = [];
  await walkFiles(paths.weeklyLearningsDir, new Set([".md"]), results);

  return results
    .filter((filePath) => path.basename(filePath).startsWith("WL_"))
    .sort((a, b) => a.localeCompare(b));
}
