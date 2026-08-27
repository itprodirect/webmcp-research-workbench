# Source Strategy

## Technical gate

**OpenAlex only.** The gate exists to test WebMCP mechanics and shared normalization, not provider breadth.

## Expected MVP after gate

Subject to an explicit passing gate decision:

- OpenAlex;
- GitHub;
- bounded Official WebMCP Sources registry.

The official registry means a maintained allowlist of relevant first-party documentation sources, not general web crawling.

## Deferred providers

- Crossref;
- direct arXiv;
- Semantic Scholar;
- W3C;
- IETF;
- NIST/NVD;
- general web search.

Deferral is intentional. Additional adapters are not authorized before the technical gate.

## Source classes

Normalized records use one of these explicit classes:

```text
official_documentation
standards_body
government
peer_reviewed
preprint
repository
technical_publication
community
unknown
```

Classification describes an observable source category; it does not declare a source true or credible.

## Provenance rules

Every normalized source retains:

```text
provider
provider_record_id
retrieved_at
canonical_url
source_class
publication/update dates where known
```

Missing or uncertain attributes remain unknown. Provider-native identifiers and canonical URLs must survive normalization so records can be traced back to their origin.

## Duplicate and version rules

- Merge records only when high-confidence identifiers establish identity.
- Preserve relationships between preprints and published versions.
- Fuzzy title or author similarity may suggest review, but does not justify destructive merging.
- Unknown values remain unknown; do not infer or fabricate them.
- Preserve enough provider context to audit any later merge decision.

## No credibility score

The application exposes observable attributes—provider, source class, dates, authorship, identifiers, and provenance—instead of producing a numeric truth or credibility score. Interpretation remains with the human.
