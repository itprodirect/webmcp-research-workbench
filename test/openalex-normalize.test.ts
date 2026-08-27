import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeOpenAlexWork,
  OpenAlexNormalizationError,
} from "../src/providers/openalex-normalize.ts";

const retrievedAt = "2026-08-27T12:00:00.000Z";

test("normalizes an OpenAlex work with stable native identity", () => {
  const source = normalizeOpenAlexWork(
    {
      id: "https://openalex.org/W123456789",
      display_name: "A provider title",
      doi: "https://doi.org/10.1000/example",
      publication_date: "2026-08-20",
      publication_year: 2026,
      type: "article",
      updated_date: "2026-08-26T01:02:03.000000",
    },
    retrievedAt,
  );

  assert.equal(source.id, "openalex:W123456789");
  assert.equal(source.provider, "openalex");
  assert.equal(source.provider_record_id, "W123456789");
  assert.equal(source.canonical_url, "https://openalex.org/W123456789");
  assert.equal(source.source_class, "unknown");
  assert.equal(source.retrieved_at, retrievedAt);
});

test("uses only a defensible preprint classification and preserves missing values", () => {
  const source = normalizeOpenAlexWork(
    {
      id: "https://openalex.org/W987654321",
      display_name: null,
      doi: null,
      publication_date: null,
      publication_year: null,
      type: "preprint",
      updated_date: null,
    },
    retrievedAt,
  );

  assert.equal(source.source_class, "preprint");
  assert.equal(source.title, null);
  assert.equal(source.publication_date, null);
  assert.equal(source.provider_updated_at, null);
});

test("rejects a provider record without a valid OpenAlex work identity", () => {
  assert.throws(
    () => normalizeOpenAlexWork({ id: "https://example.com/W123" }, retrievedAt),
    OpenAlexNormalizationError,
  );
});
