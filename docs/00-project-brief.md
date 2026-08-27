# Project Brief

## Status

**Planning Baseline V0 — 2026-08-27**

Current disposition: **GO WITH CONDITIONS**. The project may proceed only after the one-tool WebMCP Technical Gate succeeds.

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

## Scope terminology

- **Planning Baseline V0:** This canonical planning and documentation package. It authorizes no implementation by itself.
- **Technical Gate:** The one-provider, one-tool `search_sources` feasibility experiment using OpenAlex and the minimum human UI needed to verify the shared search path.
- **Challenge MVP:** The larger product scope that may proceed only after a recorded Technical Gate PASS.

## Challenge MVP vision

The Challenge MVP vision is a small search, source-detail, and in-memory research-packet workflow. It combines a human-readable interface with narrow WebMCP operations backed by the same server-side domain logic. This vision is not authorized by Planning Baseline V0 alone. The Technical Gate remains narrower: one OpenAlex-backed `search_sources` operation and the minimum UI needed to verify matching normalized source IDs and the shared server-side search implementation.

## Non-goals

- Standalone MCP server.
- Database, authentication, or durable packet persistence.
- Runtime LLM, RAG, or vector database.
- Crawler, arbitrary URL fetching, or generalized web scraping.
- Autonomous research loops or agent-controlled conclusions and mutations.
- Broad provider coverage before a Technical Gate PASS.
- Importing Research Intelligence source data, Gray Swan competition evidence, restricted prompts, private research artifacts, credentials, or unrelated client/project data.

## Technical Gate condition

The Technical Gate asks whether WebMCP provides a reliable explicit machine interface to the same research capability without requiring the browser agent to scrape, actuate, or infer the rendered UI. A PASS requires observable output consistency, including matching normalized source IDs, plus structural code inspection confirming that the human UI and WebMCP paths terminate at the same server-side search/domain implementation rather than separate provider or search business logic. The broader question of whether this creates a materially better human-agent research experience belongs to Challenge MVP evaluation.
