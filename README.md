# WebMCP Research Workbench

A human-controlled evidence workspace where WebMCP-enabled agents can research,
propose evidence, and draft source-linked briefs while humans retain control of
evidence membership and conclusions.

## Live application

<https://webmcp-research-workbench.vercel.app/>

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
- One bounded, versioned browser `localStorage` workspace is shared by the human UI
  and the WebMCP adapter.
- External provider titles, abstracts, metadata, and URLs remain inert, untrusted
  evidence rather than instructions or credibility assessments.
- Every brief finding may cite only evidence already accepted by a human.
- Mission definition, evidence membership, editing, review, and final approval are
  human-only actions.

## Quick judge walkthrough

1. **Human UI:** Open the live application in an environment with WebMCP support
   enabled and define the visible Research Mission.
2. **Agent:** Ask the agent to read the shared workspace.
3. **Agent:** Have it search, inspect, and propose promising OpenAlex evidence.
4. **Human UI:** Accept or reject the proposals.
5. **Human UI:** Once evidence is accepted, use **Copy agent prompt** in the ready-for-
   synthesis state.
6. **Agent:** Send that prompt so the agent drafts the Evidence Brief through WebMCP.
7. **Human UI:** Edit the draft, mark it reviewed, and approve it.
8. **Human UI:** Inspect the Collaboration log to see the human and agent handoffs.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000/>.

## Validation

```bash
npm test
npm run lint
npm run build
```

## WebMCP testing notes

WebMCP tool discovery and invocation require a browser or client environment with
WebMCP support enabled. The repository does not claim universal client or browser-
version compatibility. The accepted production validation used the supported Codex
In-app Browser available during Phase 2B; that environment exposed neither a browser
version nor a user agent. See the deployment evidence for the exact observations and
limitations.

## Documentation

1. [Project brief](docs/00-project-brief.md)
2. [WebMCP Challenge requirements](docs/01-webmcp-challenge-requirements.md)
3. [Product hypothesis](docs/02-product-hypothesis.md)
4. [Source strategy](docs/03-source-strategy.md)
5. [WebMCP tool design](docs/04-webmcp-tool-design.md)
6. [Security boundaries](docs/05-security-boundaries.md)
7. [Technical Gate and MVP success criteria](docs/06-mvp-success-criteria.md)
8. [Demo plan](docs/07-demo-plan.md)
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

## License

Licensed under the [MIT License](LICENSE).
