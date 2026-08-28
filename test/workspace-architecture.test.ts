import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("human UI and WebMCP adapter converge on the same workspace-store module", () => {
  const ui = readFileSync("app/components/search-workbench.tsx", "utf8");
  const tools = readFileSync("src/client/webmcp-tools.ts", "utf8");
  const uiImports = importSpecifiers(ui);
  const toolImports = importSpecifiers(tools);

  assert.ok(uiImports.includes("@/src/client/workspace-store"));
  assert.ok(toolImports.includes("./workspace-store.ts"));
  assert.match(ui, /\bworkspaceStore\b/);
  assert.match(tools, /\bworkspaceStore\b/);
});

function importSpecifiers(source: string): string[] {
  return [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((match) => match[1]);
}
