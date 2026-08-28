import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceStore } from "../src/client/workspace-store.ts";
import { createWebMcpTools } from "../src/client/webmcp-tools.ts";
import type { SourceDetailsRecord } from "../src/domain/source-record.ts";

const expectedNames = [
  "get_research_workspace",
  "search_sources",
  "get_source_details",
  "propose_evidence",
  "draft_evidence_brief",
];

test("registers exactly the five authorized WebMCP tools", () => {
  const tools = createWebMcpTools();
  assert.deepEqual(tools.map((tool) => tool.name), expectedNames);
});

test("all schemas are closed and tool annotations match read/mutation authority", () => {
  const tools = createWebMcpTools();
  for (const tool of tools) {
    const schema = tool.inputSchema as Record<string, unknown>;
    assert.equal(schema.additionalProperties, false);
    assert.equal(tool.annotations?.untrustedContentHint, true);
    assert.equal(
      tool.annotations?.readOnlyHint,
      ["get_research_workspace", "search_sources", "get_source_details"].includes(tool.name),
    );
  }
});

test("get_research_workspace accepts only an empty object", async () => {
  const tool = createWebMcpTools().find((candidate) => candidate.name === "get_research_workspace");
  assert.ok(tool);
  const execute = tool.execute as (input: unknown) => Promise<unknown>;
  await assert.doesNotReject(execute({}));
  await assert.rejects(execute({ extra: true }));
});

test("search and detail schemas preserve bounded OpenAlex contracts", () => {
  const tools = createWebMcpTools();
  const search = tools.find((candidate) => candidate.name === "search_sources");
  const details = tools.find((candidate) => candidate.name === "get_source_details");
  assert.ok(search);
  assert.ok(details);
  const searchSchema = search.inputSchema as {
    properties: Record<string, unknown>;
  };
  const detailsSchema = details.inputSchema as {
    properties: Record<string, unknown>;
  };
  assert.deepEqual(searchSchema.properties.mode, {
    type: "string",
    enum: ["keyword", "semantic"],
    description: "OpenAlex search mode; defaults to keyword.",
  });
  assert.deepEqual(detailsSchema.properties.id, {
    type: "string",
    pattern: "^openalex:W[0-9]+$",
    description: "A normalized OpenAlex source ID returned by search_sources.",
  });
});

test("propose_evidence performs no partial write when one source resolution fails", async () => {
  const store = createWorkspaceStore({
    storage: null,
    now: () => "2026-08-27T12:00:00.000Z",
  });
  store.setMission({ question: "Question", evidence_max: 3 });
  const before = store.getSnapshot();
  const tool = createWebMcpTools({
    store,
    getSourceDetails: async (input) => {
      const id = (input as { id: string }).id;
      if (id === "openalex:W2") {
        throw new Error("OpenAlex resolution failed.");
      }
      return { source: source(id) };
    },
  }).find((candidate) => candidate.name === "propose_evidence");
  assert.ok(tool);
  const execute = tool.execute as (
    input: unknown,
    context: { signal: AbortSignal },
  ) => Promise<unknown>;

  await assert.rejects(
    execute(
      { proposals: [{ id: "openalex:W1" }, { id: "openalex:W2" }] },
      { signal: new AbortController().signal },
    ),
  );
  assert.equal(store.getSnapshot(), before);
  assert.equal(store.getSnapshot().proposals.length, 0);
});

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
