# WebMCP Research Workbench — Dogfood Ledger V0

**Project:** WebMCP Research Workbench<br>
**Date:** 2026-08-29<br>
**Purpose:** Preserve a factual, chronological record of hands-on product use before the WebMCP Challenge submission.<br>
**Current V0 canonical merge:** `7b3b500529c08c2c35d51a50228d088d802cdd83`<br>
**Public production:** `https://webmcp-research-workbench.vercel.app/`<br>
**Status:** V0 product frozen for submission; further observations are triaged rather than automatically converted into product changes.

---

## Why this ledger exists

The team deliberately began dogfooding the product in the same environment intended for the demo: ChatGPT Work on Windows, with the WebMCP Research Workbench open beside the agent.

The goal was not simply to prove that the code passed tests. The goal was to learn:

- whether a human could understand whose turn it was without remembering the implementation;
- whether a browser agent could perform useful research through structured WebMCP tools;
- whether human authority boundaries remained obvious during real use;
- whether voice could replace copy/paste as the primary human-agent interface;
- whether the finished artifact could flow naturally into the user's next task;
- which issues were true product blockers versus normal polish or future-roadmap ideas.

This ledger records those observations without pretending that every friction point deserves an immediate code change.

---

# Classification

Each observation is classified as one of:

- **Demo blocker** — prevents a reliable, understandable demonstration and can justify reopening frozen product code.
- **Demo/script insight** — changes what should be said, shown, or practiced in the video.
- **Submission/repository insight** — belongs in README, Devpost, screenshots, architecture explanation, or judge-facing evidence.
- **Post-submission backlog** — a legitimate product improvement that should not delay the current submission.
- **Expected behavior** — initially surprising behavior that is correct once the architecture is understood.

---

# Session 1 — Voice-first preview rehearsal

**Approx. time:** 2:07 PM–2:12 PM EDT<br>
**Environment:** Windows ChatGPT Work + Vercel preview<br>
**Primary interaction:** Voice / natural language<br>
**Research topic:** Indirect prompt-injection risks in browser-based AI agents and evidence-supported mitigations<br>
**Audience:** Technical AI-security team<br>
**Evidence limit:** 3 sources

## Human instruction

The human asked the agent to:

1. establish the research mission;
2. use the Workbench's WebMCP tools;
3. search and inspect candidate sources;
4. propose the best bounded evidence set;
5. stop when it became the human's turn to curate.

## Agent behavior observed

The agent:

- established the mission;
- searched in keyword and semantic modes;
- inspected multiple candidates;
- proposed three sources;
- stopped at **Curate — Your Turn**;
- did not accept evidence or synthesize before human review.

After the human accepted the evidence, the agent:

- drafted the memorandum using the accepted evidence;
- stopped at **Approve — Your Turn**;
- left review and approval to the human.

## Representative sources proposed

- EIA / Environmental Injection Attack
- Task Shield
- Adaptive Attacks Break Defenses

## What worked

- Voice was sufficient to express the research intent.
- The human did not need to memorize tool names or a rigid command grammar.
- The agent respected the stop-at-human-review boundary.
- The Research Cycle became much easier to understand when used in a real conversation.
- The product's human/agent alternation became visible rather than merely conceptual.

## Friction discovered

### A. Copy-prompt-first presentation felt unnatural
The product still visually emphasized copied agent prompts even though natural voice interaction worked better.

**Classification:** Demo blocker / UX friction at the time<br>
**Action taken:** Fixed before V0 freeze. Agent turns were reframed as conversational-first, while keeping **Copy example instruction** as a fallback.

### B. Final review controls were ambiguous
The human encountered multiple adjacent actions/statuses equivalent to:

`Save human edits | Reviewed | Approved`

The required order was not immediately obvious.

**Classification:** Demo blocker / UX friction at the time<br>
**Action taken:** Fixed before V0 freeze. The final flow became progressive:

`Save human edits → Mark reviewed → Approve brief → Research complete`

### C. Completion handoff lacked an immediate local ending
After approval, it was not obvious enough that the workflow was complete or where to retrieve the artifact.

**Classification:** Demo blocker / UX friction at the time<br>
**Action taken:** Fixed before V0 freeze. Approval now exposes an immediate **Research complete** state with Download/Copy actions.

## Key lesson

**The primary human interface to the agent should be intent, not a copied prompt.**<br>
The copied example remains useful onboarding, but the natural voice path better demonstrates the value of structured browser capabilities.

---

# Session 2 — Blank-Work launch rehearsal and deployment mismatch

