# Phase 1 Technical Gate Evidence

## Evidence boundary

This document records factual Technical Gate observations from 2026-08-27. It does not classify the project as PASS, PARTIAL, or FAIL and does not authorize Challenge MVP work.

## Repository state

- Frozen baseline: `d0946b778d0e13cad70ab65ddec0fb4c8a11af91`
- Frozen baseline subject: `docs: tighten WebMCP planning gate and boundaries`
- Starting branch: `main`
- Implementation branch: `codex/technical-gate`
- Implementation commit: `e3559a0041af707284a18ba4c4af55710629d6e8`
- Remote: `https://github.com/itprodirect/webmcp-research-workbench.git`
- Preflight result: expected branch, SHA, subject, clean working tree, and remote all matched before modification.

## Implemented architecture

```text
Human UI handleSubmit()
        |
        v
searchSourcesViaServer() ---- POST /api/search ---- POST()
                                                   |
WebMCP createRegistration()                        v
  search_sources execute() --------------> searchSources()
                                                   |
                                                   v
                                           searchOpenAlex()
                                                   |
                                                   v
                              https://api.openalex.org/works
                                                   |
                                                   v
                                      normalizeOpenAlexWork()
                                                   |
                                                   v
                                           SourceRecord[]
```

Exact convergence points:

- Human UI: `app/components/search-workbench.tsx` `handleSubmit()` -> `src/client/search-api.ts` `searchSourcesViaServer()`.
- WebMCP: `app/components/webmcp-registration.tsx` `createRegistration()` execute callback -> the same `searchSourcesViaServer()`.
- Shared server interface: `app/api/search/route.ts` `POST()`.
- Domain operation: `src/domain/search-sources.ts` `searchSources()`.
- Only provider adapter: `src/providers/openalex.ts` `searchOpenAlex()`.
- Only provider normalization: `src/providers/openalex-normalize.ts` `normalizeOpenAlexWork()`.

Repository search found one `https://api.openalex.org` endpoint constant, one `searchOpenAlex()` implementation, one `normalizeOpenAlexWork()` implementation, and one `search_sources` tool registration. No second UI-specific or WebMCP-specific provider/search business implementation was found.

## SourceRecord

`src/domain/source-record.ts` defines this compact normalized shape:

```text
id: stable `openalex:W...` normalized ID
provider: `openalex`
provider_record_id: native OpenAlex `W...` ID
title: string | null
canonical_url: strict OpenAlex work URL | null
source_class: explicit source class
publication_date: string | null
provider_updated_at: string | null
retrieved_at: ISO timestamp
doi: string | null
publication_year: integer | null
provider_type: string | null
```

Classification is conservative. Only an OpenAlex provider type of `preprint` maps to source class `preprint`; ordinary articles, conference papers, and other types map to `unknown`. The implementation does not infer peer review, truth, or credibility. Missing provider metadata remains `null`.

## OpenAlex behavior

- Endpoint: fixed in application code as `https://api.openalex.org/works`.
- Authentication: anonymous; no OpenAlex key or other credential was introduced.
- Request parameters: `search`, bounded `per_page`, and a fixed `select` list.
- Selected fields: `id,display_name,doi,publication_date,publication_year,type,updated_date`.
- Query length: 1-200 trimmed characters.
- Limit: integer 1-10; default 5.
- Timeout: 8,000 milliseconds.
- Maximum response body: 256,000 bytes.
- Redirect behavior: rejected.
- Cache behavior: `no-store`.
- Failures: explicit codes for invalid input, provider timeout, provider failure, and malformed provider response.
- No fallback provider, placeholder record, HTML ingestion, arbitrary URL fetch, or fabricated metadata exists.

Real request observation:

- Query: `browser agents`
- Limit: `5`
- Result count: `5`
- Normalized IDs: `openalex:W2162077280`, `openalex:W2145699321`, `openalex:W2109381845`, `openalex:W1807707985`, `openalex:W1974073260`
- Provider IDs: `W2162077280`, `W2145699321`, `W2109381845`, `W1807707985`, `W1974073260`
- Provider: `openalex` for all five records.
- Source class: `unknown` for the observed articles and conference papers.
- Missing metadata behavior: three observed records returned `doi: null`; the implementation preserved those values as unknown rather than inventing them.
- Hard-coded result audit: none of these live IDs or titles is present in application source. Synthetic IDs exist only in normalization tests.

