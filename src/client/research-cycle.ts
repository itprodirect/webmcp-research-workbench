import type { ResearchWorkspaceState } from "../domain/workspace";

export const RESEARCH_CYCLE_STAGES = [
  { label: "Define", actor: "Human" },
  { label: "Research", actor: "Agent" },
  { label: "Curate", actor: "Human" },
  { label: "Synthesize", actor: "Agent" },
  { label: "Approve", actor: "Human" },
] as const;

export type ResearchCycleState =
  | "define"
  | "research"
  | "curate"
  | "synthesize"
  | "review"
  | "approve"
  | "complete";

export type ResearchCycleOwner = "human" | "agent" | "complete";
export type ResearchCycleStageStatus = "complete" | "current" | "future";

export type ResearchCyclePresentation = {
  state: ResearchCycleState;
  activeStageIndex: number | null;
  owner: ResearchCycleOwner;
  turnLabel: string;
  headline: string;
  guidance: string;
  nextStep: string;
};

export function deriveResearchCyclePresentation(
  workspace: ResearchWorkspaceState,
): ResearchCyclePresentation {
  if (!workspace.mission) {
    return {
      state: "define",
      activeStageIndex: 0,
      owner: "human",
      turnLabel: "YOUR TURN",
      headline: "Define the research mission",
      guidance:
        "Set the question, audience, and evidence limit below. The agent cannot begin until the human-owned mission exists.",
      nextStep:
        "Next: Save the mission. The Research Cycle will move to Agent's Turn — Research.",
    };
  }

  if (workspace.brief?.approved) {
    return {
      state: "complete",
      activeStageIndex: null,
      owner: "complete",
      turnLabel: "RESEARCH CYCLE COMPLETE",
      headline:
        "Research cycle complete — your human-approved research artifact is ready to use in the next stage of your work.",
      guidance:
        "Download or copy the approved brief below. The Collaboration log and Reset workspace remain available as secondary actions.",
      nextStep:
        "Next: Use the human-approved artifact in the next stage of your work. No further agent action is required for this mission.",
    };
  }

  if (workspace.proposals.length > 0) {
    return {
      state: "curate",
      activeStageIndex: 2,
      owner: "human",
      turnLabel: "YOUR TURN",
      headline: "Review the agent's proposed evidence",
      guidance:
        "Accept strong sources and reject weaker ones. Only human-accepted evidence can support the Evidence Brief.",
      nextStep:
        "Next: When the proposal queue is clear and evidence is accepted, the Research Cycle will move to Agent's Turn — Synthesize.",
    };
  }

  if (workspace.brief?.human_reviewed) {
    return {
      state: "approve",
      activeStageIndex: 4,
      owner: "human",
      turnLabel: "YOUR TURN",
      headline: "Approve the reviewed brief",
      guidance:
        "The brief has been reviewed. Approve it when the evidence, findings, and caveats reflect your final judgment.",
      nextStep:
        "Next: Approval completes the Research Cycle and makes the human-approved Markdown artifact available.",
    };
  }

  if (workspace.brief) {
    return {
      state: "review",
      activeStageIndex: 4,
      owner: "human",
      turnLabel: "YOUR TURN",
      headline: "Review and edit the agent draft",
      guidance:
        "Check every finding and citation, save any human edits, then mark the brief reviewed. Approval remains unavailable until review is complete.",
      nextStep:
        "Next: Mark the draft reviewed. The Research Cycle will remain Your Turn and move to final approval.",
    };
  }

  if (workspace.accepted_evidence.length > 0) {
    return {
      state: "synthesize",
      activeStageIndex: 3,
      owner: "agent",
      turnLabel: "AGENT'S TURN",
      headline: "Draft the Evidence Brief",
      guidance:
        "Give the synthesis instruction below to the WebMCP-enabled agent. It will draft only from human-accepted evidence and return the result unreviewed and unapproved.",
      nextStep:
        "Next: Return here when the agent draft appears. The Research Cycle will move to Your Turn — Approve, beginning with human review.",
    };
  }

  return {
    state: "research",
    activeStageIndex: 1,
    owner: "agent",
    turnLabel: "AGENT'S TURN",
    headline: "Research the mission",
    guidance:
      "Your mission is ready. Give the instruction below to the WebMCP-enabled agent you're working with.",
    nextStep:
      "Next: Return here when the agent has proposed evidence. The Research Cycle will move to Your Turn — Curate.",
  };
}

export function getResearchCycleStageStatus(
  presentation: ResearchCyclePresentation,
  stageIndex: number,
): ResearchCycleStageStatus {
  if (presentation.state === "complete") {
    return "complete";
  }
  if (stageIndex === presentation.activeStageIndex) {
    return "current";
  }
  return stageIndex < (presentation.activeStageIndex ?? 0) ? "complete" : "future";
}
