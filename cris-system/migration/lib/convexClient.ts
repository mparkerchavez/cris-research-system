import { promises as fs } from "node:fs";
import path from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

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

async function loadEnv(projectRoot: string): Promise<Record<string, string>> {
  const envPath = path.join(projectRoot, ".env");
  try {
    const text = await fs.readFile(envPath, "utf8");
    return parseDotEnv(text);
  } catch {
    return {};
  }
}

export async function createConvexClient(projectRoot: string): Promise<ConvexHttpClient> {
  const fileEnv = await loadEnv(projectRoot);
  const convexUrl = process.env.CONVEX_URL ?? fileEnv.CONVEX_URL;
  const deployKey = process.env.CONVEX_DEPLOY_KEY ?? fileEnv.CONVEX_DEPLOY_KEY;

  if (!convexUrl || !deployKey) {
    throw new Error(
      "Missing CONVEX_URL or CONVEX_DEPLOY_KEY. Set them in .env or the shell environment.",
    );
  }

  const client = new ConvexHttpClient(convexUrl);
  client.setAdminAuth(deployKey);
  return client;
}

export async function runConvexMutation<TArgs, TResult>(
  client: ConvexHttpClient,
  name: string,
  args: TArgs,
): Promise<TResult> {
  return await client.mutation(
    makeFunctionReference<"mutation", TArgs, TResult>(name),
    args,
  );
}

export async function runConvexQuery<TArgs, TResult>(
  client: ConvexHttpClient,
  name: string,
  args: TArgs,
): Promise<TResult> {
  return await client.query(
    makeFunctionReference<"query", TArgs, TResult>(name),
    args,
  );
}