**Approx. time:** 3:30 PM–3:39 PM EDT<br>
**Environment:** Blank Windows ChatGPT Work session<br>
**Primary interaction:** Voice / natural language<br>
**Research topic:** Same AI-security topic for repeatability

## Test objective

Start from an empty Work session with no site pre-opened and ask the agent to:

- open the Workbench beside the chat;
- establish the mission;
- perform the research;
- stop for human review.

This tested whether the demo could begin with human intent rather than a pre-staged browser.

## What happened

The human dictated a long Vercel preview URL.

The deployment-specific URL returned a Vercel failure/404 from the agent's navigation path, so the agent opened the public production address instead.

At that moment production still contained the older pre-HUD build.

## Agent behavior observed

The agent successfully:

- opened the public production site;
- configured the mission;
- researched and proposed three sources;
- stopped at Curate;
- later synthesized from accepted evidence;
- produced and downloaded an approved Markdown artifact.

## What worked

- A blank Work session was a stronger starting point than a pre-opened webpage.
- Voice could launch the site and initiate the entire workflow.
- The agent was resilient enough to recover from the awkward deployment URL and find the public site.
- The approved artifact could be downloaded into the user's normal filesystem workflow.

## Friction / lessons

### A. Temporary preview URLs are poor voice interfaces
Long deployment URLs are difficult to dictate naturally and can introduce navigation errors.

**Classification:** Demo/script insight<br>
**Disposition:** Final demo should use the short public production URL. A custom subdomain such as `research.<domain>` is a potential presentation improvement, but not required for V0.

### B. Old production interface appeared
The run displayed the large old Research Cycle/WebMCP surfaces because the new reviewed commits had not yet been merged/deployed to production.

**Classification:** Deployment-state misunderstanding, not product regression<br>
**Disposition:** Resolved by merging reviewed commits and deploying canonical production.

### C. Human asked agent to accept evidence on the human's behalf
The human verbally authorized the agent to accept the three proposals.

That was technically explicit authorization, but it weakened the cleanest judge-facing story:

> Agent proposes. Human decides.

**Classification:** Demo/script insight<br>
**Disposition:** In the final recording, the human should personally accept/reject evidence in the visible Workbench.

## Key lesson

**The strongest demo starts from blank Work, but the human should visibly perform the decisions that define the product's authority boundary.**

---

# Session 3 — Fresh production dogfood after V0 release

**Approx. time:** 4:59 PM–5:11 PM EDT<br>
**Environment:** Windows ChatGPT Work + frozen public production<br>
**Production:** `https://webmcp-research-workbench.vercel.app/`<br>
**Primary interaction:** Voice + deliberate human UI decisions

## Test objective

Verify the released V0 end-to-end in the intended presentation environment.

## Initial discovery: prior workspace persisted

On opening production, the agent discovered that the same browser profile already contained a completed prior run for the same topic.

The agent did **not** erase it automatically. It explained that reset would remove the mission, proposals, accepted evidence, and brief, and requested permission.

The human explicitly authorized the reset.

## What worked

### A. Reset respected human authority
The agent asked before destructive reset.

**Classification:** Expected behavior / positive trust-boundary evidence

### B. New unified HUD was present
The released product showed the compact bottom-right controls:

- **RESEARCH CYCLE**
- **WEBMCP**

The HUD remained available while the user worked in lower sections of the page.

### C. Progressive review flow was clear
The human moved through:

1. **Review the saved draft**
2. **Mark reviewed**
3. **Review complete**
4. **Approve brief**
5. **Research complete**

### D. Completion was immediate
After approval, the Evidence Brief area showed:

- **Research complete**
- **Download approved brief (.md)**
- **Copy approved brief**

The HUD simultaneously showed:

- **Complete · Approved**
- WebMCP usage/call summary

### E. Approved artifact integrated into the next workflow
The human asked the agent to download the approved Markdown brief.

The agent downloaded and verified the exact approved artifact, then opened it beside the chat for continued review.

This demonstrated that the output was not trapped inside the app.

## Friction / lessons

### A. Same-browser state persists between rehearsals
The Workbench intentionally stores workspace state in browser local storage.

This means the **same browser profile** can reopen the prior mission.

It does **not** mean judges on different devices/browsers share state.

**Classification:** Expected behavior + demo-preflight issue<br>
**Disposition:** Reset the workspace before recording. Do not auto-delete user work.

### B. Automatic reset after download would be destructive
A possible idea was to wipe the workspace automatically after the Markdown artifact is downloaded.

That would surprise users and weaken the explicit-human-authority design.

**Classification:** Rejected design idea<br>
**Disposition:** Do not auto-reset on download.

### C. Explicit "Start new research mission" could be useful later
A completion-state CTA could offer an explicit reset/new-mission path with confirmation.

