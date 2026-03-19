export async function fetchWithJina(url: string): Promise<{
  title: string;
  description: string;
  content: string;
  canonicalUrl: string;
}> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Return-Format": "markdown",
  };

  const apiKey = process.env.JINA_API_KEY;
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(jinaUrl, { headers });
  if (!response.ok) {
    throw new Error(
      `Jina fetch failed: ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as {
    data?: {
      title?: string;
      description?: string;
      content?: string;
      url?: string;
    };
  };

  const data = json.data ?? {};

  return {
    title: data.title ?? "",
    description: data.description ?? "",
    content: data.content ?? "",
    canonicalUrl: data.url ?? url,
  };
}
