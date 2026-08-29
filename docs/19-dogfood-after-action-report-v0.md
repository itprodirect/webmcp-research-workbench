# WebMCP Research Workbench — Dogfood After-Action Report V0

**Project:** WebMCP Research Workbench<br>
**Report date:** 2026-08-29<br>
**Scope:** Initial Windows ChatGPT Work dogfood cycle leading into WebMCP Challenge submission<br>
**Canonical V0 merge:** `7b3b500529c08c2c35d51a50228d088d802cdd83`<br>
**Public demo:** `https://webmcp-research-workbench.vercel.app/`<br>
**Disposition:** Product V0 remains frozen for submission.

---

# Executive summary

The initial dogfood cycle changed the team's understanding of the WebMCP Research Workbench more than the deterministic test suite did.

The application was originally approached as a structured research website with copyable agent instructions. Repeated use inside Windows ChatGPT Work revealed a stronger interaction model:

> The human expresses intent conversationally.<br>
> The agent performs structured research through WebMCP.<br>
> The Workbench makes workflow state and tool execution visible.<br>
> The human intervenes only where judgment and authority are required.<br>
> The result becomes a human-approved artifact that can continue into another workflow.

This was not merely presentation polish. It clarified the product thesis.

Dogfooding also exposed several concrete UX problems—large persistent status surfaces, prompt-copy-first framing, ambiguous final approval controls, and weak completion handoff. Those issues were corrected, independently reviewed, previewed, released, and then frozen.

Later observations such as browser-local persistence and HUD translucency were intentionally **not** converted into immediate code changes because they were expected behavior, demo-preflight concerns, or post-submission polish rather than blockers.

The result is a more disciplined V0 and a much clearer judge-facing story.

---

# 1. What we intended to test

The dogfood sessions were designed to answer practical questions that unit and integration tests could not:

1. Can a human understand the five-stage workflow while actually using it?
2. Can the human work primarily through natural language rather than memorized prompts?
3. Can the agent use structured WebMCP capabilities without the demo feeling like browser automation theater?
4. Do human-only decisions remain clear at the exact moment they matter?
5. Can a completed research artifact leave the Workbench and enter a normal user workflow?
6. Does the interface remain understandable in the split-screen ChatGPT Work environment intended for the final video?
7. Which frictions are important enough to fix before submission, and which should be deferred?

---

# 2. What actually happened

## Phase A — The copy/paste mental model broke down

The first important observation was behavioral:

The human did not naturally want to copy an agent prompt from the website, paste it into Work, wait, return to the site, and repeat.

Once voice was used, the more natural interaction was simply:

> Tell the agent what research is wanted.

That immediately made the site's copy-prompt emphasis feel backwards.

### Decision

Keep deterministic example prompts as onboarding and safety fallbacks, but make natural conversational instruction the primary path.

### Result

Research and Synthesize stages now tell the user to instruct their agent naturally, while **Copy example instruction** remains available when needed.

---

## Phase B — Human authority became clearer through voice

Voice unexpectedly strengthened the human-in-the-loop story.

When copied prompts were the main interaction, the human risked looking like a message courier between two agent-like systems.

With voice, the human contribution became explicit:

- "This is the question I want researched."
- "These are the sources I accept."
- "Continue using only the evidence I accepted."
- "I reviewed and approve this artifact."

The agent handled labor; the human supplied intent and judgment.

### Lesson

The final demo should not maximize agent autonomy for its own sake.

It should maximize **clarity of responsibility**.

---

# 3. UX defects discovered and corrected

## 3.1 Persistent status UI obstructed the long workflow

Earlier versions anchored large workflow/tool-status surfaces in fixed locations or within the Research Cycle section.

During split-screen use this required scrolling or consumed too much space.

### Correction

A unified bottom-right Workbench HUD was introduced:

- Research Cycle status
- WebMCP activity
- one expanded panel at a time
- persistent compact state

### Outcome

The human can remain at the relevant evidence/brief section while still seeing:

- whose turn it is;
- current stage;
- WebMCP tool status.

---

## 3.2 Agent-turn guidance was too prompt-copy-centric

