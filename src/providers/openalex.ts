import "server-only";

import type { SourceRecord } from "../domain/source-record";
import { SearchSourcesError } from "../domain/search-error";
import {
  normalizeOpenAlexWork,
  OpenAlexNormalizationError,
} from "./openalex-normalize";

const OPENALEX_WORKS_ENDPOINT = "https://api.openalex.org/works";
const OPENALEX_TIMEOUT_MS = 8_000;
const MAX_PROVIDER_RESPONSE_BYTES = 256_000;
const SELECTED_FIELDS = [
  "id",
  "display_name",
  "doi",
  "publication_date",
  "publication_year",
  "type",
  "updated_date",
].join(",");

interface OpenAlexSearchInput {
  query: string;
  limit: number;
  signal?: AbortSignal;
}

export async function searchOpenAlex({
  query,
  limit,
  signal: callerSignal,
}: OpenAlexSearchInput): Promise<SourceRecord[]> {
  const url = new URL(OPENALEX_WORKS_ENDPOINT);
  url.searchParams.set("search", query);
  url.searchParams.set("per_page", String(limit));
  url.searchParams.set("select", SELECTED_FIELDS);

  const timeoutSignal = AbortSignal.timeout(OPENALEX_TIMEOUT_MS);
  const signal = callerSignal
    ? AbortSignal.any([callerSignal, timeoutSignal])
    : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      redirect: "error",
      signal,
    });
  } catch {
    if (timeoutSignal.aborted && !callerSignal?.aborted) {
      throw new SearchSourcesError(
        "provider_timeout",
        504,
        `OpenAlex did not respond within ${OPENALEX_TIMEOUT_MS} milliseconds.`,
        "openalex",
      );
    }
    throw new SearchSourcesError(
      "provider_failure",
      502,
      "OpenAlex request failed.",
      "openalex",
    );
  }

  if (!response.ok) {
    throw new SearchSourcesError(
      "provider_failure",
      502,
      `OpenAlex returned HTTP ${response.status}.`,
      "openalex",
    );
  }

  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_PROVIDER_RESPONSE_BYTES) {
    throw malformedResponse("OpenAlex response exceeded the allowed size.");
  }

  const rawBody = await response.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_PROVIDER_RESPONSE_BYTES) {
    throw malformedResponse("OpenAlex response exceeded the allowed size.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw malformedResponse("OpenAlex returned invalid JSON.");
  }

  if (!isRecord(payload) || !Array.isArray(payload.results)) {
    throw malformedResponse("OpenAlex response did not contain a results array.");
  }
  if (payload.results.length > limit) {
    throw malformedResponse("OpenAlex returned more results than requested.");
  }

  const retrievedAt = new Date().toISOString();
  try {
    return payload.results.map((work) => normalizeOpenAlexWork(work, retrievedAt));
  } catch (error) {
    if (error instanceof OpenAlexNormalizationError) {
      throw malformedResponse(error.message);
    }
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function malformedResponse(message: string): SearchSourcesError {
  return new SearchSourcesError(
    "malformed_provider_response",
    502,
    message,
    "openalex",
  );
}
