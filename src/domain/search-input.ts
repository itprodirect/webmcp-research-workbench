import { SearchSourcesError } from "./search-error.ts";

export const DEFAULT_SEARCH_LIMIT = 5;
export const MAX_SEARCH_LIMIT = 10;
export const MAX_QUERY_LENGTH = 200;

export interface ValidatedSearchInput {
  query: string;
  limit: number;
}

export function validateSearchInput(input: unknown): ValidatedSearchInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw invalidRequest("Search input must be an object.");
  }

  const candidate = input as Record<string, unknown>;
  const allowedKeys = new Set(["query", "limit"]);
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
  if (query.length > MAX_QUERY_LENGTH) {
    throw invalidRequest(`Query must be ${MAX_QUERY_LENGTH} characters or fewer.`);
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

  return { query, limit };
}

function invalidRequest(message: string): SearchSourcesError {
  return new SearchSourcesError("invalid_search_request", 400, message);
}
