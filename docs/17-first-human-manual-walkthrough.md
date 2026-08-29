# WebMCP Research Workbench — First Human Manual Walkthrough

**Date:** 2026-08-27  
**Project:** WebMCP Research Workbench  
**Stage:** Post–Phase 2B, pre–Phase 3  
**Record type:** Human UX observation / first manual walkthrough  
**Status:** Drafted from immediate post-test interview; no product changes authorized by this document

## Purpose

Capture the first human manual walkthrough while the experience is fresh, especially the difference between technical correctness and first-time usability. This is a UX/research record, not a marketing document and not a Phase 3 implementation authorization.

## Session context

The participant was already involved in building the product, but was still relatively new to WebMCP as a technology and did not begin the session with a fully formed mental model of how the finished human-agent workflow should feel.

Before the walkthrough, the participant had watched an OpenAI Developers WebMCP presentation/demo on X. That materially improved their conceptual understanding of WebMCP, but they still did not know exactly what to expect from the completed Research Workbench experience.

During the session:

- the human UI was exercised in Firefox and Chrome;
- Chrome WebMCP testing and DevTools support were enabled;
- Chrome discovered all five registered WebMCP tools;
- `get_research_workspace` successfully read shared workspace state;
- the user manually selected and accepted research evidence;
- `draft_evidence_brief` was invoked through WebMCP;
- the evidence brief appeared in the application without DOM actuation;
- the user edited, reviewed, and approved the brief; and
- the activity ledger visibly recorded the human → agent → human sequence.

## First-person feedback

### 1. Starting expectation

The participant was initially unsure what the product was supposed to feel like in practice.

They had intentionally started the project because WebMCP looked important and they wanted hands-on experience with it, but they were still learning the interaction model. Watching the OpenAI Developers demo on X improved their understanding substantially.

Even after Phase 2B had been built and technically validated, the participant said the product did not yet *intuitively feel* like it was working until they manually walked through the human and WebMCP interaction.

**Interpretation:** Technical success was ahead of user comprehension.

### 2. First impression of the Research Mission

The Research Mission section was partially understandable because the participant already knew the project context from building it.

They believed a true outsider would have substantially less context and would need more guidance.

Requested improvements included:

- a simple explanation of what a “research mission” is;
- an example mission;
- example/helper text in the input;
- clearer notes explaining what the user is trying to accomplish; and
- guidance that disappears or gets out of the way once the user begins typing.

**Interpretation:** The current mission form assumes too much prior knowledge.

### 3. Search experience

The spoken response to the keyword-versus-semantic-search question was partially unclear in transcription.

The supported takeaway is that the participant still wanted clearer guidance around what information to enter into search and why.

No stronger conclusion about keyword versus semantic preference is recorded here because the answer was not clear enough to support it.

### 4. Evidence inspection

The participant responded positively to the evidence/source presentation and believed the sources looked like legitimate research records.

The exact ranking of which metadata fields mattered most was not clearly captured in the spoken answer.

Later trust feedback indicates that seeing recognizable source information and documents that looked like real research records contributed materially to confidence in the workflow.

### 5. Main confusion point

This was the clearest usability issue in the walkthrough.

After manually accepting the desired evidence, the participant expected there to be an obvious next action.

Instead, they reached the accepted-evidence state and asked, in effect:

> What do I do next? Where is the summary?

The application was technically in the correct state: it was waiting for a WebMCP-enabled agent to create the evidence brief.

However, the page did not explain that handoff clearly enough.

**Interpretation:** The largest first-time UX gap is the transition from **human evidence selection** to **agent synthesis**.

### 6. WebMCP understanding

The session itself showed that WebMCP became easier to understand once it was made visible through Chrome.

The participant:

- enabled Chrome's WebMCP testing support;
- discovered the five tools;
- successfully invoked `get_research_workspace`; and
- then saw a WebMCP write update the visible application.

The technical mechanism became much more concrete when the page changed as a result of a WebMCP tool call rather than a human click.

### 7. Aha moment

A specific verbal answer was not cleanly captured, so this record does not assign a definitive “aha moment” to the participant.

The strongest observed candidate from the session was the point where the evidence brief appeared in the shared UI through WebMCP and the activity ledger then showed the collaboration sequence.

That moment made the architecture visible:

**human selects evidence → agent drafts → human edits/reviews/approves**

### 8. Human versus agent roles

The full walkthrough demonstrated a clear structural separation:

**Human controls**
- the mission;
- evidence acceptance/rejection;
- evidence removal;
- editing;
- review; and
- final approval.

**Agent controls**
- structured research retrieval;
- source inspection;
- proposal staging; and
- draft creation.