**Classification:** Post-submission backlog<br>
**Disposition:** Consider in V1 if repeated real use justifies it.

### D. Expanded HUD could look more translucent
The collapsed HUD solves the visibility problem, but the expanded panels still look more like opaque application cards than a glass HUD.

**Classification:** Aesthetic/post-submission polish<br>
**Disposition:** Do not reopen V0 solely for translucency.

### E. Full dark-mode redesign is not justified now
Dark UI might make translucent overlays visually easier, but it would create major design/accessibility/testing scope.

**Classification:** Post-submission design exploration<br>
**Disposition:** Explicitly out of scope for V0.

### F. Copy example instruction was barely noticed
During natural voice use, the human did not need the fallback prompt.

**Classification:** Positive signal<br>
**Disposition:** Leave it secondary. This is evidence that the conversational-first hierarchy is working.

---

# Cross-session findings

## 1. Voice changed the product understanding

The most important dogfood discovery was that WebMCP does not require the human to think in terms of tool invocation or copy/paste prompts.

The human can express intent conversationally while the website provides:

- structured tools;
- visible workflow state;
- explicit human-authority gates;
- inspectable evidence;
- a durable approved artifact.

This moved the demo thesis from:

> "Here is a website with agent tools."

to:

> "I can tell an agent what research I want, watch structured browser operations happen, intervene only where human judgment is required, and leave with an approved artifact."

---

## 2. The clean authority story is now obvious

Best demo behavior:

### Human
- defines the mission;
- accepts/rejects evidence;
- edits/reviews/approves the final brief.

### Agent
- reads the workspace;
- searches;
- inspects sources;
- proposes evidence;
- synthesizes accepted evidence;
- can help retrieve the final artifact.

### WebMCP
- provides structured access to the Workbench rather than requiring screen scraping or imitation of human clicks.

---

## 3. Persistence is useful, but demo preflight matters

Browser-local persistence protects users from accidental refresh/reopen loss.

For recording:

1. reset workspace;
2. verify empty state;
3. close/reopen as needed;
4. begin from a fresh Work conversation;
5. use the public production URL.

Persistence should be explained as browser-local, not multi-user.

---

## 4. Product code should no longer be the default response to friction

After V0 freeze, dogfood observations are triaged first.

Only a genuine demo blocker should reopen product code.

Everything else should feed:

- the video;
- README;
- Devpost;
- judge-facing screenshots;
- architecture explanation;
- future roadmap.

---

# Current dogfood status

**Successful end-to-end voice workflows:** 3<br>
**Production V0 end-to-end dogfood after freeze:** 1<br>
**Human authority boundaries exercised:** Yes<br>
**Approved Markdown artifact produced/downloaded:** Yes<br>
**Structured five-tool WebMCP flow exercised:** Yes<br>
**Persistent browser state observed:** Yes<br>
**Destructive reset required explicit human permission:** Yes<br>
**Current demo blocker identified:** None<br>
**Current product-freeze status:** Maintain freeze

---

# Next dogfood plan

Perform 2–3 additional fast rehearsals using related but non-identical AI-security missions.

Recommended examples:

1. **Adaptive defenses**
   > What recent evidence shows which prompt-injection defenses for tool-using agents remain effective under adaptive attacks?

2. **Untrusted web content**
   > What recent research shows about security risks to browser agents from untrusted web content, and which engineering controls have empirical support?

3. **Agent authorization**
   > What evidence exists on constraining browser or tool-using agents so untrusted content cannot silently redirect high-impact actions?

For each run record:

- mission;
- start/end time;
- sources proposed;
- WebMCP calls;
- human decision points;
- artifact outcome;
- friction;
- classification;
- whether a code change is actually warranted.

---

# Submission implications

The dogfood record supports several judge-facing claims:

- the product was exercised in the intended agent/browser environment, not only unit tested;
- voice interaction emerged through real use rather than being artificially scripted into the product;
- human authority boundaries were repeatedly tested;
- destructive workspace reset remained consent-gated;
- the research artifact could be exported and reused outside the app;
- the team deliberately rejected automatic state deletion and late-stage visual redesigns when they would weaken trust or increase scope;
- design changed in response to observed human friction, then was frozen when the remaining issues became presentation/backlog rather than blockers.

---

# V0 conclusion

The first formal dogfood cycle materially improved both the product and the understanding of how to present it.

The most important lesson was not a new feature.

It was the realization that the Workbench works best as a **structured collaboration surface between a conversational agent and a human decision maker**:

**Human intent → agent research → human evidence judgment → agent synthesis → human approval → reusable artifact.**
