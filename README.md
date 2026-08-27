# WebMCP Research Workbench

> A provenance-aware research workspace for humans and browser agents using WebMCP.

## Status

- Planning Baseline V0
- Disposition: **GO WITH CONDITIONS**
- Technical Gate not yet executed

## Objective

This project will test whether explicit, structured WebMCP research operations materially improve human-agent research workflows. It is intentionally non-autonomous: humans retain authority over source selection, interpretation, research-packet membership, conclusions, and any later state-changing actions.

## Current scope

- Next.js and Vercel are planned for a later implementation phase.
- OpenAlex is the only provider approved for the technical gate.
- Results will expose provenance, freshness, and source classes through a human-readable UI.
- Browser agents will initially receive narrow, read-only WebMCP tools backed by the same domain logic as the UI.
- No runtime LLM is planned initially.

The Challenge MVP is not authorized. The one-tool WebMCP Technical Gate must pass before the project expands.

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

## Current next step

> Implement the one-tool `search_sources` Technical Gate only after this Planning Baseline V0 is reviewed and accepted.
