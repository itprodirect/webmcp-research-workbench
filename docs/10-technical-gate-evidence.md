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
- Deployment continuation preflight: `codex/technical-gate` at `6072bebb0d96818cc3fec6e7a9566f939bc31141`, clean and tracking `origin/codex/technical-gate`; local `main` remained at the frozen baseline.

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

### Deployment and deployed browser-agent observations

- **PASS — Vercel identity/team:** Vercel CLI `55.0.0` reported user `nick-5900` and active team `nick-fergusons-projects-301cfd45` / `Nick Ferguson's projects`.
- **PASS — project selection:** the team project listing contained no existing `webmcp-research-workbench` project. The checkout was linked to a new project with that exact name under the verified team. Vercel detected Next.js and configured Node.js `24.x`.
- **PASS — production deployment:** deployment `dpl_2wJgn6QRxo16xCxZgZWS6voSBuxt` completed with target `production` and status `Ready`. The Vercel build detected Next.js `16.3.3`, ran `npm run build`, compiled successfully, completed TypeScript checks, generated the static `/` route, and emitted dynamic `/api/search`.
- **PASS — production URL reachability:** <https://webmcp-research-workbench.vercel.app/> returned HTTP 200 with `text/html; charset=utf-8`.
- **PASS — live shared search route:** `POST https://webmcp-research-workbench.vercel.app/api/search` with `{"query":"browser agents","limit":5}` returned HTTP 200 and the five normalized IDs already listed in this document.
- **NOT EXECUTED — preview deployment:** only the requested completed gate build was deployed to production; no separate preview deployment was created.
- **BLOCKED — immutable deployment URL public reachability:** <https://webmcp-research-workbench-ooptf52lq.vercel.app/> returned HTTP 302 to Vercel SSO. The production alias remained publicly reachable and was used for all deployed browser tests.
- **BLOCKED — automatic GitHub deployment connection:** project linking attempted to connect `itprodirect/webmcp-research-workbench`, but Vercel reported that it could not connect the repository. CLI deployment still completed successfully; automatic Git-triggered deployment was not established.

Deployed compatible-browser test surface: Codex In-app Browser. The control surface did not expose a browser version or user agent. No origin-trial token was added. The in-app browser exposed a WebMCP capability and discovered the page tool on the deployed production alias.

Natural-language agent request used for each attempt:

> Search OpenAlex for five sources about browser agents using the page's `search_sources` tool without using the visible form.

Three fresh reload/discovery/invocation attempts were performed against <https://webmcp-research-workbench.vercel.app/>:

1. **PASS — deployed discovery/invocation:** discovered exactly `search_sources`; observed required `query`, optional bounded `limit`, `additionalProperties: false`, `readOnlyHint: true`, and `untrustedContentHint: true`; invocation returned the five expected normalized IDs.
2. **PASS — deployed discovery/invocation:** fresh discovery observed the same tool, schema, annotations, origin, and page URL; invocation returned the same ordered five IDs.
3. **PASS — deployed discovery/invocation:** fresh discovery observed the same tool, schema, and annotations; invocation returned the same ordered five IDs.

For all three tool attempts:

- The returned ordered IDs were `openalex:W2162077280`, `openalex:W2145699321`, `openalex:W2109381845`, `openalex:W1807707985`, and `openalex:W1974073260`.
- The tool result came directly from the browser's WebMCP capability.
- The visible search input remained empty and the page rendered zero result cards after invocation.
- No DOM content supplied the tool result. Post-call DOM checks were used only to verify the absence of UI actuation.
- Separate invocations produced different `retrieved_at` timestamps, as expected.

Deployed human UI observation:

- **PASS — deployed UI search:** the same query and limit rendered five records with no error.
- **PASS — deployed UI/WebMCP ID comparison:** the UI and all three WebMCP attempts returned the same ordered normalized IDs.
- **PASS — deployed external-link handling:** each rendered link used an OpenAlex HTTPS URL, `target="_blank"`, and `rel="noopener noreferrer"`.

Chrome-specific observation:

- **PASS — installed Chrome version check:** `151.0.7922.174`.
- **BLOCKED — connected Chrome-native WebMCP exposure:** on the deployed production alias, the connected Chrome document reported no `modelContext` property and the browser-control surface exposed no WebMCP capability. No browser flag or system setting was changed. Chrome-native discovery/invocation therefore remains unavailable in that profile.
- The in-app browser's isolated read-only page evaluation also did not expose `document.modelContext`, although its browser-level WebMCP capability discovered and invoked the registered page tool. The capability result, not DOM inspection or manual API execution, supplied the deployed tool evidence.

## Security audit

- **PASS — untrusted data boundary:** all provider content remains data and is described as untrusted in the tool contract.
- **PASS — annotations:** `readOnlyHint` and `untrustedContentHint` are both true and were observed in local discovery.
- **PASS — rendering:** no provider HTML or Markdown rendering exists.
- **PASS — external navigation:** links are opt-in user actions, scheme-gated to HTTP(S), and use safe new-context attributes.
- **PASS — secrets:** no `.env*` file is tracked, and no `NEXT_PUBLIC_*` use, credential-like assignment, private-key marker, or API key was found in tracked files. Vercel created a local ignored `.env.local` during project linking; its contents were not inspected or printed, and neither it nor the ignored `.vercel/` link metadata appears in the Git diff.
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

- No preview deployment was created; the committed gate build was deployed directly to production.
- The immutable deployment-specific URL is protected by Vercel SSO, while the production alias is publicly reachable.
- Vercel could not establish the automatic GitHub repository connection during linking; deployment was completed through the authenticated CLI.
- The connected Chrome 151 profile did not expose `document.modelContext`; no testing flag or system setting was changed.
- No origin-trial token was available or added.
- The Codex In-app Browser completed three deployed discovery/invocation attempts but did not expose a browser version or user agent.
- Final gate classification remains a human decision outside this evidence document.
