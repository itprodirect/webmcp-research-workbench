# Phase 1 Technical Gate Closeout

## Decision record

- **Project:** WebMCP Research Workbench
- **Phase:** Phase 1 — Technical Gate
- **Decision:** HUMAN ACCEPTED / PASS
- **Acceptance date:** 2026-08-27
- **Frozen Planning Baseline:** `d0946b778d0e13cad70ab65ddec0fb4c8a11af91`
- **Accepted Technical Gate evidence head:** `ebcb8cf02b9b1496b8993cce66c227329827f199`
- **Evidence document:** `docs/10-technical-gate-evidence.md`
- **Production URL:** <https://webmcp-research-workbench.vercel.app/>
- **Independent discriminator:** READY_TO_ACCEPT
- **BLOCKER:** None
- **MATERIAL:** None
- **MINOR:** Stale PR #1 description

## Accepted PASS basis

The human accepted PASS after the Technical Gate demonstrated:

- a reachable deployed site;
- exactly one typed `search_sources` tool;
- real OpenAlex data and compact normalized source records;
- agreement between human UI and WebMCP results;
- one shared server-side search/domain implementation for both paths;
- deployed browser-agent discovery and invocation without DOM scraping or UI actuation;
- required `readOnlyHint: true` and `untrustedContentHint: true` annotations;
- preserved untrusted-content and security boundaries;
- no secret exposure; and
- explicit unknown metadata and provider failures.

## Adjudicated non-gating limitations

- No separate preview deployment was created.
- The immutable Vercel deployment URL is protected by SSO while the public production alias works.
- An automatic GitHub-to-Vercel deployment connection was not established.
- The connected ordinary Chrome 151 profile did not expose `document.modelContext`.
- The Codex In-app Browser supplied the compatible deployed browser-agent evidence but did not expose its browser version or user agent.

These limitations were adjudicated as non-gating and are not failures of the frozen Technical Gate PASS requirements.

## Phase boundary

Technical Gate PASS authorizes consideration of Phase 2 but does not itself start or implement Challenge MVP work. Challenge MVP implementation requires a separate explicit human authorization.

The canonical post-merge `main` SHA is established by Git history and the final closeout execution report; it is intentionally not predicted in this document.
