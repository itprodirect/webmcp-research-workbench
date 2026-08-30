import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/page.tsx", "utf8");
const workbench = readFileSync("app/components/search-workbench.tsx", "utf8");
const researchCycle = readFileSync("src/client/research-cycle.ts", "utf8");
const styles = readFileSync("app/globals.css", "utf8");
const registration = readFileSync("app/components/webmcp-registration.tsx", "utf8");
const activity = readFileSync("src/client/webmcp-activity.ts", "utf8");
const researchCycleComponent = workbench.slice(
  workbench.indexOf("function ResearchCycle"),
  workbench.indexOf("function PromptCopyAction"),
);
const hudComponent = workbench.slice(
  workbench.indexOf("function WorkbenchHud"),
  workbench.indexOf("function WebMcpActivityList"),
);
const briefComponent = workbench.slice(
  workbench.indexOf("function BriefPanel"),
  workbench.indexOf("function ActivityPanel"),
);

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

test("current mission guidance uses the judge-facing AI-security examples", () => {
  assert.match(
    workbench,
    /What recent evidence shows which indirect\s+prompt-injection defenses remain effective against adaptive attacks on\s+tool-using AI agents\?/,
  );
  assert.match(
    workbench,
    /Briefing for an AI-security research\s+team evaluating safeguards for browser and tool-using agents\./,
  );
  assert.doesNotMatch(workbench, /heat-pump|sustainability/i);
});

test("Research is conversational-first with an optional clipboard example", () => {
  assert.match(researchCycle, /Tell your agent to research this mission using the Workbench/);
  assert.match(workbench, /prompt=\{AGENT_RESEARCH_PROMPT\}/);
  assert.match(workbench, /navigator\.clipboard\.writeText\(prompt\)/);
  assert.match(workbench, /Copy example instruction/);
  assert.match(workbench, /Example research instruction copied\./);
  assert.match(workbench, /Could not copy the research prompt\./);
  assert.match(workbench, /role=\{feedback\.kind === "error" \? "alert" : "status"\}/);
});

test("the global Workbench HUD exposes live five-tool telemetry without persistence", () => {
  assert.match(registration, /instrumentWebMcpTools\(createWebMcpTools\(\)\)/);
  assert.match(hudComponent, /<h2 id="workbench-hud-webmcp-heading">WebMCP Activity<\/h2>/);
  assert.match(hudComponent, /webMcpActivityStore\.subscribe/);
  assert.doesNotMatch(researchCycleComponent, /webMcpActivityStore|WebMcpActivity/);
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
  assert.match(hudComponent, /entry\.invocationCount > 0/);
  assert.match(hudComponent, /used · \$\{invocationCount\} call/);
  assert.match(hudComponent, /\$\{running\.name\} running/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.webmcp-activity-running/);
  assert.match(styles, /\.webmcp-activity-succeeded/);
  assert.match(styles, /\.webmcp-activity-failed/);
});

