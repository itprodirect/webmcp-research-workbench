import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceStore } from "../src/client/workspace-store.ts";
import type { SourceDetailsRecord } from "../src/domain/source-record.ts";
import {
  MAX_BRIEF_FINDINGS,
  MAX_BRIEF_SUMMARY_LENGTH,
  WorkspaceError,
} from "../src/domain/workspace.ts";

let tick = 0;
const now = () => `2026-08-27T12:00:${String(tick++).padStart(2, "0")}.000Z`;

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

function brief(sourceId = "openalex:W1") {
  return {
    title: "Evidence brief",
    summary: "A concise synthesis.",
    findings: [{ statement: "A bounded finding.", source_ids: [sourceId] }],
    caveats: "Abstract metadata is not verified full text.",
  };
}

function storeWithAcceptedSource() {
  const store = createWorkspaceStore({ storage: null, now });
  store.setMission({ question: "Question", evidence_max: 3 });
  store.proposeEvidence({ proposals: [{ id: "openalex:W1" }] }, [source("openalex:W1")]);
  store.acceptProposal("openalex:W1");
  return store;
}

test("brief drafting requires human-accepted evidence", () => {
  const store = createWorkspaceStore({ storage: null, now });
  store.setMission({ question: "Question" });
  assert.throws(
    () => store.draftBrief(brief()),
    (error) => error instanceof WorkspaceError && error.code === "no_accepted_evidence",
  );
});

test("accepted citations succeed while unaccepted and invented citations fail with zero write", () => {
  const store = storeWithAcceptedSource();
  store.draftBrief(brief());
  assert.equal(store.getSnapshot().brief?.findings[0].source_ids[0], "openalex:W1");

  const before = store.getSnapshot();
  for (const id of ["openalex:W2", "openalex:W999999999"]) {
    assert.throws(
      () => store.draftBrief(brief(id)),
      (error) =>
        error instanceof WorkspaceError && error.code === "brief_citation_not_accepted",
    );
    assert.equal(store.getSnapshot(), before);
  }
});

test("one invalid citation rejects an entire brief mutation", () => {
  const store = storeWithAcceptedSource();
  store.draftBrief(brief());
  const before = store.getSnapshot();
  assert.throws(() =>
    store.draftBrief({
      ...brief(),
      findings: [
        { statement: "Valid", source_ids: ["openalex:W1"] },
        { statement: "Invalid", source_ids: ["openalex:W2"] },
      ],
    }),
  );
  assert.equal(store.getSnapshot(), before);
});

test("brief text and list bounds are enforced", () => {
  const store = storeWithAcceptedSource();
  assert.throws(() => store.draftBrief({ ...brief(), summary: "x".repeat(MAX_BRIEF_SUMMARY_LENGTH + 1) }));
  assert.throws(() =>
    store.draftBrief({
      ...brief(),
      findings: Array.from({ length: MAX_BRIEF_FINDINGS + 1 }, () => brief().findings[0]),
    }),
  );
  assert.equal(store.getSnapshot().brief, null);
});

test("human edit, review, and approval are explicit and a later agent draft resets them", () => {
  const store = storeWithAcceptedSource();
  store.draftBrief(brief());
  assert.equal(store.getSnapshot().brief?.human_reviewed, false);
  assert.equal(store.getSnapshot().brief?.approved, false);

  store.editBrief({ ...brief(), summary: "Human-edited summary." });
  assert.equal(store.getSnapshot().brief?.human_edited, true);
  assert.equal(store.getSnapshot().brief?.human_reviewed, false);
  assert.throws(
    () => store.approveBrief(),
    (error) => error instanceof WorkspaceError && error.code === "brief_review_required",
  );

  store.reviewBrief();
  store.approveBrief();
  assert.equal(store.getSnapshot().brief?.human_reviewed, true);
  assert.equal(store.getSnapshot().brief?.approved, true);

  store.draftBrief({ ...brief(), summary: "Agent replacement." });
  assert.equal(store.getSnapshot().brief?.human_edited, false);
  assert.equal(store.getSnapshot().brief?.human_reviewed, false);
  assert.equal(store.getSnapshot().brief?.approved, false);
});
