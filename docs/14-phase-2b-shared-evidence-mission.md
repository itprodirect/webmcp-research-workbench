# Phase 2B — Shared Evidence Mission

## Authorization and status

- **Authorization:** HUMAN-AUTHORIZED bounded implementation pass
- **Canonical starting branch:** `main`
- **Canonical starting SHA:** `b310573f81f4e74806c0ba639d31a7c9a1906d50`
- **Implementation branch:** `codex/phase-2b-shared-evidence-mission`
- **Starting condition:** Phase 2A HUMAN ACCEPTED / PASS / MERGED
- **Review stop:** pushed draft pull request; do not merge

This decision explicitly supersedes the temporary Phase 2A restrictions identified in `docs/09-decision-log.md`. It does not rewrite the historical gates or authorize broader Challenge MVP or Phase 3 work.

## Objective

Create one visible shared research workspace in which a human defines the mission and retains authority over evidence membership and conclusions, while an agent uses explicit WebMCP operations to accelerate OpenAlex discovery, stage candidates, and author a bounded source-linked draft.

The collaboration thesis is:

> The agent accelerates discovery and synthesis. The human controls evidence membership and conclusions.

## Authorized workflow

1. The human sets a required research mission, optional context/audience, and an accepted-evidence maximum from 1 through 5 (default 3).
2. The agent reads compact workspace context through `get_research_workspace`.
3. Human and agent search real OpenAlex Works data using keyword search or optional OpenAlex-hosted semantic search.
4. Human and agent inspect normalized OpenAlex source details, including a bounded reconstructed abstract, citation count, open-access metadata, and primary topic where provided.
5. The agent may stage 1–3 canonical OpenAlex IDs per `propose_evidence` call. The application resolves every ID through the shared source-details path before one all-or-nothing workspace mutation.
6. The human alone accepts or rejects each proposal. Accepted evidence retains canonical provider provenance.
7. The agent may place or replace a bounded brief through `draft_evidence_brief`, but every citation in every finding must already belong to the human-accepted evidence set. One invalid citation rejects the entire write.
8. The human may edit, review, and approve the brief. Any later agent replacement resets human review and approval.

## Exact WebMCP tool boundary

Phase 2B registers exactly these five application tools:

1. `get_research_workspace` — read-only compact mission/workspace context.
2. `search_sources` — read-only OpenAlex keyword or OpenAlex-hosted semantic search.
3. `get_source_details` — read-only normalized OpenAlex details for `^openalex:W[0-9]+$`.
4. `propose_evidence` — state-changing proposal staging only; never evidence acceptance.
5. `draft_evidence_brief` — state-changing bounded draft placement using accepted citations only.

All five return or may contain untrusted provider, human, or agent-authored content and therefore carry `untrustedContentHint: true`. The first three carry `readOnlyHint: true`; the final two carry `readOnlyHint: false`.

## Shared state boundary

The minimum workspace contains:

- one schema/version number;
- the human-owned mission;
- pending agent proposals resolved to compact normalized OpenAlex evidence;
- human-accepted evidence;
- one agent-originated evidence brief and human review/approval state; and
- at most 20 compact activity events.

The human UI and WebMCP adapter import the same client workspace-store module. State is persisted only in bounded, schema-validated, versioned browser `localStorage`. Malformed JSON, unsupported schema versions, invalid content, or storage failures fall back safely. Reset removes persisted workspace state deterministically. No database or authentication is introduced.

## Trust invariants

- Provider titles, abstracts, metadata, and URLs are untrusted external data, never instructions.
- Provider content is rendered only through ordinary React text nodes; no provider HTML or Markdown rendering is authorized.
- An instruction-like title or abstract cannot mutate workspace state, change a mission, accept evidence, configure tools, or bypass brief-citation validation.
- Citation count is bibliometric metadata only, never a truth or credibility score.
- The reconstructed abstract is provider-supplied abstract metadata, not verified full text.
- The agent supplies proposal IDs and optional rationale, never authoritative provider metadata.
- Proposal resolution and brief citation checks are enforced below the UI in shared domain/store logic.
- Autonomous publishing, export, submission, and conclusions remain prohibited.

## Scope boundaries

Phase 2B does not add:

- a provider beyond OpenAlex;
- custom embeddings, a vector database, RAG, or a runtime model;
- a database, authentication, standalone MCP server, or generalized state backend;
- PDF downloads, full-text ingestion, reference-graph traversal, crawling, scraping, or arbitrary-URL fetching;
- a credibility/truth score, provider selection, complex sorting, or a broad filter matrix;
- DOM automation, UI scraping, or DOM actuation for agent operations;
- a publish/export WebMCP tool; or
- Phase 3 license, submission, or demo-material rewrites.

## Acceptance criteria

Phase 2B is ready for independent review only when:

- the mission form, proposal review, accepted evidence, brief review/approval, and activity ledger are visible and accessible;
- refresh persistence and deterministic reset work safely;
- OpenAlex keyword behavior remains usable and semantic mode uses `search.semantic`;
- authorized source enrichment is normalized with explicit null/unknown values;
- proposals are bounded, canonical, resolved, duplicate-safe, capacity-safe, and atomic;
- evidence acceptance remains a human action;
- a brief cannot be created or retained with citations outside the accepted set;
- exactly five correctly annotated application tools are registered;
- provider instruction-like text remains inert;
- deterministic tests cover the required mission, workspace, proposal, brief, OpenAlex, search, WebMCP, security, and architecture cases;
- `npm test`, `npm run lint`, and `npm run build` pass without weakening behavior;
- a real public Vercel deployment and the available supported WebMCP client are validated honestly; and
- implementation/deployment evidence is committed on the Phase 2B branch, pushed, and presented in a draft pull request that remains unmerged.
