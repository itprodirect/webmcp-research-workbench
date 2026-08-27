import assert from "node:assert/strict";
import test from "node:test";
import { getSourceDetails } from "../src/domain/get-source-details.ts";
import { SourceDetailsError } from "../src/domain/source-details-error.ts";

const workPayload = {
  id: "https://openalex.org/W2162077280",
  display_name: "A real-shaped provider record",
  doi: null,
  publication_date: "1995-08-20",
  publication_year: 1995,
  type: "article",
  updated_date: "2026-08-26T07:47:46.906454",
  authorships: [],
  language: "en",
  primary_location: null,
};

test("shared details operation retrieves and normalizes one search result ID", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;
  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedInit = init;
    return new Response(JSON.stringify(workPayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    const result = await getSourceDetails({ id: "openalex:W2162077280" });
    assert.equal(result.source.id, "openalex:W2162077280");
    assert.equal(result.source.provider_record_id, "W2162077280");
    assert.match(requestedUrl, /\/works\/W2162077280\?select=/);
    assert.equal(requestedInit?.redirect, "error");
    assert.equal(requestedInit?.cache, "no-store");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("shared details operation preserves explicit provider HTTP failures", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("unavailable", { status: 503 });

  try {
    await assert.rejects(
      getSourceDetails({ id: "openalex:W2162077280" }),
      (error) =>
        error instanceof SourceDetailsError &&
        error.code === "provider_failure" &&
        error.httpStatus === 502 &&
        error.provider === "openalex",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("shared details operation preserves an explicit not-found state", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("missing", { status: 404 });

  try {
    await assert.rejects(
      getSourceDetails({ id: "openalex:W2162077280" }),
      (error) =>
        error instanceof SourceDetailsError && error.code === "source_not_found",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("shared details operation preserves malformed provider responses", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("not-json", { status: 200 });

  try {
    await assert.rejects(
      getSourceDetails({ id: "openalex:W2162077280" }),
      (error) =>
        error instanceof SourceDetailsError &&
        error.code === "malformed_provider_response",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("shared details operation preserves explicit aborted requests", async () => {
  const originalFetch = globalThis.fetch;
  const controller = new AbortController();
  controller.abort();
  globalThis.fetch = async () => {
    throw new DOMException("Aborted", "AbortError");
  };

  try {
    await assert.rejects(
      getSourceDetails(
        { id: "openalex:W2162077280" },
        { signal: controller.signal },
      ),
      (error) =>
        error instanceof SourceDetailsError && error.code === "request_aborted",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
