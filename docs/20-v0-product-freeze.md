# WebMCP Research Workbench — V0 Product Freeze

## Identity

- **Product:** WebMCP Research Workbench
- **Date:** 2026-08-29
- **Status:** `WEBMCP RESEARCH WORKBENCH V0 — PRODUCT FROZEN FOR SUBMISSION`
- **Canonical merge SHA:** `7b3b500529c08c2c35d51a50228d088d802cdd83`
- **Accepted pull request:** [PR #5 — Final polish: unified Workbench HUD and demo workflow](https://github.com/itprodirect/webmcp-research-workbench/pull/5)
- **Public production:** <https://webmcp-research-workbench.vercel.app/>
- **Production deployment:** `dpl_4Yw24D4YGKYGu7xJX2JhkCgFG7tA` — Ready

## Accepted release lineage

- `23ecf50e32eb3aee0a32611c7922a66e96b90d53` — `feat: add unified workbench HUD`
- `1608b998f229455337e50290fb2efc72ce34be94` — `fix: clarify demo workflow completion`
- `7b3b500529c08c2c35d51a50228d088d802cdd83` — merge commit for PR #5

## Validation

- `npm test` — 74/74 PASS
- `npm run lint` — PASS
- `npm run build` — PASS
- independent Claude HUD review — ACCEPT
- independent Claude demo-usability review — ACCEPT
- production smoke validation — PASS

The canonical Git history and PR #5 establish the accepted lineage and release
validation. During this documentation checkpoint, the three local validators passed
again at the canonical merge, Vercel reported the public alias on a Ready production
deployment, and the public URL returned HTTP 200 with the current Research Cycle UI.

## V0 product state

- A unified Workbench HUD keeps Research Cycle status and live WebMCP activity
  persistently available.
- Research and Synthesize guidance is conversational-first; **Copy example
  instruction** remains an optional onboarding/fallback action.
- Exactly five WebMCP tools expose workspace reading, OpenAlex search, source-detail
  inspection, evidence proposal, and accepted-evidence-only brief drafting.
- Human review progresses through **Save human edits → Mark reviewed → Approve
  brief**.
- Approval immediately exposes the approved Markdown for download or copy.
- The human owns the mission, evidence membership, edits, review, approval, and
  destructive reset. The agent researches, inspects, proposes, and drafts within the
  declared tool boundary. WebMCP supplies structured application capabilities
  without DOM scraping or imitation of human clicks.
- The bounded workspace and persistence are browser-local; no database or
  authentication is present.

## Freeze rule

**V0 application code is frozen for submission.**

Future dogfood findings must first be classified as one of:

- demo blocker;
- demo/script insight;
- submission/repository insight;
- post-submission backlog; or
- expected behavior.

Only a genuine demo/release blocker authorizes reopening application code before
submission.

The final judge-facing README, final demo plan and video, and Devpost submission are
not complete or claimed by this record. They remain pending while additional
dogfood rehearsals continue.
