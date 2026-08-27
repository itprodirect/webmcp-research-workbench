import type {
  GetSourceDetailsResult,
  SourceDetailsRecord,
} from "../domain/source-record";

export async function getSourceDetailsViaServer(
  input: unknown,
  signal?: AbortSignal,
): Promise<GetSourceDetailsResult> {
  const response = await fetch("/api/source-details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(readErrorMessage(payload));
  }
  if (!isGetSourceDetailsResult(payload)) {
    throw new Error("The source details service returned an invalid response.");
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
  return "Source details failed.";
}

function isGetSourceDetailsResult(value: unknown): value is GetSourceDetailsResult {
  if (!value || typeof value !== "object" || !("source" in value)) {
    return false;
  }

  const source = value.source as Partial<SourceDetailsRecord> | null;
  return Boolean(
    source &&
      typeof source === "object" &&
      typeof source.id === "string" &&
      source.provider === "openalex" &&
      typeof source.provider_record_id === "string" &&
      (source.authors === null || Array.isArray(source.authors)),
  );
}
