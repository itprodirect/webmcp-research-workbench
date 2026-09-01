# Final Human Acceptance Runbook

## Purpose

Validate visible handoffs, not research quality.

- **Primary URL:** <https://research.itprodirect.com/>
- **Expected canonical main:** `5b48d931142ba09a2f0135e404ecad282ddc327b`
- **Environment:** a fresh Windows ChatGPT Work conversation

## Test mission

**Mission:**

> What recent evidence shows which indirect prompt-injection defenses remain
> effective against adaptive attacks on tool-using AI agents?

**Audience:**

> AI-security research team evaluating safeguards for browser and tool-using
> agents.

**Evidence limit:** 3.

## Acceptance sequence

1. Open the Workbench.
2. Set the mission.
3. Confirm Research shows:
   - **WAITING FOR AGENT**
   - **USE CHAT / VOICE**
4. Tell the agent to research.
5. Confirm real activity changes the state to:
   - **AGENT WORK IN PROGRESS**
   - **NO ACTION NEEDED**
6. Confirm Curate shows:
   - **USE WORKBENCH**
7. Accept or reject evidence.
8. Confirm Synthesize starts at:
   - **WAITING FOR AGENT**
9. Tell the agent to synthesize.
10. Confirm real Synthesize activity shows:
    - **AGENT WORK IN PROGRESS**
    - **NO ACTION NEEDED**
11. Confirm the human review stage shows:
    - **USE WORKBENCH**

## Acceptance decision

Ask:

> Without remembering the internal runbook, is it immediately clear whether I
> should TALK, WAIT, or CLICK?

**PASS condition:** YES.

If PASS, record:

**Demo Interaction Model — HUMAN ACCEPTED / FROZEN**

If FAIL, capture a screenshot or transcript and classify the finding as:

- release blocker;
- demo-script issue; or
- post-submission backlog.

Do not automatically reopen code for aesthetic or low-value issues.

The run may stop after Synthesize/Review if all handoff transitions are proven. A
complete research-quality artifact is not required for this acceptance test.

## Final result: 2026-08-31

**Result:** PASS

**Demo Interaction Model:** HUMAN ACCEPTED / FROZEN

**Acceptance question:** YES

The final Windows ChatGPT Work run completed beyond the minimum required handoff
test. It reached human approval of the final brief and direct human download of the
approved Markdown artifact.

## Next steps after PASS

1. documentation freeze addendum or current-status update;
2. 3-minute storyboard;
3. recording script;
4. screen-recording plan;
5. judge-facing README/Devpost polish; and
6. final submission validation.
