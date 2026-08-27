# Demo Plan

## Main thesis

> The human decides what the evidence means; WebMCP lets the agent retrieve the same evidence model without guessing how the site works.

## Technical gate query

```text
recent research on indirect prompt injection in language-model agents
```

This query tests OpenAlex retrieval, normalization, matching UI/WebMCP source IDs, tool discovery, and tool invocation. It is a mechanics test, not the final challenge story.

## Final challenge demo query

```text
What are the newest authoritative sources on safely handling untrusted external content in WebMCP tools?
```

This eventual demo is expected to use the bounded official WebMCP source registry plus other approved relevant sources after the gate. It must not be simulated during the one-provider experiment.

## 30-second outline

1. State the problem: fast research loses provenance, freshness, and source context.
2. Show one query returning normalized evidence in the human UI.
3. Ask the browser agent to invoke `search_sources` and show matching source IDs.
4. End on the thesis: shared evidence model, human judgment.

## 90-second core outline

1. **0–15 seconds:** Introduce the research question and the provenance problem.
2. **15–35 seconds:** Search in the human UI; point out source class, provider, dates, and provenance.
3. **35–60 seconds:** Have the browser agent discover and invoke `search_sources` without UI inference.
4. **60–75 seconds:** Show that agent and UI results share normalized IDs and domain logic.
5. **75–90 seconds:** Select evidence manually and state the trust boundary: external text is untrusted and conclusions remain human.

## Under-three-minute challenge outline

1. **0:00–0:25 — Problem and promise:** Explain why source provenance and recency get lost and what the workbench tests.
2. **0:25–1:05 — Human workflow:** Run the final query, use approved filters, inspect details, and add sources to the in-memory packet.
3. **1:05–1:50 — Agent workflow:** Show WebMCP discovery and real invocations of `search_sources` and `get_source_details` against the same evidence model.
4. **1:50–2:20 — Shared model:** Match source IDs, provenance, and freshness across the two interfaces; make clear that WebMCP is not a duplicate search implementation.
5. **2:20–2:40 — Safety:** Show read-only/untrusted annotations and explain that provider text is data, never instruction.
6. **2:40–2:55 — Value:** Reaffirm that the human controls evidence membership and interpretation while the agent gains explicit operations.

The final recording should use a deployed supported browser environment, real data, audio, readable zoom, and no sensitive tabs, credentials, or private artifacts.
