import type { SourceRecord } from "../domain/source-record";

export class OpenAlexNormalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAlexNormalizationError";
  }
}

export function normalizeOpenAlexWork(
  value: unknown,
  retrievedAt: string,
): SourceRecord {
  if (!isRecord(value)) {
    throw new OpenAlexNormalizationError("OpenAlex work must be an object.");
  }

  const openAlexUrl = requiredString(value.id, "id");
  const providerRecordId = parseOpenAlexWorkId(openAlexUrl);
  const providerType = nullableString(value.type, "type");

  return {
    id: `openalex:${providerRecordId}`,
    provider: "openalex",
    provider_record_id: providerRecordId,
    title: nullableString(value.display_name, "display_name"),
    canonical_url: openAlexUrl,
    source_class: providerType === "preprint" ? "preprint" : "unknown",
    publication_date: nullableString(value.publication_date, "publication_date"),
    provider_updated_at: nullableString(value.updated_date, "updated_date"),
    retrieved_at: retrievedAt,
    doi: nullableString(value.doi, "doi"),
    publication_year: nullableInteger(value.publication_year, "publication_year"),
    provider_type: providerType,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new OpenAlexNormalizationError(`OpenAlex ${field} must be a non-empty string.`);
  }
  return value;
}

function nullableString(value: unknown, field: string): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new OpenAlexNormalizationError(`OpenAlex ${field} must be a string or null.`);
  }
  return value;
}

function nullableInteger(value: unknown, field: string): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new OpenAlexNormalizationError(`OpenAlex ${field} must be an integer or null.`);
  }
  return value;
}

function parseOpenAlexWorkId(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new OpenAlexNormalizationError("OpenAlex id must be an absolute URL.");
  }

  const match = parsed.pathname.match(/^\/(W\d+)\/?$/);
  if (parsed.protocol !== "https:" || parsed.hostname !== "openalex.org" || !match) {
    throw new OpenAlexNormalizationError("OpenAlex id is not a recognized work URL.");
  }
  return match[1];
}
