import assert from "node:assert/strict";
import test from "node:test";
import {
  deriveResearchCyclePresentation,
  getResearchCycleActionTargetId,
  getResearchCycleInteractionCue,
  getResearchCycleStageStatus,
  shouldAutoOpenResearchCycleHud,
} from "../src/client/research-cycle.ts";
import type {
  EvidenceBrief,
  EvidenceProposal,
  ResearchWorkspaceState,
  WorkspaceEvidence,
} from "../src/domain/workspace.ts";

function workspace(
  overrides: Partial<ResearchWorkspaceState> = {},
): ResearchWorkspaceState {
  return {
    schema_version: 1,
    mission: null,
    proposals: [],
    accepted_evidence: [],
    brief: null,
    activity: [],
    ...overrides,
  };
}

const mission = {
  question: "What does the evidence show?",
  context: null,
  evidence_max: 3,
  updated_at: "2026-08-28T12:00:00.000Z",
};
const acceptedEvidence = [{} as WorkspaceEvidence];
const pendingProposals = [{} as EvidenceProposal];
const draft = {
  human_reviewed: false,
  approved: false,
} as EvidenceBrief;

test("derives all seven Research Cycle presentation states from existing workspace state", () => {
  const cases = [
    [workspace(), "define", 0, "human", "Define the research mission"],
    [workspace({ mission }), "research", 1, "agent", "Research the mission"],
    [workspace({ mission, proposals: pendingProposals }), "curate", 2, "human", "Review the agent's proposed evidence"],
    [workspace({ mission, accepted_evidence: acceptedEvidence }), "synthesize", 3, "agent", "Draft the Evidence Brief"],
    [workspace({ mission, accepted_evidence: acceptedEvidence, brief: draft }), "review", 4, "human", "Review and edit the agent draft"],
    [workspace({ mission, accepted_evidence: acceptedEvidence, brief: { ...draft, human_reviewed: true } }), "approve", 4, "human", "Approve the reviewed brief"],
    [workspace({ mission, accepted_evidence: acceptedEvidence, brief: { ...draft, human_reviewed: true, approved: true } }), "complete", null, "complete", "Research cycle complete — your human-approved research artifact is ready to use in the next stage of your work."],
  ] as const;

  for (const [state, expectedState, activeStageIndex, owner, headline] of cases) {
    const presentation = deriveResearchCyclePresentation(state);
    assert.equal(presentation.state, expectedState);
    assert.equal(presentation.activeStageIndex, activeStageIndex);
    assert.equal(presentation.owner, owner);
    assert.equal(presentation.headline, headline);
    assert.match(presentation.nextStep, /^Next:/);
  }
});

test("marks earlier stages complete, the active stage current, and approved cycles complete", () => {
  const curate = deriveResearchCyclePresentation(
    workspace({ mission, proposals: pendingProposals }),
  );
  assert.deepEqual(
    Array.from({ length: 5 }, (_, index) =>
      getResearchCycleStageStatus(curate, index),
    ),
    ["complete", "complete", "current", "future", "future"],
  );

  const complete = deriveResearchCyclePresentation(
    workspace({
      mission,
      accepted_evidence: acceptedEvidence,
      brief: { ...draft, human_reviewed: true, approved: true },
    }),
  );
  assert.deepEqual(
    Array.from({ length: 5 }, (_, index) =>
      getResearchCycleStageStatus(complete, index),
    ),
    ["complete", "complete", "complete", "complete", "complete"],
  );
});

test("pending evidence review takes precedence over an unapproved draft", () => {
  const presentation = deriveResearchCyclePresentation(
    workspace({ mission, proposals: pendingProposals, brief: draft }),
  );

  assert.equal(presentation.state, "curate");
  assert.equal(presentation.headline, "Review the agent's proposed evidence");
});

test("maps every presentation state to its existing human action surface", () => {
  assert.deepEqual(
    [
      "define",
      "research",
      "curate",
      "synthesize",
      "review",
      "approve",
      "complete",
    ].map((state) =>
      getResearchCycleActionTargetId(
        state as ReturnType<typeof deriveResearchCyclePresentation>["state"],
      ),
    ),
    [
      "mission-heading",
      "research-cycle",
      "proposals-heading",
      "brief-heading",
      "brief-heading",
      "brief-heading",
      "approved-brief-actions",
    ],
  );
});

test("maps every presentation state to an explicit interaction mode", () => {
  assert.deepEqual(
    [
      "define",
      "research",
      "curate",
      "synthesize",
      "review",
      "approve",
      "complete",
    ].map((state) =>
      getResearchCycleInteractionCue(state as ReturnType<
        typeof deriveResearchCyclePresentation
      >["state"]),
    ),
    [
      { label: "USE WORKBENCH", supportingText: "Set the mission in the Workbench." },
      { label: "USE CHAT / VOICE", supportingText: "Tell your agent to continue." },
      { label: "USE WORKBENCH", supportingText: "Review and decide in the Workbench." },
      { label: "USE CHAT / VOICE", supportingText: "Tell your agent to continue." },
      { label: "USE WORKBENCH", supportingText: "Review and decide in the Workbench." },
      { label: "USE WORKBENCH", supportingText: "Review and decide in the Workbench." },
      { label: "ARTIFACT READY", supportingText: "Download or copy the approved brief." },
    ],
  );
});

test("auto-opens only once per offscreen Research Cycle state transition", () => {
  assert.equal(shouldAutoOpenResearchCycleHud(null, "define", true), false);
  assert.equal(shouldAutoOpenResearchCycleHud("research", "research", true), false);
  assert.equal(shouldAutoOpenResearchCycleHud("research", "curate", false), false);
  assert.equal(shouldAutoOpenResearchCycleHud("research", "curate", true), true);

  // A manual close does not change the semantic state, so stable rerenders stay closed.
  assert.equal(shouldAutoOpenResearchCycleHud("curate", "curate", true), false);
  // The next semantic transition is eligible to surface the coach again.
  assert.equal(shouldAutoOpenResearchCycleHud("curate", "synthesize", true), true);
});
