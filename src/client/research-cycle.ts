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
export type ResearchCycleActivityState =
  | "waiting_for_agent"
  | "agent_work_in_progress"
  | "human_turn"
  | "complete";

export type ResearchCycleInteractionCue = {
  label:
    | "USE CHAT / VOICE"
    | "NO ACTION NEEDED"
    | "USE WORKBENCH"
    | "ARTIFACT READY";
  supportingText: string;
};

export type ResearchCycleAgentActivityCue = {
  label: "WAITING FOR AGENT" | "AGENT WORK IN PROGRESS";
  supportingText: string;
  isWorking: boolean;
};

export type ResearchCyclePresentation = {
  state: ResearchCycleState;
  activeStageIndex: number | null;
  owner: ResearchCycleOwner;
  turnLabel: string;
  headline: string;
  guidance: string;
  nextStep: string;
};

export function shouldAutoOpenResearchCycleHud(
  previousState: ResearchCycleState | null,
  currentState: ResearchCycleState,
  isFullCycleOffscreen: boolean,
): boolean {
  return (
    previousState !== null &&
    previousState !== currentState &&
    isFullCycleOffscreen
  );
}

export function getResearchCycleInteractionCue(
  state: ResearchCycleState,
  activityState: ResearchCycleActivityState,
): ResearchCycleInteractionCue {
  switch (state) {
    case "research":
    case "synthesize":
      if (activityState === "agent_work_in_progress") {
        return {
          label: "NO ACTION NEEDED",
          supportingText:
            "WebMCP activity received. Wait for the Workbench to hand control back.",
        };
      }
      return {
        label: "USE CHAT / VOICE",
        supportingText: "Tell your agent to continue.",
      };
    case "complete":
      return {
        label: "ARTIFACT READY",
        supportingText: "Download or copy the approved brief.",
      };
    default:
      return {
        label: "USE WORKBENCH",
        supportingText:
          state === "define"
            ? "Set the mission in the Workbench."
            : "Review and decide in the Workbench.",
      };
  }
}

export function deriveResearchCycleActivityState(
  state: ResearchCycleState,
  stageEntryInvocationCount: number,
  currentInvocationCount: number,
): ResearchCycleActivityState {
  if (state === "complete") {
    return "complete";
  }
  if (state !== "research" && state !== "synthesize") {
    return "human_turn";
  }
  return currentInvocationCount > stageEntryInvocationCount
    ? "agent_work_in_progress"
    : "waiting_for_agent";
}

export function getResearchCycleAgentActivityCue(
  activityState: ResearchCycleActivityState,
): ResearchCycleAgentActivityCue | null {
  switch (activityState) {
    case "waiting_for_agent":
      return {
        label: "WAITING FOR AGENT",
        supportingText:
          "Use chat / voice to hand off this step. The Workbench will update when WebMCP activity begins.",
        isWorking: false,
      };
    case "agent_work_in_progress":
      return {
        label: "AGENT WORK IN PROGRESS",
        supportingText:
          "WebMCP activity received. The Workbench will hand control back when this stage is ready.",
        isWorking: true,
      };
    default:
      return null;
  }
}

export function getResearchCycleHudSummary(
  presentation: ResearchCyclePresentation,
  activityState: ResearchCycleActivityState,
): string {
  if (activityState === "complete") {
    return "Complete · Approved";
  }
  const stageIndex = presentation.activeStageIndex ?? 0;
  const stage = RESEARCH_CYCLE_STAGES[stageIndex];
  const turn = activityState === "waiting_for_agent"
    ? "Waiting for agent"
    : activityState === "agent_work_in_progress"
      ? "Agent working"
      : "Your Turn";
  return `${turn} · ${stage.label} ${stageIndex + 1}/${RESEARCH_CYCLE_STAGES.length}`;
}

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
        "Tell your agent to draft the brief using only the evidence you accepted. It will return the result unreviewed and unapproved.",
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
      "Tell your agent to research this mission using the Workbench and stop when evidence proposals are ready for your review.",
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

export function getResearchCycleActionTargetId(
  state: ResearchCycleState,
): string {
  switch (state) {
    case "define":
      return "mission-heading";
    case "research":
      return "research-cycle";
    case "curate":
      return "proposals-heading";
    case "synthesize":
    case "review":
    case "approve":
      return "brief-heading";
    case "complete":
      return "approved-brief-actions";
  }
}
