# Project Brief

## Status

**V0 Planning Baseline — 2026-08-27**

Current disposition: **GO WITH CONDITIONS**. The project may proceed only after the one-tool WebMCP technical feasibility gate succeeds.

## Problem

Fast-moving technical research loses structure across search results, tabs, documents, dates, source types, and citations. This makes it difficult to judge recency, authority, provenance, and the relationship between sources while preserving a reviewable evidence trail.

## Target user

> Technically capable humans conducting fast-moving evidence-based research where recency, authority, and provenance matter.

## Product concept

> Build a provenance-aware research workspace where technically capable humans and browser agents can discover recent, authoritative, relevant sources; inspect provenance, freshness, source class, and trust characteristics; and assemble a human-reviewable research packet through WebMCP.

The application remains deliberately non-autonomous. The human retains authority over source selection, interpretation, research-packet membership, conclusions, and later state-changing actions.

## Core value

### Human

- Inspect provenance.
- Compare source type and freshness.
- Select evidence deliberately.

### Agent

- Invoke explicit, typed research operations.
- Avoid guessing application behavior from the rendered UI.

### Human + agent

- Operate against the same normalized evidence model and domain operations.
- Keep evidence retrieval distinct from human interpretation and judgment.

## Principles

- Evidence before inference.
- Provenance preserved.
- Freshness visible.
- Source class visible.
- Uncertainty preserved rather than silently filled.
- Human authority over interpretation and action.
- External content is untrusted.
- Read-only WebMCP first.
- Narrow, typed operations.
- No fake credibility or truth score.

## V0 scope

A small search, source-detail, and in-memory research-packet workflow. The eventual V0 combines a human-readable interface with narrow WebMCP operations backed by the same server-side domain logic. The technical gate is narrower: one OpenAlex-backed `search_sources` operation and the minimum UI needed to verify matching normalized source IDs.

## Non-goals

- Standalone MCP server.
- Database, authentication, or durable packet persistence.
- Runtime LLM, RAG, or vector database.
- Crawler, arbitrary URL fetching, or generalized web scraping.
- Autonomous research loops or agent-controlled conclusions and mutations.
- Broad provider coverage before the technical gate.
- Importing Research Intelligence source data, Gray Swan competition evidence, restricted prompts, private research artifacts, credentials, or unrelated client/project data.

## Gate condition

The full MVP is not authorized until a deployed compatible browser agent can reliably discover and invoke `search_sources` against real OpenAlex data, with the UI and WebMCP path returning the same normalized source IDs through shared domain logic. If WebMCP adds no meaningful benefit over UI inference, reconsider the project instead of expanding it.
