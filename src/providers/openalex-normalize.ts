import type {
  SourceAuthor,
  SourceDetailsRecord,
  SourcePrimaryLocation,
  SourceRecord,
} from "../domain/source-record.ts";

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

export function normalizeOpenAlexWorkDetails(
  value: unknown,
  retrievedAt: string,
): SourceDetailsRecord {
  if (!isRecord(value)) {
    throw new OpenAlexNormalizationError("OpenAlex work must be an object.");
  }

  return {
    ...normalizeOpenAlexWork(value, retrievedAt),
    authors: nullableAuthors(value.authorships),
    language: nullableString(value.language, "language"),
    primary_location: nullablePrimaryLocation(value.primary_location),
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

function nullableBoolean(value: unknown, field: string): boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "boolean") {
    throw new OpenAlexNormalizationError(`OpenAlex ${field} must be a boolean or null.`);
  }
  return value;
}

function nullableAuthors(value: unknown): SourceAuthor[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!Array.isArray(value)) {
    throw new OpenAlexNormalizationError(
      "OpenAlex authorships must be an array or null.",
    );
  }

  return value.map((authorship) => {
    if (!isRecord(authorship) || !isRecord(authorship.author)) {
      throw new OpenAlexNormalizationError(
        "OpenAlex authorship must contain an author object.",
      );
    }

    return {
      provider_record_id: nullableOpenAlexEntityId(
        authorship.author.id,
        "author id",
        "A",
      ),
      display_name: nullableString(authorship.author.display_name, "author display_name"),
      orcid: nullableString(authorship.author.orcid, "author orcid"),
    };
  });
}

function nullablePrimaryLocation(value: unknown): SourcePrimaryLocation | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!isRecord(value)) {
    throw new OpenAlexNormalizationError(
      "OpenAlex primary_location must be an object or null.",
    );
  }

  const source = value.source;
  if (source !== null && source !== undefined && !isRecord(source)) {
    throw new OpenAlexNormalizationError(
      "OpenAlex primary_location source must be an object or null.",
    );
  }

  return {
    source_provider_record_id: isRecord(source)
      ? nullableOpenAlexEntityId(source.id, "source id", "S")
      : null,
    source_name: isRecord(source)
      ? nullableString(source.display_name, "source display_name")
      : null,
    landing_page_url: nullableString(
      value.landing_page_url,
      "primary_location landing_page_url",
    ),
    version: nullableString(value.version, "primary_location version"),
    is_open_access: nullableBoolean(
      value.is_oa,
      "primary_location is_oa",
    ),
  };
}

function nullableOpenAlexEntityId(
  value: unknown,
  field: string,
  prefix: "A" | "S",
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new OpenAlexNormalizationError(`OpenAlex ${field} must be a string or null.`);
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new OpenAlexNormalizationError(`OpenAlex ${field} must be an absolute URL.`);
  }

  const match = parsed.pathname.match(new RegExp(`^/(${prefix}\\d+)/?$`));
  if (parsed.protocol !== "https:" || parsed.hostname !== "openalex.org" || !match) {
    throw new OpenAlexNormalizationError(`OpenAlex ${field} is not recognized.`);
  }
  return match[1];
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
