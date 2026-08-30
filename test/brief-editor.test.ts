import assert from "node:assert/strict";
import test from "node:test";
import {
  getBriefEditorContentKey,
  hasUnsavedBriefChanges,
  saveBriefChangesIfDirty,
  type EditableBriefContent,
} from "../src/client/brief-editor.ts";
import { createWorkspaceStore } from "../src/client/workspace-store.ts";
import type { SourceDetailsRecord } from "../src/domain/source-record.ts";
import type { EvidenceBrief } from "../src/domain/workspace.ts";

let tick = 0;
const now = () => `2026-08-29T12:00:${String(tick++).padStart(2, "0")}.000Z`;

const savedBrief: EvidenceBrief = {
  title: "Evidence brief",
  summary: "A concise synthesis.",
  findings: [{
    statement: "A bounded finding.",
    source_ids: ["openalex:W1", "openalex:W2"],
  }],
  caveats: "Abstract metadata is not verified full text.",
  agent_generated: true,
  human_edited: false,
  human_reviewed: false,
  approved: false,
  updated_at: "2026-08-29T12:00:00.000Z",
};

function editableBrief(brief: EvidenceBrief): EditableBriefContent {
  return {
    title: brief.title,
    summary: brief.summary,
    findings: brief.findings.map((finding) => ({
      statement: finding.statement,
      source_ids: [...finding.source_ids],
    })),
    caveats: brief.caveats,
  };
}

function source(): SourceDetailsRecord {
  return {
    id: "openalex:W1",
    provider: "openalex",
    provider_record_id: "W1",
    title: "Provider title",
    canonical_url: "https://openalex.org/W1",
    source_class: "unknown",
    publication_date: null,
    provider_updated_at: null,
    retrieved_at: "2026-08-29T12:00:00.000Z",
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

function storeWithDraft() {
  const store = createWorkspaceStore({ storage: null, now });
  store.setMission({ question: "Question", evidence_max: 3 });
  store.proposeEvidence({ proposals: [{ id: "openalex:W1" }] }, [source()]);
  store.acceptProposal("openalex:W1");
  store.draftBrief({
    title: "Evidence brief",
    summary: "A concise synthesis.",
    findings: [{ statement: "A bounded finding.", source_ids: ["openalex:W1"] }],
    caveats: "Abstract metadata is not verified full text.",
  });
  return store;
}

test("editable brief comparison starts clean and detects text and citation changes", () => {
  const visibleBrief = editableBrief(savedBrief);
  assert.equal(hasUnsavedBriefChanges(savedBrief, visibleBrief), false);
  assert.equal(
    hasUnsavedBriefChanges(savedBrief, { ...visibleBrief, title: "Changed title" }),
    true,
  );
  assert.equal(
    hasUnsavedBriefChanges(savedBrief, {
      ...visibleBrief,
      findings: [{
        ...visibleBrief.findings[0],
        source_ids: ["openalex:W1"],
      }],
    }),
    true,
  );
});

test("editor content key ignores status-only updates and changes with editable content", () => {
  const initialKey = getBriefEditorContentKey(savedBrief);
  const statusOnlyUpdate: EvidenceBrief = {
    ...savedBrief,
    human_reviewed: true,
    approved: true,
    updated_at: "2026-08-29T12:05:00.000Z",
  };
  assert.equal(
    getBriefEditorContentKey(statusOnlyUpdate),
    initialKey,
  );
  assert.notEqual(
    getBriefEditorContentKey({ ...savedBrief, summary: "Changed summary" }),
    initialKey,
  );
});

test("unchanged visible content cannot invoke a human edit or alter provenance", () => {
  const store = storeWithDraft();
  const before = store.getSnapshot();
  const brief = before.brief;
  assert.ok(brief);
  let saveCalls = 0;

  const result = saveBriefChangesIfDirty(
    brief,
    editableBrief(brief),
    (input) => {
      saveCalls += 1;
      return store.editBrief(input).brief;
    },
  );

  assert.equal(result.status, "unchanged");
  assert.equal(saveCalls, 0);
  assert.equal(store.getSnapshot(), before);
  assert.equal(store.getSnapshot().brief?.human_edited, false);
  assert.equal(
    store.getSnapshot().activity.some((event) => event.action === "human_edited_brief"),
    false,
  );
});

test("a real saved edit keeps human-edit provenance and resets review and approval", () => {
  const store = storeWithDraft();
  store.reviewBrief();
  store.approveBrief();
  const brief = store.getSnapshot().brief;
  assert.ok(brief);

  const result = saveBriefChangesIfDirty(
    brief,
    { ...editableBrief(brief), summary: "Human-edited summary." },
    (input) => store.editBrief(input).brief,
  );

  const updated = store.getSnapshot();
  assert.equal(result.status, "saved");
  assert.equal(
    result.status === "saved" ? result.editorKey : null,
    getBriefEditorContentKey(updated.brief!),
  );
  assert.equal(updated.brief?.human_edited, true);
  assert.equal(updated.brief?.human_reviewed, false);
  assert.equal(updated.brief?.approved, false);
  assert.equal(updated.activity.at(-1)?.action, "human_edited_brief");
});