The product treated a copied instruction as though that were the normal interface.

Dogfooding showed that conversational voice was better.

### Correction

Agent stages became conversational-first:

> Tell your agent...

Copied instructions became secondary:

> Copy example instruction

### Outcome

The site supports both expert/natural use and first-time onboarding.

---

## 3.3 Final review controls did not communicate sequence

The initial final state exposed multiple controls/statuses together.

The human could not instantly tell whether all actions had to be pressed or in which order.

### Correction

The flow became progressive:

1. Save human edits
2. Mark reviewed
3. Approve brief
4. Research complete

Unsaved edits block review/approval rather than silently losing changes.

### Outcome

There is one obvious next human action at a time.

---

## 3.4 Approval did not originally feel like completion

A successful approval did not immediately create enough local closure.

### Correction

Approval now yields:

> Research complete<br>
> Your human-approved research artifact is ready.

with:

- Download approved brief (.md)
- Copy approved brief

### Outcome

The user does not need to scroll elsewhere or infer that the workflow is finished.

---

# 4. What did not require a V0 fix

Good dogfooding is partly the discipline to **not** fix everything.

## 4.1 Browser-local persistence

A later production run reopened the previous completed workspace.

At first this looked like a possible multi-user state problem.

It was not.

The Workbench intentionally persists workspace data in the current browser's local storage. Another judge on another browser/device receives a separate local state.

### Why we kept it

Persistence protects a user's in-progress research from refresh/reopen loss.

### Demo implication

Reset the browser workspace before recording.

### Product implication

Long-term accounts/project history could be useful, but are explicitly out of V0 scope.

---

## 4.2 Automatic reset after artifact download

A possible reaction to persistent rehearsal state was:

> Reset the workspace automatically after the Markdown is downloaded.

We rejected this.

### Why

Download does not mean the user is finished inspecting the workspace.

Automatic reset would be surprising and destructive.

It would also weaken the project's explicit human-authorization philosophy.

### Better future option

An explicit, confirmed:

> Start new research mission

action after completion.

---

## 4.3 Dark mode / fully translucent HUD

The expanded HUD could be visually more glass-like.

A dark-mode redesign might make translucency more visually dramatic.

### Why we deferred it

That change would affect:

- global contrast;
- inputs;
- card surfaces;
- status colors;
- accessibility;
- responsive testing;
- screenshots;
- the submission timeline.

The compact HUD already solves the actual usability problem.

### Classification

Post-submission visual exploration, not a V0 blocker.

---

# 5. Deployment lesson discovered through dogfooding

One rehearsal attempted to open a long deployment-specific Vercel preview URL using voice.

The agent could not use that URL cleanly and fell back to the public production address.

At the time, production had not yet received the accepted HUD changes, creating the appearance of a regression.

There was no regression. The wrong deployment was being exercised.

### Lesson

Final demo rehearsals should use the stable public production URL:

`https://webmcp-research-workbench.vercel.app/`

Potential future presentation improvement:

`research.<owned-domain>`

but custom DNS should not become another product phase.

---

# 6. Artifact handoff became part of the product story

The strongest end-state discovered during dogfooding was not merely:

> Approved.

The stronger ending was:

1. human approves the research artifact;
2. agent is asked to download it;
3. exact approved Markdown is verified;
4. the file opens beside the chat;
5. the user can continue reviewing or move it into another project.

This demonstrates that the Workbench produces a useful boundary object between agent research and real work.

The artifact is:

- evidence-linked;
- human-reviewed;
- human-approved;
- portable.

That is a stronger conclusion than simply displaying a finished card in the website.

---

# 7. Human / Agent / WebMCP model after dogfooding

## Human

Responsible for:

- defining the research mission;
- deciding what evidence counts;
- editing conclusions;
- marking review complete;
- granting final approval;
- authorizing destructive reset.

## Agent

Responsible for:

- reading workspace context;
- searching OpenAlex;
- inspecting candidate metadata;
- proposing evidence;
- drafting findings from accepted evidence;
- helping retrieve/organize the approved artifact when explicitly asked.

## WebMCP

