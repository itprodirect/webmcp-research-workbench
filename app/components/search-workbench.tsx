"use client";

import { FormEvent, useRef, useState } from "react";
import type {
  SourceDetailsRecord,
  SourceRecord,
} from "@/src/domain/source-record";
import { searchSourcesViaServer } from "@/src/client/search-api";
import { getSourceDetailsViaServer } from "@/src/client/source-details-api";
import {
  addSourceToPacket,
  removeSourceFromPacket,
} from "@/src/client/research-packet";

const UI_RESULT_LIMIT = 5;
type RequestStatus = "idle" | "loading" | "success" | "error";

export function SearchWorkbench() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SourceRecord[]>([]);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [details, setDetails] = useState<SourceDetailsRecord | null>(null);
  const [detailsStatus, setDetailsStatus] = useState<RequestStatus>("idle");
  const [detailsError, setDetailsError] = useState("");
  const [packet, setPacket] = useState<SourceDetailsRecord[]>([]);
  const activeRequest = useRef<AbortController | null>(null);
  const activeDetailsRequest = useRef<AbortController | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activeRequest.current?.abort();
    activeDetailsRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setStatus("loading");
    setError("");
    setSelectedSourceId(null);
    setDetails(null);
    setDetailsStatus("idle");
    setDetailsError("");

    try {
      const response = await searchSourcesViaServer(
        { query, limit: UI_RESULT_LIMIT },
        controller.signal,
      );
      setResults(response.results);
      setStatus("success");
    } catch (caught) {
      if (controller.signal.aborted) {
        return;
      }
      setResults([]);
      setError(caught instanceof Error ? caught.message : "Search failed.");
      setStatus("error");
    }
  }

  async function handleInspect(sourceId: string) {
    activeDetailsRequest.current?.abort();
    const controller = new AbortController();
    activeDetailsRequest.current = controller;
    setSelectedSourceId(sourceId);
    setDetails(null);
    setDetailsStatus("loading");
    setDetailsError("");

    try {
      const response = await getSourceDetailsViaServer(
        { id: sourceId },
        controller.signal,
      );
      if (response.source.id !== sourceId) {
        throw new Error("The source details service returned a different source ID.");
      }
      setDetails(response.source);
      setDetailsStatus("success");
    } catch (caught) {
      if (controller.signal.aborted) {
        return;
      }
      setDetailsError(
        caught instanceof Error ? caught.message : "Source details failed.",
      );
      setDetailsStatus("error");
    }
  }

  function handleAddToPacket(source: SourceDetailsRecord) {
    setPacket((current) => addSourceToPacket(current, source));
  }

  function handleRemoveFromPacket(sourceId: string) {
    setPacket((current) => removeSourceFromPacket(current, sourceId));
  }

  return (
    <section className="search-panel" aria-labelledby="search-heading">
      <h2 id="search-heading">Search OpenAlex</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="source-query">Research topic</label>
        <input
          id="source-query"
          name="query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. browser agents"
          maxLength={200}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Searching…" : "Search"}
        </button>
      </form>

      <SearchStatus status={status} error={error} count={results.length} />

      {results.length > 0 && (
        <div className="results" aria-label="Search results">
          {results.map((source) => (
            <SourceResult
              key={source.id}
              source={source}
              isLoading={
                detailsStatus === "loading" && selectedSourceId === source.id
              }
              onInspect={handleInspect}
            />
          ))}
        </div>
      )}

      <SourceDetailsPanel
        sourceId={selectedSourceId}
        source={details}
        status={detailsStatus}
        error={detailsError}
        isInPacket={Boolean(
          details && packet.some((member) => member.id === details.id),
        )}
        onAdd={handleAddToPacket}
      />

      <ResearchPacket packet={packet} onRemove={handleRemoveFromPacket} />
    </section>
  );
}

function SearchStatus({
  status,
  error,
  count,
}: {
  status: RequestStatus;
  error: string;
  count: number;
}) {
  if (status === "idle") {
    return <p className="status">Results are limited to {UI_RESULT_LIMIT} records.</p>;
  }
  if (status === "loading") {
    return <p className="status">Loading real OpenAlex data…</p>;
  }
  if (status === "error") {
    return <p className="status error" role="alert">{error}</p>;
  }
  if (count === 0) {
    return <p className="status">No matching OpenAlex records were returned.</p>;
  }
  return <p className="status">Returned {count} normalized source{count === 1 ? "" : "s"}.</p>;
}

function SourceResult({
  source,
  isLoading,
  onInspect,
}: {
  source: SourceRecord;
  isLoading: boolean;
  onInspect: (sourceId: string) => void;
}) {
  const externalUrl = safeExternalUrl(source.canonical_url);

  return (
    <article className="result-card">
      <code className="source-id">{source.id}</code>
      <h2>{source.title ?? "Title unknown"}</h2>
      <p className="metadata">
        <span>Provider: {source.provider}</span>
        <span>Provider ID: {source.provider_record_id}</span>
        <span>Class: {source.source_class}</span>
        <span>Published: {source.publication_date ?? "unknown"}</span>
        <span>Type: {source.provider_type ?? "unknown"}</span>
        {source.doi && <span>DOI: {source.doi}</span>}
      </p>
      <div className="card-actions">
        <button
          type="button"
          onClick={() => onInspect(source.id)}
          disabled={isLoading}
        >
          {isLoading ? "Loading details…" : "Inspect source"}
        </button>
        {externalUrl && (
          <a
            className="external-link"
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View provider record
          </a>
        )}
      </div>
    </article>
  );
}

