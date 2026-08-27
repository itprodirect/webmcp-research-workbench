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
  });
});

test("rejects empty, oversized, out-of-range, and expanded inputs", () => {
  assert.throws(() => validateSearchInput({ query: "   " }));
  assert.throws(() => validateSearchInput({ query: "x".repeat(MAX_QUERY_LENGTH + 1) }));
  assert.throws(() => validateSearchInput({ query: "browser agents", limit: 11 }));
  assert.throws(() => validateSearchInput({ query: "browser agents", provider: "github" }));
});
