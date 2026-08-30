# Decision Log

This is a living record. “Decided” means the current Planning Baseline V0; changes require an explicit superseding decision. “Provisional” items require confirmation before they affect implementation. “Open/gating” items require evidence.

| ID | Question | Status | Current recommendation | Reason | What could change it | Resolution timing |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | Repository placement | Decided | Use a separate repository. | Keeps challenge scope and public history isolated. | Explicit project-governance change. | Baseline; revisit only if ownership changes. |
| D-002 | Application platform | Decided | Use Next.js and Vercel for the Technical Gate and, after PASS, the Challenge MVP. | Fits a browser-first deployed challenge artifact. | Technical incompatibility found during setup or the Technical Gate. | Phase 1. |
| D-003 | Browser-agent interface order | Decided | Prove WebMCP before considering standalone MCP. | WebMCP is the challenge-facing interface. | A later validated use case outside the browser. | After Challenge MVP. |
| D-004 | Primary user interface | Decided | Keep the human-readable UI primary. | Humans retain evidence and interpretation authority. | Product evidence disproves the workflow. | After Technical Gate / Challenge MVP observation. |
| D-005 | UI and WebMCP logic | Decided | Reuse one server-side search/domain implementation and verify convergence by code inspection as well as matching normalized IDs. | Prevents divergence; matching provider IDs alone cannot prove shared logic. | No planned exception; architecture review required. | Enforce in Phase 1. |
| D-006 | Trust of external source text | Decided | Treat all external source text as untrusted data. | Source content can contain hostile or instruction-like text. | No relaxation; only stronger controls. | Enforce always. |
| D-007 | Credibility presentation | Decided | Expose observable attributes; do not compute a credibility score. | A numeric score would imply unsupported judgment. | Validated, explainable methodology plus explicit approval. | Not in the Technical Gate or Challenge MVP. |
| D-008 | Initial tool mutation level | Decided | Use read-only tools first. | Narrows risk and preserves human authority. | Separate approved mutation design and threat review. | After Challenge MVP. |
| D-009 | Source acquisition style | Decided | Prefer structured providers over scraping. | Improves provenance, schemas, and bounded network behavior. | A specific approved source lacks a structured interface. | Provider-by-provider after Technical Gate PASS. |
| D-010 | Expansion gate | Decided | Gate the project on `search_sources`. | Tests reliable typed discovery and invocation of the shared research model without rendered-UI dependence. | Only an explicit Planning Baseline V0 revision before implementation. | Phase 1 Technical Gate. |
| D-011 | Sensitive evidence boundary | Decided | Do not import Research Intelligence or Gray Swan evidence. | The repository is public and unrelated evidence is out of scope. | No Technical Gate or Challenge MVP exception. | Enforce always. |
| D-012 | Challenge MVP provider set | Provisional | After a Technical Gate PASS, consider OpenAlex, GitHub, and a bounded Official WebMCP Sources registry. | Covers research, repositories, and first-party WebMCP material. | Technical Gate results, provider quality, rate limits, or demo needs. | Technical Gate decision / Phase 2 planning. |
| D-013 | Challenge MVP WebMCP tool count | Provisional | Target two tools: `search_sources` and `get_source_details`. | Keeps operations narrow and demonstrable. | Technical Gate output limits or validated workflow needs. | After Technical Gate PASS. |
| D-014 | Packet persistence | Provisional | Keep packets in memory in the Challenge MVP. | Avoids database, auth, and mutation complexity. | Demonstrated need for persistence plus approved data design. | After Challenge MVP validation. |
| D-015 | Runtime LLM | Provisional | Do not use a runtime LLM in the Technical Gate or Challenge MVP. | The hypothesis concerns structured retrieval, not generated analysis. | A specific evaluated use case with privacy and cost review. | Post-Challenge MVP. |
| D-016 | Compare tool | Provisional | Defer `compare_sources`. | Comparison semantics could imply unsupported judgment. | User evidence supports a narrow observable-attribute comparison. | After Challenge MVP observation. |
| D-017 | Future standalone MCP | Provisional | Defer standalone MCP. | It is not required for the Technical Gate or Challenge MVP. | Validated non-browser demand and explicit architecture approval. | Post-challenge. |
| D-018 | Open-source license choice | Provisional | Select a license deliberately before submission; add none in Planning Baseline V0. | Challenge requires a license but the choice is not approved. | Owner approval of a specific license. | Before public submission. |
| D-019 | Production ChatGPT/Chrome WebMCP reliability | Open/gating | Test discovery and invocation in a supported deployed browser. | Local registration does not prove production reliability. | Repeated production evidence. | Technical Gate. |
| D-020 | WebMCP output-size usefulness | Open/gating | Keep records compact and measure whether output remains useful. | Browser/tool limits may constrain evidence detail. | Technical Gate measurements and agent behavior. | Technical Gate. |
| D-021 | Official-doc registry usefulness | Open/gating | Validate a bounded registry before adding it. | First-party documentation may improve authority but creates maintenance work. | Coverage, freshness, and demo evidence. | Challenge MVP planning. |
| D-022 | GitHub adapter value | Open/gating | Add only if repository evidence materially improves the Challenge MVP. | Provider count is not itself value. | Research tasks showing distinct useful results. | Challenge MVP planning. |
| D-023 | Cache policy | Open/gating | Make no cache architecture decision until provider behavior is measured. | Freshness and rate limits must be balanced with real evidence. | Technical Gate latency, quotas, and freshness requirements. | After Technical Gate measurements. |
| D-024 | Packet WebMCP exposure | Open/gating | Keep packet membership human-controlled; do not expose packet mutation yet. | Exposure changes state and trust boundaries. | A reviewed read/write model with clear human confirmation. | After Challenge MVP workflow validation. |
| D-025 | Challenge schedule and gate time box | Decided | Target Aug 27–28 for the Technical Gate; Aug 28–31 for the smallest approved Challenge MVP after PASS; Sep 1–2 for validation and submission materials; and Sep 3 for a pre-deadline buffer. | The September 3, 1:00 PM Pacific deadline leaves a short window while preserving gate discipline. | An official deadline change or a PARTIAL/FAIL pivot decision. | Apply immediately through submission. |
| D-026 | Phase 2B shared evidence mission | Decided | Implement one versioned client-side workspace shared by the human UI and WebMCP tools for a human mission, agent-staged proposals, human-accepted evidence, an agent-authored draft brief, and a compact activity ledger. | Phase 2A passed and the human explicitly authorized a bounded collaboration workflow that makes evidence membership and conclusion approval visible. | A later explicit human decision after Phase 2B review. | Phase 2B. |
| D-027 | Phase 2B mutation authority | Decided | Permit agent mutations only to stage evidence proposals and place or replace a draft evidence brief. Evidence acceptance/rejection/removal, mission changes, brief editing/review, and brief approval remain human UI actions. | This is the minimum mutation boundary that demonstrates useful collaboration while preserving human authority. | A separate reviewed mutation design and explicit human authorization. | Enforce throughout Phase 2B. |
| D-028 | Phase 2B tool set | Decided | Register exactly five application tools: `get_research_workspace`, `search_sources`, `get_source_details`, `propose_evidence`, and `draft_evidence_brief`. | The set covers shared context, provider retrieval, staged handoff, and bounded drafting without autonomous acceptance or publishing. | Stop for explicit approval before adding any tool. | Phase 2B. |
| D-029 | Phase 2B persistence | Decided | Persist a bounded, schema-versioned workspace in client `localStorage`; reject malformed or unsupported persisted state safely and provide deterministic reset. | Human and agent need the same visible state across refresh without adding a database or authentication. | A later explicit durable-data architecture decision. | Phase 2B. |
| D-030 | OpenAlex semantic search | Decided | Optionally expose `mode: keyword | semantic`, defaulting to keyword; semantic mode uses OpenAlex Works `search.semantic` directly. | Official OpenAlex-hosted semantic search satisfies the bounded need without embeddings, a vector database, a runtime model, or a new provider. | Official OpenAlex behavior or limits change. | Phase 2B. |
| D-031 | Workspace persistence lifetime | Decided | Use browser `sessionStorage`, not `localStorage`: same-tab refresh persists, while a new browser session starts clean. | Repeated Windows ChatGPT Work dogfooding showed cross-session stale state was a demo and product usability blocker. | A later explicit durable-data architecture decision. | Effective for the V0 submission candidate; supersedes D-029's `localStorage` lifetime decision. |
| D-032 | Primary interaction model | Decided | Use voice/chat as the natural human-to-agent delegation channel. Keep the visible Workbench as the human authority surface for mission, evidence membership, editing, review, and approval. Agent-owned stages require an explicit conversational handoff; the webpage does not autonomously wake the external agent. | Dogfooding showed that conversational delegation is natural while visible human decisions preserve the clearest authority boundary. | Validated post-submission interaction evidence and an explicit authority review. | Effective for the V0 demo and submission. |
| D-033 | Handoff activity truthfulness | Decided | Claim agent work is in progress only after real stage-local WebMCP activity is observed. Historical calls do not count toward a new stage; do not use timers, inferred thinking state, or private reasoning indicators. | The page can observe WebMCP invocation telemetry, but it cannot truthfully know that a human spoke to ChatGPT or that the external agent is thinking. | A future explicit, trustworthy agent-presence protocol and security review. | Enforce for V0. |
| D-034 | Primary production URL | Decided | Use <https://research.itprodirect.com/> as the primary judge/demo URL; keep <https://webmcp-research-workbench.vercel.app/> as a supported fallback. | The custom domain gives the product a simpler identity and reduces voice-navigation friction. | A genuine availability or ownership problem with the primary domain. | Effective for final acceptance and submission. |
| D-035 | Canonical final artifact | Decided | Keep approved Markdown as the canonical V0 export; do not add DOCX/PDF generation before submission. | Dogfood showed that generic “create document” wording can cause external-agent scope drift. Explicit runbook wording or direct human download solves that problem without expanding product formats. | Validated post-submission demand and an explicit format/export design. | Enforce through submission. |

