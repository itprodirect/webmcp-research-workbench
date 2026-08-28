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
        "Ask the WebMCP-enabled agent to draft from the accepted evidence. The result must return unreviewed and unapproved.",
    };
  }

  return {
    state: "research",
    activeStageIndex: 1,
    owner: "agent",
    turnLabel: "AGENT'S TURN",
    headline: "Research the mission and propose evidence",
    guidance:
      "Ask a WebMCP-enabled agent to read the mission, search and inspect OpenAlex sources, propose up to three candidates, then stop for human review.",
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
