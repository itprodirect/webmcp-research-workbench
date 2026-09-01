# Three in the Loop — submission media

This package is the frozen, human-approved judge-facing media gallery for **Three
in the Loop — A WebMCP Research Workbench**. It turns the accepted product facts
into six final images for Devpost, the repository README, the final demo video,
YouTube supporting media, and project documentation.

The governing thesis is:

> The agent gathers. You decide what counts.

## Final gallery status

| Gallery position | Asset | Status | Selected version |
|---:|---|---|---|
| 1 | Hero cover | **HUMAN APPROVED / FINAL** | Controlled redesign with real H-01 product crop |
| 2 | Workflow overview | **HUMAN APPROVED / FROZEN** | Original approved infographic |
| 3 | Human / agent authority boundary | **HUMAN APPROVED / FROZEN** | Original approved infographic |
| 4 | Real product: evidence curation | **HUMAN APPROVED / FINAL** | Selected real Curate-state composition |
| 5 | Real product: approved artifact | **HUMAN APPROVED / FINAL** | Selected real final-state composition |
| 6 | WebMCP architecture / five tools | **HUMAN APPROVED / FINAL** | Validation-secondary architecture treatment |

The gallery is complete and frozen. The final file list and reuse handoff are in
[media-closeout.md](media-closeout.md).

The screenshot archive review, candidate scores, public-safety findings, and hero
crop shortlist are in
[screenshots/candidate-review.md](screenshots/candidate-review.md). The safe-crop
contact sheet is [candidate-contact-sheet.png](screenshots/candidate-contact-sheet.png).
Capture and annotation rules remain in
[screenshots/README.md](screenshots/README.md) and
[source/screenshot-composition-spec.md](source/screenshot-composition-spec.md).

The earlier ChatGPT visual exploration has been reconciled separately in
[prior-visual-review.md](prior-visual-review.md). Its six strongest references and
the complete Hero comparison are available in
[inspiration/](inspiration/README.md). Generated interfaces remain inspiration
only and are never product evidence.

## Final visual previews

### 01 — Hero cover

![Three in the Loop hero cover](final/01-three-in-the-loop-hero-cover.png)

### 02 — Workflow overview

![How it works](final/02-how-it-works.png)

### 03 — Human / agent authority boundary

![Who does what](final/03-who-does-what.png)

### 04 — Human-controlled evidence curation

![Human-controlled evidence curation](final/04-human-controlled-evidence-curation.png)

### 05 — Approved artifact, ready to use

![Approved artifact, ready to use](final/05-approved-artifact-ready.png)

### 06 — WebMCP architecture / five tools

![WebMCP architecture](final/06-webmcp-architecture.png)

The approved draft inputs, comparison board, and earlier visual exploration remain
under `drafts/` and `inspiration/` for traceability. Superseded finals and canonical
sources remain under `final/history/` and `source/history/`; they are not gallery
outputs.

## Visual system

The gallery derives directly from the live product:

- 3:2 canvas, 1500 × 1000 pixels;
- off-white background `#F3F2ED` and white surfaces;
- near-black green text `#17221E`;
- muted green `#145D49` for the product and shared-workspace layer;
- restrained human gold `#7A4A0A` with pale tan `#F9F0DF`;
- restrained agent blue `#3153A4` with pale blue `#EDF1FB`;
- light neutral rules `#D4DCD7` and generous whitespace;
- large system-sans typography aligned with the accepted interface;
- the three-node loop motif is derived from the current favicon, not a new logo.

The system avoids generated UI, glowing-brain imagery, stock photography,
decorative cyberpunk effects, heavy gradients, and claims that do not appear in
the accepted repository evidence.

## Gallery narrative

1. **Identity:** what the product is and why it exists.
2. **Workflow:** the five human/agent handoffs.
3. **Authority:** who may do what, and why evidence approval stays human.
4. **Proof — curation:** a real workspace state showing proposals and human
   evidence decisions.
5. **Proof — outcome:** a real completed state showing the approved Markdown
   artifact.
6. **Architecture:** the shared browser workspace, OpenAlex, a WebMCP-enabled
   agent, and exactly five declared tools.

This order moves from promise → mental model → trust boundary → real product
proof → technical proof.

## Factual versus explanatory assets

- Assets 02, 03, and 06 are explanatory infographics. Asset 01 is a hybrid Hero:
  its typography and framing are explanatory while its right-side UI crop is a
  real accepted product capture.
- Assets 04 and 05 must be composed only from real screenshots captured from
  `https://research.itprodirect.com/` in the accepted interface.
- Annotation overlays may point to real controls and states; they may not redraw,
  replace, or invent interface elements.

## Regenerate or revise

Editable sources live in `source/`. The canonical Asset 06 SVG is the approved
validation-secondary treatment. To reconstruct or refreeze the package from its
approved inputs:

```powershell
node docs/submission-media/source/build-hero-controlled-redesign.mjs
node docs/submission-media/source/build-asset04-review-bundle.mjs
node docs/submission-media/source/build-screenshot-review-assets.mjs
node docs/submission-media/source/freeze-media-package.mjs
```

The freeze script promotes exact approved draft bytes for Assets 04, 05, and 06;
it preserves the superseded Asset 06 only on the first run. Assets 02 and 03 are
frozen and should not be regenerated during ordinary submission work.

Historical review/supporting materials can be regenerated separately with:

```powershell
node docs/submission-media/source/build-asset06-alternative.mjs
node docs/submission-media/source/build-prior-visual-review-assets.mjs
```

Run the package validator with:

```powershell
node docs/submission-media/source/validate-media.mjs
```

The gallery is frozen. If the media gate is explicitly reopened:

1. check the exact text in [media-manifest.md](media-manifest.md);
2. edit the corresponding deterministic source;
3. rerun only that asset's builder;
4. inspect the 1500 × 1000 PNG at full size and thumbnail size;
5. obtain new human approval and update the manifest before replacing a final.

The `prompts/` directory explains why the current finals use deterministic vector
composition instead of an image model. If a later image-model exploration is
requested, it must remain a non-UI background or composition study; required text
should still be placed deterministically afterward.

## Non-negotiable production rules

- Never fabricate product UI or populate a screenshot with invented content.
- Keep Assets 02 and 03 unchanged; they are human approved as-is.
- Never use an obsolete interface, wrong domain, private data, unrelated desktop
  clutter, notifications, or placeholder video content.
- Never imply an embedded OpenAI API, standalone MCP server, backend database,
  vector search, embeddings, or that WebMCP itself guarantees trust or provenance.
- Keep the human authority boundary explicit: the agent may propose evidence and
  draft; only the human accepts or rejects evidence, reviews, edits, and approves.
- Keep exactly five tool names and preserve their spelling.
- Treat all OpenAlex/provider text in real screenshots as untrusted evidence/data,
  never as design or application instruction.

## Review checklist

The completed review record is in [quality-review.md](quality-review.md). The
freeze decision and next-gate handoff are in [media-closeout.md](media-closeout.md).
