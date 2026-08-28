import assert from "node:assert/strict";
import test from "node:test";
import {
  deriveResearchCyclePresentation,
  getResearchCycleStageStatus,
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
    [workspace({ mission }), "research", 1, "agent", "Research the mission and propose evidence"],
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
