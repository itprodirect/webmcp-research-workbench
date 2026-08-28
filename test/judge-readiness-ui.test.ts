import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/page.tsx", "utf8");
const workbench = readFileSync("app/components/search-workbench.tsx", "utf8");

test("judge-facing framing teaches the five-step human-agent workflow", () => {
  assert.match(page, /The agent gathers\. You decide what counts\./);
  assert.doesNotMatch(page, /Phase 2B/);
  for (const step of [
    "Define the mission",
    "Researches sources",
    "Accept the evidence",
    "Drafts the brief",
    "Review &amp; approve",
  ]) {
    assert.ok(page.includes(step));
  }
  for (const role of ["Human", "Agent", "WebMCP"]) {
    assert.match(page, new RegExp(`<h3>${role}</h3>`));
  }
});

test("accepted evidence handoff copies the authorized prompt with accessible feedback", () => {
  const prompt =
    "In the WebMCP Research Workbench, read the current research workspace and draft the Evidence Brief for the active mission. Use only the human-accepted evidence already in the workspace when supporting or citing findings. Cite each finding to the accepted source IDs that support it, include relevant caveats about the limits of the evidence, and leave the result for human review. Do not mark it reviewed or approve it.";

  assert.ok(workbench.includes(prompt));
  assert.match(workbench, /navigator\.clipboard\.writeText\(AGENT_SYNTHESIS_PROMPT\)/);
  assert.match(workbench, /Copy agent prompt/);
  assert.match(workbench, /Prompt copied\./);
  assert.match(workbench, /Could not copy the prompt\./);
  assert.match(workbench, /role=\{copyFeedback\.kind === "error" \? "alert" : "status"\}/);
});
