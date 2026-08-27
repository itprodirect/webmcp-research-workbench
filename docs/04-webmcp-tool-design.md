# WebMCP Tool Design

## Technical-gate tool

```text
search_sources
```

Expected Technical Gate annotations:

```text
readOnlyHint: true
untrustedContentHint: true
```

Suggested inputs:

```text
query
source_classes?
providers?
from_date?
to_date?
sort?
limit?
```

The Technical Gate schema should remain intentionally narrow. Optional fields must be included only when the OpenAlex-backed Technical Gate genuinely supports and validates them; this list is a design direction, not permission for speculative filters.

The output should contain compact normalized source records, stable source IDs, explicit provenance, and explicit failures. It must not return hidden instructions or fabricate unavailable metadata.

## Second Challenge MVP tool

```text
get_source_details
```

This tool is approved only after a recorded Technical Gate PASS. It should retrieve a normalized source by the same identifier used in UI search results and expose additional known provenance and metadata without introducing a second domain implementation.

## Deferred tools

- `get_recent_sources` — defer until real usage shows that a separate recency operation adds value beyond typed `search_sources` filters.
- `compare_sources` — defer until comparison semantics and human-review boundaries are validated; the Challenge MVP must not smuggle in a credibility score.
- `build_research_packet` — defer because packet exposure or mutation expands the trust and state boundary and requires a separate decision.

## Key architectural rule

WebMCP is an interface adapter. It must not become:

- a second search implementation;
- a second domain layer;
- a location for provider-specific business logic.

The human UI and WebMCP adapter must terminate at the same server-side search/domain implementation:

```text
Human UI ───────┐
                ├─> same server search endpoint / operation
WebMCP tool ────┘                 ↓
                            searchSources()
                                  ↓
                            OpenAlex adapter
```

Technical Gate evidence requires both observable output consistency, including matching normalized source IDs, and structural code inspection confirming that both paths converge before provider/search business logic. Matching native IDs alone is not proof of a shared implementation. This rule does not prescribe the future Next.js file layout or require runtime instrumentation, telemetry, tracing, a proof harness, or duplicate-route test infrastructure.
