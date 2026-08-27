import { SourceDetailsError } from "./source-details-error.ts";

export interface ValidatedSourceDetailsInput {
  id: string;
  provider: "openalex";
  providerRecordId: string;
}

export function validateSourceDetailsInput(
  input: unknown,
): ValidatedSourceDetailsInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw invalidSourceId("Source details input must be an object.");
  }

  const candidate = input as Record<string, unknown>;
  if (Object.keys(candidate).some((key) => key !== "id")) {
    throw invalidSourceId("Source details input contains unsupported fields.");
  }
  if (typeof candidate.id !== "string" || !candidate.id) {
    throw invalidSourceId("Source ID must be a non-empty string.");
  }
  if (candidate.id.trim() !== candidate.id) {
    throw invalidSourceId("Source ID must not contain surrounding whitespace.");
  }

  const separator = candidate.id.indexOf(":");
  if (separator <= 0) {
    throw invalidSourceId("Source ID must be a normalized provider identifier.");
  }

  const provider = candidate.id.slice(0, separator);
  if (provider !== "openalex") {
    throw new SourceDetailsError(
      "unsupported_provider",
      400,
      `Source provider "${provider}" is not supported.`,
    );
  }

  const match = candidate.id.match(/^openalex:(W\d+)$/);
  if (!match) {
    throw invalidSourceId("Source ID is not a valid normalized OpenAlex work ID.");
  }

  return {
    id: candidate.id,
    provider: "openalex",
    providerRecordId: match[1],
  };
}

function invalidSourceId(message: string): SourceDetailsError {
  return new SourceDetailsError("invalid_source_id", 400, message);
}
