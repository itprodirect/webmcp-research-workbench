# WebMCP Research Workbench

A human-controlled evidence workspace where WebMCP-enabled agents can research,
propose evidence, and draft source-linked briefs while humans retain control of
evidence membership and conclusions.

## Live application

<https://webmcp-research-workbench.vercel.app/>

**V0 status:** `WEBMCP RESEARCH WORKBENCH V0 — PRODUCT FROZEN FOR SUBMISSION`

## Why WebMCP

WebMCP gives an enabled agent five declared, structured capabilities against the
same browser-local workspace used by the visible human interface. The agent can
read, research, propose, and draft without scraping the UI, inferring DOM behavior,
or imitating human clicks.

The website does not embed or run an AI model. A compatible WebMCP-enabled agent
uses the capabilities exposed by the workbench.

## Human / Agent model

**Human**

- Defines the research mission.
- Accepts, rejects, or removes evidence.
- Edits, reviews, and approves the brief.

**Agent**

- Reads the shared workspace.
- Searches and inspects OpenAlex sources.
- Proposes evidence for human review.
- Drafts a brief from human-accepted evidence.

## Workflow

**Define → Agent researches → Human accepts → Agent synthesizes → Human approves**

1. The human defines the research mission.
2. The human tells the agent what to research; the agent works through WebMCP.
3. The human curates the proposed evidence.
4. The human tells the agent to continue and synthesize from the accepted evidence.
5. The agent drafts using only human-accepted evidence.
6. The human reviews the draft, saves changes only when edits are present, marks the
   brief reviewed, and approves it.
7. The approved Markdown can be downloaded or copied.

The optional **Copy example instruction** action remains available as onboarding or
fallback, but copying a prompt is not the required or default interaction model.

## Workbench HUD

A persistent unified HUD keeps the current **Research Cycle** status and live
**WebMCP** activity available while the human and agent move through the workspace.

## Exactly five WebMCP tools

1. `get_research_workspace` — reads the mission and compact workspace state.
2. `search_sources` — searches real OpenAlex works in keyword or OpenAlex-hosted
   semantic mode.
3. `get_source_details` — inspects normalized OpenAlex provenance and metadata.
4. `propose_evidence` — stages resolved sources for human acceptance or rejection.
5. `draft_evidence_brief` — places a review-required draft whose findings cite only
   accepted source IDs.

## Architecture and trust boundary

- OpenAlex is the only research provider.
- There is no embedded/runtime LLM and no OpenAI API integration.
- Agent operations use structured tools, not DOM actuation or UI scraping.
- There are no embeddings, vector database, backend database, or authentication.
- One bounded, versioned browser `sessionStorage` workspace is shared by the human
  UI and the WebMCP adapter. It survives same-tab refreshes, while a new browser
  session starts clean.
- External provider titles, abstracts, metadata, and URLs remain inert, untrusted
  evidence rather than instructions or credibility assessments.
- Every brief finding may cite only evidence already accepted by a human.
- Mission definition, evidence membership, editing, review, and final approval are
  human-only actions.

## Quick judge walkthrough

1. **Human UI:** Open the live application in an environment with WebMCP support
   enabled and define the visible Research Mission.
2. **Agent:** Tell the agent what to research and ask it to stop when human evidence
   review is required.
3. **Agent:** Let it read the workspace, search, inspect, and propose promising
   OpenAlex evidence through WebMCP.
4. **Human UI:** Accept or reject the proposals.
5. **Agent:** Tell the agent to continue and synthesize from only the accepted
   evidence.
6. **Human UI:** Review the draft, save changes only when edits are present, mark it
   reviewed, and approve it.
7. **Human UI:** Download or copy the approved Markdown artifact.

The unified HUD keeps the Research Cycle position and live WebMCP activity visible
throughout the handoffs.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000/>.

## Validation

Accepted frozen V0 validation at
`7b3b500529c08c2c35d51a50228d088d802cdd83`:

- `npm test` — 74/74 PASS
- `npm run lint` — PASS
- `npm run build` — PASS
- independent Claude HUD review — ACCEPT
- independent Claude demo-usability review — ACCEPT
- production smoke validation — PASS

Run the local validators with:

```bash
npm test
npm run lint
npm run build
```

## WebMCP testing notes

WebMCP tool discovery and invocation require a browser or client environment with
WebMCP support enabled. The repository does not claim universal client or browser-
version compatibility. The historical Phase 2A and Phase 2B deployment records
capture the supported Codex In-app Browser observations and limitations at those
gates. The frozen V0 was subsequently exercised on public production in Windows
ChatGPT Work; see the dogfood records for those observations.

## Documentation

Documents 00–17 preserve the planning and phase chronology. They remain historical
evidence where later V0 decisions supersede their earlier expectations.

1. [Project brief](docs/00-project-brief.md)
2. [WebMCP Challenge requirements](docs/01-webmcp-challenge-requirements.md)
3. [Product hypothesis](docs/02-product-hypothesis.md)
4. [Source strategy](docs/03-source-strategy.md)
5. [WebMCP tool design](docs/04-webmcp-tool-design.md)
6. [Security boundaries](docs/05-security-boundaries.md)
7. [Technical Gate and MVP success criteria](docs/06-mvp-success-criteria.md)
8. [Original demo plan — historical planning artifact; final plan pending](docs/07-demo-plan.md)
9. [Build backlog](docs/08-build-backlog.md)
10. [Decision log](docs/09-decision-log.md)
11. [Technical Gate evidence](docs/10-technical-gate-evidence.md)
12. [Technical Gate closeout](docs/11-technical-gate-closeout.md)
13. [Phase 2A deployment validation](docs/12-phase-2a-deployment-validation.md)
14. [Phase 2A closeout](docs/13-phase-2a-closeout.md)
15. [Phase 2B scope and acceptance](docs/14-phase-2b-shared-evidence-mission.md)
16. [Phase 2B deployment validation](docs/15-phase-2b-deployment-validation.md)
17. [Phase 2B closeout](docs/16-phase-2b-closeout.md)
18. [First human manual walkthrough](docs/17-first-human-manual-walkthrough.md)
19. [Dogfood Ledger V0](docs/18-dogfood-ledger-v0.md)
20. [Dogfood After-Action Report V0](docs/19-dogfood-after-action-report-v0.md)
21. [V0 Product Freeze](docs/20-v0-product-freeze.md)
22. [Phase 3 historical after-action report](docs/21-phase-3-aar-historical.md)

## License

Licensed under the [MIT License](LICENSE).
