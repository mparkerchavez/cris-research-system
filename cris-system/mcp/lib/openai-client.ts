import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

let cachedClient: OpenAI | null = null;

export async function getOpenAIClient(): Promise<OpenAI> {
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

  const apiKey = process.env.OPENAI_API_KEY ?? fileEnv.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}
