# Editable production sources

This directory contains deterministic, editable production sources for the
submission gallery.

- `01-hero-cover.svg` — historical editorial baseline source; retained for
  traceability and no longer rendered to the canonical Asset 01 final
- `02-how-it-works.svg`
- `03-who-does-what.svg`
- `06-webmcp-architecture.svg` — canonical approved validation-secondary Asset 06
- `history/06-webmcp-architecture-original-validation-strip.svg` — superseded
  prominent-validation Asset 06 source; reference only
- `render-media.mjs` — renders the frozen Assets 02 and 03 plus the approved
  validation-secondary Asset 06 to 1500 × 1000 PNGs in `../final/`; it intentionally
  excludes Asset 01
- `build-hero-controlled-redesign.mjs` — builds the selected controlled Hero from
  the real H-01 product crop, retains its review draft/comparison, and promotes an
  identical copy to the canonical Asset 01 final
- `build-asset04-review-bundle.mjs` — composes the selected real Curate screenshot
  into the Asset 04 draft and builds the 01/04/05/06 comparison board
- `validate-media.mjs` — checks dimensions, locked copy, manifest coverage, and the
  exactly-five-tool architecture layer
- `build-screenshot-contact-sheet.mjs` — creates non-destructive dated screenshot
  inventories and contact sheets for human selection
- `build-screenshot-review-assets.mjs` — builds the public-safe shortlist contact
  sheet and the real-screenshot Asset 05 review draft from untouched archive files
- `build-asset06-alternative.mjs` — derives the single validation-secondary Asset
  06 treatment from the archived original without changing technical copy
- `freeze-media-package.mjs` — preserves superseded Asset 06 history once and
  promotes the exact approved Asset 04, 05, and 06 inputs to canonical final paths
- `screenshot-composition-spec.md` — production layout for the two real screenshot
  assets after clean captures exist

The SVG files are explanatory graphics, not product screenshots. Assets 04 and 05
are built only from selected real captures; no placeholder UI source exists.
