import path from "node:path";
import { promises as fs } from "node:fs";

export async function writeJsonReport(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function readJsonReport<T>(filePath: string): Promise<T> {
  const text = await fs.readFile(filePath, "utf8");
  return JSON.parse(text) as T;
}

export function logStep(message: string): void {
  console.log(`[phase1b] ${message}`);
}
