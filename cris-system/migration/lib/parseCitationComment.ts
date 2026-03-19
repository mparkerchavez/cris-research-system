export type ParsedCitationComment = {
  raw: string;
  path: string;
  dpNumbers: number[];
  invalidTokens: string[];
};

const CITE_REGEX = /<!--\s*cite:path=([^;]+);dp=([\s\S]*?)-->/g;

export function parseCitationComment(rawComment: string): ParsedCitationComment | null {
  const match = rawComment.match(/<!--\s*cite:path=([^;]+);dp=([\s\S]*?)-->/);
  if (!match) {
    return null;
  }

  return {
    raw: rawComment,
    path: match[1].trim(),
    ...normalizeDpTokens(match[2].trim()),
  };
}

export function parseCitationComments(text: string): ParsedCitationComment[] {
  const results: ParsedCitationComment[] = [];
  for (const match of text.matchAll(CITE_REGEX)) {
    const parsed = parseCitationComment(match[0]);
    if (parsed) {
      results.push(parsed);
    }
  }
  return results;
}

function normalizeDpTokens(value: string): {
  dpNumbers: number[];
  invalidTokens: string[];
} {
  const numbers: number[] = [];
  const invalidTokens: string[] = [];

  for (const rawToken of value.split(",")) {
    const cleaned = rawToken.trim().replace(/^dp=/i, "").replace(/^DP/i, "");
    if (!cleaned) {
      continue;
    }

    if (/^\d+$/.test(cleaned)) {
      numbers.push(Number.parseInt(cleaned, 10));
    } else {
      invalidTokens.push(rawToken.trim());
    }
  }

  return { dpNumbers: numbers, invalidTokens };
}
