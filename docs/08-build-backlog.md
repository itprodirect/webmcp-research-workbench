# Build Backlog

Work proceeds in strict order. Completion of a phase does not authorize the next phase unless its review or gate decision is explicit.

## Phase 0 — Planning Baseline V0

- Establish the canonical brief, hypotheses, source strategy, tool design, security boundaries, success criteria, demo plan, backlog, and decision log.
- Add repository operating instructions and conservative ignore rules.
- Review, commit, push, and obtain human acceptance.

No application implementation belongs in Phase 0.

## Phase 1 — Technical Gate

After explicit approval of Planning Baseline V0, and only then:

1. Scaffold a minimal Next.js application.
2. Deploy the initial Vercel application.
3. Define a compact `SourceRecord`.
4. Implement the OpenAlex server adapter.
5. Implement the shared `searchSources()` domain operation.
6. Implement a minimal human search UI.
7. Register WebMCP `search_sources`.
8. Deploy.
9. Test with a compatible browser agent.
10. Document the gate result.
11. **STOP and decide whether the gate passed.**

> No GitHub adapter, packet persistence, LLM, database, MCP server, comparison tool, or additional provider before the gate.

## Gate decision

- Evaluate the evidence against `06-mvp-success-criteria.md` as PASS, PARTIAL, or FAIL.
- PASS permits immediate execution of the smallest approved Challenge MVP scope; it does not authorize unapproved features or broad product replanning.
- PARTIAL permits only a bounded attempt to resolve the gate defect within the time box; a prolonged PARTIAL requires a deliberate pivot/stop decision.
- FAIL triggers a deliberate pivot/stop decision rather than more gate engineering, adapters, or features.

## Challenge schedule targets

These are planning targets, not guarantees:

| Target window | Bounded objective |
| --- | --- |
| Aug 27–28 | Complete the Technical Gate and record PASS, PARTIAL, or FAIL. |
| Aug 28–31 | After a recorded PASS only, build the smallest approved Challenge MVP. |
| Sep 1–2 | Complete deployment validation, supported-browser validation, README/submission materials, demo recording, and Devpost preparation. |
| Sep 3 | Preserve a submission buffer before the 1:00 PM Pacific deadline. |

The Technical Gate is time-boxed. Deadline pressure does not weaken PASS/PARTIAL/FAIL, authorize Challenge MVP work before PASS, or justify extra features. A PASS should move directly into the smallest approved Challenge MVP; a prolonged PARTIAL or FAIL should protect the remaining challenge window through an explicit pivot/stop decision.

## Phase 2 — Challenge MVP

Only after a recorded Technical Gate PASS:

- Confirm the provisional provider set and tool count.
- Add only approved providers through bounded server adapters.
- Add source details and the human-controlled in-memory packet workflow.
- Register `get_source_details` through the shared domain layer.
- Validate provenance, deduplication behavior, trust boundaries, and production browser behavior.
- Reassess deferred capabilities instead of assuming they belong in the Challenge MVP.

## Phase 3 — Challenge submission

- Re-verify official challenge rules, deadline, supported browser, and judging freeze guidance.
- Choose and add an approved open-source license.
- Complete production validation and accessibility/usability checks.
- Record a public demo under three minutes with audio.
- Prepare the project description, WebMCP-fit explanation, public repository, and live URL.
- Freeze and verify submitted materials as required.
