# WebMCP Tool Design

## Technical-gate tool

```text
search_sources
```

Expected V0 annotations:

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

The implemented gate schema should remain intentionally narrow. Optional fields must be included only when the OpenAlex gate genuinely supports and validates them; this list is a design direction, not permission for speculative filters.

The output should contain compact normalized source records, stable source IDs, explicit provenance, and explicit failures. It must not return hidden instructions or fabricate unavailable metadata.

## Second MVP tool

```text
get_source_details
```

This tool is approved only after the gate passes. It should retrieve a normalized source by the same identifier used in UI search results and expose additional known provenance and metadata without introducing a second domain implementation.

## Deferred tools

- `get_recent_sources` — defer until real usage shows that a separate recency operation adds value beyond typed `search_sources` filters.
- `compare_sources` — defer until comparison semantics and human-review boundaries are validated; V0 must not smuggle in a credibility score.
- `build_research_packet` — defer because packet exposure or mutation expands the trust and state boundary and requires a separate decision.

## Key architectural rule

WebMCP is an interface adapter. It must not become:

- a second search implementation;
- a second domain layer;
- a location for provider-specific business logic.

The human UI and WebMCP adapter must call the same server-side search operation:

```text
Human UI ───────┐
                ├─> searchSources() ─> OpenAlex adapter ─> normalized SourceRecord
WebMCP tool ────┘
```

The technical gate must demonstrate matching normalized source IDs through both paths.
