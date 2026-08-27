export type SourceDetailsErrorCode =
  | "invalid_source_id"
  | "unsupported_provider"
  | "source_not_found"
  | "request_aborted"
  | "provider_timeout"
  | "provider_failure"
  | "malformed_provider_response";

export class SourceDetailsError extends Error {
  readonly code: SourceDetailsErrorCode;
  readonly httpStatus: number;
  readonly provider?: "openalex";

  constructor(
    code: SourceDetailsErrorCode,
    httpStatus: number,
    message: string,
    provider?: "openalex",
  ) {
    super(message);
    this.name = "SourceDetailsError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.provider = provider;
  }
}
