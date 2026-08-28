# WebMCP Research Workbench

> A provenance-aware research workspace for humans and browser agents using WebMCP.

## Status

- Planning Baseline V0 remains the historical baseline.
- Phase 1 Technical Gate: **HUMAN ACCEPTED / PASS**
- Phase 2A Inspect + Curate: **HUMAN ACCEPTED / PASS / MERGED**
- Phase 2B Shared Evidence Mission: **implementation review pending**

## Objective

This project tests whether explicit, structured WebMCP research operations materially improve human-agent research workflows. It is intentionally human-authorized: an agent may stage evidence proposals and draft a source-linked brief, while humans retain authority over mission definition, evidence membership, editing, review, approval, and conclusions.

## Current scope

- Next.js application deployed through the existing Vercel workflow.
- OpenAlex is the only provider.
- Keyword search remains the default; optional semantic mode uses OpenAlex-hosted `search.semantic`.
- One versioned browser-local workspace is shared by the human UI and exactly five WebMCP tools.
- Agent mutations are limited to staged proposals and review-required draft briefs.
- Human acceptance is required for evidence membership, and agent drafts may cite only accepted source IDs.
- No runtime LLM, embeddings, vector database, database, authentication, crawler, or publish/export tool.

## Important boundary

> This repository must not contain Research Intelligence source data, Gray Swan competition evidence, restricted prompts, private research artifacts, credentials, or unrelated client/project data.

## Documentation map

1. [Project brief](docs/00-project-brief.md)
2. [WebMCP Challenge requirements](docs/01-webmcp-challenge-requirements.md)
3. [Product hypothesis](docs/02-product-hypothesis.md)
4. [Source strategy](docs/03-source-strategy.md)
5. [WebMCP tool design](docs/04-webmcp-tool-design.md)
6. [Security boundaries](docs/05-security-boundaries.md)
7. [Technical Gate and Challenge MVP success criteria](docs/06-mvp-success-criteria.md)
8. [Demo plan](docs/07-demo-plan.md)
9. [Build backlog](docs/08-build-backlog.md)
10. [Decision log](docs/09-decision-log.md)
11. [Technical Gate evidence](docs/10-technical-gate-evidence.md)
12. [Technical Gate closeout](docs/11-technical-gate-closeout.md)
13. [Phase 2A deployment validation](docs/12-phase-2a-deployment-validation.md)
14. [Phase 2A closeout](docs/13-phase-2a-closeout.md)
15. [Phase 2B scope and acceptance](docs/14-phase-2b-shared-evidence-mission.md)

## Current next step

> Complete independent review of the Phase 2B draft pull request before any human acceptance or merge.
