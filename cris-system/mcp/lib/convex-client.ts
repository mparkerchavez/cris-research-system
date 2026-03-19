import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseDotEnv(text: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) {
      values[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }

  return values;
}

let cachedClient: ConvexHttpClient | null = null;

export async function getConvexClient(): Promise<ConvexHttpClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const envPath = path.resolve(__dirname, "../../.env");
  let fileEnv: Record<string, string> = {};

  try {
    fileEnv = parseDotEnv(await fs.readFile(envPath, "utf8"));
  } catch {
    // The local .env is optional when process env vars are already set.
  }

  const url = process.env.CONVEX_URL ?? fileEnv.CONVEX_URL;
  const key = process.env.CONVEX_DEPLOY_KEY ?? fileEnv.CONVEX_DEPLOY_KEY;

  if (!url || !key) {
    throw new Error("Missing CONVEX_URL or CONVEX_DEPLOY_KEY");
  }

  cachedClient = new ConvexHttpClient(url);
  cachedClient.setAdminAuth(key);
  return cachedClient;
}

export async function mutation<TArgs, TResult>(
  name: string,
  args: TArgs,
): Promise<TResult> {
  const client = await getConvexClient();
  return await client.mutation(
    makeFunctionReference<"mutation", TArgs, TResult>(name),
    args,
  );
}

export async function action<TArgs, TResult>(
  name: string,
  args: TArgs,
): Promise<TResult> {
  const client = await getConvexClient();
  return await client.action(
    makeFunctionReference<"action", TArgs, TResult>(name),
    args,
  );
}

export async function query<TArgs, TResult>(
  name: string,
  args: TArgs,
): Promise<TResult> {
  const client = await getConvexClient();
  return await client.query(
    makeFunctionReference<"query", TArgs, TResult>(name),
    args,
  );
}