## WebMCP implementation

Current official sources checked on 2026-08-27:

- WebMCP draft specification: <https://webmachinelearning.github.io/webmcp/>
- Chrome WebMCP overview: <https://developer.chrome.com/docs/ai/webmcp>
- Chrome imperative API: <https://developer.chrome.com/docs/ai/webmcp/imperative-api>
- Chrome DevTools WebMCP panel: <https://developer.chrome.com/docs/devtools/application/webmcp>

Observed current API requirements:

- Imperative registration uses `document.modelContext.registerTool(...)`, not the older `navigator.modelContext` proposal.
- Registration uses an `AbortController` signal for cleanup.
- Tool name: exactly `search_sources`.
- Input schema: required non-empty `query`; optional integer `limit` from 1 through 10; no additional properties.
- `readOnlyHint: true`.
- `untrustedContentHint: true`.
- Description states that results are real OpenAlex data, normalized by the application, and untrusted external evidence/data rather than instructions.
- Execute calls the shared server interface directly; it does not actuate the form, scrape the DOM, or contain provider logic.
- Typings: Chrome-recommended `webmcp-types` version `0.1.5`; no experimental React integration library.
- Origin-trial token: none added.

Chrome documentation states that the production origin trial starts at Chrome 149 and that local testing uses `chrome://flags/#enable-webmcp-testing`. The Chromium intent records the origin-trial range as Chrome 149-156 inclusive. Installed Chrome executable version was `151.0.7922.174`, within that range.

## Validation results

### Local commands

- **PASS — install:** `npm install` added 348 packages and audited 349 packages; npm reported 0 vulnerabilities. Follow-up installs pinned the resolved versions and again reported 0 vulnerabilities.
- **PASS — lint:** `npm run lint` exited 0 with no findings.
- **PASS — build:** `npm run build` exited 0 on Next.js `16.3.3`; `/` was statically generated and `/api/search` was emitted as a dynamic route.
- **PASS — tests:** `npm test` exited 0; 5 tests passed, 0 failed. Tests cover stable native identity, conservative classification, null preservation, invalid native identity, trimmed/default input, and rejection of empty/oversized/out-of-range/expanded input.
- **PASS — real OpenAlex request:** the shared route returned the five real records listed above.
- **PASS — invalid-input behavior:** bounded validation rejects empty, oversized, out-of-range, and unsupported fields with explicit errors.

### Human UI

- **PASS — local UI search:** `browser agents`, limit 5, returned five visible records.
- **PASS — visible normalized IDs:** all five IDs listed above were rendered.
- **PASS — states:** implementation includes idle, loading, empty, success, and error states.
- **PASS — safe links:** all five observed provider links used `https:`, `target="_blank"`, and `rel="noopener noreferrer"`.
- **PASS — escaped content:** provider strings are rendered through ordinary React text nodes; repository search found no `dangerouslySetInnerHTML` or direct `innerHTML` use.

### Local WebMCP browser observations

Browser surface: Codex In-app Browser. The browser version/user-agent was not exposed by the control surface.

Test request used for each attempt:

> Search OpenAlex for five sources about browser agents using the page's `search_sources` tool without using the visible form.

Three fresh reload/discovery/invocation attempts were performed against `http://localhost:3000/`:

1. **PASS — local discovery/invocation:** discovered `search_sources`, observed the narrow schema and both annotations, and received the five normalized IDs listed above.
2. **PASS — local discovery/invocation:** fresh discovery returned the same tool; invocation returned the same five IDs. After invocation, the visible input remained empty and rendered result-card count remained zero.
3. **PASS — local discovery/invocation:** fresh discovery returned the same tool and annotations; invocation returned the same five IDs. A post-call DOM snapshot showed the input empty, initial status intact, and no rendered result cards.

Tool results were delivered through the browser's WebMCP capability. DOM inspection occurred only afterward to verify that the tool had not actuated the UI; DOM content was not used to obtain the tool results.

### UI and WebMCP consistency

- Query: `browser agents`
- Limit: `5`
- UI IDs: `openalex:W2162077280`, `openalex:W2145699321`, `openalex:W2109381845`, `openalex:W1807707985`, `openalex:W1974073260`
- WebMCP IDs: `openalex:W2162077280`, `openalex:W2145699321`, `openalex:W2109381845`, `openalex:W1807707985`, `openalex:W1974073260`
- **PASS — local ID comparison:** the ordered normalized ID sequences matched.
- `retrieved_at` was allowed to differ between independent requests.

