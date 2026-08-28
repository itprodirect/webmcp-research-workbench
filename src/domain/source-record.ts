export type SourceClass =
  | "official_documentation"
  | "standards_body"
  | "government"
  | "peer_reviewed"
  | "preprint"
  | "repository"
  | "technical_publication"
  | "community"
  | "unknown";

export interface SourceRecord {
  id: string;
  provider: "openalex";
  provider_record_id: string;
  title: string | null;
  canonical_url: string | null;
  source_class: SourceClass;
  publication_date: string | null;
  provider_updated_at: string | null;
  retrieved_at: string;
  doi: string | null;
  publication_year: number | null;
  provider_type: string | null;
}

export interface SourceAuthor {
  provider_record_id: string | null;
  display_name: string | null;
  orcid: string | null;
}

export interface SourcePrimaryLocation {
  source_provider_record_id: string | null;
  source_name: string | null;
  landing_page_url: string | null;
  version: string | null;
  is_open_access: boolean | null;
}

export interface SourceOpenAccess {
  is_oa: boolean | null;
  oa_status: string | null;
  oa_url: string | null;
}

export interface SourcePrimaryTopic {
  provider_record_id: string | null;
  display_name: string | null;
}

export interface SourceDetailsRecord extends SourceRecord {
  authors: SourceAuthor[] | null;
  language: string | null;
  primary_location: SourcePrimaryLocation | null;
  abstract: string | null;
  cited_by_count: number | null;
  open_access: SourceOpenAccess | null;
  primary_topic: SourcePrimaryTopic | null;
}

export interface SearchSourcesResult {
  query: string;
  mode: "keyword" | "semantic";
  limit: number;
  results: SourceRecord[];
}

export interface GetSourceDetailsResult {
  source: SourceDetailsRecord;
}
