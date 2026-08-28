import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_QUERY_LENGTH,
  validateSearchInput,
} from "../src/domain/search-input.ts";

test("trims query input and applies the bounded default limit", () => {
  assert.deepEqual(validateSearchInput({ query: "  browser agents  " }), {
    query: "browser agents",
    limit: DEFAULT_SEARCH_LIMIT,
    mode: "keyword",
  });
});

test("rejects empty, oversized, out-of-range, and expanded inputs", () => {
  assert.throws(() => validateSearchInput({ query: "   " }));
  assert.throws(() => validateSearchInput({ query: "x".repeat(MAX_QUERY_LENGTH + 1) }));
  assert.throws(() => validateSearchInput({ query: "browser agents", limit: 11 }));
  assert.throws(() => validateSearchInput({ query: "browser agents", provider: "github" }));
  assert.throws(() => validateSearchInput({ query: "browser agents", mode: "hybrid" }));
});

test("semantic mode permits its documented bounded query length", () => {
  const query = "s".repeat(2_000);
  assert.deepEqual(validateSearchInput({ query, mode: "semantic", limit: 10 }), {
    query,
    mode: "semantic",
    limit: 10,
  });
  assert.throws(() => validateSearchInput({ query: `${query}s`, mode: "semantic" }));
  assert.throws(() => validateSearchInput({ query: "k".repeat(201), mode: "keyword" }));
});