The participant's later trust comments were consistent with this separation being useful.

### 9. Most compelling feature

No definitive first-person selection was clearly captured for this question.

The session evidence suggests the strongest judge-facing candidates are:

- the brief appearing through WebMCP without DOM actuation; and
- the visible activity trail showing human → agent → human control.

This remains a Phase 3 demo-story decision rather than a settled human finding.

### 10. Missing UX guidance

The participant consistently identified the interface and explanation layer as the least-finished part of the product.

The page needs to teach the user what happens next rather than requiring prior WebMCP knowledge.

Potential Phase 3 solutions to evaluate include:

- a visible workflow/progress sequence;
- stronger empty-state guidance;
- a “Ready for agent synthesis” state after evidence acceptance;
- example/copyable agent prompts; and
- simple visual explanation of human versus agent responsibilities.

These are UX hypotheses to test, not automatically authorized implementation requirements.

### 11. Trust

The participant reported that the workflow felt trustworthy.

The main reason was that the evidence looked recognizably connected to legitimate source records rather than appearing as an unsupported AI answer.

The accepted-evidence presentation and visible source information contributed to the feeling that the output was grounded.

The participant described the result as looking “very trustworthy” in their initial assessment.

### 12. Judge perspective

The participant believed the current product still needs substantial judge-facing communication work.

They specifically called out:

- marketing/presentation;
- UI;
- UX;
- clearer explanation of what is happening; and
- potentially using imagery so a new user can understand the concept without reading a large amount of text.

**Interpretation:** The product should be understandable in under a minute without a builder standing beside the judge explaining the architecture.

### 13. Real-world usefulness

The participant can imagine using the workflow outside the competition.

The immediate use case is AI/cybersecurity research associated with an active hacking-competition/research workflow.

The participant believes that if the system is useful for that research context, the general pattern could extend to other kinds of research and data as well.

### 14. Overall assessment

**Strongest:**
- the underlying idea;
- the fact that the architecture actually worked technically; and
- the potential usefulness of the human-agent research model.

**Weakest / least finished:**
- interface simplicity;
- first-time comprehensibility;
- marketing/explanation;
- imagery; and
- overall UI/UX.

The participant explicitly described the current interface as complex and not yet simple to understand.

## Primary findings

### Finding 1 — Technical completion is not UX completion

Phase 2B can be technically correct while a first-time user still does not know how to progress through the workflow.

### Finding 2 — The human → agent handoff is the highest-priority UX problem

After accepted evidence exists, the application needs to make the next step unmistakable:

> the evidence set is ready; now ask a WebMCP-enabled agent to synthesize it.

### Finding 3 — The product should teach WebMCP through the workflow

Users should not need to understand the WebMCP specification before understanding the product.

The interface should demonstrate:

1. human defines;
2. agent researches/proposes;
3. human accepts;
4. agent synthesizes;
5. human approves.

### Finding 4 — Provenance materially improves perceived trust

Recognizable source records, accepted evidence, source identity, and visible human approval made the workflow feel more trustworthy than an unsupported generated answer.

### Finding 5 — The strongest Phase 3 work is clarity, not capability

The participant did not identify a missing provider, model, database, or research capability as the main weakness.

The main weakness was communication and UX.

## Phase 3 implications to evaluate

These should be treated as hypotheses for the Phase 3 judge-readiness audit:

1. Add a highly visible workflow indicator: **Define → Agent researches → Human accepts → Agent synthesizes → Human approves**.
2. Improve Research Mission helper/example text.
3. Improve empty states so they explain both current state and next action.
4. When accepted evidence exists but no brief exists, show a clear **Ready for agent synthesis** state.
5. Consider copyable example prompts for the next agent action.
6. Explain human versus agent responsibilities near the top of the experience.
7. Use clean imagery/screenshots/visual cues where they reduce reading burden.
8. Design the final judge path so the WebMCP value can be understood in under one minute.
9. Preserve the visible provenance and activity trail because they support trust and explain the collaboration model.
10. Avoid adding major product capabilities unless the Phase 3 audit identifies a material functional gap.

## Evidence-quality note

Several spoken answers were partially garbled by dictation/transcription. This record intentionally does **not** invent or complete unsupported answers. Where an answer was unclear, that limitation is stated and only the supported takeaway is preserved.

## Recommended disposition

Use this document as the first human UX input to the Phase 3 judge-readiness review.

Do not treat it as a final usability study, formal experiment, or post-project AAR.

A fuller AAR should be completed after the challenge submission is frozen, when technical, UX, submission, judging, and competition-process lessons can be assessed together.
