import assert from "node:assert/strict";
import test from "node:test";
import {
  buildApprovedBriefMarkdown,
  getApprovedBriefFilename,
} from "../src/client/approved-brief-markdown.ts";
import type {
  EvidenceBrief,
  ResearchWorkspaceState,
  WorkspaceEvidence,
} from "../src/domain/workspace.ts";

const acceptedSource = {
  id: "openalex:W123",
  provider: "openalex",
  provider_record_id: "W123",
  title: "Unsafe [source](javascript:alert(1)) <img>",
  publication_date: "2025-01-01",
} as WorkspaceEvidence;

const approvedBrief = {
  title: "Defending Agent Systems",
  summary: "A source-linked summary.",
  findings: [
    {
      statement: "External content can redirect tool-using agents.",
      source_ids: [acceptedSource.id],
    },
  ],
  caveats: "Based on abstracts, not verified full text.",
  agent_generated: true,
  human_edited: false,
  human_reviewed: true,
  approved: true,
  updated_at: "2026-08-28T12:00:00.000Z",
} as EvidenceBrief;

function workspace(brief: EvidenceBrief | null = approvedBrief): ResearchWorkspaceState {
  return {
    schema_version: 1,
    mission: {
      question: "Assess <script> and [linked claims](javascript:alert(1)).",
      context: "Security competition judges",
      evidence_max: 3,
      updated_at: "2026-08-28T11:00:00.000Z",
    },
    proposals: [],
    accepted_evidence: [acceptedSource],
    brief,
    activity: [],
  };
}

test("serializes the human-approved mission, brief, citations, and evidence list", () => {
  const markdown = buildApprovedBriefMarkdown(workspace());

  for (const expected of [
    "# Defending Agent Systems",
    "**Status:** Human approved",
    "## Research mission",
    "Security competition judges",
    "## Summary",
    "## Findings",
    "### Finding 1",
    "`openalex:W123`",
    "## Caveats",
    "## Accepted evidence",
    "Provider: OpenAlex (W123)",
    "Published: 2025-01-01",
  ]) {
    assert.ok(markdown.includes(expected), `missing ${expected}`);
  }
});

test("keeps untrusted workspace text inert in Markdown", () => {
  const markdown = buildApprovedBriefMarkdown(workspace());

  assert.doesNotMatch(markdown, /<script>|<img>/);
  assert.doesNotMatch(markdown, /\[source\]\(javascript:/);
  assert.match(markdown, /&lt;script&gt;/);
  assert.match(markdown, /\\\[source\\\]\(javascript:/);
});

test("refuses unapproved exports and creates a bounded Markdown filename", () => {
  assert.throws(
    () => buildApprovedBriefMarkdown(workspace({ ...approvedBrief, approved: false })),
    /approved brief and active mission are required/i,
  );
  assert.equal(
    getApprovedBriefFilename("Indirect Prompt Injection: Findings & Defenses"),
    "indirect-prompt-injection-findings-defenses.md",
  );
});
