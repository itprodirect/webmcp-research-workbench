# V0 Security Posture

## Scope

This document summarizes the public security posture of the frozen Three in the
Loop hackathon V0 at commit
`b9a05731ae26b670413d62a322362e707d844f40`. It describes implemented boundaries,
pre-submission review, and planned assurance work. It is not a certification,
guarantee, formal penetration test, or professional security audit.

## Trust model

The V0 architecture reduces the authority available through WebMCP and keeps
external research content inside explicit data and decision boundaries:

- OpenAlex titles, abstracts, metadata, and URLs are treated as untrusted data,
  never as application instructions or automatic credibility judgments.
- The website exposes a deliberately bounded five-tool WebMCP surface for reading
  workspace state, searching, inspecting sources, proposing evidence, and drafting
  an Evidence Brief.
- Read-only and state-changing operations declare their WebMCP annotations
  accurately. These annotations communicate metadata to clients; they are not, by
  themselves, an enforcement mechanism.
- The application does not expose arbitrary URL fetching. Server-side provider
  selection is fixed to OpenAlex, and provider identities are normalized before
  they enter the research workflow.
- Human authority operations—including evidence acceptance or rejection, brief
  editing and review, and final approval—remain outside the WebMCP tool surface.
  This is a tool-authority boundary, not proof that a physical human performed
  every browser action.
- Agent drafts may cite only evidence already accepted through the human workflow.
- The website contains no runtime or server-side LLM. Research retrieval and
  normalization are deterministic application behavior.
- An agent draft remains review-required. It does not automatically publish a
  conclusion or create an external publication side effect.

## Pre-submission review

Before submission, the project reviewed current Chrome and WebMCP security
guidance. A specialized adversarial/security-oriented model performed blind threat
analysis; Codex independently verified the resulting claims against the frozen
repository; and Claude Code performed an independent challenge review. The
evidence and reviewer disagreements were then reconciled into a human-reviewed
threat-model baseline.

These model-assisted reviews do not constitute a formal penetration test or an
independent professional security audit. No Critical or High-severity issue was
established in the reconciled V0 review, and nothing identified required breaking
the frozen submission baseline. Lower-severity hardening and assurance work
remains.

## Post-submission evaluation roadmap

After the hackathon submission, planned work includes:

- deterministic evaluations of state and workflow invariants;
- WebMCP registration and cancellation lifecycle testing;
- response and serialized-output measurement followed by deliberate hardening;
- model-facing indirect prompt-injection evaluations using realistic contexts;
- browser-agent evaluations of human-authority boundaries; and
- adversarial retesting after approved hardening changes.

This roadmap is intentionally high level. Detailed engineering evidence remains
in a separate local security workstream for post-submission use.

## Security claim

The V0 design reduces agent authority and preserves explicit human decision gates.
It should not be described as prompt-injection-proof or universally secure. WebMCP
security remains a shared responsibility across the website, browser/client,
agent/model, and human operator.

## Submission-safe summary

### A. Devpost version

Three in the Loop treats retrieved OpenAlex content as untrusted data and exposes
only five bounded WebMCP tools for reading, searching, inspecting, proposing
evidence, and drafting. Evidence acceptance or rejection, brief review, and final
approval remain outside the WebMCP tool surface, and drafts can cite only
human-accepted evidence. Before submission, the architecture and repository were
reviewed through adversarial model analysis, independent repository verification,
and a challenge review; reconciliation established no Critical or High-severity
issue. Lower-severity hardening and model/browser evaluations remain planned after
submission, so V0 is not presented as certified, prompt-injection-proof, or
universally secure.

### B. Video version

Because retrieved web content can be untrusted, the agent can research, propose
evidence, and draft while evidence acceptance and final approval stay outside the
WebMCP tool surface. V0 preserves those explicit human decision gates without
claiming universal security.
