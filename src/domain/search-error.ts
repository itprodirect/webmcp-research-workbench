export type SearchErrorCode =
  | "invalid_search_request"
  | "provider_timeout"
  | "provider_failure"
  | "malformed_provider_response";

export class SearchSourcesError extends Error {
  readonly code: SearchErrorCode;
  readonly httpStatus: number;
  readonly provider?: "openalex";

  constructor(
    code: SearchErrorCode,
    httpStatus: number,
    message: string,
    provider?: "openalex",
  ) {
    super(message);
    this.name = "SearchSourcesError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.provider = provider;
  }
}
