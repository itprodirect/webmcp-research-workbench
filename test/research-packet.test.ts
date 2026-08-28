import assert from "node:assert/strict";
import test from "node:test";
import {
  addSourceToPacket,
  removeSourceFromPacket,
} from "../src/client/research-packet.ts";
import type { SourceDetailsRecord } from "../src/domain/source-record.ts";

function source(id: string): SourceDetailsRecord {
  const providerRecordId = id.slice("openalex:".length);
  return {
    id,
    provider: "openalex",
    provider_record_id: providerRecordId,
    title: "Provider title",
    canonical_url: `https://openalex.org/${providerRecordId}`,
    source_class: "unknown",
    publication_date: null,
    provider_updated_at: null,
    retrieved_at: "2026-08-27T12:00:00.000Z",
    doi: null,
    publication_year: null,
    provider_type: null,
    authors: null,
    language: null,
    primary_location: null,
    abstract: null,
    cited_by_count: null,
    open_access: null,
    primary_topic: null,
  };
}

test("packet add preserves provenance and prevents duplicate membership", () => {
  const first = source("openalex:W1");
  const packet = addSourceToPacket([], first);
  const duplicateAttempt = addSourceToPacket(packet, source("openalex:W1"));

  assert.equal(packet.length, 1);
  assert.equal(packet[0].provider_record_id, "W1");
  assert.equal(packet[0].retrieved_at, "2026-08-27T12:00:00.000Z");
  assert.equal(duplicateAttempt, packet);
});

test("packet removal removes only the explicitly selected source", () => {
  const first = source("openalex:W1");
  const second = source("openalex:W2");
  const packet = removeSourceFromPacket([first, second], first.id);

  assert.deepEqual(packet.map((member) => member.id), [second.id]);
});
