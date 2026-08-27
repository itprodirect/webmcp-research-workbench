import assert from "node:assert/strict";
import test from "node:test";
import { SourceDetailsError } from "../src/domain/source-details-error.ts";
import { validateSourceDetailsInput } from "../src/domain/source-details-input.ts";

test("accepts the normalized OpenAlex source identity returned by search", () => {
  assert.deepEqual(validateSourceDetailsInput({ id: "openalex:W2162077280" }), {
    id: "openalex:W2162077280",
    provider: "openalex",
    providerRecordId: "W2162077280",
  });
});

test("rejects malformed normalized source IDs and expanded inputs explicitly", () => {
  for (const input of [
    { id: "W2162077280" },
    { id: "openalex:A2162077280" },
    { id: " openalex:W2162077280" },
    { id: "openalex:W2162077280", url: "https://example.com" },
  ]) {
    assert.throws(
      () => validateSourceDetailsInput(input),
      (error) =>
        error instanceof SourceDetailsError && error.code === "invalid_source_id",
    );
  }
});

test("distinguishes an unsupported provider from a malformed OpenAlex ID", () => {
  assert.throws(
    () => validateSourceDetailsInput({ id: "github:123" }),
    (error) =>
      error instanceof SourceDetailsError && error.code === "unsupported_provider",
  );
});
