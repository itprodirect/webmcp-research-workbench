import type { SearchSourcesResult } from "../domain/source-record";

export async function searchSourcesViaServer(
  input: unknown,
  signal?: AbortSignal,
): Promise<SearchSourcesResult> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(readErrorMessage(payload));
  }
  if (!isSearchSourcesResult(payload)) {
    throw new Error("The search service returned an invalid response.");
  }

  return payload;
}

function readErrorMessage(payload: unknown): string {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }
  return "Search failed.";
}

function isSearchSourcesResult(value: unknown): value is SearchSourcesResult {
  return Boolean(value) && typeof value === "object" && Array.isArray((value as SearchSourcesResult).results);
}
