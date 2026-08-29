import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/page.tsx", "utf8");
const workbench = readFileSync("app/components/search-workbench.tsx", "utf8");
const researchCycle = readFileSync("src/client/research-cycle.ts", "utf8");
const styles = readFileSync("app/globals.css", "utf8");
const registration = readFileSync("app/components/webmcp-registration.tsx", "utf8");
const activity = readFileSync("src/client/webmcp-activity.ts", "utf8");

test("judge-facing framing teaches the five-step human-agent workflow", () => {
  assert.match(page, /The agent gathers\. You decide what counts\./);
  assert.doesNotMatch(page, /Phase 2B/);
  for (const step of ["Define", "Research", "Curate", "Synthesize", "Approve"]) {
    assert.ok(researchCycle.includes(`label: "${step}"`));
  }
  for (const role of ["Human", "Agent", "WebMCP"]) {
    assert.match(workbench, new RegExp(`<h3>${role}</h3>`));
  }
  assert.match(workbench, /<h2 id="research-cycle-heading">Research Cycle<\/h2>/);
  assert.match(workbench, /aria-current=\{stageStatus === "current" \? "step" : undefined\}/);
});

test("mission-to-agent handoff copies a clipboard-only research prompt", () => {
  assert.match(workbench, /navigator\.clipboard\.writeText\(AGENT_RESEARCH_PROMPT\)/);
  assert.match(workbench, /Copy research prompt/);
  assert.match(workbench, /Research prompt copied\./);
  assert.match(workbench, /Could not copy the research prompt\./);
});

test("Research Cycle exposes live five-tool execution telemetry without persistence", () => {
  assert.match(registration, /instrumentWebMcpTools\(createWebMcpTools\(\)\)/);
  assert.match(workbench, /Live WebMCP Activity/);
  assert.match(workbench, /webMcpActivityStore\.subscribe/);
  assert.match(workbench, /presentation\.owner === "agent"/);
  for (const name of [
    "get_research_workspace",
    "search_sources",
    "get_source_details",
    "propose_evidence",
    "draft_evidence_brief",
  ]) {
    assert.ok(activity.includes(`name: "${name}"`));
  }
  for (const status of ["unused", "running", "succeeded", "failed"]) {
    assert.ok(activity.includes(`"${status}"`));
  }
  assert.doesNotMatch(activity, /localStorage|sessionStorage|fetch\(|workspaceStore/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.webmcp-activity-running/);
  assert.match(styles, /\.webmcp-activity-succeeded/);
  assert.match(styles, /\.webmcp-activity-failed/);
});

test("every Research Cycle action includes an explicit next-step cue", () => {
  assert.match(workbench, /className="cycle-next-cue"/);
  assert.match(researchCycle, /Your mission is ready\. Give the instruction below/);
  assert.match(researchCycle, /Your Turn — Curate/);
  assert.match(researchCycle, /Agent's Turn — Synthesize/);
  assert.match(researchCycle, /Your Turn — Approve/);
  assert.match(researchCycle, /human-approved Markdown artifact/);
  assert.match(workbench, /Copy synthesis prompt/);
  assert.match(workbench, /Copy agent prompt/);
});

test("manual discovery is explicitly optional, agent-first, and collapsible", () => {
  assert.match(workbench, /Optional human source verification/);
  assert.match(workbench, /agent performs discovery during the Research stage through WebMCP/);
  assert.match(workbench, /Keyword and Semantic modes/);
  assert.match(workbench, /Agent\s+Proposals for your review/);
  assert.match(workbench, /You do not need to repeat the agent&apos;s searches/);
  assert.match(workbench, /<details className="manual-verification">/);
  assert.match(workbench, /Open manual search and source inspection/);
  assert.match(styles, /\.manual-verification-content \.search-form/);
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

test("brief status reflects draft, human-reviewed, and approved states", () => {
  assert.match(
    workbench,
    /const status = brief\.approved\s+\? "Human approved"\s+: brief\.human_reviewed\s+\? "Human reviewed — approval pending"\s+: "Agent draft — human review required";/,
  );
});

test("split-screen citations keep a fixed checkbox column and readable source copy", () => {
  assert.match(workbench, /className="citation-option"/);
  assert.match(workbench, /className="citation-copy"/);
  assert.match(styles, /grid-template-columns: 1\.1rem minmax\(0, 1fr\)/);
  assert.match(styles, /\.citation-options input\[type="checkbox"\]/);
  assert.match(styles, /white-space: nowrap/);
});

test("brief review fields use dedicated readable sizing", () => {
  for (const className of ["brief-summary", "finding-statement", "brief-caveats"]) {
    assert.ok(workbench.includes(`className="${className}"`));
    assert.match(styles, new RegExp(`\\.${className} \\{`));
  }
});

test("approved artifact actions are human-visible and browser-local only", () => {
  const start = workbench.indexOf("function ApprovedBriefActions");
  const end = workbench.indexOf("function MissionPanel", start);
  const approvedActions = workbench.slice(start, end);

  assert.match(workbench, /presentation\.state === "complete"/);
  assert.match(approvedActions, /Download approved brief \(\.md\)/);
  assert.match(approvedActions, /Copy approved brief/);
  assert.match(approvedActions, /data:text\/markdown;charset=utf-8/);
  assert.match(approvedActions, /encodeURIComponent\(markdown\)/);
  assert.match(approvedActions, /navigator\.clipboard\.writeText\(markdown\)/);
  assert.match(approvedActions, /download=\{getApprovedBriefFilename/);
  assert.doesNotMatch(approvedActions, /fetch\(|workspaceStore|localStorage/);
});
