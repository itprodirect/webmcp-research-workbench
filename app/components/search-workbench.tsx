"use client";

import { FormEvent, useRef, useState } from "react";
import type { SourceRecord } from "@/src/domain/source-record";
import { searchSourcesViaServer } from "@/src/client/search-api";

const UI_RESULT_LIMIT = 5;

export function SearchWorkbench() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SourceRecord[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setStatus("loading");
    setError("");

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
            <SourceResult key={source.id} source={source} />
          ))}
        </div>
      )}
    </section>
  );
}

function SearchStatus({
  status,
  error,
  count,
}: {
  status: "idle" | "loading" | "success" | "error";
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

function SourceResult({ source }: { source: SourceRecord }) {
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
    </article>
  );
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
