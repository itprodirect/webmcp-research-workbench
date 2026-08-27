# Decision Log

This is a living record. “Decided” means the current V0 baseline; changes require an explicit superseding decision. “Provisional” items require confirmation before they affect implementation. “Open/gating” items require evidence.

| ID | Question | Status | Current recommendation | Reason | What could change it | Resolution timing |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | Repository placement | Decided | Use a separate repository. | Keeps challenge scope and public history isolated. | Explicit project-governance change. | Baseline; revisit only if ownership changes. |
| D-002 | V0 application platform | Decided | Use Next.js and Vercel after planning approval. | Fits a browser-first deployed challenge artifact. | Technical incompatibility found during setup or gate. | Phase 1. |
| D-003 | Browser-agent interface order | Decided | Prove WebMCP before considering standalone MCP. | WebMCP is the challenge-facing interface. | A later validated use case outside the browser. | After MVP. |
| D-004 | Primary user interface | Decided | Keep the human-readable UI primary. | Humans retain evidence and interpretation authority. | User research disproves the workflow. | After gate/MVP observation. |
| D-005 | UI and WebMCP logic | Decided | Reuse the same server-side domain operations. | Prevents divergence and makes matching evidence testable. | No planned exception; architecture review required. | Enforce in Phase 1. |
| D-006 | Trust of external source text | Decided | Treat all external source text as untrusted data. | Source content can contain hostile or instruction-like text. | No relaxation; only stronger controls. | Enforce always. |
| D-007 | Credibility presentation | Decided | Expose observable attributes; do not compute a credibility score. | A numeric score would imply unsupported judgment. | Validated, explainable methodology plus explicit approval. | Not V0. |
| D-008 | Initial tool mutation level | Decided | Use read-only tools first. | Narrows risk and preserves human authority. | Separate approved mutation design and threat review. | After MVP. |
| D-009 | Source acquisition style | Decided | Prefer structured providers over scraping. | Improves provenance, schemas, and bounded network behavior. | A specific approved source lacks a structured interface. | Provider-by-provider after gate. |
| D-010 | Expansion gate | Decided | Gate the project on `search_sources`. | Tests WebMCP leverage with minimum scope. | Only an explicit baseline revision before implementation. | Phase 1 gate. |
| D-011 | Sensitive evidence boundary | Decided | Do not import Research Intelligence or Gray Swan evidence. | The repository is public and unrelated evidence is out of scope. | No V0 exception. | Enforce always. |
| D-012 | V0 provider set | Provisional | After the gate, consider OpenAlex, GitHub, and a bounded Official WebMCP Sources registry. | Covers research, repositories, and first-party WebMCP material. | Gate results, provider quality, rate limits, or demo needs. | Gate decision / Phase 2 planning. |
| D-013 | WebMCP tool count | Provisional | Target two MVP tools: `search_sources` and `get_source_details`. | Keeps operations narrow and demonstrable. | Gate output limits or validated workflow needs. | After gate. |
| D-014 | Packet persistence | Provisional | Keep packets in memory in V0. | Avoids database, auth, and mutation complexity. | Demonstrated need for persistence plus approved data design. | After MVP validation. |
| D-015 | Runtime LLM | Provisional | Do not use a runtime LLM in V0. | The hypothesis concerns structured retrieval, not generated analysis. | A specific evaluated use case with privacy and cost review. | Post-MVP. |
| D-016 | Compare tool | Provisional | Defer `compare_sources`. | Comparison semantics could imply unsupported judgment. | User evidence supports a narrow observable-attribute comparison. | After MVP observation. |
| D-017 | Future standalone MCP | Provisional | Defer standalone MCP. | It is not required for the WebMCP gate or V0. | Validated non-browser demand and explicit architecture approval. | Post-challenge. |
| D-018 | Open-source license choice | Provisional | Select a license deliberately before submission; add none in the baseline commit. | Challenge requires a license but the choice is not approved. | Owner approval of a specific license. | Before public submission. |
| D-019 | Production ChatGPT/Chrome WebMCP reliability | Open/gating | Test discovery and invocation in a supported deployed browser. | Local registration does not prove production reliability. | Repeated production evidence. | Phase 1 gate. |
| D-020 | WebMCP output-size usefulness | Open/gating | Keep records compact and measure whether output remains useful. | Browser/tool limits may constrain evidence detail. | Gate measurements and agent behavior. | Phase 1 gate. |
| D-021 | Official-doc registry usefulness | Open/gating | Validate a bounded registry before adding it. | First-party documentation may improve authority but creates maintenance work. | Coverage, freshness, and demo evidence. | Phase 2 planning. |
| D-022 | GitHub adapter value | Open/gating | Add only if repository evidence materially improves the MVP. | Provider count is not itself value. | Research tasks showing distinct useful results. | Phase 2 planning. |
| D-023 | Cache policy | Open/gating | Make no cache architecture decision until provider behavior is measured. | Freshness and rate limits must be balanced with real evidence. | Gate latency, quotas, and freshness requirements. | After gate measurements. |
| D-024 | Packet WebMCP exposure | Open/gating | Keep packet membership human-controlled; do not expose packet mutation yet. | Exposure changes state and trust boundaries. | A reviewed read/write model with clear human confirmation. | After MVP workflow validation. |
