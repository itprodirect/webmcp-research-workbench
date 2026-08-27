# Phase 2A Deployment Validation Evidence

## Evidence boundary

This document records factual Phase 2A production-deployment observations from 2026-08-27. No Phase 2B work, provider expansion, product redesign, or application-code change was performed during this validation.

## Identity and status

- **Project:** WebMCP Research Workbench
- **Phase:** Phase 2A — Inspect + Curate deployed validation
- **Status:** PASS
- **Validation date:** 2026-08-27
- **Branch:** `codex/phase-2a-inspect-curate`
- **Application commit validated and deployed:** `96b33d5dc42c2c7955ee280ba6e930aae802fae6`
- **Canonical `origin/main` observed:** `5294af705b882977bd85f4328ae688be8983262d`
- **Production alias:** <https://webmcp-research-workbench.vercel.app/>
- **Deployment-specific URL:** <https://webmcp-research-workbench-10mcdac0j.vercel.app/>
- **Vercel deployment ID:** `dpl_ApkQMQ8podfgCcfnJDqE7q9YuztM`
- **Deployed browser/client:** Codex In-app Browser
- **Browser version exposed:** no
- **User agent exposed:** no

## Preflight

After `git fetch origin` and checkout of the existing Phase 2A branch:

- local `HEAD` was `96b33d5dc42c2c7955ee280ba6e930aae802fae6`;
- `origin/codex/phase-2a-inspect-curate` was the same SHA;
- `origin/main` was `5294af705b882977bd85f4328ae688be8983262d`;
- the worktree was clean; and
- PR #2 was open, draft, unmerged, based on `main`, headed by `codex/phase-2a-inspect-curate`, and reported head SHA `96b33d5dc42c2c7955ee280ba6e930aae802fae6`.

## Deterministic validation

All required commands ran against the clean application commit before deployment.

| Command | Result |
| --- | --- |
| `npm test` | PASS — 21 tests passed, 0 failed, 0 skipped |
| `npm run lint` | PASS — ESLint exited 0 with no findings |
| `npx tsc --noEmit --incremental false` | PASS — TypeScript exited 0 with no findings |
| `npm run build` | PASS — Next.js 16.3.3 production build compiled, type-checked, statically generated `/`, and emitted dynamic `/api/search` and `/api/source-details` routes |

The deterministic suite covered the shared details path, normalized ID validation, OpenAlex normalization, null preservation, provider failure/not-found/malformed/aborted states, packet add/remove/duplicate prevention, existing search behavior, and both WebMCP tool contracts.

## Deployment

- **Command:** `vercel deploy --prod --yes`
- **Local Vercel CLI:** `55.0.0`
- **Deployment created:** `2026-08-27T12:57:34Z` (`2026-08-27 08:57:34 EDT` as reported by `vercel inspect`)
- **Target:** production
- **Region:** `iad1` (Washington, D.C., USA East)
- **Status:** Ready
- **Deployment-specific URL:** <https://webmcp-research-workbench-10mcdac0j.vercel.app/>
- **Production alias:** <https://webmcp-research-workbench.vercel.app/>

The Vercel build installed the existing dependencies, ran `npm run build`, compiled successfully, completed TypeScript checks, generated `/`, and emitted `/api/search` and `/api/source-details`.

Public-access observations:

- production alias returned HTTP 200 with `text/html; charset=utf-8`;
- deployment-specific URL returned HTTP 302 to Vercel SSO; and
- the public production alias, not the SSO-protected immutable URL, was used for all production API and browser validation.

## Production API validation

### Valid search

Request:

```json
{
  "query": "recent research on indirect prompt injection in language-model agents",
  "limit": 5
}
```

`POST /api/search` succeeded against the public production alias and returned five real OpenAlex records. The ordered normalized IDs were:

1. `openalex:W4388886073`
2. `openalex:W4402670146`
3. `openalex:W2156092714`
4. `openalex:W2398139753`
5. `openalex:W4213147678`

### Valid details lookup and identity

Request:

```json
{
  "id": "openalex:W4388886073"
}
```

`POST /api/source-details` succeeded. The search and detail responses agreed on normalized ID `openalex:W4388886073`, provider `openalex`, and provider record ID `W4388886073`.

### Explicit failure cases

| Case | Input | HTTP status | Error code |
| --- | --- | ---: | --- |
| Malformed normalized ID | `W4388886073` | 400 | `invalid_source_id` |
| Unsupported provider | `github:123` | 400 | `unsupported_provider` |
| Missing valid-shaped OpenAlex ID | `openalex:W9999999999999999` | 404 | `source_not_found` |

