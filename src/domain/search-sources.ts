import "server-only";

import type { SearchSourcesResult } from "./source-record.ts";
import { validateSearchInput } from "./search-input.ts";
import { searchOpenAlex } from "../providers/openalex.ts";

export async function searchSources(
  input: unknown,
  options: { signal?: AbortSignal } = {},
): Promise<SearchSourcesResult> {
  const validated = validateSearchInput(input);
  const results = await searchOpenAlex({ ...validated, signal: options.signal });

  return {
    query: validated.query,
    mode: validated.mode,
    limit: validated.limit,
    results,
  };
}
