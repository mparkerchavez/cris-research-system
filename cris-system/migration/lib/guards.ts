import { promises as fs } from "node:fs";

export type ScriptFlags = {
  dryRun: boolean;
};

export function parseScriptFlags(argv: string[]): ScriptFlags {
  return {
    dryRun: argv.includes("--dry-run"),
  };
}

export async function assertOneTimeRun(
  outputPath: string,
  dryRun: boolean,
): Promise<void> {
  if (dryRun || process.env.CRIS_ALLOW_RERUN === "1") {
    return;
  }

  try {
    await fs.access(outputPath);
  } catch {
    return;
  }

  throw new Error(
    `Guard blocked rerun because ${outputPath} already exists. Set CRIS_ALLOW_RERUN=1 to override.`,
  );
}
