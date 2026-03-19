// Batch-embed Convex data points with OpenAI and persist vectors back to the database.
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import {
  createConvexClient,
  runConvexMutation,
  runConvexQuery,
} from "../migration/lib/convexClient.ts";

const MODEL = "text-embedding-3-small";
const QUERY_LIMIT = 20;
const EMBEDDING_BATCH_SIZE = 20;
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_DELAY_MS = 200;

type ScriptFlags = {
  dryRun: boolean;
};

type DataPointForEmbedding = {
  _id: string;
  claimText: string;
  anchorQuote?: string;
};

type DataPointPage = {
  dataPoints: DataPointForEmbedding[];
  isDone: boolean;
  nextCursor?: string;
};

type EmbeddingSummary = {
  embedded: number;
  skipped: number;
  failed: number;
  wouldEmbed: number;
};

function parseScriptFlags(argv: string[]): ScriptFlags {
  return {
    dryRun: argv.includes("--dry-run"),
  };
}

function parseDotEnv(text: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }

    values[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }

  return values;
}

async function loadProjectEnv(projectRoot: string): Promise<Record<string, string>> {
  const envPath = path.join(projectRoot, ".env");

  try {
    const text = await fs.readFile(envPath, "utf8");
    return parseDotEnv(text);
  } catch {
    return {};
  }
}

async function loadOpenAIKey(projectRoot: string): Promise<string | undefined> {
  const fileEnv = await loadProjectEnv(projectRoot);
  return process.env.OPENAI_API_KEY ?? fileEnv.OPENAI_API_KEY;
}

function buildEmbeddingText(dataPoint: DataPointForEmbedding): string {
  const parts = [dataPoint.claimText];

  if (dataPoint.anchorQuote) {
    parts.push(`"${dataPoint.anchorQuote}"`);
  }

  return parts.join("\n");
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function listPage(
  client: Awaited<ReturnType<typeof createConvexClient>>,
  cursor: string | undefined,
): Promise<DataPointPage> {
  return await runConvexQuery<
    { cursor?: string; limit?: number },
    DataPointPage
  >(client, "dataPoints:listDataPointsNeedingEmbedding", {
    cursor,
    limit: QUERY_LIMIT,
  });
}

async function setEmbedding(
  client: Awaited<ReturnType<typeof createConvexClient>>,
  dataPointId: string,
  embedding: number[],
): Promise<void> {
  await runConvexMutation<
    { dataPointId: string; embedding: number[] },
    null
  >(client, "dataPoints:setEmbedding", {
    dataPointId,
    embedding,
  });
}

function logProgress(processed: number, summary: EmbeddingSummary, dryRun: boolean): void {
  if (dryRun) {
    console.log(
      `[dry-run] Processed ${processed} data points | would embed: ${summary.wouldEmbed} | failed: ${summary.failed}`,
    );
    return;
  }

  console.log(
    `Processed ${processed} data points | embedded: ${summary.embedded} | failed: ${summary.failed}`,
  );
}

async function processBatch(
  client: Awaited<ReturnType<typeof createConvexClient>>,
  openai: OpenAI | null,
  batch: DataPointForEmbedding[],
  summary: EmbeddingSummary,
  dryRun: boolean,
): Promise<void> {
  if (batch.length === 0) {
    return;
  }

  if (dryRun) {
    summary.wouldEmbed += batch.length;
    console.log(
      `[dry-run] Would embed ${batch.length} data points: ${batch
        .map((dataPoint) => dataPoint._id)
        .join(", ")}`,
    );
    return;
  }

  if (!openai) {
    throw new Error("OpenAI client was not initialized.");
  }

  const texts = batch.map(buildEmbeddingText);

  try {
    const response = await openai.embeddings.create({
      model: MODEL,
      input: texts,
    });

    if (response.data.length !== batch.length) {
      throw new Error(
        `Embedding response count mismatch: expected ${batch.length}, received ${response.data.length}.`,
      );
    }

    for (const [index, dataPoint] of batch.entries()) {
      const embedding = response.data[index]?.embedding;

      if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
        summary.failed += 1;
        console.error(
          `Invalid embedding for data point ${dataPoint._id}: expected ${EMBEDDING_DIMENSIONS} dimensions.`,
        );
        continue;
      }

      try {
        await setEmbedding(client, dataPoint._id, embedding);
        summary.embedded += 1;
      } catch (error) {
        summary.failed += 1;
        console.error(
          `Failed to save embedding for data point ${dataPoint._id}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  } catch (error) {
    summary.failed += batch.length;
    console.error(
      `Embedding API failed for batch [${batch.map((dataPoint) => dataPoint._id).join(", ")}]: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

async function main(): Promise<void> {
  const flags = parseScriptFlags(process.argv.slice(2));
  const scriptPath = fileURLToPath(import.meta.url);
  const embeddingDir = path.dirname(scriptPath);
  const projectRoot = path.resolve(embeddingDir, "..");
  const client = await createConvexClient(projectRoot);
  const openAiKey = flags.dryRun ? undefined : await loadOpenAIKey(projectRoot);

  if (!flags.dryRun && !openAiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it in cris-system/.env or in the shell environment.",
    );
  }

  const openai = openAiKey ? new OpenAI({ apiKey: openAiKey }) : null;
  const summary: EmbeddingSummary = {
    embedded: 0,
    skipped: 0,
    failed: 0,
    wouldEmbed: 0,
  };

  let cursor: string | undefined;
  let processed = 0;

  console.log(
    `${flags.dryRun ? "Starting dry run" : "Starting embedding job"} with batch size ${EMBEDDING_BATCH_SIZE}.`,
  );

  while (true) {
    const page = await listPage(client, cursor);
    const batch = page.dataPoints.slice(0, EMBEDDING_BATCH_SIZE);

    if (batch.length > 0) {
      await processBatch(client, openai, batch, summary, flags.dryRun);
      processed += batch.length;

      if (processed % 100 === 0 || page.isDone) {
        logProgress(processed, summary, flags.dryRun);
      }

      if (!page.isDone) {
        await delay(BATCH_DELAY_MS);
      }
    }

    if (page.isDone) {
      break;
    }

    cursor = page.nextCursor;
    if (!cursor) {
      throw new Error("Pagination ended without a nextCursor before completion.");
    }
  }

  console.log("Final report:");
  console.log(`- Mode: ${flags.dryRun ? "dry-run" : "live"}`);
  console.log(`- Total embedded: ${summary.embedded}`);
  console.log(`- Total skipped: ${summary.skipped}`);
  console.log(`- Total failed: ${summary.failed}`);
  if (flags.dryRun) {
    console.log(`- Total that would be embedded: ${summary.wouldEmbed}`);
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
