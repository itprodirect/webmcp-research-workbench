# Screenshot composition specification

This specification governs deterministic compositions from the selected real
screenshots named in `../screenshots/README.md`. Asset 04 and Asset 05 now have
human-approved final compositions. This specification is retained for provenance
and any explicitly authorized future reconstruction.

## Shared composition rules

- Canvas: 1500 × 1000, 3:2.
- Background: `#F3F2ED`.
- Screenshot crop: retain original pixels and aspect ratio; no generative fill,
  UI repair, content replacement, or fabricated offscreen extension.
- Frame: white surface, 1 px `#D4DCD7` border, 22 px corner radius, restrained
  neutral shadow.
- Annotation style: 3 px rules; green `#145D49` for shared/product facts; human gold
  `#7A4A0A` for human-only actions; agent blue `#3153A4` for agent-originated state.
- Callout type: Arial/Helvetica, 28–32 px minimum; headline 52–60 px.
- Maximum four callouts. Prefer short leader lines and whitespace outside the
  screenshot; do not cover source titles, controls, status labels, or provenance.
- Add a small lower-right label: `REAL PRODUCT · research.itprodirect.com`.
- Never add a fake browser frame, fake cursor, fake click state, or fake WebMCP
  activity.

## Asset 04 — evidence curation

**Headline:** `Human-controlled evidence curation`

Recommended layout:

- headline and one-sentence thesis occupy the upper 150 px;
- real screenshot crop occupies approximately x=80–1420, y=190–920;
- crop should prioritize Research Cycle, Agent Proposals, and Accept / Reject;
- use callouts only when their target is visibly present.

Approved callouts:

1. `Agent proposes evidence` — blue, identifying the populated proposal state.
2. `Human accepts or rejects` — gold, pointing to real controls.
3. `Only accepted sources become evidence` — gold/green, pointing to the accepted
   evidence boundary or its explanatory UI copy.
4. `Research Cycle makes the handoff visible` — green, identifying the real Curate state.

## Asset 05 — approved artifact

**Headline:** `Approved artifact, ready to use`

Recommended layout:

- headline and outcome line occupy the upper 150 px;
- real screenshot crop occupies approximately x=80–1420, y=190–875;
- bottom statement occupies y=905–955;
- crop should prioritize Complete / Approved, ARTIFACT READY, approved brief state,
  and the real Markdown download control.

Approved callouts:

1. `Research cycle complete` — green, pointing to the real completed cycle.
2. `Human-approved artifact` — gold, pointing to the approved brief state.
3. `Download approved brief` — green, pointing to the real `.md` action.
4. `WebMCP activity captured during the workflow` — blue, only when the real HUD or
   activity panel is visible in the source capture.

Required bottom line:

`From mission definition to approved Markdown artifact in one shared workspace`

## Final checks before export

1. Compare the source screenshot to production and confirm it was not altered.
2. Verify every callout lands on a visible real element.
3. Inspect at 25% scale; the headline, state, and primary control must remain clear.
4. Inspect at 100% scale; no private data, broken crop, or annotation overlap.
5. Export sRGB PNG at exactly 1500 × 1000.
6. Record capture date, product URL, mission, and reviewer in the manifest review
   note before changing production status to COMPLETE.
