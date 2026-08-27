import assert from "node:assert/strict";
import test from "node:test";
import { createWebMcpTools } from "../src/client/webmcp-tools.ts";

test("registers exactly the two authorized WebMCP tools", () => {
  const tools = createWebMcpTools();
  assert.deepEqual(tools.map((tool) => tool.name), [
    "search_sources",
    "get_source_details",
  ]);
});

test("get_source_details uses the normalized ID schema and trust annotations", () => {
  const tool = createWebMcpTools().find(
    (candidate) => candidate.name === "get_source_details",
  );
  assert.ok(tool);
  assert.deepEqual(tool.annotations, {
    readOnlyHint: true,
    untrustedContentHint: true,
  });
  assert.deepEqual(tool.inputSchema, {
    type: "object",
    properties: {
      id: {
        type: "string",
        pattern: "^openalex:W[0-9]+$",
        description: "A normalized OpenAlex source ID returned by search_sources.",
      },
    },
    required: ["id"],
    additionalProperties: false,
  });
});

test("search_sources retains its Technical Gate trust annotations", () => {
  const tool = createWebMcpTools().find(
    (candidate) => candidate.name === "search_sources",
  );
  assert.ok(tool);
  assert.deepEqual(tool.annotations, {
    readOnlyHint: true,
    untrustedContentHint: true,
  });
});
