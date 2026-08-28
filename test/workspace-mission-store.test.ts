import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_LEDGER_EVENTS,
  MAX_MISSION_LENGTH,
  WORKSPACE_SCHEMA_VERSION,
  validateMissionInput,
} from "../src/domain/workspace.ts";
import {
  createWorkspaceStore,
  WORKSPACE_STORAGE_KEY,
  type WorkspaceStorage,
} from "../src/client/workspace-store.ts";

class MemoryStorage implements WorkspaceStorage {
  readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const now = () => "2026-08-27T12:00:00.000Z";

test("validates a bounded human research mission", () => {
  assert.deepEqual(
    validateMissionInput({
      question: "  What evidence supports the claim?  ",
      context: "  Technical reviewers  ",
      evidence_max: 5,
    }),
    {
      question: "What evidence supports the claim?",
      context: "Technical reviewers",
      evidence_max: 5,
    },
  );
});

test("rejects an empty, overlong, or invalid-capacity mission", () => {
  assert.throws(() => validateMissionInput({ question: "   " }));
  assert.throws(() => validateMissionInput({ question: "x".repeat(MAX_MISSION_LENGTH + 1) }));
  assert.throws(() => validateMissionInput({ question: "Question", evidence_max: 0 }));
  assert.throws(() => validateMissionInput({ question: "Question", evidence_max: 6 }));
});

test("shared store notifies subscribers and reset clears state and persistence", () => {
  const storage = new MemoryStorage();
  const store = createWorkspaceStore({ storage, now });
  let notifications = 0;
  const unsubscribe = store.subscribe(() => notifications += 1);

  store.setMission({ question: "Question" });
  assert.equal(store.getSnapshot().mission?.evidence_max, 3);
  assert.equal(notifications, 1);
  assert.ok(storage.getItem(WORKSPACE_STORAGE_KEY));

  store.reset();
  assert.deepEqual(store.getSnapshot(), store.getServerSnapshot());
  assert.equal(storage.getItem(WORKSPACE_STORAGE_KEY), null);
  assert.equal(notifications, 2);
  unsubscribe();
});

test("workspace persistence survives a validated round trip", () => {
  const storage = new MemoryStorage();
  const first = createWorkspaceStore({ storage, now });
  first.setMission({ question: "Persist this mission", context: "Reviewers", evidence_max: 4 });

  const second = createWorkspaceStore({ storage, now });
  assert.deepEqual(second.getSnapshot(), first.getSnapshot());
  assert.equal(second.getSnapshot().schema_version, WORKSPACE_SCHEMA_VERSION);
});

test("malformed JSON and unsupported workspace versions fall back safely", () => {
  const malformed = new MemoryStorage();
  malformed.setItem(WORKSPACE_STORAGE_KEY, "{not-json");
  assert.equal(createWorkspaceStore({ storage: malformed, now }).getSnapshot().mission, null);
  assert.equal(malformed.getItem(WORKSPACE_STORAGE_KEY), null);

  const unsupported = new MemoryStorage();
  unsupported.setItem(
    WORKSPACE_STORAGE_KEY,
    JSON.stringify({
      schema_version: 99,
      mission: null,
      proposals: [],
      accepted_evidence: [],
      brief: null,
      activity: [],
    }),
  );
  assert.equal(createWorkspaceStore({ storage: unsupported, now }).getSnapshot().mission, null);
  assert.equal(unsupported.getItem(WORKSPACE_STORAGE_KEY), null);
});

test("activity ledger retains only the newest bounded events", () => {
  const store = createWorkspaceStore({ storage: null, now });
  for (let index = 0; index < MAX_LEDGER_EVENTS + 5; index += 1) {
    store.setMission({ question: `Question ${index}` });
  }
  assert.equal(store.getSnapshot().activity.length, MAX_LEDGER_EVENTS);
  assert.equal(store.getSnapshot().mission?.question, `Question ${MAX_LEDGER_EVENTS + 4}`);
});
