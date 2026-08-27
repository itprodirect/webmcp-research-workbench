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

export interface SearchSourcesResult {
  query: string;
  limit: number;
  results: SourceRecord[];
}
