# Build Backlog

Work proceeds in strict order. Completion of a phase does not authorize the next phase unless its review or gate decision is explicit.

## Phase 0 — Planning baseline

- Establish the canonical brief, hypotheses, source strategy, tool design, security boundaries, success criteria, demo plan, backlog, and decision log.
- Add repository operating instructions and conservative ignore rules.
- Review, commit, push, and obtain human acceptance.

No application implementation belongs in Phase 0.

## Phase 1 — Technical feasibility gate

After explicit approval of Phase 0, and only then:

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
- PASS permits a separately reviewed MVP plan.
- PARTIAL requires resolving or explicitly re-scoping the gate; it does not permit feature expansion.
- FAIL triggers the kill criterion: stop or reconsider the concept rather than adding adapters and features.

## Phase 2 — MVP

Only after a recorded PASS decision:

- Confirm the provisional provider set and tool count.
- Add only approved providers through bounded server adapters.
- Add source details and the human-controlled in-memory packet workflow.
- Register `get_source_details` through the shared domain layer.
- Validate provenance, deduplication behavior, trust boundaries, and production browser behavior.
- Reassess deferred capabilities instead of assuming they belong in V0.

## Phase 3 — Challenge submission

- Re-verify official challenge rules, deadline, supported browser, and judging freeze guidance.
- Choose and add an approved open-source license.
- Complete production validation and accessibility/usability checks.
- Record a public demo under three minutes with audio.
- Prepare the project description, WebMCP-fit explanation, public repository, and live URL.
- Freeze and verify submitted materials as required.
