# Product Hypothesis

## Primary hypothesis

> A provenance-aware research interface becomes materially more useful when humans and browser agents can access the same structured research capabilities through explicit WebMCP tools instead of requiring the agent to infer application behavior from the rendered UI.

This is a falsifiable hypothesis, not a proven product claim.

## Human value

- **Supports:** In task observation, users use visible provenance, freshness, and source classes to make more deliberate evidence selections than they can from an unstructured result list.
- **Weakens:** Users ignore the structured attributes, cannot understand them, or complete the task just as effectively with ordinary links and tabs.
- **Unresolved:** Which attributes and comparison views change real selection decisions without creating unnecessary cognitive load.

## Agent value

- **Supports:** A compatible browser agent reliably discovers and invokes narrow tools and returns useful normalized records without scraping or inferring UI behavior.
- **Weakens:** Discovery or invocation is unreliable, outputs are unusable, or the agent still depends on the rendered UI.
- **Unresolved:** Production WebMCP reliability, output-size constraints, and the narrowest useful schema.

## Human-agent collaboration

- **Supports:** Humans and agents can retrieve and reference the same normalized source IDs while humans retain interpretation and packet control.
- **Weakens:** The two interfaces diverge, source identity is inconsistent, or the agent encourages unreviewed conclusions.
- **Unresolved:** The most useful handoff pattern between agent retrieval and human evidence selection.

## Provenance preservation

- **Supports:** Normalized records retain provider identity, provider record ID, retrieval time, canonical URL, source class, and known dates through search and detail views.
- **Weakens:** Normalization erases versions, invents unknown metadata, or produces destructive duplicate merges.
- **Unresolved:** Cross-provider version relationships and conservative deduplication rules after the gate.

## Security

- **Supports:** All provider text remains untrusted data, tools stay read-only, secrets remain server-side, and failures remain explicit in end-to-end tests.
- **Weakens:** Provider text can alter application behavior, unsafe rendering occurs, a secret leaks, or a state-changing path is introduced implicitly.
- **Unresolved:** Production behavior of compatible agents when tool results contain adversarial or instruction-like external text.

## Challenge and WebMCP leverage

- **Supports:** The demo shows a meaningful workflow improvement from explicit WebMCP operations compared with UI inference, while preserving human authority.
- **Weakens:** WebMCP is merely decorative, duplicates UI logic, or adds no observable reliability or clarity.
- **Unresolved:** Whether judges and users perceive the structured shared evidence model as sufficient WebMCP leverage.
