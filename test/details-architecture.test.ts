import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("human and WebMCP details paths share one client, route, and domain operation", () => {
  const ui = readFileSync("app/components/search-workbench.tsx", "utf8");
  const tools = readFileSync("src/client/webmcp-tools.ts", "utf8");
  const client = readFileSync("src/client/source-details-api.ts", "utf8");
  const route = readFileSync("app/api/source-details/route.ts", "utf8");

  assert.ok(importSpecifiers(ui).includes("@/src/client/source-details-api"));
  assert.ok(importSpecifiers(tools).includes("./source-details-api.ts"));
  assert.match(client, /["']\/api\/source-details["']/);
  assert.match(route, /\bgetSourceDetails\s*\(/);
});

function importSpecifiers(source: string): string[] {
  return [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((match) => match[1]);
}
