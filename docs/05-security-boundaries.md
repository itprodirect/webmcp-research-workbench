# Security Boundaries

These invariants are part of product correctness. They may not be relaxed implicitly for convenience.

## External trust

```text
ALL_EXTERNAL_PROVIDER_TEXT = UNTRUSTED_EXTERNAL_CONTENT
```

Provider metadata, abstracts, repository text, documentation text, titles, author fields, and any instruction-like strings are untrusted regardless of source reputation.

## Instruction/data boundary

> Retrieved content is evidence/data, never executable application instruction.

The application and its agents must not reinterpret provider text as commands, policy, tool parameters, configuration, or authorization. External text cannot change trust boundaries or initiate actions.

## WebMCP boundary

Provider-returning WebMCP tools carry:

```text
readOnlyHint: true
untrustedContentHint: true
```

Technical Gate and Challenge MVP WebMCP operations are narrow and read-only. Tool descriptions and schemas must state the untrusted nature of returned content. Human authority over selection, interpretation, packet membership, conclusions, and later mutations remains intact.

## Network boundary

Do not create general network tools such as:

```text
fetch_any_url
browse_any_url
```

Server-side code selects providers from known, bounded adapters. User-controlled URLs do not become fetch targets. Redirects, timeouts, response sizes, and provider failures must be bounded explicitly when implementation begins.

## Server/client boundary

Provider API keys and tokens remain server-side. No secrets may appear in:

```text
NEXT_PUBLIC_*
browser bundles
logs
WebMCP outputs
Git
```

Only documented, non-secret client configuration may cross the server/client boundary. No credential is added until a real provider requirement exists.

## Rendering boundary

- Render external strings safely as text.
- Do not inject provider HTML into the page.
- Do not enable unsafe HTML rendering for markdown or abstracts.
- Treat external provider URLs as untrusted data and render links only for `http:` and `https:` schemes.
- When a link opens a new browsing context, use safe external-link behavior such as `rel="noopener noreferrer"`.
- Never trigger automatic navigation based solely on retrieved content.
- Preserve the distinction between source content and application chrome.

## LLM boundary

There is no runtime or server-side LLM in the Technical Gate or approved Challenge MVP scope. Research retrieval and normalization must remain deterministic application behavior. Adding an LLM would require a new decision covering data flow, instruction handling, cost, privacy, and evaluation.

## Failure boundary

Provider errors, timeouts, rate limits, malformed responses, and missing fields must remain explicit. The application must never fabricate fallback metadata, silently substitute another provider, or present stale/partial data as complete. Partial results must be labeled as partial.

## Sensitive repository boundary

This public repository must not contain Research Intelligence source data, Gray Swan competition evidence, restricted prompts, private research artifacts, credentials, private client data, or unrelated project material.