test("every Research Cycle action includes an explicit next-step cue", () => {
  assert.match(workbench, /className="cycle-next-cue"/);
  assert.match(researchCycle, /Tell your agent to research this mission/);
  assert.match(researchCycle, /Your Turn — Curate/);
  assert.match(researchCycle, /Agent's Turn — Synthesize/);
  assert.match(researchCycle, /Your Turn — Approve/);
  assert.match(researchCycle, /human-approved Markdown artifact/);
  assert.match(workbench, /Copy example instruction/);
});

test("the full cycle hands off to an action-linked bottom-right Workbench HUD", () => {
  assert.match(workbench, /id="research-cycle"/);
  assert.match(workbench, /<h2 id="research-cycle-heading">Research Cycle<\/h2>/);
  assert.match(workbench, /new IntersectionObserver/);
  assert.match(workbench, /showResearchCycleControl/);
  assert.match(workbench, /aria-label="Workbench HUD"/);
  assert.match(hudComponent, /Your Turn/);
  assert.match(hudComponent, /Agent's Turn/);
  assert.match(researchCycle, /Complete · Approved/);
  assert.match(workbench, /getResearchCycleActionTargetId\(presentation\.state\)/);
  assert.match(workbench, /scrollIntoView/);
  assert.match(workbench, /prefers-reduced-motion: reduce/);
  assert.match(workbench, /id="approved-brief-actions"/);
  assert.match(styles, /\.workbench-hud \{[\s\S]*position: fixed;[\s\S]*right: 1rem;[\s\S]*bottom: 1rem;/);
  assert.doesNotMatch(workbench, /research-cycle-dock|Compact Research Cycle/);
  assert.doesNotMatch(styles, /\.research-cycle-dock|\.cycle-dock-/);
  assert.doesNotMatch(styles, /\.research-cycle-panel \{\s*position: sticky;/);
});

test("offscreen semantic transitions surface the Research Cycle coach once", () => {
  assert.match(workbench, /const previousResearchCycleState = useRef\(researchCycleState\)/);
  assert.match(workbench, /shouldAutoOpenResearchCycleHud\(/);
  assert.match(workbench, /previousResearchCycleState\.current = researchCycleState/);
  assert.match(workbench, /setOpenHudPanel\("research-cycle"\)/);
  assert.match(workbench, /\[researchCycleState, showResearchCycleControl\]/);
});

test("Workbench HUD keeps Research Cycle and WebMCP distinct and mutually exclusive", () => {
  assert.match(workbench, /type WorkbenchHudPanel = "research-cycle" \| "webmcp" \| null/);
  assert.match(hudComponent, /togglePanel\("research-cycle"\)/);
  assert.match(hudComponent, /togglePanel\("webmcp"\)/);
  assert.match(hudComponent, /openPanel === panel \? null : panel/);
  assert.match(hudComponent, /openPanel === "research-cycle"/);
  assert.match(hudComponent, /openPanel === "webmcp"/);
  assert.match(hudComponent, /aria-controls="workbench-hud-research-panel"/);
  assert.match(hudComponent, /aria-controls="workbench-hud-webmcp-panel"/);
  assert.match(hudComponent, /aria-expanded=\{openPanel === "research-cycle"\}/);
  assert.match(hudComponent, /aria-expanded=\{openPanel === "webmcp"\}/);
  assert.doesNotMatch(researchCycleComponent, /WebMCP Activity/);
});

test("Research Cycle HUD reuses workflow presentation and existing immediate actions", () => {
  assert.match(hudComponent, /deriveResearchCyclePresentation\(workspace\)/);
  assert.match(hudComponent, /getResearchCycleStageStatus\(presentation, index\)/);
  assert.match(hudComponent, /getResearchCycleActionTargetId\(presentation\.state\)/);
  assert.match(hudComponent, /prompt=\{AGENT_RESEARCH_PROMPT\}/);
  assert.match(hudComponent, /prompt=\{AGENT_SYNTHESIS_PROMPT\}/);
  assert.match(hudComponent, /Jump to mission/);
  assert.match(hudComponent, /Jump to proposals/);
  assert.match(hudComponent, /Jump to Evidence Brief/);
  assert.match(hudComponent, /Jump to approved brief/);
  assert.match(
    hudComponent,
    /getResearchCycleInteractionCue\([\s\S]*presentation\.state,[\s\S]*researchCycleActivityState/,
  );
  assert.match(hudComponent, /className="hud-interaction-cue"/);
  assert.match(styles, /\.hud-interaction-cue \{/);
});

test("agent-owned HUD stages use a truthful stage-local WebMCP activity baseline", () => {
  assert.match(workbench, /key=\{researchCycleState\}/);
  assert.match(hudComponent, /const \[stageEntryInvocationCount\] = useState\(/);
  assert.match(hudComponent, /getWebMcpInvocationCount\(webMcpActivity\)/);
  assert.match(hudComponent, /deriveResearchCycleActivityState\(/);
  assert.match(researchCycle, /currentInvocationCount > stageEntryInvocationCount/);
  assert.match(researchCycle, /WAITING FOR AGENT/);
  assert.match(researchCycle, /AGENT WORK IN PROGRESS/);
  assert.match(researchCycle, /NO ACTION NEEDED/);
  assert.match(researchCycle, /WebMCP activity received/);
  assert.match(researchCycle, /Waiting for agent/);
  assert.match(researchCycle, /Agent working/);
  assert.doesNotMatch(hudComponent, /setTimeout|setInterval/);
});

test("agent handoff activity is live, decorative, and reduced-motion safe", () => {
  assert.match(hudComponent, /className=\{`hud-agent-activity/);
  assert.match(hudComponent, /role="status"/);
  assert.match(hudComponent, /aria-live="polite"/);
  assert.match(hudComponent, /aria-atomic="true"/);
  assert.match(
    hudComponent,
    /className="hud-agent-activity-indicator" aria-hidden="true"/,
  );
  assert.match(styles, /@keyframes research-cycle-agent-pulse/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hud-agent-activity-indicator,[\s\S]*animation: none/,
  );
});

test("Workbench HUD is keyboard accessible, non-modal, live, and responsive", () => {
  assert.match(hudComponent, /event\.key === "Escape"/);
  assert.match(hudComponent, /document\.addEventListener\("keydown"/);
  assert.match(hudComponent, /<button/);
  assert.match(hudComponent, /aria-live="polite" aria-atomic="true"/);
  assert.doesNotMatch(hudComponent, /role="dialog"|aria-modal|focus\(/);
  assert.match(styles, /@supports \(backdrop-filter: blur\(12px\)\)/);
  assert.match(styles, /@media \(max-width: 680px\)[\s\S]*\.workbench-hud/);
  assert.match(styles, /max-height: min\(68vh, 34rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none/);
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

test("Synthesize is conversational-first with the authorized optional example", () => {
  const prompt =
    "In the WebMCP Research Workbench, read the current research workspace and draft the Evidence Brief for the active mission. Use only the human-accepted evidence already in the workspace when supporting or citing findings. Cite each finding to the accepted source IDs that support it, include relevant caveats about the limits of the evidence, and leave the result for human review. Do not mark it reviewed or approve it.";

  assert.ok(workbench.includes(prompt));
  assert.match(researchCycle, /Tell your agent to draft the brief using only the evidence you accepted/);
  assert.match(briefComponent, /Tell your agent to draft the brief using only the evidence you accepted/);
  assert.match(briefComponent, /prompt=\{AGENT_SYNTHESIS_PROMPT\}/);
  assert.match(briefComponent, /label="Copy example instruction"/);
  assert.match(briefComponent, /Example synthesis instruction copied\./);
  assert.match(briefComponent, /Could not copy the synthesis instruction\./);
});

test("brief status reflects draft, human-reviewed, and approved states", () => {
  assert.match(
    workbench,
    /const status = brief\.approved\s+\? "Human approved"\s+: brief\.human_reviewed\s+\? "Human reviewed — approval pending"\s+: "Agent draft — human review required";/,
  );
});

test("brief review and approval are progressive actions with unsaved-edit guards", () => {
  assert.match(briefComponent, /All changes saved/);
  assert.match(briefComponent, /Unsaved changes/);
  assert.match(briefComponent, /Changes saved/);
  assert.match(briefComponent, />Save changes<\/button>/);
  assert.match(briefComponent, /disabled=\{!isDirty\}/);
  assert.match(briefComponent, /onChange=\{handleFormChange\}/);
  assert.match(briefComponent, /role="status"/);
  assert.match(briefComponent, /aria-live="polite"/);
  assert.match(briefComponent, /saveBriefChangesIfDirty/);
  assert.match(briefComponent, /saveConfirmation\?\.editorKey === editorKey/);
  assert.match(briefComponent, /Review the saved draft/);
  assert.match(briefComponent, /disabled=\{isDirty\} onClick=\{handleReview\}>Mark reviewed<\/button>/);
  assert.match(briefComponent, /brief\.human_reviewed && !brief\.approved/);
  assert.match(briefComponent, /disabled=\{isDirty\} onClick=\{handleApprove\}>Approve brief<\/button>/);
  assert.match(briefComponent, /hasUnsavedFormChanges\(form\)/);
  assert.match(briefComponent, /Save your edits before completing review\./);
  assert.match(briefComponent, /Save your edits before approving the brief\./);
  assert.doesNotMatch(briefComponent, /Save human edits/);
  assert.doesNotMatch(briefComponent, />Reviewed<\/button>|>Approved<\/button>/);
  assert.doesNotMatch(briefComponent, /disabled=\{!brief\.human_reviewed/);
});

test("brief editor identity changes only with editable content", () => {
  assert.match(briefComponent, /key=\{editorKey\}/);
  assert.match(briefComponent, /getBriefEditorContentKey\(brief\)/);
  assert.doesNotMatch(briefComponent, /key=\{brief\.updated_at\}/);
  assert.doesNotMatch(briefComponent, /key=\{`\$\{brief\.updated_at\}/);
});

test("approval reveals one immediate local completion handoff without navigation", () => {
  assert.match(briefComponent, /Research complete/);
  assert.match(briefComponent, /Your human-approved research artifact is ready\./);
  assert.match(briefComponent, /<ApprovedBriefActions workspace=\{workspace\} \/>/);
  assert.match(briefComponent, /Use the approved artifact in the next stage of your work/);
  assert.doesNotMatch(briefComponent, /scrollIntoView|window\.scroll|location\./);
  assert.ok(
    briefComponent.indexOf("{editor}") <
      briefComponent.indexOf('className="brief-completion"'),
  );
  assert.equal(
    workbench.match(/<ApprovedBriefActions workspace=\{workspace\} \/>/g)?.length,
    1,
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

  assert.match(researchCycle, /activityState === "complete"/);
  assert.match(approvedActions, /Download approved brief \(\.md\)/);
  assert.match(approvedActions, /Copy approved brief/);
  assert.match(approvedActions, /data:text\/markdown;charset=utf-8/);
  assert.match(approvedActions, /encodeURIComponent\(markdown\)/);
  assert.match(approvedActions, /navigator\.clipboard\.writeText\(markdown\)/);
  assert.match(approvedActions, /download=\{getApprovedBriefFilename/);
  assert.doesNotMatch(approvedActions, /fetch\(|workspaceStore|localStorage/);
});