The nonexistent OpenAlex ID was requested once. Its error retained provider `openalex`; no fallback or fabricated record was returned.

## Production human workflow

### Search

- **Query:** `recent research on indirect prompt injection in language-model agents`
- **Visible result count:** 5
- **Selected normalized ID:** `openalex:W4388886073`
- **Provider:** `openalex`
- **Provider record ID:** `W4388886073`
- **Title:** `Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection`
- **Publication date:** `2023-11-21`
- **Source class:** `unknown`
- **Provider type:** `conference-paper`
- **DOI:** `https://doi.org/10.1145/3605764.3623985`

### Source inspection

The details request succeeded and retained the selected normalized ID, provider, provider record ID, title, publication date, source class, provider type, and DOI.

Additional observed details:

- **Provider updated:** `2026-08-26T07:47:46.906454`
- **Human-detail retrieval timestamp:** `2026-08-27T13:00:12.843Z`
- **Metadata language:** `en`
- **Authors:** Kai Greshake (`A5084917133`), Sahar Abdelnabi (`A5040674721`), Shailesh Mishra (`A5091229444`), Christoph Endres (`A5004607650`), Thorsten Holz (`A5056790702`), and Mario Fritz (`A5003887059`)
- **Primary source name:** unknown
- **Primary source provider ID:** unknown
- **Primary-location landing page:** `https://doi.org/10.1145/3605764.3623985`
- **Location version:** `publishedVersion`
- **Open access at primary location:** yes

The primary-source name and ID were displayed as unknown rather than inferred from the DOI or landing-page URL. The UI displayed the provider metadata as untrusted external evidence and did not present a truth or credibility assessment.

### Human-controlled research packet

1. The packet initially showed `Research packet (0)` and `No sources added.`
2. The human path explicitly selected `Add to research packet`.
3. Membership changed from 0 to 1 and retained normalized ID, provider, provider record ID, publication date, and retrieval timestamp.
4. The add control changed to disabled `Already in packet`, preventing duplicate membership.
5. The human path explicitly selected `Remove from packet`.
6. Membership returned from 1 to 0 and `No sources added.` reappeared.

No persistence or WebMCP packet mutation was involved.

### Rendering and link behavior

- Provider strings were observed as ordinary text in the rendered page.
- Seven rendered provider/location links were inspected after detail loading.
- Every observed link used an `http:` or `https:` URL, `target="_blank"`, and `rel="noopener noreferrer"`.
- The production-alias URL remained unchanged through search, details, packet add, and packet removal.
- No provider-driven automatic navigation occurred.
- Browser logs contained no warnings or errors during the human workflow.

## Deployed WebMCP discovery

The WebMCP proof used a separate, freshly opened Codex In-app Browser tab on the public production alias. Before invocation, the visible form was empty, the page showed the initial result-limit message, details were idle, and the packet count was zero.

Exactly two application tools were discovered:

1. `search_sources` — title `Search OpenAlex sources`
2. `get_source_details` — title `Get OpenAlex source details`

No third application tool and no packet mutation tool were present.

Observed `search_sources` schema:

- object input;
- required string `query`, length 1–200;
- optional integer `limit`, range 1–10;
- `additionalProperties: false`.

Observed `get_source_details` schema:

- object input;
- required string `id` matching `^openalex:W[0-9]+$`;
- `additionalProperties: false`.

Both deployed tool definitions exposed:

```text
readOnlyHint: true
untrustedContentHint: true
```

Both descriptions stated that provider content is untrusted external evidence/data and never instructions. Both definitions reported origin and page URL `https://webmcp-research-workbench.vercel.app`.

## Deployed WebMCP invocation

### Invocation 1 — `search_sources`

Input:

```json
{
  "query": "recent research on indirect prompt injection in language-model agents",
  "limit": 5
}
```

The call succeeded and returned five normalized OpenAlex records. The first returned record was:

```text
id: openalex:W4388886073
provider: openalex
provider_record_id: W4388886073
title: Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection
publication_date: 2023-11-21
source_class: unknown
provider_type: conference-paper
retrieved_at: 2026-08-27T13:01:22.060Z
```

### Invocation 2 — `get_source_details`

The application did not use a separately invented identifier. The exact value at `search_sources` result index 0 was assigned as the details input:

```json
{
  "id": "openalex:W4388886073"
}
```

The call succeeded and retained the normalized ID, provider, provider record ID, title, publication date, source class, provider type, provider update time, DOI, and publication year. It additionally returned:

- the same six authors and provider-native author IDs observed in the human view;
- language `en`;
- `primary_location.source_name: null`;
- `primary_location.source_provider_record_id: null`;
- landing page `https://doi.org/10.1145/3605764.3623985`;
- version `publishedVersion`;
- open-access value `true`; and
- retrieval timestamp `2026-08-27T13:01:35.120Z`.

