import { SearchSourcesError } from "./search-error.ts";

export const DEFAULT_SEARCH_LIMIT = 5;
export const MAX_SEARCH_LIMIT = 10;
export const MAX_QUERY_LENGTH = 200;
export const MAX_SEMANTIC_QUERY_LENGTH = 2_000;

export type SearchMode = "keyword" | "semantic";

export interface ValidatedSearchInput {
  query: string;
  limit: number;
  mode: SearchMode;
}

export function validateSearchInput(input: unknown): ValidatedSearchInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw invalidRequest("Search input must be an object.");
  }

  const candidate = input as Record<string, unknown>;
  const allowedKeys = new Set(["query", "limit", "mode"]);
  if (Object.keys(candidate).some((key) => !allowedKeys.has(key))) {
    throw invalidRequest("Search input contains unsupported fields.");
  }

  if (typeof candidate.query !== "string") {
    throw invalidRequest("Query must be a string.");
  }

  const query = candidate.query.trim();
  if (!query) {
    throw invalidRequest("Query must not be empty.");
  }
  const mode = candidate.mode ?? "keyword";
  if (mode !== "keyword" && mode !== "semantic") {
    throw invalidRequest('Mode must be either "keyword" or "semantic".');
  }
  const maximumQueryLength =
    mode === "semantic" ? MAX_SEMANTIC_QUERY_LENGTH : MAX_QUERY_LENGTH;
  if (query.length > maximumQueryLength) {
    throw invalidRequest(`Query must be ${maximumQueryLength} characters or fewer in ${mode} mode.`);
  }

  const limit = candidate.limit ?? DEFAULT_SEARCH_LIMIT;
  if (
    typeof limit !== "number" ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > MAX_SEARCH_LIMIT
  ) {
    throw invalidRequest(`Limit must be an integer from 1 to ${MAX_SEARCH_LIMIT}.`);
  }

  return { query, limit, mode };
}

function invalidRequest(message: string): SearchSourcesError {
  return new SearchSourcesError("invalid_search_request", 400, message);
}
