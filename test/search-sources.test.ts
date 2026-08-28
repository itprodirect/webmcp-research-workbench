import assert from "node:assert/strict";
import test from "node:test";
import { searchSources } from "../src/domain/search-sources.ts";

const providerResponse = {
  results: [
    {
      id: "https://openalex.org/W123",
      display_name: "Result",
      doi: null,
      publication_date: null,
      publication_year: null,
      type: null,
      updated_date: null,
    },
  ],
};

async function captureRequest(input: unknown) {
  const originalFetch = globalThis.fetch;
  let requested = "";
  globalThis.fetch = async (request) => {
    requested = String(request);
    return new Response(JSON.stringify(providerResponse), { status: 200 });
  };
  try {
    const result = await searchSources(input);
    return { requested: new URL(requested), result };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("default search behavior remains keyword search=", async () => {
  const { requested, result } = await captureRequest({ query: "browser agents", limit: 1 });
  assert.equal(requested.searchParams.get("search"), "browser agents");
  assert.equal(requested.searchParams.has("search.semantic"), false);
  assert.equal(result.mode, "keyword");
});

test("explicit keyword mode continues using search=", async () => {
  const { requested } = await captureRequest({ query: "browser agents", mode: "keyword", limit: 1 });
  assert.equal(requested.searchParams.get("search"), "browser agents");
  assert.equal(requested.searchParams.has("search.semantic"), false);
});

test("semantic mode uses OpenAlex search.semantic=", async () => {
  const { requested, result } = await captureRequest({ query: "conceptual similarity", mode: "semantic", limit: 1 });
  assert.equal(requested.searchParams.get("search.semantic"), "conceptual similarity");
  assert.equal(requested.searchParams.has("search"), false);
  assert.equal(result.mode, "semantic");
});