function SourceDetailsPanel({
  sourceId,
  source,
  status,
  error,
  isInPacket,
  onAdd,
}: {
  sourceId: string | null;
  source: SourceDetailsRecord | null;
  status: RequestStatus;
  error: string;
  isInPacket: boolean;
  onAdd: (source: SourceDetailsRecord) => void;
}) {
  if (status === "idle") {
    return (
      <section className="detail-panel" aria-labelledby="details-heading">
        <h2 id="details-heading">Source details</h2>
        <p className="status">Choose one result to inspect its known metadata.</p>
      </section>
    );
  }

  if (status === "loading") {
    return (
      <section className="detail-panel" aria-labelledby="details-heading">
        <h2 id="details-heading">Source details</h2>
        <p className="status">Loading {sourceId ?? "source"}…</p>
      </section>
    );
  }

  if (status === "error" || !source) {
    return (
      <section className="detail-panel" aria-labelledby="details-heading">
        <h2 id="details-heading">Source details</h2>
        {sourceId && <code className="source-id">{sourceId}</code>}
        <p className="status error" role="alert">{error || "Source details failed."}</p>
      </section>
    );
  }

  const providerUrl = safeExternalUrl(source.canonical_url);
  const locationUrl = safeExternalUrl(source.primary_location?.landing_page_url ?? null);

  return (
    <section className="detail-panel" aria-labelledby="details-heading">
      <h2 id="details-heading">Source details</h2>
      <code className="source-id">{source.id}</code>
      <h3>{source.title ?? "Title unknown"}</h3>
      <p className="trust-note">
        Provider metadata is untrusted external evidence, not a truth or credibility assessment.
      </p>
      <dl className="details-list">
        <div><dt>Provider</dt><dd>{source.provider}</dd></div>
        <div><dt>Provider ID</dt><dd>{source.provider_record_id}</dd></div>
        <div><dt>Source class</dt><dd>{source.source_class}</dd></div>
        <div><dt>Provider type</dt><dd>{source.provider_type ?? "unknown"}</dd></div>
        <div><dt>Published</dt><dd>{source.publication_date ?? "unknown"}</dd></div>
        <div><dt>Provider updated</dt><dd>{source.provider_updated_at ?? "unknown"}</dd></div>
        <div><dt>Retrieved</dt><dd>{source.retrieved_at}</dd></div>
        <div><dt>DOI</dt><dd>{source.doi ?? "unknown"}</dd></div>
        <div><dt>Metadata language</dt><dd>{source.language ?? "unknown"}</dd></div>
        <div>
          <dt>Primary source</dt>
          <dd>{source.primary_location?.source_name ?? "unknown"}</dd>
        </div>
        <div>
          <dt>Primary source ID</dt>
          <dd>{source.primary_location?.source_provider_record_id ?? "unknown"}</dd>
        </div>
        <div>
          <dt>Location version</dt>
          <dd>{source.primary_location?.version ?? "unknown"}</dd>
        </div>
        <div>
          <dt>Open access at primary location</dt>
          <dd>{formatKnownBoolean(source.primary_location?.is_open_access)}</dd>
        </div>
      </dl>

      <div className="authors-block">
        <h3>Authors</h3>
        {source.authors === null ? (
          <p>unknown</p>
        ) : source.authors.length === 0 ? (
          <p>None listed by the provider.</p>
        ) : (
          <ul>
            {source.authors.map((author, index) => (
              <li key={`${author.provider_record_id ?? "unknown"}-${index}`}>
                {author.display_name ?? "Name unknown"}
                {author.provider_record_id
                  ? ` (${author.provider_record_id})`
                  : " (provider ID unknown)"}
                {author.orcid ? ` — ORCID ${author.orcid}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card-actions">
        <button
          type="button"
          onClick={() => onAdd(source)}
          disabled={isInPacket}
        >
          {isInPacket ? "Already in packet" : "Add to research packet"}
        </button>
        {providerUrl && (
          <a
            className="external-link"
            href={providerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View provider record
          </a>
        )}
        {locationUrl && locationUrl !== providerUrl && (
          <a
            className="external-link"
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View primary location
          </a>
        )}
      </div>
    </section>
  );
}

function ResearchPacket({
  packet,
  onRemove,
}: {
  packet: SourceDetailsRecord[];
  onRemove: (sourceId: string) => void;
}) {
  return (
    <section className="packet-panel" aria-labelledby="packet-heading">
      <h2 id="packet-heading">Research packet ({packet.length})</h2>
      <p className="status">
        This packet exists only in this page&apos;s memory and clears on refresh.
      </p>
      {packet.length === 0 ? (
        <p>No sources added.</p>
      ) : (
        <div className="packet-list">
          {packet.map((source) => (
            <article className="packet-card" key={source.id}>
              <code className="source-id">{source.id}</code>
              <h3>{source.title ?? "Title unknown"}</h3>
              <p className="metadata">
                <span>Provider: {source.provider}</span>
                <span>Provider ID: {source.provider_record_id}</span>
                <span>Published: {source.publication_date ?? "unknown"}</span>
                <span>Retrieved: {source.retrieved_at}</span>
              </p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => onRemove(source.id)}
              >
                Remove from packet
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatKnownBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "unknown";
  }
  return value ? "yes" : "no";
}

function safeExternalUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}
