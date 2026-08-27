import "server-only";

import type { GetSourceDetailsResult } from "./source-record.ts";
import { validateSourceDetailsInput } from "./source-details-input.ts";
import { getOpenAlexWork } from "../providers/openalex.ts";

export async function getSourceDetails(
  input: unknown,
  options: { signal?: AbortSignal } = {},
): Promise<GetSourceDetailsResult> {
  const validated = validateSourceDetailsInput(input);
  const source = await getOpenAlexWork(validated.providerRecordId, options.signal);

  return { source };
}
