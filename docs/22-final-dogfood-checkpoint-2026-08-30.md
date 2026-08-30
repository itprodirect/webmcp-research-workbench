# Final Dogfood Checkpoint — 2026-08-30

## Status

- **Product implementation:** CODE COMPLETE PENDING FINAL HUMAN ACCEPTANCE
- **Demo Interaction Model:** NOT YET FROZEN
- **Canonical main:** `5b48d931142ba09a2f0135e404ecad282ddc327b`
- **Primary production:** <https://research.itprodirect.com/>
- **Vercel fallback:** <https://webmcp-research-workbench.vercel.app/>
- **Current validation:** 93/93 tests, lint PASS, build PASS
- **Remaining product gate:** short Windows ChatGPT Work human handoff acceptance

This checkpoint records how the earlier V0 freeze was deliberately reopened in
response to dogfood blockers. Documents 18–21 remain historical records of the
state and decisions accepted at their respective checkpoints; this document does
not rewrite them.

## Progression from the earlier V0 freeze

### Existing checkpoint

[PR #6 — docs checkpoint](https://github.com/itprodirect/webmcp-research-workbench/pull/6)
recorded canonical main before the later dogfood fixes:
`4c521c236a50d25e48729fcd34f0ac75ff144e55`.

### Dogfood blocker 1 — cross-session stale workspace

**Observed:** A new Windows ChatGPT Work interaction could reopen the previous
completed workspace and force reset discussion before a new demo.

**Decision:** Use browser session-scoped persistence rather than durable
`localStorage`.

**PR #7:** Fix demo workspace lifetime across browser sessions

- Head: `4ea0ce266ecebfcf556b4d2e16d35e85bc43902a`
- Merge: `7be04fd54032f23e1e475ef19d8e1afaf88651ee`

**Behavior:**

- same-tab refresh survives;
- a new browser session starts clean;
- legacy `localStorage` is ignored, not deleted; and
- explicit Reset is retained.

**Human dogfood:** PASS.

### Dogfood blocker 2 — false human-edit provenance and review flow

**Observed:** The human made no edits but clicked Save because the UI implied it
was required. That incorrectly recorded a human edit. Mark Reviewed → Approve also
felt disorienting because status changes could remount the long editor.

**PR #8:** Fix human brief save and approval feedback

- Head: `2df78c7dfde8090a0272e95d07476e8b20c40d53`
- Merge: `8608a96d54899f28bbc3537babc6c23bffa11b94`

**Result:**

- clean state shows **All changes saved**;
- **Save changes** is disabled when clean;
- actual changes show **Unsaved changes**;
- successful save shows **Changes saved**;
- a no-op cannot create human-edit provenance;
- real edits still reset review/approval;
- Review → Approve preserves editor continuity; and
- the collaboration log remains truthful.

**Independent Claude review:** ACCEPT — no blockers and no should-fix findings.

**Human dogfood:** PASS.

### Dogfood finding 3 — voice/chat vs Workbench handoff ambiguity

**Observed:** The first-time-user mental model was unclear about whether the next
action belonged in ChatGPT voice/chat or the visible Workbench. Generic heat-pump
examples also did not represent the judge-facing technical product.

**Operational improvement:** The primary custom domain was configured at
<https://research.itprodirect.com/>. The Vercel URL remains the fallback.

**PR #9:** Clarify judge-facing research handoffs

- Head: `f6cf1c26b194a28954c07b3ce0a04a0637ce545d`
- Merge: `d1bbde84df41c488fdebb9840c83bc8a6281c742`

**Result:**

- the judge-facing example changed to adaptive indirect prompt-injection research;
- the offscreen Research Cycle HUD auto-surfaces once per semantic transition;
- manual close is respected until the next transition;
- agent-owned states show **USE CHAT / VOICE**;
- human-owned states show **USE WORKBENCH**;
- Complete shows **ARTIFACT READY**; and
- existing Jump actions are preserved.

**Human dogfood:** Improved substantially, but exposed one remaining perceptual
gap.

### Dogfood blocker 4 — agent activity acknowledgement gap

**Observed:** After the human verbally handed work to the agent, the semantic
workspace stage could take time to change. The agent was working, but the Workbench
could still appear static.

**Key constraint:** The website cannot truthfully know that the human spoke to
ChatGPT. It can truthfully know only when new WebMCP invocation telemetry reaches
the page.

**Decision:** Use real stage-local WebMCP invocation counts.

**PR #10:** Show live WebMCP handoff progress

- First commit: `f50c4d92a44706df44406e9c5abbc3d9dc683890`
- Final amendment: `3bdf3a04968db1343576127ba4d0b3059b64ceef`
- Merge: `5b48d931142ba09a2f0135e404ecad282ddc327b`

**Final agent-stage states:**

Before stage-local WebMCP activity:

- **WAITING FOR AGENT**
- **USE CHAT / VOICE**
- Tell your agent to continue.

After real WebMCP activity:

- **AGENT WORK IN PROGRESS**
- **NO ACTION NEEDED**
- Wait for the Workbench to hand control back.

Human stage:

- **USE WORKBENCH**

Complete:

- **ARTIFACT READY**

**Truthfulness requirements preserved:**

- no fake agent-working state before WebMCP activity;
- historical prior-stage calls cannot activate the next agent stage;
- no private reasoning is exposed;
- same-stage tool activity does not reopen a manually closed HUD; and
- no timers or polling are used.

**Final automated/browser validation:**

- 93/93 tests;
- lint PASS;
- build PASS;
- diff check PASS;
- production handoff smoke PASS; and
- both public production domains returned HTTP 200.

## Dogfood evidence and lessons

These findings are product evidence and operating lessons, not additional code
defects.

### Strong generalization results

The Workbench completed multiple distinct technical research missions:

- indirect prompt injection in browser/tool agents;
- visual/multimodal and automated prompt-injection attacks;
- account-takeover, credential-reuse, and impersonation research; and
- adaptive indirect prompt-injection defenses.

The research engine generalized across these tasks without changing its five-tool
architecture.

### Demo mission selection

The account-takeover run passed the workflow, but its evidence set was older
(2014/2016/2020) and is not recommended as the final judge demo.

The preferred demo family is adaptive indirect prompt injection and browser or
tool-using AI-agent security because it is directly relevant to AI/WebMCP judges,
has stronger recent literature, and naturally demonstrates provenance,
adversarial evidence evaluation, and human/agent collaboration.

### Approved artifact evidence

Do not commit local generated dogfood output files unless separately authorized.
Dogfood successfully produced human-approved Markdown artifacts.

The latest strong artifact was
`indirect-prompt-injection-defenses-under-adaptive-attack.md`. It demonstrated:

- exactly three human-accepted sources;
- accepted-only findings;
- a deliberate visible human edit;
- human review;
- human approval; and
- final Markdown export.

The deliberate demo edit verified that real human changes survive into the
approved artifact.

### Collaboration trail evidence

The latest run recorded this visible, auditable authority sequence:

1. human — mission set
2. agent — proposed source 1
3. agent — proposed source 2
4. agent — proposed source 3
5. human — accepted source 1
6. human — accepted source 2
7. human — accepted source 3
8. agent — drafted brief
9. human — edited brief
10. human — reviewed brief
11. human — approved brief

This is evidence that the authority boundaries are visible and auditable. Do not
add the full trail to the exported Markdown in current V0.

## Demo and runbook lessons

### Domain

`research.itprodirect.com` is now the preferred product URL. Voice transcription
still occasionally misheard IT Pro Direct.

Rehearse the pronunciation “research dot I-T Pro Direct dot com,” or begin the
final recording with the Workbench already open. Opening the URL itself is not the
WebMCP innovation.

### Short conversational turns

The preferred interaction remains:

1. open the site;
2. set the mission;
3. hand Research to the agent;
4. let the human curate;
5. hand Synthesize to the agent;
6. let the human review and approve; and
7. let the human download the approved Markdown.

Avoid one giant initial voice prompt.

### Final artifact command

The dogfood phrase “create the document” caused the external agent to infer
Word/PDF work. Approved Markdown remains the canonical V0 artifact.

Recommended final demo behavior: the human directly clicks **Download approved
brief (.md)**.

Preferred fallback voice instruction:

> The brief is approved. Use the Workbench’s Download approved brief dot M-D
> action to download the exact approved Markdown. Do not create or convert it to
> Word or PDF. Stop after the Markdown is downloaded.

No DOCX/PDF product feature is needed.

### Collaboration timestamps

Timestamps are useful provenance context. Do not add a new export feature now.

Possible post-submission backlog: a compact approval metadata block in the
Markdown or another provenance export.

## Post-submission and explicitly deferred ideas

These items are deferred, not blockers:

- account/project history and authentication;
- durable backend persistence;
- additional research providers;
- additional WebMCP tools;
- dark mode;
- stronger HUD visual/translucency exploration;
- automatic “new mission” UX;
- exported collaboration timestamps or richer provenance metadata;
- Word/PDF conversion; and
- custom domain refinements beyond the current working alias.

## Current disposition

Product implementation:
**CODE COMPLETE PENDING FINAL HUMAN ACCEPTANCE**

Demo Interaction Model:
**NOT YET FROZEN**

Remaining product gate:

A short Windows ChatGPT Work run must verify that a human can understand, without
relying on the written runbook:

1. **WAITING FOR AGENT** → speak/use chat;
2. **AGENT WORK IN PROGRESS** → no action needed;
3. **USE WORKBENCH** → human acts;
4. Synthesize resets to **WAITING FOR AGENT** despite historical Research activity;
5. new Synthesize WebMCP activity becomes **AGENT WORK IN PROGRESS**.

If this passes:

**Demo Interaction Model — HUMAN ACCEPTED / FROZEN**

No additional product work should follow except a genuine release blocker.
