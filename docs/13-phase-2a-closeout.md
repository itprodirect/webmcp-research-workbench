# Phase 2A Closeout

## Decision record

- **Project:** WebMCP Research Workbench
- **Phase:** Phase 2A — Inspect + Curate Vertical Slice
- **Decision:** HUMAN ACCEPTED / PASS
- **Acceptance date:** 2026-08-27
- **Pre-Phase-2A canonical main:** `5294af705b882977bd85f4328ae688be8983262d`
- **Validated application commit:** `96b33d5dc42c2c7955ee280ba6e930aae802fae6`
- **Deployment evidence head before closeout:** `dced1e3c0ea4114ab6739b1e52e441f197076b3a`
- **Deployment evidence:** `docs/12-phase-2a-deployment-validation.md`
- **Production alias:** <https://webmcp-research-workbench.vercel.app/>
- **Independent discriminator:** READY_TO_ACCEPT
- **Phase 2A discriminator:** PASS
- **BLOCKER:** None
- **MATERIAL:** None
- **MINOR:** Whitespace-sensitive architecture-test assertion — deferred

## Accepted PASS basis

Phase 2A demonstrated:

- public production human search against real OpenAlex data;
- human source-detail inspection using normalized source identity;
- explicit human addition and removal of a source from an in-memory research packet;
- duplicate packet-membership prevention;
- exactly two WebMCP application tools: `search_sources` and `get_source_details`;
- direct composition of a normalized ID returned by `search_sources` into `get_source_details`;
- matching normalized source identity and core provenance across the human and agent paths;
- one shared server/domain source-details implementation used by both paths;
- structured WebMCP operation without human-UI actuation or DOM scraping;
- `readOnlyHint: true` and `untrustedContentHint: true` on both tools;
- human-only packet mutation;
- explicit unknown/null metadata;
- explicit invalid-ID, unsupported-provider, missing-source, and provider-failure semantics;
- safe provider-content rendering and external-link handling;
- an OpenAlex-only provider boundary; and
- no unauthorized infrastructure or Phase 2B expansion.

OpenAlex metadata remains untrusted evidence and provenance. It is not proof that a claim is true and does not constitute a truth or credibility assessment.

## Production evidence

- **Application SHA deployed:** `96b33d5dc42c2c7955ee280ba6e930aae802fae6`
- **Deployment ID:** `dpl_ApkQMQ8podfgCcfnJDqE7q9YuztM`
- **Deployment-specific URL:** <https://webmcp-research-workbench-10mcdac0j.vercel.app/>
- **Production alias:** <https://webmcp-research-workbench.vercel.app/>

The production alias was public and returned HTTP 200. The immutable deployment-specific URL redirected to Vercel SSO. The Codex In-app Browser supplied the deployed WebMCP evidence; its browser version and user agent were not exposed. These are recorded limitations, not Phase 2A failures.

## Independent discriminator

The independent Claude Code discriminator reported:

```text
READY_TO_ACCEPT
Phase 2A: PASS
BLOCKER: None
MATERIAL: None
```

The sole MINOR finding was that `test/details-architecture.test.ts` contains a whitespace-sensitive structural assertion.

**Disposition:** Deferred; non-gating. The test was not changed during closeout.

## Phase boundary

Phase 2A acceptance and merge do not authorize Phase 2B implementation. Provider expansion, new filters, the Official WebMCP Sources registry, a GitHub adapter, or any other Challenge MVP expansion requires a separate scope decision and explicit human authorization.

Phase 2A closeout ends after PR #2 merges and the canonical post-Phase-2A `main` SHA is captured.
