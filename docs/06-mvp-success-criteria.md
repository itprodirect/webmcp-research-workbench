# MVP Success Criteria

## Technical gate decision scale

### PASS

All of the following are demonstrated in the deployed production-compatible environment:

- The deployed site is reachable.
- `search_sources` is registered.
- A compatible browser agent discovers the tool reliably.
- The agent invokes the tool reliably.
- The tool returns real OpenAlex results.
- Results are normalized into the compact source model.
- The same normalized source IDs are visible through the human UI.
- The UI and WebMCP paths call the same server-side domain operation.
- `readOnlyHint: true` and `untrustedContentHint: true` are present.
- No secret is exposed to the browser, tool output, logs, or repository.
- Provider failures and unknown metadata remain explicit.

The gate result must be recorded with reproducible observations, environment details, and any limitations.

### PARTIAL

Core mechanics work at least once, but one or more required properties are not yet reliable or proven—for example discovery is intermittent, output size limits usefulness, production and local behavior differ, matching UI/tool IDs are not demonstrated, or security annotations cannot be verified. A partial result does not authorize MVP expansion. Resolve or explicitly re-scope the gate and test again.

### FAIL

Any of the following is sufficient for failure:

- Reliable WebMCP discovery fails.
- Tool invocation repeatedly fails.
- Output is unusable for the research task.
- The agent still must infer or scrape the UI.
- WebMCP and UI paths use separate business logic.
- The tool is merely hard-coded rather than using real provider data.
- A trust, rendering, secret, or mutation boundary fails.
- The result does not demonstrate meaningful value over UI inference.

> If the deployed one-provider experiment does not demonstrate meaningful WebMCP leverage, stop this concept rather than expanding adapters/features.

## Eventual MVP PASS

Only after a passing gate, the MVP passes when it demonstrates:

- useful source filters;
- multiple real, approved source providers;
- preserved provenance, dates, and source classes;
- useful source-detail views;
- a human-controlled in-memory research packet;
- working `search_sources` and `get_source_details` tools;
- production browser-agent validation;
- a coherent challenge demo under three minutes.

## Eventual MVP PARTIAL

The core human and agent workflow works, but one or more approved MVP capabilities is unreliable, inconsistent between interfaces, insufficiently validated in production, or too unclear for the demo. Partial does not mean submission-ready.

## Eventual MVP FAIL

The shared evidence model, human authority, provenance, production WebMCP path, security boundaries, or coherent demonstration cannot be maintained. Do not disguise missing real capabilities with hard-coded results or expanded scope.
