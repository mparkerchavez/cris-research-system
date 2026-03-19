// Mark previously embedded data points so indexed embedding queries skip them.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createConvexClient, runConvexMutation } from "../migration/lib/convexClient.ts";

const PAGE_SIZE = 50;

type MarkDoneResult = {
  updatedCount: number;
  scannedCount: number;
  isDone: boolean;
  nextCursor?: string;
};

async function main(): Promise<void> {
  const scriptPath = fileURLToPath(import.meta.url);
  const embeddingDir = path.dirname(scriptPath);
  const projectRoot = path.resolve(embeddingDir, "..");
  const client = await createConvexClient(projectRoot);

  let cursor: string | undefined;
  let totalUpdated = 0;
  let totalScanned = 0;

  console.log(`Starting mark-done migration with page size ${PAGE_SIZE}.`);

  while (true) {
    const result = await runConvexMutation<
      { cursor?: string; limit?: number },
      MarkDoneResult
    >(client, "dataPoints:markExistingEmbeddingsAsDone", {
      cursor,
      limit: PAGE_SIZE,
    });

    totalUpdated += result.updatedCount;
    totalScanned += result.scannedCount;

    console.log(
      `Scanned ${totalScanned} data points | marked done this page: ${result.updatedCount} | total marked done: ${totalUpdated}`,
    );

    if (result.isDone) {
      break;
    }

    if (!result.nextCursor) {
      throw new Error("Pagination ended without a nextCursor before completion.");
    }

    cursor = result.nextCursor;
  }

  console.log("Final report:");
  console.log(`- Total scanned: ${totalScanned}`);
  console.log(`- Total marked done: ${totalUpdated}`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
