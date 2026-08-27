import assert from "node:assert/strict";
import test from "node:test";
import { normalizeOpenAlexWorkDetails } from "../src/providers/openalex-normalize.ts";

const retrievedAt = "2026-08-27T12:00:00.000Z";

test("normalizes meaningful OpenAlex details while preserving native identities", () => {
  const source = normalizeOpenAlexWorkDetails(
    {
      id: "https://openalex.org/W123456789",
      display_name: "A provider title",
      doi: "https://doi.org/10.1000/example",
      publication_date: "2026-08-20",
      publication_year: 2026,
      type: "article",
      updated_date: "2026-08-26T01:02:03.000000",
      language: "en",
      authorships: [
        {
          author: {
            id: "https://openalex.org/A123456789",
            display_name: "Provider Author",
            orcid: "https://orcid.org/0000-0001-2345-6789",
          },
        },
      ],
      primary_location: {
        source: {
          id: "https://openalex.org/S987654321",
          display_name: "Provider Journal",
        },
        landing_page_url: "https://example.org/work",
        version: "publishedVersion",
        is_oa: true,
      },
    },
    retrievedAt,
  );

  assert.equal(source.id, "openalex:W123456789");
  assert.equal(source.provider_record_id, "W123456789");
  assert.equal(source.retrieved_at, retrievedAt);
  assert.deepEqual(source.authors, [
    {
      provider_record_id: "A123456789",
      display_name: "Provider Author",
      orcid: "https://orcid.org/0000-0001-2345-6789",
    },
  ]);
  assert.deepEqual(source.primary_location, {
    source_provider_record_id: "S987654321",
    source_name: "Provider Journal",
    landing_page_url: "https://example.org/work",
    version: "publishedVersion",
    is_open_access: true,
  });
});

test("preserves unknown detail metadata as null", () => {
  const source = normalizeOpenAlexWorkDetails(
    {
      id: "https://openalex.org/W987654321",
      display_name: null,
      doi: null,
      publication_date: null,
      publication_year: null,
      type: null,
      updated_date: null,
      language: null,
      authorships: null,
      primary_location: null,
    },
    retrievedAt,
  );

  assert.equal(source.title, null);
  assert.equal(source.publication_date, null);
  assert.equal(source.authors, null);
  assert.equal(source.language, null);
  assert.equal(source.primary_location, null);
});