## Phase 2B supersession — 2026-08-27

Phase 2B is a new, explicit human authorization. It supersedes only the temporary earlier restrictions that all WebMCP tools were read-only, research-packet mutation was human-only, the application tool count was limited to two, and packet state was ephemeral/in-memory. The historical decisions above remain unchanged as records of the earlier gates.

The superseding boundary is narrow:

- agent state changes are authorized only for staged evidence proposals and draft evidence briefs;
- an agent proposal never accepts evidence;
- human acceptance remains mandatory for membership in the accepted-evidence set;
- every agent-drafted finding may cite only already human-accepted source IDs;
- human review and approval remain mandatory for final conclusions; and
- autonomous publishing, export, submission, or other outward mutation remains prohibited.

All other trust and scope constraints continue, including OpenAlex-only retrieval, untrusted provider content, no runtime LLM, no database/authentication, no arbitrary-URL fetching, no credibility score, no private evidence, and no secrets.

## End-of-day dogfood supersession — 2026-08-30

D-031 explicitly supersedes only the browser-storage lifetime in D-029: the
workspace remains bounded and schema-versioned, but it now uses `sessionStorage`
rather than `localStorage`. Same-tab refresh remains supported, a new browser
session starts clean, legacy `localStorage` is ignored rather than deleted, and the
explicit Reset action remains available.

D-032 through D-035 record the interaction, telemetry, production-domain, and
artifact-format decisions established by the later Windows ChatGPT Work dogfood
cycle. They do not expand agent authority: the human still owns mission definition,
evidence membership, editing, review, approval, export, and destructive reset.