Responsible for giving the agent structured application capabilities while keeping the same human-visible workspace as the point of coordination.

The value is not "the agent can click a webpage faster."

The value is:

> the agent can operate against declared structured capabilities while human authority remains visible and enforceable.

---

# 8. Security / trust insights from real use

The AI-security demo topic reinforced the product's architecture.

The system intentionally treats provider material as evidence, not instructions.

Dogfooding reinforced why this matters:

- the agent searches untrusted external content;
- the human chooses which evidence becomes accepted;
- synthesis is constrained to accepted evidence;
- final conclusions require human review and approval.

This makes the demo topic—indirect prompt injection in browser agents—directly relevant to the design philosophy of the Workbench itself.

---

# 9. What may be novel versus what we were initially underusing

## Areas we were initially underusing

### Natural voice
The original interaction model overemphasized copied prompts.

### Blank-Work launch
Pre-opening the website weakened the demonstration. Starting with only Work better shows intent-driven navigation.

### Artifact continuation
Initially, the demo concept ended at approval. Dogfooding revealed that downloading and opening the artifact provides a stronger real-work ending.

## Potentially distinctive usage patterns

### Visible alternating authority
The product does not present "human in the loop" as a vague claim. The Research Cycle visibly alternates ownership.

### Structured tool HUD
WebMCP activity is exposed as operational telemetry without exposing private chain-of-thought.

### Human-approved portable artifact
The final result is not merely a chat answer. It is an evidence-linked, human-approved Markdown artifact.

### Voice + structured browser capabilities
The human can remain conversational while the structured application enforces constraints underneath.

These are the kinds of observations that should be communicated to judges as product lessons, not as claims of industry-wide novelty.

---

# 10. What the final demo should show

## Opening

Start from blank ChatGPT Work.

Voice:

> Open webmcp-research-workbench.vercel.app beside our chat...

Then naturally state the mission, audience, evidence limit, and stop condition.

## Agent research

Allow the agent to work.

Do not narrate every call.

Let the WebMCP HUD show structured operations.

## Curate

Human personally accepts/rejects evidence.

## Synthesize

Human tells the agent to continue using the accepted evidence.

## Approve

Human:

- reviews/edits;
- saves;
- marks reviewed;
- approves.

## Handoff

Human asks agent to download and verify the approved Markdown artifact.

Open the file.

End on the actual reusable artifact.

---

# 11. Demo preflight checklist

Before recording:

- production URL responds;
- browser workspace reset is confirmed;
- Work conversation is fresh;
- microphone works;
- production site is not pre-opened;
- screen layout is ready for Work + browser side-by-side;
- browser zoom is comfortable;
- no unrelated browser tabs/windows are visible;
- Downloads folder is ready;
- one test voice phrase has confirmed microphone input;
- no destructive reset prompt will unexpectedly consume demo time.

---

# 12. Current backlog produced by dogfooding

## Submission-time, non-product work

- judge-first README;
- live demo link prominence;
- demo video;
- strongest screenshots;
- architecture graphic;
- five-tool table;
- challenge-criteria mapping;
- human-authority explanation;
- security/trust-boundary explanation;
- dogfood/AAR evidence;
- Devpost narrative.

## Post-submission product backlog

- explicit "Start new research mission" completion action;
- optional cleaner/custom domain;
- HUD visual experimentation / stronger translucency;
- possible dark-theme exploration;
- project/account history if the product becomes multi-user;
- more formal session/project management;
- additional providers only if justified by future product goals.

---

# 13. Final assessment

The dogfood process succeeded because it did not merely validate what had already been built.

It changed the team's mental model.

The V0 should now be described less as:

> a research website with WebMCP tools

and more as:

> a human-governed research workspace where a conversational agent can discover, inspect, propose, and synthesize through structured WebMCP capabilities, while the human retains control over the mission, evidence set, and final artifact.

The most important result of the first dogfood cycle is therefore not another feature.

It is a clearer answer to:

> **Why should this exist?**

Because high-speed agent research becomes much more useful when the browser workspace exposes structured capabilities **and** makes human judgment, provenance, and approval first-class parts of the workflow.