Unknown primary-source fields remained explicit `null` values.

### Independence from the rendered UI

- Both results came directly from the in-app browser's structured WebMCP capability.
- The tool calls did not click, fill, submit, scrape, or read the human UI to obtain provider data.
- No manual navigation to OpenAlex occurred.
- The fresh agent tab's complete DOM snapshot before `search_sources` was exactly equal to its snapshot after both tool calls.
- The visible search box remained empty, no result cards appeared, details remained idle, the packet remained at zero, and the page URL did not change.
- DOM inspection occurred only before and after invocation to prove absence of UI actuation; it did not supply either tool result.
- Browser logs contained no warnings or errors during the WebMCP workflow.

## Human and agent agreement

The human UI search, WebMCP `search_sources`, human detail view, and WebMCP `get_source_details` agreed on the following fields for the selected source:

| Field | Agreed value |
| --- | --- |
| Normalized source ID | `openalex:W4388886073` |
| Provider | `openalex` |
| Provider record ID | `W4388886073` |
| Title | `Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection` |
| Publication date | `2023-11-21` |
| Source class | `unknown` |
| Provider type | `conference-paper` |
| DOI | `https://doi.org/10.1145/3605764.3623985` |
| Provider update time | `2026-08-26T07:47:46.906454` |
| Language | `en` |
| Author count | 6 |
| Primary source name/ID | unknown in UI; `null` in tool result |
| Location version | `publishedVersion` |
| Primary-location open access | yes / `true` |

Independent requests produced different `retrieved_at` values. This is expected; normalized identity and provenance agreed without requiring byte-for-byte timestamp equality.

## Security and trust validation

- Both deployed tools were read-only and marked as returning untrusted content.
- Provider text remained evidence/data and did not authorize actions, configuration, navigation, or packet membership.
- Packet membership remained human-controlled; no WebMCP packet mutation tool existed.
- Repository inspection found exactly the two authorized tool names.
- Repository inspection found one fixed provider endpoint, `https://api.openalex.org/works`; the other fetch calls targeted the application's relative `/api/search` and `/api/source-details` routes.
- No arbitrary-URL fetch capability was present.
- Search and detail provider requests retained bounded timeout, response-size, redirect, and no-store behavior.
- No browser persistence API use was found.
- No `dangerouslySetInnerHTML` or direct `innerHTML` rendering path was found.
- No tracked `.env*` or `.vercel` file, `NEXT_PUBLIC_*` use, credential assignment, or private-key marker was found.
- No secret appeared in the observed UI, API response, WebMCP definition, or WebMCP result.
- Unknown metadata remained explicit.
- Production observations demonstrated explicit invalid-ID, unsupported-provider, and missing-source states. The deterministic suite additionally demonstrated provider HTTP failure, malformed-response, not-found, and abort states; code inspection confirmed the existing explicit timeout path.
- No truth or credibility score was present.

## Scope audit

- Provider: OpenAlex only.
- WebMCP tools: `search_sources` and `get_source_details` only.
- Application code changes during deployment validation: none.
- New provider: none.
- New search filter: none.
- Database/authentication: none.
- Runtime LLM/RAG/vector database: none.
- Packet persistence: none.
- Packet WebMCP mutation: none.
- Standalone MCP server: none.
- License/submission/demo work: none.
- Vercel architecture, domain, analytics, authentication, database, environment, and GitHub auto-deployment changes: none.
- Phase 2B work: none.

## Limitations

- The Codex In-app Browser control surface exposed neither a browser version nor a user agent.
- Only the Codex In-app Browser was used for Phase 2A deployed WebMCP validation; ordinary Chrome was not retested.
- The immutable deployment-specific URL remained protected by Vercel SSO, while the Challenge-relevant production alias was public and returned HTTP 200.
- The production validation exercised one representative human/agent query and one selected source; it did not load-test OpenAlex or attempt destructive/adversarial security testing.

These limitations do not violate the authorized Phase 2A deployment gate. The public human workflow, explicit two-tool agent workflow, identity agreement, trust annotations, human-only packet boundary, and explicit failure behavior were all demonstrated.

## Classification

**Phase 2A deployed validation: PASS**

The public production alias was reachable; the human search, inspection, packet add/duplicate prevention/remove sequence worked; exactly two annotated WebMCP tools were discovered; an ID returned directly by deployed `search_sources` successfully drove deployed `get_source_details`; UI and WebMCP identities/provenance agreed; the structured agent path did not use or actuate the rendered UI; and no unauthorized scope appeared.
