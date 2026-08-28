import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceStore } from "../src/client/workspace-store.ts";
import type { SourceDetailsRecord } from "../src/domain/source-record.ts";
import {
  MAX_PROPOSALS_PER_CALL,
  WorkspaceError,
} from "../src/domain/workspace.ts";

const now = () => "2026-08-27T12:00:00.000Z";

function source(id: string, title = "Provider title"): SourceDetailsRecord {
  const providerRecordId = id.slice("openalex:".length);
  return {
    id,
    provider: "openalex",
    provider_record_id: providerRecordId,
    title,
    canonical_url: `https://openalex.org/${providerRecordId}`,
    source_class: "unknown",
    publication_date: "2026-08-20",
    provider_updated_at: null,
    retrieved_at: "2026-08-27T12:00:00.000Z",
    doi: null,
    publication_year: 2026,
    provider_type: "article",
    authors: null,
    language: null,
    primary_location: null,
    abstract: "Provider abstract.",
    cited_by_count: 12,
    open_access: { is_oa: true, oa_status: "gold", oa_url: "https://example.org/work" },
    primary_topic: { provider_record_id: "T100", display_name: "Topic" },
  };
}

test("proposals require a human mission and canonical IDs", () => {
  const store = createWorkspaceStore({ storage: null, now });
  assert.throws(
    () => store.proposeEvidence({ proposals: [{ id: "openalex:W1" }] }, [source("openalex:W1")]),
    (error) => error instanceof WorkspaceError && error.code === "mission_required",
  );
  store.setMission({ question: "Question" });
  assert.throws(
    () => store.proposeEvidence({ proposals: [{ id: "W1" }] }, [source("openalex:W1")]),
    (error) => error instanceof WorkspaceError && error.code === "invalid_source_id",
  );
});

test("proposal calls reject invalid resolution atomically", () => {
  const store = createWorkspaceStore({ storage: null, now });
  store.setMission({ question: "Question", evidence_max: 3 });
  const before = store.getSnapshot();

  assert.throws(() =>
    store.proposeEvidence(
      { proposals: [{ id: "openalex:W1" }, { id: "openalex:W2" }] },
      [source("openalex:W1"), source("openalex:W999")],
    ),
  );
  assert.equal(store.getSnapshot(), before);
  assert.equal(store.getSnapshot().proposals.length, 0);
});

test("proposal duplicate, accepted, per-call, and mission caps are enforced", () => {
  const store = createWorkspaceStore({ storage: null, now });
  store.setMission({ question: "Question", evidence_max: 3 });
  store.proposeEvidence({ proposals: [{ id: "openalex:W1" }] }, [source("openalex:W1")]);

  assert.throws(
    () => store.proposeEvidence({ proposals: [{ id: "openalex:W1" }] }, [source("openalex:W1")]),
    (error) => error instanceof WorkspaceError && error.code === "duplicate_proposal",
  );
  store.acceptProposal("openalex:W1");
  assert.throws(
    () => store.proposeEvidence({ proposals: [{ id: "openalex:W1" }] }, [source("openalex:W1")]),
    (error) => error instanceof WorkspaceError && error.code === "already_accepted",
  );

  const tooMany = Array.from({ length: MAX_PROPOSALS_PER_CALL + 1 }, (_, index) => ({
    id: `openalex:W${index + 10}`,
  }));
  assert.throws(() => store.proposeEvidence({ proposals: tooMany }, tooMany.map((item) => source(item.id))));

  assert.throws(
    () =>
      store.proposeEvidence(
        { proposals: [{ id: "openalex:W2" }, { id: "openalex:W3" }, { id: "openalex:W4" }] },
        [source("openalex:W2"), source("openalex:W3"), source("openalex:W4")],
      ),
    (error) => error instanceof WorkspaceError && error.code === "evidence_capacity_reached",
  );
});

test("a human can accept, reject, and remove evidence with provenance intact", () => {
  const store = createWorkspaceStore({ storage: null, now });
  store.setMission({ question: "Question", evidence_max: 3 });
  store.proposeEvidence(
    { proposals: [{ id: "openalex:W1" }, { id: "openalex:W2", note: "Useful contrast" }] },
    [source("openalex:W1"), source("openalex:W2")],
  );

  store.acceptProposal("openalex:W1");
  store.rejectProposal("openalex:W2");
  assert.deepEqual(store.getSnapshot().accepted_evidence.map((item) => item.id), ["openalex:W1"]);
  assert.equal(store.getSnapshot().accepted_evidence[0].provider_record_id, "W1");
  assert.equal(store.getSnapshot().proposals.length, 0);

  store.removeAcceptedEvidence("openalex:W1");
  assert.equal(store.getSnapshot().accepted_evidence.length, 0);
  assert.equal(store.getSnapshot().activity.at(-1)?.action, "human_removed_source");
});
