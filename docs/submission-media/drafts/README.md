# Retained approved inputs and review drafts

These files preserve the approval trail. They are not the canonical gallery
outputs; use the six numbered PNGs in `../final/` for publication.

- `01-hero-controlled-redesign-draft.png` — retained source copy of the
  human-selected Hero direction now promoted to the canonical Asset 01 final.
- `01-hero-comparison-sheet.png` — historical baseline versus selected controlled
  redesign comparison.
- `04-human-controlled-evidence-curation-draft.png` — deterministic 1500 × 1000
  approved input using the untouched selected Curate split-screen preserved at
  `../screenshots/04-evidence-curation-selected-curate.png`; byte-identical final
  is `../final/04-human-controlled-evidence-curation.png`.
- `05-approved-artifact-ready-draft.png` — deterministic 1500 × 1000 composition
  using the untouched real capture
  `C:\Users\user\Pictures\Screenshots\Screenshot 2026-08-31 213651.png`;
  byte-identical final is `../final/05-approved-artifact-ready.png`.
- `06-webmcp-architecture-validation-secondary.svg` and `.png` — approved Asset 06
  inputs. The SVG is byte-identical to the canonical source and the PNG is
  byte-identical to the canonical final.
- `final-review-bundle-01-04-05-06.png` — compact comparison board containing the
  promoted Asset 01, both screenshot drafts, and both Asset 06 treatments.
- `final-review-bundle-01-04-05-06.md` — approval state and remaining decisions.

Regenerate with:

```powershell
node docs/submission-media/source/build-hero-controlled-redesign.mjs
node docs/submission-media/source/build-asset04-review-bundle.mjs
node docs/submission-media/source/build-screenshot-review-assets.mjs
node docs/submission-media/source/build-asset06-alternative.mjs
```

The media gate is closed. Do not revise or promote alternate material without an
explicit new human decision. Original screenshots are never edited or overwritten.
