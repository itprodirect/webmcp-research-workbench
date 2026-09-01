# Real screenshot review and capture requirements

The local Windows archive was reviewed before requesting any new capture. The
review covered 134 images from August 27–31 plus project-relevant image locations
on Desktop, Downloads, Documents, the repository, and `C:\tmp`. See
[candidate-review.md](candidate-review.md) and the safe-crop
[candidate contact sheet](candidate-contact-sheet.png).

The archive contains a strong primary-domain approved-artifact capture for Asset
05 and a newly captured current-domain Curate split-screen for Asset 04. Both are
now used in approved final compositions. The selected Asset 04 source is preserved unchanged at
`04-evidence-curation-selected-curate.png`; its archive original remains at
`C:\Users\user\Pictures\Screenshots\Screenshot 2026-09-01 000412.png`.

Do not create these states by editing HTML, browser storage, JavaScript objects,
image pixels, or mock data. Do not redraw UI in a design tool. Capture only a real
workflow state produced by the accepted application.

## Global capture conditions

- URL: `https://research.itprodirect.com/`
- Interface: current accepted Three in the Loop production UI.
- Browser: clean supported browser window at a normal desktop width.
- Zoom: large enough for controls and labels to survive a 1500 × 1000 composition.
- Include only the product viewport; exclude desktop chrome where practical.
- Close notifications, unrelated apps, permission prompts, chat panes with private
  content, developer tools, and download shelves.
- Verify the correct domain before capture.
- Use a public-safe research mission and public OpenAlex evidence.
- Keep the Research Cycle and WebMCP HUD/activity visible when possible, but do not
  shrink the evidence or artifact proof below readable size.
- Preserve every original screenshot unchanged in its archive location. Perform
  crops and annotations in a derived composition only.

## Asset 04 selected capture

Package source:

```text
04-evidence-curation-selected-curate.png
```

The capture satisfies the required visible facts:

1. Research Cycle is at **Curate** / the human-owned curation handoff.
2. **Agent Proposals** is populated with at least two real OpenAlex proposals.
3. At least one proposal visibly includes both **Accept evidence** and **Reject**.
4. The copy or state makes clear that only accepted sources become evidence.
5. WebMCP status/activity is visible if it can remain legible without hiding the
   proposal controls.

The approved final is
`../final/04-human-controlled-evidence-curation.png`. Its crop removes the
Windows taskbar and nonessential top chrome, keeps enough of ChatGPT to prove the
handoff, and makes the live Workbench dominant. No UI pixels are rewritten.

## Asset 05 capture

The selected archive source is:

```text
C:\Users\user\Pictures\Screenshots\Screenshot 2026-08-31 213651.png
```

The approved final is `../final/05-approved-artifact-ready.png`. The retained draft
is byte-identical and exists only for approval traceability.

Required visible facts:

1. Research Cycle is **Complete / Approved** and shows **ARTIFACT READY**.
2. The Evidence Brief is visibly human-approved.
3. **Download approved brief (.md)** is visible and enabled.
4. WebMCP activity is visible if it can remain legible without hiding the approval
   and download proof.
5. The brief and evidence shown are public-safe and match the real completed run.

Recommended real moment: immediately after human approval and before navigating
away or resetting the workspace.

## Rejection criteria

Recapture rather than retouch if a candidate contains:

- an obsolete or non-primary domain;
- private prompts, chats, filenames, names, email addresses, or notifications;
- unrelated desktop or application clutter;
- a visible error, stale workspace, or placeholder content;
- product UI that differs from current production;
- a fabricated status, proposal, evidence item, brief, or download state;
- unreadable browser zoom or text after the intended crop.

After capture, follow
[../source/screenshot-composition-spec.md](../source/screenshot-composition-spec.md).