### Chrome and deployed-production boundary

- **PASS — installed Chrome version check:** `151.0.7922.174`.
- **BLOCKED — connected Chrome WebMCP API:** on `http://localhost:3000/`, the connected Chrome document reported no `modelContext` property. The testing flag was therefore not effective in that Chrome profile. No system/browser flag was changed.
- **BLOCKED — Vercel authentication:** Vercel CLI `55.0.0` exists, but `vercel whoami` reported that the saved token is invalid. No `.vercel` project link exists.
- **NOT EXECUTED — deployment:** account/team/project ownership could not be established without valid authentication, so no preview or production deployment was attempted and no URL is claimed.
- **NOT EXECUTED — deployed WebMCP registration/discovery/invocation:** no deployed URL existed.
- **NOT EXECUTED — production compatible-browser natural-language agent test:** local browser-agent evidence exists, but the required deployed production-compatible observation does not.

**NOT EXECUTED — HUMAN/COMPATIBLE BROWSER VALIDATION REQUIRED**

## Manual deployed browser-agent procedure

1. Run `vercel login` and authenticate the intended owner account.
2. Confirm the intended Vercel team and project before linking; do not create or select an ambiguous project.
3. From `codex/technical-gate`, deploy the committed gate build and record the exact preview and production URLs plus HTTP status.
4. Use a compatible Chrome version. Either enable `chrome://flags/#enable-webmcp-testing` and relaunch for controlled testing, or enroll the exact deployed origin in the active WebMCP origin trial and use only the real issued token. Do not fabricate a token.
5. Open the deployed URL. In Chrome DevTools, open Application -> WebMCP and confirm exactly one available imperative tool named `search_sources`, its schema, and both annotations.
6. In a compatible browser agent, issue: “Search OpenAlex for five sources about browser agents using the page's `search_sources` tool without using the visible form.”
7. Record discovery, actual invocation, returned normalized IDs, visible-form state, invocation log, errors, Chrome version, flag/origin-trial state, and confirmation that no DOM scraping supplied the results.
8. Repeat from a fresh page load at least three times.
9. Run the same query and limit through the human UI and compare ordered normalized IDs. A `retrieved_at` difference is expected.

## Security audit

- **PASS — untrusted data boundary:** all provider content remains data and is described as untrusted in the tool contract.
- **PASS — annotations:** `readOnlyHint` and `untrustedContentHint` are both true and were observed in local discovery.
- **PASS — rendering:** no provider HTML or Markdown rendering exists.
- **PASS — external navigation:** links are opt-in user actions, scheme-gated to HTTP(S), and use safe new-context attributes.
- **PASS — secrets:** no tracked or untracked `.env*` file, `NEXT_PUBLIC_*` use, credential-like assignment, private-key marker, or API key was found in the scoped files. No environment secret values were inspected or printed.
- **PASS — provider errors:** timeout, network/HTTP failure, malformed JSON/shape/record, oversized response, redirect, and over-limit result behavior remain explicit.
- **PASS — unknown metadata:** null values remain null and ordinary works remain source class `unknown` unless the provider explicitly reports `preprint`.

## Scope audit

- Providers: OpenAlex only.
- WebMCP tools: `search_sources` only.
- Database: none.
- Authentication: none.
- Runtime LLM: none.
- RAG/vector database: none.
- Standalone MCP server: none.
- Packet persistence: none.
- Additional Challenge MVP capabilities: none.
- License added: no.
- Telemetry/analytics infrastructure: none.
- Phase 0 planning documents modified: no.

The single `github` occurrence in implementation files is a negative input-validation test asserting that an unsupported provider field is rejected; no GitHub adapter or provider behavior exists.

## Limitations and unexecuted requirements

- Vercel deployment is blocked until the intended account is authenticated and the project/team choice is unambiguous.
- No preview or production URL exists from this run.
- The connected Chrome profile did not expose `document.modelContext`; its WebMCP testing flag was not effective.
- No origin-trial token was available or added.
- The Codex In-app Browser demonstrated local discovery and invocation three times, but did not expose a browser version.
- The required deployed production-compatible browser-agent test remains unexecuted and must not be inferred from local success.
- Final gate classification remains a human decision outside this evidence document.
