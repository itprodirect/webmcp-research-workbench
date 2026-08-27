import "server-only";

import type { SearchSourcesResult } from "./source-record";
import { validateSearchInput } from "./search-input";
import { searchOpenAlex } from "../providers/openalex";

export async function searchSources(
  input: unknown,
  options: { signal?: AbortSignal } = {},
): Promise<SearchSourcesResult> {
  const validated = validateSearchInput(input);
  const results = await searchOpenAlex({ ...validated, signal: options.signal });

  return {
    query: validated.query,
    limit: validated.limit,
    results,
  };
}
