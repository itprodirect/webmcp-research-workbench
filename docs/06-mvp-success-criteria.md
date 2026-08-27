# Technical Gate and Challenge MVP Success Criteria

## Evaluation boundary

The Technical Gate asks whether WebMCP provides a reliable explicit machine interface to the same research capability without requiring the browser agent to scrape, actuate, or infer the rendered UI. It evaluates mechanical and architectural feasibility.

The broader question—whether the result creates a materially better human-agent research experience than the normal website alone—belongs to Challenge MVP and product evaluation, not the Technical Gate.

## Technical gate decision scale

### PASS

All of the following are demonstrated in the deployed production-compatible environment:

- The deployed site is reachable.
- `search_sources` is registered.
- A compatible browser agent discovers the typed `search_sources` tool reliably.
- The agent invokes the tool reliably.
- The tool returns real OpenAlex results.
- The agent receives the shared compact normalized source model.
- Retrieval succeeds without DOM scraping, UI actuation, or inference about how the rendered interface works.
- Observable UI and WebMCP outputs agree, including matching normalized source IDs.
- Structural code inspection confirms that the UI and WebMCP paths terminate at the same server-side search/domain implementation, with no separate provider or search business logic.
- `readOnlyHint: true` and `untrustedContentHint: true` are present.
- No secret is exposed to the browser, tool output, logs, or repository.
- Provider failures and unknown metadata remain explicit.

The gate result must be recorded with reproducible observations, environment details, and any limitations.

### PARTIAL

Core mechanics work at least once, but one or more required properties are not yet reliable or proven—for example discovery is intermittent, output size limits usefulness, production and local behavior differ, matching UI/tool IDs are not demonstrated, the shared implementation is not structurally verified, or security annotations cannot be verified. A PARTIAL result does not authorize Challenge MVP work. Resolve the bounded gate defect or make the time-boxed pivot/stop decision.

### FAIL

Any of the following is sufficient for failure:

- Reliable WebMCP discovery fails.
- Tool invocation repeatedly fails.
- The agent does not receive the shared normalized source model.
- The agent must scrape the DOM, actuate the UI, or infer how the rendered interface works.
- Code inspection finds separate UI and WebMCP provider/search business logic or cannot verify convergence on one shared implementation.
- The tool is merely hard-coded rather than using real provider data.
- A trust, rendering, secret, or mutation boundary fails.

> If the deployed one-provider experiment cannot provide reliable typed discovery and invocation of the shared normalized search capability without rendered-UI dependence, stop or deliberately pivot rather than expanding adapters/features.

## Challenge MVP PASS

Only after a recorded Technical Gate PASS, the Challenge MVP passes when it demonstrates:

- useful source filters;
- multiple real, approved source providers;
- preserved provenance, dates, and source classes;
- useful source-detail views;
- a human-controlled in-memory research packet;
- working `search_sources` and `get_source_details` tools;
- production browser-agent validation;
- a coherent challenge demo under three minutes.

## Challenge MVP PARTIAL

The core human and agent workflow works, but one or more approved Challenge MVP capabilities are unreliable, inconsistent between interfaces, insufficiently validated in production, or too unclear for the demo. PARTIAL does not mean submission-ready.

## Challenge MVP FAIL

The shared evidence model, human authority, provenance, production WebMCP path, security boundaries, or coherent demonstration cannot be maintained. Do not disguise missing real capabilities with hard-coded results or expanded scope.
