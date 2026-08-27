import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("human and WebMCP details paths share one client, route, and domain operation", () => {
  const ui = readFileSync("app/components/search-workbench.tsx", "utf8");
  const tools = readFileSync("src/client/webmcp-tools.ts", "utf8");
  const client = readFileSync("src/client/source-details-api.ts", "utf8");
  const route = readFileSync("app/api/source-details/route.ts", "utf8");

  assert.match(ui, /getSourceDetailsViaServer/);
  assert.match(tools, /getSourceDetailsViaServer/);
  assert.match(client, /fetch\("\/api\/source-details"/);
  assert.match(route, /getSourceDetails\(input, \{ signal: request\.signal \}\)/);
});
