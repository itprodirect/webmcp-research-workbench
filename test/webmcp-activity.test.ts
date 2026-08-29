import assert from "node:assert/strict";
import test from "node:test";
import {
  createWebMcpActivityStore,
  instrumentWebMcpTools,
  WEBMCP_ACTIVITY_TOOLS,
} from "../src/client/webmcp-activity.ts";
import { createWebMcpTools } from "../src/client/webmcp-tools.ts";
import type { SearchSourcesResult } from "../src/domain/source-record.ts";

const expectedNames = [
  "get_research_workspace",
  "search_sources",
  "get_source_details",
  "propose_evidence",
  "draft_evidence_brief",
];

test("starts with exactly five unused browser-local activity entries", () => {
  const store = createWebMcpActivityStore();

  assert.deepEqual(
    WEBMCP_ACTIVITY_TOOLS.map((tool) => tool.name),
    expectedNames,
  );
  assert.deepEqual(
    store.getSnapshot().map(({ name, status, invocationCount }) => ({
      name,
      status,
      invocationCount,
    })),
    expectedNames.map((name) => ({
      name,
      status: "unused",
      invocationCount: 0,
    })),
  );
});

test("instrumentation reports running, success, and repeated calls without changing output", async () => {
  const store = createWebMcpActivityStore();
  const response: SearchSourcesResult = {
    query: "bounded query",
    mode: "keyword",
    limit: 1,
    results: [],
  };
  let release!: (value: SearchSourcesResult) => void;
  const firstCall = new Promise<SearchSourcesResult>((resolve) => {
    release = resolve;
  });
  let callCount = 0;
  const tools = instrumentWebMcpTools(
    createWebMcpTools({
      searchSources: async () => {
        callCount += 1;
        return callCount === 1 ? firstCall : response;
      },
    }),
    store,
  );
  const search = tools.find((tool) => tool.name === "search_sources");
  assert.ok(search);
  const execute = search.execute as (
    input: unknown,
    context: { signal: AbortSignal },
  ) => Promise<SearchSourcesResult>;
  const context = { signal: new AbortController().signal };

  const pending = execute({ query: "bounded query" }, context);
  assert.deepEqual(activity(store, "search_sources"), {
    status: "running",
    invocationCount: 1,
  });
  release(response);
  assert.equal(await pending, response);
  assert.deepEqual(activity(store, "search_sources"), {
    status: "succeeded",
    invocationCount: 1,
  });

  assert.equal(await execute({ query: "bounded query" }, context), response);
  assert.deepEqual(activity(store, "search_sources"), {
    status: "succeeded",
    invocationCount: 2,
  });
});

test("instrumentation reports failure and rethrows the original error", async () => {
  const store = createWebMcpActivityStore();
  const failure = new Error("Provider failure remains explicit.");
  const tools = instrumentWebMcpTools(
    createWebMcpTools({
      searchSources: async () => {
        throw failure;
      },
    }),
    store,
  );
  const search = tools.find((tool) => tool.name === "search_sources");
  assert.ok(search);
  const execute = search.execute as (
    input: unknown,
    context: { signal: AbortSignal },
  ) => Promise<SearchSourcesResult>;

  await assert.rejects(
    execute(
      { query: "bounded query" },
      { signal: new AbortController().signal },
    ),
    (error) => error === failure,
  );
  assert.deepEqual(activity(store, "search_sources"), {
    status: "failed",
    invocationCount: 1,
  });
});

test("instrumentation preserves the exact five tool contracts", () => {
  const original = createWebMcpTools();
  const instrumented = instrumentWebMcpTools(original, createWebMcpActivityStore());

  assert.deepEqual(instrumented.map((tool) => tool.name), expectedNames);
  for (let index = 0; index < original.length; index += 1) {
    assert.equal(instrumented[index].title, original[index].title);
    assert.equal(instrumented[index].description, original[index].description);
    assert.equal(instrumented[index].inputSchema, original[index].inputSchema);
    assert.equal(instrumented[index].annotations, original[index].annotations);
  }
});

function activity(
  store: ReturnType<typeof createWebMcpActivityStore>,
  name: (typeof expectedNames)[number],
) {
  const entry = store.getSnapshot().find((candidate) => candidate.name === name);
  assert.ok(entry);
  return {
    status: entry.status,
    invocationCount: entry.invocationCount,
  };
}
